import { AppEnv } from "../config/env.js";
import { StorageRepository } from "../db/repositories/types.js";
import { computeOpportunity } from "../domain/opportunity.js";
import { computeRisk } from "../domain/risk.js";
import { TokenDecision } from "../domain/types.js";
import { DexScreenerSource } from "../sources/dexScreenerSource.js";
import { isValidSolanaAddress } from "../utils/solana.js";

export interface AnalyzeResult {
  ok: true;
  input: { mint: string };
  decision: TokenDecision;
  score: {
    risk: number;
    opportunity: number;
    confidence: number;
  };
  summary: string;
  warnings: string[];
  positives: string[];
  evidence: string[];
  sources: string[];
  tradeReadiness: {
    enabled: false;
    reason: string;
  };
  createdAt: string;
}

export class AnalyzeService {
  private readonly dexSource = new DexScreenerSource();

  constructor(
    private readonly repo: StorageRepository,
    private readonly env: AppEnv
  ) {}

  validateMintInput(payload: unknown): { ok: true; mint: string } | { ok: false; error: string } {
    if (!payload || typeof payload !== "object") {
      return { ok: false, error: "Request body is required" };
    }

    const body = payload as { mint?: unknown; address?: unknown };
    const raw = (typeof body.mint === "string" ? body.mint : typeof body.address === "string" ? body.address : "").trim();

    if (!raw) {
      return { ok: false, error: "Provide `mint` or `address` in request body" };
    }

    if (!isValidSolanaAddress(raw)) {
      return { ok: false, error: "Invalid Solana mint/address format" };
    }

    return { ok: true, mint: raw };
  }

  async analyzeMint(mint: string): Promise<AnalyzeResult> {
    let warnings: string[] = [];
    const positives: string[] = [];
    const evidence: string[] = [];
    const sources: string[] = [];

    const candidate = await this.dexSource.fetchByTokenAddress(mint);
    if (!candidate) {
      const risk = 70;
      const opportunity = 25;
      const confidence = 20;
      const decision: TokenDecision = "watch";
      const summary = "unknown due to missing source data";
      warnings = ["dexscreener_no_token_data", "high_uncertainty"];
      evidence.push("no_source_data_detected");
      sources.push("dexscreener:token-pairs");

      const saved = this.repo.saveAnalysisReport({
        mint,
        decision,
        riskScore: risk,
        opportunityScore: opportunity,
        confidence,
        summary,
        warnings,
        positives,
        evidence,
        sources
      });

      return {
        ok: true,
        input: { mint },
        decision,
        score: { risk, opportunity, confidence },
        summary,
        warnings,
        positives,
        evidence,
        sources,
        tradeReadiness: {
          enabled: false,
          reason: "Live trading disabled in v1"
        },
        createdAt: saved.createdAt
      };
    }

    const riskResult = computeRisk(candidate, this.env);
    const opportunityResult = computeOpportunity(candidate, this.env);
    let decision: TokenDecision = "watch";

    if (riskResult.hardAvoid) {
      decision = "avoid";
      warnings = [...riskResult.hardAvoidReasons, "high_uncertainty"];
      evidence.push("hard_avoid_triggered");
    } else if (
      riskResult.riskScore <= this.env.MAX_RISK_SCORE &&
      opportunityResult.opportunityScore >= this.env.MIN_OPPORTUNITY_SCORE
    ) {
      decision = "alert";
      positives.push("passed_current_filters", "no_critical_flags_detected", "lower_risk_profile");
      evidence.push("risk_and_opportunity_threshold_pass");
    } else if (riskResult.riskScore > this.env.MAX_RISK_SCORE) {
      decision = "avoid";
      warnings.push("risk_above_threshold", "high_uncertainty");
      evidence.push("risk_threshold_failed");
    } else {
      decision = "watch";
      warnings.push("watch_only", "high_uncertainty");
      evidence.push("insufficient_opportunity_or_uncertainty");
    }

    const confidence = this.estimateConfidence(candidate, riskResult.hardAvoid);
    const summary =
      decision === "alert"
        ? "passed current filters with lower risk profile"
        : decision === "avoid"
          ? "avoid based on current hard-avoid/risk signals"
          : "watch only with high uncertainty";

    sources.push("dexscreener:token-pairs");
    this.repo.upsertToken({
      ...candidate,
      decision,
      evidence: [...new Set([...evidence, ...positives, ...warnings])],
      risk: riskResult,
      opportunity: opportunityResult
    });

    const saved = this.repo.saveAnalysisReport({
      mint,
      decision,
      riskScore: riskResult.riskScore,
      opportunityScore: opportunityResult.opportunityScore,
      confidence,
      summary,
      warnings,
      positives,
      evidence,
      sources
    });

    return {
      ok: true,
      input: { mint },
      decision,
      score: {
        risk: riskResult.riskScore,
        opportunity: opportunityResult.opportunityScore,
        confidence
      },
      summary,
      warnings,
      positives,
      evidence,
      sources,
      tradeReadiness: {
        enabled: false,
        reason: "Live trading disabled in v1"
      },
      createdAt: saved.createdAt
    };
  }

  private estimateConfidence(
    candidate: {
      liquidityUsd: number;
      volume24hUsd: number;
      ageMinutes: number | null;
      priceUsd: number;
    },
    hardAvoid: boolean
  ) {
    let confidence = 35;
    if (candidate.priceUsd > 0) confidence += 10;
    if (candidate.liquidityUsd >= this.env.MIN_LIQUIDITY_USD) confidence += 20;
    if (candidate.volume24hUsd >= this.env.MIN_VOLUME_24H_USD) confidence += 20;
    if (candidate.ageMinutes !== null) confidence += 10;
    if (hardAvoid) confidence += 5;
    return Math.max(10, Math.min(95, confidence));
  }
}

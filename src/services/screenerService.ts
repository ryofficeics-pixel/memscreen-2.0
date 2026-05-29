import { AppEnv } from "../config/env.js";
import { StorageRepository } from "../db/repositories/types.js";
import { computeOpportunity } from "../domain/opportunity.js";
import { computeRisk } from "../domain/risk.js";
import { ScanSummary, ScreenedToken } from "../domain/types.js";
import { BirdEyeSource } from "../sources/birdEyeSource.js";
import { DexScreenerSource } from "../sources/dexScreenerSource.js";
import { TokenSource } from "../sources/types.js";
import { gatherFromSources } from "./sourceAggregator.js";

export class ScreenerService {
  constructor(
    private readonly repo: StorageRepository,
    private readonly env: AppEnv
  ) {}

  private buildSources(): TokenSource[] {
    const sources: TokenSource[] = [];
    if (this.env.BIRDEYE_API_KEY) {
      sources.push(new BirdEyeSource(this.env.BIRDEYE_API_KEY));
    }
    sources.push(new DexScreenerSource());
    return sources;
  }

  getConfiguredSourceNames(): string[] {
    return this.buildSources().map((source) => source.name);
  }

  async runScan(): Promise<{ summary: ScanSummary; screened: ScreenedToken[] }> {
    const runId = `scan-${Date.now()}`;
    const { candidates, statuses } = await gatherFromSources(this.buildSources(), this.env.DEXSCREENER_MAX_TOKENS);

    const screened: ScreenedToken[] = candidates.map((candidate) => {
      const risk = computeRisk(candidate, this.env);
      const opportunity = computeOpportunity(candidate, this.env);

      let decision: "alert" | "watch" | "avoid" = "watch";
      const evidence: string[] = [];

      if (risk.hardAvoid) {
        decision = "avoid";
        evidence.push("hard_avoid_triggered", ...risk.hardAvoidReasons);
      } else if (
        risk.riskScore <= this.env.MAX_RISK_SCORE &&
        opportunity.opportunityScore >= this.env.MIN_OPPORTUNITY_SCORE
      ) {
        decision = "alert";
        evidence.push("passed_current_filters", "no_critical_flags_detected", "lower_risk_profile");
      } else if (risk.riskScore > this.env.MAX_RISK_SCORE) {
        decision = "avoid";
        evidence.push("risk_above_threshold", "high_uncertainty");
      } else {
        decision = "watch";
        evidence.push("watch_only", "high_uncertainty");
      }

      return {
        ...candidate,
        risk,
        opportunity,
        decision,
        evidence
      };
    });

    const alertsCount = screened.filter((token) => token.decision === "alert").length;
    const watchCount = screened.filter((token) => token.decision === "watch").length;
    const avoidCount = screened.filter((token) => token.decision === "avoid").length;

    for (const token of screened) {
      this.repo.upsertToken(token);
      if (token.decision === "alert" || token.decision === "watch") {
        this.repo.upsertWatchlist(token.address, token.decision === "alert" ? "auto-added from alert" : "auto-watch");
      }
    }

    this.repo.recordSourceStatuses(statuses);

    const summary: ScanSummary = {
      runId,
      totalCandidates: screened.length,
      alertsCount,
      watchCount,
      avoidCount,
      sourceStatuses: statuses
    };

    this.repo.saveScan(summary);

    return { summary, screened };
  }
}

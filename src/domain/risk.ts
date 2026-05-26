import { AppEnv } from "../config/env.js";
import { isValidSolanaAddress } from "../utils/solana.js";
import { RiskResult, TokenCandidate } from "./types.js";

export function computeRisk(candidate: TokenCandidate, env: AppEnv): RiskResult {
  let riskScore = 0;
  const flags: string[] = [];
  const hardAvoidReasons: string[] = [];

  if (!isValidSolanaAddress(candidate.address)) {
    hardAvoidReasons.push("invalid_solana_address");
  }

  if (candidate.liquidityUsd < env.MIN_LIQUIDITY_USD / 2) {
    hardAvoidReasons.push("critical_low_liquidity");
  } else if (candidate.liquidityUsd < env.MIN_LIQUIDITY_USD) {
    riskScore += 20;
    flags.push("low_liquidity");
  }

  if (candidate.volume24hUsd < env.MIN_VOLUME_24H_USD / 3) {
    hardAvoidReasons.push("critical_low_volume");
  } else if (candidate.volume24hUsd < env.MIN_VOLUME_24H_USD) {
    riskScore += 15;
    flags.push("low_volume");
  }

  const abs5m = Math.abs(candidate.priceChange5m);
  if (abs5m > 80) {
    hardAvoidReasons.push("extreme_5m_volatility");
  } else if (abs5m > 40) {
    riskScore += 14;
    flags.push("high_5m_volatility");
  }

  const abs1h = Math.abs(candidate.priceChange1h);
  if (abs1h > 120) {
    riskScore += 16;
    flags.push("extreme_1h_move");
  } else if (abs1h > 70) {
    riskScore += 9;
    flags.push("high_1h_volatility");
  }

  if (candidate.ageMinutes === null) {
    riskScore += 10;
    flags.push("unknown_age");
  } else if (candidate.ageMinutes < 3) {
    hardAvoidReasons.push("too_new_under_3m");
  } else if (candidate.ageMinutes < 15) {
    riskScore += 15;
    flags.push("very_new_token");
  }

  if (!candidate.symbol || candidate.symbol.length > 14) {
    riskScore += 6;
    flags.push("symbol_quality_risk");
  }

  if (candidate.fdvUsd > 0 && candidate.liquidityUsd > 0) {
    const fdvToLiq = candidate.fdvUsd / candidate.liquidityUsd;
    if (fdvToLiq > 200) {
      riskScore += 12;
      flags.push("fdv_liquidity_imbalance");
    }
  }

  if (typeof candidate.top10HolderPct === "number" && candidate.top10HolderPct > 65) {
    riskScore += 20;
    flags.push("holder_concentration");
  }

  riskScore = Math.max(0, Math.min(100, riskScore));

  return {
    riskScore,
    flags,
    hardAvoid: hardAvoidReasons.length > 0,
    hardAvoidReasons
  };
}

import { AppEnv } from "../config/env.js";
import { OpportunityResult, TokenCandidate } from "./types.js";

export function computeOpportunity(candidate: TokenCandidate, env: AppEnv): OpportunityResult {
  let opportunityScore = 0;
  const reasons: string[] = [];

  if (candidate.liquidityUsd >= env.MIN_LIQUIDITY_USD * 2) {
    opportunityScore += 20;
    reasons.push("strong_liquidity");
  } else if (candidate.liquidityUsd >= env.MIN_LIQUIDITY_USD) {
    opportunityScore += 10;
    reasons.push("acceptable_liquidity");
  }

  if (candidate.volume24hUsd >= env.MIN_VOLUME_24H_USD * 2) {
    opportunityScore += 24;
    reasons.push("high_volume");
  } else if (candidate.volume24hUsd >= env.MIN_VOLUME_24H_USD) {
    opportunityScore += 12;
    reasons.push("acceptable_volume");
  }

  if (candidate.priceChange5m > 3 && candidate.priceChange5m < 40) {
    opportunityScore += 12;
    reasons.push("positive_short_momentum");
  }

  if (candidate.priceChange1h > 5 && candidate.priceChange1h < 80) {
    opportunityScore += 18;
    reasons.push("positive_hourly_momentum");
  }

  if (candidate.ageMinutes !== null) {
    if (candidate.ageMinutes >= 10 && candidate.ageMinutes <= 720) {
      opportunityScore += 18;
      reasons.push("tradable_age_window");
    } else if (candidate.ageMinutes > 2880) {
      opportunityScore -= 8;
      reasons.push("older_token_reduced_upside");
    }
  }

  if (candidate.fdvUsd > 0 && candidate.liquidityUsd > 0) {
    const ratio = candidate.fdvUsd / candidate.liquidityUsd;
    if (ratio >= 3 && ratio <= 60) {
      opportunityScore += 10;
      reasons.push("fdv_liquidity_balance_ok");
    }
  }

  opportunityScore = Math.max(0, Math.min(100, opportunityScore));

  return {
    opportunityScore,
    reasons
  };
}

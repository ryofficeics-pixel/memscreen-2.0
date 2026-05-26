import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env.js";
import { computeOpportunity } from "../src/domain/opportunity.js";
import { computeRisk } from "../src/domain/risk.js";
import { TokenCandidate } from "../src/domain/types.js";

const env = loadEnv();

function makeCandidate(overrides: Partial<TokenCandidate> = {}): TokenCandidate {
  return {
    address: "So11111111111111111111111111111111111111112",
    symbol: "TEST",
    name: "Token Test",
    source: "unit",
    priceUsd: 0.01,
    liquidityUsd: 50000,
    volume24hUsd: 120000,
    priceChange5m: 8,
    priceChange1h: 20,
    fdvUsd: 400000,
    ageMinutes: 45,
    ...overrides
  };
}

describe("risk scoring", () => {
  it("marks invalid address as hard avoid", () => {
    const risk = computeRisk(makeCandidate({ address: "bad" }), env);
    expect(risk.hardAvoid).toBe(true);
    expect(risk.hardAvoidReasons).toContain("invalid_solana_address");
  });

  it("keeps risk low for stronger profile", () => {
    const risk = computeRisk(makeCandidate(), env);
    expect(risk.hardAvoid).toBe(false);
    expect(risk.riskScore).toBeLessThanOrEqual(env.MAX_RISK_SCORE);
  });
});

describe("opportunity scoring", () => {
  it("gives higher score for good liquidity and momentum", () => {
    const score = computeOpportunity(makeCandidate(), env);
    expect(score.opportunityScore).toBeGreaterThan(50);
  });

  it("reduces score for weak profile", () => {
    const score = computeOpportunity(
      makeCandidate({
        liquidityUsd: 2000,
        volume24hUsd: 1000,
        priceChange5m: -5,
        priceChange1h: -20,
        ageMinutes: 5000
      }),
      env
    );
    expect(score.opportunityScore).toBeLessThan(40);
  });
});

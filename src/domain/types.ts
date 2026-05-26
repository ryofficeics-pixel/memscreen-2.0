export interface TokenCandidate {
  address: string;
  symbol: string;
  name: string;
  source: string;
  priceUsd: number;
  liquidityUsd: number;
  volume24hUsd: number;
  priceChange5m: number;
  priceChange1h: number;
  fdvUsd: number;
  ageMinutes: number | null;
  pairUrl?: string;
  holders?: number | null;
  top10HolderPct?: number | null;
}

export interface RiskResult {
  riskScore: number;
  flags: string[];
  hardAvoid: boolean;
  hardAvoidReasons: string[];
}

export interface OpportunityResult {
  opportunityScore: number;
  reasons: string[];
}

export type TokenDecision = "alert" | "watch" | "avoid";

export interface ScreenedToken extends TokenCandidate {
  risk: RiskResult;
  opportunity: OpportunityResult;
  decision: TokenDecision;
  evidence: string[];
}

export interface SourceStatus {
  sourceName: string;
  ok: boolean;
  latencyMs: number;
  errorMessage?: string;
  tokenCount: number;
  checkedAt: string;
}

export interface ScanSummary {
  runId: string;
  totalCandidates: number;
  alertsCount: number;
  watchCount: number;
  avoidCount: number;
  sourceStatuses: SourceStatus[];
}

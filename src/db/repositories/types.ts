import { ScanSummary, ScreenedToken, SourceStatus, TokenDecision } from "../../domain/types.js";

export interface WatchlistEntry {
  tokenAddress: string;
  status: "watching" | "approved" | "rejected";
  notes: string;
  addedAt: string;
  lastUpdated: string;
}

export interface AlertEntry {
  id: number;
  tokenAddress: string;
  decision: TokenDecision;
  message: string;
  evidence: string[];
  status: "new" | "approved" | "rejected";
  channel: string;
  createdAt: string;
}

export interface DashboardSnapshot {
  totals: {
    tokensTracked: number;
    watching: number;
    alertsNew: number;
  };
  latestScans: ScanSummary[];
  topCandidates: ScreenedToken[];
  recentAlerts: AlertEntry[];
  recentSources: SourceStatus[];
}

export interface SourceHealthSnapshot {
  name: string;
  enabled: boolean;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  lastLatencyMs: number;
  lastError: string | null;
}

export interface AnalysisReportRecord {
  id: number;
  mint: string;
  decision: TokenDecision;
  riskScore: number;
  opportunityScore: number;
  confidence: number;
  summary: string;
  warnings: string[];
  positives: string[];
  evidence: string[];
  sources: string[];
  createdAt: string;
}

export interface StorageRepository {
  init(): void;
  dbHealthCheck(): { ok: boolean; details: string };
  upsertToken(token: ScreenedToken): void;
  saveScan(summary: ScanSummary): void;
  recordSourceStatuses(statuses: SourceStatus[]): void;
  saveAnalysisReport(report: Omit<AnalysisReportRecord, "id" | "createdAt">): AnalysisReportRecord;
  saveSetting(key: string, value: string): void;
  listTokens(limit: number, decision?: TokenDecision): ScreenedToken[];
  upsertWatchlist(address: string, notes: string): WatchlistEntry;
  updateWatchlistStatus(address: string, status: "watching" | "approved" | "rejected"): void;
  listWatchlist(): WatchlistEntry[];
  createAlert(token: ScreenedToken, message: string, channel: string): number;
  listAlerts(limit: number): AlertEntry[];
  updateAlertStatus(id: number, status: "approved" | "rejected"): void;
  recordApproval(alertId: number, chatId: string, username: string, action: "approve" | "reject"): void;
  getDashboardSnapshot(): DashboardSnapshot;
  listSourceStatuses(limit: number): SourceStatus[];
  getSourceHealth(sourceNames: string[]): SourceHealthSnapshot[];
  getTableCounts(tableNames: string[]): Record<string, number>;
}

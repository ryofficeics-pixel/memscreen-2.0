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

export interface StorageRepository {
  init(): void;
  upsertToken(token: ScreenedToken): void;
  saveScan(summary: ScanSummary): void;
  recordSourceStatuses(statuses: SourceStatus[]): void;
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
}

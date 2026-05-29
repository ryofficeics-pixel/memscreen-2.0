import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { ScanSummary, ScreenedToken, SourceStatus, TokenDecision } from "../../domain/types.js";
import { AnalysisReportRecord, SourceHealthSnapshot, StorageRepository, WatchlistEntry } from "./types.js";

function normalizeDbPath(raw: string): string {
  return raw.startsWith("sqlite://") ? raw.replace("sqlite://", "") : raw;
}

function nowIso() {
  return new Date().toISOString();
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export class SQLiteRepository implements StorageRepository {
  private readonly db: Database.Database;

  constructor(databaseUrl: string) {
    const filePath = path.resolve(normalizeDbPath(databaseUrl));
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    this.db = new Database(filePath);
    this.db.pragma("journal_mode = WAL");
  }

  init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT NOT NULL UNIQUE,
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        last_source TEXT NOT NULL,
        first_seen TEXT NOT NULL,
        last_seen TEXT NOT NULL,
        latest_price_usd REAL NOT NULL,
        latest_liquidity_usd REAL NOT NULL,
        latest_volume_24h_usd REAL NOT NULL,
        latest_price_change_5m REAL NOT NULL,
        latest_price_change_1h REAL NOT NULL,
        latest_fdv_usd REAL NOT NULL,
        latest_age_minutes REAL,
        last_risk_score REAL NOT NULL,
        last_opportunity_score REAL NOT NULL,
        last_decision TEXT NOT NULL,
        last_flags_json TEXT NOT NULL,
        last_reasons_json TEXT NOT NULL,
        last_evidence_json TEXT NOT NULL,
        pair_url TEXT
      );

      CREATE TABLE IF NOT EXISTS scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        total_candidates INTEGER NOT NULL,
        alerts_count INTEGER NOT NULL,
        watch_count INTEGER NOT NULL,
        avoid_count INTEGER NOT NULL,
        source_summary_json TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS source_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_name TEXT NOT NULL,
        ok INTEGER NOT NULL,
        latency_ms INTEGER NOT NULL,
        error_message TEXT,
        token_count INTEGER NOT NULL,
        checked_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS watchlist (
        token_address TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        notes TEXT NOT NULL,
        added_at TEXT NOT NULL,
        last_updated TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token_address TEXT NOT NULL,
        decision TEXT NOT NULL,
        message TEXT NOT NULL,
        evidence_json TEXT NOT NULL,
        status TEXT NOT NULL,
        channel TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS approvals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alert_id INTEGER NOT NULL,
        chat_id TEXT NOT NULL,
        username TEXT NOT NULL,
        action TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mint TEXT NOT NULL,
        decision TEXT NOT NULL,
        risk_score REAL NOT NULL,
        opportunity_score REAL NOT NULL,
        confidence REAL NOT NULL,
        summary TEXT NOT NULL,
        warnings_json TEXT NOT NULL,
        positives_json TEXT NOT NULL,
        evidence_json TEXT NOT NULL,
        sources_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kind TEXT NOT NULL,
        ref_id TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS source_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_name TEXT NOT NULL,
        ok INTEGER NOT NULL,
        latency_ms INTEGER NOT NULL,
        error_message TEXT,
        payload_json TEXT NOT NULL,
        checked_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
  }

  dbHealthCheck(): { ok: boolean; details: string } {
    try {
      this.db.prepare("SELECT 1").get();
      return { ok: true, details: "sqlite_ok" };
    } catch (error) {
      return { ok: false, details: error instanceof Error ? error.message : "sqlite_health_error" };
    }
  }

  upsertToken(token: ScreenedToken): void {
    const existing = this.db.prepare("SELECT first_seen FROM tokens WHERE address = ?").get(token.address) as
      | { first_seen: string }
      | undefined;
    const firstSeen = existing?.first_seen ?? nowIso();

    this.db
      .prepare(
        `INSERT INTO tokens (
          address,symbol,name,last_source,first_seen,last_seen,
          latest_price_usd,latest_liquidity_usd,latest_volume_24h_usd,
          latest_price_change_5m,latest_price_change_1h,latest_fdv_usd,
          latest_age_minutes,last_risk_score,last_opportunity_score,last_decision,
          last_flags_json,last_reasons_json,last_evidence_json,pair_url
        ) VALUES (
          @address,@symbol,@name,@last_source,@first_seen,@last_seen,
          @latest_price_usd,@latest_liquidity_usd,@latest_volume_24h_usd,
          @latest_price_change_5m,@latest_price_change_1h,@latest_fdv_usd,
          @latest_age_minutes,@last_risk_score,@last_opportunity_score,@last_decision,
          @last_flags_json,@last_reasons_json,@last_evidence_json,@pair_url
        )
        ON CONFLICT(address) DO UPDATE SET
          symbol=excluded.symbol,
          name=excluded.name,
          last_source=excluded.last_source,
          last_seen=excluded.last_seen,
          latest_price_usd=excluded.latest_price_usd,
          latest_liquidity_usd=excluded.latest_liquidity_usd,
          latest_volume_24h_usd=excluded.latest_volume_24h_usd,
          latest_price_change_5m=excluded.latest_price_change_5m,
          latest_price_change_1h=excluded.latest_price_change_1h,
          latest_fdv_usd=excluded.latest_fdv_usd,
          latest_age_minutes=excluded.latest_age_minutes,
          last_risk_score=excluded.last_risk_score,
          last_opportunity_score=excluded.last_opportunity_score,
          last_decision=excluded.last_decision,
          last_flags_json=excluded.last_flags_json,
          last_reasons_json=excluded.last_reasons_json,
          last_evidence_json=excluded.last_evidence_json,
          pair_url=excluded.pair_url`
      )
      .run({
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        last_source: token.source,
        first_seen: firstSeen,
        last_seen: nowIso(),
        latest_price_usd: token.priceUsd,
        latest_liquidity_usd: token.liquidityUsd,
        latest_volume_24h_usd: token.volume24hUsd,
        latest_price_change_5m: token.priceChange5m,
        latest_price_change_1h: token.priceChange1h,
        latest_fdv_usd: token.fdvUsd,
        latest_age_minutes: token.ageMinutes,
        last_risk_score: token.risk.riskScore,
        last_opportunity_score: token.opportunity.opportunityScore,
        last_decision: token.decision,
        last_flags_json: JSON.stringify(token.risk.flags),
        last_reasons_json: JSON.stringify(token.opportunity.reasons),
        last_evidence_json: JSON.stringify(token.evidence),
        pair_url: token.pairUrl ?? null
      });
  }

  saveScan(summary: ScanSummary): void {
    this.db
      .prepare(
        "INSERT INTO scans (run_id,created_at,total_candidates,alerts_count,watch_count,avoid_count,source_summary_json) VALUES (?,?,?,?,?,?,?)"
      )
      .run(
        summary.runId,
        nowIso(),
        summary.totalCandidates,
        summary.alertsCount,
        summary.watchCount,
        summary.avoidCount,
        JSON.stringify(summary.sourceStatuses)
      );

    this.db
      .prepare("INSERT INTO snapshots (kind,ref_id,payload_json,created_at) VALUES (?,?,?,?)")
      .run("scan_summary", summary.runId, JSON.stringify(summary), nowIso());
  }

  recordSourceStatuses(statuses: SourceStatus[]): void {
    const stmt = this.db.prepare(
      "INSERT INTO source_status (source_name,ok,latency_ms,error_message,token_count,checked_at) VALUES (?,?,?,?,?,?)"
    );
    const stmtLog = this.db.prepare(
      "INSERT INTO source_logs (source_name,ok,latency_ms,error_message,payload_json,checked_at) VALUES (?,?,?,?,?,?)"
    );
    const tx = this.db.transaction((rows: SourceStatus[]) => {
      for (const s of rows) {
        stmt.run(s.sourceName, s.ok ? 1 : 0, s.latencyMs, s.errorMessage ?? null, s.tokenCount, s.checkedAt);
        stmtLog.run(
          s.sourceName,
          s.ok ? 1 : 0,
          s.latencyMs,
          s.errorMessage ?? null,
          JSON.stringify(s),
          s.checkedAt
        );
      }
    });
    tx(statuses);
  }

  saveAnalysisReport(report: Omit<AnalysisReportRecord, "id" | "createdAt">): AnalysisReportRecord {
    const createdAt = nowIso();
    const result = this.db
      .prepare(
        `INSERT INTO reports
         (mint,decision,risk_score,opportunity_score,confidence,summary,warnings_json,positives_json,evidence_json,sources_json,created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)`
      )
      .run(
        report.mint,
        report.decision,
        report.riskScore,
        report.opportunityScore,
        report.confidence,
        report.summary,
        JSON.stringify(report.warnings),
        JSON.stringify(report.positives),
        JSON.stringify(report.evidence),
        JSON.stringify(report.sources),
        createdAt
      );

    const id = Number(result.lastInsertRowid);
    return {
      id,
      mint: report.mint,
      decision: report.decision,
      riskScore: report.riskScore,
      opportunityScore: report.opportunityScore,
      confidence: report.confidence,
      summary: report.summary,
      warnings: report.warnings,
      positives: report.positives,
      evidence: report.evidence,
      sources: report.sources,
      createdAt
    };
  }

  saveSetting(key: string, value: string): void {
    this.db
      .prepare(
        "INSERT INTO settings (key,value,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at"
      )
      .run(key, value, nowIso());
  }

  listTokens(limit: number, decision?: TokenDecision): ScreenedToken[] {
    const rows = decision
      ? this.db.prepare("SELECT * FROM tokens WHERE last_decision = ? ORDER BY last_seen DESC LIMIT ?").all(decision, limit)
      : this.db.prepare("SELECT * FROM tokens ORDER BY last_seen DESC LIMIT ?").all(limit);
    return rows.map((row) => this.rowToToken(row as Record<string, unknown>));
  }

  upsertWatchlist(address: string, notes: string): WatchlistEntry {
    const existing = this.db
      .prepare("SELECT token_address FROM watchlist WHERE token_address = ?")
      .get(address) as { token_address: string } | undefined;
    if (existing) {
      this.db.prepare("UPDATE watchlist SET notes = ?, last_updated = ? WHERE token_address = ?").run(notes, nowIso(), address);
    } else {
      this.db
        .prepare("INSERT INTO watchlist (token_address,status,notes,added_at,last_updated) VALUES (?,?,?,?,?)")
        .run(address, "watching", notes, nowIso(), nowIso());
    }
    return this.rowToWatchlist(
      this.db.prepare("SELECT * FROM watchlist WHERE token_address = ?").get(address) as Record<string, unknown>
    );
  }

  updateWatchlistStatus(address: string, status: "watching" | "approved" | "rejected"): void {
    this.db.prepare("UPDATE watchlist SET status = ?, last_updated = ? WHERE token_address = ?").run(status, nowIso(), address);
  }

  listWatchlist(): WatchlistEntry[] {
    const rows = this.db.prepare("SELECT * FROM watchlist ORDER BY last_updated DESC").all();
    return rows.map((row) => this.rowToWatchlist(row as Record<string, unknown>));
  }

  createAlert(token: ScreenedToken, message: string, channel: string): number {
    const res = this.db
      .prepare("INSERT INTO alerts (token_address,decision,message,evidence_json,status,channel,created_at) VALUES (?,?,?,?,?,?,?)")
      .run(token.address, token.decision, message, JSON.stringify(token.evidence), "new", channel, nowIso());
    return Number(res.lastInsertRowid);
  }

  listAlerts(limit: number) {
    const rows = this.db.prepare("SELECT * FROM alerts ORDER BY created_at DESC LIMIT ?").all(limit) as Record<string, unknown>[];
    return rows.map((row) => ({
      id: Number(row.id),
      tokenAddress: String(row.token_address),
      decision: String(row.decision) as TokenDecision,
      message: String(row.message),
      evidence: parseJson<string[]>(String(row.evidence_json ?? "[]"), []),
      status: String(row.status) as "new" | "approved" | "rejected",
      channel: String(row.channel),
      createdAt: String(row.created_at)
    }));
  }

  updateAlertStatus(id: number, status: "approved" | "rejected"): void {
    this.db.prepare("UPDATE alerts SET status = ? WHERE id = ?").run(status, id);
  }

  recordApproval(alertId: number, chatId: string, username: string, action: "approve" | "reject"): void {
    this.db
      .prepare("INSERT INTO approvals (alert_id,chat_id,username,action,created_at) VALUES (?,?,?,?,?)")
      .run(alertId, chatId, username, action, nowIso());
  }

  getDashboardSnapshot() {
    const tokensTracked = Number((this.db.prepare("SELECT COUNT(*) AS c FROM tokens").get() as { c: number }).c);
    const watching = Number((this.db.prepare("SELECT COUNT(*) AS c FROM watchlist WHERE status = 'watching'").get() as { c: number }).c);
    const alertsNew = Number((this.db.prepare("SELECT COUNT(*) AS c FROM alerts WHERE status = 'new'").get() as { c: number }).c);

    const latestScans = this.db
      .prepare("SELECT * FROM scans ORDER BY created_at DESC LIMIT 10")
      .all()
      .map((row) => {
        const r = row as Record<string, unknown>;
        return {
          runId: String(r.run_id),
          totalCandidates: Number(r.total_candidates),
          alertsCount: Number(r.alerts_count),
          watchCount: Number(r.watch_count),
          avoidCount: Number(r.avoid_count),
          sourceStatuses: parseJson<SourceStatus[]>(String(r.source_summary_json ?? "[]"), [])
        };
      });

    return {
      totals: { tokensTracked, watching, alertsNew },
      latestScans,
      topCandidates: this.listTokens(20),
      recentAlerts: this.listAlerts(20),
      recentSources: this.listSourceStatuses(20)
    };
  }

  listSourceStatuses(limit: number): SourceStatus[] {
    const rows = this.db.prepare("SELECT * FROM source_status ORDER BY checked_at DESC LIMIT ?").all(limit) as Record<string, unknown>[];
    return rows.map((row) => ({
      sourceName: String(row.source_name),
      ok: Boolean(row.ok),
      latencyMs: Number(row.latency_ms),
      errorMessage: row.error_message ? String(row.error_message) : undefined,
      tokenCount: Number(row.token_count),
      checkedAt: String(row.checked_at)
    }));
  }

  getSourceHealth(sourceNames: string[]): SourceHealthSnapshot[] {
    return sourceNames.map((name) => {
      const last = this.db
        .prepare(
          "SELECT source_name, ok, latency_ms, error_message, checked_at FROM source_logs WHERE source_name = ? ORDER BY checked_at DESC LIMIT 1"
        )
        .get(name) as Record<string, unknown> | undefined;

      const lastSuccess = this.db
        .prepare("SELECT checked_at FROM source_logs WHERE source_name = ? AND ok = 1 ORDER BY checked_at DESC LIMIT 1")
        .get(name) as { checked_at: string } | undefined;

      const lastFailure = this.db
        .prepare("SELECT checked_at FROM source_logs WHERE source_name = ? AND ok = 0 ORDER BY checked_at DESC LIMIT 1")
        .get(name) as { checked_at: string } | undefined;

      return {
        name,
        enabled: true,
        lastSuccessAt: lastSuccess?.checked_at ?? null,
        lastFailureAt: lastFailure?.checked_at ?? null,
        lastLatencyMs: Number(last?.latency_ms ?? 0),
        lastError: last?.error_message ? String(last.error_message) : null
      };
    });
  }

  getTableCounts(tableNames: string[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const tableName of tableNames) {
      const row = this.db.prepare(`SELECT COUNT(*) AS c FROM ${tableName}`).get() as { c: number };
      counts[tableName] = Number(row.c ?? 0);
    }
    return counts;
  }

  private rowToWatchlist(row: Record<string, unknown>): WatchlistEntry {
    return {
      tokenAddress: String(row.token_address),
      status: String(row.status) as "watching" | "approved" | "rejected",
      notes: String(row.notes),
      addedAt: String(row.added_at),
      lastUpdated: String(row.last_updated)
    };
  }

  private rowToToken(row: Record<string, unknown>): ScreenedToken {
    return {
      address: String(row.address),
      symbol: String(row.symbol),
      name: String(row.name),
      source: String(row.last_source),
      priceUsd: Number(row.latest_price_usd),
      liquidityUsd: Number(row.latest_liquidity_usd),
      volume24hUsd: Number(row.latest_volume_24h_usd),
      priceChange5m: Number(row.latest_price_change_5m),
      priceChange1h: Number(row.latest_price_change_1h),
      fdvUsd: Number(row.latest_fdv_usd),
      ageMinutes: row.latest_age_minutes === null ? null : Number(row.latest_age_minutes),
      pairUrl: row.pair_url ? String(row.pair_url) : undefined,
      risk: {
        riskScore: Number(row.last_risk_score),
        flags: parseJson<string[]>(String(row.last_flags_json), []),
        hardAvoid: String(row.last_decision) === "avoid",
        hardAvoidReasons: []
      },
      opportunity: {
        opportunityScore: Number(row.last_opportunity_score),
        reasons: parseJson<string[]>(String(row.last_reasons_json), [])
      },
      decision: String(row.last_decision) as TokenDecision,
      evidence: parseJson<string[]>(String(row.last_evidence_json), [])
    };
  }
}

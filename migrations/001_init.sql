-- Idempotent schema bootstrap for local SQLite v1
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

CREATE TABLE IF NOT EXISTS watchlist (
  token_address TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  notes TEXT NOT NULL,
  added_at TEXT NOT NULL,
  last_updated TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

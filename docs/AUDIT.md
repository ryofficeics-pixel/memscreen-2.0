# Repository Audit - Solana Memecoin Screener 2.0

Date: 2026-05-26
Workspace: `C:\Users\user\Documents\screener 2.0`

## Existing stack
- Git repository initialized.
- No application code detected at audit time.
- No package manager lockfile detected.
- No backend/frontend/database/deployment files detected.

## Entry points
- None existed before this implementation pass.

## Current working features (pre-implementation)
- None (empty repo baseline).

## Missing/blocking features
- Backend API: missing.
- Screener pipeline: missing.
- Scoring + hard avoid engine: missing.
- Data source fallback: missing.
- Database schema/repository abstraction: missing.
- Telegram integration + approvals: missing.
- Watchlist + alert engine: missing.
- Dashboard: missing.
- Health/status/audit/deploy docs: missing.

## Security risks (baseline)
- No security middleware/config existed.
- No env validation existed.
- No chat authorization restrictions existed.

## Performance risks (baseline)
- No queue/scheduler existed.
- No source latency logging existed.

## Data-source risks (baseline)
- No data source fallback existed.
- No uncertainty evidence model existed.

## Deployment risks (baseline)
- No runbook or environment template existed.
- No portable startup process existed.

## Files to modify in this implementation
- Create minimal full-stack v1 from zero with strict boundaries:
  - runtime/env/config files
  - backend services/routes/storage abstraction
  - dashboard static UI
  - tests and runbooks

## Files not to touch
- Existing working modules: none existed pre-implementation.
- Secrets and local runtime files (`.env`, SQLite DB) will remain untracked.

## Assumptions
- Node.js >= 20 is available in target environments.
- SQLite is acceptable for v1 with repository abstraction.
- Optional external APIs may be absent; fallback/degrade behavior is required.
- Telegram bot token and allowed chat IDs may be unavailable in early testing.

## Migration plan
1. Build local-first backend with repository abstraction and SQLite adapter.
2. Keep API/service layer storage-agnostic to enable future Postgres/Supabase adapter.
3. Add SQL migration folder and clear schema contracts.
4. Document exact mapping needed for a future Supabase migration.
5. Add deployment runbook with VPS/Railway/Render/Oracle-free options.

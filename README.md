# Solana Memecoin Screener 2.0

Evidence-based Solana memecoin screener with risk/opportunity scoring, hard avoid rules, Telegram approvals, watchlist tracking, and operations dashboard.

## What this system does
- Scans candidate Solana tokens from multiple data sources with fallback.
- Scores each token for risk and opportunity.
- Applies hard avoid rules for obvious high-risk patterns.
- Sends Telegram alerts for candidates that pass filters.
- Supports manual approval/rejection from Telegram and API.
- Maintains watchlist, alert history, source health, and scan evidence.

## What this system does NOT do (v1)
- No live trading.
- No private key handling.
- No seed phrase handling.
- No auto buy/sell execution.

## Quick start
1. Install dependencies:
   - `npm install`
2. Copy env template:
   - `Copy-Item .env.example .env`
3. Update `.env` values (especially Telegram settings).
4. Start dev server:
   - `npm run dev`
5. Open dashboard:
   - `http://localhost:8787/dashboard`

## Scripts
- `npm run dev` - run API in watch mode
- `npm run build` - compile TypeScript
- `npm run start` - run compiled app
- `npm run lint` - run ESLint
- `npm run init:db` - idempotent SQLite schema init
- `npm run check:env` - validate required env and warn on optional unset vars
- `npm run check:health` - validate key local endpoints (requires running app)
- `npm run audit` - repository readiness checks
- `npm run test` - run Vitest tests
- `npm run audit:env` - validate environment and print safe runtime summary

## Key API endpoints
- `GET /health`
- `GET /api/health`
- `GET /api/status`
- `GET /status/sources`
- `POST /scan/run`
- `POST /api/scan/run`
- `POST /api/analyze`
- `GET /tokens?decision=alert|watch|avoid`
- `GET /alerts`
- `GET /watchlist`
- `POST /watchlist`
- `POST /alerts/:id/approve`
- `POST /alerts/:id/reject`
- `GET /dashboard-data`
- `GET /dashboard`

## Deployment
See `docs/DEPLOYMENT_RUNBOOK.md` for VPS/Railway/Render/Oracle Free deployment paths.

## Moving computers
See `NEW_COMPUTER_HANDOFF.md` for the full checklist to clone, restore `.env`, initialize the local database, verify the app, and keep secrets outside git.

## Cloud connections
See `CLOUD_CONNECTIONS.md` for the current GitHub, Supabase, and Vercel connection map.

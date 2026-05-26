# Architecture Notes

## Runtime shape
- Single Node.js service (Fastify + TypeScript).
- SQLite storage for v1 with repository abstraction.
- Static dashboard served by backend at `/dashboard/`.
- Background scheduler loop for periodic scans.
- Telegram bot (optional) for alert delivery and manual approval.

## Core flow
1. Scheduler or `POST /scan/run` triggers scan.
2. Multi-source fetch runs with fallback and per-source latency/error status.
3. Risk and opportunity scores are computed for each candidate.
4. Hard avoid rules are applied.
5. Token is classified as `alert`, `watch`, or `avoid`.
6. Evidence + scores + source status are written to SQLite.
7. `alert` tokens are sent to Telegram when enabled.
8. Manual approvals/rejections are recorded from Telegram or dashboard API.

## Storage abstraction
- `StorageRepository` defines service-layer data access contract.
- `SQLiteRepository` is current adapter.
- Future `PostgresRepository` can be added without changing route/service behavior.

## Security and safety boundaries
- Solana address validation on user-provided watchlist addresses.
- Telegram command access restricted by allowed chat IDs when configured.
- API keys remain backend-only (`.env`).
- Live trading endpoint exists only as disabled boundary (`POST /trade/execute` returns 403).

## Evidence and uncertainty policy
- Alerts state: `passed current filters`, not "safe".
- Decisions include explicit evidence tags and uncertainty language.
- System never claims guaranteed profit.

# Deployment Runbook

## Runtime Targets
- Local dev (primary)
- VPS (Ubuntu + systemd)
- Railway
- Render
- Oracle Free VM

## Required Environment
1. Copy `.env.example` to `.env`
2. Set required values:
   - `DATABASE_URL`
   - `ENABLE_AUTO_SCAN`
   - `SCAN_INTERVAL_SEC`
3. Optional but recommended:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_ALLOWED_CHAT_IDS`
   - `TELEGRAM_DEFAULT_CHAT_ID`
   - `BIRDEYE_API_KEY`

## Local Start
1. `npm install`
2. `npm run dev`
3. Verify:
   - `GET /health`
   - `GET /dashboard`
   - `POST /scan/run`

## VPS (systemd)
1. Install Node.js 20+.
2. Clone repo.
3. `npm install`
4. `npm run build`
5. Create service unit:

```ini
[Unit]
Description=Solana Memecoin Screener
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/solana-screener
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=5
EnvironmentFile=/opt/solana-screener/.env

[Install]
WantedBy=multi-user.target
```

6. `sudo systemctl daemon-reload`
7. `sudo systemctl enable --now solana-screener`

## Railway / Render
- Use Node service runtime.
- Build command: `npm run build`
- Start command: `npm run start`
- Persistent disk required for SQLite, or migrate to Postgres adapter.
- If no persistent disk is available, do not rely on SQLite for durable history.

## Oracle Free VM
- Same flow as VPS.
- Keep DB file on attached volume.
- Put reverse proxy (Nginx/Caddy) in front for TLS.

## Supabase/Postgres migration readiness
- Storage access is abstracted behind repository interfaces.
- Keep route/service contracts unchanged.
- Implement `PostgresRepository` matching `StorageRepository` methods.
- Use existing SQL schema as source mapping for table structure.

## GitHub-first checklist
- Commit all code/docs/config except secrets.
- Never commit `.env`.
- Keep `.env.example` updated.
- Never commit SQLite runtime files.

## Observability checklist
- `/health` must be green.
- `/status/sources` should show recent source checks and latency.
- `alerts` and `approvals` tables must be writable.
- Telegram bot should only respond to allowed chat IDs when configured.

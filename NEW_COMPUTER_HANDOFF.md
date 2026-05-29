# NEW COMPUTER HANDOFF

Use this checklist when moving the project to another computer or rebuilding the workspace from GitHub.

## 1. Required Software

Install these first:

- Git
- Node.js 20 or newer
- npm, included with Node.js
- A code editor, such as VS Code

Check versions:

```powershell
git --version
node --version
npm --version
```

## 2. Clone The Repo

```powershell
git clone https://github.com/ryofficeics-pixel/memscreen-2.0.git
cd memscreen-2.0
```

If the folder name is different, run all commands from the cloned project root.

## 3. Install Dependencies

```powershell
npm install
```

## 4. Recreate Local Environment

Create a new local `.env` from the committed template:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` with the private values for the new machine.

Required or commonly used local values:

```env
NODE_ENV=development
HOST=0.0.0.0
PORT=8787
DATABASE_URL=./data/screener.db
ENABLE_AUTO_SCAN=true
SCAN_INTERVAL_SEC=90
APP_BASE_URL=http://localhost:8787
```

Optional API and integration values:

```env
BIRDEYE_API_KEY=
HELIUS_API_KEY=
ENABLE_TELEGRAM=false
TELEGRAM_BOT_TOKEN=
TELEGRAM_ALLOWED_CHAT_IDS=
TELEGRAM_DEFAULT_CHAT_ID=
TELEGRAM_DRY_RUN_SEND=false
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Important:

- Do not commit `.env`.
- Keep API keys, bot tokens, and service role keys in a password manager.
- DexScreener works without an API key.
- BirdEye requires `BIRDEYE_API_KEY`.
- Telegram alerts require `ENABLE_TELEGRAM=true`, `TELEGRAM_BOT_TOKEN`, and `TELEGRAM_DEFAULT_CHAT_ID`.

## 5. Initialize Local Database

```powershell
npm run init:db
```

The local SQLite database lives under `data/` and is intentionally not committed.

If you need to move historical local data from the old computer, copy these files manually:

- `data/screener.db`
- any matching `data/screener.db-*` files, if present

Only copy database files while the app is stopped.

## 6. Verify The Project

Run the core checks:

```powershell
npm run check:env
npm run lint
npm run test
npm run build
```

Expected current status:

- env validation passes
- lint passes
- tests pass
- build passes

## 7. Start The App

```powershell
npm run dev
```

Open:

```text
http://localhost:8787/dashboard
```

In a second terminal, verify health:

```powershell
npm run check:health
```

## 8. Telegram Dry-Run Check

Safe default:

```powershell
npm run test:telegram
```

By default this should not send a live Telegram message unless `TELEGRAM_DRY_RUN_SEND=true` and the required Telegram env vars are set.

## 9. Safety Rules To Preserve

Current project phase has no live trading.

- `/trade/execute` must remain disabled.
- No private keys or seed phrases should be added.
- No wallet signing flow should be introduced without a separate hardened trading phase.
- Keep `TELEGRAM_DRY_RUN_SEND=false` unless intentionally testing Telegram delivery.

## 10. Before Switching Computers

On the old computer:

```powershell
git status --short
npm run test
npm run build
```

Then commit and push any wanted changes:

```powershell
git add .
git commit -m "Update project handoff state"
git push
```

Also save private values outside git:

- `.env` values
- API keys
- Telegram bot token and chat IDs
- VPS SSH details
- production deployment notes
- optional local SQLite database backup

## 11. After Switching Computers

On the new computer:

```powershell
git pull
npm install
Copy-Item .env.example .env
npm run init:db
npm run check:env
npm run test
npm run build
npm run dev
```

Then open:

```text
http://localhost:8787/dashboard
```

## 12. Known Current Risk

`npm audit --audit-level=moderate` currently reports one moderate issue in `@fastify/static`.

The automated fix is marked as a breaking upgrade, so handle it in a separate branch and rerun:

```powershell
npm run lint
npm run test
npm run build
npm run check:health
```


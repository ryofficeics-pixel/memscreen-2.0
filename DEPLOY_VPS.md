# DEPLOY VPS

## 1. Production target
This deployment target is for:
- 24/7 auto scan
- Telegram alert delivery
- dashboard and status endpoint access
- no live trading execution

`/trade/execute` must remain disabled (`HTTP 403`) in this phase.

## 2. Minimum VPS spec
- Ubuntu 22.04 or 24.04
- 1 vCPU minimum
- 1 GB RAM minimum
- 10 GB disk minimum
- Node.js 20+
- PM2

## 3. Server setup commands
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw build-essential
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 4. Clone repo
```bash
git clone https://github.com/ryofficeics-pixel/memscreen-2.0.git
cd memscreen-2.0
```

## 5. Create .env
```bash
cp .env.production.example .env
nano .env
```

Set required values:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID` (and set `TELEGRAM_DEFAULT_CHAT_ID` to same value for current app compatibility)
- `TELEGRAM_DRY_RUN_SEND` (`false` by default)
- keep `ENABLE_TRADE_EXECUTION=false`

Do not place private keys in `.env`.

## 6. Install and verify
```bash
npm install
npm run check:env
npm run lint
npm run test
npm run build
```

## 7. Start with PM2
```bash
sudo npm install -g pm2
pm2 start npm --name memscreen-2 -- run start
pm2 save
pm2 startup
```

Run the command printed by `pm2 startup` (it needs sudo) and then run `pm2 save` again.

## 8. Health checks
```bash
curl http://127.0.0.1:8787/health
curl http://127.0.0.1:8787/api/health
curl http://127.0.0.1:8787/api/status
```

## 9. Logs
```bash
pm2 logs memscreen-2
pm2 status
pm2 restart memscreen-2
pm2 stop memscreen-2
```

## 10. Firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 8787/tcp
sudo ufw enable
sudo ufw status
```

Exposing port `8787` publicly is acceptable for early testing, but long term use Nginx reverse proxy with tighter access controls.

## 11. Telegram test
```bash
npm run test:telegram
```

Expected behavior:
- If `TELEGRAM_DRY_RUN_SEND=false`, no message is sent.
- If `TELEGRAM_DRY_RUN_SEND=true` and token/chat id are valid, one test message is sent.
- This script never executes trades.

## 12. Update deployment from GitHub
```bash
git pull origin main
npm install
npm run check:env
npm run lint
npm run test
npm run build
pm2 restart memscreen-2
pm2 logs memscreen-2
```

## 13. Rollback basics
```bash
git log --oneline -10
git checkout <previous_commit>
npm install
npm run build
pm2 restart memscreen-2
```

## 14. Safety notes
- Do not enable live trading in this phase.
- Do not place private keys in `.env`.
- Do not commit `.env`.
- Telegram alerts only for this phase.
- Manual review is required before any trading automation phase.

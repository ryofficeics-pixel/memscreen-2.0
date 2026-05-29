# PRODUCTION CHECKLIST

## 1. Before VPS deployment
- [ ] Git repo clean
- [ ] Package scripts verified
- [ ] `.env.production.example` exists
- [ ] `npm install` passes
- [ ] `npm run check:env` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run build` passes
- [ ] No secrets committed
- [ ] `/trade/execute` remains disabled

## 2. Before enabling Telegram live alerts
- [ ] Bot token created
- [ ] Chat ID confirmed
- [ ] Bot has received `/start` from target chat
- [ ] `TELEGRAM_DRY_RUN_SEND` tested intentionally
- [ ] Test message sent successfully
- [ ] Alert format reviewed
- [ ] No trade execution connected

## 3. Before long-running 24/7 operation
- [ ] PM2 running
- [ ] `pm2 save` done
- [ ] `pm2 startup` done
- [ ] Health endpoint reachable
- [ ] Logs checked
- [ ] Scheduler running
- [ ] DexScreener source healthy
- [ ] Uptime monitor configured

## 4. Before future trading phase
NOT ALLOWED YET.

- [ ] Security audit required
- [ ] Wallet strategy required
- [ ] Position sizing rules required
- [ ] Slippage rules required
- [ ] TP/SL rules required
- [ ] Rug/liquidity checks required
- [ ] Manual confirmation flow required
- [ ] Dry-run trading simulator required
- [ ] Kill switch required
- [ ] Private key handling required
- [ ] Separate approval required

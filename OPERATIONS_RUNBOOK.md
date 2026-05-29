# OPERATIONS RUNBOOK

## Local verification
```bash
npm install
npm run check:env
npm run lint
npm run test
npm run build
```

## Start dev
```bash
npm run dev
```

## Run manual scan
```bash
curl -X POST http://127.0.0.1:8787/scan/run \
  -H "Content-Type: application/json" \
  -d "{}"
```

## Check status
```bash
curl http://127.0.0.1:8787/health
curl http://127.0.0.1:8787/api/health
curl http://127.0.0.1:8787/api/status
```

## Test Telegram
```bash
npm run test:telegram
```

## Production start
```bash
npm run build
pm2 start npm --name memscreen-2 -- run start
pm2 save
```

## Production restart
```bash
pm2 restart memscreen-2
```

## Production logs
```bash
pm2 logs memscreen-2
pm2 status
```

## Production update
```bash
git pull origin main
npm install
npm run check:env
npm run lint
npm run test
npm run build
pm2 restart memscreen-2
```

## Emergency stop
```bash
pm2 stop memscreen-2
pm2 delete memscreen-2
```

## Confirm trade lock
```bash
curl -i -X POST http://127.0.0.1:8787/trade/execute \
  -H "Content-Type: application/json" \
  -d '{"token":"TEST","confirmation":"OK","tp":20,"sl":10}'
```

Expected:
- HTTP `403`
- `phase` = `disabled` (or equivalent disabled response)

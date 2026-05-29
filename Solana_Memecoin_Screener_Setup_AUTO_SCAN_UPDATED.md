# Solana Memecoin Screener 2.0 — V2 Auto Scan Setup

This file is a V2 replacement source file.

V2 overrides V1.

Primary behavior:
- The app must run as a 24/7 auto scanner.
- Manual token input is fallback only.
- Telegram is the main operator workflow.
- Dashboard is monitoring/audit/settings/manual fallback.
- Paper trading simulation is allowed.
- Live trading is forbidden by default.

If this file conflicts with `SOLANA_MEMECOIN_SCREENER_2_FULL_CODEX_PROMPT.md`, the V2 full Codex prompt wins.

## Core flow

```text
24/7 scanner
→ discover token/pair candidates
→ normalize
→ deduplicate
→ hard filter
→ enrich data
→ score
→ confidence
→ dynamic simulated TP/SL/trailing
→ store scan result
→ alert Telegram only if threshold passes
→ Telegram action: WATCH / RECHECK / IGNORE / REJECT / PAPER BUY / PREPARE BUY / STATUS
```

## Auto-scan rules

- `SCANNER_ENABLED=true`
- `SCANNER_INTERVAL_SECONDS=60`
- scanner must not block dashboard/API
- external APIs must be throttled
- failed source must degrade gracefully
- every scan must be logged
- every reject must be logged with reason
- alert cooldown required
- max alerts/hour required
- manual check must reuse the same pipeline

## Telegram UX reference

The user previously used:
- https://t.me/achilles_trojanbot as trading-bot UX reference
- https://t.me/+DHqr9hhHxStiMGVl as new-coin notification reference

Use these as reference only:
- compact Telegram alerts
- fast action buttons
- low friction
- user can decide from Telegram
- noisy raw coin alerts must be filtered before reaching the user

Do not integrate, scrape, copy, or depend on those Telegram systems in V2.

## V2 trading boundary

Allowed:
- paper trading
- simulated position
- simulated TP1/TP2/TP3
- simulated stop-loss
- simulated trailing stop
- paper trade audit log
- future disabled trade adapter

Forbidden:
- private key
- wallet signing
- custody
- Jupiter swap execution
- live buy
- live sell
- auto-trading real funds
- third-party Telegram bot execution

Default:
```env
PAPER_TRADING_ENABLED=true
LIVE_TRADING_ENABLED=false
```

## Alert minimum behavior

Telegram alert must include:
- token/pair
- price
- liquidity
- volume
- age
- score
- confidence
- risk flags
- warnings
- missing data
- reason alert was triggered
- simulated TP/SL/trailing if applicable
- source links
- simulation-only wording

Hard reject always blocks alert.

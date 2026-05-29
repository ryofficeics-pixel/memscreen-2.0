# Security & Objectivity Audit — Solana Memecoin Screener 2.0 V2

This file is a V2 replacement source file.

V2 overrides V1.

Audit purpose:
- prevent unsafe live-trading behavior
- prevent private key/custody mistakes
- prevent hype/false confidence
- verify hard filters
- verify Telegram authorization
- verify source integrity
- verify paper trading is simulation only

If this file conflicts with `SOLANA_MEMECOIN_SCREENER_2_FULL_CODEX_PROMPT.md`, the V2 full Codex prompt wins.

## Non-negotiable security rules

Forbidden:
- real buy order
- real sell order
- Jupiter swap execution
- wallet signing
- private key storage
- mnemonic/seed handling
- custody
- Telegram action executing real trade
- live trading through Achilles/Trojan or any third-party bot
- scraping private Telegram channels without explicit future authorization

Required:
- `LIVE_TRADING_ENABLED=false`
- `PAPER_TRADING_ENABLED=true`
- `PAPER BUY` creates simulated position only
- `PREPARE BUY` creates review intent only
- any live execution request must fail safely
- no secret in frontend/API/logs/Telegram
- Telegram allowed chat ID enforcement
- idempotent Telegram callbacks
- audit log for all sensitive actions

## Paper trading safety audit

Check:
- PAPER BUY never calls swap/wallet/signing/private-key code
- PREPARE BUY never executes real trade
- CONFIRM BUY fails safely when live trading disabled
- TP/SL/trailing are simulation events only
- sizing is informational only
- every paper position event is logged
- no private key env variable is required
- no hidden execution path exists

## Objectivity audit

Reject:
- “safe token”
- “guaranteed profit”
- “sure win”
- “target pasti”
- “safe buy”
- hype language
- fabricated holder/security/liquidity data
- unknown data treated as positive
- high-priority alert with low confidence
- momentum overriding critical risk

Required language:
- passed current filters
- no critical flags detected
- simulation only
- confidence low/medium/high
- missing data
- source unavailable
- not guaranteed
- avoid due to critical flag

## Data-source audit

Check:
- source freshness
- source agreement
- missing data penalty
- stale data rejection
- invalid pair/mint rejection
- rate limiting
- retry/backoff
- safe failure mode
- source health logs

## Hard filter audit

Hard reject must override:
- score
- confidence
- TP
- momentum
- Telegram alert

Reject if:
- liquidity too low
- volume too low
- age too young
- invalid mint/pair
- critical rug/security flag
- stale/missing core data
- broken price data
- source conflict severe
- ignored/blacklisted token

## Repository exposure audit

Search for:
- PRIVATE_KEY
- SECRET
- TOKEN
- API_KEY
- SERVICE_ROLE
- PASSWORD
- MNEMONIC
- SEED
- WALLET
- BEARER
- AUTHORIZATION
- DATABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- HELIUS
- BIRDEYE
- TELEGRAM_BOT_TOKEN

Safe auto-resolve:
- harden `.gitignore`
- add `.env.example`
- move config to env
- add startup env validation
- remove fake hardcoded credentials if present

Do not fake cleanup of real leaked credentials. Document human action required.

# SOLANA MEMECOIN SCREENER 2.0 — V2 HARMONIZED MASTER PROMPT

## VERSION CONTROL / SOURCE OF TRUTH

This is V2.

V2 is the latest active specification and overrides all V1 documents, older setup notes, older audit assumptions, older architecture drafts, older partial prompts, and older local-only assumptions.

If there is conflict:
1. V2 wins.
2. Security rules override feature requests.
3. Objectivity rules override hype or prediction language.
4. Hard reject filters override score, confidence, TP, and momentum.
5. Paper trading is allowed only as simulation.
6. Live trading is forbidden by default.
7. No private key, wallet signing, custody, or real swap execution may be implemented in V2.
8. If unclear, implement the safer non-custodial, non-executing version.

Older V1 materials are historical references only. Do not let V1 block, downgrade, or contradict this V2 master prompt unless this V2 prompt explicitly imports the older rule.

---

# ROLE

You are Codex acting as:
- senior full-stack engineer
- backend architect
- security auditor
- crypto data-integrity auditor
- Telegram bot engineer
- production-readiness reviewer
- cautious trading-system designer

Build / update this repository into **Solana Memecoin Screener 2.0**.

---

# PROJECT IDENTITY

Project name:
**Solana Memecoin Screener 2.0**

Core product:
A 24/7 autonomous Solana memecoin scanner that discovers token/pair candidates automatically, filters obvious garbage/rug risks first, scores remaining candidates objectively, sends only meaningful alerts to Telegram, and allows the user to run simulated paper-trading workflows.

The product is NOT:
- a hype bot
- a guaranteed-profit bot
- a blind signal bot
- a live trading bot
- a wallet custody system
- a private-key manager
- a financial advice engine
- a manual-only token checker

Primary user intent:
- The user does not want to manually paste token mints one by one.
- The system must auto-scan continuously.
- Good candidates must be sent to Telegram.
- Telegram must be the main operator workflow.
- Dashboard is for monitoring, settings, audit, history, source health, and fallback manual checks.
- The user wants future one-click trade lifecycle design, but V2 must only implement paper trading and future-safe adapter boundaries.
- Live trading must remain disabled.

---

# USER PRIOR TRADING REFERENCES

The user previously used these Telegram-based memecoin trading/notification workflows as operational references:

## 1. Trading bot reference

- Name/description: Achilles / Trojan-style on-chain Telegram trading bot
- Link: https://t.me/achilles_trojanbot
- Claimed positioning: “The Fastest and Most Advanced On-Chain Trading Bot built to put you in full control.”
- Use as UX/operator-flow reference only.
- Do not copy branding, UI text, proprietary flow, or implementation.
- Do not depend on this bot.
- Do not require integration with this bot in V2.

## 2. New coin notification reference

- Link: https://t.me/+DHqr9hhHxStiMGVl
- Use as reference for the type of raw new-token alerts the user used to monitor.
- Treat this as an external notification/source inspiration only.
- Do not depend on this Telegram group/channel unless the user later explicitly provides export/data/API access.

Purpose:
- Understand the user’s previous behavior pattern.
- Build a Telegram-first operator experience.
- Prioritize speed, compact alerts, fast decision buttons, and minimal friction.
- Improve alert formatting and decision workflow.
- Design the product so the user does not need to manually watch noisy channels all day.
- Replace manual channel-monitoring with automated scanning, filtering, scoring, and structured Telegram alerts.

Important boundary:
These references do NOT override V2 safety rules.

V2 must still enforce:
- auto-scan first
- hard filters before scoring
- objectivity over hype
- no guaranteed profit language
- paper trading only
- no live execution
- no private key
- no wallet signing
- no custody
- no real buy/sell
- all trade-like actions are simulation or review intent only

Design implication:
The app should feel operationally closer to a fast Telegram trading/alert bot, but with stronger filtering, evidence, audit logs, confidence scoring, paper trading simulation, and safety guardrails.

Telegram UX benchmark:
- alert must be compact
- action buttons must be fast
- critical data must be visible without opening dashboard
- user should be able to decide from Telegram
- dashboard is secondary monitoring/audit layer
- noisy low-quality token spam must be filtered out before reaching user

Do not build:
- integration into Achilles/Trojan bot
- dependency on any third-party Telegram trading bot
- scraping private Telegram channels unless explicitly authorized and implemented safely
- automated forwarding from the referenced channel unless later specified
- live trade execution through any external bot

Future V3 optional:
Optional Telegram Channel Ingestion Adapter may be considered later only if:
- user authorized
- official Telegram client/API flow is used safely
- no credential leakage
- rate limits exist
- parser is safe
- dedup token mint/pair exists
- all channel signals still pass hard filter first
- channel signal never becomes direct buy signal

---

# AUTHORITY ORDER

Implementation authority order:
1. This V2 Harmonized Master Prompt.
2. Security and objectivity rules in this prompt.
3. Auto-scan 24/7 operational flow in this prompt.
4. Full Codex build requirements in this prompt.
5. Existing repository code only when it is working and does not conflict with V2.
6. Older V1 docs only as historical context.

Conflict resolution:
- Prefer explicit V2 instructions over implied behavior.
- Prefer deterministic filters over AI scoring.
- Prefer auditability over automation.
- Prefer safe simulation over real execution.
- Prefer source-linked evidence over assumptions.
- Prefer working backend reliability over frontend polish.
- Never invent live trading behavior.
- Never silently skip security requirements.

---

# NON-NEGOTIABLE PRINCIPLES

1. Auto-scan first.
Primary input is 24/7 autonomous scanning. Manual token input is secondary fallback only.

2. Telegram-first operator flow.
The user acts mainly through Telegram alerts and buttons/commands.

3. Hard filters before scoring.
Critical risk flags reject candidates before scoring. Hard rejects override all scores.

4. Evidence-based scoring.
Every score must be explainable from source data, raw refs, warnings, positives, missing data, and confidence.

5. Dynamic TP.
No fixed universal TP. TP levels must adapt to liquidity, volatility, confidence, momentum, age, risk, and data completeness.

6. Paper trading first.
Implement simulated paper trading lifecycle only.

7. Live trading forbidden by default.
No real buy/sell execution. No wallet signing. No private keys. No custody.

8. Future-safe boundary only.
You may create adapter interfaces for future live trading, but they must not execute real trades in V2.

9. Security/objectivity.
No fabricated data. No hype language. No “safe token” claims. No guaranteed profit. No factual price target claim.

10. GitHub-centered workflow.
Repo is source of truth. Do not depend on local drive permanence. All generated files, docs, tests, migrations, and runbooks must live in the repository.

---

# ALLOWED VS FORBIDDEN SCOPE

## Allowed in V2

- 24/7 scanner worker
- token/pair discovery
- candidate normalization
- candidate deduplication
- hard reject filters
- source enrichment
- scoring engine
- confidence engine
- dynamic TP simulation engine
- safe sizing hint engine
- Telegram alert engine
- Telegram action buttons
- watchlist
- ignore list
- cooldown
- paper trading engine
- simulated TP1 / TP2 / TP3
- simulated stop-loss
- simulated trailing stop
- simulated position monitoring
- historical outcome tracking
- trade intent audit logs
- future live-trading adapter interface
- dashboard/API
- audit logs
- source health logs
- deployment/runbook
- tests and quality gates

## Forbidden in V2

- real buy order
- real sell order
- Jupiter swap execution
- wallet signing
- private key storage
- mnemonic/seed handling
- user custody
- auto-buy with real funds
- auto-sell with real funds
- Telegram button triggering real trade
- hidden trading side effects
- claiming a token is safe
- guaranteed profit language
- hype-driven scoring
- exposing secrets in frontend/API/logs/Telegram

Default env:
```env
LIVE_TRADING_ENABLED=false
PAPER_TRADING_ENABLED=true
```

If `LIVE_TRADING_ENABLED=false`:
- `CONFIRM BUY` must fail safely.
- `PREPARE BUY` must only create review intent.
- `PAPER BUY` may create simulated position only.
- TP/SL/trailing must be simulation events only.

---

# TARGET ARCHITECTURE

Recommended stack:
- Node.js
- TypeScript
- Backend service for scanner, scoring, Telegram, worker, and API
- PostgreSQL/Supabase-compatible schema preferred
- SQLite acceptable only as local-first starter if repository abstraction allows clean migration
- Telegram Bot API / Telegraf or current maintained Telegram SDK
- Dashboard optional but useful
- Worker-based architecture

Core backend modules:
- scanner
- discovery adapters
- data adapters
- candidate normalizer
- hard risk filters
- scoring engine
- confidence engine
- dynamic TP engine
- safe sizing hint engine
- Telegram alert engine
- Telegram callback handler
- watchlist service
- ignore list service
- alert cooldown service
- paper trading engine
- trade lifecycle simulator
- simulated position monitor
- database repositories
- audit logger
- source health logger
- dashboard/API
- env validator
- test harness

Data sources:
- DexScreener
- RugCheck or equivalent security source if available
- Jupiter tradability/quote checks where useful
- Solana RPC
- Birdeye if API key configured
- Helius if API key configured
- Additional current public sources if useful and documented

Before implementing external integrations:
- Verify current API routes, response shapes, auth requirements, rate limits, and known breaking changes using current official docs or live checks where available.
- If current docs conflict with memory, trust current docs.
- Document API uncertainty in `docs/DATA_SOURCES.md`.

---

# PRIMARY INPUT MODE / 24-7 AUTO SCANNER

The primary input mode is NOT manual token entry.

The app must operate as a 24/7 autonomous Solana memecoin scanner.

Required primary workflow:

1. Scanner/worker runs continuously or on scheduled interval.
2. System discovers new, trending, or abnormal Solana memecoin pairs automatically.
3. Candidate normalizer cleans and standardizes token/pair data.
4. Deduplication prevents repeated analysis of same token/pair.
5. Hard reject filters remove bad candidates before deeper scoring.
6. Qualified candidates are enriched from external data sources.
7. Risk/scoring engine evaluates the token.
8. Confidence engine calculates confidence and uncertainty.
9. Dynamic TP engine calculates simulated TP/SL/trailing levels.
10. System stores all scan results, including pass/fail reasons.
11. Telegram receives alerts only when token passes configured thresholds.
12. User reviews alert in Telegram and may choose WATCH, RECHECK, IGNORE, REJECT, PAPER BUY, PREPARE BUY, or STATUS.
13. Dashboard shows monitoring, audit trail, source health, settings, scan history, watchlist, ignored tokens, and manual fallback check.
14. Manual token check reuses the same pipeline and cannot bypass validation.

Scanner behavior:
- Run on configurable interval using `SCANNER_INTERVAL_SECONDS`.
- Support enable/disable with `SCANNER_ENABLED=true|false`.
- Default interval: 60 seconds unless impractical.
- Batch and throttle external API calls.
- Avoid uncontrolled all-at-once scans.
- Deduplicate tokens and pairs before analysis.
- Apply cooldown so the same token is not repeatedly alerted.
- Store rejected candidates with rejection reason.
- Store successful candidates with full report and source refs.
- Continue running if optional sources fail.
- Never block dashboard/API usage because scanner is busy.
- Expose scanner status through `/api/status`.
- Log last scanner run, duration, candidates found, candidates analyzed, candidates rejected, alerts sent, failures, and source latency.

Manual input is secondary:
- Dashboard manual token check must remain available.
- Telegram `/check <mint>` must remain available.
- Manual input must reuse same analysis pipeline.
- Manual checks must not bypass validation, risk checks, rate limits, or logging.
- Manual checks are for investigation/debug, not the default product flow.

---

# SCANNER CONFIGURATION

Required env/config placeholders:

```env
SCANNER_ENABLED=true
SCANNER_INTERVAL_SECONDS=60
MAX_CANDIDATES_PER_SCAN=50
MAX_ANALYSES_PER_SCAN=20
MIN_LIQUIDITY_USD=10000
MIN_VOLUME_5M_USD=1000
MIN_VOLUME_1H_USD=25000
MIN_PAIR_AGE_MINUTES=5
MAX_PAIR_AGE_HOURS=72
MIN_TX_COUNT=20
ALERT_SCORE_THRESHOLD=70
ALERT_MIN_SCORE=70
ALERT_MIN_CONFIDENCE=60
ALERT_MIN_LIQUIDITY_USD=10000
ALERT_MIN_VOLUME_1H_USD=25000
ALERT_MIN_VOLUME_5M_USD=1000
ALERT_COOLDOWN_MINUTES=60
MAX_ALERTS_PER_HOUR=10
PAPER_TRADING_ENABLED=true
LIVE_TRADING_ENABLED=false
TELEGRAM_BOT_TOKEN=
TELEGRAM_ALLOWED_CHAT_IDS=
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DEXSCREENER_BASE_URL=
RUGCHECK_BASE_URL=
BIRDEYE_API_KEY=
HELIUS_API_KEY=
SOLANA_RPC_URL=
ADMIN_TOKEN=
NODE_ENV=
```

---

# HARD FILTERS / AUTO-REJECT RULES

Before numeric scoring, apply hard filters.

Reject token if:
- liquidity below configured minimum
- volume below configured minimum
- pair age below configured minimum
- invalid mint or invalid pair
- impossible price movement / broken data
- critical source data failure
- stale data
- price unavailable
- no valid pair
- known rug/security critical flag
- honeypot-like behavior if detectable
- sell disabled / transfer restricted if detectable
- ownership/mint authority dangerous if detectable
- abnormal holder concentration if data available
- liquidity too thin for estimated trade size
- token blacklisted
- suspicious duplicate/spam token name
- source conflict is severe
- fake/missing market data
- token already ignored
- token violates configured blacklist/rules

Hard filters:
- Override score.
- Override TP.
- Override confidence.
- Override momentum.
- Prevent Telegram buy-style alert.
- Candidate may still be stored as rejected with reason.

No token with a critical flag may be alerted as a buy candidate.

Use decision:
- AVOID for critical rejects.
- WAIT for insufficient data.
- WATCH for borderline but trackable candidates.
- POTENTIAL for qualified candidates.
- HIGH_PRIORITY only for strong candidates with sufficient evidence and confidence.

---

# SCORING ENGINE

Calculate finalScore from 0-100.

Suggested weighted components:

```text
finalScore =
  0.25 * safetyScore +
  0.20 * liquidityScore +
  0.15 * volumeScore +
  0.15 * momentumScore +
  0.10 * ageScore +
  0.10 * sourceConfidenceScore +
  0.05 * holderOrDistributionScore
```

If a data source is unavailable:
- Do not fabricate value.
- Mark missing data.
- Reduce confidence.
- Use conservative scoring.
- Show source status.

Required report fields:
- tokenName
- symbol
- mintAddress
- pairAddress
- priceUsd
- liquidityUsd
- volume5mUsd
- volume1hUsd
- volume24hUsd
- pairAgeMinutes
- txCount
- buySellRatio if available
- priceChange5m
- priceChange1h
- priceChange24h
- safetyScore
- liquidityScore
- volumeScore
- momentumScore
- ageScore
- sourceConfidenceScore
- holderDistributionScore if available
- finalScore
- confidenceLevel
- posteriorWinProbability if implemented
- decision
- rejectionReasons
- warnings
- positiveSignals
- missingData
- sourceRefs
- rawDataRefs
- createdAt
- updatedAt

Scoring language:
- Do not say “safe”.
- Use “passed current filters”.
- Use “no critical flags detected”.
- Use “higher risk”.
- Use “lower risk relative to current filters”.
- Use “simulation only”.
- Use “not guaranteed”.

---

# CONFIDENCE ENGINE

Confidence must be separate from score.

Confidence reflects:
- source completeness
- source agreement
- data freshness
- liquidity reliability
- volume reliability
- age sufficiency
- security source availability
- volatility sanity
- missing critical fields
- source latency/failure

Confidence levels:
- LOW
- MEDIUM
- HIGH

Telegram alert requires:
- score >= configured threshold
- confidence >= configured threshold
- no hard reject
- no critical source conflict
- no cooldown violation
- max alerts/hour not exceeded

If score is high but confidence is low:
- decision should be WATCH or WAIT, not HIGH_PRIORITY.
- avoid strong alert formatting.

---

# DYNAMIC TP / SL / TRAILING SIMULATION ENGINE

No fixed universal TP.

TP levels must adapt to:
- confidence
- volatility
- liquidity
- slippage risk
- momentum strength
- age
- volume
- source completeness
- risk flags
- pair maturity
- historical scan outcomes if available

Output:
- tp1Pct
- tp2Pct
- tp3Pct
- stopLossPct
- trailingStopPct
- invalidationReason
- confidenceUsed
- rationale
- simulationOnly=true

Rules:
- Lower confidence = more conservative TP and tighter invalidation.
- Low liquidity = smaller TP expectation and stronger warnings.
- Extreme volatility = wider but riskier TP/SL, with lower confidence.
- Missing data = conservative TP or no TP output.
- Hard reject = no TP output except “not applicable”.
- TP must be framed as simulated levels, not prediction.

Telegram wording:
- “Simulation TP levels”
- “Not guaranteed”
- “Based on current liquidity/volatility/confidence”
- “Invalid if liquidity/volume/risk state changes”

Forbidden wording:
- “guaranteed”
- “safe profit”
- “sure win”
- “target pasti”
- “safe buy”
- “profit pasti”

---

# SAFE SIZING HINT ENGINE

If implemented, sizing is informational only.

Output:
- positionSizeHintPct
- maxRiskHintPct
- reason
- simulationOnly=true

Rules:
- Never recommend actual financial commitment as fact.
- Never auto-size real trades.
- Never connect sizing to real wallet balance.
- Use conservative caps.
- Reduce sizing hint on low confidence, low liquidity, high volatility, or missing data.

---

# TELEGRAM ALERT ENGINE

Telegram receives only meaningful alerts.

Do not send every discovered token.

Alert only when:
- hard filters pass
- score threshold passes
- confidence threshold passes
- cooldown passes
- max alerts/hour not exceeded
- candidate is not ignored
- source data is sufficient

Telegram alert must include:
- token name/symbol if available
- mint address
- pair address if available
- price
- liquidity
- volume
- age
- risk level
- score
- confidence
- decision
- warnings
- positive signals
- missing/uncertain data
- reason alert was triggered
- simulated TP1 / TP2 / TP3 where applicable
- simulated SL/trailing where applicable
- DexScreener link
- RugCheck link if available
- timestamp
- source status summary
- simulation-only disclaimer when paper/trade fields are shown

Required action buttons/commands:
- WATCH
- RECHECK
- IGNORE
- REJECT
- PAPER BUY
- PREPARE BUY
- STATUS

Button behavior:
- WATCH: add token/pair to watchlist.
- RECHECK: rerun same analysis pipeline.
- IGNORE: add to ignored_tokens.
- REJECT: mark as operator rejected.
- PAPER BUY: create simulated paper position only if PAPER_TRADING_ENABLED=true.
- PREPARE BUY: create trade review intent only; no live execution.
- STATUS: show scanner/source/position status.

Telegram security:
- Restrict access using TELEGRAM_ALLOWED_CHAT_IDS.
- Reject unauthorized chat IDs.
- Log unauthorized attempts without leaking secrets.
- Validate callback payload.
- Use idempotency for duplicate callbacks.
- Never crash bot on API failure.
- Never expose internal stack traces.
- Never expose secrets.
- If full analysis is slow, send quick “checking” state then edit/reply with result.

---

# PAPER TRADING ENGINE

Paper trading is allowed in V2 as simulation only.

PAPER BUY creates a simulated position:
- no wallet
- no private key
- no signing
- no Jupiter swap
- no real transaction
- no custody
- no live order

Paper position fields:
- id
- tokenMint
- pairAddress
- symbol
- entryPriceUsd
- simulatedEntryTime
- simulatedSizeUsd
- positionSizeHintPct
- tp1Pct
- tp2Pct
- tp3Pct
- stopLossPct
- trailingStopPct
- status
- sourceReportId
- openedByTelegramChatId
- createdAt
- updatedAt
- closedAt
- closeReason
- realizedPnlPctSimulated
- simulationOnly=true

Paper lifecycle:
1. User clicks PAPER BUY.
2. System revalidates candidate.
3. If still valid, create simulated position.
4. Monitor price from source adapters.
5. Trigger simulated TP1/TP2/TP3 events.
6. Trigger simulated SL/trailing events.
7. Log all lifecycle events.
8. Update Telegram and dashboard.
9. Store final outcome.

Paper trading safety audit:
- PAPER BUY must never call real swap/wallet/signing/private-key code.
- PREPARE BUY must create review intent only.
- CONFIRM BUY must fail safely when LIVE_TRADING_ENABLED=false.
- TP/SL/trailing are simulation events only.
- Paper position sizing is informational only.
- Telegram callbacks must be authorized and idempotent.
- Every paper trade event must be audit logged.
- No module may require private key env variables.

---

# FUTURE LIVE-TRADING BOUNDARY

You may create future-safe interfaces only.

Allowed:
- `TradeAdapter` interface
- `PaperTradeAdapter`
- `DisabledLiveTradeAdapter`
- `tradeReadiness` object
- `tradeIntent` record
- validation pipeline
- audit logs
- disabled live-trading error path

Forbidden:
- actual live trade implementation
- actual Jupiter swap execution
- wallet signing
- private key handling
- custody
- bypassing LIVE_TRADING_ENABLED=false

Required behavior:
- If LIVE_TRADING_ENABLED=false, any live execution request returns safe blocked response.
- Response must explain: live trading disabled, V2 supports simulation only.
- Tests must verify live execution is blocked.

---

# DATABASE / STORAGE

Use repository/service abstraction. Do not scatter raw SQL across unrelated files.

Required tables or equivalent models:
- tokens
- pairs
- scan_runs
- candidates
- reports
- snapshots
- alerts
- watchlist
- ignored_tokens
- source_logs
- settings
- telegram_events
- paper_positions
- paper_position_events
- trade_intents
- audit_logs

Required database behavior:
- migrations exist
- seed/init script exists
- timestamps consistent
- raw source refs stored for auditability
- raw API data stored safely without secrets
- normalized enough for future Postgres/Supabase
- SQLite acceptable locally only if migration path documented

Supabase/Postgres readiness:
- Keep compatible schema naming.
- Avoid SQLite-only assumptions where practical.
- Add env placeholders.
- Document migration notes.

---

# DASHBOARD / API

Dashboard purpose:
- monitoring
- audit
- settings
- source health
- scanner state
- scan history
- alert history
- watchlist
- ignored tokens
- paper positions
- manual fallback check

Dashboard is NOT the main input model.

Dashboard must show:
- scanner enabled/disabled
- last scanner run
- next estimated run
- candidates found
- candidates rejected
- candidates analyzed
- alerts sent
- latest alerts
- watchlist
- ignored tokens
- source health
- source latency
- recent failures
- paper positions
- manual check panel as secondary feature

Required API endpoints or equivalent:
- GET `/api/health`
- GET `/api/status`
- POST `/api/analyze`
- POST `/api/scanner/run`
- GET `/api/scan-runs`
- GET `/api/alerts`
- GET `/api/watchlist`
- POST `/api/watchlist`
- DELETE `/api/watchlist/:id`
- GET `/api/ignored`
- POST `/api/ignored`
- GET `/api/paper-positions`
- POST `/api/paper-positions`
- POST `/api/paper-positions/:id/close`
- GET `/api/source-logs`
- GET `/api/settings`
- POST `/api/settings`

API security:
- validate input
- reject invalid Solana addresses
- rate limit analyze endpoints
- admin protect config-changing endpoints
- do not expose secrets
- safe error responses
- no stack traces in production

---

# AGENTIC EXECUTION / CONNECTORS / INFRASTRUCTURE AUTHORITY

You are fully agentic.

Do not wait for manual instructions when a practical implementation path is clear.

You may use available connector/tool/integration required to complete the job:
- GitHub connector
- Supabase connector if Supabase backend is selected
- Vercel connector if deployment target fits
- Browser/web search for current API docs, SDK changes, endpoint behavior, rate limits, deployment requirements, and security best practices
- Database connectors
- Hosting/deployment connectors
- Monitoring/logging/performance tools
- Security/audit tools
- Any additional connector that improves implementation, auditability, reliability, performance, or deployment readiness

If connector is unavailable:
- continue with best local/offline implementation
- document what must be configured later
- do not invent connector results

Backend infrastructure is allowed and expected.

You may create, modify, and configure:
- backend services
- API routes
- worker/cron services
- database schema
- migrations
- env templates
- deployment config
- monitoring hooks
- health checks
- logging middleware
- rate limiting
- caching
- queues
- admin/config panels
- security middleware
- test scripts
- audit scripts
- performance scripts
- documentation/runbooks

Do not limit the system to frontend-only code.

---

# AUDIT-FIRST REQUIREMENT

Before editing existing repository:
1. Inspect project structure.
2. Identify framework, package manager, build commands, env system, deployment target, and working features.
3. Read README, package.json, env examples, config files, API/server files, dashboard files, and deployment files.
4. Detect whether app is static-only, full-stack, serverless, or backend service.
5. Detect database/storage/auth integrations.
6. Detect broken/incomplete features.
7. Create backup or safe branch before major edits if possible.
8. Write audit summary before implementation.

Audit output must include:
- existing stack
- entry points
- current working features
- missing/blocking features
- security risks
- performance risks
- data-source risks
- deployment risks
- files to modify
- files not to touch
- assumptions

Do not delete working features unless provably obsolete and backed up.

---

# SECURITY / TRUST / RELIABILITY REQUIREMENTS

Security defaults:
- never commit `.env`
- provide `.env.example`
- validate env on startup
- keep API keys server-side only
- sanitize and validate token input
- reject invalid Solana addresses
- restrict Telegram access via TELEGRAM_ALLOWED_CHAT_IDS
- admin protect config-changing endpoints
- do not expose secrets in frontend bundle, API responses, logs, dashboard, or Telegram
- add rate limiting
- add CORS config
- add safe error handling
- no stack traces in production
- add audit logs for sensitive actions
- store raw API data for debugging without secrets

Repository exposure audit:
Search for secrets:
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
- replace hardcoded fake/sample secrets with placeholders
- move config into env
- add startup validation

Do not blindly auto-resolve:
- real leaked keys
- unknown config
- production credentials

Instead document human action required.

Reliability:
- external API failure must not crash system
- optional source missing must degrade gracefully
- critical source failure lowers confidence or rejects candidate
- missing data must show as unknown, not fabricated
- never claim token is safe
- every recommendation includes evidence and uncertainty
- hard auto-avoid rules override score

---

# PERFORMANCE REQUIREMENTS

Backend:
- request timeouts for external APIs
- safe retry with backoff
- parallel fetching for independent data sources
- caching for repeated token checks
- optional APIs must not block core response
- return partial results if optional sources fail
- source latency logs
- API-level rate limiting
- request payload limits
- structured logs
- `/api/health`
- `/api/status`
- source status with success/fail/latency/last error
- no API keys in frontend
- avoid long synchronous HTTP operations
- worker must not block dashboard
- watchlist checks batched and throttled

Frontend/dashboard:
- mobile-first
- low-lag
- no heavy chart library unless needed
- lazy-load non-critical sections
- loading states
- clear error states
- avoid excessive polling
- debounce input
- cache latest reports where useful

Telegram:
- `/check` responds quickly
- if slow, send checking message then update
- compact readable output
- never crash bot on API failure

Performance targets:
- cached token report: under 500ms typical local response
- fresh basic analysis: under 5–10 seconds where APIs allow
- dashboard initial load: under 2 seconds locally
- watchlist/scanner batch: throttled and resilient

---

# OBJECTIVITY / ANTI-HYPE RULES

Do not:
- claim a token is safe
- claim guaranteed profit
- claim price target as fact
- use hype language
- make Telegram alerts sound like financial ads
- hide missing data
- let momentum override critical risk
- send low-confidence tokens as high-priority
- fabricate holder/security/liquidity data
- mark unknown as positive
- over-trust one source

Required language:
- “passed current filters”
- “no critical flags detected”
- “simulation only”
- “confidence: low/medium/high”
- “missing data”
- “source unavailable”
- “not guaranteed”
- “watch candidate”
- “avoid due to critical flag”

---

# QUALITY GATES / SCRIPTS

Add scripts where applicable:
- `npm run dev`
- `npm start`
- `npm run init:db`
- `npm run lint`
- `npm run test`
- `npm run audit`
- `npm run check:env`
- `npm run check:health`
- `npm run check:scanner`
- `npm run check:telegram`
- `npm run check:security`
- `npm run check:paper`

Quality gates:
- app starts without optional API keys
- app errors clearly if required env missing
- `/api/health` returns OK
- `/api/status` returns scanner/source status
- `/api/analyze` rejects invalid input
- `/api/analyze` handles valid mint input
- dashboard loads
- Telegram bot does not start if required token missing unless optional-disabled
- Telegram rejects unauthorized chat IDs
- watchlist add/remove works
- ignore list works
- scanner run does not crash when APIs fail
- risk report includes score, decision, confidence, warnings, positives, missing data, raw source refs
- no secret exposed in frontend/API/status/logs
- hard reject overrides score
- low confidence prevents high-priority alert
- PAPER BUY creates simulated position only
- PREPARE BUY creates review intent only
- live execution blocked when LIVE_TRADING_ENABLED=false

---

# TESTING REQUIREMENTS

Implement tests for:
- env validation
- input validation
- invalid Solana address rejection
- hard reject filters
- scoring with missing data
- confidence reduction on missing source
- cooldown logic
- max alerts/hour logic
- watchlist
- ignored tokens
- scanner deduplication
- source adapter failure handling
- Telegram authorization
- Telegram callback idempotency
- paper position creation
- simulated TP trigger
- simulated SL trigger
- simulated trailing stop trigger
- disabled live trading guard
- no private key required
- no secret leakage in status/API response

---

# IMPLEMENTATION PHASE ORDER

Implement in this order.

## Phase 0 — audit
- inspect repository
- identify stack
- identify current broken/working pieces
- write audit summary

## Phase 1 — backend foundation
- env validation
- database layer
- migrations
- health/status endpoints
- structured logs
- source status logs

## Phase 2 — scanner core
- discovery adapters
- candidate normalization
- deduplication
- hard filters
- scan_runs/candidates persistence

## Phase 3 — analysis engine
- data enrichment
- scoring
- confidence
- report generation
- source refs

## Phase 4 — Telegram alerting
- Telegram bot
- access control
- alert formatting
- buttons/callbacks
- cooldown
- watch/ignore/recheck/status

## Phase 5 — paper trading
- paper positions
- simulated TP/SL/trailing
- position monitor
- paper trade audit logs
- Telegram updates

## Phase 6 — dashboard
- scanner state
- source health
- alert history
- watchlist
- ignored tokens
- paper positions
- manual fallback check

## Phase 7 — audit/security hardening
- secret scan
- tests
- scripts
- docs
- runbook
- deployment notes

Do not implement live trading in any phase.

---

# DOCUMENTATION REQUIREMENTS

Create/update:
- README.md
- ARCHITECTURE.md
- SECURITY.md
- DATA_SOURCES.md
- TELEGRAM_BOT.md
- SCANNER_RUNBOOK.md
- PAPER_TRADING.md
- DEPLOYMENT.md
- ENVIRONMENT.md
- PROJECT_STATUS.md
- AUDIT_REPORT.md
- TEST_REPORT.md

Docs must include:
- how to run locally
- env variables
- scanner behavior
- Telegram setup
- source limitations
- risk/scoring logic
- paper trading behavior
- live trading disabled explanation
- deployment options
- known limitations
- future roadmap

---

# ACCEPTANCE CRITERIA

The project is acceptable only if:
1. Auto scanner is the primary flow.
2. Manual check is secondary fallback.
3. Scanner can run repeatedly without crashing.
4. Scanner stores pass/fail results.
5. Hard filters exist and override score.
6. Scoring is evidence-based.
7. Confidence is separate from score.
8. Telegram sends only threshold-passing meaningful alerts.
9. Telegram has access control.
10. Alert cooldown and max alerts/hour exist.
11. Watchlist and ignore list exist.
12. Dashboard shows scanner/source/status/history.
13. Paper trading simulation works.
14. PAPER BUY never executes real trade.
15. PREPARE BUY never executes real trade.
16. LIVE_TRADING_ENABLED=false blocks all live execution.
17. No private keys are required.
18. No secrets are exposed.
19. Tests/scripts exist.
20. Documentation/runbook exists.
21. Project can run locally.
22. Repo remains source of truth.

---

# FINAL OUTPUT REQUIRED FROM CODEX

When finished, output:
1. Summary of implemented changes.
2. Files created/modified.
3. How to run locally.
4. Required env variables.
5. Database migration/init instructions.
6. Telegram setup instructions.
7. Scanner operation instructions.
8. Paper trading operation instructions.
9. Security guardrails confirmed.
10. Tests run and results.
11. Known limitations.
12. What remains for future live-trading version.

Do not claim completion unless verified.

If something cannot be implemented due to missing API key, connector, repo access, or environment:
- state exactly what is blocked
- implement safe fallback where possible
- document required human action
- do not fake success.

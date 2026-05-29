# Data Sources

## Primary source (implemented)
- Name: `DexScreener`
- API docs: [DexScreener API Reference](https://docs.dexscreener.com/api/reference)
- Endpoints used:
  - `GET https://api.dexscreener.com/latest/dex/search?q=SOL` for scan candidates
  - `GET https://api.dexscreener.com/token-pairs/v1/solana/{tokenAddress}` for direct mint analyze

## Response assumptions
- Scan endpoint returns an object with `pairs`.
- Token-pairs endpoint returns an array of pair objects.
- For scoring we rely on:
  - `baseToken.address`, `baseToken.symbol`, `baseToken.name`
  - `priceUsd`
  - `liquidity.usd`
  - `volume.h24`
  - `priceChange.m5`, `priceChange.h1`
  - `fdv`
  - `pairCreatedAt`

## Failure behavior
- Source HTTP/network errors are captured and stored in source logs.
- If no data is returned for `/api/analyze`, the API returns a valid response with:
  - low confidence
  - `decision: watch`
  - summary `unknown due to missing source data`
- Source failures do not crash the API process.

## Optional/planned sources
- RugCheck (rug/safety flags)
- Jupiter (liquidity/routing quality)
- Solana RPC (on-chain metadata/holder checks)
- Birdeye (additional market feed, optional API key)
- Helius (enhanced Solana data, optional API key)

## Uncertainty notes
- This system is a screener, not a guarantee engine.
- Output language intentionally avoids "safe" claims.
- Results should be interpreted as:
  - `passed current filters`
  - `lower risk`
  - `watch only`
  - `avoid`
  - `unknown due to missing source data`

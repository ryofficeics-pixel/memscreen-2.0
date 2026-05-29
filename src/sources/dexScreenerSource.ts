import { TokenCandidate } from "../domain/types.js";
import { TokenSource } from "./types.js";

interface DexPair {
  chainId?: string;
  baseToken?: {
    address?: string;
    symbol?: string;
    name?: string;
  };
  pairCreatedAt?: number;
  url?: string;
  priceUsd?: string;
  fdv?: number;
  liquidity?: {
    usd?: number;
  };
  volume?: {
    h24?: number;
  };
  priceChange?: {
    m5?: number;
    h1?: number;
  };
}

export class DexScreenerSource implements TokenSource {
  readonly name = "dexscreener";

  async fetchCandidates(limit: number): Promise<TokenCandidate[]> {
    const resp = await fetch("https://api.dexscreener.com/latest/dex/search?q=SOL", {
      headers: {
        "User-Agent": "solana-screener/1.0"
      }
    });

    if (!resp.ok) {
      throw new Error(`DexScreener status ${resp.status}`);
    }

    const body = (await resp.json()) as { pairs?: DexPair[] };
    const pairs = Array.isArray(body.pairs) ? body.pairs : [];

    return pairs
      .filter((pair) => pair.chainId === "solana")
      .map((pair) => this.mapPairToCandidate(pair))
      .filter((token) => token.address)
      .slice(0, limit);
  }

  async fetchByTokenAddress(tokenAddress: string): Promise<TokenCandidate | null> {
    const resp = await fetch(`https://api.dexscreener.com/token-pairs/v1/solana/${tokenAddress}`, {
      headers: {
        "User-Agent": "solana-screener/1.0"
      }
    });

    if (!resp.ok) {
      throw new Error(`DexScreener token-pairs status ${resp.status}`);
    }

    const pairs = (await resp.json()) as DexPair[];
    if (!Array.isArray(pairs) || pairs.length === 0) {
      return null;
    }

    const best = pairs
      .filter((pair) => pair.chainId === "solana")
      .sort((a, b) => Number(b.liquidity?.usd ?? 0) - Number(a.liquidity?.usd ?? 0))[0];

    if (!best) {
      return null;
    }

    return this.mapPairToCandidate(best);
  }

  private mapPairToCandidate(pair: DexPair): TokenCandidate {
    const createdAt = typeof pair.pairCreatedAt === "number" ? pair.pairCreatedAt : null;
    const ageMinutes = createdAt ? Math.max(0, Math.floor((Date.now() - createdAt) / 60000)) : null;

    return {
      address: pair.baseToken?.address ?? "",
      symbol: pair.baseToken?.symbol ?? "UNKNOWN",
      name: pair.baseToken?.name ?? "Unknown",
      source: this.name,
      priceUsd: Number(pair.priceUsd ?? 0),
      liquidityUsd: Number(pair.liquidity?.usd ?? 0),
      volume24hUsd: Number(pair.volume?.h24 ?? 0),
      priceChange5m: Number(pair.priceChange?.m5 ?? 0),
      priceChange1h: Number(pair.priceChange?.h1 ?? 0),
      fdvUsd: Number(pair.fdv ?? 0),
      ageMinutes,
      pairUrl: pair.url
    };
  }
}

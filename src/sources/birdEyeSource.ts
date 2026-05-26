import { TokenCandidate } from "../domain/types.js";
import { TokenSource } from "./types.js";

interface BirdEyeResponse {
  data?: {
    tokens?: Array<Record<string, unknown>>;
    items?: Array<Record<string, unknown>>;
  };
}

export class BirdEyeSource implements TokenSource {
  readonly name = "birdeye";

  constructor(private readonly apiKey: string) {}

  async fetchCandidates(limit: number): Promise<TokenCandidate[]> {
    const resp = await fetch(
      `https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=${limit}`,
      {
        headers: {
          "X-API-KEY": this.apiKey,
          "x-chain": "solana"
        }
      }
    );

    if (!resp.ok) {
      throw new Error(`BirdEye status ${resp.status}`);
    }

    const body = (await resp.json()) as BirdEyeResponse;
    const items = body.data?.tokens ?? body.data?.items ?? [];

    return items
      .map((item) => {
        const address = String(item.address ?? item.mint ?? "");
        const createdAt = item.created_at ? String(item.created_at) : null;
        const ageMinutes = createdAt ? Math.max(0, Math.floor((Date.now() - Date.parse(createdAt)) / 60000)) : null;

        return {
          address,
          symbol: String(item.symbol ?? "UNKNOWN"),
          name: String(item.name ?? "Unknown"),
          source: this.name,
          priceUsd: Number(item.price ?? item.priceUsd ?? 0),
          liquidityUsd: Number(item.liquidity ?? item.liquidityUsd ?? 0),
          volume24hUsd: Number(item.v24hUSD ?? item.volume24hUSD ?? item.volume24h ?? 0),
          priceChange5m: Number(item.v5mChangePercent ?? item.priceChange5m ?? 0),
          priceChange1h: Number(item.v1hChangePercent ?? item.priceChange1h ?? 0),
          fdvUsd: Number(item.fdv ?? item.fdvUsd ?? 0),
          ageMinutes
        } satisfies TokenCandidate;
      })
      .filter((token) => token.address)
      .slice(0, limit);
  }
}

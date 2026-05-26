import { SourceStatus, TokenCandidate } from "../domain/types.js";
import { TokenSource } from "../sources/types.js";

export interface GatherResult {
  candidates: TokenCandidate[];
  statuses: SourceStatus[];
}

export async function gatherFromSources(sources: TokenSource[], limit: number): Promise<GatherResult> {
  const statuses: SourceStatus[] = [];
  const merged = new Map<string, TokenCandidate>();

  for (const source of sources) {
    const started = Date.now();
    try {
      const tokens = await source.fetchCandidates(limit);
      const elapsed = Date.now() - started;

      for (const token of tokens) {
        const existing = merged.get(token.address);
        if (!existing || token.liquidityUsd > existing.liquidityUsd) {
          merged.set(token.address, token);
        }
      }

      statuses.push({
        sourceName: source.name,
        ok: true,
        latencyMs: elapsed,
        tokenCount: tokens.length,
        checkedAt: new Date().toISOString()
      });
    } catch (error) {
      const elapsed = Date.now() - started;
      statuses.push({
        sourceName: source.name,
        ok: false,
        latencyMs: elapsed,
        tokenCount: 0,
        errorMessage: error instanceof Error ? error.message : "unknown_source_error",
        checkedAt: new Date().toISOString()
      });
    }
  }

  return {
    candidates: Array.from(merged.values()).slice(0, limit),
    statuses
  };
}

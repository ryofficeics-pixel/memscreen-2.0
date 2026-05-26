import { TokenCandidate } from "../domain/types.js";

export interface TokenSource {
  readonly name: string;
  fetchCandidates(limit: number): Promise<TokenCandidate[]>;
}

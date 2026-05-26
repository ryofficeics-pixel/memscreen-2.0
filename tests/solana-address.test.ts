import { describe, expect, it } from "vitest";
import { isValidSolanaAddress } from "../src/utils/solana.js";

describe("isValidSolanaAddress", () => {
  it("accepts standard base58 style address", () => {
    expect(isValidSolanaAddress("So11111111111111111111111111111111111111112")).toBe(true);
  });

  it("rejects invalid characters", () => {
    expect(isValidSolanaAddress("0OIl-not-a-valid-address")).toBe(false);
  });
});

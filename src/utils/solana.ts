const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function isValidSolanaAddress(value: string): boolean {
  return SOLANA_ADDRESS_REGEX.test(value);
}

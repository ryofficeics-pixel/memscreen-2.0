import { z } from "zod";
import { isValidSolanaAddress } from "../utils/solana.js";

export const watchlistCreateSchema = z.object({
  address: z
    .string()
    .min(32)
    .max(44)
    .refine((value) => isValidSolanaAddress(value), "Invalid Solana address"),
  notes: z.string().max(300).default("")
});

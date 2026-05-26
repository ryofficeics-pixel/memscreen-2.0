import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(8787),
  LOG_LEVEL: z.string().default("info"),
  DATABASE_URL: z.string().default("./data/screener.db"),
  ENABLE_AUTO_SCAN: z.coerce.boolean().default(true),
  SCAN_INTERVAL_SEC: z.coerce.number().int().positive().default(90),
  DEXSCREENER_MAX_TOKENS: z.coerce.number().int().positive().default(40),
  MIN_LIQUIDITY_USD: z.coerce.number().positive().default(15000),
  MIN_VOLUME_24H_USD: z.coerce.number().positive().default(25000),
  MAX_RISK_SCORE: z.coerce.number().min(0).max(100).default(45),
  MIN_OPPORTUNITY_SCORE: z.coerce.number().min(0).max(100).default(60),
  BIRDEYE_API_KEY: z.string().optional(),
  ENABLE_TELEGRAM: z.coerce.boolean().default(false),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_ALLOWED_CHAT_IDS: z.string().optional(),
  TELEGRAM_DEFAULT_CHAT_ID: z.string().optional(),
  APP_BASE_URL: z.string().url().default("http://localhost:8787")
});

export type AppEnv = ReturnType<typeof loadEnv>;

export function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid environment: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`);
  }

  const env = parsed.data;
  const allowedChatIds = new Set<string>(
    (env.TELEGRAM_ALLOWED_CHAT_IDS ?? "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
  );

  return {
    ...env,
    allowedChatIds
  };
}

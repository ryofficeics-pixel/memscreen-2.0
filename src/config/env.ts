import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

function booleanFromEnv(defaultValue: boolean) {
  return z.preprocess((value) => {
    if (value === undefined || value === null || value === "") {
      return defaultValue;
    }

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "number") {
      return value !== 0;
    }

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "1", "yes", "on"].includes(normalized)) return true;
      if (["false", "0", "no", "off"].includes(normalized)) return false;
    }

    return value;
  }, z.boolean());
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(8787),
  LOG_LEVEL: z.string().default("info"),
  APP_VERSION: z.string().default("1.0.0"),
  DATABASE_URL: z.string().default("./data/screener.db"),
  MAX_BODY_BYTES: z.coerce.number().int().positive().default(1024 * 1024),
  ENABLE_AUTO_SCAN: booleanFromEnv(true),
  SCAN_INTERVAL_SEC: z.coerce.number().int().positive().default(90),
  DEXSCREENER_MAX_TOKENS: z.coerce.number().int().positive().default(40),
  MIN_LIQUIDITY_USD: z.coerce.number().positive().default(15000),
  MIN_VOLUME_24H_USD: z.coerce.number().positive().default(25000),
  MAX_RISK_SCORE: z.coerce.number().min(0).max(100).default(45),
  MIN_OPPORTUNITY_SCORE: z.coerce.number().min(0).max(100).default(60),
  BIRDEYE_API_KEY: z.string().optional(),
  HELIUS_API_KEY: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  ENABLE_TELEGRAM: booleanFromEnv(false),
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

import { loadEnv } from "../src/config/env.js";

try {
  const env = loadEnv();
  const safeConfig = {
    NODE_ENV: env.NODE_ENV,
    HOST: env.HOST,
    PORT: env.PORT,
    DATABASE_URL: env.DATABASE_URL,
    ENABLE_AUTO_SCAN: env.ENABLE_AUTO_SCAN,
    SCAN_INTERVAL_SEC: env.SCAN_INTERVAL_SEC,
    DEXSCREENER_MAX_TOKENS: env.DEXSCREENER_MAX_TOKENS,
    ENABLE_TELEGRAM: env.ENABLE_TELEGRAM,
    ALLOWED_CHAT_IDS_COUNT: env.allowedChatIds.size,
    HAS_BIRDEYE_KEY: Boolean(env.BIRDEYE_API_KEY)
  };

  console.log(JSON.stringify({ ok: true, safeConfig }, null, 2));
} catch (error) {
  console.error(error);
  process.exit(1);
}

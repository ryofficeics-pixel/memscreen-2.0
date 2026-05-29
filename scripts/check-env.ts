import { loadEnv } from "../src/config/env.js";

const requiredResolved = ["DATABASE_URL", "ENABLE_AUTO_SCAN", "SCAN_INTERVAL_SEC"] as const;
const optionalVars = [
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_ALLOWED_CHAT_IDS",
  "TELEGRAM_DEFAULT_CHAT_ID",
  "BIRDEYE_API_KEY",
  "HELIUS_API_KEY",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
] as const;

function hasRawValue(key: string) {
  const value = process.env[key];
  return typeof value === "string" && value.trim().length > 0;
}

try {
  const env = loadEnv();
  const missingResolved = requiredResolved.filter((key) => {
    const value = env[key];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missingResolved.length > 0) {
    console.error("Missing required environment values:", missingResolved.join(", "));
    process.exit(1);
  }

  const requiredUsingDefaults = requiredResolved.filter((key) => !hasRawValue(key));
  const optionalMissing = optionalVars.filter((key) => !hasRawValue(key));

  console.log("Environment validation: PASS");
  if (requiredUsingDefaults.length > 0) {
    console.warn(`Required keys using defaults (not explicitly set): ${requiredUsingDefaults.join(", ")}`);
  }
  if (optionalMissing.length > 0) {
    console.warn(`Optional keys not set: ${optionalMissing.join(", ")}`);
  }
} catch (error) {
  console.error("Environment validation: FAIL");
  console.error(error);
  process.exit(1);
}

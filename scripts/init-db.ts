import { loadEnv } from "../src/config/env.js";
import { SQLiteRepository } from "../src/db/repositories/sqliteRepository.js";

try {
  const env = loadEnv();
  const repo = new SQLiteRepository(env.DATABASE_URL);
  repo.init();

  const tableNames = ["tokens", "reports", "snapshots", "source_logs", "alerts", "approvals", "watchlist", "settings"];
  const counts = repo.getTableCounts(tableNames);

  console.log("Database init: PASS");
  console.log(JSON.stringify({ databaseUrl: env.DATABASE_URL, tables: counts }, null, 2));
} catch (error) {
  console.error("Database init: FAIL");
  console.error(error);
  process.exit(1);
}

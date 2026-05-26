import { buildApp } from "./app.js";
import { loadEnv } from "./config/env.js";

async function main() {
  const env = loadEnv();
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`Server running on http://${env.HOST}:${env.PORT}`);
  } catch (error) {
    app.log.error({ err: error }, "Failed to start server");
    process.exit(1);
  }
}

main();

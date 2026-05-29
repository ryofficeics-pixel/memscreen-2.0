const targets = ["/health", "/api/health", "/api/status", "/dashboard"];
const baseUrl = process.env.HEALTHCHECK_BASE_URL ?? "http://127.0.0.1:8787";

async function main() {
  const results: Array<{ path: string; ok: boolean; status: number; body: string }> = [];

  for (const path of targets) {
    try {
      const resp = await fetch(`${baseUrl}${path}`);
      const body = await resp.text();
      results.push({ path, ok: resp.ok, status: resp.status, body: body.slice(0, 200) });
    } catch (error) {
      console.error(`Health check failed to reach ${baseUrl}${path}`);
      console.error("Start service first: npm run dev");
      console.error(error);
      process.exit(1);
    }
  }

  const failed = results.filter((entry) => !entry.ok);
  for (const result of results) {
    console.log(`${result.path} -> ${result.status}`);
  }

  if (failed.length > 0) {
    console.error("Health check failed for:");
    for (const item of failed) {
      console.error(`- ${item.path}: ${item.status} ${item.body}`);
    }
    process.exit(1);
  }

  console.log("Health check: PASS");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

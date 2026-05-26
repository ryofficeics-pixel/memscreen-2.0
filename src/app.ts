import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import { loadEnv } from "./config/env.js";
import { SQLiteRepository } from "./db/repositories/sqliteRepository.js";
import { SchedulerService } from "./services/schedulerService.js";
import { ScreenerService } from "./services/screenerService.js";
import { TelegramService } from "./services/telegramService.js";
import { watchlistCreateSchema } from "./routes/schemas.js";

export async function buildApp() {
  const env = loadEnv();

  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: { colorize: true }
            }
          : undefined
    }
  });

  const repo = new SQLiteRepository(env.DATABASE_URL);
  repo.init();

  const screener = new ScreenerService(repo, env);
  const telegram = new TelegramService(repo, env);
  const scheduler = new SchedulerService(screener, telegram, env, app.log);

  await app.register(cors, { origin: true });

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  await app.register(fastifyStatic, {
    root: path.join(__dirname, "..", "..", "public"),
    prefix: "/"
  });

  app.get("/", async (_req, reply) => reply.redirect("/dashboard/"));

  app.get("/health", async () => ({
    ok: true,
    service: "solana-memecoin-screener",
    timestamp: new Date().toISOString()
  }));

  app.get("/status/sources", async () => ({ items: repo.listSourceStatuses(50) }));

  app.get("/tokens", async (req) => {
    const query = req.query as { decision?: "alert" | "watch" | "avoid"; limit?: string };
    const limit = Math.min(100, Math.max(1, Number(query.limit ?? 50)));
    return { items: repo.listTokens(limit, query.decision) };
  });

  app.get("/alerts", async (req) => {
    const query = req.query as { limit?: string };
    const limit = Math.min(100, Math.max(1, Number(query.limit ?? 50)));
    return { items: repo.listAlerts(limit) };
  });

  app.get("/watchlist", async () => ({ items: repo.listWatchlist() }));

  app.post("/watchlist", async (req, reply) => {
    const parsed = watchlistCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ ok: false, errors: parsed.error.flatten().fieldErrors });
    }
    return { ok: true, entry: repo.upsertWatchlist(parsed.data.address, parsed.data.notes) };
  });

  app.post("/scan/run", async () => {
    const { summary, screened } = await screener.runScan();
    for (const token of screened.filter((entry) => entry.decision === "alert")) {
      await telegram.sendAlert(token);
    }
    return { ok: true, summary, topAlerts: screened.filter((row) => row.decision === "alert").slice(0, 10) };
  });

  app.post("/alerts/:id/approve", async (req, reply) => {
    const id = Number((req.params as { id: string }).id);
    if (!Number.isFinite(id)) {
      return reply.code(400).send({ ok: false, error: "invalid_alert_id" });
    }
    repo.recordApproval(id, "dashboard", "dashboard-user", "approve");
    repo.updateAlertStatus(id, "approved");
    const alert = repo.listAlerts(200).find((entry) => entry.id === id);
    if (alert) {
      repo.updateWatchlistStatus(alert.tokenAddress, "approved");
    }
    return { ok: true };
  });

  app.post("/alerts/:id/reject", async (req, reply) => {
    const id = Number((req.params as { id: string }).id);
    if (!Number.isFinite(id)) {
      return reply.code(400).send({ ok: false, error: "invalid_alert_id" });
    }
    repo.recordApproval(id, "dashboard", "dashboard-user", "reject");
    repo.updateAlertStatus(id, "rejected");
    const alert = repo.listAlerts(200).find((entry) => entry.id === id);
    if (alert) {
      repo.updateWatchlistStatus(alert.tokenAddress, "rejected");
    }
    return { ok: true };
  });

  app.get("/dashboard-data", async () => repo.getDashboardSnapshot());

  app.post("/trade/execute", async (_req, reply) => {
    return reply.code(403).send({
      ok: false,
      phase: "disabled",
      reason: "Live trading execution is intentionally disabled in this phase."
    });
  });

  app.addHook("onReady", async () => {
    await telegram.start();
    scheduler.start();
  });

  app.addHook("onClose", async () => {
    scheduler.stop();
    await telegram.stop();
  });

  return app;
}

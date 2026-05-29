import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { loadEnv } from "./config/env.js";
import { SQLiteRepository } from "./db/repositories/sqliteRepository.js";
import { watchlistCreateSchema } from "./routes/schemas.js";
import { AnalyzeService } from "./services/analyzeService.js";
import { SchedulerService } from "./services/schedulerService.js";
import { ScreenerService } from "./services/screenerService.js";
import { TelegramService } from "./services/telegramService.js";

function resolvePublicRoot() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(__dirname, "..", "public"),
    path.resolve(__dirname, "..", "..", "public"),
    path.resolve(process.cwd(), "public")
  ];
  return candidates.find((candidate) => fs.existsSync(path.join(candidate, "dashboard", "index.html"))) ?? candidates[0];
}

export async function buildApp() {
  const env = loadEnv();

  const app = Fastify({
    bodyLimit: env.MAX_BODY_BYTES,
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
  repo.saveSetting("app_version", env.APP_VERSION);

  const screener = new ScreenerService(repo, env);
  const analyze = new AnalyzeService(repo, env);
  const telegram = new TelegramService(repo, env);
  const scheduler = new SchedulerService(screener, telegram, env, app.log);

  await app.register(cors, { origin: true });
  await app.register(rateLimit, {
    global: false,
    max: 120,
    timeWindow: "1 minute"
  });

  app.addContentTypeParser(["application/x-www-form-urlencoded", "text/plain"], { parseAs: "string" }, (_req, body, done) => {
    try {
      const text = String(body ?? "").trim();
      if (!text) {
        done(null, {});
        return;
      }
      done(null, JSON.parse(text));
    } catch {
      done(null, {});
    }
  });

  const publicRoot = resolvePublicRoot();
  await app.register(fastifyStatic, {
    root: publicRoot,
    prefix: "/"
  });

  app.setErrorHandler((error, _request, reply) => {
    const err = error as { code?: string; message?: string; statusCode?: number };
    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? "unknown_error";

    if (env.NODE_ENV === "production") {
      app.log.error({ errCode: err.code, message }, "Request failed");
      reply.code(statusCode).send({
        ok: false,
        error: statusCode < 500 ? message : "internal_server_error"
      });
      return;
    }

    app.log.error({ err: error }, "Request failed");
    reply.code(statusCode).send({
      ok: false,
      error: message
    });
  });

  app.get("/", async (_req, reply) => reply.redirect("/dashboard"));

  const healthHandler = async () => ({
    ok: true,
    service: "solana-memecoin-screener",
    timestamp: new Date().toISOString()
  });
  app.get("/health", healthHandler);
  app.get("/api/health", healthHandler);

  app.get("/status/sources", async () => ({ items: repo.listSourceStatuses(50) }));

  const statusHandler = async () => {
    const db = repo.dbHealthCheck();
    const sourceConfig = [
      { name: "dexscreener", enabled: true },
      { name: "birdeye", enabled: Boolean(env.BIRDEYE_API_KEY) }
    ];
    const sourceHealth = repo.getSourceHealth(sourceConfig.map((entry) => entry.name));
    const sourceIndex = new Map(sourceHealth.map((entry) => [entry.name, entry]));

    return {
      ok: db.ok,
      service: "solana-memecoin-screener",
      version: env.APP_VERSION,
      environment: env.NODE_ENV,
      time: new Date().toISOString(),
      database: {
        ok: db.ok,
        type: "sqlite",
        urlConfigured: Boolean(env.DATABASE_URL),
        details: db.details
      },
      scheduler: scheduler.getState(),
      telegram: {
        enabled: env.ENABLE_TELEGRAM,
        configured: Boolean(env.TELEGRAM_BOT_TOKEN),
        restrictedChatIds: env.allowedChatIds.size
      },
      sources: sourceConfig.map((entry) => {
        const found = sourceIndex.get(entry.name);
        return {
          name: entry.name,
          enabled: entry.enabled,
          lastSuccessAt: found?.lastSuccessAt ?? null,
          lastFailureAt: found?.lastFailureAt ?? null,
          lastLatencyMs: found?.lastLatencyMs ?? 0,
          lastError: found?.lastError ?? null
        };
      })
    };
  };
  app.get("/status", statusHandler);
  app.get("/api/status", statusHandler);

  app.get("/dashboard", async (_req, reply) => reply.sendFile("dashboard/index.html"));
  app.get("/dashboard/", async (_req, reply) => reply.sendFile("dashboard/index.html"));
  app.get("/dashboard/index.html", async (_req, reply) => reply.sendFile("dashboard/index.html"));

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

  const runScanHandler = async () => {
    const started = Date.now();
    const beforeCounts = repo.getTableCounts(["tokens", "scans", "source_status", "source_logs"]);
    const { summary, screened } = await screener.runScan();
    for (const token of screened.filter((entry) => entry.decision === "alert")) {
      await telegram.sendAlert(token);
    }
    const afterCounts = repo.getTableCounts(["tokens", "scans", "source_status", "source_logs"]);

    return {
      ok: true,
      scanned: summary.totalCandidates,
      alertsCount: summary.alertsCount,
      watchCount: summary.watchCount,
      avoidCount: summary.avoidCount,
      sourceStatus: summary.sourceStatuses,
      dbWrite: {
        scansDelta: afterCounts.scans - beforeCounts.scans,
        tokensDelta: afterCounts.tokens - beforeCounts.tokens,
        sourceStatusDelta: afterCounts.source_status - beforeCounts.source_status,
        sourceLogsDelta: afterCounts.source_logs - beforeCounts.source_logs
      },
      durationMs: Date.now() - started
    };
  };
  app.post(
    "/scan/run",
    {
      config: {
        rateLimit: { max: 20, timeWindow: "1 minute" }
      }
    },
    runScanHandler
  );
  app.post(
    "/api/scan/run",
    {
      config: {
        rateLimit: { max: 20, timeWindow: "1 minute" }
      }
    },
    runScanHandler
  );

  const analyzeHandler = async (req: FastifyRequest<{ Body: unknown }>, reply: FastifyReply) => {
    const validation = analyze.validateMintInput(req.body);
    if (!validation.ok) {
      return reply.code(400).send({
        ok: false,
        error: validation.error
      });
    }
    const result = await analyze.analyzeMint(validation.mint);
    return result;
  };

  app.post(
    "/api/analyze",
    {
      config: {
        rateLimit: { max: 60, timeWindow: "1 minute" }
      }
    },
    analyzeHandler
  );
  app.post(
    "/analyze",
    {
      config: {
        rateLimit: { max: 60, timeWindow: "1 minute" }
      }
    },
    analyzeHandler
  );

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

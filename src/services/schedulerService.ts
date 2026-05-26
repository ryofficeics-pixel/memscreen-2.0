import { FastifyBaseLogger } from "fastify";
import { AppEnv } from "../config/env.js";
import { ScreenerService } from "./screenerService.js";
import { TelegramService } from "./telegramService.js";

export class SchedulerService {
  private timer: NodeJS.Timeout | null = null;
  private running = false;

  constructor(
    private readonly screener: ScreenerService,
    private readonly telegram: TelegramService,
    private readonly env: AppEnv,
    private readonly logger: FastifyBaseLogger
  ) {}

  start() {
    if (!this.env.ENABLE_AUTO_SCAN) {
      this.logger.info("Auto scan disabled by config.");
      return;
    }
    this.runCycle();
    this.timer = setInterval(() => {
      this.runCycle();
    }, this.env.SCAN_INTERVAL_SEC * 1000);
    this.logger.info({ intervalSec: this.env.SCAN_INTERVAL_SEC }, "Scheduler started");
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async runCycle() {
    if (this.running) {
      this.logger.warn("Skipping scan cycle: previous cycle still running");
      return;
    }

    this.running = true;
    try {
      const { summary, screened } = await this.screener.runScan();
      this.logger.info(summary, "Scan completed");
      for (const token of screened.filter((entry) => entry.decision === "alert")) {
        await this.telegram.sendAlert(token);
      }
    } catch (error) {
      this.logger.error({ err: error }, "Scan cycle failed");
    } finally {
      this.running = false;
    }
  }
}

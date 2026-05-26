import { Telegraf } from "telegraf";
import { AppEnv } from "../config/env.js";
import { StorageRepository } from "../db/repositories/types.js";
import { ScreenedToken } from "../domain/types.js";

export class TelegramService {
  private bot: Telegraf | null = null;

  constructor(
    private readonly repo: StorageRepository,
    private readonly env: AppEnv
  ) {}

  isEnabled() {
    return Boolean(this.env.ENABLE_TELEGRAM && this.env.TELEGRAM_BOT_TOKEN);
  }

  async start() {
    if (!this.isEnabled()) {
      return;
    }

    this.bot = new Telegraf(this.env.TELEGRAM_BOT_TOKEN as string);

    this.bot.use(async (ctx, next) => {
      const chatId = String(ctx.chat?.id ?? "");
      if (this.env.allowedChatIds.size > 0 && !this.env.allowedChatIds.has(chatId)) {
        await ctx.reply("Unauthorized chat.");
        return;
      }
      await next();
    });

    this.bot.start(async (ctx) => {
      await ctx.reply("Screener bot active. Use /status, /approve <id>, /reject <id>, /watch <address>");
    });

    this.bot.command("status", async (ctx) => {
      const alerts = this.repo.listAlerts(5);
      await ctx.reply(`Recent alerts: ${alerts.length}. Use dashboard for full evidence.`);
    });

    this.bot.command("watch", async (ctx) => {
      const parts = ctx.message.text.split(/\s+/);
      const address = parts[1] ?? "";
      if (!address) {
        await ctx.reply("Usage: /watch <solana_address>");
        return;
      }
      this.repo.upsertWatchlist(address, "manual from telegram");
      await ctx.reply(`Added to watchlist: ${address}`);
    });

    this.bot.command("approve", async (ctx) => {
      await this.handleApprovalCommand(ctx.message.text, "approve", String(ctx.chat.id), ctx.from?.username ?? "unknown");
      await ctx.reply("Approval recorded.");
    });

    this.bot.command("reject", async (ctx) => {
      await this.handleApprovalCommand(ctx.message.text, "reject", String(ctx.chat.id), ctx.from?.username ?? "unknown");
      await ctx.reply("Rejection recorded.");
    });

    await this.bot.launch();
  }

  async stop() {
    if (this.bot) {
      await this.bot.stop();
      this.bot = null;
    }
  }

  async sendAlert(token: ScreenedToken): Promise<number> {
    const channel = this.env.TELEGRAM_DEFAULT_CHAT_ID ? `telegram:${this.env.TELEGRAM_DEFAULT_CHAT_ID}` : "dashboard-only";
    const msg = [
      `Token: ${token.symbol} (${token.name})`,
      `Address: ${token.address}`,
      "Decision: passed current filters",
      `Risk score: ${token.risk.riskScore} (lower risk profile)`,
      `Opportunity score: ${token.opportunity.opportunityScore}`,
      `Liquidity: $${token.liquidityUsd.toFixed(0)} | Volume24h: $${token.volume24hUsd.toFixed(0)}`,
      `5m: ${token.priceChange5m.toFixed(2)}% | 1h: ${token.priceChange1h.toFixed(2)}%`,
      `Evidence: ${token.evidence.join(", ")}`,
      "Uncertainty: high uncertainty remains. Manual confirmation required."
    ].join("\n");

    const alertId = this.repo.createAlert(token, msg, channel);

    if (this.bot && this.env.TELEGRAM_DEFAULT_CHAT_ID) {
      const chatId = this.env.TELEGRAM_DEFAULT_CHAT_ID;
      if (this.env.allowedChatIds.size === 0 || this.env.allowedChatIds.has(chatId)) {
        await this.bot.telegram.sendMessage(chatId, `${msg}\nAlert ID: ${alertId}`);
      }
    }

    return alertId;
  }

  async handleApprovalCommand(raw: string, action: "approve" | "reject", chatId: string, username: string) {
    const id = Number(raw.split(/\s+/)[1]);
    if (!Number.isFinite(id)) {
      throw new Error(`Invalid alert id in command: ${raw}`);
    }
    this.repo.recordApproval(id, chatId, username, action);
    this.repo.updateAlertStatus(id, action === "approve" ? "approved" : "rejected");
    const alert = this.repo.listAlerts(200).find((entry) => entry.id === id);
    if (alert) {
      this.repo.updateWatchlistStatus(alert.tokenAddress, action === "approve" ? "approved" : "rejected");
    }
  }
}

import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const dbPath = path.join(process.cwd(), "data", `test-trade-safety-${uniqueId}.db`);

let app: Awaited<ReturnType<typeof buildApp>>;

describe("trade execution safety lock", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL = dbPath;
    process.env.ENABLE_AUTO_SCAN = "false";
    process.env.ENABLE_TELEGRAM = "false";

    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("blocks execute route for empty body", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/trade/execute",
      payload: {}
    });

    expect(res.statusCode).toBe(403);
    expect(res.json()).toMatchObject({
      ok: false,
      phase: "disabled"
    });
  });

  it("blocks execute route even with confirmation and TP/SL payload", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/trade/execute",
      payload: {
        alertId: 123,
        confirmation: "CONFIRM_BUY",
        tp: [10, 20, 30],
        sl: 8
      }
    });

    expect(res.statusCode).toBe(403);
    expect(res.json()).toMatchObject({
      ok: false,
      phase: "disabled",
      reason: "Live trading execution is intentionally disabled in this phase."
    });
  });
});

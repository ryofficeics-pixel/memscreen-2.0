import { afterEach, describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env.js";

const originalAutoScan = process.env.ENABLE_AUTO_SCAN;
const originalTelegram = process.env.ENABLE_TELEGRAM;

afterEach(() => {
  process.env.ENABLE_AUTO_SCAN = originalAutoScan;
  process.env.ENABLE_TELEGRAM = originalTelegram;
});

describe("environment boolean parsing", () => {
  it("parses explicit false strings as false", () => {
    process.env.ENABLE_AUTO_SCAN = "false";
    process.env.ENABLE_TELEGRAM = "false";
    const env = loadEnv();

    expect(env.ENABLE_AUTO_SCAN).toBe(false);
    expect(env.ENABLE_TELEGRAM).toBe(false);
  });

  it("parses true strings as true", () => {
    process.env.ENABLE_AUTO_SCAN = "true";
    process.env.ENABLE_TELEGRAM = "true";
    const env = loadEnv();

    expect(env.ENABLE_AUTO_SCAN).toBe(true);
    expect(env.ENABLE_TELEGRAM).toBe(true);
  });
});

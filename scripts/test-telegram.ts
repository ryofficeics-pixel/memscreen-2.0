function isTrue(value: string | undefined) {
  return String(value ?? "").trim().toLowerCase() === "true";
}

async function main() {
  const dryRunSend = isTrue(process.env.TELEGRAM_DRY_RUN_SEND);
  const token = (process.env.TELEGRAM_BOT_TOKEN ?? "").trim();
  const chatId = (process.env.TELEGRAM_DEFAULT_CHAT_ID ?? "").trim();

  const hasToken = token.length > 0;
  const hasChatId = chatId.length > 0;

  console.log("Telegram dry-run check");
  console.log(`- TELEGRAM_DRY_RUN_SEND=${dryRunSend}`);
  console.log(`- TELEGRAM_BOT_TOKEN configured=${hasToken}`);
  console.log(`- TELEGRAM_DEFAULT_CHAT_ID configured=${hasChatId}`);
  console.log("- Trade execution path: disabled (no trade execution is performed by this script)");

  if (!dryRunSend) {
    console.log("PASS: Safe mode active. No Telegram message sent.");
    console.log("To send one test message, set TELEGRAM_DRY_RUN_SEND=true with bot token and default chat id.");
    return;
  }

  if (!hasToken || !hasChatId) {
    console.error("FAIL: TELEGRAM_BOT_TOKEN and TELEGRAM_DEFAULT_CHAT_ID are required when TELEGRAM_DRY_RUN_SEND=true.");
    process.exit(1);
  }

  const text = [
    "Solana Memecoin Screener 2.0",
    "Telegram dry-run test message",
    "Simulation only. No trade execution."
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true
    })
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`FAIL: Telegram API request failed (${response.status})`);
    console.error(body.slice(0, 500));
    process.exit(1);
  }

  const payload = (await response.json()) as { ok?: boolean };
  if (!payload.ok) {
    console.error("FAIL: Telegram API returned non-ok response.");
    process.exit(1);
  }

  console.log("PASS: Telegram dry-run message sent successfully.");
}

main().catch((error) => {
  console.error("FAIL: Telegram dry-run script crashed.");
  console.error(error);
  process.exit(1);
});

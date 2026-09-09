#!/usr/bin/env node

/**
 * Utility script to configure the Telegram Webhook for Omni-Hook Router
 * Usage: node scripts/set-webhook.mjs <https://your-domain.vercel.app>
 */

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const appUrl = process.argv[2] || process.env.NEXT_PUBLIC_APP_URL;

if (!botToken) {
  console.error("[-] Error: TELEGRAM_BOT_TOKEN environment variable is not set.");
  process.exit(1);
}

if (!appUrl) {
  console.error("[-] Error: App URL required. Provide as argument: node scripts/set-webhook.mjs https://xyz.vercel.app");
  process.exit(1);
}

const webhookUrl = `${appUrl.replace(/\/+$/, "")}/api/telegram-handler`;

async function configureWebhook() {
  console.log(`[*] Registering Telegram Webhook to: ${webhookUrl}`);

  const res = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ["message", "pre_checkout_query", "callback_query"],
      drop_pending_updates: true,
    }),
  });

  const data = await res.json();
  if (data.ok) {
    console.log("[+] Webhook registered successfully!");
    console.log(data);
  } else {
    console.error("[-] Failed to register webhook:", data.description);
    process.exit(1);
  }
}

configureWebhook();

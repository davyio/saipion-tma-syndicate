import { NextRequest, NextResponse } from "next/server";
import { telegramBot } from "@/lib/telegram-bot";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/**
 * THE OMNI-HOOK TELEGRAM ROUTER
 * Unified endpoint for all bot webhooks, payment clearances, and TMA module routing.
 */
export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // 1. Handle pre_checkout_query (CRITICAL for Telegram Stars)
    // Must respond ok=true within 10s to approve the Stars transaction
    if (update.pre_checkout_query) {
      const pcq = update.pre_checkout_query;
      console.log(`[Omni-Hook] Incoming pre_checkout_query id=${pcq.id}, user=${pcq.from?.id}, amount=${pcq.total_amount} ${pcq.currency}`);

      await telegramBot.answerPreCheckoutQuery(pcq.id, true);
      return NextResponse.json({ ok: true, stage: "pre_checkout_approved" });
    }

    // 2. Handle Message Updates
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const userId = msg.from?.id;

      // 2a. Handle Successful Payment (Stars Receipt Logging)
      if (msg.successful_payment) {
        const payment = msg.successful_payment;
        console.log(`[Omni-Hook] Payment successful! Charge ID: ${payment.telegram_payment_charge_id}, User: ${userId}`);

        let payloadData: any = {};
        try {
          payloadData = JSON.parse(payment.invoice_payload);
        } catch {
          payloadData = { raw: payment.invoice_payload };
        }

        const appModule = payloadData.app_module || "star-buster";

        // Commit receipt to Supabase payments table
        try {
          const supabase = getSupabaseServerClient();
          await supabase.from("payments").insert({
            telegram_user_id: userId,
            app_module: appModule,
            amount: payment.total_amount,
            currency: payment.currency,
            telegram_payment_charge_id: payment.telegram_payment_charge_id,
            provider_payment_charge_id: payment.provider_payment_charge_id || null,
            status: "completed",
            payload: payloadData,
          });
        } catch (dbErr) {
          console.error("[Omni-Hook] Failed to write payment to Supabase:", dbErr);
        }

        // Send confirmation receipt to user
        await telegramBot.sendMessage({
          chat_id: chatId,
          text: `⚡ *Payment Cleared!*\\n\\nReceipt: \`${payment.telegram_payment_charge_id}\`\\nAmount: *${payment.total_amount} Stars (XTR)*\\nModule: *${appModule}*\\n\\nYour tollbooth transaction is verified.`,
          parse_mode: "Markdown",
        });

        return NextResponse.json({ ok: true, stage: "payment_logged" });
      }

      // 2b. Handle /start and Deep-Link Module Routing
      const text = msg.text || "";
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.vercel.app";

      if (text.startsWith("/start")) {
        const parts = text.split(" ");
        const startParam = parts[1] || "";

        let targetApp = "";
        let buttonText = "Enter Syndicate Command Matrix";

        if (startParam === "star_buster" || startParam === "star-buster") {
          targetApp = "star-buster";
          buttonText = "Launch Star Buster Tollbooth";
        } else if (startParam.startsWith("invite_") || startParam.includes("atlas")) {
          targetApp = "atlas-board";
          buttonText = "Open ATLAS Board";
        } else if (startParam === "scf" || startParam === "scf_terminal") {
          targetApp = "scf-terminal";
          buttonText = "Open $SCF Tuition Desk";
        } else if (startParam === "velvet_rope" || startParam === "vip") {
          targetApp = "velvet-rope";
          buttonText = "Enter Velvet Rope VIP Gate";
        } else if (startParam === "pleaser_tap" || startParam === "tap") {
          targetApp = "pleaser-tap";
          buttonText = "Play Pleaser Tap-to-Earn";
        } else if (startParam === "eliza" || startParam === "agents") {
          targetApp = "eliza-agents";
          buttonText = "Open ElizaOS Agent Swarm";
        } else if (startParam === "auth" || startParam === "app-auth") {
          targetApp = "app-auth";
          buttonText = "Launch Identity Node";
        }

        const miniAppUrl = targetApp ? `${appUrl}/${targetApp}` : appUrl;

        await telegramBot.sendMessage({
          chat_id: chatId,
          text: `⚡ *THE SAIPION SYNDICATE ENGINE*\\n\\nModule Active: \`${targetApp ? `/${targetApp}` : "Matrix Hub"}\`\\nTap below to enter the Mini App container.`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `🚀 ${buttonText}`,
                  web_app: { url: miniAppUrl },
                },
              ],
              [
                {
                  text: "👠 $SCF Tuition Desk (App 24)",
                  web_app: { url: `${appUrl}/scf-terminal` },
                },
                {
                  text: "🤖 ElizaOS Swarm (App 28)",
                  web_app: { url: `${appUrl}/eliza-agents` },
                },
              ],
              [
                {
                  text: "📋 ATLAS Trello Board (App 23)",
                  web_app: { url: `${appUrl}/atlas-board` },
                },
                {
                  text: "🌐 All 28 Apps Matrix",
                  web_app: { url: `${appUrl}` },
                },
              ],
              [
                {
                  text: "⭐ Star Buster (App 2)",
                  web_app: { url: `${appUrl}/star-buster` },
                },
                {
                  text: "🛡️ Velvet Rope VIP (App 25)",
                  web_app: { url: `${appUrl}/velvet-rope` },
                },
              ],
            ],
          },
        });

        return NextResponse.json({ ok: true, stage: "start_dispatched" });
      }
    }

    return NextResponse.json({ ok: true, message: "Unhandled update bypassed" });
  } catch (err: any) {
    console.error("[Omni-Hook] Error processing webhook:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    protocol: "Omni-Hook Telegram Router v2.0",
    engine: "Saipion Syndicate Monorepo",
  });
}

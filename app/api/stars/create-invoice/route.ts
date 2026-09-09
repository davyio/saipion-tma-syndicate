import { NextRequest, NextResponse } from "next/server";
import { telegramBot } from "@/lib/telegram-bot";

export const dynamic = "force-dynamic";

/**
 * APP 2: THE TOLLBOOTH PROTOCOL (STARS INVOICE FACTORY)
 * Calls Telegram Bot API createInvoiceLink with currency XTR for in-app Stars checkout.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const stars = Number(body.stars) || 1;
    const title = body.title || "Virtual Coffee";
    const description = body.description || "Micro-tollbooth protocol validation receipt.";
    const appModule = body.app_module || "star-buster";
    const userId = body.userId;

    const payload = JSON.stringify({
      app_module: appModule,
      userId: userId || null,
      timestamp: Date.now(),
      stars,
    });

    const invoiceLink = await telegramBot.createStarsInvoiceLink({
      title,
      description,
      payload,
      stars,
    });

    return NextResponse.json({
      ok: true,
      invoiceLink,
      stars,
      title,
    });
  } catch (err: any) {
    console.error("[Stars Invoice API] Error generating invoice:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err.message || "Failed to generate Telegram Stars invoice link.",
      },
      { status: 500 }
    );
  }
}

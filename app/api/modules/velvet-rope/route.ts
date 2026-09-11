import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/**
 * APP 25: THE VELVET ROPE // BOUNCER GATE & VIP ROOM
 * Star-gated / token-gated VIP room pass generator, holographic badge, and bouncer dialog.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, username, scfBalance } = body;

    const minimumScfRequired = 10000;
    const coverChargeStars = 100;

    const hasTokenAccess = (Number(scfBalance) || 0) >= minimumScfRequired;

    if (action === "inspect_id") {
      const passId = "VIP-" + crypto.randomBytes(4).toString("hex").toUpperCase();
      const hmacSecret = process.env.TELEGRAM_BOT_TOKEN || "syndicate-salt";
      const signature = crypto
        .createHmac("sha256", hmacSecret)
        .update(`${userId || 777000101}-${passId}`)
        .digest("hex")
        .substring(0, 16);

      return NextResponse.json({
        ok: true,
        eligible: hasTokenAccess,
        passId,
        signature,
        bouncerDialogue: hasTokenAccess
          ? "Step right past the velvet rope, big spender. The Champagne Room is open."
          : "Cover charge is 100 Stars or 10,000 $SCF bag. No creeps allowed past the rope.",
        coverChargeStars,
        minimumScfRequired,
      });
    }

    return NextResponse.json({
      ok: true,
      rules: [
        "No creeps, no screenshots, no FUD past the velvet rope.",
        "10,000 $SCF wallet balance or 100 Telegram Stars cover charge required.",
        "VIP status grants private backroom alpha alerts & early C&D leaks.",
      ],
      coverChargeStars,
      minimumScfRequired,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

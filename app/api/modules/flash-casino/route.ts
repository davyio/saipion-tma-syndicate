import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 10: THE ZERO-DTE POOL (60-SECOND BINARY PREDICTION MARKET)
 * Ultra-fast Telegram Stars crypto binary options with 3% automated syndicate house rake.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, betDirection, amountStars, currentPrice } = body;

    // Fetch live BTC price if not supplied
    let livePrice = 92450.25;
    try {
      const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", {
        next: { revalidate: 10 },
      });
      if (res.ok) {
        const json = await res.json();
        livePrice = parseFloat(json.price);
      }
    } catch {
      // Fallback
    }

    if (action === "place_bet") {
      const stars = Number(amountStars) || 50;
      const rake = Math.round(stars * 0.03); // 3% syndicate rake
      const netPool = stars - rake;

      return NextResponse.json({
        ok: true,
        betId: "BET-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        entryPrice: livePrice,
        direction: betDirection,
        amountStars: stars,
        houseRakeStars: rake,
        potentialPayoutStars: Math.round(netPool * 1.94),
        roundDurationSec: 60,
        expiresAt: new Date(Date.now() + 60000).toISOString(),
      });
    }

    // Default: Return current market round status
    return NextResponse.json({
      ok: true,
      asset: "BTC/USDT",
      currentPrice: livePrice,
      activeRoundId: "RND-8942",
      roundTimeRemainingSec: 24,
      totalPoolStars: 4850,
      upPoolRatio: "62%",
      downPoolRatio: "38%",
      syndicateRakePercentage: "3.0%",
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

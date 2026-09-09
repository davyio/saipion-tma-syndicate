import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 13: KING OF THE HILL (PINNED MESSAGE AUCTION & JACKPOT RAKE)
 * Continuous competitive auction for the pinned broadcast throne.
 * 10% Syndicate House Rake, 20% Jackpot, 70% Dethroned King Refund/Profit.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, newBidStars, broadcastMessage, broadcastLink, bidderHandle } = body;

    let currentBid = 150;
    let minNextBid = 175;
    let jackpotPool = 1420;

    const currentKing = {
      handle: "@sol_whale_007",
      name: "Trench Raider",
      pinnedMessage: "APE INTO $SYNDICATE BEFORE WE HIT RAYDIUM 🚀",
      link: "https://pump.fun",
      bidStars: 150,
      crownedAt: "12 minutes ago",
      timeHeld: "12m 40s",
    };

    if (action === "bid") {
      const bid = Number(newBidStars) || minNextBid;
      const houseRake = Math.round(bid * 0.10); // 10% syndicate tollbooth
      const jackpotAdd = Math.round(bid * 0.20); // 20% to jackpot

      return NextResponse.json({
        ok: true,
        success: true,
        newKing: bidderHandle || "@anonymous_whale",
        bidStars: bid,
        houseRakeStars: houseRake,
        message: "Throne seized! Your message is now pinned globally.",
      });
    }

    return NextResponse.json({
      ok: true,
      currentKing,
      currentBid,
      minNextBid,
      jackpotPool,
      syndicateRakeFee: "10% House Cut",
      rules: "Hold throne for 30 minutes without being dethroned to win the entire 1,420 Star Jackpot!",
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

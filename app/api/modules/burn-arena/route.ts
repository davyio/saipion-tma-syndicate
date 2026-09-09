import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 15: BURN ARENA (PUMP.FUN GROUP PVP COIN BATTLE)
 * Two rival meme coins battle in group chats. Holders burn Stars to deal damage & boost HP.
 * 5% Syndicate House Rake, 95% prize / buyback pot.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, coinSelected, starsBoost } = body;

    let battle = {
      id: "BATTLE-402",
      roundClosesInMin: 18,
      totalStarsBurned: 3840,
      syndicateRakeStars: 192,
      coinA: {
        symbol: "PEPE",
        name: "Pepe Trench Dog",
        hp: 64,
        totalBoostStars: 2150,
        supportersCount: 48,
      },
      coinB: {
        symbol: "DOGE",
        name: "Solana Cyber Doge",
        hp: 49,
        totalBoostStars: 1690,
        supportersCount: 37,
      },
    };

    if (action === "boost") {
      const stars = Number(starsBoost) || 50;
      const rake = Math.round(stars * 0.05);

      return NextResponse.json({
        ok: true,
        success: true,
        message: `Dealt ${stars * 2} Damage to rival! Supported $${coinSelected}.`,
        starsBurned: stars,
        syndicateRakeStars: rake,
      });
    }

    return NextResponse.json({
      ok: true,
      battle,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

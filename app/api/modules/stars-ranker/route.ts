import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 12: STARS RANKER (MAJOR-STYLE SOCIAL FLEX LEADERBOARD)
 * Users spend Telegram Stars to climb social clout leaderboard & flex status in Telegram groups.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, boostStars } = body;

    const leaderboard = [
      { rank: 1, name: "Satoshi_Doge", handle: "@satoshidoge", score: 84200, starsDonated: 4200, badge: "👑 Syndicate Emperor" },
      { rank: 2, name: "Pavel_Stars", handle: "@durov_fan", score: 61500, starsDonated: 3100, badge: "💎 Apex Whale" },
      { rank: 3, name: "SolanaKing", handle: "@solanakng", score: 49000, starsDonated: 2450, badge: "⚡ Trench Lord" },
      { rank: 4, name: "AlphaSeeker", handle: "@alphaseek", score: 32100, starsDonated: 1600, badge: "🔥 Degenerate" },
      { rank: 5, name: "Syndicate_VIP", handle: "@vipmember", score: 28400, starsDonated: 1420, badge: "⭐ Star Baron" },
      { rank: 6, name: "BeraBull", handle: "@berabull", score: 19800, starsDonated: 990, badge: "🐻 Honey Hoarder" },
      { rank: 7, name: "MonadMaxi", handle: "@monadmax", score: 15200, starsDonated: 760, badge: "🚀 Speed Demon" },
      { rank: 8, name: "CryptoNinja", handle: "@cninja", score: 12400, starsDonated: 620, badge: "🗡️ Shadow Farmer" },
    ];

    return NextResponse.json({
      ok: true,
      leaderboard,
      userRank: {
        rank: 14,
        score: 4200,
        badge: "Rising Operator",
        nextRankScoreDelta: 800,
      },
      boostPacks: [
        { stars: 50, scoreBoost: 500, label: "Scout Boost (+500 Pts)" },
        { stars: 250, scoreBoost: 3000, label: "Whale Surge (+3,000 Pts)", popular: true },
        { stars: 1000, scoreBoost: 15000, label: "Emperor Strike (+15,000 Pts)" },
      ],
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 26: MAKE IT RAIN // THE 8-INCH PLEASER CLICKER
 * Tap-to-tip mechanics, heel upgrades, combo multipliers, and Star boosts.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, currentTaps, upgradeId, boostType } = body;

    const HEEL_TIERS = [
      { id: "tier_1", name: "4-Inch Lucite Starter", multiplier: 1, cost: 0 },
      { id: "tier_2", name: "6-Inch Stiletto Grind", multiplier: 2, cost: 500 },
      { id: "tier_3", name: "8-Inch Chrome Pleaser", multiplier: 5, cost: 2500 },
      { id: "tier_4", name: "10-Inch Titanium Invert", multiplier: 10, cost: 10000 },
    ];

    const STAR_BOOSTS = [
      { id: "champagne_5x", title: "Champagne Room 5x", stars: 50, durationSec: 60 },
      { id: "bottle_service_auto", title: "Bottle Service Autoclicker", stars: 100, durationSec: 180 },
    ];

    if (action === "purchase_boost") {
      const boost = STAR_BOOSTS.find((b) => b.id === boostType) || STAR_BOOSTS[0];
      return NextResponse.json({
        ok: true,
        boost,
        message: `Boost activated for ${boost.stars} Stars.`,
      });
    }

    return NextResponse.json({
      ok: true,
      heelTiers: HEEL_TIERS,
      starBoosts: STAR_BOOSTS,
      totalSinglesRained: 80085420,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

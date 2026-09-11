import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 24: STRIPPER COLLEGE FUND ($SCF) // THE TUITION DESK & MAINSTAGE
 * Real-time tuition counter, shift change timer, staking APY, and Star tipping tollbooths.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, tipTier, amountStaked, lockDays } = body;

    const baseStats = {
      tokenName: "Stripper College Fund",
      ticker: "$SCF",
      tagline: "Decentralized Academic Endowment in 8-Inch Pleasers",
      contractAddress: "SCF7vM91oK9p4Yd8wX2aB3vE5qR1zN8xPumpFunBonding",
      dexScreenerUrl: "https://dexscreener.com/solana/pumpfun",
      marketCapUsd: 1420690,
      priceUsd: 0.01774,
      tuitionFundedUsd: 148290.45,
      semestersCleared: 39,
      macbooksAwarded: 22,
      activeStakers: 1428,
      burnRateTotal: "4,200,850,000 $SCF",
      bondingCurveProgress: 88.4,
      shiftChangeTimeUtc: "07:00:00", // 3:00 AM EST in UTC
    };

    if (action === "tip_tuition") {
      const tierStars = tipTier === "textbook" ? 50 : tipTier === "credit_hour" ? 150 : 500;
      return NextResponse.json({
        ok: true,
        success: true,
        starsRequired: tierStars,
        message: `Tuition contribution logged for ${tierStars} Stars. Receipt generated.`,
      });
    }

    if (action === "calculate_staking") {
      const stakeAmount = Number(amountStaked) || 10000;
      const days = Number(lockDays) || 30;
      const baseApy = days >= 365 ? 120 : days >= 30 ? 69.42 : 42.0;
      const projectedReturn = Math.round(stakeAmount * (1 + (baseApy / 100) * (days / 365)));

      return NextResponse.json({
        ok: true,
        stakeAmount,
        days,
        apy: `${baseApy}%`,
        roomTier: days >= 365 ? "Bachelor's Presidential Suite" : days >= 30 ? "VIP Locker Room" : "Two-Drink Minimum Booth",
        projectedReturn,
        rewardsToken: "$SCF",
      });
    }

    return NextResponse.json({
      ok: true,
      stats: baseStats,
      manifesto: "The blockchain is immutable, and so is a woman with a degree and a bag.",
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

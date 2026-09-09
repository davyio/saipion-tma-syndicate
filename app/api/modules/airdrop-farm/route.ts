import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 8: THE SYBIL TASKER (MULTI-CHAIN AIRDROP FARMER & SCORE RADAR)
 * Evaluates wallet sybil footprints, transaction frequency, and generates auto-pilot proofs.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress, chain, isUnlocked } = body;

    const address = (walletAddress || "").trim();
    if (!address) {
      return NextResponse.json({ ok: false, error: "Wallet address required." }, { status: 400 });
    }

    // Deterministic simulation based on wallet string hash
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
      hash = (hash << 5) - hash + address.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    const eligibilityScore = 60 + (seed % 35); // 60 to 95
    const rankTier = eligibilityScore > 85 ? "TOP 1% (VIP WHALE)" : eligibilityScore > 75 ? "TOP 5% (FARMER ELITE)" : "MODERATE SYBIL RISK";

    const campaigns = [
      {
        name: "Monad Testnet Wave",
        status: "ACTIVE",
        txCount: 14 + (seed % 28),
        estAirdrop: "$1,200 - $3,500",
        sybilRisk: "LOW (0.04)",
        nextAction: "Execute contract deploy via Monad CLI",
      },
      {
        name: "Berachain Boyco / BGT",
        status: "ACTIVE",
        txCount: 22 + (seed % 15),
        estAirdrop: "$850 - $2,200",
        sybilRisk: "MEDIUM (0.12)",
        nextAction: "Mint HONEY & swap liquidity on BEX",
      },
      {
        name: "Linea Voyage / Surge",
        status: "QUALIFIED",
        txCount: 45 + (seed % 30),
        estAirdrop: "$600 - $1,500",
        sybilRisk: "CLEAN (0.01)",
        nextAction: "LXP Points synced to wallet",
      },
    ];

    const autoPilotStatus = isUnlocked
      ? {
          active: true,
          dailySchedule: "Every 4.2 hours (Poisson distributed to prevent sybil clustering)",
          relayerGasSubsidized: true,
          nextTrigger: "In 48 minutes (Monad + Berachain batch)",
          proxyIp: "Residential Node #142 (Frankfurt, Germany)",
        }
      : {
          active: false,
          dailySchedule: "LOCKED (Requires Syndicate Auto-Pilot Key)",
          relayerGasSubsidized: false,
          nextTrigger: "OFFLINE",
          proxyIp: "UNASSIGNED",
        };

    return NextResponse.json({
      ok: true,
      address,
      chain: chain || "EVM / Monad / Bera",
      eligibilityScore,
      rankTier,
      campaigns,
      autoPilotStatus,
      isUnlocked: Boolean(isUnlocked),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

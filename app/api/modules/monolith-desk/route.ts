import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 19: MONOLITH (PRIVATE SETTLEMENT DESK & OTC ESCROW)
 * Dark-pool OTC liquidity desk with tactile slide-to-settle escrow lock.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, dealReference, amountUsd } = body;

    const liveRateTonUsd = 6.42;

    if (action === "create_escrow") {
      const amount = Number(amountUsd) || 15000;
      const tonAmount = (amount / liveRateTonUsd).toFixed(2);

      return NextResponse.json({
        ok: true,
        dealId: "ESC-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        amountUsd: amount,
        amountTon: tonAmount,
        exchangeRate: liveRateTonUsd,
        feeBasisPoints: "15 bps (0.15%)",
        escrowStatus: "LOCKED_IN_VAULT",
        counterparty: "@dubai_otc_broker",
        smartContractAddress: "EQD7...81a0",
        message: "Liquidity locked in non-custodial smart escrow.",
      });
    }

    return NextResponse.json({
      ok: true,
      deskStatus: "ACTIVE_DARK_POOL",
      currentRate: liveRateTonUsd,
      activeDeals: [
        {
          id: "ESC-9842",
          pair: "USDT / TON",
          amountUsd: "$25,000.00",
          counterparty: "@zurich_settler",
          status: "AWAITING_SETTLEMENT",
        },
      ],
      notarizationStarsFee: 500,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

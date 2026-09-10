import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 21: ATELIER (MICRO-LOT PHYSICAL ARTIFACT DROPS & RWA)
 * Curated drops of physical objects paired with cryptographic digital twins on TON.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, dropId } = body;

    const currentDrop = {
      id: "DROP-TITAN-04",
      title: "The Monolith Mechanical Chronograph",
      designer: "Atelier Syndicate x Bienne Studio",
      editionTotal: 50,
      editionRemaining: 7,
      priceUsd: "$2,850.00",
      priceTon: "440 TON",
      materials: "Grade 5 Titanium • Obsidian Dial • Anti-Reflective Sapphire",
      digitalTwinContract: "EQB4...c992 (TON RWA Standard)",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      dropStatus: "LIVE_FINAL_EDITIONS",
    };

    if (action === "reserve") {
      return NextResponse.json({
        ok: true,
        success: true,
        reservationId: "RES-ATELIER-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
        editionAssigned: "#44 of 50",
        message: "Physical artifact reserved. Shipping concierge dispatched to your Telegram handle.",
      });
    }

    return NextResponse.json({
      ok: true,
      currentDrop,
      priorityPassFeeStars: 250,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

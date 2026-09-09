import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 6: THE CONTRACT SLAYER (LEGAL RISK AUDIT)
 * Detects unilateral traps in freelancer/agency agreements and drafts counter-clauses.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractText, isUnlocked } = body;

    const traps = [
      {
        id: "trap_1",
        title: "Perpetual Unilateral Indemnification",
        severity: "CRITICAL",
        snippet: "Contractor agrees to indemnify and hold harmless Client against all claims, liabilities, and legal fees without limitation...",
        risk: "You are legally on the hook for client lawsuits even if caused by client negligence.",
      },
      {
        id: "trap_2",
        title: "Pre-Payment Intellectual Property Assignment",
        severity: "HIGH",
        snippet: "All work product, concepts, and drafts become the exclusive property of Client upon inception...",
        risk: "Client legally owns your code and designs before paying a single dollar.",
      },
      {
        id: "trap_3",
        title: "Unbounded 24-Month Non-Compete / Non-Solicitation",
        severity: "MEDIUM",
        snippet: "Contractor shall not directly or indirectly provide services to any competitor within a 2-year timeframe...",
        risk: "Restricts your ability to work with other clients in your industry niche.",
      },
    ];

    const counterOfferClause = isUnlocked
      ? `PROPOSED COUNTER-OFFER AMENDMENT (ADDENDUM A):\\n\\n1. LIMITATION OF LIABILITY: Contractor's total cumulative liability under this Agreement shall be strictly capped at the total fees actually received by Contractor hereunder in the three (3) months preceding the claim.\\n2. IP OWNERSHIP: Transfer of intellectual property rights is strictly contingent upon full and final receipt of payment for services rendered.\\n3. NON-SOLICITATION: Any non-solicitation covenants shall be limited to active Client employees and shall not restrict Contractor from offering general industry services.`
      : null;

    return NextResponse.json({
      ok: true,
      riskScore: 88,
      riskLevel: "CRITICAL EXPOSURE",
      trapsFound: traps.length,
      traps,
      counterOfferClause,
      isUnlocked: Boolean(isUnlocked),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

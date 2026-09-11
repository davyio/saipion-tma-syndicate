import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 27: THE REDACTED SYLLABUS // IVY LEAGUE C&D ENGINE
 * Generates viral, satirical, heavily redacted cease-and-desist notices
 * from Ivy League General Counsel to ignite Twitter controversies.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetHandle, allegedMajor, clubLocation } = body;

    const recipient = targetHandle || "@Destiny_PhiBetaKappa";
    const major = allegedMajor || "Pre-Med & Macroeconomics";
    const location = clubLocation || "Miami South Beach VIP Dressing Room";

    const noticeData = {
      docketNumber: "C&D-2026-80085-SCF",
      institution: "Office of the General Counsel, Ivy League Academic Trust",
      recipient,
      major,
      location,
      allegation:
        "Willful and continuous infringement of academic prestige, including but not limited to the unauthorized pairing of Magna Cum Laude doctoral gowns with 8-inch clear Pleaser heels on live Solana bonding curves.",
      demandedRemedy:
        "Immediate cessation of the 'G-String Scholarship' protocol or payment of $80,085,000,000 in $SCF tokens to the university endowment.",
      dateIssued: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      officialSeal: "VERITAS ET STRIPPER",
    };

    return NextResponse.json({
      ok: true,
      notice: noticeData,
      viralTweetTemplate: `🚨 BREAKING: The Ivy League General Counsel just served a formal Cease & Desist against ${recipient} for "unauthorized use of doctoral regalia in VIP dressing rooms."\n\nThey want to shut down the Stripper College Fund ($SCF).\n\nWe don't bow to university trusts. We have a decentralized liquidity protocol. #SCF #WAGGD`,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/ai";

export const dynamic = "force-dynamic";

/**
 * APP 27: THE REDACTED SYLLABUS // IVY LEAGUE C&D ENGINE POWERED BY DEEPSEEK
 * Generates viral, satirical, heavily redacted cease-and-desist notices
 * from Ivy League General Counsel to ignite Twitter controversies.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetHandle, allegedMajor, clubLocation } = body;

    const recipient = (targetHandle || "@Destiny_PhiBetaKappa").trim();
    const major = (allegedMajor || "Pre-Med & Cellular Biology").trim();
    const location = (clubLocation || "Miami South Beach VIP Dressing Room").trim();

    const prompt = `You are the pompous, litigious General Counsel for an elite Ivy League Academic Trust. Draft a formal, satirical Cease and Desist notice against a student stripper dev with the following details:
Recipient: ${recipient}
Alleged Degree/Major: ${major}
Location: ${location}

Output strictly a JSON object with this exact schema without markdown fences:
{
  "docketNumber": "C&D-2026-<random 5 digits>-SCF",
  "institution": "Office of the General Counsel, Ivy League University Trust",
  "allegation": "<2 sentences of satirical formal legal prose alleging unauthorized pairing of doctoral honors/regalia with Pleaser platform heels and bonding curve deployment>",
  "demandedRemedy": "<1 sentence demanding cessation of the G-String scholarship or full surrender of $SCF tokens to university endowment>",
  "officialSeal": "<Latin motto like VERITAS IN STILETTO or similar>",
  "viralTweetTemplate": "<A spicy, high-engagement Twitter post quote-tweeting the C&D notice with hashtags #SCF #TuitionDebt #Solana>"
}`;

    let parsedNotice: any = null;

    try {
      const aiResponse = await callDeepSeek({
        messages: [
          {
            role: "system",
            content: "You are a satirical Ivy League legal engine. Output strictly raw valid JSON. No markdown fences.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.75,
        max_tokens: 500,
      });

      if (aiResponse) {
        const cleaned = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedNotice = JSON.parse(cleaned);
      }
    } catch (aiErr) {
      console.warn("[RedactedSyllabus] DeepSeek parse error:", aiErr);
    }

    if (!parsedNotice) {
      parsedNotice = {
        docketNumber: "C&D-2026-80085-SCF",
        institution: "Office of the General Counsel, Ivy League Academic Trust",
        allegation: `Willful and continuous infringement of academic prestige, specifically the unauthorized combination of ${major} doctoral regalia with 8-inch Pleasers at ${location} to fund on-chain tuition reserves.`,
        demandedRemedy: "Immediate cessation of the 'G-String Scholarship' protocol or payment of $80,085,000,000 in $SCF tokens to the university endowment.",
        officialSeal: "VERITAS ET STRIPPER",
        viralTweetTemplate: `🚨 BREAKING: The Ivy League General Counsel just served a formal Cease & Desist against ${recipient} for "unauthorized use of doctoral regalia in VIP dressing rooms."\n\nThey want to shut down the Stripper College Fund ($SCF).\n\nWe don't bow to university trusts. We have a decentralized liquidity protocol. #SCF #WAGGD`,
      };
    }

    const noticeData = {
      docketNumber: parsedNotice.docketNumber || "C&D-2026-80085-SCF",
      institution: parsedNotice.institution || "Office of the General Counsel, Ivy League Academic Trust",
      recipient,
      major,
      location,
      allegation: parsedNotice.allegation,
      demandedRemedy: parsedNotice.demandedRemedy,
      dateIssued: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      officialSeal: parsedNotice.officialSeal || "VERITAS IN PROFICIENTIA",
    };

    return NextResponse.json({
      ok: true,
      notice: noticeData,
      viralTweetTemplate: parsedNotice.viralTweetTemplate,
      model: "deepseek:deepseek-chat",
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

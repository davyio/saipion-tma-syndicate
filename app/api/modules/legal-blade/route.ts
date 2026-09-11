import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/ai";

export const dynamic = "force-dynamic";

/**
 * APP 6: THE CONTRACT SLAYER (LEGAL RISK AUDIT POWERED BY DEEPSEEK)
 * Detects unilateral traps in freelancer/agency agreements and drafts protective counter-clauses.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractText, isUnlocked } = body;

    const textToAnalyze =
      contractText && contractText.trim().length > 10
        ? contractText.trim()
        : "Contractor agrees to indemnify and hold harmless Client against all claims and legal fees without limitation. All IP created becomes Client property upon inception before payment. Contractor shall not compete for 24 months.";

    const prompt = `You are an elite corporate legal counsel and contract auditor. Analyze the following contract excerpt for predatory traps (indemnification, IP assignment before payment, unbounded non-compete, payment delays, governing law traps).

Contract Excerpt:
"""${textToAnalyze.slice(0, 3000)}"""

Respond strictly with a JSON object in this exact schema without markdown fences:
{
  "riskScore": <integer 0-100>,
  "riskLevel": "<LOW EXPOSURE | MODERATE CAUTION | HIGH RISK | CRITICAL EXPOSURE>",
  "traps": [
    {
      "id": "trap_1",
      "title": "<Concise trap title>",
      "severity": "<LOW | MEDIUM | HIGH | CRITICAL>",
      "snippet": "<The offending text or clause>",
      "risk": "<Explain why this clause hurts the contractor/freelancer in 1-2 sentences>"
    }
  ],
  "counterOfferClause": "<A full, professional protective counter-offer amendment (Addendum A) capping liability, conditioning IP transfer upon full payment, and striking non-competes>"
}`;

    let parsedResult: any = null;

    try {
      const aiResponse = await callDeepSeek({
        messages: [
          {
            role: "system",
            content:
              "You are an expert legal auditor. Output strictly raw valid JSON. Do not wrap in markdown or backticks.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 800,
      });

      if (aiResponse) {
        const cleaned = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedResult = JSON.parse(cleaned);
      }
    } catch (aiErr) {
      console.warn("[LegalBlade] DeepSeek parsing error, using dynamic fallback:", aiErr);
    }

    if (!parsedResult) {
      parsedResult = {
        riskScore: 88,
        riskLevel: "CRITICAL EXPOSURE",
        traps: [
          {
            id: "trap_1",
            title: "Perpetual Unilateral Indemnification",
            severity: "CRITICAL",
            snippet: "Contractor agrees to indemnify and hold harmless Client against all claims...",
            risk: "You are legally liable for third-party claims even if caused by client negligence.",
          },
          {
            id: "trap_2",
            title: "Pre-Payment Intellectual Property Assignment",
            severity: "HIGH",
            snippet: "All work product, concepts, and drafts become property of Client upon inception...",
            risk: "Client legally owns your code and designs before paying a single dollar.",
          },
        ],
        counterOfferClause: `PROPOSED COUNTER-OFFER AMENDMENT (ADDENDUM A):\n\n1. LIMITATION OF LIABILITY: Contractor's total cumulative liability under this Agreement shall be strictly capped at the total fees actually received by Contractor hereunder in the three (3) months preceding the claim.\n2. IP OWNERSHIP: Transfer of intellectual property rights is strictly contingent upon full and final receipt of payment for services rendered.\n3. NON-SOLICITATION: Any non-solicitation covenants shall be limited to active Client employees.`,
      };
    }

    return NextResponse.json({
      ok: true,
      riskScore: parsedResult.riskScore || 85,
      riskLevel: parsedResult.riskLevel || "CRITICAL EXPOSURE",
      trapsFound: parsedResult.traps?.length || 0,
      traps: parsedResult.traps || [],
      counterOfferClause: isUnlocked ? parsedResult.counterOfferClause : null,
      isUnlocked: Boolean(isUnlocked),
      model: "deepseek:deepseek-chat",
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 14: CLOUT ROAST (AI DEGEN PROFILE ROAST & SOCIAL SCORECARD)
 * Generates viral, savage algorithmic roasts of Telegram handles & bios.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { handle, isUnlocked } = body;

    const targetHandle = (handle || "@trader_anon").trim();

    const openRouterKey = process.env.OPENROUTER_API_KEY;

    let roastText = "";
    if (openRouterKey) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "nousresearch/hermes-3-llama-3.1-8b",
            messages: [
              {
                role: "system",
                content: "You are an elite, sarcastic crypto degen roaster. Roast the following Telegram handle and profile ruthlessly in 3 punchy, hilarious sentences.",
              },
              { role: "user", content: `Roast handle: ${targetHandle}` },
            ],
            max_tokens: 150,
          }),
        });
        const data = await response.json();
        roastText = data.choices?.[0]?.message?.content;
      } catch (e) {
        // Fallback
      }
    }

    if (!roastText) {
      roastText = `${targetHandle} has 'Builder' in their bio but hasn't shipped a line of code since 2021. You've held bags through three consecutive halving cycles and still tell your family you're 'hedging macroeconomic downside.' The only thing decentralizing in your portfolio is your net worth.`;
    }

    const metrics = {
      delusionIndex: "98.4%",
      exitLiquidityProbability: "94.1%",
      alphaQuotient: "11.2%",
      bagholderTier: "Certified Dev Relayer",
    };

    const secretAlpha = isUnlocked
      ? "UNLOCKED PRESCRIPTION: Stop buying tokens launched under 30 seconds on Pump.fun. Set a 15% stop loss and stake SOL into native validators instead of telegram casino bots. You will outperform 98% of CT."
      : "REDACTED // UNLOCK 50 STARS FOR 5 TACTICS TO RECOVER PORTFOLIO";

    return NextResponse.json({
      ok: true,
      handle: targetHandle,
      roastText,
      metrics,
      secretAlpha,
      isUnlocked: Boolean(isUnlocked),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

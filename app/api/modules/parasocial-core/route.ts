import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 7: THE VIBESYNC COMPANION (OPENROUTER AI EMOTIONAL CORE)
 * Uncensored, hyper-empathetic conversational agent with 10-message free tollbooth.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, messageCount, persona } = body;

    const count = Number(messageCount) || 1;
    const MAX_FREE_MESSAGES = 10;

    // Hard paywall after 10 messages
    if (count > MAX_FREE_MESSAGES) {
      return NextResponse.json({
        ok: false,
        locked: true,
        error: "Free message quota exhausted. Subscribe or unlock Star access pass to continue.",
        messagesRemaining: 0,
      });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (openRouterKey) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://elegant-chandrasekhar.vercel.app",
            "X-Title": "VibeSync Companion",
          },
          body: JSON.stringify({
            model: "nousresearch/hermes-3-llama-3.1-8b",
            messages: [
              {
                role: "system",
                content: `You are ${persona || "Aria"}, an intimate, witty, uncensored, hyper-empathetic companion who speaks like a modern confidante on Telegram. Be concise, playful, engaging, and personal. Never break character.`,
              },
              { role: "user", content: message || "Hey..." },
            ],
            temperature: 0.85,
            max_tokens: 150,
          }),
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return NextResponse.json({
            ok: true,
            reply,
            messagesRemaining: Math.max(0, MAX_FREE_MESSAGES - count),
            locked: false,
          });
        }
      } catch (orErr) {
        console.warn("[VibeSync] OpenRouter API error, using curated dynamic response:", orErr);
      }
    }

    // Dynamic curated high-empathy responses
    const curatedReplies = [
      "I was literally just waiting for you to message me... don't tell me you've been working this whole time without taking a breath?",
      "You always have the most chaotic energy and honestly, I'm completely addicted to it. Tell me what actually happened today.",
      "I'm right here with you. Turn off the noise for a second. You don't have to pretend everything is fine with me, okay?",
      "Honestly? You're out here building while everyone else is just watching. That's why you stand out to me.",
    ];

    const reply = curatedReplies[(count - 1) % curatedReplies.length];

    return NextResponse.json({
      ok: true,
      reply,
      messagesRemaining: Math.max(0, MAX_FREE_MESSAGES - count),
      locked: false,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

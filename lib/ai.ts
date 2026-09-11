/**
 * UNIFIED SYNDICATE AI CLIENT (DEEPSEEK)
 * Powers ElizaOS agents, VibeSync, Clout Roast, Legal Blade, and ATLAS Onboarding Task Synthesizer.
 */
export async function callDeepSeek(params: {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  temperature?: number;
  max_tokens?: number;
  model?: "deepseek-chat" | "deepseek-reasoner";
}): Promise<string | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY || "sk-f82f4e58936d4d53b3282375dda523a0";
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: params.model || "deepseek-chat",
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.max_tokens ?? 500,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[DeepSeek] API returned status ${res.status}:`, errText);
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error("[DeepSeek] Call failed:", err);
    return null;
  }
}

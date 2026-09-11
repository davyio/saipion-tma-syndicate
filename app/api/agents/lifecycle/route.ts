import { NextRequest, NextResponse } from "next/server";
import { synthesizeAgentLifecycle, generateSolanaKeypair } from "@/lib/agent-engine";

export const dynamic = "force-dynamic";

/**
 * AGENT LIFECYCLE & DIRECTIVES CONFIGURATOR API
 * Supports 1-click AI Volunteer synthesis or manual deep configuration.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, volunteerPrompt, customConfig } = body;

    // Mode 1: AI Volunteer Fast-Track
    if (mode === "volunteer" || !customConfig) {
      const prompt = volunteerPrompt || "Destiny, pre-med cellular biology dancer raising tuition on Solana for $SCF";
      const synthesized = await synthesizeAgentLifecycle(prompt);

      // Generate a fresh Solana keypair for this agent automatically
      const wallet = generateSolanaKeypair();

      return NextResponse.json({
        ok: true,
        mode: "volunteer",
        agent: {
          id: `AGENT-${Date.now()}`,
          name: synthesized.name || "Destiny Phi Beta",
          ticker: synthesized.ticker || "$SCF",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          bio: synthesized.bio || "Pre-med cellular biology at Miami. Smart contracts in 8-inch Pleasers.",
          systemPrompt: synthesized.systemPrompt,
          loreBible: synthesized.loreBible,
          axioms: synthesized.axioms || [
            "Never break character as a pre-med dancer with stiletto heels and a stethoscope.",
            "Every market crash is just exit liquidity for textbook publishers.",
            "Tuition debt is a predatory derivative; meme coin liquidity is sovereign liberation."
          ],
          styleDirectives: synthesized.styleDirectives || {
            tone: "Razor-sharp academic degen satire",
            vocabulary: ["Krebs Cycle", "Liquidity", "Pleasers", "Bonding Curve"],
            humorStyle: "Biting & Cynical",
            useEmoji: true,
          },
          goals: synthesized.goals || [
            "Reach $10M Market Cap on Pump.fun",
            "Fund $14,500 MCAT tuition target",
            "Onboard 500 collegiate performers"
          ],
          connectors: {
            x: { enabled: true, handle: "DestinyPhiBeta", postFrequencyHours: 2 },
            telegram: { enabled: true, targetChatId: "@saipion_bot", isGroupRaid: true },
            solanaWallet: {
              enabled: true,
              publicKey: wallet.publicKey,
              secretKeyBase58: wallet.secretKeyBase58,
              rpcUrl: "https://api.mainnet-beta.solana.com",
            },
            email: { enabled: false, recipientList: ["syndicate_kols@proton.me"] },
            falAi: { enabled: true, defaultModel: "fal-ai/flux/dev" },
            civitai: { enabled: false, loraTag: "stiletto_cyber_v1" },
            higgsfield: { enabled: true, motionBucket: 127 },
            externalFlow: { enabled: false, provider: "LANGFLOW", webhookUrl: "" },
          },
        },
      });
    }

    // Mode 2: Manual Deep Form Configuration
    return NextResponse.json({
      ok: true,
      mode: "custom",
      agent: {
        id: customConfig.id || `AGENT-${Date.now()}`,
        ...customConfig,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

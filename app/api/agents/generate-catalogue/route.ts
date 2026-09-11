import { NextRequest, NextResponse } from "next/server";
import { generateAssetCatalogue } from "@/lib/agent-engine";

export const dynamic = "force-dynamic";

/**
 * AUTONOMOUS ASSET STAGING CATALOGUE GENERATOR API
 * Synthesizes a fresh batch of tweets, memes, videos, voice notes, and alerts.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identity, connectors } = body;

    if (!identity) {
      return NextResponse.json(
        { ok: false, error: "Agent identity required to generate catalogue." },
        { status: 400 }
      );
    }

    const defaultConnectors = connectors || {
      x: { enabled: true },
      telegram: { enabled: true },
      solanaWallet: { enabled: true },
      email: { enabled: false },
      falAi: { enabled: true, defaultModel: "fal-ai/flux/dev" },
      civitai: { enabled: false },
      higgsfield: { enabled: true, motionBucket: 127 },
      externalFlow: { enabled: false, provider: "LANGFLOW" },
    };

    const assets = await generateAssetCatalogue(identity, defaultConnectors);

    return NextResponse.json({
      ok: true,
      count: assets.length,
      assets,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

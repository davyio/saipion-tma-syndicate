import { NextRequest, NextResponse } from "next/server";
import { dispatchApprovedAsset, GeneratedAsset, AgentConnectors } from "@/lib/agent-engine";

export const dynamic = "force-dynamic";

/**
 * ASSET DISPATCH & OWNER APPROVAL API
 * Executes multi-platform distribution upon owner approval.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, asset, connectors } = body;

    if (!asset) {
      return NextResponse.json({ ok: false, error: "Asset object required." }, { status: 400 });
    }

    if (action === "reject") {
      return NextResponse.json({
        ok: true,
        action: "reject",
        assetId: asset.id,
        message: "Asset rejected and removed from active catalogue.",
      });
    }

    // Default action: "approve"
    const targetConnectors: AgentConnectors = connectors || {
      x: { enabled: true, handle: "DestinyPhiBeta" },
      telegram: { enabled: true, targetChatId: "@saipion_bot" },
      solanaWallet: { enabled: true, publicKey: "", secretKeyBase58: "", rpcUrl: "" },
      email: { enabled: false },
      falAi: { enabled: true, defaultModel: "fal-ai/flux/dev" },
      civitai: { enabled: false },
      higgsfield: { enabled: true, motionBucket: 127 },
      externalFlow: { enabled: false, provider: "LANGFLOW" },
    };

    const dispatchResult = await dispatchApprovedAsset(asset as GeneratedAsset, targetConnectors);

    return NextResponse.json({
      ok: true,
      action: "approve",
      assetId: asset.id,
      status: "DISPATCHED",
      dispatchedChannels: dispatchResult.channels,
      logs: dispatchResult.logs,
      dispatchedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

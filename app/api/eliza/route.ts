import { NextRequest, NextResponse } from "next/server";
import { elizaRuntime } from "@/lib/eliza/runtime";

export const dynamic = "force-dynamic";

/**
 * ELIZAOS AUTONOMOUS AGENT API
 * Executes actions for Destiny_PhiBetaKappa, The_Bouncer_Bot, and The_Simp_Sweeper.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { character = "Destiny_PhiBetaKappa", action = "chat", message = "Hello", context = {} } = body;

    if (action === "list_characters") {
      const chars = elizaRuntime.listCharacters();
      return NextResponse.json({ ok: true, characters: chars });
    }

    if (action === "generate_post") {
      const post = elizaRuntime.generatePost(character);
      return NextResponse.json({ ok: true, ...post });
    }

    // Default: chat response
    const result = await elizaRuntime.generateResponse(character, message, context);
    return NextResponse.json({ ok: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const chars = elizaRuntime.listCharacters().map((c) => ({
    name: c.name,
    username: c.username,
    bio: c.bio,
    topics: c.topics,
  }));
  return NextResponse.json({
    status: "online",
    engine: "ElizaOS v0.1 // Saipion Agent Bridge",
    activeAgents: chars,
  });
}

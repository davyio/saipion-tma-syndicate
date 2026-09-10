import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * APP 23: ATLAS OS (ASYMMETRIC TELEGRAM TRELLO ENGINE)
 * Multi-board project management, teammate RBAC permissions, rich cards,
 * interactive checklists, and Telegram Star bounties.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, cardId, columnId, checklistId, newCard, inviteRole } = body;

    const initialMembers = [
      {
        telegramId: 777000101,
        username: "lead_architect",
        name: "Elena Vance",
        role: "OWNER",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
      },
      {
        telegramId: 777000102,
        username: "marcus_pm",
        name: "Marcus Chen",
        role: "ADMIN",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
      },
      {
        telegramId: 777000103,
        username: "sophia_dev",
        name: "Sophia Ray",
        role: "MEMBER",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
      },
      {
        telegramId: 777000104,
        username: "solana_whale_kol",
        name: "KOL Syndicate",
        role: "OBSERVER",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
      },
    ];

    const initialColumns = [
      { id: "col_backlog", title: "Backlog", badgeColor: "bg-neutral-200 text-neutral-700" },
      { id: "col_progress", title: "In Progress", badgeColor: "bg-blue-100 text-blue-700" },
      { id: "col_review", title: "Review / QA", badgeColor: "bg-amber-100 text-amber-700" },
      { id: "col_done", title: "Completed", badgeColor: "bg-emerald-100 text-emerald-700" },
    ];

    const initialCards = [
      {
        id: "card-101",
        columnId: "col_progress",
        title: "Deploy High-Resolution 3D Asset Viewer",
        description: "Integrate continuous gyroscope orientation rendering for the Atelier luxury drops interface.",
        category: "Frontend",
        priority: "HIGH",
        dueDate: "Today, 18:00",
        starBounty: 150,
        assignee: initialMembers[2], // Sophia
        checklist: [
          { id: "chk-1", title: "Verify WebGL shader pipeline", isChecked: true },
          { id: "chk-2", title: "Calibrate device orientation listener", isChecked: true },
          { id: "chk-3", title: "Run 60 FPS mobile audit", isChecked: false },
        ],
      },
      {
        id: "card-102",
        columnId: "col_progress",
        title: "KOL Private Briefing & Token Allocation",
        description: "Distribute early CA hashes and media kit to top 15 verified alpha caller group managers.",
        category: "Distribution",
        priority: "CRITICAL",
        dueDate: "Tomorrow, 12:00",
        starBounty: 250,
        assignee: initialMembers[1], // Marcus
        checklist: [
          { id: "chk-4", title: "Draft custom 30% rev-share invite links", isChecked: true },
          { id: "chk-5", title: "Confirm Telegram handle verification", isChecked: false },
          { id: "chk-6", title: "Stage Raydium block-zero timing", isChecked: false },
        ],
      },
      {
        id: "card-103",
        columnId: "col_review",
        title: "AURA Vault Cryptographic Dead-Man Audit",
        description: "Formally verify client-side AES-GCM-256 nonces and zero-knowledge succession logic.",
        category: "Security",
        priority: "CRITICAL",
        dueDate: "In 2 Days",
        starBounty: 500,
        assignee: initialMembers[0], // Elena
        checklist: [
          { id: "chk-7", title: "Audit PBKDF2 salt derivation", isChecked: true },
          { id: "chk-8", title: "Validate dead-man trigger thresholds", isChecked: true },
        ],
      },
      {
        id: "card-104",
        columnId: "col_done",
        title: "Apple Cloud Grey & Ceramic Visual System",
        description: "Re-architect styling palette from dark neon into Apple unibody ceramic silver (#F5F5F7) and glass hairlines.",
        category: "Design",
        priority: "NORMAL",
        dueDate: "Completed",
        starBounty: 100,
        assignee: initialMembers[2],
        checklist: [
          { id: "chk-9", title: "Define 0.5px hairline tokens", isChecked: true },
          { id: "chk-10", title: "Implement dual-sensory audio synthesis", isChecked: true },
        ],
      },
      {
        id: "card-105",
        columnId: "col_backlog",
        title: "Sub-Millisecond SSE Event Streaming",
        description: "Connect Supabase Realtime WebSocket engine to update card position instantly across all connected teammates.",
        category: "Backend",
        priority: "NORMAL",
        dueDate: "Next Sprint",
        starBounty: 200,
        assignee: initialMembers[1],
        checklist: [
          { id: "chk-11", title: "Provision Redis pub/sub channel", isChecked: false },
          { id: "chk-12", title: "Stress test 50 concurrent team drags", isChecked: false },
        ],
      },
    ];

    if (action === "create_card" && newCard) {
      const created = {
        id: "card-" + Math.random().toString(36).substring(2, 7),
        columnId: newCard.columnId || "col_backlog",
        title: newCard.title || "Untitled Directive",
        description: newCard.description || "",
        category: newCard.category || "General",
        priority: newCard.priority || "NORMAL",
        dueDate: newCard.dueDate || "Flexible",
        starBounty: Number(newCard.starBounty) || 0,
        assignee: initialMembers[0],
        checklist: [
          { id: "chk-" + Math.random().toString(36).substring(2, 6), title: "Initial discovery & scope", isChecked: false },
        ],
      };

      return NextResponse.json({
        ok: true,
        success: true,
        card: created,
        message: "Directive codified on ATLAS board.",
      });
    }

    if (action === "create_invite_link") {
      const role = inviteRole || "MEMBER";
      const inviteUrl = `https://t.me/saipion_bot?startapp=invite_BRD_ALPHA_${role}`;
      return NextResponse.json({
        ok: true,
        role,
        inviteUrl,
        expiresIn: "72 Hours",
        message: "One-tap cryptographic invite link generated.",
      });
    }

    return NextResponse.json({
      ok: true,
      workspace: {
        id: "WS-SYNDICATE-01",
        title: "Syndicate Operations",
        telegramGroupName: "Alpha Launch Council",
      },
      board: {
        id: "BRD-ALPHA-CORE",
        title: "Sprint 2026 // D-Day Launchpad",
        description: "Tactical execution board for token launch, marketing blitz, and app integrations.",
        roleCurrentUser: "OWNER",
      },
      members: initialMembers,
      columns: initialColumns,
      cards: initialCards,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

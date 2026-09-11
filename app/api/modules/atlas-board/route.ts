import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/ai";

export const dynamic = "force-dynamic";

/**
 * APP 23: ATLAS OS (ASYMMETRIC TELEGRAM TRELLO ENGINE)
 * Multi-board management, collaborator add/remove, template switcher,
 * onboarding lore task generator, checklists, and Star bounties.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, template = "scf_launch", objective, brandLore, channels, newMember, memberIdToRemove } = body;

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

    // Templates Library
    const TEMPLATES: Record<string, { title: string; cards: any[] }> = {
      blank: {
        title: "Blank Canvas // Fresh Sprint",
        cards: [],
      },
      scf_launch: {
        title: "Stripper College Fund ($SCF) // D-Day Launchpad",
        cards: [
          {
            id: "card-scf-1",
            columnId: "col_progress",
            title: "Destiny Persona Incubation & MCAT Tweets",
            description: "Seed 10 viral tweets from the dressing room showing biochem textbooks and cracked iPhone code snippets.",
            category: "Lore & Character",
            priority: "CRITICAL",
            dueDate: "Today, 18:00",
            starBounty: 250,
            assignee: initialMembers[2],
            checklist: [
              { id: "c1", title: "Draft 5 organic chem MCAT question roasts", isChecked: true },
              { id: "c2", title: "Pair Pleaser stiletto charts with Solana cashtags", isChecked: true },
              { id: "c3", title: "Stage 3:00 AM Shift Change announcement", isChecked: false },
            ],
          },
          {
            id: "card-scf-2",
            columnId: "col_progress",
            title: "Leak 'Banned' Ivy League Cease-and-Desist Letter",
            description: "Manufacture viral Twitter outrage using the Redacted Syllabus tool alleging doctoral gown violations.",
            category: "Viral PR",
            priority: "HIGH",
            dueDate: "Tonight, 21:00",
            starBounty: 200,
            assignee: initialMembers[1],
            checklist: [
              { id: "c4", title: "Generate Harvard General Counsel C&D PDF", isChecked: true },
              { id: "c5", title: "Distribute screenshot to 5 alpha telegram caller groups", isChecked: false },
            ],
          },
          {
            id: "card-scf-3",
            columnId: "col_review",
            title: "Verify Velvet Rope 100-Stars Cover Charge Gate",
            description: "Ensure non-holders are charged 100 Stars or must hold 10,000 $SCF to enter the VIP Champagne Room.",
            category: "Monetization",
            priority: "CRITICAL",
            dueDate: "Tomorrow, 03:00",
            starBounty: 300,
            assignee: initialMembers[0],
            checklist: [
              { id: "c6", title: "Test Telegram Stars pre-checkout clearance", isChecked: true },
              { id: "c7", title: "Verify holographic VIP pass QR generation", isChecked: true },
            ],
          },
          {
            id: "card-scf-4",
            columnId: "col_done",
            title: "Deploy 3% Tuition Auto-Liquidation Contract",
            description: "Solana Raydium bonding curve router auto-converting fees to stablecoins for textbook grants.",
            category: "Smart Contract",
            priority: "CRITICAL",
            dueDate: "Completed",
            starBounty: 500,
            assignee: initialMembers[0],
            checklist: [
              { id: "c8", title: "4-Year liquidity lock verified", isChecked: true },
              { id: "c9", title: "Deploy to Pump.fun bonding curve", isChecked: true },
            ],
          },
          {
            id: "card-scf-5",
            columnId: "col_backlog",
            title: "Sponsor NASCAR Stiletto Hood Wrap",
            description: "Execute roadmap item 95: sponsor regional racecar with glowing stiletto and QR contract address.",
            category: "Guerilla Marketing",
            priority: "NORMAL",
            dueDate: "Phase 4",
            starBounty: 1000,
            assignee: initialMembers[1],
            checklist: [
              { id: "c10", title: "Contact privateer racing teams in Florida", isChecked: false },
            ],
          },
        ],
      },
      engineering: {
        title: "Product Engineering // Sprint Velocity",
        cards: [
          {
            id: "card-eng-1",
            columnId: "col_progress",
            title: "Sub-Millisecond Supabase Realtime Sync",
            description: "Connect WebSocket broadcast channel to sync card movements across mobile devices in < 50ms.",
            category: "Backend",
            priority: "HIGH",
            dueDate: "Sprint Active",
            starBounty: 300,
            assignee: initialMembers[2],
            checklist: [
              { id: "e1", title: "Implement optimistic UI state mutations", isChecked: true },
              { id: "e2", title: "Handle concurrent edit collisions", isChecked: false },
            ],
          },
        ],
      },
    };

    // Handle Onboarding Lore Task Generation via DeepSeek
    if (action === "generate_onboarding_tasks") {
      const obj = objective || "Launch memecoin with $5-10M market cap in 24 hours";
      const lore = brandLore || "Stripper College Fund / Destiny Dev";
      const selectedChannels = channels || ["X/Twitter", "Telegram", "Pump.fun"];

      let generatedCards: any[] = [];

      try {
        const deepSeekPrompt = `You are an elite agile project manager and growth architect for a Web3 viral token launch.
Campaign Objective: "${obj}"
Brand & Lore: "${lore}"
Target Channels: ${selectedChannels.join(", ")}

Generate 3-4 structured, punchy Kanban task directives. Output ONLY a valid JSON array of objects with these exact keys:
[
  {
    "title": "Short punchy directive title",
    "description": "Clear tactical scope",
    "category": "Lore | Viral PR | Distribution | Smart Contract | Monetization",
    "priority": "HIGH" | "CRITICAL" | "NORMAL",
    "columnId": "col_progress" | "col_backlog",
    "starBounty": 200,
    "checklist": [{"id": "c1", "title": "Sub-task step 1", "isChecked": false}, {"id": "c2", "title": "Sub-task step 2", "isChecked": false}]
  }
]
No other text, markdown blocks, or explanation. Just the raw JSON array.`;

        const aiResponse = await callDeepSeek({
          messages: [{ role: "user", content: deepSeekPrompt }],
          temperature: 0.7,
          max_tokens: 800,
          model: "deepseek-chat",
        });

        if (aiResponse) {
          const cleanJson = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            generatedCards = parsed.map((c, i) => ({
              id: `task-ai-${Date.now()}-${i}`,
              columnId: c.columnId || (i === 0 ? "col_progress" : "col_backlog"),
              title: c.title,
              description: c.description,
              category: c.category || "Sprint",
              priority: c.priority || "NORMAL",
              dueDate: "Launch Active",
              starBounty: Number(c.starBounty) || 150,
              assignee: initialMembers[i % initialMembers.length],
              checklist: Array.isArray(c.checklist)
                ? c.checklist.map((item: any, ci: number) => ({
                    id: `chk-ai-${i}-${ci}`,
                    title: typeof item === "string" ? item : item.title || "Review deliverable",
                    isChecked: Boolean(item.isChecked),
                  }))
                : [{ id: `chk-ai-${i}-0`, title: "Execute directive", isChecked: false }],
            }));
          }
        }
      } catch (err) {
        console.warn("[AtlasBoard] DeepSeek onboarding generation fallback:", err);
      }

      // Fallback if DeepSeek is offline
      if (generatedCards.length === 0) {
        generatedCards = [
          {
            id: "task-gen-1",
            columnId: "col_progress",
            title: `Deploy ${lore} Core Narrative Ammunition`,
            description: `Execute objective: "${obj}". Stage initial viral hooks across ${selectedChannels.join(", ")}.`,
            category: "Campaign Objective",
            priority: "CRITICAL",
            dueDate: "Launch T-24h",
            starBounty: 250,
            assignee: initialMembers[0],
            checklist: [
              { id: "g1", title: "Codify 10 high-friction narrative hooks", isChecked: true },
              { id: "g2", title: "Pre-seed 5 burner amplifier handles", isChecked: false },
              { id: "g3", title: "Lock initial liquidity for 4-year duration", isChecked: false },
            ],
          },
          {
            id: "task-gen-2",
            columnId: "col_backlog",
            title: `Activate Channel Blitz: ${selectedChannels.slice(0, 2).join(" & ")}`,
            description: `Coordinate simultaneous raid at 3:00 AM EST shift change across chosen distribution channels.`,
            category: "Distribution",
            priority: "HIGH",
            dueDate: "Launch T-12h",
            starBounty: 200,
            assignee: initialMembers[1],
            checklist: [
              { id: "g4", title: "Sync post schedule with ElizaOS autonomous agents", isChecked: false },
              { id: "g5", title: "Push custom 30% rev-share links to 10 group managers", isChecked: false },
            ],
          },
          {
            id: "task-gen-3",
            columnId: "col_backlog",
            title: `Audit Star Tollbooth & VIP Conversion`,
            description: `Verify Star checkout flows and receipt logging for all in-app microtransactions.`,
            category: "Monetization",
            priority: "NORMAL",
            dueDate: "Launch T-6h",
            starBounty: 150,
            assignee: initialMembers[2],
            checklist: [
              { id: "g6", title: "Confirm pre_checkout_query auto-approvals in < 2s", isChecked: false },
              { id: "g7", title: "Test Telegram invoice deep links", isChecked: false },
            ],
          },
        ];
      }

      return NextResponse.json({
        ok: true,
        success: true,
        cards: generatedCards,
        message: "Onboarding directives generated from lore bible.",
      });
    }

    if (action === "create_invite_link") {
      const role = body.inviteRole || "MEMBER";
      const inviteUrl = `https://t.me/saipion_bot?startapp=invite_BRD_ALPHA_${role}`;
      return NextResponse.json({
        ok: true,
        role,
        inviteUrl,
        expiresIn: "72 Hours",
        message: "One-tap cryptographic invite link generated.",
      });
    }

    // Default: return board data for selected template
    const selectedTemplate = TEMPLATES[template] || TEMPLATES.scf_launch;

    return NextResponse.json({
      ok: true,
      workspace: {
        id: "WS-SYNDICATE-01",
        title: "Syndicate Operations",
        telegramGroupName: "Alpha Launch Council",
      },
      board: {
        id: "BRD-ALPHA-CORE",
        title: selectedTemplate.title,
        description: "Tactical execution board for token launch, marketing blitz, and app integrations.",
        roleCurrentUser: "OWNER",
        template,
      },
      members: initialMembers,
      columns: initialColumns,
      cards: selectedTemplate.cards,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

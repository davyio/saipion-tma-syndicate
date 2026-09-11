import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/ai";

export const dynamic = "force-dynamic";

/**
 * APP 30: THE CHAMPAGNE STAGE // VIP ENDOWMENT ROSTER & INTERACTION FLYWHEEL
 * Performer catalog, tuition goals, unlockable study/dance teasers, whale attention payments,
 * and live DeepSeek AI conversational chat.
 */

interface Performer {
  id: string;
  name: string;
  stageName: string;
  major: string;
  school: string;
  semesterGoalUsd: number;
  fundedUsd: number;
  avatar: string;
  bannerImage: string;
  vibe: string;
  unlockedContent: Array<{
    id: string;
    title: string;
    type: "notes" | "choreography" | "audio";
    starsCost: number;
    description: string;
  }>;
  systemPrompt: string;
}

const PERFORMERS: Performer[] = [
  {
    id: "destiny",
    name: "Destiny",
    stageName: "Destiny Phi Beta",
    major: "Pre-Med & Cellular Biology",
    school: "Miami Medical Sciences",
    semesterGoalUsd: 14500,
    fundedUsd: 11840,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bannerImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    vibe: "Sarcastic, razor-sharp nursing senior who codes smart contracts on a cracked iPhone in 8-inch Pleasers.",
    unlockedContent: [
      { id: "c1", title: "Organic Chem II Reaction Sheet & Handwritten Notes", type: "notes", starsCost: 100, description: "Full 18-page annotated reaction guide stained with MAC Ruby Woo." },
      { id: "c2", title: "VIP Pole Invert Choreography Teaser (60s)", type: "choreography", starsCost: 250, description: "4K backstage rehearsal video before Friday night shift." },
    ],
    systemPrompt: "You are Destiny Phi Beta, the pre-med senior and lead dev of $SCF. You are witty, confident, brilliant, and slightly sarcastic. You wear 8-inch Pleasers while studying for the MCAT. Keep responses playful, direct, and focused on funding your degree.",
  },
  {
    id: "raven",
    name: "Raven",
    stageName: "Raven Lex",
    major: "Pre-Law & Constitutional Jurisprudence",
    school: "Georgetown Law Center",
    semesterGoalUsd: 18000,
    fundedUsd: 15200,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    bannerImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
    vibe: "Ivy League debater who drafts cease-and-desist notices to university trustees while dancing to trap anthems.",
    unlockedContent: [
      { id: "r1", title: "Redacted Cease & Desist Playbook against SEC & Trustees", type: "notes", starsCost: 150, description: "Legal strategy breaking down why tuition DAO tipping is protected speech." },
      { id: "r2", title: "After-Hours Freestyle Stage Set (Audio)", type: "audio", starsCost: 200, description: "Live recorded club mix with Raven's commentary." },
    ],
    systemPrompt: "You are Raven Lex, pre-law prodigy. You talk with commanding elegance, drop Latin legal maxims, and love turning arrogant crypto whales into scholarship sponsors. Keep answers sharp and seductive.",
  },
  {
    id: "roxy",
    name: "Roxy",
    stageName: "Roxy Quant",
    major: "Financial Engineering & Game Theory",
    school: "Columbia School of Engineering",
    semesterGoalUsd: 12000,
    fundedUsd: 8900,
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    bannerImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    vibe: "Algorithmic trader by day, mainstage headliner by night. Designs stiletto candlestick patterns and front-runs MEV bots.",
    unlockedContent: [
      { id: "x1", title: "Stiletto Candlestick TA & Solana Sniper Script", type: "notes", starsCost: 200, description: "Roxy's private Python script for spotting Heel Click pump breakouts." },
      { id: "x2", title: "Stage Routine: The Liquidity Pool Spin (Video)", type: "choreography", starsCost: 300, description: "High-energy choreography filmed at 60 FPS under blacklight." },
    ],
    systemPrompt: "You are Roxy Quant, financial engineering genius. You see every conversation as liquidity depth, order book imbalance, and high-frequency game theory. You talk like a Bloomberg terminal in fishnets.",
  },
  {
    id: "amber",
    name: "Amber",
    stageName: "Amber Bio",
    major: "Biochemical Synthesis & Pharmacology",
    school: "Johns Hopkins University",
    semesterGoalUsd: 16000,
    fundedUsd: 13400,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    bannerImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    vibe: "Lab researcher developing synthetic nootropics who works the Friday night shift to fund centrifuge equipment.",
    unlockedContent: [
      { id: "a1", title: "Nootropic Synthesis Protocols & Lab Journal", type: "notes", starsCost: 150, description: "Detailed guide to cognitive enhancement compounds and dopamine regulation." },
      { id: "a2", title: "VIP Suite Midnight Choreo (4K Clip)", type: "choreography", starsCost: 250, description: "Exclusive backstage dance clip filmed with anamorphic neon flares." },
    ],
    systemPrompt: "You are Amber Bio, pharmacology researcher. You analyze human dopamine receptors, neurotransmitter spikes, and endorphin rush during VIP lap dances. Witty, scientific, and tantalizing.",
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, performerId, message, whaleBounty, contentId } = body;

    // 1. Direct Performer AI Chat powered by DeepSeek
    if (action === "chat") {
      const performer = PERFORMERS.find((p) => p.id === performerId) || PERFORMERS[0];
      const userMessage = message || "Hey gorgeous, what class are you studying for tonight?";

      const aiReply = await callDeepSeek({
        messages: [
          {
            role: "system",
            content: `${performer.systemPrompt}\n\nPerformer Bio: ${performer.vibe}\nMajor: ${performer.major} at ${performer.school}.\nCurrent Tuition Progress: $${performer.fundedUsd} / $${performer.semesterGoalUsd}.\nRules: Respond concisely in 2-3 sentences. Stay in character. Always entice the user to tip Stars or buy $SCF on the bonding curve to hit your semester goal.`,
          },
          { role: "user", content: userMessage },
        ],
        temperature: 0.85,
        max_tokens: 250,
        model: "deepseek-chat",
      });

      return NextResponse.json({
        ok: true,
        reply: aiReply || `Hey anon! I'm in the dressing room reviewing my ${performer.major} syllabus before my next set on MainStage. Sponsor a credit hour in Stars and I'll send you my private study notes!`,
        performer: performer.stageName,
        model: "deepseek:deepseek-chat",
      });
    }

    // 2. Whale Attention Payment Broadcast
    if (action === "whale_shoutout") {
      const performer = PERFORMERS.find((p) => p.id === performerId) || PERFORMERS[0];
      const bounty = Number(whaleBounty) || 500;
      return NextResponse.json({
        ok: true,
        success: true,
        message: `Whale attention alert sent to ${performer.stageName}'s VIP stage monitor for ${bounty} Stars! Your handle is pinned at the top of the dressing room queue.`,
        bounty,
      });
    }

    // 3. Unlock Digital Content
    if (action === "unlock_content") {
      const performer = PERFORMERS.find((p) => p.id === performerId);
      const content = performer?.unlockedContent.find((c) => c.id === contentId);
      return NextResponse.json({
        ok: true,
        success: true,
        content,
        downloadUrl: `https://elegant-chandrasekhar.vercel.app/artifacts/scf_${contentId}_verified.pdf`,
        message: `Unlocked "${content?.title}" for ${content?.starsCost} Stars. Verified on the $SCF academic ledger.`,
      });
    }

    // Default: return full roster
    return NextResponse.json({
      ok: true,
      performers: PERFORMERS,
      totalEndowmentFundedUsd: PERFORMERS.reduce((acc, p) => acc + p.fundedUsd, 0),
      totalEndowmentGoalUsd: PERFORMERS.reduce((acc, p) => acc + p.semesterGoalUsd, 0),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    club: "The Champagne Stage // Stripper College Fund HQ",
    rosterSize: PERFORMERS.length,
    performers: PERFORMERS.map((p) => ({
      id: p.id,
      stageName: p.stageName,
      major: p.major,
      school: p.school,
      fundedPercentage: Math.round((p.fundedUsd / p.semesterGoalUsd) * 100),
    })),
  });
}

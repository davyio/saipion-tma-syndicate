"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  Play,
  ArrowRight,
  ExternalLink,
  Share2,
  Terminal,
  Activity,
  Flame,
  CheckCircle2,
  Layers,
  Sparkles,
  Cpu,
  Scissors,
  Zap,
  Crosshair,
  Trophy,
  Crown,
  Skull,
  Swords,
  Users,
  Eye,
  MessageCircle,
  FileCheck,
  Lock,
  FileText,
  Sliders,
  Moon,
  Package,
  Kanban,
  Trello,
  GraduationCap,
  QrCode,
  Coins,
  Scale,
  Bot,
  Radar,
} from "lucide-react";
import { sensory } from "@/lib/sensory";

export default function EcosystemDashboard() {
  const BOT_HANDLE = "saipion_bot";
  const APP_URL = "https://elegant-chandrasekhar.vercel.app";
  const SHARE_TEXT = encodeURIComponent(
    "⚡ Just accessed the Saipion Syndicate TMA Tollbooth Engine on Telegram! Explore 30 live cash-flow apps:"
  );
  const SHARE_URL = `https://t.me/share/url?url=${encodeURIComponent(APP_URL)}&text=${SHARE_TEXT}`;

  const [activeFilter, setActiveFilter] = useState<"ALL" | "SCF" | "TRELLO" | "APPLE" | "INFRA" | "AMBUSH" | "WEB3" | "VIRAL">("ALL");

  const apps = [
    // Flagship Meme Ecosystem: Stripper College Fund ($SCF)
    {
      id: "APP-30",
      name: "The Champagne Stage",
      path: "/champagne-stage",
      category: "SCF",
      badge: "DEGEN SPOT & HONEY POT",
      tollbooth: "50-500 Stars & Whale Desk",
      icon: Flame,
      color: "text-pink-400 bg-pink-950/80 border-pink-500 shadow-[0_0_15px_rgba(255,0,127,0.3)]",
      desc: "Strip club degen spot: browse student performer roster, fund tuition goals, unlock private study/dance teasers, and 1-on-1 DeepSeek AI chat.",
    },
    {
      id: "APP-24",
      name: "Stripper College Fund ($SCF)",
      path: "/scf-terminal",
      category: "SCF",
      badge: "TUITION DESK",
      tollbooth: "50-500 Stars Tipping",
      icon: GraduationCap,
      color: "text-pink-400 bg-pink-950/80 border-pink-700 shadow-sm",
      desc: "Decentralized Academic Endowment terminal with live ticking tuition counter, shift change clock, and Star micro-grants.",
    },
    {
      id: "APP-28",
      name: "ElizaOS Agent Swarm",
      path: "/eliza-agents",
      category: "SCF",
      badge: "AUTONOMOUS AI",
      tollbooth: "OpenRouter & Heuristic Swarm",
      icon: Bot,
      color: "text-pink-300 bg-pink-950/80 border-pink-600 shadow-sm",
      desc: "24/7 autonomous agents (Destiny, Big Mike Bouncer, Simp Sweeper) running on X & Telegram to pump liquidity.",
    },
    {
      id: "APP-25",
      name: "The Velvet Rope VIP Gate",
      path: "/velvet-rope",
      category: "SCF",
      badge: "VIP CREDENTIAL",
      tollbooth: "100 Stars ($2.00)",
      icon: QrCode,
      color: "text-amber-400 bg-amber-950/80 border-amber-700",
      desc: "Bouncer security check requiring 10,000 $SCF balance or 100 Stars cover charge for private Champagne Room pass.",
    },
    {
      id: "APP-26",
      name: "Make It Rain: Pleaser Tap",
      path: "/pleaser-tap",
      category: "SCF",
      badge: "TAP-TO-EARN",
      tollbooth: "50-100 Star Boosts",
      icon: Coins,
      color: "text-pink-300 bg-purple-950/80 border-pink-700",
      desc: "Hyper-addictive 8-inch Pleaser tap clicker with flying singles, heel upgrades, and Champagne Room multipliers.",
    },
    {
      id: "APP-27",
      name: "The Redacted Syllabus",
      path: "/redacted-syllabus",
      category: "SCF",
      badge: "C&D GENERATOR",
      tollbooth: "Viral Twitter Ammunition",
      icon: Scale,
      color: "text-rose-400 bg-rose-950/80 border-rose-700",
      desc: "Generates official Ivy League Cease & Desist letters alleging doctoral regalia violations to ignite Twitter raids.",
    },

    // Flagship: ATLAS OS (Apple Ceramic White Trello TMA)
    {
      id: "APP-23",
      name: "ATLAS OS (Trello TMA)",
      path: "/atlas-board",
      category: "TRELLO",
      badge: "CERAMIC WHITE",
      tollbooth: "Star Bounties & Collab",
      icon: Trello,
      color: "text-neutral-900 bg-white border-neutral-300 shadow-sm",
      desc: "Production-ready Apple ceramic silver Trello platform with 1-tap Telegram invites, role permissions, checklists, and Star bounties.",
    },

    // Mission Control Command Board
    {
      id: "APP-22",
      name: "Launchpad Mission Control",
      path: "/launch-board",
      category: "TRELLO",
      badge: "TOKEN LAUNCH OS",
      tollbooth: "Campaign Engine",
      icon: Kanban,
      color: "text-emerald-400 bg-emerald-950/80 border-emerald-700",
      desc: "Asymmetric Trello-grade coordination board for narrative virality, multi-account distribution, and KOL outreach.",
    },

    // Apple Minimalist Ventures (Jony Ive / Steve Jobs Ethos)
    {
      id: "APP-17",
      name: "AURA Life Capsule",
      path: "/aura-vault",
      category: "APPLE",
      badge: "ZERO-KNOWLEDGE",
      tollbooth: "1,200 Stars ($24)",
      icon: Lock,
      color: "text-neutral-100 bg-neutral-950 border-neutral-700",
      desc: "Executive life capsule for emergency seed phrases, dead-man succession, and corporate mandates.",
    },
    {
      id: "APP-18",
      name: "CHRONOS Board",
      path: "/chronos-board",
      category: "APPLE",
      badge: "ASYNCHRONOUS GOV",
      tollbooth: "250 Stars ($5.00)",
      icon: FileText,
      color: "text-neutral-100 bg-neutral-950 border-neutral-700",
      desc: "Quiet editorial decision room for syndicates and boards. Binding signed resolutions in seconds.",
    },
    {
      id: "APP-19",
      name: "MONOLITH Escrow",
      path: "/monolith-desk",
      category: "APPLE",
      badge: "DARK POOL DESK",
      tollbooth: "500 Stars / 15 bps",
      icon: Sliders,
      color: "text-neutral-100 bg-neutral-950 border-neutral-700",
      desc: "Institutional dark pool cross-border settlement desk with tactile slide-to-settle escrow.",
    },
    {
      id: "APP-20",
      name: "SILENCE Sanctuary",
      path: "/silence-focus",
      category: "APPLE",
      badge: "40HZ GAMMA FLOW",
      tollbooth: "100 Stars Stake",
      icon: Moon,
      color: "text-neutral-100 bg-neutral-950 border-neutral-700",
      desc: "Cognitive sanctuary with synthesized binaural soundscapes and peer-synchronized focus stakes.",
    },
    {
      id: "APP-21",
      name: "ATELIER Artifacts",
      path: "/atelier-drops",
      category: "APPLE",
      badge: "PHYSICAL DROPS",
      tollbooth: "250 Stars VIP",
      icon: Package,
      color: "text-neutral-100 bg-neutral-950 border-neutral-700",
      desc: "Curated micro-lot luxury physical objects paired with cryptographic digital twins on TON.",
    },

    // Phase 1: Infrastructure
    {
      id: "APP-01",
      name: "The Identity Node",
      path: "/app-auth",
      category: "INFRA",
      badge: "HMAC-SHA256",
      tollbooth: "Auth & Sync",
      icon: ShieldCheck,
      color: "text-cyan-400 bg-cyan-950/60 border-cyan-800",
      desc: "Cryptographic validation of Telegram initData & stateless Supabase user sync.",
    },
    {
      id: "APP-02",
      name: "The Tollbooth Protocol",
      path: "/star-buster",
      category: "INFRA",
      badge: "LIVE XTR",
      tollbooth: "10-100 Stars",
      icon: Star,
      color: "text-amber-400 bg-amber-950/60 border-amber-800",
      desc: "Live 1-click microtransactions via Apple/Google Pay with instant receipt audit.",
    },
    {
      id: "APP-03",
      name: "The Adsgram Gate",
      path: "/ad-gate",
      category: "INFRA",
      badge: "HYBRID READY",
      tollbooth: "Ad or 1-Star Bypass",
      icon: Play,
      color: "text-fuchsia-400 bg-fuchsia-950/60 border-fuchsia-800",
      desc: "Rewarded video ad monetization with 1-Star microtransaction VIP skip.",
    },
    {
      id: "APP-29",
      name: "Handle Radar (Layer 1 OSINT)",
      path: "/handle-radar",
      category: "INFRA",
      badge: "RECON ENGINE",
      tollbooth: "25-Star Pro Audit",
      icon: Radar,
      color: "text-cyan-400 bg-cyan-950/60 border-cyan-800",
      desc: "Instant multi-platform social handle availability scanner, permutation generator, and CSV export.",
    },

    // Phase 2: AI Ambush
    {
      id: "APP-04",
      name: "The Visual Ambush",
      path: "/render-trap",
      category: "AMBUSH",
      badge: "4K GPU",
      tollbooth: "50 Stars ($1.00)",
      icon: Sparkles,
      color: "text-orange-400 bg-orange-950/60 border-orange-800",
      desc: "Fal.ai serverless GPU product photography behind high-res watermark paywall.",
    },
    {
      id: "APP-05",
      name: "The Doxx-Radar",
      path: "/osint-radar",
      category: "AMBUSH",
      badge: "OSINT RADAR",
      tollbooth: "100 Stars ($2.00)",
      icon: Eye,
      color: "text-rose-400 bg-rose-950/60 border-rose-800",
      desc: "Public breach scanner unmasking exposed credentials, hash salts & IP logs.",
    },
    {
      id: "APP-06",
      name: "The Contract Slayer",
      path: "/legal-blade",
      category: "AMBUSH",
      badge: "LEGAL AI",
      tollbooth: "250 Stars ($5.00)",
      icon: FileCheck,
      color: "text-blue-400 bg-blue-950/60 border-blue-800",
      desc: "Detects unilateral liability clauses and outputs protective counter-amendments.",
    },
    {
      id: "APP-07",
      name: "The VibeSync Companion",
      path: "/parasocial-core",
      category: "AMBUSH",
      badge: "OPENROUTER AI",
      tollbooth: "150 Stars ($3.00)",
      icon: MessageCircle,
      color: "text-pink-400 bg-pink-950/60 border-pink-800",
      desc: "Uncensored, hyper-empathetic emotional AI companion with 10-message free quota.",
    },

    // Phase 3: Web3 & Scalers
    {
      id: "APP-08",
      name: "The Sybil Tasker",
      path: "/airdrop-farm",
      category: "WEB3",
      badge: "AUTO-PILOT",
      tollbooth: "100 Stars ($2.00)",
      icon: Cpu,
      color: "text-cyan-400 bg-cyan-950/60 border-cyan-800",
      desc: "Multi-chain airdrop qualification radar with anti-sybil randomized transaction bot.",
    },
    {
      id: "APP-09",
      name: "The Watermark Assassin",
      path: "/content-wash",
      category: "WEB3",
      badge: "HASH MUTATOR",
      tollbooth: "50 Stars / Ad",
      icon: Scissors,
      color: "text-emerald-400 bg-emerald-950/60 border-emerald-800",
      desc: "TikTok/Reels watermark scrub & cryptographic byte hash mutation to kill shadowbans.",
    },
    {
      id: "APP-10",
      name: "The Zero-DTE Pool",
      path: "/flash-casino",
      category: "WEB3",
      badge: "60s BINARY",
      tollbooth: "3% House Rake",
      icon: Zap,
      color: "text-yellow-400 bg-yellow-950/60 border-yellow-800",
      desc: "High-frequency 60-second BTC prediction market with automated house rake.",
    },

    // Category 2: Viral Arbitrage
    {
      id: "APP-11",
      name: "TrenchRadar",
      path: "/trench-radar",
      category: "VIRAL",
      badge: "PUMP.FUN SCAN",
      tollbooth: "25 Stars ($0.50)",
      icon: Crosshair,
      color: "text-purple-400 bg-purple-950/60 border-purple-800",
      desc: "Live DexScreener Solana rug radar unmasking dev wallet clusters & snipers.",
    },
    {
      id: "APP-12",
      name: "Stars Ranker",
      path: "/stars-ranker",
      category: "VIRAL",
      badge: "CLOUT LEADERBOARD",
      tollbooth: "50-1000 Stars",
      icon: Trophy,
      color: "text-yellow-400 bg-yellow-950/60 border-yellow-800",
      desc: "Major-style global flex leaderboard with Star boost packs and viral share links.",
    },
    {
      id: "APP-13",
      name: "The Pinned Throne",
      path: "/king-throne",
      category: "VIRAL",
      badge: "AUCTION RAKE",
      tollbooth: "10% House Cut",
      icon: Crown,
      color: "text-amber-400 bg-amber-950/60 border-amber-800",
      desc: "Continuous King of the Hill auction to pin promotional broadcasts across the syndicate.",
    },
    {
      id: "APP-14",
      name: "AI Degen Roast",
      path: "/clout-roast",
      category: "VIRAL",
      badge: "VIRAL ROAST",
      tollbooth: "50 Stars ($1.00)",
      icon: Skull,
      color: "text-red-400 bg-red-950/60 border-red-800",
      desc: "Brutal AI analysis of Telegram handles and bios with shareable story scorecards.",
    },
    {
      id: "APP-15",
      name: "Burn Arena PvP",
      path: "/burn-arena",
      category: "VIRAL",
      badge: "COIN BATTLE",
      tollbooth: "5% House Rake",
      icon: Swords,
      color: "text-emerald-400 bg-emerald-950/60 border-emerald-800",
      desc: "Telegram group meme coin war where holders burn Stars to strike rival coins.",
    },
    {
      id: "APP-16",
      name: "Group Partner Portal",
      path: "/affiliate-portal",
      category: "VIRAL",
      badge: "PARTNER REV-SHARE",
      tollbooth: "30% Lifetime Cut",
      icon: Users,
      color: "text-teal-400 bg-teal-950/60 border-teal-800",
      desc: "30% lifetime revenue sharing portal for Telegram group admins & channel owners.",
    },
  ];

  const filteredApps = activeFilter === "ALL" ? apps : apps.filter((a) => a.category === activeFilter);

  return (
    <div className="flex flex-col gap-6">
      {/* Ecosystem Telemetry Command Banner */}
      <header className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Syndicate Command // Live Telemetry
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
              29/29 ONLINE
            </span>
          </div>
        </div>

        <div className="mt-3">
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            The Saipion Syndicate
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            29-App Telegram Mini App Cash-Flow &amp; Asymmetric Work OS
          </p>
        </div>

        {/* Real-time Infrastructure Badges */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-mono">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase">Telegram Node</span>
            <a
              href={`https://t.me/${BOT_HANDLE}`}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 font-bold flex items-center gap-1 hover:underline mt-0.5"
            >
              @{BOT_HANDLE} <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase">Stars Tollbooth</span>
            <span className="text-amber-400 font-bold mt-0.5 flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400" /> XTR Live Active
            </span>
          </div>
        </div>

        {/* Viral Growth Hook */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500">
            Viral Distribution Loop:
          </span>
          <a
            href={SHARE_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold bg-cyan-950/50 border border-cyan-800/60 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Share2 className="w-3 h-3" /> Share Matrix to Telegram
          </a>
        </div>
      </header>

      {/* Category Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        {[
          { key: "ALL", label: "All 30 Plays" },
          { key: "SCF", label: "👠 $SCF Lore (6)" },
          { key: "TRELLO", label: "Trello TMA (2)" },
          { key: "APPLE", label: "Apple Minimal (5)" },
          { key: "INFRA", label: "Infrastructure (4)" },
          { key: "AMBUSH", label: "AI Ambush (4)" },
          { key: "WEB3", label: "Web3 Scalers (3)" },
          { key: "VIRAL", label: "Viral Arbitrage (6)" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveFilter(tab.key as any);
              sensory.tick();
            }}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg border transition-all ${
              activeFilter === tab.key
                ? "bg-white text-black font-bold border-white"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* App Grid */}
      <div className="flex flex-col gap-3">
        {filteredApps.map((app) => {
          const Icon = app.icon;
          return (
            <Link
              key={app.id}
              href={app.path}
              onClick={() => sensory.tick()}
              className="group block p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-lg hover:shadow-cyan-500/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg border ${app.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{app.name}</h3>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 rounded">
                        {app.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 font-mono text-xs">
                      <span className="text-slate-500 text-[10px]">{app.id}</span>
                      <span className="text-slate-400 text-[10px]">{app.path}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  <span className="text-[10px] font-mono text-amber-400 font-bold mt-2">
                    {app.tollbooth}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-sans">
                {app.desc}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Strategic Operational Advantage */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex flex-col gap-2">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Syndicate Operational Advantage
        </span>
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          All 30 apps are wired to the unified Omni-Hook Telegram router (<code className="text-cyan-300">/api/telegram-handler</code>), authenticated via cryptographic HMAC-SHA256, and monetized via Telegram Stars (XTR) 1-click checkout, Adsgram rewarded video ads, and 30% group affiliate rev-share.
        </p>
      </div>
    </div>
  );
}

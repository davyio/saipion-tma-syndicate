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
} from "lucide-react";

export default function EcosystemDashboard() {
  const BOT_HANDLE = "saipion_bot";
  const APP_URL = "https://elegant-chandrasekhar.vercel.app";
  const SHARE_TEXT = encodeURIComponent(
    "⚡ Just accessed the Saipion Syndicate TMA Tollbooth Engine on Telegram! Try it now:"
  );
  const SHARE_URL = `https://t.me/share/url?url=${encodeURIComponent(APP_URL)}&text=${SHARE_TEXT}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Ecosystem Telemetry Command Banner */}
      <header className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

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
              100% ONLINE
            </span>
          </div>
        </div>

        <div className="mt-3">
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            The Saipion Syndicate
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            48-Hour Velocity TMA Cash-Flow Tollbooth Engine
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
            <Share2 className="w-3 h-3" /> Share to Telegram Chat
          </a>
        </div>
      </header>

      {/* PHASE 1: THE PLUMBING (100% OPERATIONAL) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Phase 1: The Plumbing (Operational)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
            3/3 READY
          </span>
        </div>

        {/* App 1 Card */}
        <Link
          href="/app-auth"
          className="group block p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all shadow-lg hover:shadow-cyan-500/5"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-950/50 border border-cyan-800/60 text-cyan-400 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">App 1: The Identity Node</h3>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 rounded">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">/app-auth</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all mt-1" />
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            Cryptographic HMAC-SHA256 health check on Telegram <code className="text-cyan-300">initData</code> & stateless Supabase user sync.
          </p>
        </Link>

        {/* App 2 Card */}
        <Link
          href="/star-buster"
          className="group block p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all shadow-lg hover:shadow-amber-500/5"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-800/60 text-amber-400 group-hover:scale-105 transition-transform">
                <Star className="w-5 h-5 fill-amber-400/20" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">App 2: The Tollbooth Protocol</h3>
                  <span className="text-[9px] font-mono text-amber-400 bg-amber-950 border border-amber-800 px-1.5 rounded">
                    LIVE XTR
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">/star-buster</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all mt-1" />
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            Telegram Stars (XTR) 1-click checkout testing live Virtual Coffee microtransactions and receipt logging.
          </p>
        </Link>

        {/* App 3 Card */}
        <Link
          href="/ad-gate"
          className="group block p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-fuchsia-500/50 transition-all shadow-lg hover:shadow-fuchsia-500/5"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-fuchsia-950/50 border border-fuchsia-800/60 text-fuchsia-400 group-hover:scale-105 transition-transform">
                <Play className="w-5 h-5 fill-fuchsia-400/20" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">App 3: The Adsgram Gate</h3>
                  <span className="text-[9px] font-mono text-fuchsia-400 bg-fuchsia-950 border border-fuchsia-800 px-1.5 rounded">
                    HYBRID READY
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">/ad-gate</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-fuchsia-400 group-hover:translate-x-0.5 transition-all mt-1" />
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            Alternative monetization validation: rewarded video ad gate with 1-Star instant VIP bypass.
          </p>
        </Link>
      </section>

      {/* PHASE 2: THE AMBUSH MODULES (NEXT SPRINT) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Phase 2: The Ambush Modules
            </h2>
          </div>
          <span className="text-[10px] font-mono text-orange-400 bg-orange-950/60 border border-orange-800/60 px-2 py-0.5 rounded-full">
            NEXT TARGET
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
            <span className="text-orange-400 font-bold">/render-trap</span>
            <span className="text-[11px] text-slate-400">Fal.ai 4K Studio Renders</span>
            <span className="text-[10px] text-slate-500">50 Stars ($1) Unlock</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
            <span className="text-orange-400 font-bold">/osint-radar</span>
            <span className="text-[11px] text-slate-400">Breach Password Scans</span>
            <span className="text-[10px] text-slate-500">100 Stars ($2) Unlock</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
            <span className="text-slate-400 font-bold">/legal-blade</span>
            <span className="text-[11px] text-slate-400">Contract Trap Slayer</span>
            <span className="text-[10px] text-slate-500">$5 Stars Counter-Offer</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-1">
            <span className="text-slate-400 font-bold">/parasocial-core</span>
            <span className="text-[11px] text-slate-400">Uncensored AI Roleplay</span>
            <span className="text-[10px] text-slate-500">$29/mo Sub Gate</span>
          </div>
        </div>
      </section>

      {/* PHASE 3: LEVIATHAN SCALERS */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Phase 3: The Leviathan Scalers (Web3)
          </h2>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-mono text-slate-400 flex justify-between items-center">
          <span>/airdrop-farm // /content-wash // /flash-casino</span>
          <span className="text-[10px] text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
            QUEUED
          </span>
        </div>
      </section>

      {/* Strategic Anti-Failure Protocol */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex flex-col gap-2">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Syndicate Competitive Edge
        </span>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          While typical Web3/TMA teams spend months on roadmaps and fail from lack of revenue, the Saipion Syndicate enforces the <strong>48-Hour Velocity &amp; 24-Hour Guillotine</strong>: instantaneous monetization tollbooths deployed across a unified Omni-Hook edge router.
        </p>
      </div>
    </div>
  );
}

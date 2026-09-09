import Link from "next/link";
import { ShieldCheck, Zap, Lock, Terminal, ArrowRight, Star, Database } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
              Saipion Syndicate v2.0
            </span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
            Omni-Hook Active
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-2">
          TMA Tollbooth Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Hyper-lean 48-hour cash-flow interceptors for Telegram Mini Apps.
        </p>
      </header>

      {/* Phase 1: The Plumbing (Active) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Phase 1: The Plumbing (Unit Tests)
          </h2>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-1.5 py-0.5 rounded">
            2/3 Ready
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
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800/80 px-1.5 rounded">
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  /app-auth
                </p>
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
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950 border border-amber-800/80 px-1.5 rounded">
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  /star-buster
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all mt-1" />
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            Telegram Stars (XTR) 1-click checkout testing live Virtual Coffee microtransactions and receipt logging.
          </p>
        </Link>

        {/* App 3 (Queued) */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 opacity-60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-slate-800/40 text-slate-500">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-400">App 3: The Adsgram Gate</h3>
                <p className="text-xs text-slate-600 font-mono">/ad-gate</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
              QUEUED
            </span>
          </div>
        </div>
      </section>

      {/* Backend Infrastructure Overview */}
      <section className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col gap-3">
        <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          Unified Architecture Spec
        </h2>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Omni-Hook Router</span>
            <span className="text-slate-300 font-semibold">/api/telegram-handler</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Stars Currency</span>
            <span className="text-amber-400 font-semibold">XTR (Telegram Stars)</span>
          </div>
        </div>
      </section>
    </div>
  );
}

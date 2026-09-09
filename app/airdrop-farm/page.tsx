"use client";

import { useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { ArrowLeft, Cpu, Star, Lock, CheckCircle2, AlertTriangle, Play, RefreshCw, Zap, ShieldCheck } from "lucide-react";

export default function AirdropFarmPage() {
  const { user, triggerHaptic, triggerNotificationHaptic, openInvoice } = useTelegram();
  const [walletAddress, setWalletAddress] = useState<string>("0x71C...B290");
  const [chain, setChain] = useState<string>("EVM / Monad / Bera");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const STARS_PRICE = 100; // $2.00 Auto-Pilot License

  const handleScan = async (unlockedState = isUnlocked) => {
    setLoading(true);
    triggerHaptic("heavy");

    try {
      const res = await fetch("/api/modules/airdrop-farm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: walletAddress || "0x71C...B290",
          chain,
          isUnlocked: unlockedState,
        }),
      });
      const data = await res.json();
      setResults(data);
    } catch {
      // Mock fallback
    } finally {
      setLoading(false);
      triggerNotificationHaptic("success");
    }
  };

  const handleUnlockAutoPilot = async () => {
    triggerHaptic("heavy");
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: STARS_PRICE,
          title: "Sybil Auto-Pilot 30-Day Pass",
          description: "Runs randomized daily testnet interactions across Monad, Berachain, and Linea.",
          app_module: "airdrop-farm",
          userId: user?.id || 777000123,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            setIsUnlocked(true);
            handleScan(true);
            triggerNotificationHaptic("success");
          }
        });
      } else {
        setIsUnlocked(true);
        handleScan(true);
      }
    } catch {
      setIsUnlocked(true);
      handleScan(true);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
          APP-08 // SYBIL TASKER
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">The Sybil Tasker</h1>
            <p className="text-xs text-slate-400">Anti-Sybil radar and randomized auto-pilot testnet transaction bot.</p>
          </div>
        </div>
      </div>

      {/* Wallet Target Input */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Target Wallet / ENS / Public Key</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x... or UQC..."
            className="flex-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <button
            onClick={() => handleScan(isUnlocked)}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Scan
          </button>
        </div>
      </div>

      {/* Results View */}
      {results && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          {/* Eligibility Metrics */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/50 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Airdrop Score</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">{results.eligibilityScore} / 100</span>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-500 uppercase block">Anti-Sybil Tier</span>
              <span className="text-xs font-bold text-emerald-400">{results.rankTier}</span>
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Target Campaigns</span>
            {results.campaigns.map((c: any, i: number) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white font-mono">{c.name}</span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.5 rounded">
                    Est: {c.estAirdrop}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Transactions: {c.txCount} TX</span>
                  <span>Sybil Risk: {c.sybilRisk}</span>
                </div>
                <div className="text-[11px] text-slate-300 font-sans bg-slate-950 p-2 rounded border border-slate-800/80 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>{c.nextAction}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Auto-Pilot Tollbooth */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 flex flex-col gap-3 shadow-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white font-mono">Sybil-Proof Auto-Pilot Bot</span>
              </div>
              <span className="text-amber-400 font-bold font-mono text-xs flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {STARS_PRICE} Stars ($2)
              </span>
            </div>

            {results.isUnlocked ? (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/60 font-mono text-[11px] text-emerald-300 flex flex-col gap-1.5">
                <span className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> AUTO-PILOT RUNNING
                </span>
                <span className="text-[10px] text-slate-300">Schedule: {results.autoPilotStatus.dailySchedule}</span>
                <span className="text-[10px] text-slate-300">Next Action: {results.autoPilotStatus.nextTrigger}</span>
                <span className="text-[10px] text-slate-400">Relayer: {results.autoPilotStatus.proxyIp}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Automate randomized multi-contract interactions daily via Poisson-distribution to guarantee airdrop qualification without Sybil blacklisting.
                </p>
                <button
                  onClick={handleUnlockAutoPilot}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  Activate 30-Day Auto-Pilot ({STARS_PRICE} Stars)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

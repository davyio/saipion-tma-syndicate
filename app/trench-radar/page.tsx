"use client";

import { useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { ArrowLeft, Crosshair, Star, ShieldAlert, Lock, Unlock, ExternalLink, RefreshCw, Flame } from "lucide-react";

export default function TrenchRadarPage() {
  const { user, triggerHaptic, triggerNotificationHaptic, openInvoice } = useTelegram();
  const [tokenAddress, setTokenAddress] = useState<string>("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const STARS_PRICE = 25; // $0.50 fast degen micro-tollbooth

  const handleScan = async (unlockedState = isUnlocked) => {
    setLoading(true);
    triggerHaptic("heavy");

    try {
      const res = await fetch("/api/modules/trench-radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenAddress: tokenAddress || "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
          isUnlocked: unlockedState,
        }),
      });
      const data = await res.json();
      setResults(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
      triggerNotificationHaptic("warning");
    }
  };

  const handleUnlockAudit = async () => {
    triggerHaptic("heavy");
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: STARS_PRICE,
          title: "Unmask Dev Clusters & Snipers",
          description: "Reveals connected dev wallets, past abandoned tokens, and block 0 snipers.",
          app_module: "trench-radar",
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
        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800 px-2 py-0.5 rounded">
          APP-11 // TRENCH RADAR
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-800 text-purple-400">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">TrenchRadar</h1>
            <p className="text-xs text-slate-400">Live DexScreener Solana/Pump.fun dev wallet cluster and sniper detector.</p>
          </div>
        </div>
      </div>

      {/* Token Address Input */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Solana Token Mint or Pump.fun Link</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="DezX... or mint address"
            className="flex-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
          />
          <button
            onClick={() => handleScan(isUnlocked)}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Scan
          </button>
        </div>
      </div>

      {/* Results View */}
      {results && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          {/* Token Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/50 flex flex-col gap-3 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">{results.tokenData.name}</span>
                  <span className="text-xs font-mono text-purple-400">${results.tokenData.symbol}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">DEX: {results.tokenData.dexId?.toUpperCase()}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-400">${results.tokenData.priceUsd}</span>
                <span className="text-[10px] font-mono text-slate-400 block">FDV: ${results.tokenData.fdv?.toLocaleString()}</span>
              </div>
            </div>

            {/* Risk Gauge */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Rug Risk Rating</span>
                <span className="text-base font-black text-rose-400 font-mono">{results.riskLevel}</span>
              </div>
              <span className="text-xl font-black text-rose-500 font-mono">{results.riskScore}/100</span>
            </div>
          </div>

          {/* Dev Cluster Audit */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">On-Chain Cluster Forensics</span>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Dev Supply Control:</span>
                <span className="text-amber-400">{results.devAudit.holdingPercentage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Liquidity Status:</span>
                <span className="text-emerald-400">{results.devAudit.lpBurned}</span>
              </div>

              {/* Dev Past Dumps */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Developer Historical Roster:</span>
                <div className={`p-2.5 rounded-lg border text-[11px] ${
                  isUnlocked ? "bg-rose-950/40 border-rose-800 text-rose-300" : "bg-slate-950 border-slate-800/80 text-slate-500"
                }`}>
                  {results.devAudit.devPastRugsCount}
                </div>
              </div>

              {/* Snipers */}
              <div className="pt-1">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Block 0 Sniper Clusters:</span>
                <div className={`p-2.5 rounded-lg border text-[11px] ${
                  isUnlocked ? "bg-purple-950/40 border-purple-800 text-purple-300" : "bg-slate-950 border-slate-800/80 text-slate-500"
                }`}>
                  {isUnlocked ? results.devAudit.sniperWallets.join(" | ") : "🔒 2 Sniper Wallets Detected (LOCKED)"}
                </div>
              </div>
            </div>
          </div>

          {/* Tollbooth Action */}
          {!isUnlocked && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/40 flex flex-col gap-3 shadow-2xl">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">Unmask Dev Wallet Addresses & Snipers:</span>
                <span className="text-amber-400 font-bold font-mono flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {STARS_PRICE} Stars ($0.50)
                </span>
              </div>
              <button
                onClick={handleUnlockAudit}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
              >
                <Lock className="w-4 h-4" />
                Unmask Serial Rugger Footprint ({STARS_PRICE} Stars)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

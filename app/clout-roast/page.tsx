"use client";

import { useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { ArrowLeft, Flame, Star, Share2, Lock, Sparkles, RefreshCw, Skull, AlertOctagon } from "lucide-react";

export default function CloutRoastPage() {
  const { user, triggerHaptic, triggerNotificationHaptic, openInvoice } = useTelegram();
  const [handle, setHandle] = useState<string>(user?.username ? `@${user.username}` : "@sol_degen");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const STARS_PRICE = 50; // $1.00

  const handleRoast = async (unlockedState = isUnlocked) => {
    setLoading(true);
    triggerHaptic("heavy");

    try {
      const res = await fetch("/api/modules/clout-roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: handle || "@anon",
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

  const handleUnlockAlpha = async () => {
    triggerHaptic("heavy");
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: STARS_PRICE,
          title: "Unfiltered Roast & Portfolio Recovery Alpha",
          description: "Reveals tailored alpha tactics and unwatermarked Telegram Story card.",
          app_module: "clout-roast",
          userId: user?.id || 777000123,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            setIsUnlocked(true);
            handleRoast(true);
            triggerNotificationHaptic("success");
          }
        });
      } else {
        setIsUnlocked(true);
        handleRoast(true);
      }
    } catch {
      setIsUnlocked(true);
      handleRoast(true);
    }
  };

  const shareRoast = () => {
    triggerHaptic("medium");
    const text = encodeURIComponent(
      `💀 AI just roasted my Telegram profile to ashes: "${results?.roastText?.slice(0, 100)}..." Get roasted here:`
    );
    const url = encodeURIComponent("https://t.me/saipion_bot?startapp=roast");
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-red-400 bg-red-950/60 border border-red-800 px-2 py-0.5 rounded">
          APP-14 // CLOUT ROAST
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-red-950/60 border border-red-800 text-red-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">AI Degen Roast</h1>
            <p className="text-xs text-slate-400">Brutal AI roast of your Telegram handle, bio, and crypto bagholding habits.</p>
          </div>
        </div>
      </div>

      {/* Target Input */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Telegram Handle or Bio</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@yourhandle"
            className="flex-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-red-500 font-mono"
          />
          <button
            onClick={() => handleRoast(isUnlocked)}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Roast
          </button>
        </div>
      </div>

      {/* Roast Output Card */}
      {results && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          {/* Main Savage Roast */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-950/50 via-slate-950 to-slate-900 border border-red-800/60 shadow-2xl flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-red-400 font-mono flex items-center gap-1.5">
                <Skull className="w-4 h-4" /> Algorithmic Autopsy for {results.handle}
              </span>
              <button
                onClick={shareRoast}
                className="py-1 px-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-[10px] font-mono flex items-center gap-1 hover:bg-slate-700"
              >
                <Share2 className="w-3 h-3 text-red-400" /> Share
              </button>
            </div>

            <p className="text-xs text-slate-100 font-sans leading-relaxed p-3 rounded-xl bg-slate-950/70 border border-red-900/40">
              "{results.roastText}"
            </p>

            {/* Degen Scorecard Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-slate-500 block">DELUSION INDEX</span>
                <span className="text-rose-400 font-bold text-xs">{results.metrics.delusionIndex}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-slate-500 block">EXIT LIQUIDITY</span>
                <span className="text-amber-400 font-bold text-xs">{results.metrics.exitLiquidityProbability}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-slate-500 block">ALPHA QUOTIENT</span>
                <span className="text-slate-300 font-bold text-xs">{results.metrics.alphaQuotient}</span>
              </div>
            </div>
          </div>

          {/* Actionable Alpha Tollbooth */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5 font-mono">
                <AlertOctagon className="w-4 h-4 text-amber-400" /> Portfolio Recovery Playbook:
              </span>
              {!isUnlocked && (
                <span className="text-amber-400 font-bold font-mono flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {STARS_PRICE} Stars ($1)
                </span>
              )}
            </div>

            {isUnlocked ? (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 font-mono text-xs text-emerald-300 leading-relaxed">
                {results.secretAlpha}
              </div>
            ) : (
              <button
                onClick={handleUnlockAlpha}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
              >
                <Lock className="w-4 h-4" />
                Unlock Unfiltered Tactics & Story Card ({STARS_PRICE} Stars)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

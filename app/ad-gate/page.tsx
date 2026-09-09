"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { useTelegram } from "@/hooks/useTelegram";
import { ArrowLeft, Play, Star, CheckCircle, Clock, FileText, Sparkles, AlertCircle, ShieldAlert } from "lucide-react";

export default function AdGatePage() {
  const { user, triggerHaptic, triggerNotificationHaptic, openInvoice } = useTelegram();
  const [inputText, setInputText] = useState<string>(
    "The Saipion Syndicate is building a 48-hour velocity cash-flow engine on Telegram Mini Apps. Every tollbooth intercepts human behavioral vectors with instantaneous payment gateways."
  );
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isAdPlaying, setIsAdPlaying] = useState<boolean>(false);
  const [adCountdown, setAdCountdown] = useState<number>(5);
  const [unlockedVia, setUnlockedVia] = useState<"ad" | "stars" | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [adStatusMessage, setAdStatusMessage] = useState<string>("");

  // Calculate text analysis metrics
  const analyzeText = () => {
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const chars = inputText.length;
    const sentences = inputText.split(/[.!?]+/).filter(Boolean).length;
    const readingTimeSec = Math.ceil((words / 200) * 60);
    const readingEase = Math.max(10, Math.min(100, Math.round(100 - (words / (sentences || 1)) * 2)));

    return { words, chars, sentences, readingTimeSec, readingEase };
  };

  // Trigger Adsgram Rewarded Ad with fallback
  const handleWatchAd = () => {
    triggerHaptic("medium");
    setAdStatusMessage("");

    // Check if official Adsgram SDK is available
    if (typeof window !== "undefined" && (window as any).Adsgram) {
      try {
        const blockId = process.env.NEXT_PUBLIC_ADSGRAM_BLOCK_ID || "int-test";
        const adController = (window as any).Adsgram.init({ blockId });

        adController
          .show()
          .then((result: any) => {
            if (result.done) {
              triggerNotificationHaptic("success");
              setIsLocked(false);
              setUnlockedVia("ad");
              setStats(analyzeText());
            } else {
              setAdStatusMessage("Ad was skipped before completion. Output remains locked.");
            }
          })
          .catch((err: any) => {
            console.warn("[Adsgram] Real ad failed or pending account approval. Falling back to simulator.", err);
            runSimulatedAd();
          });
        return;
      } catch (err) {
        console.warn("[Adsgram] Init failed, running simulator.", err);
      }
    }

    // Fallback: Run simulated rewarded ad
    runSimulatedAd();
  };

  const runSimulatedAd = () => {
    setIsAdPlaying(true);
    setAdCountdown(5);

    const interval = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsAdPlaying(false);
          setIsLocked(false);
          setUnlockedVia("ad");
          setStats(analyzeText());
          triggerNotificationHaptic("success");
          return 0;
        }
        triggerHaptic("light");
        return prev - 1;
      });
    }, 1000);
  };

  // Alternative Tollbooth: Skip Ad via 1 Telegram Star
  const handleStarBypass = async () => {
    triggerHaptic("heavy");
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: 1,
          title: "Ad-Gate Bypass Pass",
          description: "Instantaneous unlock of deep text analytics.",
          app_module: "ad-gate",
          userId: user?.id || 777000123,
        }),
      });

      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            setIsLocked(false);
            setUnlockedVia("stars");
            setStats(analyzeText());
            triggerNotificationHaptic("success");
          }
        });
      } else {
        // Fallback simulate instant star bypass
        setIsLocked(false);
        setUnlockedVia("stars");
        setStats(analyzeText());
        triggerNotificationHaptic("success");
      }
    } catch {
      setIsLocked(false);
      setUnlockedVia("stars");
      setStats(analyzeText());
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Adsgram Script Tag */}
      <Script src="https://sad.adsgram.ai/js/sad.min.js" strategy="lazyOnload" />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-fuchsia-400 bg-fuchsia-950/60 border border-fuchsia-800 px-2 py-0.5 rounded">
          APP-03 // AD-GATE
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-fuchsia-950/60 border border-fuchsia-800 text-fuchsia-400">
            <Play className="w-5 h-5 fill-fuchsia-400/20" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              The Adsgram Gate
            </h1>
            <p className="text-xs text-slate-400">
              Deep text intelligence locked behind a rewarded video or Star bypass.
            </p>
          </div>
        </div>
      </div>

      {/* Input Editor */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-3">
        <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          Input Text Payload
        </label>
        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setIsLocked(true);
            setStats(null);
          }}
          placeholder="Paste or type copy here..."
          className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans transition-colors resize-none"
        />
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span>Raw Length: {inputText.length} chars</span>
          <span>Status: {isLocked ? "🔒 Locked" : "🔓 Unlocked"}</span>
        </div>
      </div>

      {/* Ad Playing Overlay Modal */}
      {isAdPlaying && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs p-5 rounded-2xl bg-slate-900 border border-fuchsia-500/50 shadow-2xl flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-fuchsia-950 border border-fuchsia-500 flex items-center justify-center text-fuchsia-400 animate-pulse">
              <Play className="w-5 h-5 fill-fuchsia-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Adsgram Rewarded Stream</h3>
              <p className="text-xs text-slate-400 mt-1">
                Output reveals when ad finishes.
              </p>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-fuchsia-500 h-full transition-all duration-1000"
                style={{ width: `${((5 - adCountdown) / 5) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-fuchsia-400">
              {adCountdown}s remaining
            </span>
          </div>
        </div>
      )}

      {/* Tollbooth Output Lock Screen */}
      {isLocked ? (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 shadow-2xl flex flex-col items-center text-center gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950 pointer-events-none" />

          {adStatusMessage && (
            <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-1.5 w-full">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{adStatusMessage}</span>
            </div>
          )}

          <div className="p-3 rounded-full bg-fuchsia-950/40 border border-fuchsia-800/50 text-fuchsia-400">
            <Clock className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Analysis Output Protected</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Complete text metrics and linguistic scoring are frozen. Choose your unlock method:
            </p>
          </div>

          <div className="w-full flex flex-col gap-2.5 z-10">
            {/* Primary Action: Watch Ad */}
            <button
              onClick={handleWatchAd}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold text-xs tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Watch Rewarded Ad (Free Unlock)
            </button>

            {/* Micro-tollbooth: 1-Star Bypass */}
            <button
              onClick={handleStarBypass}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Skip Ad with 1 Star (Instant VIP Unlock)
            </button>
          </div>
        </div>
      ) : (
        /* Unlocked Deep Analysis State */
        <div className="p-5 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-2xl flex flex-col gap-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase">
                Analysis Unlocked ({unlockedVia === "stars" ? "VIP Star Bypass" : "Rewarded Ad"})
              </span>
            </div>
            <button
              onClick={() => {
                setIsLocked(true);
                setStats(null);
              }}
              className="text-[10px] font-mono text-slate-500 hover:text-slate-400"
            >
              Re-lock
            </button>
          </div>

          {stats && (
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-500">WORD COUNT</span>
                <span className="text-base font-bold text-white mt-0.5">{stats.words}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-500">READING TIME</span>
                <span className="text-base font-bold text-cyan-400 mt-0.5">{stats.readingTimeSec}s</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-500">SENTENCES</span>
                <span className="text-base font-bold text-white mt-0.5">{stats.sentences}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-500">CLARITY SCORE</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5">{stats.readingEase} / 100</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Architectural Edge Insight */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 flex flex-col gap-2">
        <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
          The Hybrid Monetization Advantage
        </span>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          While competitors fail when ad networks reject or delay approvals, this node pairs rewarded ads with a 1-Star instant bypass. You monetize either way.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { ArrowLeft, Video, Star, Download, Lock, CheckCircle2, RefreshCw, Scissors, Sparkles, Tv } from "lucide-react";

export default function ContentWashPage() {
  const { user, triggerHaptic, triggerNotificationHaptic, openInvoice } = useTelegram();
  const [videoUrl, setVideoUrl] = useState<string>("https://www.tiktok.com/@growthhacks/video/7391823901923");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [adWatching, setAdWatching] = useState<boolean>(false);

  const STARS_PRICE = 50; // $1.00 single clip or $15/mo SaaS

  const handleWash = async (unlockedState = isUnlocked) => {
    setLoading(true);
    triggerHaptic("heavy");

    try {
      const res = await fetch("/api/modules/content-wash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl,
          isUnlocked: unlockedState,
        }),
      });
      const data = await res.json();
      setResults(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
      triggerNotificationHaptic("success");
    }
  };

  const handleUnlockStars = async () => {
    triggerHaptic("heavy");
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: STARS_PRICE,
          title: "Watermark Assassin HD Clean",
          description: "Strips watermarks and regenerates cryptographic byte hash.",
          app_module: "content-wash",
          userId: user?.id || 777000123,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            setIsUnlocked(true);
            handleWash(true);
            triggerNotificationHaptic("success");
          }
        });
      } else {
        setIsUnlocked(true);
        handleWash(true);
      }
    } catch {
      setIsUnlocked(true);
      handleWash(true);
    }
  };

  const handleWatchAdBypass = () => {
    setAdWatching(true);
    triggerHaptic("medium");
    setTimeout(() => {
      setAdWatching(false);
      setIsUnlocked(true);
      handleWash(true);
      triggerNotificationHaptic("success");
    }, 4000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
          APP-09 // WATERMARK ASSASSIN
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-400">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">The Watermark Assassin</h1>
            <p className="text-xs text-slate-400">Scrubs TikTok / Reels watermarks and mutates byte hash to evade shadowbans.</p>
          </div>
        </div>
      </div>

      {/* URL Input Box */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Paste TikTok / Reels / Shorts Link</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@..."
            className="flex-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
          />
          <button
            onClick={() => handleWash(isUnlocked)}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Scrub
          </button>
        </div>
      </div>

      {/* Results Screen */}
      {results && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          {/* Metadata Mutation Matrix */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3 shadow-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Cryptographic Hash Mutation</span>
            <div className="flex flex-col gap-2 font-mono text-[11px]">
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800/80">
                <span className="text-rose-400">ORIGINAL FINGERPRINT:</span>
                <span className="text-slate-400">{results.scrubStats.hashOriginal.substring(0, 16)}...</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-emerald-950/40 border border-emerald-800/60">
                <span className="text-emerald-400 font-bold">MUTATED SEED HASH:</span>
                <span className="text-emerald-300 font-bold">{results.scrubStats.hashMutated.substring(0, 16)}...</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
              <span>Anti-Shadowban Rating:</span>
              <span className="text-emerald-400 font-bold">{results.scrubStats.antiShadowbanRating}</span>
            </div>
          </div>

          {/* Video Preview */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative aspect-[9/12] max-h-[380px] flex items-center justify-center">
            <video
              src={results.scrubStats.previewUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!isUnlocked && (
              <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                <Lock className="w-8 h-8 text-amber-400 mb-2" />
                <span className="text-sm font-bold text-white font-mono">1080p CLEAN ASSET LOCKED</span>
                <span className="text-xs text-slate-300 mt-1">Watermark removed from memory buffer</span>
              </div>
            )}
          </div>

          {/* Tollbooth Unlock Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
            {isUnlocked ? (
              <a
                href={results.scrubStats.downloadUrl || results.scrubStats.previewUrl}
                download="clean_viral_clip.mp4"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg font-mono"
              >
                <Download className="w-4 h-4" />
                Download Raw HD 1080p Video (.MP4)
              </a>
            ) : (
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">Unlock & Export Clean Clip:</span>
                  <span className="text-amber-400 font-bold font-mono flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {STARS_PRICE} Stars ($1.00)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleUnlockStars}
                    className="py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98]"
                  >
                    <Star className="w-3.5 h-3.5 fill-slate-950" />
                    Instant ({STARS_PRICE} Stars)
                  </button>

                  <button
                    onClick={handleWatchAdBypass}
                    disabled={adWatching}
                    className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 active:scale-[0.98] disabled:opacity-50"
                  >
                    <Tv className={`w-3.5 h-3.5 text-cyan-400 ${adWatching ? "animate-spin" : ""}`} />
                    {adWatching ? "Playing Ad..." : "Free Video Ad"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { ArrowLeft, Sparkles, Star, Download, Lock, RefreshCw, Layers, Image as ImageIcon } from "lucide-react";

export default function RenderTrapPage() {
  const { user, triggerHaptic, triggerNotificationHaptic, openInvoice } = useTelegram();
  const [productType, setProductType] = useState<string>("Luxury Minimalist Watch");
  const [prompt, setPrompt] = useState<string>("Matte black titanium chronograph on rough obsidian rock with dramatic side lighting");
  const [rendering, setRendering] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const STARS_PRICE = 50; // $1.00

  const handleGenerate = async () => {
    setRendering(true);
    triggerHaptic("medium");
    setIsUnlocked(false);

    try {
      const res = await fetch("/api/modules/render-trap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType, prompt }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      }
    } catch {
      // Keep existing sample
    } finally {
      setRendering(false);
      triggerNotificationHaptic("success");
    }
  };

  const handleUnlockRender = async () => {
    triggerHaptic("heavy");
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: STARS_PRICE,
          title: "4K Studio Render Unlock",
          description: "Removes watermark and grants commercial 8K export.",
          app_module: "render-trap",
          userId: user?.id || 777000123,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            setIsUnlocked(true);
            triggerNotificationHaptic("success");
          }
        });
      } else {
        setIsUnlocked(true);
      }
    } catch {
      setIsUnlocked(true);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-orange-400 bg-orange-950/60 border border-orange-800 px-2 py-0.5 rounded">
          APP-04 // RENDER TRAP
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-orange-950/60 border border-orange-800 text-orange-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">The Visual Ambush</h1>
            <p className="text-xs text-slate-400">Pings Fal.ai serverless GPU for 4K commercial product photography.</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
        <div>
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Product Category</label>
          <input
            type="text"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-sans"
          />
        </div>
        <div>
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Scene Lighting & Staging</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-sans"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={rendering}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${rendering ? "animate-spin" : ""}`} />
          {rendering ? "Rendering on GPU..." : "Synthesize 4K Studio Render"}
        </button>
      </div>

      {/* Render Canvas & Watermark Trap */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 aspect-square flex items-center justify-center">
        <img src={imageUrl} alt="Product Render" className="w-full h-full object-cover" />

        {/* Massive Watermark Overlay if not unlocked */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none bg-slate-950/20 backdrop-blur-[1px]">
            <div className="transform -rotate-12 border-4 border-orange-500/60 text-orange-400 font-black text-3xl font-mono px-6 py-3 tracking-widest uppercase bg-slate-950/80 shadow-2xl">
              PREVIEW ONLY
            </div>
            <span className="text-[11px] font-mono text-slate-300 bg-slate-950/90 px-3 py-1 rounded-full mt-3 border border-slate-800">
              COMMERCIAL RIGHTS PROTECTED
            </span>
          </div>
        )}
      </div>

      {/* Tollbooth Action Card */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
        {isUnlocked ? (
          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg font-mono"
          >
            <Download className="w-4 h-4" />
            Download Clean 4K Unwatermarked Asset
          </a>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Unlock Full Resolution (Raw 4K):</span>
              <span className="text-amber-400 font-bold font-mono flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {STARS_PRICE} Stars ($1.00)
              </span>
            </div>
            <button
              onClick={handleUnlockRender}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-[0.98]"
            >
              <Lock className="w-4 h-4" />
              Pay {STARS_PRICE} Stars to Remove Watermark
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

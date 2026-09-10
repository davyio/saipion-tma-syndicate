"use client";

import { useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { sensory } from "@/lib/sensory";
import { ArrowLeft, Sparkles, Star, Package, CheckCircle2, ShieldCheck, Eye, Compass } from "lucide-react";

export default function AtelierDropsPage() {
  const { user, openInvoice } = useTelegram();
  const [reserved, setReserved] = useState<boolean>(false);
  const [perspectiveAngle, setPerspectiveAngle] = useState<number>(0);

  const STARS_PRIORITY = 250;

  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setPerspectiveAngle(val);
    sensory.slide(val / 100);
  };

  const handleReserve = () => {
    sensory.lockThud();
    setReserved(true);
    setTimeout(() => {
      sensory.successChime();
    }, 350);
  };

  const handlePriorityPass = async () => {
    sensory.lockThud();
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: STARS_PRIORITY,
          title: "ATELIER Private Drop VIP Queue Pass",
          description: "Grants guaranteed reservation rights for edition #44 of 50.",
          app_module: "atelier-drops",
          userId: user?.id || 777000123,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            sensory.successChime();
          }
        });
      }
    } catch (_) {}
  };

  return (
    <div className="flex flex-col gap-6 text-slate-100 font-sans antialiased">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          onClick={() => sensory.tick()}
          className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono tracking-widest text-neutral-400 border border-neutral-800 bg-neutral-950 px-2.5 py-0.5 rounded-full uppercase">
          ATELIER // 05
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          Curated Physical Drops
        </span>
        <h1 className="text-2xl font-light tracking-tight text-white">
          Micro-Lot Artifacts
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed">
          The world&apos;s most coveted physical objects. Released in editions of fifty with cryptographic digital twins.
        </p>
      </div>

      {/* Artifact Gallery Card */}
      <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-col gap-4 shadow-2xl">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">DROP #04</span>
            <span className="text-base font-medium text-white">Monolith Titanium Chronograph</span>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-full">
            7 of 50 Left
          </span>
        </div>

        {/* Dynamic Interactive Object Display */}
        <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-black aspect-[4/3] flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80"
            alt="Artifact Render"
            className="w-full h-full object-cover transition-transform duration-200"
            style={{ transform: `scale(${1 + perspectiveAngle * 0.002}) rotate(${perspectiveAngle * 0.05}deg)` }}
          />
          <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-neutral-800 text-[10px] font-mono text-neutral-300 flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-neutral-400" />
            <span>Grade 5 Titanium • Obsidian Dial</span>
          </div>
        </div>

        {/* Perspective Slider */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex justify-between text-[10px] font-mono text-neutral-400">
            <span>Tactile Perspective View:</span>
            <span>{perspectiveAngle}° Rotation</span>
          </div>
          <input
            type="range"
            min="-20"
            max="20"
            value={perspectiveAngle}
            onChange={handleAngleChange}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

        {/* Pricing & Digital Twin Specs */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div>
            <span className="text-neutral-500 block">PRICE:</span>
            <span className="text-white font-bold text-xs">$2,850 USD / 440 TON</span>
          </div>
          <div className="text-right">
            <span className="text-neutral-500 block">DIGITAL TWIN:</span>
            <span className="text-emerald-400">TON RWA Contract Verified</span>
          </div>
        </div>

        {/* Reservation Action */}
        {reserved ? (
          <div className="py-4 px-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 flex flex-col items-center justify-center gap-1 text-center font-mono">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">EDITION #44 RESERVED</span>
            <span className="text-[10px] text-neutral-400">White-glove concierge dispatched to @{user?.username || "your_handle"}</span>
          </div>
        ) : (
          <button
            onClick={handleReserve}
            className="w-full py-3.5 px-4 rounded-2xl bg-white text-black font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg"
          >
            <Package className="w-4 h-4" />
            Reserve Physical Edition #44
          </button>
        )}
      </div>

      {/* Priority VIP Queue Pass */}
      <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-medium text-white block">VIP Drop Priority Pass</span>
            <span className="text-[10px] font-mono text-neutral-400">Guarantees allocation before public broadcast</span>
          </div>
          <span className="text-xs font-mono text-amber-400 flex items-center gap-1 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> {STARS_PRIORITY} Stars
          </span>
        </div>

        <button
          onClick={handlePriorityPass}
          className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-mono flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
          Acquire VIP Queue Pass ({STARS_PRIORITY} Stars)
        </button>
      </div>
    </div>
  );
}

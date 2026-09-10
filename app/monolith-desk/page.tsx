"use client";

import { useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { sensory } from "@/lib/sensory";
import { ArrowLeft, ArrowRight, ShieldCheck, Star, Sliders, Lock, CheckCircle2, TrendingUp } from "lucide-react";

export default function MonolithDeskPage() {
  const { user, openInvoice } = useTelegram();
  const [amountUsd, setAmountUsd] = useState<string>("15000");
  const [sliderProgress, setSliderProgress] = useState<number>(0);
  const [isSettled, setIsSettled] = useState<boolean>(false);
  const [dealId, setDealId] = useState<string>("ESC-8921");

  const STARS_FEE = 500; // $10.00 priority escrow notary

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderProgress(val);
    sensory.slide(val / 100);

    if (val >= 98 && !isSettled) {
      sensory.lockThud();
      setIsSettled(true);
      setTimeout(() => {
        sensory.successChime();
      }, 350);
    }
  };

  const handlePriorityNotary = async () => {
    sensory.lockThud();
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: STARS_FEE,
          title: "MONOLITH Escrow Notarization",
          description: "Priority institutional proof-of-funds notarization for deal " + dealId,
          app_module: "monolith-desk",
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
          MONOLITH // 03
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          Private Dark Pool Settlement
        </span>
        <h1 className="text-2xl font-light tracking-tight text-white">
          The Escrow Desk
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Zero slippage. Instant non-custodial cross-border escrow. Reimagined as pure glass.
        </p>
      </div>

      {/* Primary Settlement Instrument Card */}
      <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-col gap-5 shadow-2xl">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">SETTLEMENT ASSET</span>
            <span className="text-sm font-medium text-white font-mono">USDT / TON</span>
          </div>
          <div className="text-right font-mono">
            <span className="text-[10px] text-neutral-500 uppercase block">RATE</span>
            <span className="text-xs text-emerald-400 font-bold">$6.42 USD / TON</span>
          </div>
        </div>

        {/* Big Amount Field */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono text-neutral-500 uppercase">Amount to Lock (USD)</label>
          <div className="relative">
            <input
              type="number"
              disabled={isSettled}
              value={amountUsd}
              onChange={(e) => setAmountUsd(e.target.value)}
              className="w-full p-4 rounded-2xl bg-black border border-neutral-800 text-2xl font-light font-mono text-white focus:outline-none focus:border-neutral-600"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500">
              USD
            </span>
          </div>
        </div>

        {/* Counterparty & Protocol Details */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div>
            <span className="text-neutral-500 block">COUNTERPARTY:</span>
            <span className="text-neutral-300">@zurich_settler</span>
          </div>
          <div className="text-right">
            <span className="text-neutral-500 block">DESK FEE:</span>
            <span className="text-neutral-300">15 bps (0.15%)</span>
          </div>
        </div>

        {/* Tactile Slide to Settle */}
        {isSettled ? (
          <div className="py-4 px-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 flex flex-col items-center justify-center gap-1.5 text-center font-mono">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">ESCROW CRYPTOGRAPHICALLY LOCKED</span>
            <span className="text-[10px] text-neutral-400">Deal Reference: {dealId}</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex justify-between text-[10px] font-mono text-neutral-400">
              <span>Drag to Authorize:</span>
              <span className="font-bold text-white">{sliderProgress}%</span>
            </div>
            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderProgress}
                onChange={handleSliderChange}
                className="w-full h-12 bg-neutral-900 rounded-2xl appearance-none cursor-pointer accent-white border border-neutral-800 px-2"
              />
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-mono text-neutral-400 font-medium">
                {sliderProgress > 30 ? "" : "Slide to Settle Escrow →"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Priority Proof-of-Funds Notarization */}
      <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-medium text-white block">Expedited Proof-of-Funds Notary</span>
            <span className="text-[10px] font-mono text-neutral-400">Instant multi-sig clearance on TON</span>
          </div>
          <span className="text-xs font-mono text-amber-400 flex items-center gap-1 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> {STARS_FEE} Stars
          </span>
        </div>

        <button
          onClick={handlePriorityNotary}
          className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-mono flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <Lock className="w-4 h-4 text-neutral-400" />
          Request Priority Notarization ({STARS_FEE} Stars)
        </button>
      </div>
    </div>
  );
}

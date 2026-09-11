"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { sensory } from "@/lib/sensory";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Star,
  Flame,
  Award,
  DollarSign,
  TrendingUp,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

interface FloatingNumber {
  id: number;
  x: number;
  y: number;
  amount: number;
}

export default function PleaserTapPage() {
  const { user, openInvoice } = useTelegram();
  const [balance, setBalance] = useState<number>(1250);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [heelLevel, setHeelLevel] = useState<number>(1);
  const [combo, setCombo] = useState<number>(0);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [activeBoost, setActiveBoost] = useState<boolean>(false);
  const [boostTimer, setBoostTimer] = useState<number>(0);
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(false);

  const HEEL_NAMES = [
    "4-Inch Lucite Starter",
    "6-Inch Stiletto Grind",
    "8-Inch Chrome Pleaser",
    "10-Inch Titanium Invert",
  ];

  // Auto decrement boost timer
  useEffect(() => {
    if (boostTimer > 0) {
      const interval = setInterval(() => {
        setBoostTimer((prev) => {
          if (prev <= 1) {
            setActiveBoost(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [boostTimer]);

  const handleTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    sensory.tick();

    const gain = heelLevel * multiplier * (activeBoost ? 5 : 1);
    setBalance((prev) => prev + gain);
    setCombo((prev) => {
      const next = prev + 1;
      if (next % 20 === 0) {
        sensory.successChime();
      }
      return next;
    });

    const newId = Date.now() + Math.random();
    setFloatingNumbers((prev) => [...prev.slice(-15), { id: newId, x, y, amount: gain }]);
    setTimeout(() => {
      setFloatingNumbers((prev) => prev.filter((item) => item.id !== newId));
    }, 800);
  };

  const handleUpgradeHeel = () => {
    const cost = heelLevel * 1000;
    if (balance >= cost && heelLevel < 4) {
      sensory.lockThud();
      setBalance((prev) => prev - cost);
      setHeelLevel((prev) => prev + 1);
      sensory.successChime();
    }
  };

  const handleBuyStarBoost = async (stars: number, type: string) => {
    sensory.lockThud();
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars,
          title: `Make It Rain: ${type}`,
          description: "Instant 5x multiplier boost for your tap mining.",
          app_module: "pleaser-tap",
          userId: user?.id || 777000101,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            sensory.successChime();
            setActiveBoost(true);
            setBoostTimer(60);
            setIsStoreOpen(false);
          }
        });
      }
    } catch (_) {}
  };

  return (
    <div className="min-h-screen -mx-4 -my-6 px-4 py-6 bg-[#0E0611] text-neutral-100 font-sans antialiased flex flex-col gap-5 select-none selection:bg-pink-500">
      {/* Top Header */}
      <header className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-[#0E0611]/90 backdrop-blur-xl border-b border-pink-500/20 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => sensory.tick()}
          className="flex items-center gap-1.5 text-xs font-medium text-pink-400 hover:text-pink-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsStoreOpen(!isStoreOpen);
              sensory.tick();
            }}
            className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-amber-950/50 border border-amber-500/30 px-2.5 py-1 rounded-full active:scale-95 transition-all"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Boost Store</span>
          </button>
        </div>
      </header>

      {/* Balance & Heel Stat Header */}
      <div className="flex flex-col items-center justify-center gap-1 pt-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          YOUR $SCF STASH
        </span>
        <div className="text-4xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-amber-300">
          {balance.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-mono text-pink-400 bg-pink-950/60 border border-pink-500/30 px-2 py-0.5 rounded-full font-bold">
            👠 {HEEL_NAMES[heelLevel - 1]}
          </span>
          {activeBoost && (
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse">
              ⚡ 5X BOOST ({boostTimer}s)
            </span>
          )}
        </div>
      </div>

      {/* Main Interactive Tap Stage */}
      <div className="flex-1 flex flex-col items-center justify-center relative py-8">
        {/* Floating Numbers Overlay */}
        {floatingNumbers.map((num) => (
          <span
            key={num.id}
            style={{ left: `${num.x}px`, top: `${num.y}px` }}
            className="absolute pointer-events-none text-xl font-black font-mono text-pink-400 animate-out fade-out slide-out-to-top-8 duration-700 drop-shadow-[0_0_8px_rgba(255,42,133,0.8)]"
          >
            +{num.amount}
          </span>
        ))}

        {/* Big Tap Button */}
        <button
          onClick={handleTap}
          className="relative w-52 h-52 rounded-full bg-gradient-to-br from-[#2E0B22] via-[#1A0614] to-[#0A0207] border-4 border-pink-500/40 shadow-[0_0_50px_rgba(255,42,133,0.35)] active:scale-90 transition-all flex flex-col items-center justify-center group overflow-hidden"
        >
          {/* Neon Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-pink-500/10 blur-xl group-hover:bg-pink-500/20 transition-all"></div>

          <span className="text-6xl drop-shadow-[0_0_15px_rgba(255,42,133,0.8)] transform group-active:rotate-12 transition-transform">
            👠
          </span>
          <span className="text-xs font-mono font-bold text-pink-300 mt-2 tracking-widest uppercase">
            MAKE IT RAIN
          </span>
          <span className="text-[9px] font-mono text-neutral-400">
            +{heelLevel * multiplier * (activeBoost ? 5 : 1)} / TAP
          </span>
        </button>
      </div>

      {/* Heel Upgrade Bar */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-neutral-400">NEXT HEEL UPGRADE:</span>
          <span className="text-xs font-bold text-white">
            {heelLevel < 4 ? HEEL_NAMES[heelLevel] : "MAX HEEL LEVEL"}
          </span>
        </div>
        {heelLevel < 4 ? (
          <button
            onClick={handleUpgradeHeel}
            disabled={balance < heelLevel * 1000}
            className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-white font-mono text-xs font-bold transition-all active:scale-95"
          >
            Upgrade ({(heelLevel * 1000).toLocaleString()} $SCF)
          </button>
        ) : (
          <span className="text-xs font-mono font-bold text-emerald-400">MAXED</span>
        )}
      </div>

      {/* Boost Store Modal */}
      {isStoreOpen && (
        <div className="p-4 rounded-3xl bg-[#160A1D] border-2 border-pink-500 shadow-[0_0_30px_rgba(255,42,133,0.4)] flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold font-mono text-pink-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Telegram Stars Boosts
            </h3>
            <button
              onClick={() => setIsStoreOpen(false)}
              className="text-xs font-mono text-neutral-400 hover:text-white"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-white">
                <span>Champagne 5x</span>
                <span className="text-amber-400 font-mono text-[11px]">50 XTR</span>
              </div>
              <p className="text-[10px] text-neutral-400">5x taps for 60 seconds.</p>
              <button
                onClick={() => handleBuyStarBoost(50, "Champagne 5x")}
                className="mt-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] uppercase font-mono transition-all"
              >
                Buy (50 Stars)
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-white">
                <span>Bottle Service</span>
                <span className="text-amber-400 font-mono text-[11px]">100 XTR</span>
              </div>
              <p className="text-[10px] text-neutral-400">5x taps for 180 seconds.</p>
              <button
                onClick={() => handleBuyStarBoost(100, "Bottle Service")}
                className="mt-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] uppercase font-mono transition-all"
              >
                Buy (100 Stars)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

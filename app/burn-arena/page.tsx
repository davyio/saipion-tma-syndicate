"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { ArrowLeft, Swords, Star, Flame, Shield, Trophy, Clock, Zap } from "lucide-react";

export default function BurnArenaPage() {
  const { user, triggerHaptic, triggerNotificationHaptic, openInvoice } = useTelegram();
  const [battle, setBattle] = useState<any>(null);
  const [selectedCoin, setSelectedCoin] = useState<"PEPE" | "DOGE">("PEPE");
  const [selectedStars, setSelectedStars] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastActionMsg, setLastActionMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/modules/burn-arena", { method: "POST", body: JSON.stringify({}) })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && res.battle) setBattle(res.battle);
      })
      .catch(() => {});
  }, []);

  const handleBoost = async () => {
    setLoading(true);
    triggerHaptic("heavy");

    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: selectedStars,
          title: `PvP Strike: Boost $${selectedCoin}`,
          description: `Inflicts damage on opponent and boosts $${selectedCoin} in the Burn Arena.`,
          app_module: "burn-arena",
          userId: user?.id || 777000123,
        }),
      });

      const json = await res.json();

      const executeBoost = () => {
        if (battle) {
          const isA = selectedCoin === "PEPE";
          setBattle({
            ...battle,
            totalStarsBurned: battle.totalStarsBurned + selectedStars,
            coinA: {
              ...battle.coinA,
              hp: isA ? Math.min(100, battle.coinA.hp + 5) : Math.max(0, battle.coinA.hp - 8),
              totalBoostStars: isA ? battle.coinA.totalBoostStars + selectedStars : battle.coinA.totalBoostStars,
            },
            coinB: {
              ...battle.coinB,
              hp: !isA ? Math.min(100, battle.coinB.hp + 5) : Math.max(0, battle.coinB.hp - 8),
              totalBoostStars: !isA ? battle.coinB.totalBoostStars + selectedStars : battle.coinB.totalBoostStars,
            },
          });
        }
        setLastActionMsg(`🔥 Direct hit! +${selectedStars * 2} HP added to $${selectedCoin}!`);
        triggerNotificationHaptic("success");
      };

      if (json.invoiceLink) {
        openInvoice(json.invoiceLink, (status) => {
          if (status === "paid") executeBoost();
        });
      } else {
        executeBoost();
      }
    } catch {
      // Fallback local update
      setLastActionMsg(`🔥 Supported $${selectedCoin}!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
          APP-15 // BURN ARENA
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-400">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Burn Arena PvP</h1>
            <p className="text-xs text-slate-400">Group meme coin battle. Burn Stars to boost HP & claim victory pool.</p>
          </div>
        </div>
      </div>

      {/* Battle Status Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs shadow-xl">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          <span>POT: <strong className="text-amber-400">{battle?.totalStarsBurned || 3840} Stars</strong></span>
        </div>
        <div className="text-right text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Ends in 18m</span>
        </div>
      </div>

      {/* Versus Health Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Coin A: PEPE */}
        <div
          onClick={() => { setSelectedCoin("PEPE"); triggerHaptic("light"); }}
          className={`p-3.5 rounded-2xl border flex flex-col gap-2.5 cursor-pointer transition-all ${
            selectedCoin === "PEPE"
              ? "bg-emerald-950/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-slate-900/80 border-slate-800 opacity-70"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-sm font-bold text-white block">$PEPE</span>
              <span className="text-[10px] font-mono text-emerald-400">Trench Dog</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">{battle?.coinA?.hp || 64}% HP</span>
          </div>

          {/* Health Bar */}
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${battle?.coinA?.hp || 64}%` }} />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
            <span>Boost: {battle?.coinA?.totalBoostStars || 2150} ⭐</span>
            <span>{battle?.coinA?.supportersCount || 48} Apes</span>
          </div>
        </div>

        {/* Coin B: DOGE */}
        <div
          onClick={() => { setSelectedCoin("DOGE"); triggerHaptic("light"); }}
          className={`p-3.5 rounded-2xl border flex flex-col gap-2.5 cursor-pointer transition-all ${
            selectedCoin === "DOGE"
              ? "bg-amber-950/40 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              : "bg-slate-900/80 border-slate-800 opacity-70"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-sm font-bold text-white block">$DOGE</span>
              <span className="text-[10px] font-mono text-amber-400">Cyber Doge</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">{battle?.coinB?.hp || 49}% HP</span>
          </div>

          {/* Health Bar */}
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${battle?.coinB?.hp || 49}%` }} />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
            <span>Boost: {battle?.coinB?.totalBoostStars || 1690} ⭐</span>
            <span>{battle?.coinB?.supportersCount || 37} Apes</span>
          </div>
        </div>
      </div>

      {lastActionMsg && (
        <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 font-mono text-xs text-center animate-in fade-in">
          {lastActionMsg}
        </div>
      )}

      {/* Boost Action Card */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
        <span className="text-xs font-bold text-white font-mono flex items-center justify-between">
          <span>Strike for ${selectedCoin}</span>
          <span className="text-slate-400 text-[10px]">5% Syndicate House Rake</span>
        </span>

        {/* Amount Selector */}
        <div className="grid grid-cols-3 gap-2">
          {[50, 100, 250].map((stars) => (
            <button
              key={stars}
              onClick={() => { setSelectedStars(stars); triggerHaptic("light"); }}
              className={`py-2 px-1 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all border ${
                selectedStars === stars
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" /> {stars} Stars
            </button>
          ))}
        </div>

        <button
          onClick={handleBoost}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
        >
          <Zap className="w-4 h-4 fill-slate-950" />
          Deploy {selectedStars} Stars Strike for ${selectedCoin}
        </button>
      </div>
    </div>
  );
}

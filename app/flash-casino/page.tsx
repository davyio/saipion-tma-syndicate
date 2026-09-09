"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { ArrowLeft, TrendingUp, TrendingDown, Star, Zap, Clock, ShieldAlert, Award } from "lucide-react";

export default function FlashCasinoPage() {
  const { user, triggerHaptic, triggerNotificationHaptic, openInvoice } = useTelegram();
  const [btcPrice, setBtcPrice] = useState<number>(92450.50);
  const [priceHistory, setPriceHistory] = useState<number[]>([92410, 92430, 92420, 92445, 92450]);
  const [selectedBetStars, setSelectedBetStars] = useState<number>(50);
  const [countdown, setCountdown] = useState<number>(28);
  const [activeBet, setActiveBet] = useState<any>(null);
  const [roundResult, setRoundResult] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate live micro-movements in BTC price
      setBtcPrice((prev) => {
        const delta = (Math.random() - 0.49) * 12;
        const newPrice = Number((prev + delta).toFixed(2));
        setPriceHistory((h) => [...h.slice(-15), newPrice]);
        return newPrice;
      });

      // Round Countdown
      setCountdown((prev) => {
        if (prev <= 1) {
          // Round expired, check active bet
          if (activeBet) {
            const finalPrice = btcPrice;
            const won =
              (activeBet.direction === "UP" && finalPrice >= activeBet.entryPrice) ||
              (activeBet.direction === "DOWN" && finalPrice < activeBet.entryPrice);

            setRoundResult({
              won,
              payout: won ? activeBet.payout : 0,
              entryPrice: activeBet.entryPrice,
              exitPrice: finalPrice,
            });
            triggerNotificationHaptic(won ? "success" : "error");
            setActiveBet(null);
          }
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeBet, btcPrice]);

  const handlePlaceBet = async (direction: "UP" | "DOWN") => {
    triggerHaptic("heavy");

    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: selectedBetStars,
          title: `60s Zero-DTE ${direction} Option`,
          description: `Predicting BTC will close ${direction} in 60 seconds.`,
          app_module: "flash-casino",
          userId: user?.id || 777000123,
        }),
      });

      const data = await res.json();

      const activateBet = () => {
        setActiveBet({
          direction,
          amountStars: selectedBetStars,
          entryPrice: btcPrice,
          payout: Math.round(selectedBetStars * 1.94),
        });
        setRoundResult(null);
        triggerNotificationHaptic("success");
      };

      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            activateBet();
          }
        });
      } else {
        activateBet();
      }
    } catch {
      setActiveBet({
        direction,
        amountStars: selectedBetStars,
        entryPrice: btcPrice,
        payout: Math.round(selectedBetStars * 1.94),
      });
      setRoundResult(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
          APP-10 // ZERO-DTE POOL
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">The Zero-DTE Pool</h1>
            <p className="text-xs text-slate-400">60-second binary prediction market with 3% automated syndicate house rake.</p>
          </div>
        </div>
      </div>

      {/* Live Market Display */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3 shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Target Index</span>
            <span className="text-base font-bold text-white font-mono">BTC / USDT</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Round Closes In</span>
            <span className="text-sm font-bold text-amber-400 font-mono flex items-center gap-1 justify-end">
              <Clock className="w-3.5 h-3.5 animate-pulse" /> {countdown}s
            </span>
          </div>
        </div>

        {/* Big Live Price */}
        <div className="flex items-baseline gap-3 my-1">
          <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
            ${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-emerald-400/80 font-mono flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> LIVE FEED
          </span>
        </div>

        {/* Round Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 60) * 100}%` }}
          />
        </div>

        {/* Pool Volume & Rake Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900 font-mono text-[10px]">
          <div>
            <span className="text-slate-500 block">POOL VOLUME</span>
            <span className="text-slate-200 font-bold">4,850 Stars</span>
          </div>
          <div>
            <span className="text-slate-500 block">BULL RATIO</span>
            <span className="text-emerald-400 font-bold">62% UP</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">HOUSE RAKE</span>
            <span className="text-amber-400 font-bold">3.0% FIXED</span>
          </div>
        </div>
      </div>

      {/* Round Result Toast */}
      {roundResult && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between font-mono text-xs animate-in zoom-in-95 ${
            roundResult.won
              ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
              : "bg-rose-950/80 border-rose-800 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>
              {roundResult.won
                ? `ROUND WON! Paid +${roundResult.payout} Stars!`
                : "ROUND EXPIRED OTM. Better luck next tick."}
            </span>
          </div>
          <button onClick={() => setRoundResult(null)} className="text-[10px] underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Active Bet Banner */}
      {activeBet && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/50 flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">ACTIVE POSITION</span>
            <span className={`font-bold ${activeBet.direction === "UP" ? "text-emerald-400" : "text-rose-400"}`}>
              {activeBet.direction} @ ${activeBet.entryPrice}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">POTENTIAL PAYOUT</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> {activeBet.payout} Stars
            </span>
          </div>
        </div>
      )}

      {/* Bet Controls */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Select Wager (Telegram Stars)</span>

        {/* Star Amount Chips */}
        <div className="grid grid-cols-4 gap-2">
          {[25, 50, 100, 250].map((stars) => (
            <button
              key={stars}
              onClick={() => {
                setSelectedBetStars(stars);
                triggerHaptic("light");
              }}
              className={`py-2 px-1 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all border ${
                selectedBetStars === stars
                  ? "bg-amber-500/20 border-amber-500 text-amber-300"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <Star className="w-3 h-3 fill-current" /> {stars}
            </button>
          ))}
        </div>

        {/* Prediction Execution Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <button
            onClick={() => handlePlaceBet("UP")}
            disabled={Boolean(activeBet)}
            className="py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-sm flex flex-col items-center justify-center gap-1 transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-95 disabled:opacity-40"
          >
            <TrendingUp className="w-6 h-6 stroke-[3]" />
            <span>CALL (UP)</span>
            <span className="text-[10px] font-mono opacity-80">Payout 1.94x</span>
          </button>

          <button
            onClick={() => handlePlaceBet("DOWN")}
            disabled={Boolean(activeBet)}
            className="py-4 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black text-sm flex flex-col items-center justify-center gap-1 transition-all shadow-[0_0_20px_rgba(244,63,94,0.25)] active:scale-95 disabled:opacity-40"
          >
            <TrendingDown className="w-6 h-6 stroke-[3]" />
            <span>PUT (DOWN)</span>
            <span className="text-[10px] font-mono opacity-80">Payout 1.94x</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { sensory } from "@/lib/sensory";
import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Flame,
  Copy,
  Check,
  Star,
  ExternalLink,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Clock,
  Lock,
  ChevronRight,
  Award,
  Zap,
} from "lucide-react";

export default function ScfTerminalPage() {
  const { user, openInvoice } = useTelegram();
  const [copied, setCopied] = useState<boolean>(false);
  const [tuitionPaid, setTuitionPaid] = useState<number>(148290.45);
  const [countdown, setCountdown] = useState<string>("04:18:22");
  const [activeTab, setActiveTab] = useState<"terminal" | "staking" | "manifesto">("terminal");
  const [selectedTip, setSelectedTip] = useState<{ id: string; stars: number; title: string }>({
    id: "credit_hour",
    stars: 150,
    title: "1 STEM Credit Hour",
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stakeAmount, setStakeAmount] = useState<number>(50000);
  const [stakeDays, setStakeDays] = useState<number>(30);

  const CA = "SCF7vM91oK9p4Yd8wX2aB3vE5qR1zN8xPumpFunBonding";

  // Simulate dynamic real-time tuition ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTuitionPaid((prev) => prev + Number((Math.random() * 2.4).toFixed(2)));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Simulate Shift Change 3:00 AM countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setUTCHours(7, 0, 0, 0); // 3:00 AM EST = 07:00 UTC
      if (now > target) {
        target.setDate(target.getDate() + 1);
      }
      const diff = Math.max(0, target.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(
        `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyCA = () => {
    sensory.tick();
    navigator.clipboard.writeText(CA);
    setCopied(true);
    sensory.successChime();
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayTuition = async () => {
    sensory.lockThud();
    setIsProcessing(true);
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: selectedTip.stars,
          title: `Tuition Tip: ${selectedTip.title}`,
          description: `Direct non-refundable tuition grant to the $SCF Academic Endowment.`,
          app_module: "scf-terminal",
          userId: user?.id || 777000101,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          setIsProcessing(false);
          if (status === "paid") {
            sensory.successChime();
            setTuitionPaid((prev) => prev + selectedTip.stars * 0.02);
          }
        });
      } else {
        setIsProcessing(false);
      }
    } catch (_) {
      setIsProcessing(false);
    }
  };

  const apyRate = stakeDays >= 365 ? 120 : stakeDays >= 30 ? 69.42 : 42.0;
  const projectedReturn = Math.round(stakeAmount * (1 + (apyRate / 100) * (stakeDays / 365)));

  return (
    <div className="min-h-screen -mx-4 -my-6 px-4 py-6 bg-[#0B0612] text-neutral-100 font-sans antialiased flex flex-col gap-5 selection:bg-pink-500 selection:text-white">
      {/* Top Cyber-Y2K Header */}
      <header className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-[#0B0612]/90 backdrop-blur-xl border-b border-pink-500/20 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => sensory.tick()}
          className="flex items-center gap-1.5 text-xs font-medium text-pink-400 hover:text-pink-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-wider font-semibold text-pink-300 bg-pink-950/60 border border-pink-500/30 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(255,42,133,0.25)]">
            $SCF // ENDOWMENT
          </span>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            +88.4% BONDING
          </span>
        </div>
      </header>

      {/* Hero Visual Card */}
      <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#1E0E2B] via-[#12071B] to-[#0B0612] border border-pink-500/30 shadow-[0_4px_30px_rgba(255,42,133,0.15)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,42,133,0.5)]">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Stripper College Fund <span className="text-pink-400 font-mono text-sm">$SCF</span>
              </h1>
              <p className="text-[11px] text-neutral-400">Decentralized Academic Endowment in 8-Inch Pleasers</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-neutral-400">SHIFT CHANGE</div>
            <div className="text-xs font-mono font-bold text-pink-400 tracking-wider flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3 animate-pulse text-pink-500" />
              {countdown}
            </div>
          </div>
        </div>

        {/* Live Dynamic Tuition Paid Meter */}
        <div className="p-4 rounded-2xl bg-black/40 border border-pink-500/20 flex flex-col gap-1.5 backdrop-blur-md">
          <div className="flex justify-between items-center text-[11px] font-mono text-neutral-400">
            <span>VERIFIED TUITION PAID</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live Ticking
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-emerald-400">
            ${tuitionPaid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[10px] font-mono text-neutral-400">
            <div>
              <span className="text-neutral-500 block">Semesters</span>
              <span className="text-white font-bold">39 Cleared</span>
            </div>
            <div>
              <span className="text-neutral-500 block">MacBooks</span>
              <span className="text-white font-bold">22 Distributed</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Locker APY</span>
              <span className="text-pink-400 font-bold">69.42%</span>
            </div>
          </div>
        </div>

        {/* Contract Address Bar */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-neutral-500 text-[10px] uppercase">CA:</span>
            <span className="truncate text-pink-300 text-[11px]">{CA}</span>
          </div>
          <button
            onClick={handleCopyCA}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-[10px] font-semibold transition-all active:scale-95"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy CA"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-medium">
        <button
          onClick={() => {
            setActiveTab("terminal");
            sensory.tick();
          }}
          className={`py-2 rounded-xl transition-all ${
            activeTab === "terminal"
              ? "bg-pink-600 text-white shadow-[0_0_15px_rgba(255,42,133,0.4)]"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Tuition Toll
        </button>
        <button
          onClick={() => {
            setActiveTab("staking");
            sensory.tick();
          }}
          className={`py-2 rounded-xl transition-all ${
            activeTab === "staking"
              ? "bg-pink-600 text-white shadow-[0_0_15px_rgba(255,42,133,0.4)]"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Locker Vault
        </button>
        <button
          onClick={() => {
            setActiveTab("manifesto");
            sensory.tick();
          }}
          className={`py-2 rounded-xl transition-all ${
            activeTab === "manifesto"
              ? "bg-pink-600 text-white shadow-[0_0_15px_rgba(255,42,133,0.4)]"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Manifesto
        </button>
      </div>

      {/* Tab Content: Tuition Tollbooth */}
      {activeTab === "terminal" && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-3xl bg-white/[0.03] border border-pink-500/20 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 1-Tap Tuition Micro-Grants
              </h2>
              <span className="text-[10px] font-mono text-neutral-400">Telegram Stars (XTR)</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "textbook", stars: 50, title: "Course Textbook", desc: "Covers organic chemistry syllabus" },
                { id: "credit_hour", stars: 150, title: "1 STEM Credit Hour", desc: "Direct tuition block grant" },
                { id: "shift_sponsor", stars: 500, title: "Sponsor The Shift", desc: "No-touch VIP patron badge" },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => {
                    setSelectedTip(tier);
                    sensory.tick();
                  }}
                  className={`p-3 rounded-2xl border flex flex-col items-start text-left transition-all ${
                    selectedTip.id === tier.id
                      ? "bg-pink-950/40 border-pink-500 shadow-[0_0_12px_rgba(255,42,133,0.3)]"
                      : "bg-black/20 border-white/5 hover:border-pink-500/30 text-neutral-400"
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{tier.stars} Stars</span>
                  </div>
                  <div className="text-xs font-semibold text-white mt-1">{tier.title}</div>
                  <div className="text-[9px] text-neutral-400 mt-0.5 leading-tight">{tier.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handlePayTuition}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(255,42,133,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{isProcessing ? "Opening Checkout..." : `PAY HER TUITION (${selectedTip.stars} STARS)`}</span>
            </button>
          </div>

          {/* Lore Bullet Points Container */}
          <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-2.5 text-xs text-neutral-300">
            <div className="text-[11px] font-mono uppercase tracking-wider text-pink-400 font-bold">
              Tokenomics & Protocol Flips
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-500 font-bold">•</span>
              <span><strong>3% Tuition Tax:</strong> Automatically liquidated to stablecoins to award real student grants.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-500 font-bold">•</span>
              <span><strong>5% Walk of Shame:</strong> 24-hour quick-flipper burn sent straight to dead address.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-500 font-bold">•</span>
              <span><strong>Total Supply:</strong> 80,085,000,000 $SCF tokens on Solana.</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Staking Calculator */}
      {activeTab === "staking" && (
        <div className="p-4 rounded-3xl bg-white/[0.03] border border-pink-500/20 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Locker Room Staking Vault
            </h2>
            <span className="text-xs font-mono font-bold text-emerald-400">{apyRate}% APY</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-neutral-400">STAKE AMOUNT ($SCF)</label>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-neutral-400">LOCK PERIOD</label>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {[
                { days: 7, label: "Two-Drink (7d)" },
                { days: 30, label: "Syllabus (30d)" },
                { days: 365, label: "Degree (1yr)" },
              ].map((period) => (
                <button
                  key={period.days}
                  onClick={() => {
                    setStakeDays(period.days);
                    sensory.tick();
                  }}
                  className={`py-2 rounded-xl border text-center transition-all ${
                    stakeDays === period.days
                      ? "bg-pink-600 border-pink-500 text-white shadow-[0_0_10px_rgba(255,42,133,0.3)]"
                      : "bg-black/20 border-white/10 text-neutral-400"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-pink-500/20 flex flex-col gap-1 text-xs font-mono">
            <div className="flex justify-between text-neutral-400">
              <span>Projected Return:</span>
              <span className="text-pink-300 font-bold">{projectedReturn.toLocaleString()} $SCF</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Room Tier:</span>
              <span className="text-white">
                {stakeDays >= 365 ? "Presidential Suite" : stakeDays >= 30 ? "VIP Locker" : "Booth"}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sensory.successChime();
              alert(`Booking Private Room for ${stakeAmount.toLocaleString()} $SCF. Staked in Locker Room Vault.`);
            }}
            className="w-full py-3 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(255,42,133,0.4)] active:scale-95 transition-all"
          >
            Book Private Room & Stake
          </button>
        </div>
      )}

      {/* Tab Content: Manifesto */}
      {activeTab === "manifesto" && (
        <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col gap-3 text-xs leading-relaxed text-neutral-300 font-serif">
          <h2 className="text-sm font-sans font-bold text-white tracking-tight flex items-center gap-1.5">
            <Award className="w-4 h-4 text-pink-400" /> The Genesis Lore
          </h2>
          <p>
            &quot;The $SCF smart contract was allegedly coded on a shattered iPhone 8 in the VIP dressing room of a Miami club at 4:00 AM. The anonymous lead dev goes by Satoshi Nippomoto—a nursing student one semester away from graduation.&quot;
          </p>
          <p className="border-l-2 border-pink-500 pl-3 italic text-neutral-400 font-mono text-[11px]">
            &quot;We don&apos;t need a sugar daddy; we have a decentralized liquidity protocol. The blockchain is immutable, and so is a woman with a degree and a bag.&quot;
          </p>
          <div className="pt-2 flex flex-col gap-1 text-[11px] font-mono text-neutral-400">
            <div>• Mascot: Pepe in fishnets reading Keynesian Macroeconomics</div>
            <div>• Bull Candle: &quot;Heel Click&quot;</div>
            <div>• All-Time High: &quot;Clearing Student Debt&quot;</div>
          </div>
        </div>
      )}

      {/* Footer Navigation Back to Matrix */}
      <footer className="pt-2 text-center text-[10px] font-mono text-neutral-500">
        $SCF PROTOCOL // SYNDICATE DEPLOYMENT • ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}

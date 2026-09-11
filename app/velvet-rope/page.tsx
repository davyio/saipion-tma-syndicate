"use client";

import { useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { sensory } from "@/lib/sensory";
import {
  ArrowLeft,
  Shield,
  Star,
  Sparkles,
  QrCode,
  CheckCircle2,
  Lock,
  Flame,
  UserCheck,
  AlertTriangle,
  Crown,
} from "lucide-react";

export default function VelvetRopePage() {
  const { user, openInvoice } = useTelegram();
  const [balanceInput, setBalanceInput] = useState<string>("0");
  const [inspectionResult, setInspectionResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasVipPass, setHasVipPass] = useState<boolean>(false);

  const handleInspect = async () => {
    sensory.tick();
    try {
      const res = await fetch("/api/modules/velvet-rope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "inspect_id",
          userId: user?.id || 777000101,
          username: user?.username || "degen_whale",
          scfBalance: Number(balanceInput) || 0,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setInspectionResult(data);
        if (data.eligible) {
          sensory.successChime();
          setHasVipPass(true);
        } else {
          sensory.lockThud();
        }
      }
    } catch (_) {}
  };

  const handlePayCoverCharge = async () => {
    sensory.lockThud();
    setIsProcessing(true);
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: 100,
          title: "VIP Velvet Rope Cover Charge",
          description: "One-night all-access pass to the $SCF Champagne Room and private backroom alpha chat.",
          app_module: "velvet-rope",
          userId: user?.id || 777000101,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          setIsProcessing(false);
          if (status === "paid") {
            sensory.successChime();
            setHasVipPass(true);
          }
        });
      } else {
        setIsProcessing(false);
      }
    } catch (_) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen -mx-4 -my-6 px-4 py-6 bg-[#0E070C] text-neutral-100 font-sans antialiased flex flex-col gap-5 selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-[#0E070C]/90 backdrop-blur-xl border-b border-amber-500/20 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => sensory.tick()}
          className="flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-wider font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            VELVET ROPE // GATE
          </span>
        </div>
      </header>

      {/* Hero Visual Card */}
      <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#240D17] via-[#16080E] to-[#0E070C] border border-amber-500/30 shadow-[0_4px_30px_rgba(245,158,11,0.15)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-700 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                The Velvet Rope <span className="text-amber-400 text-xs font-mono">VIP</span>
              </h1>
              <p className="text-[11px] text-neutral-400">Exclusive Gated Access to the $SCF Champagne Room</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 rounded-full">
            NO CREEPS
          </span>
        </div>

        {/* Bouncer Quote Box */}
        <div className="p-3.5 rounded-2xl bg-black/50 border border-amber-500/20 flex items-start gap-3 backdrop-blur-md">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
            alt="Big Mike"
            className="w-10 h-10 rounded-xl object-cover border border-amber-500/30 shrink-0"
          />
          <div className="flex flex-col gap-0.5">
            <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
              Big Mike // Head of Security
            </div>
            <p className="text-xs text-neutral-300 italic leading-snug">
              {inspectionResult?.bouncerDialogue ||
                `"Step up to the rope. Show me 10,000 $SCF in your wallet or pay the 100 Stars cover charge. Keep your hands where I can see 'em."`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Gate Section */}
      {!hasVipPass ? (
        <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-4">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold">
            Stage 1: Identity & Bag Verification
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-neutral-400">YOUR $SCF WALLET BALANCE</label>
            <input
              type="number"
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              placeholder="e.g. 10000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleInspect}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold tracking-wider uppercase border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Present ID to Security</span>
          </button>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-white/10 w-full"></div>
            <span className="bg-[#0E070C] px-3 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              OR PAY COVER
            </span>
          </div>

          {/* Star Tollbooth */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-rose-950/20 to-black border border-amber-500/30 flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-white">Instant VIP Pass (100 Stars)</div>
                <div className="text-[10px] text-neutral-400">Skip the token requirement for 24 hours</div>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>100 XTR</span>
              </div>
            </div>

            <button
              onClick={handlePayCoverCharge}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-rose-600 hover:opacity-95 text-black font-bold text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isProcessing ? "Processing..." : "PAY 100 STARS COVER CHARGE"}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Holographic VIP Pass */
        <div className="p-5 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-purple-500/20 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)] flex flex-col gap-4 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                OFFICIAL CREDENTIAL
              </span>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                THE CHAMPAGNE ROOM <Crown className="w-4 h-4 text-amber-400" />
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
              VERIFIED VIP
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <QrCode className="w-8 h-8 text-amber-300" />
            </div>
            <div className="flex flex-col text-xs font-mono">
              <span className="text-neutral-400 text-[10px]">PATRON HANDLE:</span>
              <span className="text-white font-bold">@{user?.username || "DestinySimp_01"}</span>
              <span className="text-[10px] text-amber-400 font-mono mt-0.5">PASS: {inspectionResult?.passId || "VIP-80085A"}</span>
            </div>
          </div>

          <div className="text-[11px] text-neutral-300 leading-relaxed italic border-t border-white/10 pt-2 font-serif">
            &quot;Welcome to the Backroom. Don&apos;t ask for free tokens, don&apos;t leak alpha to Twitter, and always tip the DJ.&quot;
          </div>

          <Link
            href="/scf-terminal"
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-center font-bold text-xs tracking-wider uppercase transition-all"
          >
            Enter MainStage Terminal
          </Link>
        </div>
      )}

      {/* Rules Footer */}
      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1 text-[11px] font-mono text-neutral-400">
        <div className="text-amber-400 font-bold uppercase text-[10px]">Security Protocols</div>
        <div>• 10,000 $SCF grants lifetime governance badge.</div>
        <div>• 100 Stars cover charge auto-donates to the Tuition Fund.</div>
      </div>
    </div>
  );
}

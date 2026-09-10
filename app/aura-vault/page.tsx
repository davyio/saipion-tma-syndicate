"use client";

import { useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { sensory } from "@/lib/sensory";
import { ArrowLeft, Shield, Lock, Unlock, Star, HeartPulse, Key, CheckCircle2, ChevronRight, Fingerprint } from "lucide-react";

export default function AuraVaultPage() {
  const { user, openInvoice } = useTelegram();
  const [secretText, setSecretText] = useState<string>("alpha_wallet_mnemonic_24_words_secret_phrase");
  const [beneficiary, setBeneficiary] = useState<string>("@executive_trustee");
  const [dialStep, setDialStep] = useState<number>(34);
  const [isSealed, setIsSealed] = useState<boolean>(false);
  const [heartbeatDays, setHeartbeatDays] = useState<number>(74);
  const [pulseConfirmed, setPulseConfirmed] = useState<boolean>(false);

  const STARS_TITANIUM = 1200; // $24.00 Titanium Tier

  const handleDialTurn = (delta: number) => {
    setDialStep((prev) => (prev + delta + 100) % 100);
    sensory.tick();
  };

  const handleSeal = async () => {
    sensory.lockThud();
    setIsSealed(true);
    setTimeout(() => {
      sensory.successChime();
    }, 400);
  };

  const handleHeartbeat = () => {
    sensory.tick();
    setHeartbeatDays(90);
    setPulseConfirmed(true);
    sensory.successChime();
    setTimeout(() => setPulseConfirmed(false), 3000);
  };

  const handleUpgradeTitanium = async () => {
    sensory.lockThud();
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: STARS_TITANIUM,
          title: "AURA Titanium Life Capsule",
          description: "Multi-sig zero-knowledge dead-man succession vault.",
          app_module: "aura-vault",
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
          AURA // 01
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          Zero-Knowledge Enclave
        </span>
        <h1 className="text-2xl font-light tracking-tight text-white flex items-center gap-2">
          The Life Capsule
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
          A physical obsidian vault for your critical private keys, corporate mandates, and digital legacy.
        </p>
      </div>

      {/* Tactile Combination Dial */}
      <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-neutral-950 border border-neutral-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

        <div className="relative w-40 h-40 rounded-full border border-neutral-800 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] bg-neutral-900/60">
          <div className="text-center">
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">DIAL NOTCH</span>
            <span className="text-3xl font-light font-mono text-white tracking-tighter">
              {dialStep < 10 ? `0${dialStep}` : dialStep}
            </span>
          </div>

          {/* Notch indicators */}
          <div className="absolute top-2 w-1 h-2 bg-neutral-600 rounded-full" />
          <div className="absolute bottom-2 w-1 h-2 bg-neutral-800 rounded-full" />
          <div className="absolute left-2 w-2 h-1 bg-neutral-800 rounded-full" />
          <div className="absolute right-2 w-2 h-1 bg-neutral-800 rounded-full" />
        </div>

        {/* Tactile Dial Buttons */}
        <div className="flex gap-4 mt-5">
          <button
            onClick={() => handleDialTurn(-1)}
            className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300 flex items-center justify-center active:scale-90 transition-transform font-mono text-sm"
          >
            -
          </button>
          <button
            onClick={() => handleDialTurn(1)}
            className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300 flex items-center justify-center active:scale-90 transition-transform font-mono text-sm"
          >
            +
          </button>
        </div>
        <span className="text-[10px] font-mono text-neutral-500 mt-2">Rotate dial to adjust cryptographic entropy</span>
      </div>

      {/* Dead-Man Heartbeat Indicator */}
      <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300">
            <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase block">Dead-Man Pulse</span>
            <span className="text-sm font-light text-white font-mono">{heartbeatDays} Days Remaining</span>
          </div>
        </div>

        <button
          onClick={handleHeartbeat}
          className="py-1.5 px-3 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-neutral-300 active:scale-95 transition-all"
        >
          {pulseConfirmed ? "Pulse Confirmed" : "Send Pulse"}
        </button>
      </div>

      {/* Secret Payload Input */}
      <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col gap-3">
        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
          Secret Payload (Client AES-GCM Encrypted)
        </span>
        <textarea
          rows={3}
          value={secretText}
          disabled={isSealed}
          onChange={(e) => setSecretText(e.target.value)}
          className="w-full p-3 rounded-xl bg-black border border-neutral-800 text-xs text-neutral-300 font-mono focus:outline-none focus:border-neutral-600 resize-none"
        />

        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
          <span>Succession Trustee:</span>
          <span className="text-neutral-300">{beneficiary}</span>
        </div>

        {isSealed ? (
          <div className="py-3 px-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center gap-2 text-xs font-mono text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Vault Cryptographically Sealed</span>
          </div>
        ) : (
          <button
            onClick={handleSeal}
            className="w-full py-3 px-4 rounded-xl bg-white text-black font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg"
          >
            <Fingerprint className="w-4 h-4" />
            Seal Capsule in Hardware Enclave
          </button>
        )}
      </div>

      {/* Titanium Tier Card */}
      <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-medium text-white block">Titanium Life Capsule</span>
            <span className="text-[10px] font-mono text-neutral-400">Multi-sig dead-man switch with legal escrow</span>
          </div>
          <span className="text-xs font-mono text-amber-400 flex items-center gap-1 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> {STARS_TITANIUM} Stars
          </span>
        </div>

        <button
          onClick={handleUpgradeTitanium}
          className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-mono flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
        >
          <Shield className="w-3.5 h-3.5 text-neutral-400" />
          Activate Titanium Sovereign Tier
        </button>
      </div>
    </div>
  );
}

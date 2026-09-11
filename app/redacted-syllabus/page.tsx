"use client";

import { useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { sensory } from "@/lib/sensory";
import {
  ArrowLeft,
  FileText,
  Copy,
  Check,
  Share2,
  ShieldAlert,
  Flame,
  Scale,
  Stamp,
  Download,
  Sparkles,
} from "lucide-react";

export default function RedactedSyllabusPage() {
  const { user } = useTelegram();
  const [handle, setHandle] = useState<string>(user?.username ? `@${user.username}` : "@Destiny_PhiBetaKappa");
  const [major, setMajor] = useState<string>("Pre-Med & Cellular Biology");
  const [copied, setCopied] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  const tweetText = `🚨 BREAKING: Ivy League General Counsel just served a formal Cease & Desist against ${handle} for "unauthorized use of doctoral regalia with 8-inch Pleasers in VIP dressing rooms."\n\nHarvard is trying to shut down the Stripper College Fund ($SCF).\n\nWe don't need an Ivy League trust; we have a decentralized liquidity protocol. #SCF #WAGGD\nCA: SCF7vM91oK9p4Yd8wX2aB3vE5qR1zN8xPumpFunBonding`;

  const handleCopyRaidText = () => {
    sensory.tick();
    navigator.clipboard.writeText(tweetText);
    setCopied(true);
    sensory.successChime();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen -mx-4 -my-6 px-4 py-6 bg-[#110B10] text-neutral-100 font-sans antialiased flex flex-col gap-5 selection:bg-rose-900 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-[#110B10]/90 backdrop-blur-xl border-b border-rose-500/20 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => sensory.tick()}
          className="flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-wider font-semibold text-rose-300 bg-rose-950/60 border border-rose-500/30 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.25)]">
            C&D ENGINE // AMMUNITION
          </span>
        </div>
      </header>

      {/* Hero Explainer */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          The Redacted Syllabus <Scale className="w-4 h-4 text-rose-400" />
        </h1>
        <p className="text-xs text-neutral-400">
          Official Cease & Desist generator. Synthesizes Ivy League outrage to spark Twitter raids and fuel $SCF FOMO.
        </p>
      </div>

      {/* Customizer Drawer */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-2.5">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-between text-xs font-mono text-neutral-300 font-semibold"
        >
          <span>Customize Legal Notice Details</span>
          <span className="text-rose-400">{showForm ? "Collapse ▲" : "Expand ▼"}</span>
        </button>

        {showForm && (
          <div className="flex flex-col gap-2 pt-2 border-t border-white/5 animate-in fade-in duration-200">
            <div>
              <label className="text-[10px] font-mono text-neutral-400">TARGET HANDLE</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-neutral-400">DEGREE PROGRAM</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* The Parchment Legal Document Card */}
      <div className="relative p-5 rounded-2xl bg-[#F8F5EE] text-[#1D1B18] shadow-2xl border border-[#D9D2C5] flex flex-col gap-4 font-serif leading-relaxed select-text overflow-hidden">
        {/* Rubber Stamp Badge */}
        <div className="absolute top-4 right-4 rotate-12 border-2 border-rose-700 text-rose-700 font-mono font-black text-[10px] px-2 py-0.5 tracking-widest uppercase rounded">
          CONFIDENTIAL // C&D
        </div>

        {/* University Header */}
        <div className="border-b-2 border-[#1D1B18]/20 pb-3 flex flex-col items-center text-center">
          <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-600 font-bold">
            OFFICE OF THE GENERAL COUNSEL
          </div>
          <div className="text-base font-black tracking-tight text-[#6B1D2A] mt-0.5">
            IVY LEAGUE ACADEMIC BOARD OF OVERSEERS
          </div>
          <div className="text-[9px] font-mono text-neutral-500 mt-0.5">
            DOCKET NO. CD-2026-80085-SCF • PRIVILEGED LEGAL DISPATCH
          </div>
        </div>

        {/* Notice Body */}
        <div className="text-xs flex flex-col gap-2.5 text-[#2C2724]">
          <div className="font-mono text-[11px] font-bold">
            TO: <span className="bg-neutral-300 px-1">{handle}</span> (Candidate for {major})
          </div>

          <p>
            RE: <strong>IMMEDIATE DEMAND FOR CEASE AND DESIST</strong> regarding the unauthorized, continuous pairing of Summa Cum Laude doctoral gowns, mortarboards, and academic prestige with 8-inch Pleaser heels in connection with the unapproved digital asset known as <em>Stripper College Fund ($SCF)</em>.
          </p>

          <p>
            It has come to the attention of University Trustees that the aforementioned protocol claims an official motto:{" "}
            <span className="bg-black text-black px-2 py-0.5">We don&apos;t need a sugar daddy, we have a liquidity protocol</span>, and that 3% of all on-chain fees are allegedly funding unaccredited tuition grants directly from the VIP Champagne Room.
          </p>

          <div className="p-2.5 rounded bg-[#ECE7DC] border border-[#D9D2C5] font-mono text-[10px] text-neutral-700 flex flex-col gap-1">
            <span className="font-bold uppercase text-rose-800">MANDATORY DEMANDS:</span>
            <span>1. Immediate transfer of 80,085,000,000 $SCF to University Treasury.</span>
            <span>2. Surrender of all MAC Ruby Woo lipstick-stained whitepaper napkins.</span>
            <span>3. Discontinuance of the &quot;G-String Scholarship&quot; program.</span>
          </div>

          <div className="pt-2 flex justify-between items-end border-t border-[#1D1B18]/15 text-[10px] font-mono text-neutral-600">
            <div>
              <span>SEAL: VERITAS ET STRIPPER</span>
              <div className="text-[9px] text-neutral-400">Date: September 10, 2026</div>
            </div>
            <div className="italic font-serif font-bold text-xs text-[#6B1D2A]">
              E. Rutherford Vance, Esq.
            </div>
          </div>
        </div>
      </div>

      {/* 1-Tap Twitter Raid Copy Button */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleCopyRaidText}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:opacity-95 text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(244,63,94,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 font-mono"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Copied Raid Text to Clipboard!" : "Copy X/Twitter Viral Raid Copypasta"}</span>
        </button>

        <p className="text-[10px] font-mono text-neutral-500 text-center">
          Paste on Twitter/X with a screenshot of this notice to ignite degen outrage.
        </p>
      </div>
    </div>
  );
}

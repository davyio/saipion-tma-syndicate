"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { sensory } from "@/lib/sensory";
import { ArrowLeft, Check, X, Star, FileText, Stamp, ShieldCheck, Clock } from "lucide-react";

export default function ChronosBoardPage() {
  const { user, openInvoice } = useTelegram();
  const [data, setData] = useState<any>(null);
  const [signedState, setSignedState] = useState<boolean>(false);
  const [votesCount, setVotesCount] = useState<number>(2);

  const STARS_NOTARIZE = 250; // $5.00

  useEffect(() => {
    fetch("/api/modules/chronos-board", { method: "POST", body: JSON.stringify({}) })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setData(res);
      })
      .catch(() => {});
  }, []);

  const handleVote = (decision: "APPROVE" | "REJECT") => {
    if (signedState) return;
    sensory.tick();

    if (decision === "APPROVE") {
      setVotesCount(3);
      setSignedState(true);
      setTimeout(() => {
        sensory.successChime();
      }, 300);
    } else {
      sensory.lockThud();
      setSignedState(true);
    }
  };

  const handleNotarize = async () => {
    sensory.lockThud();
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: STARS_NOTARIZE,
          title: "CHRONOS On-Chain Notarization",
          description: "Generates an immutable cryptographic timestamp for resolution RES-2026-089.",
          app_module: "chronos-board",
          userId: user?.id || 777000123,
        }),
      });
      const json = await res.json();
      if (json.invoiceLink) {
        openInvoice(json.invoiceLink, (status) => {
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
          CHRONOS // 02
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          Executive Decision Room
        </span>
        <h1 className="text-2xl font-light tracking-tight text-white">
          Asynchronous Board
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Decisions without meetings. Binding cryptographic resolutions executed in seconds.
        </p>
      </div>

      {/* Primary Active Resolution */}
      <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
            RESOLUTION #089
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
            votesCount >= 3 ? "bg-emerald-950/60 border-emerald-800 text-emerald-300" : "bg-neutral-900 border-neutral-800 text-neutral-400"
          }`}>
            {votesCount >= 3 ? "QUORUM RATIFIED" : "AWAITING SIGNATURE"}
          </span>
        </div>

        <h2 className="text-base font-medium text-white leading-snug">
          Disburse $250,000 Seed Allocation to Monad DePIN Infrastructure
        </h2>

        <p className="text-xs text-neutral-400 leading-relaxed font-serif italic bg-neutral-900/40 p-3 rounded-xl border border-neutral-800/60">
          &quot;Authorizes the managing partner to execute SAFT disbursement from the multi-sig treasury. Requires 3 of 4 general partner signatures.&quot;
        </p>

        {/* Quorum Progress */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-neutral-900">
          <div className="flex justify-between text-[10px] font-mono text-neutral-400">
            <span>Quorum Status:</span>
            <span className="text-white font-bold">{votesCount} / 3 Signatures</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${votesCount >= 3 ? "bg-emerald-400" : "bg-white"}`}
              style={{ width: `${(votesCount / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {signedState ? (
          <div className="py-3 px-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center gap-2 text-xs font-mono text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographic Signature Recorded ({user?.first_name || "Partner"})</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleVote("APPROVE")}
              className="py-3 px-4 rounded-xl bg-white text-black font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Sign Resolution
            </button>
            <button
              onClick={() => handleVote("REJECT")}
              className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 text-xs font-mono flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <X className="w-4 h-4" />
              Veto
            </button>
          </div>
        )}
      </div>

      {/* On-Chain Notarization Tollbooth */}
      <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-medium text-white block">On-Chain Legal Notarization</span>
            <span className="text-[10px] font-mono text-neutral-400">Generates immutable cryptographic timestamp on TON</span>
          </div>
          <span className="text-xs font-mono text-amber-400 flex items-center gap-1 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> {STARS_NOTARIZE} Stars
          </span>
        </div>

        <button
          onClick={handleNotarize}
          className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-mono flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <Stamp className="w-4 h-4 text-neutral-400" />
          Notarize Ratified Resolution ({STARS_NOTARIZE} Stars)
        </button>
      </div>
    </div>
  );
}

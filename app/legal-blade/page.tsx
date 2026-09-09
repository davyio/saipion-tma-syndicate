"use client";

import { useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { ArrowLeft, ShieldX, Star, FileCheck, Lock, AlertCircle, Copy, Check } from "lucide-react";

export default function LegalBladePage() {
  const { user, triggerHaptic, triggerNotificationHaptic, openInvoice } = useTelegram();
  const [contractText, setContractText] = useState<string>(
    "Contractor agrees to indemnify, defend, and hold harmless Client from any and all losses. All IP, source code, and deliverables created shall immediately become Client's exclusive property upon creation, irrespective of whether full payment has been disbursed."
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const STARS_PRICE = 250; // $5.00

  const handleAnalyze = async (unlocked = isUnlocked) => {
    setLoading(true);
    triggerHaptic("medium");

    try {
      const res = await fetch("/api/modules/legal-blade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText, isUnlocked: unlocked }),
      });
      const data = await res.json();
      setResults(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
      triggerNotificationHaptic("warning");
    }
  };

  const handleUnlockCounterOffer = async () => {
    triggerHaptic("heavy");
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: STARS_PRICE,
          title: "Legal Counter-Offer Amendment",
          description: "Generates bulletproof protective counter-clauses.",
          app_module: "legal-blade",
          userId: user?.id || 777000123,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            setIsUnlocked(true);
            handleAnalyze(true);
            triggerNotificationHaptic("success");
          }
        });
      } else {
        setIsUnlocked(true);
        handleAnalyze(true);
      }
    } catch {
      setIsUnlocked(true);
      handleAnalyze(true);
    }
  };

  const copyCounterOffer = () => {
    if (results?.counterOfferClause) {
      navigator.clipboard.writeText(results.counterOfferClause);
      setCopied(true);
      triggerHaptic("light");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded">
          APP-06 // LEGAL BLADE
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-800 text-blue-400">
            <ShieldX className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">The Contract Slayer</h1>
            <p className="text-xs text-slate-400">Identifies unilateral freelancer traps and produces protective counter-amendments.</p>
          </div>
        </div>
      </div>

      {/* Contract Input */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Paste Agreement / Clause Text</label>
        <textarea
          rows={4}
          value={contractText}
          onChange={(e) => setContractText(e.target.value)}
          className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-sans resize-none"
        />
        <button
          onClick={() => handleAnalyze(isUnlocked)}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Scanning Legal Traps..." : "Audit Agreement for Liability Traps"}
        </button>
      </div>

      {/* Audit Findings */}
      {results && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Risk Assessment</span>
              <span className="text-sm font-bold text-rose-400 font-mono">{results.riskLevel}</span>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-500 uppercase block">Critical Traps</span>
              <span className="text-sm font-bold text-amber-400">{results.trapsFound} Clauses Flagged</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {results.traps.map((t: any) => (
              <div key={t.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-white">{t.title}</h3>
                  <span className="text-[9px] font-mono bg-rose-950 text-rose-400 border border-rose-800 px-1.5 py-0.5 rounded font-bold">
                    {t.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 italic bg-slate-950 p-2 rounded border border-slate-800/60 font-mono">
                  &quot;{t.snippet}&quot;
                </p>
                <p className="text-xs text-rose-300/90 leading-relaxed font-sans">
                  ⚠️ {t.risk}
                </p>
              </div>
            ))}
          </div>

          {/* Counter-Offer Section / Tollbooth */}
          {results.counterOfferClause ? (
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4" /> Protective Counter-Offer Clause
                </span>
                <button
                  onClick={copyCounterOffer}
                  className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                {results.counterOfferClause}
              </pre>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 flex flex-col gap-3 shadow-2xl">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">Generate Protective Counter-Offer:</span>
                <span className="text-amber-400 font-bold font-mono flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {STARS_PRICE} Stars ($5)
                </span>
              </div>
              <button
                onClick={handleUnlockCounterOffer}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
              >
                <Lock className="w-4 h-4" />
                Unlock Counter-Offer Amendment Text
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

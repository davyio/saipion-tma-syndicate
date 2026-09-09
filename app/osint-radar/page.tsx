"use client";

import { useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { ArrowLeft, ShieldAlert, Star, Lock, Unlock, AlertTriangle, Eye, RefreshCw, KeyRound, Database } from "lucide-react";

export default function OsintRadarPage() {
  const { user, triggerHaptic, triggerNotificationHaptic, openInvoice } = useTelegram();
  const [target, setTarget] = useState<string>("target_trader@gmail.com");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const STARS_PRICE = 100; // $2.00

  const handleScan = async (unlockedState = isUnlocked) => {
    setLoading(true);
    triggerHaptic("heavy");

    try {
      const res = await fetch("/api/modules/osint-radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, isUnlocked: unlockedState }),
      });
      const data = await res.json();
      setResults(data);
    } catch {
      // Mock fallback
    } finally {
      setLoading(false);
      triggerNotificationHaptic("warning");
    }
  };

  const handleUnlockReport = async () => {
    triggerHaptic("heavy");
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: STARS_PRICE,
          title: "Un-Redact Threat Dossier",
          description: "Reveals exposed plaintext passwords, IP logs, and hash salts.",
          app_module: "osint-radar",
          userId: user?.id || 777000123,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            setIsUnlocked(true);
            handleScan(true);
            triggerNotificationHaptic("success");
          }
        });
      } else {
        setIsUnlocked(true);
        handleScan(true);
      }
    } catch {
      setIsUnlocked(true);
      handleScan(true);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded">
          APP-05 // OSINT RADAR
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">The Doxx-Radar</h1>
            <p className="text-xs text-slate-400">Scans public database leaks for compromised credentials & IP footprints.</p>
          </div>
        </div>
      </div>

      {/* Target Search Box */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Target Email or Telegram Handle</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="target@example.com"
            className="flex-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
          />
          <button
            onClick={() => handleScan(isUnlocked)}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Scan
          </button>
        </div>
      </div>

      {/* Results Screen */}
      {results && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          {/* Threat Metric Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/60 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Threat Vulnerability Score</span>
              <span className="text-2xl font-black text-rose-500 font-mono">{results.threatScore} / 100</span>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-500 uppercase block">Breached Databases</span>
              <span className="text-sm font-bold text-amber-400">{results.breachesFound} Confirmed Leaks</span>
            </div>
          </div>

          {/* Breach List */}
          <div className="flex flex-col gap-2.5">
            {results.breaches.map((b: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-white">{b.service}</h3>
                    <span className="text-[10px] text-slate-500 font-mono">{b.date}</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    b.threat === "CRITICAL" ? "bg-rose-950 text-rose-400 border border-rose-800" : "bg-amber-950 text-amber-400 border border-amber-800"
                  }`}>
                    {b.threat}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px]">
                  <span className="text-slate-500 block text-[9px] mb-1">COMPROMISED VALUE:</span>
                  <span className={isUnlocked ? "text-emerald-400 font-bold" : "text-rose-400/90"}>
                    {b.leakedHash}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tollbooth Action */}
          {!isUnlocked && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 flex flex-col gap-3 shadow-2xl">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  Unmask Plaintext Passwords & Leaks:
                </span>
                <span className="text-amber-400 font-bold font-mono flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {STARS_PRICE} Stars ($2)
                </span>
              </div>
              <button
                onClick={handleUnlockReport}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-[0.98]"
              >
                <Lock className="w-4 h-4" />
                Un-Redact Full Threat Dossier
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

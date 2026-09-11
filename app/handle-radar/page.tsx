"use client";

import { useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { sensory } from "@/lib/sensory";
import {
  ArrowLeft,
  Radar,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  Download,
  Star,
  Sparkles,
  ShieldCheck,
  Globe,
  Filter,
} from "lucide-react";

interface CheckResult {
  handle: string;
  platform: string;
  category: string;
  profileUrl: string;
  status: "AVAILABLE" | "TAKEN" | "RESTRICTED";
  checkedAt: string;
}

export default function HandleRadarPage() {
  const { user, openInvoice } = useTelegram();
  const [handleInput, setHandleInput] = useState<string>("destinyphibeta");
  const [includePermutations, setIncludePermutations] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanSummary, setScanSummary] = useState<any>(null);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [filterPlatform, setFilterPlatform] = useState<string>("ALL");
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  const handleSweep = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!handleInput.trim() || isScanning) return;

    sensory.lockThud();
    setIsScanning(true);

    try {
      const res = await fetch("/api/modules/handle-radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rootHandle: handleInput.trim(),
          includePermutations,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setScanSummary(data.summary);
        setResults(data.results || []);
        sensory.successChime();
      }
    } catch (_) {
    } finally {
      setIsScanning(false);
    }
  };

  const handleExportCsv = () => {
    sensory.tick();
    const available = results.filter((r) => r.status === "AVAILABLE");
    if (available.length === 0) return;

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Handle,Platform,Category,ProfileUrl,Status"]
        .concat(available.map((r) => `${r.handle},${r.platform},${r.category},${r.profileUrl},${r.status}`))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${handleInput}_available_handles.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    sensory.successChime();
  };

  const handleCopyHandle = (handle: string) => {
    sensory.tick();
    navigator.clipboard.writeText(handle);
    setCopiedHandle(handle);
    setTimeout(() => setCopiedHandle(null), 1500);
  };

  const handleDeepScanPurchase = async () => {
    sensory.lockThud();
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: 25,
          title: "Pro Namespace & Domain Audit",
          description: "Full Web2 + Web3 TLD (.sol, .eth, .com) availability scan and trademark conflict report.",
          app_module: "handle-radar",
          userId: user?.id || 777000101,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            sensory.successChime();
            alert("Pro Namespace Scan verified. 50+ international registries unlocked.");
          }
        });
      }
    } catch (_) {}
  };

  const filteredResults =
    filterPlatform === "ALL"
      ? results
      : results.filter((r) => (filterPlatform === "AVAILABLE" ? r.status === "AVAILABLE" : r.platform === filterPlatform));

  return (
    <div className="min-h-screen -mx-4 -my-6 px-4 py-6 bg-[#080A10] text-neutral-100 font-sans antialiased flex flex-col gap-5 selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-[#080A10]/90 backdrop-blur-xl border-b border-cyan-500/20 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => sensory.tick()}
          className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-wider font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            HANDLE RADAR // OSINT
          </span>
        </div>
      </header>

      {/* Hero Visual Card */}
      <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#0D1527] via-[#090D18] to-[#080A10] border border-cyan-500/30 shadow-[0_4px_30px_rgba(6,182,212,0.15)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Radar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Handle Radar <span className="text-cyan-400 text-xs font-mono">RECON</span>
              </h1>
              <p className="text-[11px] text-neutral-400">Multi-Platform Digital Real Estate Availability Scanner</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            LAYER 1 OSINT
          </span>
        </div>

        {/* Search & Permutation Form */}
        <form onSubmit={handleSweep} className="flex flex-col gap-2.5 pt-1">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-neutral-500 font-mono text-xs">@</span>
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder="root handle (e.g. destinyphibeta)"
                className="w-full pl-7 pr-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isScanning || !handleInput.trim()}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-black font-bold font-mono text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95 transition-all shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isScanning ? "Scanning..." : "Sweep"}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-400 hover:text-white">
              <input
                type="checkbox"
                checked={includePermutations}
                onChange={(e) => setIncludePermutations(e.target.checked)}
                className="rounded border-white/20 text-cyan-500 focus:ring-0"
              />
              <span>Generate Permutations (_sol, _scf, _fund, _dao)</span>
            </label>

            {results.length > 0 && (
              <button
                type="button"
                onClick={handleExportCsv}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </form>

        {/* Telemetry Summary */}
        {scanSummary && (
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/40 border border-cyan-500/20 text-[10px] font-mono">
            <div>
              <span className="text-neutral-500 block">Inspected</span>
              <span className="text-white font-bold text-xs">{scanSummary.totalInspected} Nodes</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Available</span>
              <span className="text-emerald-400 font-bold text-xs">{scanSummary.available} Open</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Availability</span>
              <span className="text-cyan-400 font-bold text-xs">{scanSummary.availabilityScore}</span>
            </div>
          </div>
        )}
      </div>

      {/* Platform Filter Tabs */}
      {results.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
          {[
            { id: "ALL", label: "All Results" },
            { id: "AVAILABLE", label: "🟢 Open Only" },
            { id: "Telegram", label: "Telegram" },
            { id: "GitHub", label: "GitHub" },
            { id: "X / Twitter", label: "X / Twitter" },
            { id: "TikTok", label: "TikTok" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterPlatform(tab.id);
                sensory.tick();
              }}
              className={`whitespace-nowrap px-2.5 py-1 rounded-full border text-[11px] transition-all ${
                filterPlatform === tab.id
                  ? "bg-cyan-500 text-black font-bold border-cyan-500"
                  : "bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Results Feed */}
      <div className="flex flex-col gap-2">
        {filteredResults.length === 0 && !isScanning && (
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center flex flex-col items-center gap-2">
            <Radar className="w-8 h-8 text-neutral-600 animate-pulse" />
            <span className="text-xs font-medium text-neutral-400">Namespace Radar Idle</span>
            <p className="text-[11px] text-neutral-500 max-w-xs">
              Enter your campaign seed keyword above to run parallel reconnaissance across 7 major social networks.
            </p>
          </div>
        )}

        {filteredResults.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
              item.status === "AVAILABLE"
                ? "bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.08)]"
                : "bg-black/30 border-white/5 opacity-70"
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="text-sm">
                {item.status === "AVAILABLE" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </span>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-mono font-bold text-white truncate">
                  @{item.handle}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {item.platform} • {item.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  item.status === "AVAILABLE"
                    ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40"
                    : "bg-rose-900/40 text-rose-300 border border-rose-500/30"
                }`}
              >
                {item.status}
              </span>

              <button
                onClick={() => handleCopyHandle(item.handle)}
                title="Copy Handle"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors"
              >
                {copiedHandle === item.handle ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <a
                href={item.profileUrl}
                target="_blank"
                rel="noreferrer"
                title="Verify on Platform"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pro TLD & Trademark Star Tollbooth */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-black border border-cyan-500/30 flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pro Namespace & TLD Deep Scan</span>
            </div>
            <div className="text-[10px] text-neutral-400">
              Audits .sol, .eth, .com, .io, plus trademark registry conflict checks.
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>25 Stars</span>
          </div>
        </div>

        <button
          onClick={handleDeepScanPurchase}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-black font-bold text-xs tracking-wider uppercase font-mono shadow-[0_0_15px_rgba(6,182,212,0.35)] active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Run 25-Star Pro Namespace Audit</span>
        </button>
      </div>

      {/* Operational Protocol Notes */}
      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1 text-[10px] font-mono text-neutral-400">
        <div className="text-cyan-400 font-bold uppercase">Digital Land-Grab Protocol</div>
        <div>• Layer 1 OSINT handles parallel queries across public platform APIs.</div>
        <div>• Export available lists directly into ATLAS OS to assign registration across team devices.</div>
      </div>
    </div>
  );
}

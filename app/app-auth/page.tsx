"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2, AlertTriangle, User, Database, Lock } from "lucide-react";

export default function AppAuthPage() {
  const { user, initData, isReady, isTma, triggerHaptic } = useTelegram();
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock initData generator for desktop browser development outside Telegram
  const runValidation = async (customInitData?: string) => {
    setIsValidating(true);
    setError(null);
    triggerHaptic("light");

    const dataToValidate = customInitData || initData;

    try {
      if (!dataToValidate) {
        // If outside Telegram, send a simulated mock validation
        const simulatedUser = {
          id: 777000123,
          first_name: "Syndicate",
          last_name: "Operator",
          username: "saipion_operator",
          language_code: "en",
          is_premium: true,
        };

        setValidationResult({
          verified: true,
          isMock: true,
          user: simulatedUser,
          syncedToDb: false,
          note: "Running in browser preview mode (outside Telegram client). In live TMA, HMAC-SHA256 is validated against TELEGRAM_BOT_TOKEN.",
        });
        setIsValidating(false);
        return;
      }

      const res = await fetch("/api/auth/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData: dataToValidate }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Cryptographic validation failed.");
      }

      setValidationResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to validate identity.");
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (isReady) {
      runValidation();
    }
  }, [isReady, initData]);

  return (
    <div className="flex flex-col gap-5">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
          APP-01 // IDENTITY NODE
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Cryptographic Identity Node
            </h1>
            <p className="text-xs text-slate-400">
              Validates Telegram initData HMAC & synchronizes Supabase record.
            </p>
          </div>
        </div>
      </div>

      {/* Verification Status Card */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isValidating
                  ? "bg-amber-400 animate-ping"
                  : validationResult?.verified
                  ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                  : "bg-rose-500"
              }`}
            />
            <span className="text-xs font-mono font-semibold uppercase text-slate-200">
              {isValidating
                ? "Validating Hash..."
                : validationResult?.verified
                ? "Cryptographically Verified"
                : "Awaiting Verification"}
            </span>
          </div>

          <button
            onClick={() => runValidation()}
            disabled={isValidating}
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? "animate-spin" : ""}`} />
            Re-verify
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Signature Validation Error</p>
              <p className="text-[11px] opacity-80">{error}</p>
            </div>
          </div>
        )}

        {/* User Identity Matrix */}
        {validationResult?.user ? (
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {validationResult.user.first_name?.[0] || "U"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white">
                      {validationResult.user.first_name} {validationResult.user.last_name || ""}
                    </span>
                    {validationResult.user.is_premium && (
                      <span className="text-[9px] font-mono bg-amber-950 text-amber-300 border border-amber-800/70 px-1.5 py-0.2 rounded font-bold">
                        ★ PREMIUM
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-cyan-400 font-mono">
                    @{validationResult.user.username || "no_username"}
                  </span>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-500 block">TELEGRAM ID</span>
                <span className="text-xs font-semibold text-slate-300">
                  {validationResult.user.id}
                </span>
              </div>
            </div>

            {/* Sub-system Checkmarks */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 text-[11px]">HMAC-SHA256 OK</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300 text-[11px]">
                  {validationResult.syncedToDb ? "Supabase Synced" : "Stateless Sync Ready"}
                </span>
              </div>
            </div>

            {validationResult.note && (
              <p className="text-[11px] text-slate-400 italic bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/50">
                {validationResult.note}
              </p>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 font-mono">
            Reading Telegram initialization buffer...
          </div>
        )}
      </div>

      {/* Technical Diagnostics */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col gap-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          Cryptographic Specs
        </span>
        <p className="text-xs text-slate-400 leading-relaxed">
          The node computes <code className="text-cyan-300 font-mono text-[11px]">HMAC_SHA256(&quot;WebAppData&quot;, bot_token)</code> to produce the secret key, then compares against the incoming data check string using constant-time evaluation to prevent timing attacks.
        </p>
      </div>
    </div>
  );
}

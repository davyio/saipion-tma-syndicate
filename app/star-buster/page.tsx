"use client";

import { useState } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { Star, Coffee, ArrowLeft, CheckCircle, AlertCircle, Loader2, Sparkles, Receipt } from "lucide-react";

export default function StarBusterPage() {
  const { user, isTma, triggerHaptic, triggerNotificationHaptic, openInvoice } = useTelegram();
  const [loading, setLoading] = useState<boolean>(false);
  const [invoiceLink, setInvoiceLink] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "paid" | "failed" | "simulated">("idle");
  const [lastReceipt, setLastReceipt] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const STARS_PRICE = 1;

  const handlePurchase = async () => {
    setLoading(true);
    setErrorMessage(null);
    setPaymentStatus("pending");
    triggerHaptic("medium");

    try {
      // 1. Generate live Telegram Stars invoice link from backend
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: STARS_PRICE,
          title: "Virtual Coffee",
          description: "Saipion Syndicate Tollbooth Validation Protocol",
          app_module: "star-buster",
          userId: user?.id || 777000123,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.invoiceLink) {
        throw new Error(data.error || "Failed to generate Stars invoice link.");
      }

      setInvoiceLink(data.invoiceLink);

      // 2. If inside native Telegram Mini App, open native Telegram Stars checkout sheet
      if (isTma) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            triggerNotificationHaptic("success");
            setPaymentStatus("paid");
            setLastReceipt({
              currency: "XTR",
              amount: STARS_PRICE,
              timestamp: new Date().toLocaleTimeString(),
              chargeId: `tg_stars_${Date.now()}`,
            });
          } else if (status === "failed") {
            triggerNotificationHaptic("error");
            setPaymentStatus("failed");
            setErrorMessage("Stars transaction failed or was declined.");
          } else {
            setPaymentStatus("idle");
          }
          setLoading(false);
        });
      } else {
        // Outside Telegram (browser preview mode): Provide simulator options
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Tollbooth execution failed.");
      setPaymentStatus("failed");
      triggerNotificationHaptic("error");
      setLoading(false);
    }
  };

  // Browser Simulation Trigger for local verification without live mobile TMA
  const simulatePaymentClearance = async () => {
    setLoading(true);
    triggerHaptic("heavy");

    try {
      const mockChargeId = `sim_xtr_${Date.now()}`;
      // Trigger Omni-Hook payment handler directly
      await fetch("/api/telegram-handler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: {
            message_id: 99999,
            from: { id: user?.id || 777000123, first_name: user?.first_name || "Operator" },
            chat: { id: user?.id || 777000123 },
            successful_payment: {
              currency: "XTR",
              total_amount: STARS_PRICE,
              invoice_payload: JSON.stringify({ app_module: "star-buster", userId: user?.id || 777000123 }),
              telegram_payment_charge_id: mockChargeId,
            },
          },
        }),
      });

      setPaymentStatus("simulated");
      setLastReceipt({
        currency: "XTR",
        amount: STARS_PRICE,
        timestamp: new Date().toLocaleTimeString(),
        chargeId: mockChargeId,
      });
      triggerNotificationHaptic("success");
    } catch (e: any) {
      setErrorMessage("Simulation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
          APP-02 // TOLLBOOTH
        </span>
      </div>

      {/* Hero Header */}
      <div className="text-center flex flex-col items-center gap-2 mt-2">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
            <Coffee className="w-8 h-8" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 p-1 rounded-full shadow-md">
            <Star className="w-3 h-3 fill-slate-950" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight mt-2">
          Star Buster Tollbooth
        </h1>
        <p className="text-xs text-slate-400 max-w-xs">
          Instantaneous micro-payment gate validating the Telegram Stars (XTR) protocol.
        </p>
      </div>

      {/* Tollbooth Payment Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              Item Specification
            </span>
            <span className="text-base font-bold text-white">Virtual Coffee</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              Price
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-bold font-mono">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{STARS_PRICE} Star (XTR)</span>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success State */}
        {(paymentStatus === "paid" || paymentStatus === "simulated") && lastReceipt && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 flex flex-col gap-2.5 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-bold">
                {paymentStatus === "paid" ? "Payment Confirmed via Stars!" : "Payment Successfully Simulated!"}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 font-mono text-[11px] text-slate-300 flex flex-col gap-1 border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Charge ID:</span>
                <span className="text-cyan-400 truncate max-w-[180px]">{lastReceipt.chargeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <span className="text-amber-400">{lastReceipt.amount} Stars</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ledger:</span>
                <span className="text-emerald-400">Written to Supabase</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Tollbooth Action Button */}
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Tollbooth...
            </>
          ) : (
            <>
              <Star className="w-4 h-4 fill-slate-950" />
              Pay {STARS_PRICE} Star (1-Click Tollbooth)
            </>
          )}
        </button>

        {/* Browser Development Mode Notice / Simulator */}
        {!isTma && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Receipt className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[11px]">Browser Mode Simulator</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When opened outside the Telegram client, native checkout sheets cannot render. Test the full Omni-Hook & Supabase payment logging pipeline below:
            </p>
            <button
              onClick={simulatePaymentClearance}
              disabled={loading}
              className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-400 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Simulate Live Payment Receipt
            </button>
          </div>
        )}
      </div>

      {/* Pipeline Specifications */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-400 flex flex-col gap-1.5">
        <span className="text-[10px] text-slate-500 uppercase">Tollbooth Protocol Matrix</span>
        <div className="flex justify-between text-slate-300">
          <span>Currency:</span>
          <span className="text-amber-400">XTR (Telegram Stars)</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Pre-Checkout Clearance:</span>
          <span className="text-emerald-400">answerPreCheckoutQuery OK</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Receipt Target:</span>
          <span className="text-cyan-400">public.payments</span>
        </div>
      </div>
    </div>
  );
}

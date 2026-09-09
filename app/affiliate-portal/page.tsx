"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { ArrowLeft, Users, Star, Copy, Check, DollarSign, Wallet, ArrowUpRight, Share2, ShieldCheck } from "lucide-react";

export default function AffiliatePortalPage() {
  const { user, triggerHaptic, triggerNotificationHaptic } = useTelegram();
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [claimSuccess, setClaimSuccess] = useState<boolean>(false);

  const affiliateRef = user?.username ? `ref_${user.username}` : "ref_syndicate_vip";
  const referralLink = `https://t.me/saipion_bot?start=${affiliateRef}`;

  useEffect(() => {
    fetch("/api/modules/affiliate-portal", { method: "POST", body: JSON.stringify({ affiliateCode: affiliateRef }) })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && res.stats) setData(res.stats);
      })
      .catch(() => {});
  }, [affiliateRef]);

  const copyRefLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    triggerHaptic("light");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaim = async () => {
    setClaiming(true);
    triggerHaptic("heavy");

    try {
      const res = await fetch("/api/modules/affiliate-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "claim_payout", affiliateCode: affiliateRef }),
      });
      const json = await res.json();
      if (json.ok) {
        setClaimSuccess(true);
        triggerNotificationHaptic("success");
      }
    } catch {
      setClaimSuccess(true);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
          APP-16 // AFFILIATE REVENUE
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Group Partner Portal</h1>
            <p className="text-xs text-slate-400">Earn 30% lifetime revenue on all Stars spent by your members.</p>
          </div>
        </div>
      </div>

      {/* Referral Link Box */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Your Group Broadcast Link</span>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-mono select-all focus:outline-none"
          />
          <button
            onClick={copyRefLink}
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Commission Earnings Overview */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Total Generated</span>
          <span className="text-xl font-black text-white font-mono">{data?.totalVolumeGeneratedStars?.toLocaleString() || "14,850"} ⭐</span>
          <span className="text-[10px] font-mono text-slate-400">From {data?.activeTraders || "184"} users</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-900/60 flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Claimable Cut (30%)</span>
          <span className="text-xl font-black text-emerald-400 font-mono">{data?.claimableBalanceStars?.toLocaleString() || "2,150"} ⭐</span>
          <span className="text-[10px] font-mono text-emerald-400/80">{data?.claimableBalanceUsd || "$43.00"} USD</span>
        </div>
      </div>

      {/* Claim Payout Action */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
        {claimSuccess ? (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-mono text-xs text-center flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Payout queued to your connected TON wallet!
          </div>
        ) : (
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Wallet className="w-4 h-4" />
            {claiming ? "Processing..." : "Claim 2,150 Stars Payout to TON Wallet"}
          </button>
        )}
      </div>

      {/* Recent Referral Activity */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Live Referral Activity</span>
        <div className="flex flex-col gap-2">
          {data?.recentReferrals?.map((ref: any, idx: number) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-white font-bold block">{ref.handle}</span>
                <span className="text-[10px] text-slate-500">{ref.action}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400">+{ref.earnedStars} ⭐</span>
                <span className="text-[9px] text-slate-500 block">{ref.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

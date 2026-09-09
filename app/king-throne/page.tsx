"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { ArrowLeft, Crown, Star, Flame, Megaphone, ExternalLink, ShieldAlert, Sparkles, Coins } from "lucide-react";

export default function KingThronePage() {
  const { user, triggerHaptic, triggerNotificationHaptic, openInvoice } = useTelegram();
  const [data, setData] = useState<any>(null);
  const [customMsg, setCustomMsg] = useState<string>("CHECK OUT MY TELEGRAM CHANNEL @alpha_signals");
  const [customLink, setCustomLink] = useState<string>("https://t.me/alpha_signals");
  const [loading, setLoading] = useState<boolean>(false);
  const [seizedSuccess, setSeizedSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/modules/king-throne", { method: "POST", body: JSON.stringify({}) })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setData(res);
      })
      .catch(() => {});
  }, []);

  const handleSeizeThrone = async () => {
    if (!customMsg.trim()) return;
    setLoading(true);
    triggerHaptic("heavy");

    const bidStars = data?.minNextBid || 175;

    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: bidStars,
          title: "Seize the Pinned Throne",
          description: "Pins your promotional broadcast at the top of the syndicate network.",
          app_module: "king-throne",
          userId: user?.id || 777000123,
        }),
      });

      const json = await res.json();

      const executeSeize = () => {
        setSeizedSuccess(true);
        if (data) {
          setData({
            ...data,
            currentKing: {
              handle: user?.username ? `@${user.username}` : "@you",
              name: user?.first_name || "New King",
              pinnedMessage: customMsg,
              link: customLink,
              bidStars,
              timeHeld: "Just now",
            },
            currentBid: bidStars,
            minNextBid: bidStars + 25,
            jackpotPool: data.jackpotPool + Math.round(bidStars * 0.2),
          });
        }
        triggerNotificationHaptic("success");
      };

      if (json.invoiceLink) {
        openInvoice(json.invoiceLink, (status) => {
          if (status === "paid") {
            executeSeize();
          }
        });
      } else {
        executeSeize();
      }
    } catch {
      setSeizedSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
          APP-13 // KING OF THE HILL
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-400">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">The Pinned Throne</h1>
            <p className="text-xs text-slate-400">Outbid the King to pin your link globally. 10% syndicate house toll.</p>
          </div>
        </div>
      </div>

      {/* Jackpot & Rake Pool Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-yellow-950/40 to-slate-900 border border-amber-500/40 flex items-center justify-between shadow-xl">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Rolling Jackpot Pool</span>
          <span className="text-2xl font-black text-amber-400 font-mono flex items-center gap-1.5">
            <Coins className="w-5 h-5" /> {data?.jackpotPool || 1420} Stars
          </span>
        </div>
        <div className="text-right font-mono text-[10px]">
          <span className="text-slate-400 uppercase block">Rule</span>
          <span className="text-amber-300 font-bold">Hold 30m = Win Pot</span>
        </div>
      </div>

      {/* Current Kings Throne Card */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/60 flex flex-col gap-3 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">{data?.currentKing?.name || "Trench Raider"}</span>
              <span className="text-[10px] font-mono text-amber-400">{data?.currentKing?.handle || "@sol_whale"}</span>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-500 block">CURRENT BID</span>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5 justify-end">
              <Star className="w-3 h-3 fill-amber-400" /> {data?.currentBid || 150} Stars
            </span>
          </div>
        </div>

        {/* Pinned Broadcast Message */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex flex-col gap-2 font-mono">
          <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold uppercase tracking-wider">
            <Megaphone className="w-3.5 h-3.5" /> Globally Pinned Broadcast:
          </div>
          <p className="text-xs text-white font-sans font-medium leading-relaxed">
            "{data?.currentKing?.pinnedMessage}"
          </p>
          {data?.currentKing?.link && (
            <a
              href={data.currentKing.link}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline pt-1"
            >
              <span>{data.currentKing.link}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Dethrone Action Box */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
        <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-400" /> Overbid and Seize the Throne
        </span>

        <div>
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Your Broadcast Message</label>
          <input
            type="text"
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder="Buy $TOKEN on Pump.fun or Join @mygroup"
            className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Target Link (Optional)</label>
          <input
            type="text"
            value={customLink}
            onChange={(e) => setCustomLink(e.target.value)}
            placeholder="https://t.me/yourgroup"
            className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        <button
          onClick={handleSeizeThrone}
          disabled={loading || !customMsg.trim()}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-[0.98] disabled:opacity-50"
        >
          <Crown className="w-4 h-4 fill-slate-950" />
          Seize Throne for {data?.minNextBid || 175} Stars
        </button>

        <span className="text-[10px] font-mono text-slate-500 text-center">
          10% Syndicate House Rake - 20% Jackpot - 70% Dethroned King Payout
        </span>
      </div>
    </div>
  );
}

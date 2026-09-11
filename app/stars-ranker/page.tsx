"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { ArrowLeft, Trophy, Star, Zap, Share2, Flame, Crown, ChevronRight, Search } from "lucide-react";
import { UserProfileModal, UserProfileData } from "@/components/UserProfileModal";
import { sensory } from "@/lib/sensory";

export default function StarsRankerPage() {
  const { user, triggerHaptic, triggerNotificationHaptic, openInvoice } = useTelegram();
  const [data, setData] = useState<any>(null);
  const [userScore, setUserScore] = useState<number>(4200);
  const [userRank, setUserRank] = useState<number>(14);

  // User Profile Inspector State
  const [selectedUser, setSelectedUser] = useState<UserProfileData | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetch("/api/modules/stars-ranker", { method: "POST", body: JSON.stringify({}) })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setData(res);
      })
      .catch(() => {});
  }, []);

  const handleInspectUser = async (handle: string, name: string, rank: number, score: number) => {
    sensory.tick();
    try {
      const res = await fetch(`/api/users/profile?query=${encodeURIComponent(handle)}`);
      const profile = await res.json();
      if (profile.ok && profile.user) {
        setSelectedUser({
          ...profile.user,
          name: name || profile.user.name,
          reputationScore: Math.min(99, 80 + Math.floor(score / 1000)),
        });
        setShowProfileModal(true);
        return;
      }
    } catch (_) {}

    setSelectedUser({
      telegramId: Math.floor(100000000 + Math.random() * 900000000),
      username: handle.replace("@", ""),
      name,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: `Rank #${rank} on Syndicate Stars Leaderboard with ${score.toLocaleString()} Clout Points.`,
      role: rank <= 3 ? "ADMIN" : "MEMBER",
      isVerified: true,
      starsBalance: Math.floor(score / 10),
      reputationScore: 95,
    });
    setShowProfileModal(true);
  };

  const handleBoost = async (stars: number, points: number) => {
    triggerHaptic("heavy");

    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars,
          title: `Rank Boost (+${points} Points)`,
          description: "Instantly catapult your status on the global Syndicate Leaderboard.",
          app_module: "stars-ranker",
          userId: user?.id || 777000123,
        }),
      });

      const json = await res.json();

      const applyBoost = () => {
        setUserScore((s) => s + points);
        setUserRank((r) => Math.max(1, r - (stars >= 250 ? 5 : 2)));
        triggerNotificationHaptic("success");
      };

      if (json.invoiceLink) {
        openInvoice(json.invoiceLink, (status) => {
          if (status === "paid") {
            applyBoost();
          }
        });
      } else {
        applyBoost();
      }
    } catch {
      setUserScore((s) => s + points);
      setUserRank((r) => Math.max(1, r - 2));
    }
  };

  const shareFlex = () => {
    triggerHaptic("medium");
    const text = encodeURIComponent(
      `⭐ I am Rank #${userRank} on the Syndicate Stars Leaderboard with ${userScore.toLocaleString()} Points! Can you beat my flex?`
    );
    const url = encodeURIComponent("https://t.me/saipion_bot?startapp=ranker");
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
  };

  const filteredLeaderboard = data?.leaderboard?.filter((entry: any) => {
    if (!searchQuery) return true;
    return (
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.handle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col gap-5 text-slate-100">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-yellow-400 bg-yellow-950/60 border border-yellow-800 px-2 py-0.5 rounded">
          APP-12 // STARS RANKER
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-yellow-950/60 border border-yellow-800 text-yellow-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Stars Leaderboard</h1>
            <p className="text-xs text-slate-400">Climb the social clout ladder. Flex status across Telegram groups.</p>
          </div>
        </div>
      </div>

      {/* User Status Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-950 border border-amber-500/40 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-mono font-black text-amber-300 text-base">
            #{userRank}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">{user?.first_name || "Operator"}</span>
              <span className="text-[9px] font-mono text-amber-400 bg-amber-950 border border-amber-800 px-1.5 py-0.2 rounded">
                YOU
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400 block mt-0.5">
              {userScore.toLocaleString()} Clout Points
            </span>
          </div>
        </div>

        <button
          onClick={shareFlex}
          className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          Flex
        </button>
      </div>

      {/* Boost Packs (Tollbooths) */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" /> Clout Booster Packs
        </span>
        <div className="grid grid-cols-3 gap-2">
          {[
            { stars: 50, points: 500, label: "+500 Pts", desc: "Scout" },
            { stars: 250, points: 3000, label: "+3k Pts", desc: "Whale Surge", highlight: true },
            { stars: 1000, points: 15000, label: "+15k Pts", desc: "Emperor" },
          ].map((pack) => (
            <button
              key={pack.stars}
              onClick={() => handleBoost(pack.stars, pack.points)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                pack.highlight
                  ? "bg-gradient-to-b from-amber-500/20 to-yellow-500/10 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase">{pack.desc}</span>
              <span className="text-sm font-black font-mono">{pack.label}</span>
              <span className="text-[10px] font-mono text-amber-400 flex items-center gap-0.5 mt-0.5">
                <Star className="w-3 h-3 fill-amber-400" /> {pack.stars} Stars
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Operator Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search leaderboard by @handle or name..."
          className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
        />
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
      </div>

      {/* Leaderboard List */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          <span>Top Syndicate Whales</span>
          <span>Tap row to inspect profile</span>
        </div>
        <div className="flex flex-col gap-2">
          {filteredLeaderboard?.map((entry: any) => (
            <div
              key={entry.rank}
              onClick={() => handleInspectUser(entry.handle, entry.name, entry.rank, entry.score)}
              className={`p-3 rounded-xl border flex items-center justify-between font-mono text-xs cursor-pointer hover:border-amber-500/50 transition-all ${
                entry.rank === 1
                  ? "bg-amber-950/40 border-amber-500/50"
                  : entry.rank === 2
                  ? "bg-slate-900/90 border-slate-700"
                  : entry.rank === 3
                  ? "bg-amber-950/20 border-amber-800/40"
                  : "bg-slate-950 border-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-5 font-black text-center ${
                    entry.rank === 1
                      ? "text-amber-400 text-sm"
                      : entry.rank === 2
                      ? "text-slate-300"
                      : entry.rank === 3
                      ? "text-amber-600"
                      : "text-slate-500"
                  }`}
                >
                  #{entry.rank}
                </span>
                <div>
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="text-white font-bold text-xs">{entry.name}</span>
                    <span className="text-[9px] font-mono text-slate-500">{entry.handle}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 block">{entry.badge}</span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs font-bold text-amber-400">{entry.score.toLocaleString()} Pts</span>
                <span className="text-[9px] text-slate-500 block">{entry.starsDonated} ⭐ Burned</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Profile Inspector Modal */}
      <UserProfileModal
        user={selectedUser}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}

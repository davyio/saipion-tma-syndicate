"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { sensory } from "@/lib/sensory";
import {
  ArrowLeft,
  Sparkles,
  Heart,
  MessageCircle,
  Star,
  Send,
  Lock,
  Check,
  TrendingUp,
  Flame,
  Volume2,
  VolumeX,
  X,
  Radio,
  Zap,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  Download,
  Clock,
  DollarSign,
  ChevronRight,
  Eye,
} from "lucide-react";

interface Performer {
  id: string;
  name: string;
  stageName: string;
  major: string;
  school: string;
  semesterGoalUsd: number;
  fundedUsd: number;
  avatar: string;
  bannerImage: string;
  vibe: string;
  unlockedContent: Array<{
    id: string;
    title: string;
    type: "notes" | "choreography" | "audio";
    starsCost: number;
    description: string;
  }>;
}

interface ChatMessage {
  sender: "user" | "performer" | "system";
  text: string;
  timestamp: string;
}

export default function ChampagneStagePage() {
  const { user, openInvoice } = useTelegram();
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null);
  const [activeTab, setActiveTab] = useState<"roster" | "dressing_room" | "whale_desk">("roster");

  // Chat State
  const [chatDrawerOpen, setChatDrawerOpen] = useState<boolean>(false);
  const [chattingWith, setChattingWith] = useState<Performer | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Content Unlock State
  const [unlockedItems, setUnlockedItems] = useState<Record<string, boolean>>({});
  const [isUnlocking, setIsUnlocking] = useState<string | null>(null);

  // Whale Alert State
  const [whaleAlertPerformerId, setWhaleAlertPerformerId] = useState<string>("destiny");
  const [whaleBountyAmount, setWhaleBountyAmount] = useState<number>(500);
  const [whaleMessage, setWhaleMessage] = useState<string>("Anon whale sends love from the trading floor!");
  const [whaleAlertSuccess, setWhaleAlertSuccess] = useState<string | null>(null);

  // Sound FX synthesis (procedural Champagne Pop & Heel Click)
  const playHeelClick = () => {
    try {
      sensory.tick();
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (_) {}
  };

  const playChampagnePop = () => {
    try {
      sensory.successChime();
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (_) {}
  };

  // Fetch Performers
  useEffect(() => {
    async function loadPerformers() {
      try {
        const res = await fetch("/api/modules/champagne-stage");
        const data = await res.json();
        if (data.ok && data.performers) {
          setPerformers(data.performers);
          setSelectedPerformer(data.performers[0]);
        }
      } catch (err) {
        console.error("Failed to load performers:", err);
      }
    }
    loadPerformers();
  }, []);

  // Auto scroll chat
  useEffect(() => {
    if (chatDrawerOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatDrawerOpen]);

  const openChatWith = (p: Performer) => {
    playHeelClick();
    setChattingWith(p);
    setChatMessages([
      {
        sender: "performer",
        text: `Hey anon! I'm ${p.stageName}. Just taking a 5-minute break in the dressing room reviewing my ${p.major} materials. What's on your mind?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setChatDrawerOpen(true);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !chattingWith || isSendingMessage) return;
    const userText = inputMessage;
    setInputMessage("");
    setIsSendingMessage(true);
    playHeelClick();

    const newMsgs: ChatMessage[] = [
      ...chatMessages,
      {
        sender: "user",
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
    setChatMessages(newMsgs);

    try {
      const res = await fetch("/api/modules/champagne-stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          performerId: chattingWith.id,
          message: userText,
        }),
      });
      const data = await res.json();
      if (data.ok && data.reply) {
        setChatMessages([
          ...newMsgs,
          {
            sender: "performer",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        sensory.tick();
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleTipStars = async (p: Performer, stars: number, label: string) => {
    playChampagnePop();
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars,
          title: `Tip for ${p.stageName}: ${label}`,
          description: `Direct tuition tip to ${p.stageName} (${p.major} at ${p.school}) via $SCF.`,
          app_module: "champagne-stage",
          userId: user?.id || 777000101,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            playChampagnePop();
            setPerformers((prev) =>
              prev.map((item) =>
                item.id === p.id ? { ...item, fundedUsd: item.fundedUsd + stars * 0.02 } : item
              )
            );
          }
        });
      }
    } catch (err) {
      console.error("Failed to trigger tip invoice:", err);
    }
  };

  const handleUnlockContent = async (performerId: string, contentId: string, starsCost: number) => {
    setIsUnlocking(contentId);
    playHeelClick();
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: starsCost,
          title: `Unlock Content #${contentId}`,
          description: `Unlock verified academic & rehearsal media from the $SCF vault.`,
          app_module: "champagne-stage",
          userId: user?.id || 777000101,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, async (status) => {
          setIsUnlocking(null);
          if (status === "paid") {
            playChampagnePop();
            setUnlockedItems((prev) => ({ ...prev, [contentId]: true }));
            await fetch("/api/modules/champagne-stage", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "unlock_content",
                performerId,
                contentId,
              }),
            });
          }
        });
      } else {
        setIsUnlocking(null);
        setUnlockedItems((prev) => ({ ...prev, [contentId]: true }));
      }
    } catch (_) {
      setIsUnlocking(null);
      setUnlockedItems((prev) => ({ ...prev, [contentId]: true }));
    }
  };

  const handleSendWhaleAlert = async () => {
    playChampagnePop();
    try {
      const res = await fetch("/api/modules/champagne-stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "whale_shoutout",
          performerId: whaleAlertPerformerId,
          whaleBounty: whaleBountyAmount,
          message: whaleMessage,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setWhaleAlertSuccess(data.message);
        setTimeout(() => setWhaleAlertSuccess(null), 5000);
      }
    } catch (err) {
      console.error("Whale alert err:", err);
    }
  };

  return (
    <div className="min-h-screen -mx-4 -my-6 px-4 py-6 bg-[#09040E] text-neutral-100 font-sans antialiased flex flex-col gap-5 selection:bg-pink-500 selection:text-white">
      {/* Top Blacklight Header */}
      <header className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-[#09040E]/90 backdrop-blur-xl border-b border-pink-500/20 flex items-center justify-between shadow-[0_4px_20px_rgba(255,0,127,0.1)]">
        <Link
          href="/"
          onClick={() => sensory.tick()}
          className="flex items-center gap-1.5 text-xs font-medium text-pink-400 hover:text-pink-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Matrix Hub
        </Link>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] font-mono tracking-wider font-semibold text-pink-300 bg-pink-950/60 border border-pink-500/30 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(255,0,127,0.25)]">
            <Radio className="w-2.5 h-2.5 text-pink-400 animate-pulse" />
            THE CHAMPAGNE STAGE
          </span>
          <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Flame className="w-2.5 h-2.5 fill-amber-400" /> VIP DEGEN SPOT
          </span>
        </div>
      </header>

      {/* Hero Strip Club Degen Spot Banner */}
      <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#1E0927] via-[#12051A] to-[#09040E] border border-pink-500/30 shadow-[0_4px_35px_rgba(255,0,127,0.18)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(255,0,127,0.6)]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                The Champagne Stage <span className="text-pink-400 font-mono text-xs px-2 py-0.5 rounded-full bg-pink-950/80 border border-pink-500/40">FLYWHEEL DAPP</span>
              </h1>
              <p className="text-[11px] text-pink-200/70 font-mono">
                Sponsor Tuition • Unlock Private Teasers • 1-on-1 AI Dressing Room
              </p>
            </div>
          </div>
        </div>

        {/* Global Endowment Ticker */}
        <div className="p-3.5 rounded-2xl bg-black/50 border border-pink-500/25 flex items-center justify-between backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Total Semester Endowment</span>
            <span className="text-2xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-amber-300 to-emerald-400">
              ${performers.reduce((acc, p) => acc + p.fundedUsd, 0).toLocaleString()} <span className="text-xs text-neutral-400 font-normal">/ ${performers.reduce((acc, p) => acc + p.semesterGoalUsd, 0).toLocaleString()}</span>
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 82.4% Funded
            </span>
            <span className="text-[9px] font-mono text-neutral-500">4 Active Co-eds On Stage</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-medium font-mono">
          <button
            onClick={() => {
              setActiveTab("roster");
              sensory.tick();
            }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === "roster"
                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_0_15px_rgba(255,0,127,0.4)] font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Stage Roster
          </button>
          <button
            onClick={() => {
              setActiveTab("dressing_room");
              sensory.tick();
            }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === "dressing_room"
                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_0_15px_rgba(255,0,127,0.4)] font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Dressing Room
          </button>
          <button
            onClick={() => {
              setActiveTab("whale_desk");
              sensory.tick();
            }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === "whale_desk"
                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_0_15px_rgba(255,0,127,0.4)] font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Whale Shoutout
          </button>
        </div>
      </div>

      {/* TAB 1: STAGE ROSTER (Catalogue of Student Performers) */}
      {activeTab === "roster" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
            <span>PERFORMER ROSTER ({performers.length})</span>
            <span className="text-pink-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live Tuition Goals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performers.map((p) => {
              const fundedPercent = Math.min(100, Math.round((p.fundedUsd / p.semesterGoalUsd) * 100));
              return (
                <div
                  key={p.id}
                  className="overflow-hidden rounded-3xl bg-[#12081C]/90 border border-pink-500/20 hover:border-pink-500/50 transition-all flex flex-col shadow-lg hover:shadow-pink-500/10 group"
                >
                  {/* Performer Banner Header */}
                  <div className="relative h-28 w-full overflow-hidden bg-neutral-900">
                    <img
                      src={p.bannerImage}
                      alt={p.stageName}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12081C] via-transparent to-black/40" />
                    
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-pink-950/80 border border-pink-500/40 text-pink-300">
                        {p.school}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-3 flex items-center gap-2.5">
                      <img
                        src={p.avatar}
                        alt={p.stageName}
                        className="w-11 h-11 rounded-2xl object-cover border-2 border-pink-500 shadow-[0_0_12px_rgba(255,0,127,0.5)]"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          {p.stageName}
                        </h3>
                        <span className="text-[10px] font-mono text-pink-300 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-pink-400" />
                          {p.major}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex flex-col gap-3">
                    <p className="text-xs text-neutral-300 leading-relaxed italic border-l-2 border-pink-500/40 pl-2.5">
                      &quot;{p.vibe}&quot;
                    </p>

                    {/* Tuition Progress Bar */}
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-neutral-400">SEMESTER TUITION</span>
                        <span className="text-pink-400 font-bold">{fundedPercent}% FUNDED</span>
                      </div>
                      <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-400 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(255,0,127,0.6)]"
                          style={{ width: `${fundedPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                        <span>${p.fundedUsd.toLocaleString()} raised</span>
                        <span>${p.semesterGoalUsd.toLocaleString()} goal</span>
                      </div>
                    </div>

                    {/* Action Buttons: Chat & Tip */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => openChatWith(p)}
                        className="py-2.5 px-3 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-pink-400" />
                        Chat 1-on-1 (AI)
                      </button>
                      <button
                        onClick={() => handleTipStars(p, 100, "1 Cocktail & Study Boost")}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,0,127,0.3)]"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                        Tip 100 Stars
                      </button>
                    </div>

                    {/* Unlockable Study/Dance Teasers */}
                    <div className="border-t border-white/5 pt-2.5 flex flex-col gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                        Vault Drops & Teasers
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {p.unlockedContent.map((content) => {
                          const isUnlocked = !!unlockedItems[content.id];
                          return (
                            <div
                              key={content.id}
                              className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                            >
                              <div className="flex flex-col pr-2">
                                <span className="text-white font-semibold text-[11px]">{content.title}</span>
                                <span className="text-[9px] text-neutral-400">{content.description}</span>
                              </div>
                              {isUnlocked ? (
                                <button
                                  onClick={() => {
                                    sensory.successChime();
                                    alert(`Opening verified academic asset: ${content.title}`);
                                  }}
                                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold"
                                >
                                  <Download className="w-3 h-3" /> View
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUnlockContent(p.id, content.id, content.starsCost)}
                                  disabled={isUnlocking === content.id}
                                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-950/60 hover:bg-pink-900/80 border border-pink-500/40 text-pink-300 text-[10px] font-mono font-bold transition-all active:scale-95"
                                >
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>{isUnlocking === content.id ? "..." : `${content.starsCost} Stars`}</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: VIP DRESSING ROOM (Direct Audio/Chat Hub) */}
      {activeTab === "dressing_room" && (
        <div className="p-4 rounded-3xl bg-[#12081C]/90 border border-pink-500/30 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5 font-mono">
              <Eye className="w-3.5 h-3.5 text-pink-400" /> Backstage Dressing Room Cam Feed
            </h2>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              LIVE AUDIO/FEED
            </span>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-950 border border-pink-500/20 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80"
              alt="Backstage"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-pink-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-pink-500/30">
                <Volume2 className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                <span>Audio Feed: VIP Dressing Room #4</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">3:00 AM SHIFT</span>
            </div>
          </div>

          {/* Quick Connect Performers */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
              Select Co-ed To Start Private Session:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {performers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => openChatWith(p)}
                  className="p-3 rounded-2xl bg-white/[0.02] hover:bg-pink-950/30 border border-white/5 hover:border-pink-500/40 flex items-center gap-2.5 text-left transition-all group active:scale-95"
                >
                  <img
                    src={p.avatar}
                    alt={p.stageName}
                    className="w-9 h-9 rounded-xl object-cover border border-pink-500/40"
                  />
                  <div className="truncate">
                    <div className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                      {p.stageName}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400 truncate">{p.major}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WHALE ATTENTION PAYMENT DESK */}
      {activeTab === "whale_desk" && (
        <div className="p-4 rounded-3xl bg-[#12081C]/90 border border-pink-500/30 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5 font-mono">
              <Zap className="w-3.5 h-3.5 text-pink-400" /> Whale Attention Broadcaster
            </h2>
            <span className="text-[10px] font-mono text-amber-400">PIN TO STAGE SCREEN</span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            Need immediate attention from your favorite dancer? Broadcast a high-bounty alert that triggers a strobe alert on her dressing room monitor and pins your Telegram handle to the VIP queue.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-neutral-400">SELECT RECIPIENT</label>
            <select
              value={whaleAlertPerformerId}
              onChange={(e) => setWhaleAlertPerformerId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:border-pink-500 focus:outline-none"
            >
              {performers.map((p) => (
                <option key={p.id} value={p.id} className="bg-neutral-900 text-white">
                  {p.stageName} ({p.major})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-neutral-400">STAR BOUNTY (ATTENTION WEIGHT)</label>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {[250, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setWhaleBountyAmount(amount);
                    sensory.tick();
                  }}
                  className={`py-2 rounded-xl border text-center transition-all ${
                    whaleBountyAmount === amount
                      ? "bg-pink-600 border-pink-500 text-white shadow-[0_0_12px_rgba(255,0,127,0.4)] font-bold"
                      : "bg-black/20 border-white/10 text-neutral-400"
                  }`}
                >
                  {amount} Stars
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-neutral-400">BROADCAST MESSAGE</label>
            <textarea
              rows={2}
              value={whaleMessage}
              onChange={(e) => setWhaleMessage(e.target.value)}
              placeholder="Your custom message to the stage screen..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:border-pink-500 focus:outline-none resize-none"
            />
          </div>

          {whaleAlertSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{whaleAlertSuccess}</span>
            </div>
          )}

          <button
            onClick={handleSendWhaleAlert}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-400 hover:opacity-95 text-white font-bold text-xs tracking-wider uppercase font-mono shadow-[0_0_20px_rgba(255,0,127,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>BROADCAST WHALE ALERT ({whaleBountyAmount} STARS)</span>
          </button>
        </div>
      )}

      {/* CHAT DRAWER MODAL (1-on-1 DeepSeek AI Conversation) */}
      {chatDrawerOpen && chattingWith && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md transition-opacity">
          <div className="w-full sm:max-w-lg h-[85vh] sm:h-[650px] bg-[#0E0616] border-t sm:border border-pink-500/30 sm:rounded-3xl flex flex-col overflow-hidden shadow-[0_0_40px_rgba(255,0,127,0.3)]">
            {/* Modal Header */}
            <div className="p-4 bg-[#140820] border-b border-pink-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={chattingWith.avatar}
                  alt={chattingWith.stageName}
                  className="w-10 h-10 rounded-2xl object-cover border-2 border-pink-500 shadow-[0_0_10px_rgba(255,0,127,0.5)]"
                />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {chattingWith.stageName}
                  </h3>
                  <span className="text-[10px] font-mono text-pink-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    DeepSeek-V3 • Dressing Room Direct
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setChatDrawerOpen(false);
                  sensory.tick();
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-sans text-xs">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-tr-none shadow-sm"
                        : "bg-white/[0.05] border border-pink-500/20 text-neutral-200 rounded-tl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500 mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              ))}
              {isSendingMessage && (
                <div className="flex items-center gap-1.5 text-xs text-pink-400 font-mono italic">
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" />
                  <span>{chattingWith.stageName} is typing on her cracked iPhone...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Star Tip Strip */}
            <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
              <span className="text-neutral-400">Tip during chat:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleTipStars(chattingWith, 50, "Energy Drink for Study Set")}
                  className="px-2 py-1 rounded-lg bg-pink-950/60 border border-pink-500/30 text-amber-300 font-bold hover:bg-pink-900 transition-colors"
                >
                  +50 ★
                </button>
                <button
                  onClick={() => handleTipStars(chattingWith, 150, "1 Hour Lecture Sponsor")}
                  className="px-2 py-1 rounded-lg bg-pink-950/60 border border-pink-500/30 text-amber-300 font-bold hover:bg-pink-900 transition-colors"
                >
                  +150 ★
                </button>
              </div>
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-[#140820] border-t border-pink-500/20 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                placeholder={`Message ${chattingWith.stageName}...`}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-pink-500/30 text-white text-xs font-sans placeholder:text-neutral-500 focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={isSendingMessage || !inputMessage.trim()}
                className="p-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white transition-all shadow-[0_0_10px_rgba(255,0,127,0.4)] active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="pt-2 text-center text-[10px] font-mono text-neutral-500">
        THE CHAMPAGNE STAGE // POWERED BY DEEPSEEK AI & TELEGRAM STARS (XTR)
      </footer>
    </div>
  );
}

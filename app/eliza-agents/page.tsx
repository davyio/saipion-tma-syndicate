"use client";

import { useState } from "react";
import Link from "next/link";
import { sensory } from "@/lib/sensory";
import {
  ArrowLeft,
  Bot,
  Sparkles,
  Send,
  MessageSquare,
  Copy,
  Check,
  Zap,
  Shield,
  HeartHandshake,
  Share2,
  RefreshCw,
  Terminal,
} from "lucide-react";

interface Message {
  sender: "user" | "agent";
  text: string;
}

export default function ElizaAgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string>("Destiny_PhiBetaKappa");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "agent",
      text: "Destiny online. I'm finishing an organic chemistry reaction diagram before my set. What's your query, anon?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [generatedPost, setGeneratedPost] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const AGENTS = [
    {
      username: "Destiny_PhiBetaKappa",
      displayName: "Destiny (Lead Dev)",
      tagline: "MCAT Student & Solidity Architect",
      icon: "👩‍🔬",
      badge: "FOUNDER / DEV",
      badgeColor: "bg-pink-950/60 border-pink-500/40 text-pink-300",
      greeting: "Destiny online. Finishing my organic chem notes before my set. What's your query, anon?",
    },
    {
      username: "The_Bouncer_Bot",
      displayName: "Big Mike (Security)",
      tagline: "280lbs Enforcement with UV Tattooed Seed Phrase",
      icon: "🥊",
      badge: "SECURITY ENFORCER",
      badgeColor: "bg-amber-950/60 border-amber-500/40 text-amber-300",
      greeting: "Step back from the velvet rope. 10,000 $SCF or 100 Stars cover charge. No creeps.",
    },
    {
      username: "The_Simp_Sweeper",
      displayName: "Simp Sweeper (Growth)",
      tagline: "High-Friction Liquidity Extraction & Stiletto Chart Art",
      icon: "👠",
      badge: "VIRALITY HACKER",
      badgeColor: "bg-purple-950/60 border-purple-500/40 text-purple-300",
      greeting: "I'll read your full 20-page macroeconomic thesis right after you buy the shift change dip. [CA]",
    },
  ];

  const currentAgent = AGENTS.find((a) => a.username === selectedAgent) || AGENTS[0];

  const handleSelectAgent = (agent: (typeof AGENTS)[0]) => {
    setSelectedAgent(agent.username);
    setMessages([{ sender: "agent", text: agent.greeting }]);
    setGeneratedPost("");
    sensory.tick();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userText = inputMessage.trim();
    setInputMessage("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsTyping(true);
    sensory.tick();

    try {
      const res = await fetch("/api/eliza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: selectedAgent,
          action: "chat",
          message: userText,
        }),
      });
      const data = await res.json();
      if (data.ok && data.response) {
        setMessages((prev) => [...prev, { sender: "agent", text: data.response }]);
        sensory.successChime();
      }
    } catch (_) {
    } finally {
      setIsTyping(false);
    }
  };

  const handleGeneratePost = async () => {
    sensory.lockThud();
    try {
      const res = await fetch("/api/eliza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: selectedAgent,
          action: "generate_post",
        }),
      });
      const data = await res.json();
      if (data.ok && data.post) {
        setGeneratedPost(data.post);
        sensory.successChime();
      }
    } catch (_) {}
  };

  const handleCopyPost = () => {
    sensory.tick();
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    sensory.successChime();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen -mx-4 -my-6 px-4 py-6 bg-[#09050C] text-neutral-100 font-sans antialiased flex flex-col gap-4 selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-[#09050C]/90 backdrop-blur-xl border-b border-pink-500/20 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => sensory.tick()}
          className="flex items-center gap-1.5 text-xs font-medium text-pink-400 hover:text-pink-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-wider font-semibold text-pink-300 bg-pink-950/60 border border-pink-500/30 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(255,42,133,0.25)]">
            ELIZAOS // AGENT SWARM
          </span>
        </div>
      </header>

      {/* Hero Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          ElizaOS Autonomous Agents <Bot className="w-5 h-5 text-pink-400" />
        </h1>
        <p className="text-xs text-neutral-400">
          Autonomous characters running 24/7 on X, Telegram, and bonding curves to manufacture narrative virality.
        </p>
      </div>

      {/* Character Selector Chips */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10 font-mono text-xs">
        {AGENTS.map((agent) => (
          <button
            key={agent.username}
            onClick={() => handleSelectAgent(agent)}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-0.5 transition-all ${
              selectedAgent === agent.username
                ? "bg-pink-600 text-white font-bold shadow-[0_0_15px_rgba(255,42,133,0.4)]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span className="text-base">{agent.icon}</span>
            <span className="text-[10px] truncate max-w-full">{agent.displayName.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Agent Overview Card */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-pink-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl p-2 rounded-xl bg-black/40 border border-white/10">{currentAgent.icon}</span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white leading-none">{currentAgent.displayName}</span>
            <span className="text-[10px] text-neutral-400 mt-0.5 font-mono">{currentAgent.tagline}</span>
          </div>
        </div>
        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border font-bold ${currentAgent.badgeColor}`}>
          {currentAgent.badge}
        </span>
      </div>

      {/* Interactive Chat Console */}
      <div className="flex-1 flex flex-col p-3.5 rounded-3xl bg-black/40 border border-white/10 min-h-[220px] max-h-[320px] overflow-y-auto gap-2.5 scrollbar-none">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[85%] text-xs ${
              m.sender === "user"
                ? "self-end items-end text-white"
                : "self-start items-start text-neutral-200"
            }`}
          >
            <span className="text-[9px] font-mono text-neutral-500 mb-0.5">
              {m.sender === "user" ? "You" : currentAgent.displayName}
            </span>
            <div
              className={`p-3 rounded-2xl ${
                m.sender === "user"
                  ? "bg-pink-600 rounded-tr-xs"
                  : "bg-white/[0.06] border border-white/10 rounded-tl-xs"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="self-start text-[10px] font-mono text-pink-400 italic animate-pulse">
            {currentAgent.displayName} is typing...
          </div>
        )}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Message ${currentAgent.displayName}...`}
          className="flex-1 px-3.5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:border-pink-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isTyping}
          className="p-2.5 rounded-2xl bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-white transition-all active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Autonomous Post Generator */}
      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-mono font-bold text-neutral-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-pink-400" /> Autonomous Post Simulator
          </span>
          <button
            onClick={handleGeneratePost}
            className="text-[10px] font-mono font-bold text-pink-400 bg-pink-950/50 border border-pink-500/30 px-2.5 py-1 rounded-lg hover:bg-pink-950 active:scale-95 transition-all"
          >
            Generate Tweet
          </button>
        </div>

        {generatedPost && (
          <div className="p-3 rounded-xl bg-black/50 border border-pink-500/20 flex flex-col gap-2 animate-in fade-in duration-200">
            <p className="text-xs text-pink-200 italic font-mono">&quot;{generatedPost}&quot;</p>
            <button
              onClick={handleCopyPost}
              className="self-end flex items-center gap-1 text-[10px] font-mono text-emerald-400 hover:underline"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied to Clipboard!" : "Copy for X/Telegram"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

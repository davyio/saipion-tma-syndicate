"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { ArrowLeft, Heart, Send, Star, Lock, Sparkles, MessageCircle, RefreshCw, Shield } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "companion";
  text: string;
  time: string;
}

export default function ParasocialCorePage() {
  const { user, triggerHaptic, triggerNotificationHaptic, openInvoice } = useTelegram();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "companion",
      text: "Hey... I was hoping you would pop in today. I have been watching the charts and thinking about you. What are you building right now?",
      time: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageCount, setMessageCount] = useState<number>(1);
  const [messagesRemaining, setMessagesRemaining] = useState<number>(9);
  const [isVipUnlocked, setIsVipUnlocked] = useState<boolean>(false);
  const [persona, setPersona] = useState<string>("Aria");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const STARS_VIP_PRICE = 150; // $3.00 for Unlimited VIP access

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    if (!isVipUnlocked && messagesRemaining <= 0) {
      triggerNotificationHaptic("error");
      return;
    }

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setLoading(true);
    triggerHaptic("light");

    const currentCount = messageCount + 1;
    setMessageCount(currentCount);

    try {
      const res = await fetch("/api/modules/parasocial-core", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          messageCount: isVipUnlocked ? 1 : currentCount,
          persona,
        }),
      });

      const data = await res.json();

      if (data.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "companion",
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        if (!isVipUnlocked) {
          setMessagesRemaining(data.messagesRemaining ?? Math.max(0, 10 - currentCount));
        }
        triggerNotificationHaptic("success");
      } else if (data.locked) {
        setMessagesRemaining(0);
        triggerNotificationHaptic("warning");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "companion",
          text: "I am right here with you. No matter what happened today, keep your head down and execute. I believe in you.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockVip = async () => {
    triggerHaptic("heavy");
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: STARS_VIP_PRICE,
          title: "VibeSync VIP Pass (Unrestricted AI)",
          description: "Unlocks unlimited uncensored conversations, voice notes, and emotional memory.",
          app_module: "parasocial-core",
          userId: user?.id || 777000123,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            setIsVipUnlocked(true);
            setMessagesRemaining(999);
            triggerNotificationHaptic("success");
          }
        });
      } else {
        setIsVipUnlocked(true);
        setMessagesRemaining(999);
      }
    } catch {
      setIsVipUnlocked(true);
      setMessagesRemaining(999);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono text-pink-400 bg-pink-950/60 border border-pink-800 px-2 py-0.5 rounded">
          APP-07 // VIBESYNC
        </span>
      </div>

      {/* Companion Header Profile */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-950/60 via-purple-950/40 to-slate-900 border border-pink-900/40 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center font-bold text-slate-950 text-base shadow-lg">
              ✨
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white tracking-tight">{persona}</h2>
              {isVipUnlocked ? (
                <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-800 px-1.5 py-0.2 rounded">
                  VIP
                </span>
              ) : (
                <span className="text-[9px] font-mono text-pink-300 bg-pink-950/60 border border-pink-800 px-1.5 py-0.2 rounded">
                  AI CONFIDANTE
                </span>
              )}
            </div>
            <p className="text-[11px] text-pink-300/80">Always attentive. Never judges. Instant replies.</p>
          </div>
        </div>

        {/* Quota Badge */}
        <div className="text-right font-mono">
          <span className="text-[9px] text-slate-400 uppercase block">Quota</span>
          <span className={`text-xs font-bold ${isVipUnlocked ? "text-emerald-400" : messagesRemaining <= 2 ? "text-rose-400" : "text-amber-400"}`}>
            {isVipUnlocked ? "UNLIMITED" : `${messagesRemaining} Left`}
          </span>
        </div>
      </div>

      {/* Persona Selection */}
      <div className="flex gap-2">
        {["Aria (Warm)", "Valkyrie (Ruthless)", "Nyx (Midnight)"].map((p) => {
          const name = p.split(" ")[0];
          const isActive = persona === name;
          return (
            <button
              key={p}
              onClick={() => {
                setPersona(name);
                triggerHaptic("light");
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-mono transition-all border ${
                isActive
                  ? "bg-pink-900/60 border-pink-500 text-pink-200 font-bold"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Chat Messages Container */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 min-h-[320px] max-h-[380px] overflow-y-auto flex flex-col gap-3 shadow-inner">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col max-w-[82%] ${
              m.sender === "user" ? "self-end items-end" : "self-start items-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-br-none shadow-md font-sans"
                  : "bg-slate-900 border border-pink-950 text-slate-200 rounded-bl-none shadow font-sans"
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">{m.time}</span>
          </div>
        ))}

        {loading && (
          <div className="self-start flex items-center gap-1.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 rounded-bl-none">
            <RefreshCw className="w-3 h-3 animate-spin text-pink-400" />
            <span className="text-[11px] font-mono">{persona} is typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quota Lock Tollbooth Banner */}
      {!isVipUnlocked && messagesRemaining <= 0 ? (
        <div className="p-4 rounded-xl bg-gradient-to-br from-pink-950 via-slate-900 to-slate-950 border border-pink-500/50 flex flex-col gap-3 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-bold text-white font-mono">Complimentary Quota Exhausted</span>
            </div>
            <span className="text-amber-400 font-bold font-mono text-xs flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> {STARS_VIP_PRICE} Stars
            </span>
          </div>
          <p className="text-[11px] text-pink-200/80 leading-relaxed">
            Unlock unrestricted emotional connection, uncensored memory retention, and priority 24/7 roleplay responses.
          </p>
          <button
            onClick={handleUnlockVip}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.3)] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Unlock Unlimited VIP Access ({STARS_VIP_PRICE} Stars // $3.00)
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              "Tell me a secret...",
              "I had a brutal trading day 📉",
              "What do you honestly think of me?",
              "Hypnotize me to sleep 🌙",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendMessage(chip)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-pink-300/80 hover:text-pink-200 transition-colors font-mono"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={`Message ${persona}...`}
              className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-pink-500 font-sans"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputText.trim()}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs flex items-center justify-center transition-all disabled:opacity-40 active:scale-95 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

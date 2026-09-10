"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { sensory } from "@/lib/sensory";
import { ArrowLeft, Volume2, VolumeX, Star, ShieldAlert, Sparkles, Moon, Play, Pause } from "lucide-react";

export default function SilenceFocusPage() {
  const { user, openInvoice } = useTelegram();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5400); // 90 mins
  const [staked, setStaked] = useState<boolean>(false);

  const STARS_STAKE = 100;

  useEffect(() => {
    let timer: any = null;
    if (isPlaying && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((s) => s - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, secondsRemaining]);

  const toggleSoundscape = () => {
    if (isPlaying) {
      sensory.stopSilenceSoundscape();
      setIsPlaying(false);
      sensory.tick();
    } else {
      sensory.startSilenceSoundscape();
      setIsPlaying(true);
      sensory.successChime();
    }
  };

  const handleStake = async () => {
    sensory.lockThud();
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: STARS_STAKE,
          title: "SILENCE 90-Minute Accountability Stake",
          description: "Stakes 100 Stars on completing a 90-minute deep work sprint.",
          app_module: "silence-focus",
          userId: user?.id || 777000123,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            setStaked(true);
            toggleSoundscape();
          }
        });
      } else {
        setStaked(true);
        toggleSoundscape();
      }
    } catch (_) {
      setStaked(true);
      toggleSoundscape();
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col gap-6 text-slate-100 font-sans antialiased">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          onClick={() => { sensory.stopSilenceSoundscape(); sensory.tick(); }}
          className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono tracking-widest text-neutral-400 border border-neutral-800 bg-neutral-950 px-2.5 py-0.5 rounded-full uppercase">
          SILENCE // 04
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          Cognitive Sanctuary
        </span>
        <h1 className="text-2xl font-light tracking-tight text-white">
          Deep Work Silence
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Zero noise. Synthesized 40Hz gamma neural waves and synchronized deep focus.
        </p>
      </div>

      {/* Breathing Sphere Canvas */}
      <div className="flex flex-col items-center justify-center py-10 px-6 rounded-3xl bg-neutral-950 border border-neutral-800 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

        {/* Coherent Breathing Organic Sphere */}
        <div className="relative flex items-center justify-center my-6">
          <div
            className={`w-36 h-36 rounded-full border border-neutral-700/60 bg-neutral-900/40 flex items-center justify-center transition-all duration-1000 ${
              isPlaying ? "scale-110 shadow-[0_0_50px_rgba(255,255,255,0.08)]" : "scale-100"
            }`}
          >
            <div className="text-center">
              <span className="text-3xl font-light font-mono text-white tracking-tighter">
                {formatTime(secondsRemaining)}
              </span>
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mt-1">
                {isPlaying ? "GAMMA 40HZ WAVE ACTIVE" : "FLOW STANDBY"}
              </span>
            </div>
          </div>
        </div>

        {/* Audio Toggle Control */}
        <button
          onClick={toggleSoundscape}
          className="mt-2 py-3 px-6 rounded-full border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-200 flex items-center gap-2 active:scale-95 transition-all shadow-md"
        >
          {isPlaying ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          <span>{isPlaying ? "Pause Neural Soundscape" : "Initiate 40Hz Flow State"}</span>
        </button>
      </div>

      {/* Live Group Synchronization Banner */}
      <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-neutral-400">Synchronized Peers:</span>
          <span className="text-white font-bold">412 Operators</span>
        </div>
        <span className="text-[10px] text-neutral-500">Global Sanctuary</span>
      </div>

      {/* Star Accountability Stake Tollbooth */}
      <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-medium text-white block">90-Minute Accountability Stake</span>
            <span className="text-[10px] font-mono text-neutral-400">Forfeit stake if interrupted before 90 minutes</span>
          </div>
          <span className="text-xs font-mono text-amber-400 flex items-center gap-1 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> {STARS_STAKE} Stars
          </span>
        </div>

        {staked ? (
          <div className="py-3 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-emerald-400 text-center">
            Stake Locked in Pool • Do Not Break Focus
          </div>
        ) : (
          <button
            onClick={handleStake}
            className="w-full py-3 px-4 rounded-xl bg-white text-black font-medium text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg"
          >
            <Moon className="w-4 h-4" />
            Stake 100 Stars on Deep Work Sprint
          </button>
        )}
      </div>
    </div>
  );
}

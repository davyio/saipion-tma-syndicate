"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { sensory } from "@/lib/sensory";
import {
  ArrowLeft,
  Kanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Layers,
  Send,
  ExternalLink,
  Flame,
  ChevronRight,
  Filter,
  Plus,
} from "lucide-react";

export default function LaunchBoardPage() {
  const { user } = useTelegram();
  const [boardData, setBoardData] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/modules/launch-board", { method: "POST", body: JSON.stringify({}) })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && res.columns) {
          setBoardData(res);
          const all: any[] = [];
          res.columns.forEach((col: any) => {
            col.cards.forEach((card: any) => {
              all.push({ ...card, columnId: col.id, columnTitle: col.title });
            });
          });
          setTasks(all);
        }
      })
      .catch(() => {});
  }, []);

  const toggleTaskStatus = (taskId: string) => {
    sensory.tick();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus =
            t.status === "DONE"
              ? "PENDING"
              : t.status === "PENDING"
              ? "IN_PROGRESS"
              : "DONE";

          if (nextStatus === "DONE") sensory.successChime();
          else if (nextStatus === "IN_PROGRESS") sensory.slide(0.5);
          else sensory.lockThud();

          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const categories = ["ALL", "Narrative", "Design", "Distribution", "Outreach", "Tech", "Smart Contract", "Ecosystem App"];

  const filteredTasks = activeCategory === "ALL" ? tasks : tasks.filter((t) => t.category === activeCategory);

  const completedCount = tasks.filter((t) => t.status === "DONE" || t.status === "OPERATIONAL").length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 text-slate-100 font-sans antialiased">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          onClick={() => sensory.tick()}
          className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <span className="text-[10px] font-mono tracking-widest text-emerald-400 border border-emerald-800/80 bg-emerald-950/60 px-2.5 py-0.5 rounded-full uppercase">
          MISSION CONTROL // APP-22
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Kanban className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            Asymmetric Token Launch OS
          </span>
        </div>
        <h1 className="text-2xl font-light tracking-tight text-white">
          Launchpad Command Board
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Trello-grade asymmetric coordination engine for narrative deployment, multi-account distribution, KOL outreach, and ecosystem engagement.
        </p>
      </div>

      {/* Progress & Telemetry Header */}
      <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-col gap-3 shadow-xl">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
              LAUNCH READINESS
            </span>
            <span className="text-xl font-light text-white font-mono">{progressPercent}% READY</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {completedCount} of {tasks.length} Directives Executed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-900 text-[10px] font-mono">
          <div>
            <span className="text-neutral-500 block">TWITTER GRID</span>
            <span className="text-neutral-200">18 Accounts Ready</span>
          </div>
          <div>
            <span className="text-neutral-500 block">KOL PIPELINE</span>
            <span className="text-neutral-200">100 Scored Targets</span>
          </div>
          <div className="text-right">
            <span className="text-neutral-500 block">LEVIATHAN APPS</span>
            <span className="text-emerald-400 font-bold">21 Live in TMA</span>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              sensory.tick();
            }}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg border transition-all ${
              activeCategory === cat
                ? "bg-white text-black font-bold border-white"
                : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task Cards Stream */}
      <div className="flex flex-col gap-3">
        {filteredTasks.map((task) => {
          const isDone = task.status === "DONE" || task.status === "OPERATIONAL";
          const inProgress = task.status === "IN_PROGRESS";

          return (
            <div
              key={task.id}
              onClick={() => toggleTaskStatus(task.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                isDone
                  ? "bg-neutral-950/80 border-emerald-900/60"
                  : inProgress
                  ? "bg-neutral-950 border-cyan-800/80 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                  : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isDone
                        ? "bg-emerald-400"
                        : inProgress
                        ? "bg-cyan-400 animate-pulse"
                        : "bg-neutral-600"
                    }`}
                  />
                  <span className="text-xs font-mono font-bold text-white tracking-tight">
                    {task.title}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                    isDone
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : inProgress
                      ? "bg-cyan-950 text-cyan-300 border-cyan-800"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800"
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                {task.description}
              </p>

              <div className="flex justify-between items-center mt-3 pt-2 border-t border-neutral-900 text-[10px] font-mono text-neutral-500">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">{task.category}</span>
                  <span>•</span>
                  <span>Assignee: {task.assignee}</span>
                </div>
                <span className="text-neutral-400 underline">Tap to Advance Status</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Linked Leviathan Apps Banner */}
      <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-col gap-3">
        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Pre-Wired Ecosystem Apps (Day-1 Holder Retention)
        </span>
        <p className="text-xs text-neutral-400 leading-relaxed font-sans">
          These tools are already live in the monorepo and ready to be branded under your token&apos;s banner to provide immediate holder utility:
        </p>
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <Link
            href="/trench-radar"
            className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 flex flex-col"
          >
            <span className="text-purple-400 font-bold">/trench-radar</span>
            <span className="text-[10px] text-neutral-400">Dev Cluster Rug Scanner</span>
          </Link>
          <Link
            href="/burn-arena"
            className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 flex flex-col"
          >
            <span className="text-emerald-400 font-bold">/burn-arena</span>
            <span className="text-[10px] text-neutral-400">PvP Meme Coin War</span>
          </Link>
          <Link
            href="/king-throne"
            className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 flex flex-col"
          >
            <span className="text-amber-400 font-bold">/king-throne</span>
            <span className="text-[10px] text-neutral-400">Pinned Broadcast Auction</span>
          </Link>
          <Link
            href="/clout-roast"
            className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-red-500/50 flex flex-col"
          >
            <span className="text-red-400 font-bold">/clout-roast</span>
            <span className="text-[10px] text-neutral-400">AI Degen Profile Roast</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

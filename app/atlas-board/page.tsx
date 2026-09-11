"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTelegram } from "@/hooks/useTelegram";
import { sensory } from "@/lib/sensory";
import {
  ArrowLeft,
  Kanban,
  CheckSquare,
  Square,
  Plus,
  Users,
  Copy,
  Check,
  Star,
  Clock,
  ChevronRight,
  ChevronLeft,
  Share2,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  X,
  Trash2,
  UserPlus,
  FileSpreadsheet,
  Zap,
} from "lucide-react";

interface Member {
  telegramId: number;
  username: string;
  name: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "OBSERVER";
  avatar: string;
}

interface ChecklistItem {
  id: string;
  title: string;
  isChecked: boolean;
}

interface Card {
  id: string;
  columnId: string;
  title: string;
  description: string;
  category: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
  dueDate: string;
  starBounty: number;
  assignee: Member;
  checklist: ChecklistItem[];
}

export default function AtlasBoardPage() {
  const { user, openInvoice } = useTelegram();
  const [boardData, setBoardData] = useState<any>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeColumnId, setActiveColumnId] = useState<string>("ALL");
  const [currentTemplate, setCurrentTemplate] = useState<string>("scf_launch");

  // Modals
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [showNewCardModal, setShowNewCardModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);

  // Invite & Add Member State
  const [inviteCopied, setInviteCopied] = useState<boolean>(false);
  const [inviteRole, setInviteRole] = useState<"MEMBER" | "ADMIN" | "OBSERVER">("MEMBER");
  const [newMemberUsername, setNewMemberUsername] = useState<string>("");
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [newMemberRole, setNewMemberRole] = useState<"MEMBER" | "ADMIN" | "OBSERVER">("MEMBER");

  // Onboarding Lore Form State
  const [campaignObjective, setCampaignObjective] = useState<string>(
    "Launch $SCF on Pump.fun to Raydium with $5-10M market cap in 24 hours"
  );
  const [brandLore, setBrandLore] = useState<string>("Stripper College Fund / Destiny Dev");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    "X/Twitter Raids",
    "OnlyFans Trojan",
    "Telegram KOLs",
  ]);
  const [isOnboardingGenerating, setIsOnboardingGenerating] = useState<boolean>(false);

  // New Card Form State
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("Sprint");
  const [newPriority, setNewPriority] = useState<"NORMAL" | "HIGH" | "CRITICAL">("NORMAL");
  const [newBounty, setNewBounty] = useState<number>(100);
  const [newColId, setNewColId] = useState<string>("col_backlog");

  useEffect(() => {
    loadTemplate("scf_launch");
  }, []);

  const loadTemplate = (templateKey: string) => {
    sensory.slide(0.4);
    setCurrentTemplate(templateKey);
    fetch("/api/modules/atlas-board", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template: templateKey }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) {
          setBoardData(res);
          setCards(res.cards || []);
          setMembers(res.members || []);
        }
      })
      .catch(() => {});
  };

  const columns = boardData?.columns || [
    { id: "col_backlog", title: "Backlog", badgeColor: "bg-neutral-200 text-neutral-700" },
    { id: "col_progress", title: "In Progress", badgeColor: "bg-blue-100 text-blue-700" },
    { id: "col_review", title: "Review / QA", badgeColor: "bg-amber-100 text-amber-700" },
    { id: "col_done", title: "Completed", badgeColor: "bg-emerald-100 text-emerald-700" },
  ];

  const handleToggleChecklist = (cardId: string, chkId: string) => {
    sensory.tick();
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const updatedChecklist = c.checklist.map((item) => {
            if (item.id === chkId) {
              return { ...item, isChecked: !item.isChecked };
            }
            return item;
          });
          const allCompleted = updatedChecklist.every((i) => i.isChecked);
          if (allCompleted) {
            sensory.successChime();
          }
          return { ...c, checklist: updatedChecklist };
        }
        return c;
      })
    );
  };

  const handleMoveCard = (cardId: string, direction: "next" | "prev") => {
    sensory.tick();
    const colOrder = ["col_backlog", "col_progress", "col_review", "col_done"];
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const currentIndex = colOrder.indexOf(c.columnId);
          let targetIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
          if (targetIndex >= colOrder.length) targetIndex = colOrder.length - 1;
          if (targetIndex < 0) targetIndex = 0;

          const targetCol = colOrder[targetIndex];
          if (targetCol === "col_done") sensory.successChime();
          else sensory.slide(0.5);

          return { ...c, columnId: targetCol };
        }
        return c;
      })
    );
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sensory.lockThud();
    const createdCard: Card = {
      id: "card-" + Math.random().toString(36).substring(2, 7),
      columnId: newColId,
      title: newTitle.trim(),
      description: newDesc.trim() || "Codified by board manager.",
      category: newCategory,
      priority: newPriority,
      dueDate: "Active Sprint",
      starBounty: newBounty,
      assignee: members[0] || {
        telegramId: 777000101,
        username: user?.username || "lead",
        name: user?.first_name || "Lead Architect",
        role: "OWNER",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
      },
      checklist: [
        { id: "chk-new-1", title: "Specification & architecture review", isChecked: false },
        { id: "chk-new-2", title: "Execution & pull request verification", isChecked: false },
      ],
    };

    setCards((prev) => [createdCard, ...prev]);
    setNewTitle("");
    setNewDesc("");
    setShowNewCardModal(false);
    sensory.successChime();
  };

  // Add collaborator
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberUsername.trim() || !newMemberName.trim()) return;

    sensory.lockThud();
    const added: Member = {
      telegramId: Math.floor(100000000 + Math.random() * 900000000),
      username: newMemberUsername.replace("@", "").trim(),
      name: newMemberName.trim(),
      role: newMemberRole,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?auto=format&fit=crop&w=160&q=80`,
    };

    setMembers((prev) => [...prev, added]);
    setNewMemberUsername("");
    setNewMemberName("");
    sensory.successChime();
  };

  // Remove collaborator
  const handleRemoveMember = (telegramId: number) => {
    const memberToRemove = members.find((m) => m.telegramId === telegramId);
    if (memberToRemove?.role === "OWNER") {
      alert("Board Owner cannot be removed.");
      return;
    }

    if (confirm(`Remove @${memberToRemove?.username} from board permissions?`)) {
      sensory.lockThud();
      setMembers((prev) => prev.filter((m) => m.telegramId !== telegramId));
      sensory.slide(0.3);
    }
  };

  // Generate onboarding lore tasks
  const handleGenerateOnboardingTasks = async () => {
    sensory.lockThud();
    setIsOnboardingGenerating(true);
    try {
      const res = await fetch("/api/modules/atlas-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_onboarding_tasks",
          objective: campaignObjective,
          brandLore,
          channels: selectedChannels,
        }),
      });
      const data = await res.json();
      if (data.ok && data.cards) {
        setCards((prev) => [...data.cards, ...prev]);
        setShowOnboardingModal(false);
        sensory.successChime();
      }
    } catch (_) {
    } finally {
      setIsOnboardingGenerating(false);
    }
  };

  const copyInviteLink = () => {
    sensory.tick();
    const link = `https://t.me/saipion_bot?startapp=invite_BRD_ALPHA_${inviteRole}`;
    navigator.clipboard.writeText(link);
    setInviteCopied(true);
    sensory.successChime();
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const handlePayBounty = async (card: Card) => {
    sensory.lockThud();
    try {
      const res = await fetch("/api/stars/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: card.starBounty,
          title: `Bounty Payout: ${card.title.slice(0, 30)}`,
          description: `Disburses ${card.starBounty} Stars to assignee @${card.assignee.username} for task completion.`,
          app_module: "atlas-board",
          userId: user?.id || 777000123,
        }),
      });
      const data = await res.json();
      if (data.invoiceLink) {
        openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            sensory.successChime();
          }
        });
      }
    } catch (_) {}
  };

  const filteredCards =
    activeColumnId === "ALL" ? cards : cards.filter((c) => c.columnId === activeColumnId);

  const completedCount = cards.filter((c) => c.columnId === "col_done").length;
  const progressRatio = cards.length > 0 ? Math.round((completedCount / cards.length) * 100) : 0;

  return (
    <div className="min-h-screen -mx-4 -my-6 px-4 py-6 bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased flex flex-col gap-5 selection:bg-neutral-300">
      {/* Top Glass Navigation */}
      <header className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-[#F5F5F7]/85 backdrop-blur-2xl border-b border-black/[0.06] flex items-center justify-between">
        <Link
          href="/"
          onClick={() => sensory.tick()}
          className="flex items-center gap-1.5 text-xs font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-wider font-semibold text-neutral-600 bg-white border border-black/[0.08] px-2.5 py-0.5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            ATLAS OS // TRELLO
          </span>
          <button
            onClick={() => {
              setShowInviteModal(true);
              sensory.tick();
            }}
            className="flex items-center gap-1 text-[11px] font-medium bg-white hover:bg-neutral-50 text-[#1D1D1F] border border-black/[0.08] px-2.5 py-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-95 transition-all"
          >
            <Users className="w-3 h-3 text-neutral-500" />
            <span>Team ({members.length})</span>
          </button>
        </div>
      </header>

      {/* Board Hero Header */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#86868B]">
            {boardData?.workspace?.title || "Syndicate Operations"} • Telegram Board
          </span>
          <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
            {progressRatio}% Complete
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F] flex items-center gap-2">
          {boardData?.board?.title || "Sprint 2026 // D-Day Launchpad"}
        </h1>
        <p className="text-xs text-[#86868B] leading-relaxed">
          Asymmetric collaboration board with live Telegram permissions, checklist audits, and Star bounties.
        </p>
      </div>

      {/* Template Selector & AI Onboarding Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        {/* Template Selector Chips */}
        <div className="flex gap-1">
          {[
            { id: "scf_launch", label: "⚡ $SCF D-Day" },
            { id: "engineering", label: "🛠️ Engineering" },
            { id: "blank", label: "📄 Blank Slate" },
          ].map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => loadTemplate(tmpl.id)}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition-all ${
                currentTemplate === tmpl.id
                  ? "bg-[#1D1D1F] text-white border-[#1D1D1F]"
                  : "bg-white text-[#86868B] border-black/[0.08] hover:border-black/[0.15]"
              }`}
            >
              {tmpl.label}
            </button>
          ))}
        </div>

        {/* AI Onboarding Form Button */}
        <button
          onClick={() => {
            setShowOnboardingModal(true);
            sensory.tick();
          }}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium text-[11px] shadow-sm active:scale-95 transition-all"
        >
          <Sparkles className="w-3 h-3" />
          <span>AI Task Generator</span>
        </button>
      </div>

      {/* Team Collaborator Avatars Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-black/[0.07] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="flex -space-x-2">
            {members.map((m) => (
              <img
                key={m.telegramId}
                src={m.avatar}
                alt={m.name}
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                title={`${m.name} (${m.role}) - Click to manage`}
              />
            ))}
          </div>
          <div className="flex flex-col ml-1">
            <span className="text-xs font-medium text-[#1D1D1F]">
              {members.length} Collaborators
            </span>
            <span className="text-[10px] font-mono text-neutral-500">Tap to add / remove</span>
          </div>
        </div>

        <button
          onClick={() => {
            setShowNewCardModal(true);
            sensory.tick();
          }}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs font-medium shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Card</span>
        </button>
      </div>

      {/* Column Filter Selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        <button
          onClick={() => {
            setActiveColumnId("ALL");
            sensory.tick();
          }}
          className={`whitespace-nowrap px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all ${
            activeColumnId === "ALL"
              ? "bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-sm"
              : "bg-white text-[#86868B] border-black/[0.08] hover:border-black/[0.15]"
          }`}
        >
          All Columns ({cards.length})
        </button>

        {columns.map((col: any) => {
          const count = cards.filter((c) => c.columnId === col.id).length;
          const isActive = activeColumnId === col.id;
          return (
            <button
              key={col.id}
              onClick={() => {
                setActiveColumnId(col.id);
                sensory.tick();
              }}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-sm"
                  : "bg-white text-[#86868B] border-black/[0.08] hover:border-black/[0.15]"
              }`}
            >
              <span>{col.title}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards Feed */}
      <div className="flex flex-col gap-3">
        {filteredCards.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-black/[0.06] text-center flex flex-col items-center gap-2">
            <span className="text-2xl">📋</span>
            <span className="text-xs font-medium text-neutral-700">No directives in this view</span>
            <p className="text-[11px] text-neutral-400 max-w-xs">
              Use the AI Task Generator or &quot;New Card&quot; button to populate tasks based on your campaign objective.
            </p>
          </div>
        ) : (
          filteredCards.map((card) => {
            const completedChecks = card.checklist.filter((i) => i.isChecked).length;
            const totalChecks = card.checklist.length;

            return (
              <div
                key={card.id}
                className="p-4 rounded-3xl bg-white border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col gap-3 transition-all"
              >
                {/* Card Meta & Priority Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-medium text-[#86868B] bg-neutral-100 px-2 py-0.5 rounded-full">
                      {card.category}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                        card.priority === "CRITICAL"
                          ? "bg-rose-50 text-rose-600 border border-rose-200/60"
                          : card.priority === "HIGH"
                          ? "bg-amber-50 text-amber-600 border border-amber-200/60"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {card.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#86868B]">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span>{card.dueDate}</span>
                  </div>
                </div>

                {/* Card Title & Description */}
                <div>
                  <h3 className="text-sm font-semibold text-[#1D1D1F] tracking-tight leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#86868B] mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Interactive Checklist (Sub-Tasks) */}
                {card.checklist.length > 0 && (
                  <div className="p-3 rounded-2xl bg-[#F9F9FB] border border-black/[0.04] flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#86868B]">
                      <span>Sub-Task Checklist</span>
                      <span className="font-semibold text-[#1D1D1F]">
                        {completedChecks} of {totalChecks} Done
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {card.checklist.map((chk) => (
                        <button
                          key={chk.id}
                          onClick={() => handleToggleChecklist(card.id, chk.id)}
                          className="flex items-center gap-2 text-left text-xs text-[#1D1D1F] hover:text-black transition-colors"
                        >
                          {chk.isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-neutral-400 shrink-0" />
                          )}
                          <span className={chk.isChecked ? "line-through text-[#86868B]" : ""}>
                            {chk.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assignee & Star Bounty Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-black/[0.05]">
                  {/* Assignee */}
                  <div className="flex items-center gap-2">
                    <img
                      src={card.assignee.avatar}
                      alt={card.assignee.name}
                      className="w-6 h-6 rounded-full object-cover border border-black/[0.08]"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-[#1D1D1F] leading-none">
                        {card.assignee.name}
                      </span>
                      <span className="text-[9px] font-mono text-[#86868B]">
                        @{card.assignee.username} • {card.assignee.role}
                      </span>
                    </div>
                  </div>

                  {/* Star Bounty Tag */}
                  {card.starBounty > 0 && (
                    <button
                      onClick={() => handlePayBounty(card)}
                      className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2 py-1 rounded-full active:scale-95 transition-all"
                    >
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{card.starBounty} Stars Bounty</span>
                    </button>
                  )}
                </div>

                {/* Column Advancement Action Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-black/[0.04] text-[11px] font-mono text-[#86868B]">
                  <button
                    onClick={() => handleMoveCard(card.id, "prev")}
                    disabled={card.columnId === "col_backlog"}
                    className="flex items-center gap-1 hover:text-[#1D1D1F] disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>

                  <span className="text-[10px] text-neutral-400 uppercase">
                    Lane: {columns.find((c: any) => c.id === card.columnId)?.title}
                  </span>

                  <button
                    onClick={() => handleMoveCard(card.id, "next")}
                    disabled={card.columnId === "col_done"}
                    className="flex items-center gap-1 hover:text-[#1D1D1F] disabled:opacity-30 transition-colors font-medium text-[#1D1D1F]"
                  >
                    Advance <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Collaborators Management Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-black/[0.08] p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1D1D1F]">Manage Collaborators</span>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-[#86868B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Existing Collaborators List */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-[#86868B] uppercase">Active Teammates</span>
              <div className="flex flex-col gap-1.5">
                {members.map((m) => (
                  <div
                    key={m.telegramId}
                    className="p-2.5 rounded-xl bg-[#F5F5F7] border border-black/[0.04] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#1D1D1F]">{m.name}</span>
                        <span className="text-[9px] font-mono text-neutral-500">
                          @{m.username} • {m.role}
                        </span>
                      </div>
                    </div>
                    {m.role !== "OWNER" ? (
                      <button
                        onClick={() => handleRemoveMember(m.telegramId)}
                        title="Remove Collaborator"
                        className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[9px] font-mono text-emerald-600 font-bold px-1.5 py-0.5 rounded bg-emerald-50">
                        OWNER
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add Teammate Manually Form */}
            <form onSubmit={handleAddMember} className="flex flex-col gap-2 pt-2 border-t border-black/[0.05]">
              <span className="text-[10px] font-mono text-[#86868B] uppercase">Add Collaborator by Handle</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="@handle"
                  value={newMemberUsername}
                  onChange={(e) => setNewMemberUsername(e.target.value)}
                  className="p-2 rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-xs font-mono text-[#1D1D1F] focus:outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="p-2 rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-xs text-[#1D1D1F] focus:outline-none"
                />
              </div>
              <div className="flex gap-1.5">
                {(["MEMBER", "ADMIN", "OBSERVER"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setNewMemberRole(r)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                      newMemberRole === r
                        ? "bg-[#1D1D1F] text-white border-black font-bold"
                        : "bg-[#F5F5F7] text-neutral-600 border-black/[0.05]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-[#1D1D1F] hover:bg-black text-white text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Teammate</span>
              </button>
            </form>

            {/* 1-Tap Invite Link Generator */}
            <div className="flex flex-col gap-2 pt-2 border-t border-black/[0.05]">
              <span className="text-[10px] font-mono text-[#86868B] uppercase">Or Generate 1-Tap Telegram Link</span>
              <button
                onClick={copyInviteLink}
                className="w-full py-2.5 rounded-xl bg-[#F5F5F7] hover:bg-neutral-200 text-[#1D1D1F] border border-black/[0.08] text-xs font-mono font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                {inviteCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{inviteCopied ? "Link Copied!" : "Copy Telegram Invite Link"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Onboarding & Lore Task Generator Modal */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-black/[0.08] p-5 shadow-2xl flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>AI Lore Task Generator</span>
              </span>
              <button
                onClick={() => setShowOnboardingModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-[#86868B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#86868B] uppercase block mb-1">
                Campaign Objective
              </label>
              <textarea
                rows={2}
                value={campaignObjective}
                onChange={(e) => setCampaignObjective(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-xs text-[#1D1D1F] focus:outline-none focus:border-black resize-none font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#86868B] uppercase block mb-1">
                Brand & Lore Persona
              </label>
              <select
                value={brandLore}
                onChange={(e) => setBrandLore(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-xs font-mono text-[#1D1D1F]"
              >
                <option value="Stripper College Fund / Destiny Dev">Stripper College Fund ($SCF) // Destiny Dev</option>
                <option value="Ivy League General Counsel Satire">Ivy League Redacted Syllabus Satire</option>
                <option value="Minimalist High-Tech Executive">Apple Jony Ive Unibody Tech</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#86868B] uppercase block mb-1">
                Target Distribution Channels
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                {["X/Twitter Raids", "OnlyFans Trojan", "Telegram KOLs", "TikTok 3D Renders"].map((ch) => {
                  const isChecked = selectedChannels.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => {
                        setSelectedChannels((prev) =>
                          isChecked ? prev.filter((item) => item !== ch) : [...prev, ch]
                        );
                        sensory.tick();
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-1.5 transition-all ${
                        isChecked
                          ? "bg-pink-50 border-pink-300 text-pink-700 font-bold"
                          : "bg-[#F5F5F7] border-black/[0.06] text-neutral-600"
                      }`}
                    >
                      {isChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                      <span className="text-[10px] truncate">{ch}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleGenerateOnboardingTasks}
              disabled={isOnboardingGenerating}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md mt-1"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{isOnboardingGenerating ? "Synthesizing Directives..." : "Synthesize Tasks to Board"}</span>
            </button>
          </div>
        </div>
      )}

      {/* New Card Creation Modal */}
      {showNewCardModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateCard}
            className="w-full max-w-sm rounded-3xl bg-white border border-black/[0.08] p-5 shadow-2xl flex flex-col gap-3.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1D1D1F]">Create Task Directive</span>
              <button
                type="button"
                onClick={() => setShowNewCardModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-[#86868B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#86868B] uppercase block mb-1">
                Directive Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Audit Smart Contract LP Burn"
                className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-xs text-[#1D1D1F] focus:outline-none focus:border-black font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#86868B] uppercase block mb-1">
                Description & Scope
              </label>
              <textarea
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Provide clear acceptance criteria..."
                className="w-full p-2.5 rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-xs text-[#1D1D1F] focus:outline-none focus:border-black resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-[#86868B] uppercase block mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-xs font-mono text-[#1D1D1F]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#86868B] uppercase block mb-1">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-xs font-mono text-[#1D1D1F]"
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#86868B] uppercase block mb-1">
                Star Bounty (Telegram Stars)
              </label>
              <input
                type="number"
                value={newBounty}
                onChange={(e) => setNewBounty(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-[#F5F5F7] border border-black/[0.08] text-xs font-mono text-[#1D1D1F]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-[#1D1D1F] hover:bg-black text-white text-xs font-medium flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md mt-1"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy Card to Board</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

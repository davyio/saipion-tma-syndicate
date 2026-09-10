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
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [showNewCardModal, setShowNewCardModal] = useState<boolean>(false);
  const [inviteCopied, setInviteCopied] = useState<boolean>(false);
  const [inviteRole, setInviteRole] = useState<"MEMBER" | "ADMIN" | "OBSERVER">("MEMBER");

  // New Card Form State
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("Sprint");
  const [newPriority, setNewPriority] = useState<"NORMAL" | "HIGH" | "CRITICAL">("NORMAL");
  const [newBounty, setNewBounty] = useState<number>(100);
  const [newColId, setNewColId] = useState<string>("col_backlog");

  useEffect(() => {
    fetch("/api/modules/atlas-board", { method: "POST", body: JSON.stringify({}) })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) {
          setBoardData(res);
          setCards(res.cards || []);
          setMembers(res.members || []);
        }
      })
      .catch(() => {});
  }, []);

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

      {/* Team Collaborator Avatars Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-black/[0.07] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {members.map((m) => (
              <img
                key={m.telegramId}
                src={m.avatar}
                alt={m.name}
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                title={`${m.name} (${m.role})`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-[#1D1D1F] ml-1">
            {members.length} Active Collaborators
          </span>
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
        {filteredCards.map((card) => {
          const completedChecks = card.checklist.filter((i) => i.isChecked).length;
          const totalChecks = card.checklist.length;
          const allDone = totalChecks > 0 && completedChecks === totalChecks;

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
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev Stage
                </button>

                <span className="text-[10px] font-semibold text-[#1D1D1F] uppercase">
                  {columns.find((c: any) => c.id === card.columnId)?.title}
                </span>

                <button
                  onClick={() => handleMoveCard(card.id, "next")}
                  disabled={card.columnId === "col_done"}
                  className="flex items-center gap-1 text-[#1D1D1F] font-semibold hover:text-black disabled:opacity-30 transition-colors"
                >
                  Next Stage <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Teammate Invite Link Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-black/[0.08] p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1D1D1F]">Invite Collaborator</span>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-[#86868B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#86868B] leading-relaxed">
              Generate a 1-tap cryptographic invite link. When your teammate opens it on Telegram, they automatically bind to this board.
            </p>

            {/* Role Selection */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-[#86868B] uppercase">Select Member Role</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(["MEMBER", "ADMIN", "OBSERVER"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setInviteRole(r);
                      sensory.tick();
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-mono font-medium border transition-all ${
                      inviteRole === r
                        ? "bg-[#1D1D1F] text-white border-[#1D1D1F]"
                        : "bg-[#F5F5F7] text-[#86868B] border-black/[0.06]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyInviteLink}
              className="w-full py-3 px-4 rounded-2xl bg-[#1D1D1F] hover:bg-black text-white text-xs font-medium flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
            >
              {inviteCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{inviteCopied ? "Link Copied to Clipboard" : "Copy 1-Tap Telegram Link"}</span>
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

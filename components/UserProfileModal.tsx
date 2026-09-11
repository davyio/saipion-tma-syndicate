"use client";

import React from "react";
import { sensory } from "@/lib/sensory";
import {
  X,
  ShieldCheck,
  Star,
  CheckCircle2,
  Send,
  ExternalLink,
  UserPlus,
  Zap,
  Kanban,
  Award,
} from "lucide-react";

export interface UserProfileData {
  telegramId: number;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "OBSERVER";
  isVerified?: boolean;
  starsBalance?: number;
  cardsAssigned?: number;
  reputationScore?: number;
}

interface UserProfileModalProps {
  user: UserProfileData | null;
  isOpen: boolean;
  onClose: () => void;
  onAssignToCard?: (user: UserProfileData) => void;
  onAddToTeam?: (user: UserProfileData) => void;
  isAlreadyMember?: boolean;
}

export function UserProfileModal({
  user,
  isOpen,
  onClose,
  onAssignToCard,
  onAddToTeam,
  isAlreadyMember = false,
}: UserProfileModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0F0E14] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden text-neutral-100 flex flex-col font-sans">
        {/* Banner Glow */}
        <div className="h-20 w-full bg-gradient-to-r from-pink-600/40 via-purple-600/30 to-cyan-600/40 relative">
          <button
            onClick={() => {
              sensory.tick();
              onClose();
            }}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="px-5 pb-5 -mt-10 flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-[#0F0E14] shadow-xl"
            />
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-cyan-500 text-black shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 fill-black text-cyan-400" />
              </div>
            )}
          </div>

          <div className="mt-2.5">
            <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
              {user.name}
            </h3>
            <span className="text-xs font-mono text-pink-400">@{user.username}</span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <span
              className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                user.role === "OWNER"
                  ? "bg-amber-950/60 border-amber-500/40 text-amber-300"
                  : user.role === "ADMIN"
                  ? "bg-purple-950/60 border-purple-500/40 text-purple-300"
                  : "bg-neutral-900 border-white/10 text-neutral-300"
              }`}
            >
              {user.role}
            </span>
            <span className="text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> VERIFIED
            </span>
          </div>

          {/* Bio */}
          <p className="mt-3 text-xs text-neutral-300 leading-relaxed max-w-xs bg-white/[0.02] p-2.5 rounded-xl border border-white/5 italic">
            &quot;{user.bio}&quot;
          </p>

          {/* Stats Grid */}
          <div className="mt-3.5 grid grid-cols-3 gap-2 w-full text-center">
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[9px] font-mono text-neutral-400 block uppercase">Reputation</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {user.reputationScore || 95}%
              </span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[9px] font-mono text-neutral-400 block uppercase">Tasks</span>
              <span className="text-sm font-bold font-mono text-white">
                {user.cardsAssigned || 2} Active
              </span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[9px] font-mono text-neutral-400 block uppercase">Stars Pool</span>
              <span className="text-sm font-bold font-mono text-amber-400 flex items-center justify-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400" />
                {user.starsBalance || 500}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col gap-2 w-full">
            {onAssignToCard && (
              <button
                onClick={() => {
                  sensory.successChime();
                  onAssignToCard(user);
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,0,127,0.3)]"
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Assign to Selected Card</span>
              </button>
            )}

            {!isAlreadyMember && onAddToTeam && (
              <button
                onClick={() => {
                  sensory.successChime();
                  onAddToTeam(user);
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                <span>Add @{user.username} to Team Roster</span>
              </button>
            )}

            <a
              href={`https://t.me/${user.username}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => sensory.tick()}
              className="py-2 text-[11px] font-mono text-neutral-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
            >
              <span>Open Telegram Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

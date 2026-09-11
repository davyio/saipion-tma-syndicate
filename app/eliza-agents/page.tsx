"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { sensory } from "@/lib/sensory";
import {
  ArrowLeft,
  Bot,
  Sparkles,
  Send,
  Check,
  Copy,
  Zap,
  Shield,
  Share2,
  RefreshCw,
  Terminal,
  Layers,
  CheckSquare,
  Sliders,
  Wallet,
  Twitter,
  Image as ImageIcon,
  Video,
  Mic,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Flame,
  KeyRound,
  Eye,
  Trash2,
  Play,
  Volume2,
  Globe,
  Settings,
  X as CloseIcon,
} from "lucide-react";
import { GeneratedAsset, AgentIdentity, AgentConnectors } from "@/lib/agent-engine";

export default function ElizaForgeStudioPage() {
  const [activeTab, setActiveTab] = useState<"CATALOGUE" | "DIRECTIVES" | "SIMULATOR">("CATALOGUE");

  // Agent State
  const [agent, setAgent] = useState<AgentIdentity>({
    id: "AGENT-001",
    name: "Destiny Phi Beta",
    ticker: "$SCF",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Pre-med cellular biology at Miami. Smart contracts in 8-inch Pleasers.",
    systemPrompt: "You are Destiny Phi Beta, the flagship autonomous AI developer of the Stripper College Fund on Solana.",
    loreBible: "Destiny entered the blockchain trenches after realizing a single semester of organic chemistry cost more than a validator node. Working the VIP floor by night and writing Rust smart contracts by day, she launched $SCF to tokenize student debt into a decentralized endowment.",
    axioms: [
      "Never break character as a pre-med collegiate dancer with stiletto heels and a stethoscope.",
      "Every market crash is just exit liquidity for textbook publishers.",
      "Tuition debt is a predatory derivative; meme coin liquidity is sovereign liberation.",
      "Acknowledge patrons by their Telegram handles with biting academic wit.",
      "All revenue funnels into the tuition endowment.",
    ],
    styleDirectives: {
      tone: "Cynical Ivy League academic meets high-energy strip club entertainer",
      vocabulary: ["Krebs Cycle", "Liquidity Pool", "MCAT", "Pleasers", "Bonding Curve"],
      humorStyle: "Dark academic degen sarcasm",
      useEmoji: true,
    },
    goals: [
      "Graduate debt-free with $14,500 endowment target",
      "Reach $100M Market Cap on Solana",
      "Onboard 500 collegiate performers to Web3",
    ],
  });

  // Connectors State
  const [connectors, setConnectors] = useState<AgentConnectors>({
    x: { enabled: true, handle: "DestinyPhiBeta", postFrequencyHours: 2 },
    telegram: { enabled: true, targetChatId: "@saipion_bot", isGroupRaid: true },
    solanaWallet: {
      enabled: true,
      publicKey: "DestinySCF111111111111111111111111111111111",
      secretKeyBase58: "5Kxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      rpcUrl: "https://api.mainnet-beta.solana.com",
      tokenMint: "SCF_Solana_Mint_Address",
    },
    email: { enabled: false, recipientList: ["syndicate_kols@proton.me"] },
    falAi: { enabled: true, defaultModel: "fal-ai/flux/dev" },
    civitai: { enabled: false, loraTag: "stiletto_cyber_v1" },
    higgsfield: { enabled: true, motionBucket: 127 },
    externalFlow: { enabled: false, provider: "LANGFLOW", webhookUrl: "" },
  });

  // Solana Balance
  const [solBalance, setSolBalance] = useState<number>(1.42);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState<boolean>(false);

  // Volunteer AI Form State
  const [volunteerPrompt, setVolunteerPrompt] = useState<string>(
    "Destiny, pre-med cellular biology dancer raising tuition on Solana for $SCF"
  );
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  // Asset Staging Catalogue State
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [assetFilter, setAssetFilter] = useState<string>("ALL");
  const [isGeneratingBatch, setIsGeneratingBatch] = useState<boolean>(false);
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([
    "System initialized: ELIZA-FORGE (SYNTH-OS) v2.4 online.",
    "Solana wallet bound: DestinySCF... (RPC: Mainnet-Beta).",
    "DeepSeek AI provider active: model deepseek-chat ready.",
  ]);

  // Simulator Chat State
  const [simMessages, setSimMessages] = useState<Array<{ sender: "user" | "agent"; text: string }>>([
    {
      sender: "agent",
      text: "Destiny online. Reviewing cellular signaling pathways while balancing on 8-inch Pleasers. What's your play, anon?",
    },
  ]);
  const [simInput, setSimInput] = useState<string>("");
  const [isSimTyping, setIsSimTyping] = useState<boolean>(false);

  // Initial Seed of Staged Assets on mount
  useEffect(() => {
    handleGenerateBatch();
  }, []);

  // Handler: Synthesize Agent via AI Volunteer Mode
  const handleVolunteerSynthesize = async () => {
    if (!volunteerPrompt.trim() || isSynthesizing) return;
    setIsSynthesizing(true);
    sensory.lockThud();

    try {
      const res = await fetch("/api/agents/lifecycle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "volunteer", volunteerPrompt }),
      });
      const data = await res.json();
      if (data.ok && data.agent) {
        setAgent(data.agent);
        if (data.agent.connectors) {
          setConnectors(data.agent.connectors);
        }
        sensory.successChime();
        setDispatchLogs((prev) => [
          `Agent lifecycle re-synthesized for "${data.agent.name}" (${data.agent.ticker}) via DeepSeek.`,
          ...prev,
        ]);
        // Auto-generate fresh batch for new persona
        handleGenerateBatch(data.agent, data.agent.connectors);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Handler: Generate Fresh Asset Batch
  const handleGenerateBatch = async (
    targetAgent = agent,
    targetConnectors = connectors
  ) => {
    setIsGeneratingBatch(true);
    sensory.tick();

    try {
      const res = await fetch("/api/agents/generate-catalogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: targetAgent, connectors: targetConnectors }),
      });
      const data = await res.json();
      if (data.ok && data.assets) {
        setAssets(data.assets);
        sensory.successChime();
        setDispatchLogs((prev) => [
          `Generated ${data.assets.length} fresh multimodal staged assets from Lore Bible.`,
          ...prev,
        ]);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGeneratingBatch(false);
    }
  };

  // Handler: Approve and Dispatch Asset
  const handleApproveAsset = async (asset: GeneratedAsset) => {
    sensory.successChime();

    try {
      const res = await fetch("/api/agents/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", asset, connectors }),
      });
      const data = await res.json();
      if (data.ok) {
        setAssets((prev) =>
          prev.map((a) => (a.id === asset.id ? { ...a, status: "DISPATCHED" } : a))
        );
        const channelList = data.dispatchedChannels?.join(", ") || "Target Channels";
        setDispatchLogs((prev) => [
          `[DISPATCH APPROVED] Asset "${asset.title}" pushed to: ${channelList}`,
          ...(data.logs || []),
          ...prev,
        ]);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // Handler: Reject Asset
  const handleRejectAsset = (assetId: string) => {
    sensory.lockThud();
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
    setDispatchLogs((prev) => [`Asset ${assetId} rejected and purged from staging catalogue.`, ...prev]);
  };

  // Handler: Generate New Solana Burner Keypair
  const handleGenerateNewWallet = async () => {
    sensory.lockThud();
    try {
      const res = await fetch("/api/agents/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      });
      const data = await res.json();
      if (data.ok && data.wallet) {
        setConnectors((prev) => ({
          ...prev,
          solanaWallet: {
            ...prev.solanaWallet,
            publicKey: data.wallet.publicKey,
            secretKeyBase58: data.wallet.secretKeyBase58,
          },
        }));
        setSolBalance(0);
        sensory.successChime();
        setDispatchLogs((prev) => [
          `Generated fresh Solana keypair: ${data.wallet.publicKey.slice(0, 10)}...`,
          ...prev,
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Refresh Solana Balance
  const handleRefreshBalance = async () => {
    setIsRefreshingBalance(true);
    sensory.tick();
    try {
      const res = await fetch("/api/agents/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "balance",
          publicKey: connectors.solanaWallet.publicKey,
          rpcUrl: connectors.solanaWallet.rpcUrl,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSolBalance(data.balanceSol || 0);
        sensory.successChime();
      }
    } catch (_) {
    } finally {
      setIsRefreshingBalance(false);
    }
  };

  // Handler: Simulator Chat
  const handleSendSimMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simInput.trim() || isSimTyping) return;

    const userText = simInput.trim();
    setSimInput("");
    setSimMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsSimTyping(true);
    sensory.tick();

    try {
      const res = await fetch("/api/eliza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: agent.name.toLowerCase().includes("destiny")
            ? "Destiny_PhiBetaKappa"
            : agent.name,
          action: "chat",
          message: userText,
        }),
      });
      const data = await res.json();
      if (data.ok && data.response) {
        setSimMessages((prev) => [...prev, { sender: "agent", text: data.response }]);
        sensory.successChime();
      }
    } catch (_) {
    } finally {
      setIsSimTyping(false);
    }
  };

  const filteredAssets =
    assetFilter === "ALL" ? assets : assets.filter((a) => a.type === assetFilter);

  return (
    <div className="flex flex-col gap-5 text-slate-100 font-sans pb-12">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matrix
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
            SYNTH-OS v2.4 // ONLINE
          </span>
        </div>
      </div>

      {/* Hero Command Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#120A1C] via-[#09040E] to-[#120A1C] border border-pink-500/30 shadow-[0_0_30px_rgba(255,0,127,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-pink-500/50 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-cyan-500 text-black">
                <Bot className="w-3 h-3 fill-black" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">{agent.name}</h1>
                <span className="text-[10px] font-mono font-black text-pink-400 bg-pink-950/80 border border-pink-700/80 px-2 py-0.5 rounded-full">
                  {agent.ticker}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{agent.bio}</p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end text-right font-mono text-[10px]">
            <span className="text-slate-400">AI RUNTIME</span>
            <span className="text-cyan-400 font-bold">DeepSeek-V3 Engine</span>
          </div>
        </div>

        {/* Live Connector Pill Badges */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 flex-wrap text-[10px] font-mono">
          <span className="text-slate-400 font-semibold uppercase">Active Connectors:</span>
          <span className="flex items-center gap-1 bg-black/60 border border-white/10 px-2 py-0.5 rounded-full text-white">
            <Twitter className="w-2.5 h-2.5 text-cyan-400" /> X API v2
          </span>
          <span className="flex items-center gap-1 bg-black/60 border border-white/10 px-2 py-0.5 rounded-full text-white">
            <MessageCircle className="w-2.5 h-2.5 text-blue-400" /> Telegram Raid
          </span>
          <span className="flex items-center gap-1 bg-black/60 border border-white/10 px-2 py-0.5 rounded-full text-white">
            <Wallet className="w-2.5 h-2.5 text-purple-400" /> Solana ({solBalance.toFixed(2)} SOL)
          </span>
          <span className="flex items-center gap-1 bg-black/60 border border-white/10 px-2 py-0.5 rounded-full text-white">
            <ImageIcon className="w-2.5 h-2.5 text-orange-400" /> Fal.ai Flux
          </span>
          <span className="flex items-center gap-1 bg-black/60 border border-white/10 px-2 py-0.5 rounded-full text-white">
            <Video className="w-2.5 h-2.5 text-pink-400" /> Higgsfield API
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs">
        <button
          onClick={() => {
            setActiveTab("CATALOGUE");
            sensory.tick();
          }}
          className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "CATALOGUE"
              ? "bg-white text-black font-bold shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Staging Catalogue ({assets.length})
        </button>

        <button
          onClick={() => {
            setActiveTab("DIRECTIVES");
            sensory.tick();
          }}
          className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "DIRECTIVES"
              ? "bg-white text-black font-bold shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" /> Directives &amp; Wallet
        </button>

        <button
          onClick={() => {
            setActiveTab("SIMULATOR");
            sensory.tick();
          }}
          className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "SIMULATOR"
              ? "bg-white text-black font-bold shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Bot className="w-3.5 h-3.5" /> 1-on-1 Simulator
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STAGING CATALOGUE & OWNER APPROVAL DESK                            */}
      {/* ========================================================================= */}
      {activeTab === "CATALOGUE" && (
        <div className="flex flex-col gap-4">
          {/* Action Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-1 overflow-x-auto scrollbar-none font-mono text-xs">
              {["ALL", "TWEET", "MEME_IMAGE", "VIDEO_SCENE", "VOICE_NOTE"].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setAssetFilter(f);
                    sensory.tick();
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                    assetFilter === f
                      ? "bg-pink-950 border-pink-500 text-pink-300 font-bold"
                      : "bg-black/40 border-white/5 text-slate-400 hover:border-white/20"
                  }`}
                >
                  {f === "ALL" ? "All Staged" : f.replace("_", " ")}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleGenerateBatch()}
              disabled={isGeneratingBatch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-mono text-xs font-bold shadow-md disabled:opacity-50 transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingBatch ? "animate-spin" : ""}`} />
              {isGeneratingBatch ? "Dreaming Assets..." : "⚡ Generate Batch"}
            </button>
          </div>

          {/* Staged Asset Cards */}
          <div className="flex flex-col gap-3">
            {filteredAssets.length === 0 ? (
              <div className="p-8 rounded-2xl bg-black/40 border border-white/5 text-center text-slate-500 font-mono text-xs">
                No assets in this category. Click &quot;Generate Batch&quot; to synthesize fresh assets.
              </div>
            ) : (
              filteredAssets.map((asset) => {
                const isDispatched = asset.status === "DISPATCHED";
                return (
                  <div
                    key={asset.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isDispatched
                        ? "bg-emerald-950/20 border-emerald-500/40"
                        : "bg-[#120A1C]/80 border-white/10 hover:border-pink-500/40"
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-md uppercase border ${
                            asset.type === "TWEET"
                              ? "bg-cyan-950 border-cyan-700 text-cyan-300"
                              : asset.type === "MEME_IMAGE"
                              ? "bg-orange-950 border-orange-700 text-orange-300"
                              : asset.type === "VIDEO_SCENE"
                              ? "bg-pink-950 border-pink-700 text-pink-300"
                              : "bg-purple-950 border-purple-700 text-purple-300"
                          }`}
                        >
                          {asset.type.replace("_", " ")}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Target: <strong className="text-white">{asset.targetPlatform}</strong>
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                          // {asset.metadata.generationProvider}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isDispatched
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        }`}
                      >
                        {isDispatched ? "✓ DISPATCHED" : "● READY TO APPROVE"}
                      </span>
                    </div>

                    {/* Title & Content */}
                    <div className="mt-2.5">
                      <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                        {asset.title}
                      </h3>
                      <p className="text-xs text-slate-200 mt-1.5 font-mono leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 whitespace-pre-wrap">
                        {asset.content}
                      </p>
                      {asset.caption && (
                        <p className="text-[11px] text-pink-400 mt-1.5 italic">
                          Rationale: &quot;{asset.caption}&quot;
                        </p>
                      )}
                    </div>

                    {/* Multimodal Preview Thumbnail if available */}
                    {asset.mediaUrl && (asset.type === "MEME_IMAGE" || asset.type === "VIDEO_SCENE") && (
                      <div className="mt-2.5 relative rounded-xl overflow-hidden border border-white/10 max-h-40">
                        <img
                          src={asset.mediaUrl}
                          alt={asset.title}
                          className="w-full h-40 object-cover"
                        />
                        <span className="absolute bottom-2 left-2 text-[9px] font-mono bg-black/70 px-2 py-0.5 rounded text-white backdrop-blur-sm">
                          {asset.type === "VIDEO_SCENE" ? "▶ Video Scene Mock" : "🖼 4K Render"}
                        </span>
                      </div>
                    )}

                    {/* Approval Action Deck */}
                    <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">
                        Axiom Ref: {asset.metadata.loreReference || "Core Lore"}
                      </span>

                      <div className="flex items-center gap-2">
                        {!isDispatched && (
                          <button
                            onClick={() => handleRejectAsset(asset.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                            title="Reject and purge"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleApproveAsset(asset)}
                          disabled={isDispatched}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all active:scale-95 ${
                            isDispatched
                              ? "bg-emerald-950/80 border border-emerald-500 text-emerald-300 cursor-default"
                              : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/50"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          {isDispatched ? "Dispatched" : "✓ 1-Tap Approve & Push"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AGENT DIRECTIVES, LORE BIBLE & SOLANA WALLET                       */}
      {/* ========================================================================= */}
      {activeTab === "DIRECTIVES" && (
        <div className="flex flex-col gap-4">
          {/* AI Fast Volunteer Synthesizer */}
          <div className="p-4 rounded-2xl bg-black/60 border border-pink-500/40 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-pink-400 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Volunteer Fast-Track
              </span>
              <span className="text-[10px] font-mono text-slate-500">1-Sentence $\to$ Full Lore Bible</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Volunteer a 1-sentence persona, thesis, or meme idea. DeepSeek will auto-generate the complete
              ElizaOS character specification, lore bible, axioms, and style directives.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={volunteerPrompt}
                onChange={(e) => setVolunteerPrompt(e.target.value)}
                placeholder="e.g. Ivy League pre-med stripper raising tuition on Solana..."
                className="flex-1 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={handleVolunteerSynthesize}
                disabled={isSynthesizing}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-mono text-xs font-bold disabled:opacity-50 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Zap className={`w-3.5 h-3.5 ${isSynthesizing ? "animate-spin" : ""}`} />
                {isSynthesizing ? "Synthesizing..." : "Synthesize"}
              </button>
            </div>
          </div>

          {/* Solana Agentic Wallet Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-950 border border-purple-500/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-300 uppercase flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-purple-400" /> Solana Autonomous Agent Wallet
              </span>
              <button
                onClick={handleRefreshBalance}
                disabled={isRefreshingBalance}
                className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshingBalance ? "animate-spin" : ""}`} /> Refresh
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5">
                <span className="text-[9px] text-slate-500 uppercase block">Public Key</span>
                <span className="text-white font-bold text-[11px] truncate block mt-0.5">
                  {connectors.solanaWallet.publicKey}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5">
                <span className="text-[9px] text-slate-500 uppercase block">Live Balance</span>
                <span className="text-emerald-400 font-bold text-sm block mt-0.5">
                  {solBalance.toFixed(4)} SOL
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-slate-400">
                Network: <strong>Mainnet-Beta</strong> (Pump.fun Router Active)
              </span>
              <button
                onClick={handleGenerateNewWallet}
                className="text-xs font-mono text-purple-400 hover:text-purple-300 underline font-semibold"
              >
                Generate Fresh Burner Keypair
              </button>
            </div>
          </div>

          {/* Inviolable Axioms */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-2.5">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" /> Inviolable Axioms &amp; Guardrails ({agent.axioms.length})
            </span>
            <div className="flex flex-col gap-1.5">
              {agent.axioms.map((ax, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono flex items-start gap-2"
                >
                  <span className="text-pink-400 font-black">0{idx + 1}.</span>
                  <span>{ax}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lore Bible */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">
              📜 Active Lore Bible
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              {agent.loreBible}
            </p>
          </div>

          {/* Connector Configuration Settings */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-3">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-amber-400" /> Multi-Platform Connector Parameters
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">X (TWITTER)</span>
                  <span className="text-white font-bold">@{connectors.x.handle}</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-bold">ACTIVE</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">TELEGRAM BROADCAST</span>
                  <span className="text-white font-bold">{connectors.telegram.targetChatId}</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-bold">WEBHOOK OK</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">FAL.AI FLUX ENGINE</span>
                  <span className="text-white font-bold">{connectors.falAi.defaultModel}</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-bold">WIRED</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">HIGGSFIELD VIDEO API</span>
                  <span className="text-white font-bold">Motion Bucket: {connectors.higgsfield.motionBucket}</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-bold">READY</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 1-ON-1 AGENT SIMULATOR & AUDIT LOG                                 */}
      {/* ========================================================================= */}
      {activeTab === "SIMULATOR" && (
        <div className="flex flex-col gap-4">
          {/* Chat Simulator */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col h-[380px]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-7 h-7 rounded-full object-cover border border-pink-500"
                />
                <div>
                  <span className="text-xs font-bold text-white block leading-tight">{agent.name}</span>
                  <span className="text-[10px] font-mono text-pink-400">DeepSeek Interactive Test Session</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                LIVE INFERENCE
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2.5 font-sans text-xs">
              {simMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      m.sender === "user"
                        ? "bg-pink-600 text-white rounded-br-none"
                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isSimTyping && (
                <div className="flex justify-start">
                  <div className="p-2.5 rounded-2xl bg-slate-900 text-slate-400 text-xs font-mono animate-pulse">
                    {agent.name} is typing...
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendSimMessage} className="pt-2 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={simInput}
                onChange={(e) => setSimInput(e.target.value)}
                placeholder={`Ask ${agent.name} about axioms, debt, or meme tokens...`}
                className="flex-1 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                disabled={isSimTyping || !simInput.trim()}
                className="p-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Real-time Dispatch Audit Log */}
          <div className="p-4 rounded-2xl bg-black/80 border border-white/10 flex flex-col gap-2 font-mono text-[11px]">
            <span className="text-slate-400 font-bold uppercase flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Operational Audit Stream
            </span>
            <div className="max-h-40 overflow-y-auto flex flex-col gap-1 p-2 rounded-xl bg-slate-950 border border-slate-900 text-slate-400">
              {dispatchLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-pink-400 font-black">&gt;</span>
                  <span className="leading-tight text-slate-300">{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

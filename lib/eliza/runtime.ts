import { ElizaCharacter } from "./types";
import { destinyCharacter } from "./characters/destiny";
import { bouncerCharacter } from "./characters/bouncer";
import { simpSweeperCharacter } from "./characters/simp-sweeper";
import { callDeepSeek } from "../ai";

export class ElizaRuntime {
  private characters: Map<string, ElizaCharacter> = new Map();

  constructor() {
    this.register(destinyCharacter);
    this.register(bouncerCharacter);
    this.register(simpSweeperCharacter);
  }

  public register(char: ElizaCharacter) {
    this.characters.set(char.username.toLowerCase(), char);
  }

  public getCharacter(name: string): ElizaCharacter | undefined {
    return this.characters.get(name.toLowerCase());
  }

  public listCharacters(): ElizaCharacter[] {
    return Array.from(this.characters.values());
  }

  public async generateResponse(
    characterName: string,
    userMessage: string,
    context?: { platform?: string; username?: string }
  ): Promise<{ response: string; character: string; model: string }> {
    const char = this.getCharacter(characterName);
    if (!char) {
      throw new Error(`Character ${characterName} not registered in ElizaOS runtime.`);
    }

    // 1. Primary: DeepSeek AI Engine
    const deepSeekReply = await callDeepSeek({
      messages: [
        { role: "system", content: `${char.system}\n\nBIO:\n${char.bio.join("\n")}\n\nLORE:\n${char.lore.join("\n")}` },
        { role: "user", content: userMessage },
      ],
      temperature: 0.8,
      max_tokens: 350,
      model: "deepseek-chat",
    });

    if (deepSeekReply) {
      return { response: deepSeekReply.trim(), character: char.name, model: "deepseek:deepseek-chat" };
    }

    // Heuristic contextual fallback matching character tone & lore
    const lower = userMessage.toLowerCase();
    let fallback = "";

    if (char.username === "Destiny_PhiBetaKappa") {
      if (lower.includes("moon") || lower.includes("price") || lower.includes("when") || lower.includes("wen")) {
        fallback = "wen graduation? I'm reviewing biochemical reaction kinetics in the break room while you stare at a 1-minute candle. Check the 4-year liquidity lock and go read a textbook.";
      } else if (lower.includes("audit") || lower.includes("safe") || lower.includes("rug")) {
        fallback = "The contract is deployed and locked for 4 years—exactly the length of my nursing degree. No sugar daddy, no team tax, strictly decentralized liquidity.";
      } else {
        fallback = `Look, ${context?.username || "anon"}, I'm coding from the Miami VIP locker room between sets. Either contribute to the 3% tuition fund or get out of the way. We're breaking the Lucite Ceiling tonight.`;
      }
    } else if (char.username === "The_Bouncer_Bot") {
      if (lower.includes("enter") || lower.includes("access") || lower.includes("vip") || lower.includes("in")) {
        fallback = "Show me 10,000 $SCF in your wallet or pay the 100 Stars cover charge. Keep your hands where I can see 'em. Step back from the velvet rope.";
      } else {
        fallback = "Zero tolerance for FUD or creeps past this rope. Dev is studying for finals in the dressing room. Keep it moving.";
      }
    } else if (char.username === "The_Simp_Sweeper") {
      fallback = `I'll read your full 20-page macro thesis right after you tip my bio-chem lab fee in Stars. Look at that gorgeous Heel Click breakout on DexScreener. Buy the dip: SCF7v...`;
    } else {
      fallback = char.postExamples[Math.floor(Math.random() * char.postExamples.length)];
    }

    return { response: fallback, character: char.name, model: "elizaos:heuristic-core" };
  }

  public generatePost(characterName: string): { post: string; character: string } {
    const char = this.getCharacter(characterName);
    if (!char) throw new Error(`Character ${characterName} not found.`);
    const post = char.postExamples[Math.floor(Math.random() * char.postExamples.length)];
    return { post, character: char.name };
  }
}

export const elizaRuntime = new ElizaRuntime();

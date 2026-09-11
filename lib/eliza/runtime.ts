import { ElizaCharacter } from "./types";
import { destinyCharacter } from "./characters/destiny";
import { bouncerCharacter } from "./characters/bouncer";
import { simpSweeperCharacter } from "./characters/simp-sweeper";

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

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (apiKey) {
      try {
        const messages = [
          { role: "system", content: `${char.system}\n\nBIO:\n${char.bio.join("\n")}\n\nLORE:\n${char.lore.join("\n")}` },
          { role: "user", content: userMessage },
        ];

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://elegant-chandrasekhar.vercel.app",
            "X-Title": "Saipion Syndicate ElizaOS",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct:free",
            messages,
            temperature: 0.8,
            max_tokens: 300,
          }),
        });

        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return { response: text.trim(), character: char.name, model: "openrouter:llama-3.1-8b" };
        }
      } catch (err) {
        console.warn("[ElizaRuntime] OpenRouter invocation fallback triggered:", err);
      }
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

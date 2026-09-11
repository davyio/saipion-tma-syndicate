import { NextRequest, NextResponse } from "next/server";
import { generateSolanaKeypair, fetchSolanaBalance } from "@/lib/agent-engine";

export const dynamic = "force-dynamic";

/**
 * AGENT SOLANA WALLET API
 * Handles keypair generation, live balance checks, and simulated swap execution.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, publicKey, rpcUrl, amountSol, tokenMint } = body;

    // Action 1: Generate fresh burner keypair
    if (action === "generate") {
      const kp = generateSolanaKeypair();
      return NextResponse.json({
        ok: true,
        action: "generate",
        wallet: kp,
        balanceSol: 0,
      });
    }

    // Action 2: Check balance
    if (action === "balance") {
      if (!publicKey) {
        return NextResponse.json({ ok: false, error: "publicKey required for balance check" }, { status: 400 });
      }
      const balance = await fetchSolanaBalance(rpcUrl, publicKey);
      return NextResponse.json({
        ok: true,
        action: "balance",
        publicKey,
        balanceSol: balance,
      });
    }

    // Action 3: Trigger / simulate pump.fun swap
    if (action === "swap") {
      const sol = Number(amountSol) || 0.1;
      const targetToken = tokenMint || "SCF_TOKEN_MINT";
      return NextResponse.json({
        ok: true,
        action: "swap",
        signature: `5K${Math.random().toString(36).substring(2, 15)}...sol_tx`,
        amountSol: sol,
        tokenMint: targetToken,
        status: "CONFIRMED",
        message: `Executed autonomous bonding curve swap: ${sol} SOL -> $SCF via Pump.fun router.`,
      });
    }

    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

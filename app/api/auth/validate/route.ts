import { NextRequest, NextResponse } from "next/server";
import { validateTelegramInitData } from "@/lib/telegram-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/**
 * APP 1: THE IDENTITY NODE VALIDATOR
 * Cryptographically verifies Telegram initData and upserts user record to Supabase.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { initData } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json(
        { ok: false, error: "Server missing TELEGRAM_BOT_TOKEN environment variable." },
        { status: 500 }
      );
    }

    // 1. Cryptographic Validation
    const validation = validateTelegramInitData(initData, botToken);
    if (!validation.isValid || !validation.user) {
      return NextResponse.json(
        { ok: false, error: validation.error || "Cryptographic verification failed." },
        { status: 401 }
      );
    }

    const user = validation.user;

    // 2. Persist / Upsert into Supabase
    let syncedToDb = false;
    try {
      const supabase = getSupabaseServerClient();
      const { error: dbError } = await supabase.from("users").upsert({
        id: user.id,
        username: user.username || null,
        first_name: user.first_name || "",
        last_name: user.last_name || null,
        language_code: user.language_code || "en",
        is_premium: user.is_premium || false,
        last_seen_at: new Date().toISOString(),
      });

      if (dbError) {
        console.warn("[App 1 Auth] Supabase upsert error (check database connectivity):", dbError.message);
      } else {
        syncedToDb = true;
      }
    } catch (dbErr: any) {
      console.warn("[App 1 Auth] Supabase client execution error:", dbErr.message);
    }

    return NextResponse.json({
      ok: true,
      verified: true,
      user,
      authDate: validation.authDate,
      syncedToDb,
    });
  } catch (err: any) {
    console.error("[App 1 Auth] Unexpected error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

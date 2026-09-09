import crypto from "crypto";
import { TelegramUser } from "@/types/telegram";

export interface ValidationResult {
  isValid: boolean;
  user?: TelegramUser;
  authDate?: number;
  error?: string;
}

/**
 * Validates the raw Telegram WebApp initData string against the bot token.
 * Ref: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateTelegramInitData(
  initData: string,
  botToken: string
): ValidationResult {
  if (!initData) {
    return { isValid: false, error: "Missing initData" };
  }

  if (!botToken) {
    return { isValid: false, error: "Missing TELEGRAM_BOT_TOKEN" };
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");

    if (!hash) {
      return { isValid: false, error: "Missing hash parameter in initData" };
    }

    params.delete("hash");

    // Sort parameters alphabetically
    const keys = Array.from(params.keys()).sort();
    const dataCheckString = keys.map((key) => `${key}=${params.get(key)}`).join("\n");

    // 1. Secret key = HMAC_SHA256("WebAppData", botToken)
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();

    // 2. Calculated hash = HMAC_SHA256(secretKey, dataCheckString)
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    // Timing-safe comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(calculatedHash, "hex"),
      Buffer.from(hash, "hex")
    );

    if (!isValid) {
      return { isValid: false, error: "Invalid cryptographic signature" };
    }

    // Check expiration (86400 seconds / 24 hours)
    const authDate = parseInt(params.get("auth_date") || "0", 10);
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      return { isValid: false, error: "initData has expired (>24h)" };
    }

    const rawUser = params.get("user");
    const user: TelegramUser | undefined = rawUser ? JSON.parse(rawUser) : undefined;

    return {
      isValid: true,
      user,
      authDate,
    };
  } catch (err: any) {
    return {
      isValid: false,
      error: err.message || "Failed to validate initData",
    };
  }
}

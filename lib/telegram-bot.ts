/**
 * Telegram Bot API Client (Stars & Messaging)
 * Ref: https://core.telegram.org/bots/api
 */

const TELEGRAM_API_BASE = "https://api.telegram.org/bot";

export interface StarLabeledPrice {
  label: string;
  amount: number; // For Stars (XTR), amount is integer stars (e.g. 1 = 1 Star)
}

export interface CreateInvoiceLinkParams {
  title: string;
  description: string;
  payload: string;
  currency: string; // "XTR" for Telegram Stars
  prices: StarLabeledPrice[];
  provider_token?: string; // Empty string for Telegram Stars!
}

export class TelegramBotClient {
  private token: string;

  constructor(token?: string) {
    this.token = token || process.env.TELEGRAM_BOT_TOKEN || "";
    if (!this.token) {
      console.warn("[TelegramBotClient] Warning: TELEGRAM_BOT_TOKEN is not set.");
    }
  }

  private async callApi<T = any>(method: string, body: Record<string, any>): Promise<T> {
    if (!this.token) {
      throw new Error("TELEGRAM_BOT_TOKEN is required to call Telegram API");
    }

    const res = await fetch(`${TELEGRAM_API_BASE}${this.token}/${method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!data.ok) {
      throw new Error(`Telegram API error [${method}]: ${data.description || "Unknown error"}`);
    }

    return data.result;
  }

  /**
   * Generates a Telegram Stars Invoice Link
   * For Stars, currency must be "XTR" and provider_token must be empty string.
   */
  async createStarsInvoiceLink(params: {
    title: string;
    description: string;
    payload: string;
    stars: number;
  }): Promise<string> {
    return this.callApi<string>("createInvoiceLink", {
      title: params.title,
      description: params.description,
      payload: params.payload,
      provider_token: "", // Required to be empty for Stars
      currency: "XTR", // Telegram Stars currency code
      prices: [
        {
          label: params.title,
          amount: params.stars,
        },
      ],
    });
  }

  /**
   * Answers a pre_checkout_query.
   * CRITICAL: Must respond with ok=true within 10 seconds or Telegram cancels the payment!
   */
  async answerPreCheckoutQuery(preCheckoutQueryId: string, ok: boolean, errorMessage?: string): Promise<boolean> {
    return this.callApi<boolean>("answerPreCheckoutQuery", {
      pre_checkout_query_id: preCheckoutQueryId,
      ok,
      error_message: errorMessage,
    });
  }

  /**
   * Sends a message to a chat with optional inline keyboard (e.g. Mini App launch button)
   */
  async sendMessage(params: {
    chat_id: number | string;
    text: string;
    reply_markup?: any;
    parse_mode?: "Markdown" | "MarkdownV2" | "HTML";
  }): Promise<any> {
    return this.callApi("sendMessage", params);
  }
}

export const telegramBot = new TelegramBotClient();

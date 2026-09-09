# NODE 04: Tech Context (The Dependency Tree)

## Tech Stack
- **Framework:** Next.js 14+ (App Router), React 18/19, TypeScript 5+.
- **Styling:** Tailwind CSS (configured for dark-mode default and Telegram CSS variables: `var(--tg-theme-bg-color)`, `var(--tg-theme-text-color)`, etc.).
- **Container SDK:** Telegram WebApp SDK (`core.telegram.org/bots/webapps`).
- **Database & Auth Client:** Supabase (`@supabase/supabase-js`).
- **Payments:**
  - Telegram Stars API (`sendInvoice`, `createInvoiceLink`).
  - TON Connect SDK (`@tonconnect/ui-react`).
- **AI Inference Engine:** OpenRouter API (`openrouter.ai/docs`) with high-throughput / uncensored models (`Nous-Hermes-2-Mixtral`, `Llama-3-70b-8192` via Groq).
- **Vision & GPU Generation:** Fal.ai client (`@fal-ai/serverless-client`).
- **Ad Engine:** Adsgram SDK (`adsgram.ai`).
- **Hosting & CI/CD:** Vercel Edge / Serverless Functions.

## Environment Variables & Secrets Required
- `TELEGRAM_BOT_TOKEN`: Secret bot token from BotFather for HMAC validation and Telegram API calls.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase backend service role key for trusted user and payment mutations.
- `OPENROUTER_API_KEY`: OpenRouter bearer token for LLM routing.
- `FAL_KEY`: Fal.ai API key for image synthesis.
- `ADSGRAM_BLOCK_ID`: Rewarded video ad block identifier.
- `TON_WALLET_ADDRESS`: Treasury address for Web3 payments.

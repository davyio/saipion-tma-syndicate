# NODE 03: System Patterns (The Infrastructure)

## System Architecture
- **Unified Next.js Monorepo:** Single Next.js (App Router) project deployed to Vercel edge/serverless hosting to avoid multi-project quota limits.
- **The Omni-Hook Protocol:** All Telegram incoming webhooks ingest at a unified endpoint (`/api/telegram-handler`), which verifies the bot token and delegates payload routing internally to modular app services.
- **TMA Client Container:** Dark-mode mobile-first Telegram Mini Apps leveraging `@telegram-apps/sdk` / Telegram WebApp script.

## Database Schema (Supabase PostgreSQL)
- `users`: `id` (bigint, Telegram User ID), `username` (text), `first_name` (text), `last_name` (text), `language_code` (text), `is_premium` (boolean), `created_at` (timestamptz), `last_seen_at` (timestamptz).
- `payments`: `id` (uuid), `telegram_user_id` (bigint), `app_module` (text), `amount` (numeric), `currency` (text: 'XTR' for Stars, 'TON', 'USD'), `telegram_payment_charge_id` (text), `provider_payment_charge_id` (text), `status` (text), `created_at` (timestamptz).
- `app_sessions`: `id` (uuid), `telegram_user_id` (bigint), `app_module` (text), `state_payload` (jsonb), `updated_at` (timestamptz).

## API Routing Structures
- `/api/telegram-handler`: Unified bot webhook interceptor and command dispatcher.
- `/api/auth/validate`: Validates Telegram `initData` HMAC-SHA256 signature and synchronizes user row in Supabase.
- `/api/stars/create-invoice`: Issues Telegram Stars invoice links.
- `/api/stars/webhook`: Ingests `pre_checkout_query` and `successful_payment` updates.
- `/api/modules/[moduleName]/*`: Isolated backend endpoints for micro-SaaS logic.

## Design Patterns & Uniformity Guidelines
- **Stateless Compute:** Zero in-memory cache/arrays in Node/Edge functions. State is immediately read from and committed to Supabase.
- **Zero-Scratch Boilerplate Pattern:** High-reuse component and hook architecture (`useTelegramAuth`, `useTelegramStars`, `useSupabase`).
- **Fail-Fast & The 24-Hour Guillotine:** Clean separation between core routing logic and module UI to allow immediate recycling of dormant apps.

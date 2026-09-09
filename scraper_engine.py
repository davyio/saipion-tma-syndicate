#!/usr/bin/env python3
"""THE SAIPION SYNDICATE: MTPROTO TELEGRAM SCRAPING & INTEL ENGINE

Bypasses Bot API privacy boundaries to extract 100% of historical group messages,
scrape participant lists for cold outreach/lead generation, and monitor live keywords.
"""

import asyncio
import csv
import json
import os
import sys
from datetime import datetime
from telethon import TelegramClient
from telethon.tl.types import UserStatusOnline, UserStatusOffline, UserStatusRecently

# MTProto Credentials (from https://my.telegram.org)
API_ID = int(os.getenv("TELEGRAM_API_ID", "1234567"))
API_HASH = os.getenv("TELEGRAM_API_HASH", "your_api_hash_here")
SESSION_NAME = "syndicate_scraper_session"


class TelegramGroupScraper:
    def __init__(self, api_id: int, api_hash: str, session_name: str = SESSION_NAME):
        self.client = TelegramClient(session_name, api_id, api_hash)

    async def start(self):
        await self.client.start()
        me = await self.client.get_me()
        print(f"[+] Authenticated as: {me.first_name} (@{me.username or 'no_handle'})")

    async def scrape_group_messages(
        self,
        group_identifier: str,
        limit: int = 1000,
        output_file: str = "scraped_messages.csv"
    ):
        """Scrapes historical messages from any public or joined group/channel.
        """
        print(f"[*] Fetching target entity: {group_identifier}...")
        entity = await self.client.get_entity(group_identifier)
        title = getattr(entity, 'title', group_identifier)
        print(f"[+] Connected to: '{title}'. Scraping up to {limit} messages...")

        messages_data = []

        async for msg in self.client.iter_messages(entity, limit=limit):
            sender = await msg.get_sender()
            sender_id = sender.id if sender else None
            sender_username = getattr(sender, 'username', '') or ''
            sender_name = f"{getattr(sender, 'first_name', '')} {getattr(sender, 'last_name', '')}".strip()

            messages_data.append({
                "message_id": msg.id,
                "date": msg.date.isoformat() if msg.date else "",
                "sender_id": sender_id,
                "sender_username": sender_username,
                "sender_name": sender_name,
                "text": msg.raw_text or "",
                "views": getattr(msg, 'views', 0) or 0,
                "forwards": getattr(msg, 'forwards', 0) or 0,
                "reply_to": msg.reply_to_msg_id if msg.reply_to else None,
            })

        # Export to CSV
        if messages_data:
            keys = messages_data[0].keys()
            with open(output_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=keys)
                writer.writeheader()
                writer.writerows(messages_data)
            print(f"[+] Successfully exported {len(messages_data)} messages to: {output_file}")
        else:
            print("[-] No messages found or group is empty.")

        return messages_data

    async def scrape_group_members(
        self,
        group_identifier: str,
        output_file: str = "scraped_members.csv"
    ):
        """Extracts the entire member list of a group (usernames, user IDs, status)

        for targeted outreach and tollbooth user acquisition.
        """
        print(f"[*] Extracting member roster for: {group_identifier}...")
        entity = await self.client.get_entity(group_identifier)

        participants = await self.client.get_participants(entity)
        members_data = []

        for user in participants:
            if user.bot:
                continue  # Filter out bots

            members_data.append({
                "user_id": user.id,
                "username": user.username or "",
                "first_name": user.first_name or "",
                "last_name": user.last_name or "",
                "is_premium": getattr(user, 'premium', False),
                "verified": getattr(user, 'verified', False),
                "restricted": getattr(user, 'restricted', False),
            })

        with open(output_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=members_data[0].keys() if members_data else ["user_id"])
            writer.writeheader()
            writer.writerows(members_data)

        print(f"[+] Exported {len(members_data)} real users to: {output_file}")
        return members_data

    async def live_keyword_sentinel(self, target_chats: list, keywords: list):
        """Streams real-time messages from target chats matching specific intent keywords

        (e.g., 'buy', 'looking for', 'scam', 'problem', 'airdrop').
        """
        from telethon import events

        print(f"[*] Sentinel active across {len(target_chats)} groups for keywords: {keywords}")

        @self.client.on(events.NewMessage(chats=target_chats))
        async def handler(event):
            text = event.raw_text.lower()
            for kw in keywords:
                if kw.lower() in text:
                    sender = await event.get_sender()
                    sender_handle = f"@{sender.username}" if getattr(sender, 'username', None) else f"ID:{sender.id}"
                    print(f"\n🚨 [MATCH FOUND] Keyword: '{kw}' | Sender: {sender_handle}")
                    print(f"Group: {event.chat.title if hasattr(event.chat, 'title') else event.chat_id}")
                    print(f"Message: {event.raw_text}\n")
                    break

        await self.client.run_until_disconnected()


async def main():
    if len(sys.argv) < 3:
        print("Usage:")
        print("  python3 scraper_engine.py messages <group_username_or_link> [limit]")
        print("  python3 scraper_engine.py members <group_username_or_link>")
        return

    action = sys.argv[1]
    target = sys.argv[2]
    limit = int(sys.argv[3]) if len(sys.argv) > 3 else 500

    scraper = TelegramGroupScraper(API_ID, API_HASH)
    await scraper.start()

    if action == "messages":
        await scraper.scrape_group_messages(target, limit=limit)
    elif action == "members":
        await scraper.scrape_group_members(target)
    else:
        print(f"Unknown action: {action}")


if __name__ == "__main__":
    asyncio.run(main())

"use client";

import { useEffect, useState, useCallback } from "react";
import { TelegramUser, TelegramWebApp } from "@/types/telegram";

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initData, setInitData] = useState<string>("");
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isTma, setIsTma] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      setWebApp(tg);
      setInitData(tg.initData || "");
      setUser(tg.initDataUnsafe?.user || null);
      setIsReady(true);
      setIsTma(Boolean(tg.initData || tg.initDataUnsafe?.user));
    } else {
      setIsReady(true);
      setIsTma(false);
    }
  }, []);

  const triggerHaptic = useCallback(
    (style: "light" | "medium" | "heavy" = "medium") => {
      try {
        webApp?.HapticFeedback?.impactOccurred(style);
      } catch (e) {
        // Fallback for non-TMA browsers
      }
    },
    [webApp]
  );

  const triggerNotificationHaptic = useCallback(
    (type: "error" | "success" | "warning") => {
      try {
        webApp?.HapticFeedback?.notificationOccurred(type);
      } catch (e) {
        // Fallback for non-TMA browsers
      }
    },
    [webApp]
  );

  const openInvoice = useCallback(
    (
      url: string,
      callback?: (status: "paid" | "cancelled" | "failed" | "pending") => void
    ) => {
      if (webApp?.openInvoice) {
        webApp.openInvoice(url, callback);
      } else {
        console.warn("[useTelegram] openInvoice called outside Telegram WebApp. Opening in window.");
        window.open(url, "_blank");
      }
    },
    [webApp]
  );

  return {
    webApp,
    user,
    initData,
    isReady,
    isTma,
    triggerHaptic,
    triggerNotificationHaptic,
    openInvoice,
  };
}

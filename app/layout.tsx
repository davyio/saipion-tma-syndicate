import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Saipion Syndicate | TMA Cash-Flow Engine",
  description: "Hyper-lean Telegram Mini App Tollbooth Arsenal",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#090d16",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-tg-bg text-tg-text antialiased min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
        <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}

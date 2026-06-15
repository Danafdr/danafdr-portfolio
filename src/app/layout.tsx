import type { Metadata } from "next";
import { Playfair_Display, DM_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "block",
  variable: "--font-playfair",
  adjustFontFallback: true,
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "block",
  variable: "--font-mono",
  adjustFontFallback: true,
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  display: "block",
  variable: "--font-bebas",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Danafdr — Web Dev, Video Editor, Mograph",
  description: "Web Dev · Video Editing · Motion Graphics",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import dynamic from "next/dynamic";
import TransitionProvider from "../components/TransitionProvider";
import Intro from "../components/Intro";
import CursorHider from "../components/CursorHider";
import Cursor from "../components/Cursor";
import SmoothScroll from "../components/SmoothScroll";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${dmMono.variable} ${bebasNeue.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: '@media(hover:hover) and (pointer:fine){*{cursor:none!important}}' }} />
      </head>
      <body suppressHydrationWarning>
        <SmoothScroll />
        <CursorHider />
        <Cursor />
        <Intro />
        <div className="max-w-[1920px] mx-auto relative bg-paper shadow-2xl min-h-screen">
          <TransitionProvider>
            {children}
          </TransitionProvider>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Danafdr — Web Dev, Video Editor, Mograph",
  description: "Web Dev · Video Editing · Motion Graphics",
};

import CustomCursor from "../components/CustomCursor";
import TransitionProvider from "../components/TransitionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400;1,700&family=DM+Mono:wght@300;400&family=Bebas+Neue&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <CustomCursor />
        <TransitionProvider>
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}

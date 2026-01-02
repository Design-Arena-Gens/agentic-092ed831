import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nova Wardrobe Concierge",
  description:
    "AI-powered lead generation agent that captures shopper intent for modern clothing brands.",
  metadataBase: new URL("https://agentic-092ed831.vercel.app"),
  openGraph: {
    title: "Nova Wardrobe Concierge",
    description:
      "Convert curious scrollers into styled leads with a tailored concierge for clothing brands.",
    url: "https://agentic-092ed831.vercel.app",
    siteName: "Nova Wardrobe",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nova Wardrobe Concierge",
    description:
      "Lead-gen agent that maps style signals, budgets, and intent in under 60 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptForge - AI Prompt Generator for Print-on-Demand",
  description: "Generate AI image prompts for print-on-demand personalized products. Create optimized prompts for T-Shirts, Mugs, Posters, and more.",
  keywords: ["AI", "prompt generator", "print-on-demand", "Midjourney", "DALL-E", "T-Shirt design", "POD"],
  authors: [{ name: "PromptForge" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "PromptForge - AI Prompt Generator",
    description: "Generate AI image prompts for print-on-demand personalized products",
    url: "https://chat.z.ai",
    siteName: "PromptForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge - AI Prompt Generator",
    description: "Generate AI image prompts for print-on-demand personalized products",
  },
};

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}

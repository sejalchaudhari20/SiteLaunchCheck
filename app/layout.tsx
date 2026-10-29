import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SiteLaunchCheck — Catch Issues Before You Launch",
  description: "Check your website for broken links, forms, images, SEO issues, accessibility problems, mobile issues and other launch-critical problems before delivery.",
  openGraph: {
    title: "SiteLaunchCheck — Catch Issues Before You Launch",
    description: "Check your website for broken links, forms, images, SEO issues, accessibility problems, mobile issues and other launch-critical problems before delivery.",
    type: "website",
  }
};

import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning className={`${inter.variable} ${manrope.variable} antialiased text-text bg-background`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

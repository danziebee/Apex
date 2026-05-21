import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
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
  title: "Apex — Growth Operations",
  description:
    "Predictable, scalable revenue engines powered by smart systems, high-performance teams, and offers built to convert.",
  openGraph: {
    title: "Apex — Growth Operations",
    siteName: "Apex",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <SmoothScroll>
          <AmbientBackground />
          <Nav />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FixturesProvider } from "@/contexts/FixturesContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Banga.ai - AI Football Predictions",
  description: "Get AI-powered football predictions from multiple providers. Accurate match predictions, scorelines, and betting tips.",
  keywords: "football predictions, AI predictions, soccer betting, match predictions, football AI",
  authors: [{ name: "Banga.ai" }],
  openGraph: {
    title: "Banga.ai - AI Football Predictions",
    description: "Get AI-powered football predictions from multiple providers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-950 text-white`}
        suppressHydrationWarning={true}
      >
        <FixturesProvider>
          {children}
        </FixturesProvider>
      </body>
    </html>
  );
}

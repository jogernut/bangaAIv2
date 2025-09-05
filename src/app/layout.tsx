import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FixturesProvider } from "@/contexts/FixturesContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Banga.ai - Advanced AI Football Predictions & Match Analysis",
  description: "Get the most accurate football predictions powered by multiple AI models including Gemini, ChatGPT, Grok, and ML. Real-time match predictions, scorelines, over/under tips, and BTTS analysis for professional betting.",
  keywords: [
    "football predictions",
    "AI soccer predictions",
    "football betting tips",
    "match predictions",
    "soccer AI analysis",
    "over under predictions",
    "BTTS predictions",
    "football score predictions",
    "Gemini AI predictions",
    "ChatGPT football tips",
    "Grok soccer predictions",
    "ML football analysis",
    "live match predictions",
    "football betting odds",
    "soccer match analysis",
    "AI powered betting",
    "football prediction accuracy"
  ],
  authors: [{ name: "Banga.ai", url: "https://banga.ai" }],
  creator: "Banga.ai",
  publisher: "Banga.ai",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://banga.ai"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Banga.ai - Advanced AI Football Predictions & Match Analysis",
    description: "Get the most accurate football predictions powered by multiple AI models. Real-time match predictions, scorelines, and professional betting tips.",
    url: "https://banga.ai",
    siteName: "Banga.ai",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Banga.ai - AI Football Predictions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Banga.ai - Advanced AI Football Predictions",
    description: "Get the most accurate football predictions powered by multiple AI models. Real-time match predictions and betting tips.",
    images: ["/twitter-image.png"],
    creator: "@banga_ai",
    site: "@banga_ai",
  },
  category: "Sports",
  classification: "Sports Betting & Predictions",
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

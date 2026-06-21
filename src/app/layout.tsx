import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Global Horse Auction — Curated. Verified. Global.",
    template: "%s | Global Horse Auction",
  },
  description:
    "The world's premier online horse auction platform. Exceptional horses for ambitious riders, professional stables, and serious investors. Live & online bidding worldwide.",
  keywords: [
    "horse auction",
    "buy horses online",
    "sport horses",
    "dressage horses",
    "jumping horses",
    "horse breeding",
    "global horse auction",
  ],
  openGraph: {
    title: "Global Horse Auction",
    description:
      "Curated. Verified. Global. — The world's premier horse auction platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-[#060c1d] text-[#f0ead8]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

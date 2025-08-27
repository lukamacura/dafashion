// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Fraunces } from "next/font/google";
import SiteHeader from "@/components/layout/site-header";
import Footer from "@/components/layout/footer";
import Announcement from "@/components/sections/announcement";
import { CartProvider } from "@/components/cart/cart-provider";
import { DNAPopupCTALite } from "@/components/DNAPopupCTA";


// SATOSHI (lokalno iz src/app/fonts)
const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Medium.woff2",  weight: "500", style: "normal" },
    { path: "./fonts/Satoshi-Bold.woff2",    weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

// FRAUNCES (Google)
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],             // po želji dodaj i "800"
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = { title: "D&A Fashion" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="sr"
className={`${satoshi.variable} ${fraunces.variable} font-sans`}
    >
      <body className="min-h-screen bg-[#151511] text-neutral-100 antialiased">
<DNAPopupCTALite delayMs={5000} ctaHref="/collection" />

                    <CartProvider>

        <Announcement />

        <SiteHeader />
        <main className="pt-38">  {/* 👈 ovo gura sadržaj ispod hedera */}
          {children}        
        </main>
              <Footer />
          </CartProvider>

      </body>        


    </html>
  );
}

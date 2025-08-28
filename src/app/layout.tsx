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
  weight: ["600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "D&A Fashion – Markirana garderoba bez cene koja boli",
  description:
    "D&A Fashion – Obuci Hugo, Ralph Lauren i druge brendove. Markirana garderoba koju prepoznaju svi, bez cene koja boli. Izgledaj kao šef, a samo ti znaš koliko si platio.",
  keywords: [
    "D&A Fashion",
    "odeća online shop",
    "Hugo majice",
    "Ralph Lauren prsluk",
    "markirana garderoba",
    "odeća Srbija",
  ],
  icons: {
    icon: "/logo.png", // 32x32 ili 48x48
    shortcut: "/logo.png",
    apple: "/logo.png", // 180x180
  },
  openGraph: {
    title: "D&A Fashion – Markirana garderoba bez cene koja boli",
    description:
      "Obuci Hugo, Ralph Lauren i druge brendove. Markirana garderoba koju prepoznaju svi, bez cene koja boli.",
    url: "https://www.dafashion.store",
    siteName: "D&A Fashion",
    images: [
      {
        url: "/social-cover.png", // 👈 1200x630px slika za društvene mreže
        width: 1200,
        height: 630,
        alt: "D&A Fashion – Markirana garderoba",
      },
    ],
    locale: "sr_RS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "D&A Fashion – Markirana garderoba bez cene koja boli",
    description:
      "Obuci Hugo, Ralph Lauren i druge brendove. Markirana garderoba koju prepoznaju svi, bez cene koja boli.",
    images: ["/social-cover.png"],
  },
};

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
          <main className="pt-38">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

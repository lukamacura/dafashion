"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export default function SiteHeader() {
  const { setOpen, items } = useCart();
  const count = items.reduce((s, it) => s + it.qty, 0);

  return (
    <header className="fixed left-0 w-full z-40 bg-[#151511]/95 backdrop-blur-sm border-b border-neutral-800 top-10">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="D&A Fashion" width={100} height={28} priority />
        </Link>

        <nav className="hidden md:flex font-satoshi font-bold items-center gap-8 text-[15px]">
          <Link href="/">Početna</Link>
          <Link href="/collection">Kolekcija</Link>
          {/* ⬇️ anchor linkovi za skrol */}
          <a href="#testimonials" className="cursor-pointer">Recenzije</a>
          <a href="#faq" className="cursor-pointer">FAQ</a>
        </nav>

        <button aria-label="Korpa" onClick={() => setOpen(true)} className="relative">
          <ShoppingBag className="size-8" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 text-xs font-bold bg-[#f0b33a] text-[#151511] rounded-full h-5 w-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

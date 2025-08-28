"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { useEffect, useState } from "react";

export default function SiteHeader() {
  const { setOpen, items } = useCart();
  const count = items.reduce((s, it) => s + it.qty, 0);
  const [mobileOpen, setMobileOpen] = useState(false);

  // prevent body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "auto";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed left-0 w-full z-40 bg-[#151511]/95 backdrop-blur-sm border-b border-neutral-800 top-10">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        {/* Left: mobile hamburger or desktop logo */}
        <div className="flex items-center">
          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Zatvori meni" : "Otvori meni"}
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-neutral-800/60 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            {mobileOpen ? <X className="size-7" /> : <Menu className="size-7" />}
          </button>

          {/* Desktop logo */}
          <Link href="/" className="hidden md:flex items-center gap-3">
            <Image src="/logo.png" alt="D&A Fashion" width={100} height={28} priority />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex font-satoshi font-bold items-center gap-8 text-[15px]">
          <Link href="/">Početna</Link>
          <Link href="/collection">Kolekcija</Link>
          <Link href="/#testimonials" className="cursor-pointer">Kolekcija</Link>
          <Link href="/#faq" className="cursor-pointer">Kolekcija</Link>
        </nav>

        {/* Cart */}
        <button
          aria-label="Korpa"
          onClick={() => setOpen(true)}
          className="relative inline-flex items-center justify-center rounded-lg p-1 hover:bg-neutral-800/60 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          <ShoppingBag className="size-8" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 text-xs font-bold bg-[#f0b33a] text-[#151511] rounded-full h-5 w-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Mobile nav drawer */}
      <div
        className={`fixed inset-0 z-[39] md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } bg-black/50`}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 bottom-0 z-[40] w-[80%] max-w-xs bg-[#151511] border-r border-neutral-800 shadow-2xl md:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button inside drawer */}
        <div className="absolute top-4 right-4">
          <button
            type="button"
            aria-label="Zatvori meni"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-neutral-800/60s focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <X className="size-6" />
          </button>
        </div>

        <nav className="pt-20 pb-10 px-6 flex flex-col gap-4 font-satoshi font-bold text-lg">
          <MobileLink href="/" onClick={() => setMobileOpen(false)}>Početna</MobileLink>
          <MobileLink href="/collection" onClick={() => setMobileOpen(false)}>Kolekcija</MobileLink>
          <MobileLink href="/#testimonials" onClick={() => setMobileOpen(false)}>Recenzije</MobileLink>
          <MobileLink href="/#faq" onClick={() => setMobileOpen(false)}>FAQ</MobileLink>
        </nav>
      </div>
    </header>
  );
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  const isHash = href.startsWith("#");
  const classes =
    "block rounded-xl px-4 py-3 text-[15px] font-satoshi font-bold text-neutral-100 bg-neutral-900/90 hover:bg-neutral-800/80 border border-neutral-800";

  if (isHash) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} onClick={onClick}>
      {children}
    </Link>
  );
}

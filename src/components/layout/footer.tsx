"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#151511] text-neutral-300 border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16 grid gap-8 md:grid-cols-3 items-center">
        
        {/* Logo */}
        <div className="flex justify-center md:justify-start">
          <Image
            src="/logo.png"
            alt="D&A Fashion"
            width={150}
            height={50}
            priority
          />
        </div>

        {/* Navigacija */}
        <nav className="flex justify-center gap-6 font-satoshi font-medium text-sm">
          <Link href="/" className="hover:text-white transition">Početna</Link>
          <Link href="/products" className="hover:text-white transition">Kolekcija</Link>
          <Link href="/#testimonials" className="hover:text-white transition">Recenzije</Link>
          <Link href="/#faq" className="hover:text-white transition">FAQ</Link>
        </nav>

        {/* Social */}
        <div className="flex justify-center md:justify-end">
          <Link
            href="https://www.instagram.com/dafashion.rs/" // promeni u pravi link
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full border border-neutral-700 hover:border-neutral-400 transition"
          >
            <Instagram className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-neutral-800 py-6 text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} D&A Fashion. Sva prava zadržana.
      </div>
    </footer>
  );
}

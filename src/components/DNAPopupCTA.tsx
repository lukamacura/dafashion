"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * DNAPopupCTALite (enhanced, mobile-safe)
 * - Mobile-first: overlay se scroll-uje, dialog ima max-h i unutrašnji scroll
 * - Sticky "×" da je uvek dostupan
 * - Body scroll lock dok je otvoren (iOS/Android)
 * - Escape/backdrop to close, vraćanje fokusa
 * - Frequency cap: session/daily
 * - Responsive image sizing bez CLS
 */
export function DNAPopupCTALite({
  delayMs = 3000,
  ctaHref = "/collection",
  storageKey = "dna_popup_seen_today",
  frequency: _frequency = "session", // "session" | "daily" | "always"
}: {
  delayMs?: number;
  ctaHref?: string;
  storageKey?: string;
  frequency?: "session" | "daily" | "always";
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const lastActiveEl = useRef<HTMLElement | null>(null);

  // Frequency cap + odloženo otvaranje
  useEffect(() => {
    if (_frequency !== "always") {
      const now = new Date();
      if (_frequency === "session" && sessionStorage.getItem(storageKey)) return;
      if (_frequency === "daily") {
        const stamped = localStorage.getItem(storageKey);
        if (stamped && new Date(stamped).toDateString() === now.toDateString()) return;
      }
    }
    const t = setTimeout(() => {
      lastActiveEl.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    }, Math.max(0, delayMs));
    return () => clearTimeout(t);
  }, [delayMs, storageKey, _frequency]);

  const close = () => {
    setOpen(false);
    // restore focus
    setTimeout(() => lastActiveEl.current?.focus?.(), 0);
  };

  // ESC + body scroll lock
  useEffect(() => {
    if (!open) return;

    // lock body scroll (radi i na iOS)
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);

    // fokus prvi fokusabilan element
    const focusTarget = dialogRef.current?.querySelector<HTMLElement>(
      'a,button,[href],[tabindex]:not([tabindex="-1"])'
    );
    focusTarget?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [open]);

  // Mark as seen kada se otvori
  useEffect(() => {
    if (!open) return;
    if (_frequency === "session") {
      sessionStorage.setItem(storageKey, "1");
    } else if (_frequency === "daily") {
      localStorage.setItem(storageKey, new Date().toISOString());
    }
  }, [open, storageKey, _frequency]);

  if (!open) return null;

  return (
    <div
      ref={scrimRef}
      aria-hidden={!open}
      // Poravnanje gore na mobilu + scroll; centrirano tek od sm:
      className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center
                 bg-black/60 p-3 sm:p-4 overflow-y-auto overscroll-contain"
      // Klik na pozadinu zatvara (target mora biti overlay, ne unutrašnjost)
      onMouseDown={(e) => {
        if (e.target === scrimRef.current) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Specijalna ponuda"
        // max-h u odnosu na 100dvh; unutrašnji scroll; blage margine
        className="relative w-full max-w-[680px]
                   my-4 sm:my-6 rounded-2xl sm:rounded-3xl
                   bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-50
                   shadow-2xl outline-none
                   max-h-[calc(100dvh-2rem)] overflow-y-auto"
      >
        {/* Sticky header sa × uvek vidljivim */}
        <div className="sticky top-0 z-10 flex justify-end p-2 sm:p-3
                        bg-gradient-to-b from-zinc-900 to-transparent">
          <button
            onClick={close}
            aria-label="Zatvori"
            className="grid h-11 w-11 place-items-center rounded-full text-zinc-300
                       hover:bg-white/10 hover:text-white focus:outline-none
                       focus:ring-2 focus:ring-white/40"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 pt-2 sm:px-8 sm:pt-2 sm:pb-8">
          <div className="flex flex-col items-center text-center">
            <p className="text-zinc-300 font-satoshi text-base sm:text-lg">
              Hoćeš da propustiš Balmain majicu za 2400 RSD?
            </p>
            <h2 className="mt-1 text-2xl sm:text-4xl md:text-5xl font-extrabold font-frances tracking-tight">
              <span role="img" aria-label="vatra">🔥</span> Naravno da nećeš!!!
            </h2>

            {/* Image */}
            <div className="mt-5 sm:mt-6 flex justify-center">
              <Image
                src="/products/popup.png"
                alt="Balmain majica"
                width={320}
                height={380}
                sizes="(max-width: 640px) 70vw, 320px"
                className="rounded-2xl shadow-lg object-contain w-[min(70vw,320px)] h-auto"
                priority
              />
            </div>

            {/* CTA */}
            <Link
              href={ctaHref}
              className="mt-6 sm:mt-8 inline-flex w-full sm:w-auto items-center justify-center
                         rounded-2xl px-6 sm:px-8 py-4 text-lg sm:text-xl font-satoshi font-semibold
                         text-white bg-gradient-to-r from-amber-700 to-purple-500
                         shadow-lg hover:opacity-95 focus:outline-none focus:ring-2
                         focus:ring-white/40 active:scale-[0.99]"
            >
              Pogledaj kolekciju
            </Link>
          </div>

          {/* Perks grid */}
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            <Perk
              title="Isporuka"
              sub="48h MAX"
              icon={
                <svg viewBox="0 0 24 24" className="h-8 w-8 sm:h-10 sm:w-10 fill-current opacity-90" aria-hidden>
                  <path d="M3 7l9 4 9-4-9-4-9 4zm0 3v7l9 4V14L3 10zm20 0l-9 4v7l9-4v-7z" />
                </svg>
              }
            />
            <Perk
              title="Zamena"
              sub="FREE"
              icon={
                <svg viewBox="0 0 24 24" className="h-8 w-8 sm:h-10 sm:w-10 fill-current opacity-90" aria-hidden>
                  <path d="M7 7h7V4l5 5-5 5v-3H7V7zm10 10H10v3l-5-5 5-5v3h7v4z" />
                </svg>
              }
            />
            <Perk
              title="Garancija"
              sub="100%"
              icon={
                <svg viewBox="0 0 24 24" className="h-8 w-8 sm:h-10 sm:w-10 fill-current opacity-90" aria-hidden>
                  <path d="M18 4V2H6v2H3v3c0 2.8 2.2 5 5 5 .9 1.2 2.2 2 3.7 2H12c1.5 0 2.8-.8 3.7-2 2.8 0 5-2.2 5-5V4h-2zM5 7V6h1V5h1v3c0 .7.1 1.3.4 1.9C6 9.6 5 8.4 5 7zm14 0c0 1.4-1 2.6-2.4 2.9.3-.6.4-1.2.4-1.9V5h1v1h1v1zM8 14h8c0 1.8-1.2 3.3-3 3.8V20h2v2H9v-2h2v-2.2c-1.8-.5-3-2-3-3.8z" />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Perk({
  title,
  sub,
  icon,
}: {
  title: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 rounded-2xl bg-white/5 p-3 sm:p-4">
      <div className="text-amber-400 shrink-0">{icon}</div>
      <div>
        <div className="text-xs sm:text-sm text-zinc-300">{title}</div>
        <div className="text-xl sm:text-2xl font-frances font-extrabold tracking-tight">{sub}</div>
      </div>
    </div>
  );
}

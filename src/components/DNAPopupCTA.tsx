"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function DNAPopupCTALite({
  delayMs = 5000,
  ctaHref = "/collection",
}: {
  delayMs?: number;
  ctaHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setOpen(true);
    }, Math.max(0, delayMs));
    return () => clearTimeout(t);
  }, [delayMs]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
      onMouseDown={(e) => {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      }}
    >
      <div
        ref={ref}
        className="relative w-[min(940px,calc(100vw-32px))] rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 sm:p-10 text-zinc-50 shadow-2xl"
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Zatvori"
          className="absolute right-3 top-3 h-10 w-10 rounded-full text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          ×
        </button>

        {/* Glavni sadržaj centriran */}
        <div className="flex flex-col items-center text-center">
          <p className="text-zinc-300 font-satoshi text-lg sm:text-xl">
            Hoćeš da propustiš Balmain majicu za 2400 RSD?
          </p>
          <h2 className="mt-1 text-3xl sm:text-5xl md:text-6xl font-extrabold font-frances tracking-tight">
            <span role="img" aria-label="vatra">
              🔥
            </span>{" "}
            Naravno da nećeš!!!
          </h2>

          {/* Slika proizvoda */}
          <div className="mt-6 flex justify-center">
            <Image
              src="/products/popup.png"
              alt="Balmain majica"
              width={280}
              height={320}
              className="rounded-2xl shadow-lg object-contain"
              priority
            />
          </div>

          {/* CTA dugme */}
          <a
            href={ctaHref}
            className="mt-8 inline-flex w-full sm:w-auto items-center justify-center rounded-2xl px-8 py-4 text-xl font-satoshi font-semibold text-white bg-gradient-to-r from-amber-700 to-purple-500 shadow-lg hover:opacity-95"
          >
            Pogledaj kolekciju
          </a>
        </div>

        {/* Benefiti (ostaju u gridu levo/desno) */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Perk
            title="Isporuka"
            sub="48h MAX"
            icon={
              <svg
                viewBox="0 0 24 24"
                className="h-10 w-10 fill-current opacity-90"
                aria-hidden
              >
                <path d="M3 7l9 4 9-4-9-4-9 4zm0 3v7l9 4V14L3 10zm20 0l-9 4v7l9-4v-7z" />
              </svg>
            }
          />
          <Perk
            title="Zamena"
            sub="FREE"
            icon={
              <svg
                viewBox="0 0 24 24"
                className="h-10 w-10 fill-current opacity-90"
                aria-hidden
              >
                <path d="M7 7h7V4l5 5-5 5v-3H7V7zm10 10H10v3l-5-5 5-5v3h7v4z" />
              </svg>
            }
          />
          <Perk
            title="Garancija"
            sub="100%"
            icon={
              <svg
                viewBox="0 0 24 24"
                className="h-10 w-10 fill-current opacity-90"
                aria-hidden
              >
                <path d="M18 4V2H6v2H3v3c0 2.8 2.2 5 5 5 .9 1.2 2.2 2 3.7 2H12c1.5 0 2.8-.8 3.7-2 2.8 0 5-2.2 5-5V4h-2zM5 7V6h1V5h1v3c0 .7.1 1.3.4 1.9C6 9.6 5 8.4 5 7zm14 0c0 1.4-1 2.6-2.4 2.9.3-.6.4-1.2.4-1.9V5h1v1h1v1zM8 14h8c0 1.8-1.2 3.3-3 3.8V20h2v2H9v-2h2v-2.2c-1.8-.5-3-2-3-3.8z" />
              </svg>
            }
          />
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
    <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
      <div className="text-amber-400">{icon}</div>
      <div>
        <div className="text-sm text-zinc-300">{title}</div>
        <div className="text-2xl font-frances font-extrabold tracking-tight">
          {sub}
        </div>
      </div>
    </div>
  );
}

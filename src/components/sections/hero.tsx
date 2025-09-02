"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const brands = ["HUGO", "BALMAIN", "DIESEL", "AMIRI"];
  const [index, setIndex] = useState(0);

  // menja brend na svakih 2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % brands.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [brands.length]);

  return (
    <section className="bg-[#151511] text-neutral-100 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-12 md:pt-10 md:pb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT – copy */}
          <div>
            <h1 className="font-frances font-bold text-5xl md:text-6xl leading-[1.05]">
              Nosi{" "}
              <span className="relative inline-block min-w-[7ch] da-hero-accent">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={brands[index]}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-0 top-0"
                  >
                    {brands[index]}
                  </motion.span>
                </AnimatePresence>
                {/* transparent placeholder da se ne pomera layout */}
                <span className="invisible">{brands[0]}</span>
              </span>
              .<br />
              Plati trećinu.
            </h1>

            <p className="mt-5 font-satoshi text-neutral-300 text-lg max-w-xl">
              Markirana garderoba koju svi prepoznaju. Cena koju znaš samo ti.
            </p>

            {/* Social proof */}
            <div className="mt-6 flex items-center gap-3">
              <AvatarStack />
              <span className="text-sm text-neutral-300">
                <strong className="text-neutral-100">3000+</strong> ljudi redovno kupuje iz D&A
              </span>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Link
                href="/collection"
                className="font-semibold text-white bg-gradient-to-r from-amber-700 to-purple-500 shadow-lg font-satoshi px-12 py-6 rounded-xl hover:opacity-95 inline-block"
              >
                Pogledaj kolekciju
              </Link>
            </div>
          </div>

          {/* RIGHT – images cluster (RESPONSIVE FIX) */}
          <div className="relative h-[420px] md:h-[580px]">
            {/* Levi t-shirt */}
            <Image
              src="/hero/shirt-left.png"
              alt="AMIRI t-shirt"
              width={300}
              height={300}
              sizes="(max-width: 768px) 38vw, 300px"
              className="absolute left-1.5 sm:left-2 top-[200px] md:-top-[70px] opacity-80 object-contain -rotate-6 z-[1]"
              priority
            />
            {/* Desni t-shirt */}
            <Image
              src="/hero/shirt-right.png"
              alt="HUGO t-shirt"
              width={320}
              height={320}
              sizes="(max-width: 768px) 40vw, 320px"
              className="absolute right-1.5 sm:right-2 top-[200px] md:-top-[70px] opacity-80 object-contain rotate-6 z-[1]"
              priority
            />
            {/* Sredina – telefoni */}
            <div className="absolute inset-0 flex items-center justify-center z-[2]">
              <Image
                src="/hero/phones.png"
                alt="Chat dokaz"
                width={500}
                height={700}
                sizes="(max-width: 768px) 75vw, 500px"
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] scale-[0.92] md:scale-110"
                priority
              />
            </div>
          </div>
        </div>

        {/* Benefits row */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Benefit
            title="Isporuka"
            subtitle="48h MAX"
            icon={
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current" aria-hidden>
                <path d="M3 7l9 4 9-4-9-4-9 4zm0 3v7l9 4V14L3 10zm20 0l-9 4v7l9-4v-7z" />
              </svg>
            }
          />
          <Benefit
            title="Zamena"
            subtitle="FREE"
            icon={
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current" aria-hidden>
                <path d="M7 7h7V4l5 5-5 5v-3H7V7zm10 10H10v3l-5-5 5-5v3h7v4z" />
              </svg>
            }
          />
          <Benefit
            title="Garancija"
            subtitle="100%"
            icon={
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current" aria-hidden>
                <path d="M18 4V2H6v2H3v3c0 2.8 2.2 5 5 5 .9 1.2 2.2 2 3.7 2H12c1.5 0 2.8-.8 3.7-2 2.8 0 5-2.2 5-5V4h-2zM5 7V6h1V5h1v3c0 .7.1 1.3.4 1.9C6 9.6 5 8.4 5 7zm14 0c0 1.4-1 2.6-2.4 2.9.3-.6.4-1.2.4-1.9V5h1v1h1v1zM8 14h8c0 1.8-1.2 3.3-3 3.8V20h2v2H9v-2h2v-2.2c-1.8-.5-3-2-3-3.8z" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
}

function AvatarStack() {
  return (
    <div className="flex -space-x-3 items-center">
      {/* Avatari – lokalne slike radi brzine */}
      <Image
        src="/avatars/a1.webp"
        alt="Kupac 1"
        width={40}
        height={40}
        className="h-10 w-10 rounded-full ring-2 ring-[#0a0a0a] object-cover"
        priority={false}
      />
      <Image
        src="/avatars/a2.webp"
        alt="Kupac 2"
        width={40}
        height={40}
        className="h-10 w-10 rounded-full ring-2 ring-[#0a0a0a] object-cover"
      />
      <Image
        src="/avatars/a3.webp"
        alt="Kupac 3"
        width={40}
        height={40}
        className="h-10 w-10 rounded-full ring-2 ring-[#0a0a0a] object-cover"
      />

      {/* +3k badge – gradijent koji prati brand CTA */}
      <span
        className="
          h-10 w-10 shrink-0 rounded-full
          bg-gradient-to-br from-amber-700 to-purple-600
          ring-2 ring-[#0a0a0a]
          text-[11px] font-bold text-white
          flex items-center justify-center
          shadow-[0_6px_18px_rgba(0,0,0,0.35)]
        "
        aria-hidden
      >
        +3k
      </span>
    </div>
  );
}

function Benefit({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#121212] border border-neutral-800 rounded-2xl px-6 py-6 text-center flex flex-col items-center">
      {/* Ikonica centrirana */}
      <div className="flex items-center justify-center w-16 h-16 text-[#9C6615]">
        {icon}
      </div>

      <div className="mt-4 text-neutral-200 font-satoshi text-lg">{title}</div>
      <div className="mt-1 text-3xl font-extrabold font-frances tracking-wide">{subtitle}</div>
    </div>
  );
}

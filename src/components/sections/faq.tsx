"use client";

import { useState } from "react";

type QA = { q: string; a: string };
type Props = { items?: QA[]; title?: string };

const DEFAULTS: QA[] = [
  
  {
    q: "Šta ako mi ne odgovara veličina?",
    a: "Zamena je BESPLATNA u roku od 7 dana. Samo nam napiši poruku na Instagram ili Viber i šaljemo drugi broj.",
  },
  {
    q: "Koliko traje dostava?",
    a: "Isporuka je 24–48h kurirskom službom na teritoriji Srbije. Paket pratiš kodom koji dobiješ u poruci.",
  },
  {
    q: "Kako se vrši plaćanje?",
    a: "Plaćaš pouzećem kuriru nakon otvaranja paketa. Na zahtev, možemo poslati i link za online plaćanje karticom.",
  },
];

export default function FAQ({ items = DEFAULTS, title = "FAQ - česta pitanja" }: Props) {
  return (
    <section id="faq" className="bg-[#151511] text-neutral-100">
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
        <h2 className="font-frances text-3xl md:text-5xl font-extrabold text-center">
          {title}
        </h2>

        <div className="mt-8 space-y-4 font-satoshi">
          {items.map((item, idx) => (
            <FaqItem key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a }: QA) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="rounded-xl border border-neutral-600/70 bg-[#10100e]">
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c28f4b]/60 rounded-xl"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-medium text-[17px] md:text-[18px]">{q}</span>
        <Chevron open={open} />
      </button>

      {/* answer */}
      <div
        className={`grid overflow-hidden transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="px-5 pb-5 text-neutral-300 text-[15px] leading-relaxed min-h-0">
          {a}
        </div>
      </div>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full 
                  border border-neutral-600 bg-[#151511] transition-transform ${
                    open ? "rotate-180" : "rotate-0"
                  }`}
      aria-hidden="true"
    >
      {/* zlatni akcenat */}
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#f0b33a" strokeWidth="2">
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

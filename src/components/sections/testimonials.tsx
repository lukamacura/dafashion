"use client";

import Image from "next/image";

type Testimonial = {
  id: string;
  src: string;     // putanja iz /public (npr. "/testimonials/t1.jpg")
  alt?: string;
};

const items: Testimonial[] = [
  { id: "t1", src: "/testimonials/t1.webp", alt: "Razgovor kupca 1" },
  { id: "t2", src: "/testimonials/t2.webp", alt: "Razgovor kupca 2" },
  { id: "t3", src: "/testimonials/t3.webp", alt: "Razgovor kupca 3" },
  { id: "t4", src: "/testimonials/t4.webp", alt: "Razgovor kupca 4" },
  { id: "t5", src: "/testimonials/t5.webp", alt: "Razgovor kupca 5" },
  { id: "t6", src: "/testimonials/t6.webp", alt: "Razgovor kupca 6" },
  { id: "t7", src: "/testimonials/t7.webp", alt: "Razgovor kupca 7" },
  { id: "t8", src: "/testimonials/t8.webp", alt: "Razgovor kupca 8" },
  { id: "t9", src: "/testimonials/t9.webp", alt: "Razgovor kupca 9" },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#151511] text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">

        {/* Heading */}
        <div className="text-center">
          <h2 className="font-frances text-[clamp(28px,5vw,48px)] font-extrabold leading-tight">
            Nije reklama. Ovo su poruke kupaca.
          </h2>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <figure
  key={t.id}
  className="rounded-2xl border border-neutral-700 bg-[#0f0f0d]
             overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,.35)]
             transition transform-gpu hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,.45)]
             focus-within:ring-2 focus-within:ring-[#6ea8ff]/60"
>
  <div className="relative w-full h-80 bg-black">
    <Image
      src={t.src}
      alt={t.alt ?? "Screenshot poruke zadovoljnih kupaca"}
      fill
      className="object-contain"
      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
      priority={i < 3}
    />
  </div>
</figure>

          ))}
        </div>
      </div>
    </section>
  );
}

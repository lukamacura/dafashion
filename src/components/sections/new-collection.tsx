"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider"; // ✅ global cart
import { PRODUCTS, rsd, Product } from "@/lib/products"; // 👉 uvozi iz baze

function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString("sr-RS", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function NewCollection() {
  const { addItem } = useCart(); // ✅ uzmi addItem iz providera

  const products = PRODUCTS.slice(0, 6); // 👉 uzmi samo prvih 6

  // Ako nemaš varijacije veličina na homepage kartici, setujemo "UNI"
  const handleAdd = (p: Product) => {
    addItem({
      id: p.id,
      name: p.name,
      image: p.image,
      size: p.sizes?.[0] ?? "UNI",
      qty: 1,
      price: p.price,
      oldPrice: p.oldPrice,
    });
  };

  return (
    <section className="bg-[#151511] text-neutral-100 border-t border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        {/* Header blok */}
        <div className="text-center">
          <h2 className="font-frances text-4xl md:text-6xl font-bold tracking-tight">Nova kolekcija</h2>
          <p className="mt-3 text-neutral-300 font-satoshi max-w-2xl mx-auto">
            Ne moraš više da sanjaš Hugo, Balmain i Diesel. Kod nas ih nosiš već prekosutra – bez da razbiješ budžet.
          </p>

          {/* Badge -40% */}
          <div className="mt-8 flex justify-center">
            <div className="size-28 md:size-32 rounded-full bg-[#b88022] grid place-items-center shadow-[0_10px_30px_rgba(0,0,0,.35)]">
              <div className="font-frances text-3xl md:text-5xl font-extrabold">40%</div>
            </div>
          </div>

          <h3 className="mt-8 font-satoshi text-3xl md:text-4xl font-extrabold tracking-[.06em]">POPUSTA NA SVE</h3>
          <p className="mt-1 text-sm font-bold text-neutral-400">
            Popuste garantujemo do {getTomorrowDate()}
          </p>
        </div>

        {/* Grid proizvoda */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article
              key={p.id}
              className="group rounded-2xl border border-neutral-700 bg-[#11110f] overflow-hidden hover:border-neutral-500 focus-within:border-[#6ea8ff] outline-none transition"
              tabIndex={0}
            >
              {/* Slika */}
              <div className="relative h-56">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                />
              </div>

              {/* Tekst */}
              <div className="p-5">
                <h4 className="font-satoshi text-xl leading-tight">{p.name}</h4>

                <div className="mt-3">
                  {p.oldPrice && (
                    <div className="text-neutral-400 line-through text-sm">{rsd(p.oldPrice)}</div>
                  )}
                  <div className="text-neutral-50 text-lg font-semibold">{rsd(p.price)}</div>
                </div>

                {/* CTA: dodaj u korpu + (opciono) detalji */}
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAdd(p)}
                    className="flex-1 text-center rounded-xl px-4 py-3 bg-[#151511] border border-neutral-500 hover:border-neutral-300 transition"
                    aria-label={`Dodaj ${p.name} u korpu`}
                  >
                    Dodaj u korpu
                  </button>

                  {p.href && (
                    <Link
                      href={p.href}
                      className="rounded-xl px-4 py-3 border border-neutral-600 hover:border-neutral-400 transition"
                      aria-label={`Detalji o proizvodu ${p.name}`}
                    >
                      Detalji
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/collection"
            className="btn-gradient text-[#151511] font-satoshi font-bold px-10 py-4 rounded-xl shadow hover:opacity-95 transition"
          >
            Pogledaj celu kolekciju
          </Link>
        </div>
      </div>
    </section>
  );
}

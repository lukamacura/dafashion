"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider"; // ✅ global cart
import { Product, PRODUCTS } from "@/lib/products";

/* ------------------------------ Types & Data ------------------------------ */

type SortKey = "popular" | "price-asc" | "price-desc";

const RSD = (n: number) => `${n.toLocaleString("sr-RS")} RSD`;
const ALL_CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))); // ["Majice","Prsluci","Šorcevi","Torbice"]
const ALL_BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand)));
const ALL_SIZES = Array.from(new Set(PRODUCTS.flatMap((p) => p.sizes)));

/* --------------------------------- Page ---------------------------------- */

export default function CollectionPage() {
  // ✅ GLOBALNA KORPA
  const { addItem } = useCart();

  // FILTRI / SORT (ostaje lokalno)
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("Sve kategorije");
  const [brand, setBrand] = useState<string>("Sve marke");
  const [size, setSize] = useState<string>("Veličina");
  const [sort, setSort] = useState<SortKey>("popular");
  const [limit, setLimit] = useState(9);

  const list = useMemo(() => {
    let rows = PRODUCTS.filter((p) => {
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase());
      const matchCat = cat === "Sve kategorije" || p.category === cat;
      const matchBrand = brand === "Sve marke" || p.brand === brand;
      const matchSize = size === "Veličina" || p.sizes.includes(size);
      return matchQ && matchCat && matchBrand && matchSize;
    });

    if (sort === "price-asc") rows = [...rows].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") rows = [...rows].sort((a, b) => b.price - a.price);

    return rows;
  }, [q, cat, brand, size, sort]);

  const visible = list.slice(0, limit);
  const canLoadMore = limit < list.length;

  // ➕ Dodavanje u GLOBALNU korpu
  const addToCart = (p: Product) => {
    const defaultSize = p.sizes[0] ?? "UNI";
    addItem({
      id: p.id,
      name: p.name,
      image: p.image,
      size: defaultSize,
      qty: 1,
      price: p.price,
      oldPrice: p.oldPrice,
    });
  };

  return (
    <section className="bg-[#151511] text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display font-frances text-4xl md:text-6xl font-bold">Kolekcija</h1>
          <p className="mt-3 text-neutral-300 font-satoshi">
            Komadi koje bi inače gledao kroz izlog – ovde ih naručuješ danas.
          </p>
        </div>

        {/* Filter bar */}
        <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto] items-center">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Pretraži proizvode..."
              className="w-full rounded-xl bg-[#0f0f0d] border border-neutral-700 px-4 py-3 outline-none focus:border-neutral-400"
            />
          </div>

          <Select value={cat} onChange={setCat} label="Kategorija" items={["Sve kategorije", ...ALL_CATEGORIES]} />
          <Select value={brand} onChange={setBrand} label="Brend" items={["Sve marke", ...ALL_BRANDS]} />
          <Select value={size} onChange={setSize} label="Veličina" items={["Veličina", ...ALL_SIZES]} />

          <Select<SortKey>
            value={sort}
            onChange={setSort}
            label="Sortiraj"
            items={[
              { label: "Popularno", value: "popular" },
              { label: "Cena ↑", value: "price-asc" },
              { label: "Cena ↓", value: "price-desc" },
            ]}
          />
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <ProductCard key={p.id} p={p} onAdd={() => addToCart(p)} />
          ))}
        </div>

        {/* Empty state */}
        {list.length === 0 && (
          <div className="text-center py-20 text-neutral-400">Nema rezultata za zadate filtere.</div>
        )}

        {/* Load more + back */}
        <div className="mt-10 flex items-center justify-center gap-4">
          {canLoadMore && (
            <button
              onClick={() => setLimit((n) => n + 9)}
              className="rounded-xl px-6 py-3 border border-neutral-600 bg-[#11110f] hover:border-neutral-400 transition"
            >
              Učitaj još
            </button>
          )}
          <Link
            href="/"
            className="rounded-xl px-6 py-3 border border-neutral-600 hover:border-neutral-400 transition"
          >
            Nazad na početnu
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- UI ---------------------------------- */

function ProductCard({ p, onAdd }: { p: Product; onAdd: () => void }) {
  return (
    <article className="group rounded-2xl border border-neutral-700 bg-[#11110f] overflow-hidden hover:border-neutral-500 transition">
      <Link href={p.href ?? "#"} aria-label={p.name}>
        <div className="relative h-56">
          <Image
            src={p.image}
            alt={p.name}
            fill
            className="object-cover"
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-5">
        <div className="text-sm text-neutral-400">{p.brand}</div>
        <h3 className="font-sans text-lg">{p.name}</h3>

        <div className="mt-2 flex items-end gap-2">
          {p.oldPrice && <div className="text-neutral-400 line-through text-sm">{RSD(p.oldPrice)}</div>}
          <div className="text-neutral-50 text-lg font-semibold">{RSD(p.price)}</div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onAdd}
            className="flex-1 text-center rounded-xl px-4 py-3 bg-[#151511] border border-neutral-500 hover:border-neutral-300 transition"
          >
            Dodaj u korpu
          </button>
          {p.href && (
            <Link
              href={p.href}
              className="rounded-xl px-4 py-3 border border-neutral-600 hover:border-neutral-400 transition"
            >
              Detalji
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

/* -------------------------------- Select -------------------------------- */

type SelectItem<T extends string> = T | { label: string; value: T };

function Select<T extends string>({
  value,
  onChange,
  label,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  label: string;
  items: SelectItem<T>[];
}) {
  const id = `sel-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <label className="inline-flex items-center gap-2" htmlFor={id}>
      <span className="sr-only">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-xl bg-[#0f0f0d] border border-neutral-700 px-4 py-3 outline-none focus:border-neutral-400"
      >
        {items.map((it, i) => {
          const v = typeof it === "string" ? it : it.value;
          const l = typeof it === "string" ? it : it.label;
          return (
            <option key={`${v}-${i}`} value={v}>
              {l}
            </option>
          );
        })}
      </select>
    </label>
  );
}

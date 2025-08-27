"use client";

import Image from "next/image";
import { useState, useMemo, useEffect, useRef } from "react";
import { Check, Package, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import type { Product } from "@/lib/products";
import { rsd } from "@/lib/products";

export default function ProductView({ product }: { product: Product }) {
  const { addItem, setOpen } = useCart();

  // --- STATE ---
  const [size, setSize] = useState<string>(product.sizes[0] ?? "UNI");
  const [qty, setQty] = useState<number>(1);
  const images = (product.images?.length ? product.images : [product.image]).filter(Boolean);
  const [active, setActive] = useState(0);

  // --- DERIVED ---
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const lineTotal = useMemo(() => product.price * qty, [product.price, qty]);
  const main = images[active] ?? images[0];

  // --- KEYBOARD NAV FOR GALLERY ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setActive((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setActive((i) => Math.min(images.length - 1, i + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  // --- THUMBS AUTO-SCROLL TO ACTIVE ---
  const stripRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = stripRef.current?.querySelector<HTMLButtonElement>(`button[data-idx="${active}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  // --- CART ---
  const addToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      image: main, // šaljemo aktivnu (glavnu) sliku u korpu
      size,
      qty,
      price: product.price,
      oldPrice: product.oldPrice,
    });
  };

  const buyNow = () => {
    addToCart();
    setOpen(true); // otvori modal odmah
  };

  // --- GALLERY CONTROLS ---
  const prevImg = () => setActive((i) => Math.max(0, i - 1));
  const nextImg = () => setActive((i) => Math.min(images.length - 1, i + 1));

  return (
    <section className="bg-[#151511] text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16 grid gap-8 md:grid-cols-2">
        {/* GALERIJA */}
        <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-[#11110f]">
          <div className="relative aspect-[4/3]">
            {discount > 0 && (
              <span className="absolute left-4 top-4 z-10 rounded-md bg-[#f0b33a] px-2.5 py-1 text-xs font-semibold text-[#151511]">
                -{discount}%
              </span>
            )}

            {/* PREV/NEXT (pokazuju se samo kad ima >1 slika) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10"
                  aria-label="Prethodna slika"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10"
                  aria-label="Sledeća slika"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <Image
              key={main} // re-render na promenu
              src={main}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width:1024px) 50vw, 100vw"
              priority
            />
          </div>

          {/* THUMB STRIP */}
          {images.length > 1 && (
            <div
              ref={stripRef}
              className="flex gap-3 p-3 overflow-x-auto border-t border-neutral-800 bg-[#0f0f0d]"
            >
              {images.map((src, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={src}
                    data-idx={i}
                    onClick={() => setActive(i)}
                    className={`relative min-w-20 h-20 rounded-lg overflow-hidden border transition
                      ${isActive ? "border-neutral-200" : "border-neutral-700 hover:border-neutral-400"}`}
                    aria-label={`Slika ${i + 1}`}
                  >
                    <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* DESNO: INFO + CTA */}
        <div>
          <h1 className="font-frances text-3xl md:text-5xl font-extrabold leading-tight">
            {product.name}
          </h1>
          <div className="mt-2 text-neutral-400">{product.brand}</div>

          <div className="mt-3">
            {product.oldPrice && (
              <div className="text-neutral-400 line-through text-sm">{rsd(product.oldPrice)}</div>
            )}
            <div className="text-2xl md:text-3xl font-extrabold">{rsd(product.price)}</div>
          </div>

          {/* VELIČINA */}
          <div className="mt-6">
            <div className="text-sm text-neutral-300 mb-2">Veličina</div>
            <div className="flex flex-wrap gap-2">
              {(product.sizes.length ? product.sizes : ["UNI"]).map((s) => {
                const active = size === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-11 px-4 rounded-xl border transition ${
                      active
                        ? "border-neutral-200 bg-[#151511]"
                        : "border-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* KOLIČINA */}
          <div className="mt-4">
            <div className="text-sm text-neutral-300 mb-2">Količina</div>
            <div className="inline-flex items-center rounded-xl border border-neutral-700">
              <button
                className="px-4 py-2 hover:bg-white/5"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                aria-label="Smanji količinu"
              >
                −
              </button>
              <div className="w-10 text-center">{qty}</div>
              <button
                className="px-4 py-2 hover:bg-white/5"
                onClick={() => setQty((n) => n + 1)}
                aria-label="Povećaj količinu"
              >
                +
              </button>
            </div>

            <div className="mt-2 text-sm text-neutral-400">
              Ukupno: <span className="font-medium text-neutral-100">{rsd(lineTotal)}</span>
            </div>
          </div>

          {/* CTA dugmad */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={buyNow}
              className="w-full btn-gradient text-[#151511] font-bold px-6 py-4 rounded-xl shadow hover:opacity-95"
            >
              Kupi odmah
            </button>
            <button
              onClick={addToCart}
              className="w-full rounded-xl px-6 py-4 border border-neutral-600 hover:border-neutral-400 transition"
            >
              Dodaj u korpu
            </button>
          </div>

          {/* trust badges */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-[#f0b33a]" />
              <div className="text-sm">
                <div className="font-medium">Besplatna dostava</div>
                <div className="text-neutral-400 text-xs">za 2+ komada</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-[#f0b33a]" />
              <div className="text-sm">
                <div className="font-medium">Plaćanje pouzećem</div>
                <div className="text-neutral-400 text-xs">sigurna isporuka</div>
              </div>
            </div>
          </div>

          {/* social proof */}
          <div className="mt-4 flex items-center gap-2 text-sm text-neutral-400">
            <Check className="h-4 w-4" />
            3000+ ljudi zadovoljno
          </div>
        </div>
      </div>
    </section>
  );
}

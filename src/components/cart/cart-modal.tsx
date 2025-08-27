"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { X, Package, Wallet, Plus, Minus } from "lucide-react";
import { getProduct } from "@/lib/products"; // 👈 dodaj

export type CartItem = {
  id: string;
  name: string;
  image: string;   // /public putanja
  size?: string;   // npr "S"
  qty: number;     // količina
  price: number;   // cena po kom
  oldPrice?: number;
};

export default function CartModal({
  open,
  onClose,
  items,
  onInc,
  onDec,
  onRemove,
  onChangeSize,
  shippingFee = 450,
}: {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onInc: (id: string, size?: string) => void;
  onDec: (id: string, size?: string) => void;
  onRemove?: (id: string, size?: string) => void;
  onChangeSize?: (id: string, oldSize: string, newSize: string) => void;
  shippingFee?: number;
}) 
 { 


  // ESC za zatvaranje
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  // klik izvan
  const scrimRef = useRef<HTMLDivElement>(null);
  const onScrim = (e: React.MouseEvent) => {
    if (e.target === scrimRef.current) onClose();
  };

  // 💡 NOVO: ukupna količina (ne broj različitih artikala)
  const totalQty = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  // 💡 NOVO: besplatna dostava kada je totalQty >= 2 (npr. 2 ista proizvoda)
  const shipping = totalQty >= 2 ? 0 : shippingFee;
  const total = subtotal + shipping;

  const RSD = (n: number) => `${n.toLocaleString("sr-RS")} RSD`;

  if (!open) return null;

  return (
     <div
   ref={scrimRef}
   onMouseDown={onScrim}
   className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-[1px] font-satoshi
              overflow-y-auto overscroll-contain"
   aria-hidden={!open}
 >
     <div
  role="dialog"
  aria-modal="true"
  aria-labelledby="cart-title"
  className="mx-auto my-4 md:my-10 max-w-5xl md:rounded-2xl
             bg-[#0f0f0d] text-neutral-100 shadow-[0_20px_60px_rgba(0,0,0,.6)]
             border border-neutral-800
             h-[calc(100dvh-2rem)] md:h-auto
             overflow-y-auto"
>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-neutral-800 bg-[#11110f]">
          <h3 id="cart-title" className="font-display font-frances text-xl md:text-2xl font-bold tracking-tight">
            Korpa
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            aria-label="Zatvori"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="grid md:grid-cols-5 gap-0 md:gap-6 p-0 md:p-6">
          {/* LEFT: Items list (scrollable) */}
          <div className="md:col-span-3 border-b md:border-b-0 md:pr-2 border-neutral-800">
            <div className="px-5 pt-5">
              <div className="flex items-baseline justify-between">
                <h4 className="text-sm uppercase tracking-wider text-neutral-400">Vaša korpa</h4>
                {totalQty > 0 && (
                  <span className="text-xs text-neutral-400">Artikala: {totalQty}</span>
                )}
              </div>
            </div>

<div className="md:max-h-[62vh] md:overflow-y-auto px-5 pb-5 md:pb-0 md:pr-3 mt-3 space-y-3">
              {items.map((it) => {
                const lineTotal = it.price * it.qty;
                const discount =
                  it.oldPrice && it.oldPrice > it.price
                    ? Math.round(((it.oldPrice - it.price) / it.oldPrice) * 100)
                    : 0;

                return (
                  <div
                    key={`${it.id}-${it.size ?? "UNI"}`}
                    className="flex items-stretch gap-4 rounded-xl border border-neutral-800 p-4 bg-[#121211]"
                  >
                    <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-neutral-700">
                      {discount > 0 && (
                        <span className="absolute left-1 top-1 z-10 rounded-md bg-[#f0b33a] px-1.5 py-0.5 text-[10px] font-semibold text-[#151511]">
                          -{discount}%
                        </span>
                      )}
                      <Image
                        src={it.image}
                        alt={it.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-display text-base md:text-lg leading-tight line-clamp-2">
                            {it.name}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
  {/* VELIČINA — dropdown koji se otvara na klik */}
  <label className="inline-flex items-center gap-2">
    <span className="sr-only ">Veličina</span>
    <select
  value={it.size ?? getSizesForProduct(it.id)[0]}
  onChange={(e) => onChangeSize?.(it.id, it.size ?? "UNI", e.target.value)}
  className="h-8 rounded-lg border text-xs  border-neutral-700 bg-[#0f0f0d] px-2.5 hover:border-neutral-400 focus:border-neutral-400 outline-none"
  aria-label="Promeni veličinu"
>
  {getSizesForProduct(it.id).map((s) => (
    <option key={s} value={s}>{s}</option>
  ))}
</select>

  </label>

  <span className="inline-flex h-8 text-xs items-center rounded-lg border border-neutral-700 px-2.5">
    Količina: {it.qty}
  </span>
</div>

                        </div>

                        <div className="text-right shrink-0">
                          {it.oldPrice && (
                            <div className="text-neutral-400 line-through text-xs">
                              {RSD(it.oldPrice)}
                            </div>
                          )}
                          <div className="text-base font-semibold">{RSD(it.price)}</div>
                          <div className="text-xs text-neutral-400 mt-0.5">
                            Linijski: {RSD(lineTotal)}
                          </div>
                        </div>
                      </div>

                      {/* qty controls */}
                      <div className="mt-3 flex items-center gap-2">
                        <button
  onClick={() => onDec(it.id, it.size)}  // ⬅️ dodaj size
  className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-neutral-700 hover:border-neutral-400"
  aria-label="Smanji količinu"
>
  <Minus className="h-4 w-4" />
</button>

<div className="w-10 text-center">{it.qty}</div>

<button
  onClick={() => onInc(it.id, it.size)}  // ⬅️ dodaj size
  className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-neutral-700 hover:border-neutral-400"
  aria-label="Povećaj količinu"
>
  <Plus className="h-4 w-4" />
</button>

{onRemove && (
  <button
    onClick={() => onRemove(it.id, it.size)}  // ⬅️ dodaj size
    className="ml-3 text-sm text-neutral-400 hover:text-neutral-200 underline underline-offset-4"
  >
    Ukloni
  </button>
)}

                      </div>
                    </div>
                  </div>
                );
              })}

              {items.length === 0 && (
                <div className="rounded-xl border border-neutral-800 p-10 text-center text-neutral-400">
                  Korpa je prazna.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Sticky summary + form */}
          <div className="md:col-span-2 md:pl-2">
            <div className="md:sticky md:top-6 md:pb-6">
              {/* Perks */}
              <div className="px-5 pt-5 md:px-0">
                <div className="grid grid-cols-2 items-center gap-4">
                  <div className="text-center">
                    <Package className="mx-auto h-9 w-9 text-[#f0b33a]" />
                    <div className="mt-1 font-medium text-sm">Besplatna dostava</div>
                    <div className="text-xs text-neutral-400">
                      za 2+ proizvoda ili komada
                    </div>
                  </div>
                  <div className="text-center">
                    <Wallet className="mx-auto h-9 w-9 text-[#f0b33a]" />
                    <div className="mt-1 font-medium text-sm">Plaćanje pouzećem</div>
                    <div className="text-xs text-neutral-400">sigurna isporuka</div>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="mt-4 md:mt-5 rounded-xl border border-neutral-800 p-4 bg-[#121211] mx-5 md:mx-0">
                <div className="flex items-baseline justify-between">
                  <span className="text-neutral-300">Cena</span>
                  <span className="font-medium">{RSD(subtotal)}</span>
                </div>
                <div className="flex items-baseline justify-between mt-1.5">
                  <span className="text-neutral-300">Dostava</span>
                  <span className="font-medium">
                    {shipping === 0 ? "0 RSD (gratis)" : RSD(shipping)}
                  </span>
                </div>
                <div className="mt-3 border-t border-neutral-800 pt-3 flex items-baseline justify-between">
                  <div className="font-display text-xl">Ukupno</div>
                  <div className="font-display text-2xl md:text-3xl font-extrabold">
                    {RSD(total)}
                  </div>
                </div>
                {totalQty < 2 && items.length > 0 && (
                  <p className="mt-2 text-xs text-neutral-400">
                    Dodaj još <span className="font-medium">1</span> komad za besplatnu dostavu.
                  </p>
                )}
              </div>

              {/* Form */}
              <div className="mt-4 md:mt-5 px-5 md:px-0">
                <form className="space-y-3">
                  <Input label="Ime i prezime" placeholder="Ime i prezime" />
                  <Input label="Adresa" placeholder="Ulica i broj" />
                  <Input label="Mesto / Grad" placeholder="Npr. Beograd" />
                  <Input label="Broj telefona" placeholder="+381 5555555" type="tel" />
                </form>

                <button
                  disabled={items.length === 0}
                  className="mt-4 w-full btn-gradient text-[#151511] font-bold px-6 py-4 rounded-xl shadow hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Potvrdi porudžbinu
                </button>

                <p className="mt-3 text-center text-xs text-neutral-400">
                  Dostava je besplatna za dve ili više stavki <em>(ukupna količina)</em>, inače {RSD(shippingFee)}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- sub-UI ---------------------------------- */
// ispod komponentinih import-a / unutar fajla

function getSizesForProduct(id: string) {
  const p = getProduct(id);
  return p?.sizes?.length ? p.sizes : ["UNI"];
}

function Input({
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = `inp-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <label className="block" htmlFor={id}>
      <span className="sr-only">{label}</span>
      <input
        id={id}
        {...rest}
        className="w-full rounded-xl bg-transparent border border-neutral-700 px-4 py-3 outline-none focus:border-neutral-400 placeholder:text-neutral-500"
      />
    </label>
  );
}

"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { X, Package, Wallet, Plus, Minus } from "lucide-react";
import { getProduct } from "@/lib/products";

export type CartItem = {
  id: string;
  name: string;
  image: string;
  size?: string;
  qty: number;
  price: number;
  oldPrice?: number;
};

type ApiResponse = { ok: true } | { ok: false; error: string };

function isApiResponse(x: unknown): x is ApiResponse {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  if (o.ok === true) return true;
  return o.ok === false && typeof o.error === "string";
}

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
}) {
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ESC + lock body scroll kada je otvoren modal
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // klik izvan
  const scrimRef = useRef<HTMLDivElement>(null);
  const onScrim = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === scrimRef.current) onClose();
  };

  // Validacija (bez hookova → nema missing deps)
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Unesite ime i prezime";
    if (!form.address.trim()) e.address = "Unesite adresu";
    if (!form.city.trim()) e.city = "Unesite mesto/grad";
    if (!form.email.trim()) e.email = "Unesite email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email nije ispravan";
    if (!form.phone.trim()) e.phone = "Unesite broj telefona";
    else if (!/^[0-9+()\-.\s]{6,20}$/.test(form.phone)) e.phone = "Telefon nije ispravan";
    return e;
  };

  const handleCheckout = async () => {
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    try {
      const orderPayload = {
        orderId: Date.now().toString(),
        customer: {
          name: form.name,
          email: form.email,
          address: `${form.address}, ${form.city}`,
          phone: form.phone,
        },
        items,
        total: items.reduce((sum: number, it: CartItem) => sum + it.price * it.qty, 0),
      };

      const res = await fetch("/api/order-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const dataUnknown: unknown = await res.json().catch(() => null);
      const data: ApiResponse = isApiResponse(dataUnknown)
        ? dataUnknown
        : { ok: false, error: "Nevažeći odgovor servera" };

      if (!res.ok || data.ok === false) {
        alert(data.ok === false ? data.error : "Došlo je do greške.");
        return;
      }

      alert("Porudžbina potvrđena! Proverite email.");
      // TODO: isprazni korpu / router.push("/thank-you?order="+orderPayload.orderId)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Došlo je do greške. Pokušajte ponovo.";
      alert(msg);
    }
  };

  // Sume
  const totalQty = useMemo(
    () => items.reduce((sum: number, it: CartItem) => sum + it.qty, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum: number, it: CartItem) => sum + it.price * it.qty, 0),
    [items]
  );
  const shipping = totalQty >= 2 ? 0 : shippingFee;
  const total = subtotal + shipping;

  const currentErrors = validate();
  const hasErrors = Object.keys(currentErrors).length > 0 || items.length === 0;

  const RSD = (n: number) => `${n.toLocaleString("sr-RS")} RSD`;

  if (!open) return null;

  return (
    // SCRIM: fullscreen
    <div
      ref={scrimRef}
      onMouseDown={onScrim}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
      aria-hidden={!open}
    >
      {/* DIALOG: fullscreen, jedan overflow u telu */}
      <div role="dialog" aria-modal="true" aria-labelledby="cart-title" className="fixed inset-0 overflow-hidden">
        <div className="h-full w-full flex flex-col bg-[#0f0f0d] text-neutral-100 border-t border-neutral-800">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-neutral-800 bg-[#11110f] shrink-0">
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
          <div className="flex-1 overflow-y-auto">
            <div className="grid md:grid-cols-5 gap-0 md:gap-6 p-0 md:p-6">
              {/* LEFT: Items */}
              <div className="md:col-span-3 border-b md:border-b-0 md:pr-2 border-neutral-800">
                <div className="px-5 pt-5">
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-sm uppercase tracking-wider text-neutral-400">Vaša korpa</h4>
                    {totalQty > 0 && <span className="text-xs text-neutral-400">Artikala: {totalQty}</span>}
                  </div>
                </div>

                <div className="px-5 pb-5 md:pb-0 md:pr-3 mt-3 space-y-3">
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
                          <Image src={it.image} alt={it.name} fill className="object-cover" sizes="80px" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-display text-base md:text-lg leading-tight line-clamp-2">{it.name}</div>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                                <label className="inline-flex items-center gap-2">
                                  <span className="sr-only">Veličina</span>
                                  <select
                                    value={it.size ?? getSizesForProduct(it.id)[0]}
                                    onChange={(e) => onChangeSize?.(it.id, it.size ?? "UNI", e.target.value)}
                                    className="h-8 rounded-lg border text-xs border-neutral-700 bg-[#0f0f0d] px-2.5 hover:border-neutral-400 focus:border-neutral-400 outline-none"
                                    aria-label="Promeni veličinu"
                                  >
                                    {getSizesForProduct(it.id).map((s) => (
                                      <option key={s} value={s}>
                                        {s}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <span className="inline-flex h-8 text-xs items-center rounded-lg border border-neutral-700 px-2.5">
                                  Količina: {it.qty}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              {it.oldPrice && <div className="text-neutral-400 line-through text-xs">{RSD(it.oldPrice)}</div>}
                              <div className="text-base font-semibold">{RSD(it.price)}</div>
                              <div className="text-xs text-neutral-400 mt-0.5">Linijski: {RSD(lineTotal)}</div>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => onDec(it.id, it.size)}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-neutral-700 hover:border-neutral-400"
                              aria-label="Smanji količinu"
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <div className="w-10 text-center">{it.qty}</div>

                            <button
                              onClick={() => onInc(it.id, it.size)}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-neutral-700 hover:border-neutral-400"
                              aria-label="Povećaj količinu"
                            >
                              <Plus className="h-4 w-4" />
                            </button>

                            {onRemove && (
                              <button
                                onClick={() => onRemove(it.id, it.size)}
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
                    <div className="rounded-xl border border-neutral-800 p-10 text-center text-neutral-400">Korpa je prazna.</div>
                  )}
                </div>
              </div>

              {/* RIGHT: summary + form */}
              <div className="md:col-span-2 md:pl-2">
                <div className="md:sticky md:top-6 md:pb-6">
                  <div className="px-5 pt-5 md:px-0">
                    <div className="grid grid-cols-2 items-center gap-4">
                      <div className="text-center">
                        <Package className="mx-auto h-9 w-9 text-[#f0b33a]" />
                        <div className="mt-1 font-medium text-sm">Besplatna dostava</div>
                        <div className="text-xs text-neutral-400">za 2+ proizvoda ili komada</div>
                      </div>
                      <div className="text-center">
                        <Wallet className="mx-auto h-9 w-9 text-[#f0b33a]" />
                        <div className="mt-1 font-medium text-sm">Plaćanje pouzećem</div>
                        <div className="text-xs text-neutral-400">sigurna isporuka</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-5 rounded-xl border border-neutral-800 p-4 bg-[#121211] mx-5 md:mx-0">
                    <div className="flex items-baseline justify-between">
                      <span className="text-neutral-300">Cena</span>
                      <span className="font-medium">{RSD(subtotal)}</span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1.5">
                      <span className="text-neutral-300">Dostava</span>
                      <span className="font-medium">{shipping === 0 ? "0 RSD (gratis)" : RSD(shipping)}</span>
                    </div>
                    <div className="mt-3 border-t border-neutral-800 pt-3 flex items-baseline justify-between">
                      <div className="font-display text-xl">Ukupno</div>
                      <div className="font-display text-2xl md:text-3xl font-extrabold">{RSD(total)}</div>
                    </div>
                    {totalQty < 2 && items.length > 0 && (
                      <p className="mt-2 text-xs text-neutral-400">
                        Dodaj još <span className="font-medium">1</span> komad za besplatnu dostavu.
                      </p>
                    )}
                  </div>

                  <div className="mt-4 md:mt-5 px-5 md:px-0">
                    <form id="checkout-form" className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                      <Input
                        label="Ime i prezime"
                        placeholder="Ime i prezime"
                        value={form.name}
                        required
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                      />
                      {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}

                      <Input
                        label="Email"
                        placeholder="npr. kupac@mail.com"
                        type="email"
                        value={form.email}
                        required
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                      />
                      {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}

                      <Input
                        label="Adresa"
                        placeholder="Ulica i broj"
                        value={form.address}
                        required
                        onChange={(e) => {
                          setForm({ ...form, address: e.target.value });
                          if (errors.address) setErrors({ ...errors, address: "" });
                        }}
                      />
                      {errors.address && <p className="text-xs text-red-400">{errors.address}</p>}

                      <Input
                        label="Mesto / Grad"
                        placeholder="Npr. Beograd"
                        value={form.city}
                        required
                        onChange={(e) => {
                          setForm({ ...form, city: e.target.value });
                          if (errors.city) setErrors({ ...errors, city: "" });
                        }}
                      />
                      {errors.city && <p className="text-xs text-red-400">{errors.city}</p>}

                      <Input
                        label="Broj telefona"
                        placeholder="+381 6x xxx xxxx"
                        type="tel"
                        value={form.phone}
                        required
                        onChange={(e) => {
                          setForm({ ...form, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: "" });
                        }}
                      />
                      {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                    </form>

                    <button
                      onClick={handleCheckout}
                      disabled={hasErrors}
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
          {/* /Body */}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- sub-UI ---------------------------------- */

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

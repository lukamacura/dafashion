// lib/products.ts

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: "Majice" | "Prsluci" | "Šorcevi" | "Torbice";
  sizes: string[];
  price: number;
  oldPrice?: number;
  image: string;        // cover slika (images[0])
  images: string[];     // sve slike proizvoda
  href?: string;
};

/* ------------------ CENOVNIK ------------------ */
const PRICE = {
  MAJICA: 2400,
  SORC: 2200,
  PRSLUK: 5000,
  TORBICA: {
    LV: 4000,
    HUGO: 3500,
    PRADA: 3400,
    LACOSTE: 3400,
  },
};

// Zaokruži broj tako da se završava na 0 ili 5
function roundTo0or5(n: number): number {
  return Math.round(n / 5) * 5;
}

// Popust (40%) pa zaokruži na 0 ili 5
const retailFromDiscount = (current: number) => {
  const raw = current / 0.6; // izračunaj staru cenu
  return roundTo0or5(raw);
};

// brzi helperi
const P = (n = PRICE.PRSLUK) => ({ price: n, oldPrice: retailFromDiscount(n) });
const M = (n = PRICE.MAJICA)  => ({ price: n, oldPrice: retailFromDiscount(n) });
const S = (n = PRICE.SORC)    => ({ price: n, oldPrice: retailFromDiscount(n) });
const T = (n: number)         => ({ price: n, oldPrice: retailFromDiscount(n) });

/* ------------------ DEFAULT SIZES ------------------ */
const SIZES_TOPS = ["S", "M", "L", "XL"];
const SIZES_PANTS = ["S", "M", "L", "XL"];
const UNI = ["UNI"];

/* ------------------ HELPERS ------------------ */
const imgs = (id: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/products/${id}-${i + 1}.jpg`);

const href = (id: string) => `/products/${id}`;

/* ------------------ PROIZVODI ------------------ */
export const PRODUCTS: Product[] = [
  // PRSLUCI
  { id:"polo-prsluk", name:"Polo Ralph Lauren prsluk", brand:"Polo Ralph Lauren", category:"Prsluci", sizes:SIZES_TOPS, images:imgs("polo-prsluk",2), image:imgs("polo-prsluk",2)[0], href:href("polo-prsluk"), ...P() },
  { id:"moncler-prsluk", name:"Moncler prsluk", brand:"Moncler", category:"Prsluci", sizes:SIZES_TOPS, images:imgs("moncler-prsluk",3), image:imgs("moncler-prsluk",3)[0], href:href("moncler-prsluk"), ...P() },

  // ŠORCEVI
  { id:"polo-sorc", name:"Polo šorc", brand:"Polo Ralph Lauren", category:"Šorcevi", sizes:SIZES_PANTS, images:imgs("polo-sorc",3), image:imgs("polo-sorc",3)[0], href:href("polo-sorc"), ...S() },
  { id:"lacoste-sorc", name:"Lacoste šorc", brand:"Lacoste", category:"Šorcevi", sizes:SIZES_PANTS, images:imgs("lacoste-sorc",3), image:imgs("lacoste-sorc",3)[0], href:href("lacoste-sorc"), ...S() },
  { id:"boss-sorc", name:"BOSS šorc (tamni)", brand:"BOSS", category:"Šorcevi", sizes:SIZES_PANTS, images:imgs("boss-sorc",3), image:imgs("boss-sorc",3)[0], href:href("boss-sorc"), ...S() },
  { id:"boss-sorc-svetli", name:"BOSS šorc (svetli)", brand:"BOSS", category:"Šorcevi", sizes:SIZES_PANTS, images:imgs("boss-sorc-svetli",3), image:imgs("boss-sorc-svetli",3)[0], href:href("boss-sorc-svetli"), ...S() },
  { id:"lacoste-sorc-tamni", name:"Lacoste šorc (tamni)", brand:"Lacoste", category:"Šorcevi", sizes:SIZES_PANTS, images:imgs("lacoste-sorc-tamni",3), image:imgs("lacoste-sorc-tamni",3)[0], href:href("lacoste-sorc-tamni"), ...S() },
  { id:"balmain-sorc", name:"Balmain šorc", brand:"Balmain", category:"Šorcevi", sizes:SIZES_PANTS, images:imgs("balmain-sorc",3), image:imgs("balmain-sorc",3)[0], href:href("balmain-sorc"), ...S() },

  // MAJICE
  { id:"balmain-majica", name:"Balmain majica", brand:"Balmain", category:"Majice", sizes:SIZES_TOPS, images:imgs("balmain-majica",2), image:imgs("balmain-majica",2)[0], href:href("balmain-majica"), ...M() },
  { id:"diesel-majica-tip1", name:"Diesel majica", brand:"Diesel", category:"Majice", sizes:SIZES_TOPS, images:imgs("diesel-majica-tip1",2), image:imgs("diesel-majica-tip1",2)[0], href:href("diesel-majica-tip1"), ...M() },
  { id:"diesel-majica-tip2", name:"Diesel majica", brand:"Diesel", category:"Majice", sizes:SIZES_TOPS, images:imgs("diesel-majica-tip2",3), image:imgs("diesel-majica-tip2",3)[0], href:href("diesel-majica-tip2"), ...M() },
  { id:"trapstar-majica-tamna", name:"Trapstar majica (tamna)", brand:"Trapstar", category:"Majice", sizes:SIZES_TOPS, images:imgs("trapstar-majica-tamna",4), image:imgs("trapstar-majica-tamna",4)[0], href:href("trapstar-majica-tamna"), ...M() },
  { id:"trapstar-majica-bela", name:"Trapstar majica (bela)", brand:"Trapstar", category:"Majice", sizes:SIZES_TOPS, images:imgs("trapstar-majica-bela",2), image:imgs("trapstar-majica-bela",2)[0], href:href("trapstar-majica-bela"), ...M() },

// ——— HUGO (compact, 1 linija po proizvodu) ———
{ id:"hugo-majica-bela", name:"HUGO majica (bela)", brand:"HUGO", category:"Majice", sizes:SIZES_TOPS, images:imgs("hugo-majica-bela",2), image:imgs("hugo-majica-bela",4)[0], href:href("hugo-majica-bela"), ...M() },
{ id:"hugo-majica-tamna", name:"HUGO majica (crna)", brand:"HUGO", category:"Majice", sizes:SIZES_TOPS, images:imgs("hugo-majica-tamna",2), image:imgs("hugo-majica-tamna",2)[0], href:href("hugo-majica-tamna"), ...M() },
{ id:"hugo-majica-crvena", name:"HUGO majica (crvena)", brand:"HUGO", category:"Majice", sizes:SIZES_TOPS, images:imgs("hugo-majica-crvena",2), image:imgs("hugo-majica-crvena",2)[0], href:href("hugo-majica-crvena"), ...M() },
{ id:"hugo-majica-plava", name:"HUGO majica (plava)", brand:"HUGO", category:"Majice", sizes:SIZES_TOPS, images:imgs("hugo-majica-plava",2), image:imgs("hugo-majica-plava",2)[0], href:href("hugo-majica-plava"), ...M() },
{ id:"hugo-majica-svetla", name:"HUGO majica (bela)", brand:"HUGO", category:"Majice", sizes:SIZES_TOPS, images:imgs("hugo-majica-svetla",2), image:imgs("hugo-majica-svetla",2)[0], href:href("hugo-majica-svetla"), ...M() },
{ id:"hugo-majica-tamna-mali", name:"HUGO majica (crna – pisani logo)", brand:"HUGO", category:"Majice", sizes:SIZES_TOPS, images:imgs("hugo-majica-tamna-mali",2), image:imgs("hugo-majica-tamna-mali",2)[0], href:href("hugo-majica-tamna-mali"), ...M() },
{ id:"hugo-majica-natpis-tamna", name:"HUGO majica (crna)", brand:"HUGO", category:"Majice", sizes:SIZES_TOPS, images:imgs("hugo-majica-natpis-tamna",2), image:imgs("hugo-majica-natpis-tamna",2)[0], href:href("hugo-majica-natpis-tamna"), ...M() },
{ id:"hugo-majica-natpis-bela", name:"HUGO majica (bela)", brand:"HUGO", category:"Majice", sizes:SIZES_TOPS, images:imgs("hugo-majica-natpis-bela",1), image:imgs("hugo-majica-natpis-bela",1)[0], href:href("hugo-majica-natpis-bela"), ...M() },
{ id:"hugo-majica-kisa", name:"HUGO majica (crna)", brand:"HUGO", category:"Majice", sizes:SIZES_TOPS, images:["/products/hugo-majica-kisa-3.jpg","/products/hugo-majica-kisa-4.jpg"], image:"/products/hugo-majica-kisa-3.jpg", href:href("hugo-majica-kisa"), ...M() },
{ id:"hugo-majica", name:"HUGO majica (crna)", brand:"HUGO", category:"Majice", sizes:SIZES_TOPS, images:imgs("hugo-majica",1), image:imgs("hugo-majica",1)[0], href:href("hugo-majica"), ...M() },
{ id:"hugo-majica-big", name:"HUGO majica (bela)", brand:"HUGO", category:"Majice", sizes:SIZES_TOPS, images:imgs("hugo-majica-big",1), image:imgs("hugo-majica-big",1)[0], href:href("hugo-majica-big"), ...M() },

  { id:"boss-majica", name:"BOSS majica", brand:"BOSS", category:"Majice", sizes:SIZES_TOPS, images:imgs("boss-majica",2), image:imgs("boss-majica",2)[0], href:href("boss-majica"), ...M() },
  { id:"amiri-majica", name:"AMIRI majica", brand:"AMIRI", category:"Majice", sizes:SIZES_TOPS, images:imgs("amiri-majica",3), image:imgs("amiri-majica",3)[0], href:href("amiri-majica"), ...M() },
  { id:"dsquared-majica", name:"Dsquared2 majica", brand:"Dsquared2", category:"Majice", sizes:SIZES_TOPS, images:imgs("dsquared-majica",2), image:imgs("dsquared-majica",2)[0], href:href("dsquared-majica"), ...M() },

  { id:"prada-majica-tamna", name:"Prada majica (tamna)", brand:"Prada", category:"Majice", sizes:SIZES_TOPS, images:imgs("prada-majica-tamna",6), image:imgs("prada-majica-tamna",6)[0], href:href("prada-majica-tamna"), ...M() },
  { id:"prada-majica-svetla", name:"Prada majica (svetla)", brand:"Prada", category:"Majice", sizes:SIZES_TOPS, images:imgs("prada-majica-svetla",2), image:imgs("prada-majica-svetla",2)[0], href:href("prada-majica-svetla"), ...M() },
  { id:"polo-majica", name:"Polo Ralph Lauren majica", brand:"Polo Ralph Lauren", category:"Majice", sizes:SIZES_TOPS, images:imgs("polo-majica",2), image:imgs("polo-majica",2)[0], href:href("polo-majica"), ...M() },

  // TORBICE
  { id:"lv-torbica", name:"Louis Vuitton torbica", brand:"Louis Vuitton", category:"Torbice", sizes:UNI, images:imgs("lv-torbica",1), image:imgs("lv-torbica",1)[0], href:href("lv-torbica"), ...T(PRICE.TORBICA.LV) },
  { id:"hugo-torbica", name:"HUGO torbica", brand:"HUGO", category:"Torbice", sizes:UNI, images:imgs("hugo-torbica",1), image:imgs("hugo-torbica",1)[0], href:href("hugo-torbica"), ...T(PRICE.TORBICA.HUGO) },
  { id:"prada-torbica", name:"Prada torbica", brand:"Prada", category:"Torbice", sizes:UNI, images:imgs("prada-torbica",1), image:imgs("prada-torbica",1)[0], href:href("prada-torbica"), ...T(PRICE.TORBICA.PRADA) },
  { id:"lacoste-torbica", name:"Lacoste torbica", brand:"Lacoste", category:"Torbice", sizes:UNI, images:imgs("lacoste-torbica",1), image:imgs("lacoste-torbica",1)[0], href:href("lacoste-torbica"), ...T(PRICE.TORBICA.LACOSTE) },
];

/* ------------------ UTILITY ------------------ */
export const rsd = (n: number) => `${n.toLocaleString("sr-RS")} RSD`;

export function getProduct(slug: string) {
  return PRODUCTS.find(p => p.id === slug) ?? null;
}

export function getAllSlugs() {
  return PRODUCTS.map(p => p.id);
}

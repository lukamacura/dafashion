// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getProduct } from "@/lib/products";
import ProductView from "@/components/product/product-view";

type Props = { params: { slug: string } };

// Ako ti je sajt 100% statičan za ove proizvode:
export const dynamicParams = false; // Next može da generiše samo poznate slugove

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const p = getProduct(params.slug);
  if (!p) return { title: "Proizvod nije pronađen" };
  return {
    title: `${p.name} | D&A Fashion`,
    description: `${p.brand} – ${p.name}. Poruči odmah.`,
    openGraph: {
      title: p.name,
      description: `${p.brand} – ${p.name}`,
      images: p.images?.length ? p.images : [p.image],
    },
    twitter: {
      card: "summary_large_image",
      title: p.name,
      description: `${p.brand} – ${p.name}`,
      images: p.images?.[0] ?? p.image,
    },
  };
}

export default function Page({ params }: Props) {
  const product = getProduct(params.slug);
  if (!product) return notFound();
  return <ProductView product={product} />;
}

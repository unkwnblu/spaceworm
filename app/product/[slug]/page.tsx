import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatNGN } from "@/lib/database.types";
import Header from "@/components/Header";
import PDPClient from "./PDPClient";
import ProductCard from "@/components/ProductCard";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spaceworm.co";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description, images, price, category")
    .eq("slug", slug)
    .single();

  if (!product) return { title: "Not Found" };

  const image = product.images?.[0];
  const priceNGN = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(product.price);

  return {
    title: product.name,
    description: product.description ?? `${product.name} — ${priceNGN}. ${product.category} by Spaceworm.`,
    openGraph: {
      title: `${product.name} — Spaceworm`,
      description: product.description ?? `${product.name} — ${priceNGN}`,
      type: "website",
      ...(image && {
        images: [{ url: image, width: 800, height: 1067, alt: product.name }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Spaceworm`,
      description: product.description ?? `${product.name} — ${priceNGN}`,
      ...(image && { images: [image] }),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) notFound();

  const { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "Spaceworm" },
    category: product.category,
    url: `${BASE_URL}/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/product/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Header />
      <main>
        <PDPClient product={product} />

        {related && related.length > 0 && (
          <section className="border-t border-zinc-100 px-4 py-16 md:px-8 md:py-20">
            <div className="mx-auto max-w-screen-xl">
              <h2 className="mb-10 text-xs font-black uppercase tracking-[0.3em] text-black">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

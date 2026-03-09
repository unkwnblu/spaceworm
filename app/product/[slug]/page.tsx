import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/mockData";
import Header from "@/components/Header";
import PDPClient from "./PDPClient";
import ProductCard from "@/components/ProductCard";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  // TODO: Replace with Supabase fetch
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not Found — Spaceworm" };
  return {
    title: `${product.name} — Spaceworm`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  // TODO: Replace with Supabase fetch
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(slug, 4);

  return (
    <>
      <Header />
      <main>
        <PDPClient product={product} />

        {/* Related products */}
        {related.length > 0 && (
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

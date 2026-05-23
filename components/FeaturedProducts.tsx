import { createClient } from "@/lib/supabase/server";
import ProductCard from "./ProductCard";

export default async function FeaturedProducts() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  const featured = products ?? [];

  if (featured.length === 0) return null;

  return (
    <section id="products" className="mx-auto max-w-screen-xl scroll-mt-14 px-4 py-16 md:px-8 md:py-24">
      {/* Section header */}
      <div className="mb-10 flex items-end justify-between border-b border-zinc-200 pb-6">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-black">
          The Collection
        </h2>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          SS25 — Spring / Summer 2025
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

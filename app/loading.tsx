import Header from "@/components/Header";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

export default function HomeLoading() {
  return (
    <>
      <Header />
      <main>
        {/* Hero skeleton */}
        <div className="h-screen min-h-[600px] w-full animate-pulse bg-zinc-100" />

        {/* Featured products skeleton */}
        <section className="mx-auto max-w-screen-xl px-4 py-16 md:px-8 md:py-24">
          <div className="mb-10 flex items-end justify-between border-b border-zinc-200 pb-6">
            <div className="h-3 w-28 animate-pulse bg-zinc-100" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

import Header from "@/components/Header";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

export default function AllLoading() {
  return (
    <>
      <Header />
      <main className="pt-14">
        <section className="border-b border-zinc-100 px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-screen-xl">
            <div className="h-10 w-32 animate-pulse bg-zinc-100" />
          </div>
        </section>

        <div className="mx-auto max-w-screen-xl px-4 pb-20 pt-8 md:px-8">
          <div className="flex gap-10">
            {/* Sidebar skeleton */}
            <aside className="hidden w-44 shrink-0 space-y-3 md:block">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-3 animate-pulse bg-zinc-100" style={{ width: `${60 + (i % 3) * 15}%` }} />
              ))}
            </aside>
            {/* Grid skeleton */}
            <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

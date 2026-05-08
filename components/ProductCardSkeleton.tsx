export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-3 aspect-[3/4] w-full bg-zinc-100" />
      <div className="mb-1.5 h-3 w-3/4 bg-zinc-100" />
      <div className="h-3 w-1/3 bg-zinc-100" />
    </div>
  );
}

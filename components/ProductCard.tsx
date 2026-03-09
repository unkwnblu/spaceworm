import Link from "next/link";
import Image from "next/image";
import { Product, toNGN } from "@/lib/mockData";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Hover: secondary image */}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} — alternate view`}
            fill
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Tag badge */}
        {product.tag && (
          <span className="absolute left-3 top-3 bg-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">
            {product.tag}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            {product.category}
          </p>
          <h3 className="mt-0.5 text-sm font-bold uppercase tracking-wide text-black">
            {product.name}
          </h3>
        </div>
        <p className="shrink-0 text-sm font-black text-black">{toNGN(product.price)}</p>
      </div>
    </Link>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  productName: string;
};

export default function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-3">
      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="hidden flex-col gap-2 sm:flex">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-20 w-16 overflow-hidden bg-zinc-100 transition-opacity ${
                i === active ? "opacity-100 ring-1 ring-black" : "opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={src}
                alt={`${productName} view ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative flex-1 aspect-[3/4] overflow-hidden bg-zinc-100">
        <Image
          src={images[active]}
          alt={`${productName} — view ${active + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 55vw"
          priority
        />

        {/* Mobile dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 sm:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === active ? "bg-black" : "bg-zinc-400"
                }`}
                aria-label={`View ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

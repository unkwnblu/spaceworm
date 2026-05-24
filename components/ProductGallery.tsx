"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  productName: string;
};

export default function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (i: number) => setActive(Math.max(0, Math.min(i, images.length - 1))),
    [images.length]
  );

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }

  function handleTouchEnd() {
    const threshold = 50;
    if (touchDeltaX.current < -threshold) {
      goTo(active + 1); // swipe left → next
    } else if (touchDeltaX.current > threshold) {
      goTo(active - 1); // swipe right → prev
    }
    touchDeltaX.current = 0;
  }

  return (
    <div className="flex gap-3">
      {/* Thumbnail strip — desktop only */}
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

      {/* Main image — swipeable on mobile */}
      <div
        ref={containerRef}
        className="relative flex-1 aspect-[3/4] overflow-hidden bg-zinc-100 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  i === active ? "bg-black scale-110" : "bg-zinc-400"
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

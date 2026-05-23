"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

type Slide = {
  image: string;
  eyebrow: string;
  title: React.ReactNode;
  cta: { label: string; href: string };
};

const SLIDES: Slide[] = [
  {
    image: "/hero-3.jpg",
    eyebrow: "Spring / Summer 2026",
    title: (<>No Signal.<br />No Noise.</>),
    cta: { label: "Shop the Collection", href: "/all" },
  },
  {
    image: "/hero-2.jpg",
    eyebrow: "Drop 002 — Hollow",
    title: (<>Built for<br />the Quiet Ones.</>),
    cta: { label: "View the Drop", href: "/drops" },
  },
  {
    image: "/hero-1.jpg",
    eyebrow: "Events",
    title: (<>No Signal<br />Pop-Up · Lagos.</>),
    cta: { label: "RSVP", href: "/events" },
  },
];

const AUTOPLAY_MS = 6000;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);
  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      className="relative flex h-screen min-h-[600px] w-full items-end overflow-hidden bg-zinc-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides — crossfade */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.image}
            alt={slide.eyebrow}
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Top gradient — ensures nav stays legible over bright imagery */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />

      {/* Bottom gradient — keeps headline readable */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

      {/* Content — per-slide */}
      <div className="relative z-20 w-full px-6 pb-20 md:px-12 md:pb-24">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none absolute inset-x-6 bottom-20 opacity-0 md:inset-x-12 md:bottom-24"
            }`}
            aria-hidden={i !== index}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-300">
              {slide.eyebrow}
            </p>
            <h1 className="mb-8 max-w-2xl text-5xl font-black uppercase leading-none tracking-tight text-white md:text-7xl lg:text-8xl">
              {slide.title}
            </h1>
            <Link
              href={slide.cta.href}
              className="inline-block bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-black transition-colors hover:bg-zinc-100"
            >
              {slide.cta.label}
            </Link>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center border border-white/30 bg-black/20 p-3 text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-black/40 md:flex"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center border border-white/30 bg-black/20 p-3 text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-black/40 md:flex"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot indicators + counter */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-4 md:bottom-8 md:right-12">
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-0.5 transition-all duration-300 ${
                i === index ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
        <span className="hidden text-[10px] font-black uppercase tracking-[0.3em] text-white/80 md:inline">
          {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/types/brand";
import { Button } from "../ui/button";

interface BrandsGridProps {
  title?: string;
  subtitle?: string;
  showFeaturedOnly?: boolean;
  limit?: number;
}

export default function BrandsGrid({
  title = "Shop by Club",
  subtitle = "Official Kits",
  showFeaturedOnly = false,
  limit,
}: BrandsGridProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/brands");
        if (!res.ok) throw new Error("Failed to fetch brands");
        const data: Brand[] = await res.json();
        let filtered = showFeaturedOnly ? data.filter((b) => b.featured) : data;
        if (limit) filtered = filtered.slice(0, limit);
        setBrands(filtered);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [showFeaturedOnly, limit]);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [brands]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("article")?.offsetWidth ?? 220;
    el.scrollBy({
      left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
      behavior: "smooth",
    });
  };

  if (error) {
    return (
      <section className="w-full py-4 px-4 bg-[#0a0a0a]">
        <p className="text-center text-sm text-red-400">{error}</p>
      </section>
    );
  }

  const titleParts = title.split(" ");
  const lastWord = titleParts.pop();
  const firstWords = titleParts.join(" ");

  return (
    <section className="w-full py-10 px-4 bg-primary">
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto mb-8 flex items-end justify-between gap-4">
        <div>
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
            <span className="text-lg font-serif tracking-tighter text-white italic">
              {subtitle}
            </span>
          </div>
          {/* Title */}
          <h2 className="text-3xl md:text-2xl  tracking-tighter uppercase leading-none text-white">
            {firstWords}{" "}
            <span className="text-secondary font-black">{lastWord}</span>
          </h2>
        </div>

        {/* Scroll arrows — desktop */}
        <div className="hidden md:flex items-center gap-2">
          {(["left", "right"] as const).map((dir) => {
            const active = dir === "left" ? canScrollLeft : canScrollRight;
            return (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                disabled={!active}
                aria-label={`Scroll ${dir}`}
                className="w-9 h-9 flex items-center justify-center transition-all duration-200 disabled:opacity-20 disabled:pointer-events-none"
                style={{
                  border: `1px solid ${active ? "#16a34a" : "rgba(255,255,255,0.15)"}`,
                  color: active ? "#16a34a" : "rgba(255,255,255,0.3)",
                  background: "transparent",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  {dir === "left" ? (
                    <path
                      d="M9 2L5 7l4 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M5 2l4 5-4 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Scrollable strip ── */}
      <div className="relative max-w-7xl mx-auto">
        {/* Mobile fade + arrow */}
        {(["left", "right"] as const).map((dir) => {
          const active = dir === "left" ? canScrollLeft : canScrollRight;
          return (
            <div
              key={dir}
              className={`md:hidden absolute ${dir === "left" ? "left-0" : "right-0"} top-0 bottom-0 z-10
                flex items-center transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <div
                className={`absolute ${dir}-0 top-0 bottom-0 w-12`}
                style={{
                  background: `linear-gradient(to ${dir === "left" ? "right" : "left"}, #0a0a0a, transparent)`,
                }}
              />
              <button
                onClick={() => scroll(dir)}
                aria-label={`Scroll ${dir}`}
                className={`relative z-10 ${dir === "left" ? "ml-1" : "mr-1"} w-8 h-8 flex items-center justify-center`}
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#16a34a",
                  background: "transparent",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  {dir === "left" ? (
                    <path
                      d="M9 2L5 7l4 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M5 2l4 5-4 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </button>
            </div>
          );
        })}

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",

          }}
          onMouseLeave={() => {
            setHoveredId(null);
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[200px]  min-h-[220px] animate-pulse"
                  style={{ scrollSnapAlign: "start", background: "#1a1a1a" }}
                />
              ))
            : brands.map((brand, idx) => {
                const isHighlighted =
                  hoveredId === brand._id ||
                  (!hoveredId && activeId === brand._id);
                const isDimmed = (hoveredId || activeId) && !isHighlighted;

                return (
<Link
  key={brand._id}
  href={`/products?brands=${brand.slug?.current}`}
  className="flex-shrink-0"
  style={{ scrollSnapAlign: "start" }}
>
  <article
    className="group relative w-[220px] h-[300px] overflow-hidden rounded-2xl cursor-pointer transition-all duration-500"
    style={{
      opacity: isDimmed ? 0.35 : 1,
      transform: isHighlighted ? "translateY(-6px)" : "translateY(0)",
      boxShadow: isHighlighted
        ? "0 20px 40px -12px rgba(22,163,74,0.55), 0 0 0 1.5px #16a34a"
        : "0 10px 30px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
      background: "#0b0f0c",
    }}
    onMouseEnter={() => setHoveredId(brand._id)}
    onTouchStart={() =>
      setActiveId((prev) => (prev === brand._id ? null : brand._id))
    }
  >
    {/* BG layer: image fills card (blurred) */}
    {brand.logo ? (
      <Image
        src={brand.logo}
        alt=""
        aria-hidden="true"
        fill
        sizes="220px"
        className="object-cover scale-125 blur-xl transition-transform duration-700 group-hover:scale-150"
        style={{ filter: "blur(24px) saturate(1.3) brightness(0.8)" }}
      />
    ) : (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, #16a34a 0%, #052e16 60%, #0b0f0c 100%)",
        }}
      />
    )}

    {/* Sharp logo on top */}
    <div className="absolute inset-x-0 top-0 h-[58%] flex items-center justify-center p-8">
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt={brand.logoAlt || brand.name}
          fill
          sizes="220px"
          className="object-contain p-8 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <span className="text-6xl font-black uppercase tracking-tighter text-white/80">
          {brand.name.slice(0, 3)}
        </span>
      )}
    </div>

    {/* Overlay gradient */}
    <div
      className="absolute inset-0 transition-opacity duration-500"
      style={{
        background: isHighlighted
          ? "linear-gradient(to top, rgba(5,46,22,0.97) 0%, rgba(22,163,74,0.55) 45%, rgba(22,163,74,0.1) 100%)"
          : "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 100%)",
      }}
    />

    {/* Pitch line texture */}
    <div
      className="absolute top-0 inset-x-0 h-px"
      style={{
        background:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0, rgba(255,255,255,0.25) 6px, transparent 6px, transparent 12px)",
      }}
    />

    {/* Featured badge */}
    {brand.featured && (
      <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-[#16a34a] px-2.5 py-1 text-[9px] font-bold tracking-wide text-white shadow-lg">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
        </svg>
        Featured
      </span>
    )}

    {/* Website button (no nested <a>) */}
    {brand.website && (
      <button
        type="button"
        aria-label="Visit website"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(brand.website, "_blank", "noopener,noreferrer");
        }}
        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-black"
      >
        <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
          <path
            d="M5 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8M8 1h4m0 0v4m0-4L5.5 7.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    )}

    {/* Glass info panel */}
    <div className="absolute inset-x-2 bottom-2 rounded-xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-md">
      <h3 className="text-sm font-black uppercase leading-tight tracking-tight text-white">
        {brand.name}
      </h3>

      {(brand.country || brand.establishedYear) && (
        <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-white/60">
          {brand.country && <span>{brand.country}</span>}
          {brand.country && brand.establishedYear && <span>•</span>}
          {brand.establishedYear && <span>Est. {brand.establishedYear}</span>}
        </p>
      )}

      {brand.description && (
        <p
          className="mt-1.5 text-[11px] leading-snug text-white/70 line-clamp-2"
          style={{ fontFamily: "-apple-system, sans-serif" }}
        >
          {brand.description}
        </p>
      )}

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wide text-white">
          Shop products
        </span>
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1"
          style={{ background: isHighlighted ? "#ffffff" : "#16a34a" }}
        >
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
            <path
              d="M2.5 7h9M7.5 3l4 4-4 4"
              stroke={isHighlighted ? "#16a34a" : "#ffffff"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  </article>
</Link>
                );
              })}
        </div>
      </div>

      {!loading && brands.length === 0 && (
        <p className="text-center text-sm py-16 text-white/30">
          No brands found.
        </p>
      )}
    </section>
  );
}

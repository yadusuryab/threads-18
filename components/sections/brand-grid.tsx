'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Brand } from '@/components/types/brand';
import { Button } from '../ui/button';

interface BrandsGridProps {
  title?: string;
  subtitle?: string;
  showFeaturedOnly?: boolean;
  limit?: number;
}

export default function BrandsGrid({
  title = 'Shop by Club',
  subtitle = 'Official Kits',
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
        const res = await fetch('/api/brands');
        if (!res.ok) throw new Error('Failed to fetch brands');
        const data: Brand[] = await res.json();
        let filtered = showFeaturedOnly ? data.filter((b) => b.featured) : data;
        if (limit) filtered = filtered.slice(0, limit);
        setBrands(filtered);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
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
    el.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [brands]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('article')?.offsetWidth ?? 220;
    el.scrollBy({ left: direction === 'left' ? -cardWidth * 2 : cardWidth * 2, behavior: 'smooth' });
  };

  if (error) {
    return (
      <section className="w-full py-4 px-4 bg-[#0a0a0a]">
        <p className="text-center text-sm text-red-400">{error}</p>
      </section>
    );
  }

  const titleParts = title.split(' ');
  const lastWord = titleParts.pop();
  const firstWords = titleParts.join(' ');

  return (
    <section className="w-full py-10 px-4 bg-[#0a0a0a]">

      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto mb-8 flex items-end justify-between gap-4">
        <div>
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
            <span className="text-[9px] font-black tracking-[0.35em] uppercase text-green-600">
              {subtitle}
            </span>
          </div>
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none text-white">
            {firstWords}{' '}
            <span className="text-green-500">{lastWord}</span>
          </h2>
          <div className="mt-3 h-[3px] w-9 bg-green-600" />
        </div>

        {/* Scroll arrows — desktop */}
        <div className="hidden md:flex items-center gap-2">
          {(['left', 'right'] as const).map((dir) => {
            const active = dir === 'left' ? canScrollLeft : canScrollRight;
            return (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                disabled={!active}
                aria-label={`Scroll ${dir}`}
                className="w-9 h-9 flex items-center justify-center transition-all duration-200 disabled:opacity-20 disabled:pointer-events-none"
                style={{
                  border: `1px solid ${active ? '#16a34a' : 'rgba(255,255,255,0.15)'}`,
                  color: active ? '#16a34a' : 'rgba(255,255,255,0.3)',
                  background: 'transparent',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  {dir === 'left'
                    ? <path d="M9 2L5 7l4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    : <path d="M5 2l4 5-4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  }
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Scrollable strip ── */}
      <div className="relative max-w-7xl mx-auto">

        {/* Mobile fade + arrow */}
        {(['left', 'right'] as const).map((dir) => {
          const active = dir === 'left' ? canScrollLeft : canScrollRight;
          return (
            <div
              key={dir}
              className={`md:hidden absolute ${dir === 'left' ? 'left-0' : 'right-0'} top-0 bottom-0 z-10
                flex items-center transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <div
                className={`absolute ${dir}-0 top-0 bottom-0 w-12`}
                style={{
                  background: `linear-gradient(to ${dir === 'left' ? 'right' : 'left'}, #0a0a0a, transparent)`,
                }}
              />
              <button
                onClick={() => scroll(dir)}
                aria-label={`Scroll ${dir}`}
                className={`relative z-10 ${dir === 'left' ? 'ml-1' : 'mr-1'} w-8 h-8 flex items-center justify-center`}
                style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#16a34a', background: 'transparent' }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  {dir === 'left'
                    ? <path d="M9 2L5 7l4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    : <path d="M5 2l4 5-4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  }
                </svg>
              </button>
            </div>
          );
        })}

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-0 overflow-x-auto scrollbar-hide"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            borderTop: '3px solid #16a34a',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
          }}
          onMouseLeave={() => { setHoveredId(null); }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[200px] min-h-[220px] animate-pulse"
                  style={{ scrollSnapAlign: 'start', background: '#1a1a1a' }}
                />
              ))
            : brands.map((brand, idx) => {
                const isHighlighted = hoveredId === brand._id || (!hoveredId && activeId === brand._id);
                const isDimmed = (hoveredId || activeId) && !isHighlighted;

                return (
                  <Link key={brand._id} href={`/products?brands=${brand.slug?.current}`}>
                    <article
                      className="relative flex flex-col flex-shrink-0 w-[200px] p-4 transition-all duration-300 group cursor-pointer"
                      style={{
                        scrollSnapAlign: 'start',
                        background: isHighlighted ? '#16a34a' : '#111111',
                        opacity: isDimmed ? 0.35 : 1,
                        borderRight: idx < brands.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                        minHeight: 220,
                      }}
                      onMouseEnter={() => setHoveredId(brand._id)}
                      onTouchStart={() =>
                        setActiveId((prev) => (prev === brand._id ? null : brand._id))
                      }
                    >
                      {/* Subtle pitch-line texture at top */}
                      <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{
                          background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 6px, transparent 6px, transparent 12px)',
                        }}
                      />

                      {/* Featured badge */}
                      {brand.featured && (
                        <span
                          className="absolute top-2.5 right-2.5 text-[7px] font-black tracking-[0.25em] uppercase px-2 py-0.5"
                          style={{
                            background: isHighlighted ? '#ffffff' : '#16a34a',
                            color: isHighlighted ? '#16a34a' : '#ffffff',
                          }}
                        >
                          Featured
                        </span>
                      )}

                      {/* Logo */}
                      <div
                        className="relative w-full mb-4 flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{
                          height: 72,
                          borderBottom: `1px solid ${isHighlighted ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                          paddingBottom: 12,
                        }}
                      >
                        {brand.logo ? (
                          <Image
                            src={brand.logo}
                            alt={brand.logoAlt || brand.name}
                            fill
                            className="object-contain p-2 transition-all duration-300"
                            style={{ filter: isHighlighted ? 'brightness(1.1)' : 'brightness(0.7)' }}
                            sizes="200px"
                          />
                        ) : (
                          <span
                            className="text-2xl font-black uppercase leading-none tracking-tighter"
                            style={{ color: isHighlighted ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)' }}
                          >
                            {brand.name.slice(0, 3)}
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="flex flex-col flex-1 gap-1">
                        <h3
                          className="text-sm font-black uppercase tracking-tight leading-snug"
                          style={{ color: '#ffffff' }}
                        >
                          {brand.name}
                        </h3>

                        {(brand.country || brand.establishedYear) && (
                          <p
                            className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.15em] uppercase"
                            style={{ color: isHighlighted ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}
                          >
                            {brand.country && <span>{brand.country}</span>}
                            {brand.country && brand.establishedYear && <span>·</span>}
                            {brand.establishedYear && <span>Est. {brand.establishedYear}</span>}
                          </p>
                        )}

                        {brand.description && (
                          <p
                            className="mt-1 text-[0.7rem] leading-relaxed line-clamp-2"
                            style={{
                              color: isHighlighted ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.3)',
                              fontFamily: '-apple-system, sans-serif',
                              fontWeight: 400,
                            }}
                          >
                            {brand.description}
                          </p>
                        )}

                        {/* Footer */}
                        <div
                          className="flex items-center justify-between mt-auto pt-3"
                          style={{
                            borderTop: `1px solid ${isHighlighted ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                          }}
                        >
                          <span
                            className="inline-flex items-center gap-1.5 text-[8px] font-black tracking-[0.2em] uppercase"
                            style={{ color: isHighlighted ? '#ffffff' : '#16a34a' }}
                          >
                            View
                            <svg width="11" height="11" viewBox="0 0 14 14" fill="none"
                              className="transition-transform duration-200 group-hover:translate-x-0.5">
                              <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>

                          {brand.website && (
                            <a
                              href={brand.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Visit website"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-center w-6 h-6 transition-all duration-200"
                              style={{
                                border: `1px solid ${isHighlighted ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)'}`,
                                color: isHighlighted ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                              }}
                            >
                              <svg width="10" height="10" viewBox="0 0 13 13" fill="none">
                                <path d="M5 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8M8 1h4m0 0v4m0-4L5.5 7.5"
                                  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
        </div>
      </div>

      {!loading && brands.length === 0 && (
        <p className="text-center text-sm py-16 text-white/30">No brands found.</p>
      )}
    </section>
  );
}
'use client'

import React, { useEffect, useRef, useState } from 'react'
import CategoryCard from '../cards/category-card'
import { ArrowUpRight } from 'lucide-react'

export type Category = {
  name: string
  image: string
  slug: string
  productCount?: number
}

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[200px] sm:w-[240px] h-[280px] sm:h-[320px] overflow-hidden bg-neutral-100 relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_ease-in-out_infinite]
        bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  )
}

function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch('/api/categories')
        if (!res.ok) throw new Error(`${res.status}`)
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('Invalid data')
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed')
        setCategories([
          { name: 'Home Kits',   image: '/category-home.avif',    slug: 'home-kits' },
          { name: 'Away Kits',   image: '/category-away.avif',    slug: 'away-kits' },
          { name: 'Goalkeeper', image: '/category-gk.avif',      slug: 'goalkeeper' },
          { name: 'Training',   image: '/category-training.avif', slug: 'training' },
        ])
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const updateProgress = () => {
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0)
  }

  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragScrollLeft = useRef(0)

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    isDragging.current = true
    dragStartX.current = e.pageX - scrollRef.current.offsetLeft
    dragScrollLeft.current = scrollRef.current.scrollLeft
    scrollRef.current.style.cursor = 'grabbing'
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    scrollRef.current.scrollLeft = dragScrollLeft.current - (x - dragStartX.current)
  }
  const stopDrag = () => {
    isDragging.current = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }

  const delay = (i: number) => `${i * 80}ms`

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .cat-view-btn:hover { background: #16a34a; color: #fff; }
        .cat-card-wrap { position: relative; }
        .cat-card-wrap::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: #16a34a;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .cat-card-wrap:hover::after { transform: scaleX(1); }
      `}</style>

      <section ref={sectionRef} className="relative py-10 overflow-hidden bg-white">

        {/* ── Header ── */}
        <div className="max-w-7xl mx-auto flex items-end justify-between gap-4 mb-8 px-4 sm:px-6">
          <div>
            {/* Eyebrow */}
            <div
              className="flex items-center gap-2 mb-3"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
              <span className="text-[9px] font-black tracking-[0.35em] uppercase text-green-600">
                Shop by Category
              </span>
            </div>

            {/* Title */}
            <h2
              className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-none text-neutral-900"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.55s ease 0.08s, transform 0.55s ease 0.08s',
              }}
            >
              Find Your <span className="text-green-600">Kit.</span>
            </h2>

            {/* Accent bar */}
            <div
              className="mt-3 h-[3px] w-9 bg-green-600"
              style={{
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.5s ease 0.12s',
              }}
            />
          </div>

          {/* View all CTA */}
          <a
            href="/products"
            className="cat-view-btn flex items-center gap-1.5 text-[9px] font-black tracking-[0.2em] uppercase
              text-green-600 border border-green-600 px-3 py-2 transition-all duration-200 whitespace-nowrap"
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.5s ease 0.15s, background 0.2s, color 0.2s',
            }}
          >
            All Kits <ArrowUpRight size={11} />
          </a>
        </div>

        {/* ── Scroll track ── */}
        <div
          ref={scrollRef}
          className="cat-scroll flex gap-3 overflow-x-auto px-4 sm:px-6 pb-1 cursor-grab select-none"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onScroll={updateProgress}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : categories.length > 0
              ? categories.map((cat, i) => (
                <div
                  key={cat.slug}
                  className="cat-card-wrap"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `opacity 0.55s ease ${delay(i)}, transform 0.55s ease ${delay(i)}`,
                  }}
                >
                  <CategoryCard {...cat} />
                </div>
              ))
              : (
                <p className="text-sm text-neutral-400 py-12 w-full text-center">
                  No categories available
                </p>
              )
          }
          <div className="flex-shrink-0 w-4" />
        </div>

        {/* ── Right fade — white ── */}
        <div className="absolute top-0 right-0 bottom-0 w-16 pointer-events-none z-10
          bg-gradient-to-l from-white to-transparent" />

        {/* ── Progress bar ── */}
        {categories.length > 1 && (
          <div className="flex justify-center mt-5 px-4">
            <div className="relative h-[3px] w-24 bg-neutral-100 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-150 ease-out"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && process.env.NODE_ENV === 'development' && (
          <div className="mx-4 mt-3 p-2.5 bg-amber-50 border border-amber-200">
            <p className="text-amber-700 text-xs">Using fallback: {error}</p>
          </div>
        )}
      </section>
    </>
  )
}

export default CategorySection
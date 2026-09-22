'use client'

import Link from 'next/link'
import { ArrowUpRight, Star } from 'lucide-react'

function ReviewsTeaser() {
  return (
    <section className="relative py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
            <span className="text-[9px] font-black tracking-[0.35em] uppercase text-green-600">
              What They Say
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-none text-neutral-900">
            Loved By <span className="text-green-600">Customers.</span>
          </h2>

          <div className="mt-3 h-[3px] w-9 bg-green-600" />

          <div className="flex items-center gap-1 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className="fill-green-600 text-green-600" />
            ))}
            <span className="text-xs font-bold text-neutral-500 ml-2">4.8/5 · 2k+ reviews</span>
          </div>
        </div>

        <Link
          href="/reviews"
          className="reviews-view-btn flex items-center gap-1.5 text-[9px] font-black tracking-[0.2em] uppercase
            text-green-600 border border-green-600 px-3 py-2 transition-all duration-200 whitespace-nowrap"
        >
          All Reviews <ArrowUpRight size={11} />
        </Link>
      </div>

      <style>{`
        .reviews-view-btn:hover { background: #16a34a; color: #fff; }
      `}</style>
    </section>
  )
}

export default ReviewsTeaser
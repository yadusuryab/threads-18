"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "../cards/product-card";
import { Product } from "@/lib/queries/product";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="w-full aspect-[3/4] bg-neutral-100 overflow-hidden relative">
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_ease-in-out_infinite]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
        />
      </div>
      <div className="h-2.5 w-3/4 bg-neutral-100" />
      <div className="h-2.5 w-1/3 bg-neutral-100" />
    </div>
  );
}

type Props = {
  products: Product[];
  title?: string;
  desc?: string;
  showViewAll?: boolean;
  deskCols?: number;
};

function ProductsSection({
  products,
  title = "Explore",
  desc = "",
  showViewAll = false,
  deskCols = 4,
}: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const colClass: Record<number, string> = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
  };

  const titleWords = title.trim().split(" ");
  const lastWord = titleWords.pop();
  const firstWords = titleWords.join(" ");

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }
        .ps-viewall:hover { background: #16a34a; color: #fff; border-color: #16a34a; }
      `}</style>

      <section className="py-10 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">

          {/* ── Header ── */}
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
                <span className="text-[9px] font-black tracking-[0.35em] uppercase text-green-600">
                  {desc || "Products"}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-none text-neutral-900">
                {firstWords}{firstWords ? " " : ""}
                <span className="text-green-600">{lastWord}</span>
              </h2>

              {/* Accent bar */}
              <div className="mt-3 h-[3px] w-9 bg-green-600" />
            </div>

            {/* View all — top right */}
            {showViewAll && (
              <Link
                href="/products"
                className="ps-viewall flex items-center gap-1.5 text-[9px] font-black tracking-[0.2em] uppercase
                  text-green-600 border border-green-600 px-3 py-2 transition-all duration-200 whitespace-nowrap"
              >
                View all <ArrowRight size={11} />
              </Link>
            )}
          </div>

          {/* ── Grid ── */}
          <div
            className={cn(
              "grid grid-cols-2 gap-3 sm:gap-4 mb-8",
              colClass[deskCols] ?? "md:grid-cols-4"
            )}
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : products.length === 0 ? (
              <p className="col-span-full text-center text-sm text-neutral-400 py-16 tracking-wide">
                No products found.
              </p>
            ) : (
              products.map((prod) => (
                <div key={prod._id}>
                  <ProductCard
                    id={prod._id}
                    name={prod.name}
                    rating={prod.rating}
                    imageUrl={prod.image}
                    price={prod.price}
                    salesPrice={prod.salesPrice}
                  />
                </div>
              ))
            )}
          </div>

          {/* ── Bottom CTA ── */}
          {showViewAll && products.length > 0 && !loading && (
            <Link href="/products" className="block">
              <button
                className="ps-viewall w-full py-3.5 text-[10px] font-black tracking-[0.3em] uppercase
                  text-green-600 border border-green-600 flex items-center justify-center gap-2
                  transition-all duration-200"
              >
                View more products
                <ArrowRight size={12} />
              </button>
            </Link>
          )}

        </div>
      </section>
    </>
  );
}

export default ProductsSection;
"use client";

import { CartItem } from "@/components/utils/add-to-cart";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Trash2, X, Plus, Minus, ArrowRight, ShoppingBag, Lock } from "lucide-react";
import { toast } from "sonner";

const GREEN = "#2D5016";
const GOLD = "#C8A84B";
const GREEN_BG = "#f2f4f0";
const GREEN_LIGHT = "#eef1ea";

function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCartQty = (id: string, newQty: number) => {
    if (newQty < 1) return;
    const product = cart.find((item) => item._id === id);
    if (!product) return;
    const limited = Math.min(newQty, product.maxQty);
    const updated = cart.map((item) =>
      item._id === id ? { ...item, cartQty: limited } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    if (limited !== newQty) toast(`Max quantity is ${product.maxQty}`);
  };

  const removeFromCart = (id: string) => {
    setRemoving(id);
    setTimeout(() => {
      const updated = cart.filter((item) => item._id !== id);
      setCart(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
      setRemoving(null);
      toast("Item removed");
    }, 280);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
    toast("Cart cleared");
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.salesPrice ?? item.price) * item.cartQty,
    0
  );

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
    .cart-root { font-family: system-ui, -apple-system, sans-serif; }
    .cart-display { font-family: 'Bebas Neue', sans-serif; }
    @keyframes fadeOut {
      to { opacity: 0; transform: translateX(-16px); }
    }
    .removing { animation: fadeOut 0.28s ease forwards; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  `;

  // ── Skeleton ──
  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: GREEN_BG }}>
        <style>{styles}</style>
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-3 cart-root">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 flex gap-4 animate-pulse"
              style={{ border: `1px solid rgba(45,80,22,0.1)` }}
            >
              <div className="w-20 h-20 rounded-xl shrink-0" style={{ background: GREEN_BG }} />
              <div className="flex-1 space-y-2.5 py-1">
                <div className="h-4 rounded w-2/3" style={{ background: GREEN_BG }} />
                <div className="h-3 rounded w-1/3" style={{ background: GREEN_BG }} />
                <div className="h-8 rounded w-28 mt-3" style={{ background: GREEN_BG }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty ──
  if (cart.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div
          className="min-h-screen flex items-center justify-center p-6 cart-root"
          style={{ background: GREEN_BG }}
        >
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "white", border: `1.5px solid rgba(45,80,22,0.15)` }}
            >
              <ShoppingBag size={32} style={{ color: `rgba(45,80,22,0.25)` }} />
            </div>
            <h2
              className="cart-display mb-1"
              style={{ fontSize: 32, color: GREEN, letterSpacing: "0.02em" }}
            >
              Your Kit Bag is Empty
            </h2>
            <p className="text-sm mb-6" style={{ color: "rgba(0,0,0,0.4)" }}>
              Find your next jersey and rep your team.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-widest uppercase transition-opacity duration-200 hover:opacity-80 rounded-xl"
              style={{ background: GREEN, color: "#fff" }}
            >
              Browse Jerseys <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="cart-root min-h-screen" style={{ background: GREEN_BG }}>
        <div className="max-w-2xl mx-auto px-4 py-7 lg:max-w-5xl">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-6">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-1">
                <span className="block w-4 h-px" style={{ background: GOLD }} />
                <span
                  className="text-[9px] font-bold tracking-[0.3em] uppercase"
                  style={{ color: GOLD }}
                >
                  18 Threads
                </span>
              </div>
              <h1
                className="cart-display leading-none"
                style={{ fontSize: 36, color: GREEN, letterSpacing: "0.02em" }}
              >
                Shopping Cart
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.38)" }}>
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-2 rounded-lg transition-all duration-150"
              style={{ color: "#b91c1c", background: "#fef2f2" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#fee2e2")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fef2f2")}
            >
              <Trash2 size={13} /> Clear all
            </button>
          </div>

          <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-6 lg:items-start">

            {/* ── Cart items ── */}
            <div className="space-y-3 mb-4 lg:mb-0">
              {cart.map((item: any, i) => (
                <div
                  key={item._id}
                  className={`fade-up bg-white rounded-2xl overflow-hidden ${removing === item._id ? "removing" : ""}`}
                  style={{
                    border: `1px solid rgba(45,80,22,0.1)`,
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <div className="flex gap-4 p-4">
                    {/* Image */}
                    <Link href={`/product/${item._id}`} className="shrink-0">
                      <div
                        className="w-20 h-20 rounded-xl overflow-hidden"
                        style={{ background: GREEN_BG, border: `1px solid rgba(45,80,22,0.08)` }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/product/${item._id}`}>
                          <p
                            className="text-sm font-bold leading-snug line-clamp-2 uppercase tracking-tight"
                            style={{ color: "#111111" }}
                          >
                            {item.name}
                          </p>
                        </Link>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150"
                          style={{ color: "rgba(0,0,0,0.3)" }}
                          onMouseEnter={e => {
                            e.currentTarget.style.color = "#b91c1c";
                            e.currentTarget.style.background = "#fef2f2";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = "rgba(0,0,0,0.3)";
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Variants */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {item.size && (
                          <span
                            className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded"
                            style={{ background: GREEN_BG, color: GREEN }}
                          >
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span
                            className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded"
                            style={{ background: GREEN_BG, color: GREEN }}
                          >
                            {item.color}
                          </span>
                        )}
                      </div>

                      {/* Price + qty */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Qty stepper */}
                        <div
                          className="flex items-center gap-1 rounded-lg p-0.5"
                          style={{ background: GREEN_BG, border: `1px solid rgba(45,80,22,0.15)` }}
                        >
                          <button
                            onClick={() => updateCartQty(item._id, item.cartQty - 1)}
                            disabled={item.cartQty <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded-md transition-all duration-150 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ color: GREEN }}
                            onMouseEnter={e => (e.currentTarget.style.background = "white")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                          >
                            <Minus size={12} />
                          </button>
                          <span
                            className="w-7 text-center text-sm font-bold"
                            style={{ color: GREEN }}
                          >
                            {item.cartQty}
                          </span>
                          <button
                            onClick={() => updateCartQty(item._id, item.cartQty + 1)}
                            disabled={item.cartQty >= item.maxQty}
                            className="w-7 h-7 flex items-center justify-center rounded-md transition-all duration-150 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ color: GREEN }}
                            onMouseEnter={e => (e.currentTarget.style.background = "white")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Item total */}
                        <div className="text-right">
                          <p className="text-sm font-black" style={{ color: "#111111" }}>
                            ₹{((item.salesPrice ?? item.price) * item.cartQty)?.toLocaleString("en-IN")}
                          </p>
                          {item.cartQty > 1 && (
                            <p className="text-[10px]" style={{ color: "rgba(0,0,0,0.35)" }}>
                              ₹{(item.salesPrice ?? item.price)?.toLocaleString("en-IN")} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order summary ── */}
            <div className="lg:sticky lg:top-6">
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: `1px solid rgba(45,80,22,0.1)` }}
              >
                {/* Header */}
                <div
                  className="px-5 py-4"
                  style={{ borderBottom: `1px solid rgba(45,80,22,0.08)` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="block w-4 h-px" style={{ background: GOLD }} />
                    <h2
                      className="text-[9px] font-bold tracking-[0.28em] uppercase"
                      style={{ color: GOLD }}
                    >
                      Order Summary
                    </h2>
                  </div>
                </div>

                <div className="px-5 py-4 space-y-3">
                  <div className="flex justify-between text-sm" style={{ color: "rgba(0,0,0,0.45)" }}>
                    <span>Subtotal ({cart.length} item{cart.length !== 1 ? "s" : ""})</span>
                    <span style={{ color: "#111" }}>₹{subtotal?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: "rgba(0,0,0,0.45)" }}>
                    <span>Shipping</span>
                    <span className="font-bold" style={{ color: GREEN }}>Free</span>
                  </div>
                  <div
                    className="pt-3 flex justify-between"
                    style={{ borderTop: `1px solid rgba(45,80,22,0.08)` }}
                  >
                    <span
                      className="text-[9px] font-bold tracking-[0.22em] uppercase self-center"
                      style={{ color: "rgba(0,0,0,0.4)" }}
                    >
                      Total
                    </span>
                    <span
                      className="cart-display"
                      style={{ fontSize: 28, color: GREEN, letterSpacing: "0.02em" }}
                    >
                      ₹{subtotal?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="px-5 pb-5 space-y-2.5">
                  <Link href="/checkout" className="block">
                    <button
                      className="w-full py-3.5 text-[11px] font-bold tracking-[0.22em] uppercase rounded-xl flex items-center justify-center gap-2 transition-opacity duration-150 hover:opacity-85 active:scale-[0.98]"
                      style={{ background: GOLD, color: "#1a2e00" }}
                    >
                      <Lock size={13} />
                      Proceed to Checkout
                      <ArrowRight size={13} />
                    </button>
                  </Link>
                  <Link href="/products" className="block">
                    <button
                      className="w-full py-3 text-[11px] font-bold tracking-[0.18em] uppercase rounded-xl transition-all duration-150 active:scale-[0.98]"
                      style={{
                        border: `1.5px solid ${GREEN}`,
                        color: GREEN,
                        background: "transparent",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = GREEN_BG)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      Continue Shopping
                    </button>
                  </Link>

                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    <Lock size={11} style={{ color: "rgba(0,0,0,0.3)" }} />
                    <span className="text-[10px]" style={{ color: "rgba(0,0,0,0.3)" }}>
                      Secure & encrypted checkout
                    </span>
                  </div>
                </div>
              </div>

              {/* Free shipping badge */}
              <div
                className="mt-3 rounded-xl px-4 py-3 flex items-center gap-2.5"
                style={{
                  background: GREEN_LIGHT,
                  border: `1px solid rgba(45,80,22,0.2)`,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" className="w-4 h-4 shrink-0">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <p className="text-xs font-semibold" style={{ color: GREEN }}>
                  You qualify for free shipping on this order!
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;
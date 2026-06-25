// app/checkout/page.tsx
"use client";

import { AlertCircle, ChevronDown, ChevronUp, Lock, Shield, Truck, MessageCircle, Tag } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkoutSchema } from "@/lib/validations";
import Link from "next/link";

// ── Brand tokens ───────────────────────────────────────────────
const GREEN      = "#2D5016";
const GREEN_DARK = "#1a2e00";
const GOLD       = "#C8A84B";
const GOLD_LIGHT = "#E8D48A";
const GREEN_BG   = "#f2f4f0";
const GREEN_MID  = "#eef1ea";

type CartItem = {
  _id: string;
  name: string;
  salesPrice: number;
  cartQty: number;
  size?: string | null;
  color?: string | null;
  image: string;
  slug?: string | null;
};

type FormData = z.infer<typeof checkoutSchema>;

// ── Field wrapper ──────────────────────────────────────────────
function Field({ label, id, error, children }: {
  label: string; id: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-[9px] font-bold tracking-[0.22em] uppercase"
        style={{ color: "rgba(0,0,0,0.38)" }}
      >
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full h-10 px-3 text-sm rounded-lg bg-white outline-none transition-all duration-150
   placeholder:text-black/20 text-black
   ${err
     ? "border border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-400/20"
     : "border border-black/10 hover:border-black/20 focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10"
   }`;

const OFFER_PRICE   = 1499;
const OFFER_COD_FEE = 150;
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_PHONE ?? "";
const APP_URL         = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const APP_NAME        = process.env.NEXT_PUBLIC_APP_NAME ?? "18 Threads";

function CheckoutInner() {
  const [cart, setCart]                   = useState<CartItem[]>([]);
  const [isOffer, setIsOffer]             = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [summaryOpen, setSummaryOpen]     = useState(false);
  const router       = useRouter();
  const searchParams = useSearchParams();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    const offerFlag = searchParams.get("offer") === "true";
    setIsOffer(offerFlag);
    setCart(
      offerFlag
        ? JSON.parse(localStorage.getItem("offerCart") || "[]")
        : JSON.parse(localStorage.getItem("cart")      || "[]")
    );
  }, [searchParams]);

  const rawSubtotal = cart.reduce((a, i) => a + i.salesPrice * i.cartQty, 0);
  const subtotal    = isOffer ? OFFER_PRICE : rawSubtotal;
  const shipping    = paymentMethod === "online" ? 0 : isOffer ? OFFER_COD_FEE : 150;
  const total       = subtotal + shipping;

  const deliveryTime = paymentMethod === "online"
    ? "Kerala: 2–3 days · Outside Kerala: 6–7 days"
    : "Delivery in 7 days";

  const buildMessage = (data: FormData) => {
    const lines: string[] = [];
    lines.push(`🛍️ *New Order — ${APP_NAME}*`);
    lines.push(`━━━━━━━━━━━━━━━━━`);
    if (isOffer) lines.push(`🎁 *BOGO OFFER — Buy 1 Get 1 Free*`);
    lines.push(`\n📦 *Products:*`);
    cart.forEach((item, i) => {
      const freeLabel = isOffer && i === 1 ? " *(FREE)*" : "";
      lines.push(`${i + 1}. ${item.name}${freeLabel} × ${item.cartQty}`);
      if (item.size)  lines.push(`   📏 Size: ${item.size}`);
      if (item.color) lines.push(`   🎨 Colour: ${item.color}`);
      if (!isOffer)   lines.push(`   💵 ₹${item.salesPrice * item.cartQty}`);
      if (APP_URL) lines.push(`   🔗 ${APP_URL}/product/${item.slug || item._id}`);
    });
    lines.push(`\n💰 *Order Total:*`);
    if (isOffer) {
      lines.push(`Offer price: ₹1,499`);
      lines.push(paymentMethod === "online" ? "Shipping: Free" : `COD fee: ₹${OFFER_COD_FEE}`);
      lines.push(`*Total: ₹${total}*`);
    } else {
      lines.push(`Subtotal: ₹${rawSubtotal}`);
      lines.push(shipping === 0 ? "Shipping: Free" : `COD charges: ₹${shipping}`);
      lines.push(`*Total: ₹${total}*`);
    }
    lines.push(`💳 Payment: ${paymentMethod === "online" ? "Online (UPI/Card)" : "Cash on Delivery"}`);
    lines.push(`\n👤 *Customer:*`);
    lines.push(`Name: ${data.customerName}`);
    lines.push(`Phone: ${data.phoneNumber}`);
    if (data.alternatePhone) lines.push(`Alt: ${data.alternatePhone}`);
    if (data.instagramId)    lines.push(`Instagram: ${data.instagramId}`);
    lines.push(`\n📍 *Address:*`);
    lines.push(data.address);
    lines.push(`${data.district}, ${data.state} — ${data.pincode}`);
    if (data.landmark) lines.push(`Landmark: ${data.landmark}`);
    lines.push(`\n━━━━━━━━━━━━━━━━━`);
    return encodeURIComponent(lines.join("\n"));
  };

  const handleOrder = (data: FormData) => {
    const msg = buildMessage(data);
    localStorage.removeItem(isOffer ? "offerCart" : "cart");
    if (isOffer) localStorage.removeItem("offerFirst");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
    .co-root { font-family: system-ui, -apple-system, sans-serif; }
    .co-display { font-family: 'Bebas Neue', sans-serif; }
    @keyframes slideDown {
      from { opacity:0; transform:translateY(-8px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .slide-down { animation: slideDown 0.25s ease both; }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
    .radio-card { transition: all 0.15s; }
    .radio-card:hover { border-color: rgba(45,80,22,0.35); }
    .radio-card.active { border-color: ${GREEN}; background: ${GREEN_MID}; box-shadow: 0 0 0 1px ${GREEN}; }
  `;

  // ── Empty ──
  if (cart.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="co-root min-h-screen flex items-center justify-center p-4" style={{ background: GREEN_BG }}>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "white", border: `1.5px solid rgba(45,80,22,0.15)` }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.5" className="w-7 h-7" style={{ opacity: 0.4 }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <h2 className="co-display mb-1" style={{ fontSize: 32, color: GREEN, letterSpacing: "0.02em" }}>
              Nothing to Checkout
            </h2>
            <p className="text-sm mb-5" style={{ color: "rgba(0,0,0,0.4)" }}>
              Add jerseys to your cart before checking out.
            </p>
            <button
              onClick={() => router.push("/products")}
              className="px-6 py-3 text-[11px] font-bold tracking-[0.22em] uppercase rounded-xl transition-opacity duration-150 hover:opacity-80"
              style={{ background: GREEN, color: "white" }}
            >
              Browse Jerseys
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="co-root min-h-screen" style={{ background: GREEN_BG }}>

        {/* ── Top bar ── */}
        <div className="bg-white px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid rgba(45,80,22,0.1)` }}>
          <div className="flex items-center gap-2.5">
            {/* Logo mark */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center co-display"
              style={{ background: GREEN, color: GOLD, fontSize: 14, letterSpacing: "0.02em" }}
            >
              18
            </div>
            <span className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: GREEN }}>
              {APP_NAME}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isOffer && (
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1"
                style={{ background: `rgba(200,168,75,0.12)`, border: `1px solid rgba(200,168,75,0.3)` }}
              >
                <Tag size={11} style={{ color: GOLD }} />
                <span className="text-[11px] font-bold" style={{ color: GOLD }}>BOGO — ₹1,499</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Lock size={11} style={{ color: GREEN }} />
              <span className="text-[10px] font-medium" style={{ color: "rgba(0,0,0,0.4)" }}>Secure Checkout</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto lg:flex lg:min-h-[calc(100vh-52px)]">

          {/* ══ LEFT — order summary ══════════════════════════════════════════ */}
          <div className="lg:w-[380px] lg:min-h-full lg:shrink-0" style={{ background: GREEN }}>

            {/* Mobile toggle */}
            <button
              className="lg:hidden w-full flex items-center justify-between px-4 py-3.5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "white" }}
              onClick={() => setSummaryOpen(o => !o)}
            >
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" style={{ opacity: 0.5 }}>
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <span className="text-sm font-medium">{summaryOpen ? "Hide" : "Show"} order summary</span>
                {summaryOpen ? <ChevronUp size={15} style={{ opacity: 0.5 }} /> : <ChevronDown size={15} style={{ opacity: 0.5 }} />}
              </div>
              <span className="co-display" style={{ fontSize: 22, color: GOLD, letterSpacing: "0.02em" }}>₹{total}</span>
            </button>

            <div className={`${summaryOpen ? "slide-down" : "hidden"} lg:block p-5 lg:p-8 lg:sticky lg:top-0`}>

              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-6">
                <span className="block w-4 h-px" style={{ background: GOLD }} />
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: GOLD }}>
                  Your Order
                </span>
              </div>

              {isOffer && (
                <div
                  className="mb-5 flex items-center gap-2.5 rounded-xl px-3.5 py-3"
                  style={{ background: "rgba(200,168,75,0.1)", border: `1px solid rgba(200,168,75,0.25)` }}
                >
                  <Tag size={14} style={{ color: GOLD }} className="shrink-0" />
                  <div>
                    <p className="text-xs font-bold" style={{ color: GOLD }}>Buy 1 Get 1 Free</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Special offer price applied</p>
                  </div>
                </div>
              )}

              {/* Cart items */}
              <div className="space-y-4 mb-6">
                {cart.map((item, idx) => (
                  <div key={`${item._id}-${idx}`} className="flex gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={item.image} alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                      />
                      <span
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                        style={{ background: GOLD, color: GREEN_DARK }}
                      >
                        {item.cartQty}
                      </span>
                      {isOffer && idx === 1 && (
                        <span
                          className="absolute -bottom-1.5 -left-1.5 text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none"
                          style={{ background: GOLD, color: GREEN_DARK }}
                        >
                          FREE
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold uppercase tracking-tight truncate leading-snug" style={{ color: "rgba(255,255,255,0.9)" }}>
                        {item.name}
                      </p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        {item.size  && (
                          <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>
                            {item.color}
                          </span>
                        )}
                      </div>
                      {APP_URL && (
                        <a
                          href={`${APP_URL}/product/${item.slug || item._id}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 text-[10px] transition-colors"
                          style={{ color: "rgba(255,255,255,0.28)" }}
                          onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
                        >
                          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                            <path d="M4 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8M7 1h4m0 0v4m0-4L5 7"
                              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          View product
                        </a>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      {isOffer && idx === 1 ? (
                        <>
                          <span className="text-[11px] line-through block" style={{ color: "rgba(255,255,255,0.22)" }}>₹{item.salesPrice}</span>
                          <span className="text-xs font-bold" style={{ color: GOLD }}>FREE</span>
                        </>
                      ) : (
                        <span className="text-sm font-black" style={{ color: "rgba(255,255,255,0.85)" }}>
                          ₹{item.salesPrice * item.cartQty}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginBottom: 16 }} />

              {/* Totals */}
              <div className="space-y-2.5 text-sm">
                {isOffer ? (
                  <>
                    <div className="flex justify-between" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <span>Original value</span>
                      <span className="line-through" style={{ color: "rgba(255,255,255,0.22)" }}>₹{rawSubtotal}</span>
                    </div>
                    <div className="flex justify-between" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <span>Offer price</span>
                      <span style={{ color: "rgba(255,255,255,0.7)" }}>₹1,499</span>
                    </div>
                    <div className="flex justify-between" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <span>{paymentMethod === "online" ? "Shipping" : "COD charges"}</span>
                      <span style={{ color: paymentMethod === "online" ? GOLD : "rgba(255,255,255,0.7)", fontWeight: paymentMethod === "online" ? 700 : 400 }}>
                        {paymentMethod === "online" ? "Free" : `₹${OFFER_COD_FEE}`}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <span>Subtotal</span>
                      <span style={{ color: "rgba(255,255,255,0.7)" }}>₹{rawSubtotal}</span>
                    </div>
                    <div className="flex justify-between" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <span>{paymentMethod === "online" ? "Shipping" : "COD charges"}</span>
                      <span style={{ color: shipping === 0 ? GOLD : "rgba(255,255,255,0.7)", fontWeight: shipping === 0 ? 700 : 400 }}>
                        {shipping === 0 ? "Free" : `₹${shipping}`}
                      </span>
                    </div>
                  </>
                )}

                {/* Total */}
                <div className="pt-3 flex justify-between items-baseline" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>Total</span>
                  <span className="co-display" style={{ fontSize: 30, color: GOLD, letterSpacing: "0.02em" }}>₹{total}</span>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                <Truck size={13} className="mt-0.5 shrink-0" />
                <span>{deliveryTime}</span>
              </div>

              <div className="mt-6 pt-5 flex items-center gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                  <Shield size={13} /><span>Secure</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                  <Lock size={13} /><span>SSL encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT — form ═════════════════════════════════════════════════ */}
          <div className="flex-1 bg-white" style={{ borderLeft: "1px solid rgba(45,80,22,0.08)" }}>

            {/* WhatsApp notice */}
            <div className="px-5 lg:px-10 pt-7">
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: "rgba(200,168,75,0.08)", border: `1px solid rgba(200,168,75,0.25)` }}
              >
                <MessageCircle size={18} style={{ color: GOLD }} className="shrink-0" />
                <div>
                  <p className="text-sm font-bold" style={{ color: GREEN }}>Order via WhatsApp</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.4)" }}>
                    Fill in your details — we'll open WhatsApp with your order pre-filled.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 lg:px-10 py-7">
              <form onSubmit={handleSubmit(handleOrder)} className="max-w-md space-y-7">

                {/* Shipping info */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <span className="block w-4 h-px" style={{ background: GOLD }} />
                    <h2 className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: GOLD }}>
                      Shipping Information
                    </h2>
                  </div>
                  <div className="space-y-4">

                    <Field label="Full Name *" id="customerName" error={errors.customerName?.message}>
                      <input id="customerName" {...register("customerName")}
                        placeholder="Arjun Menon" className={inputCls(errors.customerName?.message)} />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Phone *" id="phoneNumber" error={errors.phoneNumber?.message}>
                        <input id="phoneNumber" {...register("phoneNumber")}
                          placeholder="9400941277" className={inputCls(errors.phoneNumber?.message)} />
                      </Field>
                      <Field label="Alternate Phone" id="alternatePhone">
                        <input id="alternatePhone" {...register("alternatePhone")}
                          placeholder="Optional" className={inputCls()} />
                      </Field>
                    </div>

                    <Field label="Instagram ID" id="instagramId">
                      <input id="instagramId" {...register("instagramId")}
                        placeholder="@username" className={inputCls()} />
                    </Field>

                    <Field label="Full Address *" id="address" error={errors.address?.message}>
                      <textarea id="address" {...register("address")} rows={3}
                        placeholder="House no., Building, Street, Area…"
                        className={`${inputCls(errors.address?.message)} !h-auto py-2 resize-none`} />
                    </Field>

                    <div className="grid grid-cols-3 gap-3">
                      <Field label="District *" id="district" error={errors.district?.message}>
                        <input id="district" {...register("district")}
                          placeholder="Kannur" className={inputCls(errors.district?.message)} />
                      </Field>
                      <Field label="State *" id="state" error={errors.state?.message}>
                        <input id="state" {...register("state")}
                          placeholder="Kerala" className={inputCls(errors.state?.message)} />
                      </Field>
                      <Field label="Pincode *" id="pincode" error={errors.pincode?.message}>
                        <input id="pincode" {...register("pincode")}
                          placeholder="670001" className={inputCls(errors.pincode?.message)} />
                      </Field>
                    </div>

                    <Field label="Landmark" id="landmark">
                      <input id="landmark" {...register("landmark")}
                        placeholder="Near school, temple…" className={inputCls()} />
                    </Field>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(45,80,22,0.07)" }} />

                {/* Payment method */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="block w-4 h-px" style={{ background: GOLD }} />
                    <h2 className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: GOLD }}>
                      Payment Method
                    </h2>
                  </div>
                  <div className="space-y-3">

                    {/* Online */}
                    <label
                      className={`radio-card flex items-start gap-3 p-4 border rounded-xl cursor-pointer select-none ${paymentMethod === "online" ? "active" : ""}`}
                      style={{ borderColor: paymentMethod === "online" ? GREEN : "rgba(0,0,0,0.1)" }}
                    >
                      <input type="radio" name="payment" value="online"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="mt-0.5" style={{ accentColor: GREEN }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold" style={{ color: "#111" }}>Online Payment</span>
                          <span
                            className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
                            style={{ background: GREEN_MID, color: GREEN }}
                          >
                            Free shipping
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.4)" }}>
                          Pay via UPI / cards · Payment link shared on WhatsApp
                        </p>
                      </div>
                    </label>

                    {/* COD */}
                    <label
                      className={`radio-card flex items-start gap-3 p-4 border rounded-xl cursor-pointer select-none ${paymentMethod === "cod" ? "active" : ""}`}
                      style={{ borderColor: paymentMethod === "cod" ? GREEN : "rgba(0,0,0,0.1)" }}
                    >
                      <input type="radio" name="payment" value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="mt-0.5" style={{ accentColor: GREEN }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold" style={{ color: "#111" }}>Cash on Delivery</span>
                          <span
                            className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(200,168,75,0.12)", color: "#92400e" }}
                          >
                            +₹{isOffer ? OFFER_COD_FEE : 150} extra
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.4)" }}>
                          {isOffer
                            ? `Total ₹${OFFER_PRICE + OFFER_COD_FEE} · ₹100 advance + rest on delivery`
                            : "₹100 advance + rest on delivery"}
                        </p>
                      </div>
                    </label>
                  </div>

                  {isOffer && (
                    <div
                      className="mt-3 flex items-center gap-2.5 rounded-xl px-4 py-3"
                      style={{ background: "rgba(200,168,75,0.08)", border: `1px solid rgba(200,168,75,0.25)` }}
                    >
                      <Tag size={14} style={{ color: GOLD }} className="shrink-0" />
                      <p className="text-xs" style={{ color: "#92400e" }}>
                        <span className="font-bold">Total: ₹{total}</span>
                        {paymentMethod === "online" ? " · Free shipping included" : ` · Includes ₹${OFFER_COD_FEE} COD fee`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Policy */}
                <div
                  className="flex items-start gap-2.5 rounded-lg px-4 py-3"
                  style={{ background: "rgba(200,168,75,0.06)", border: `1px solid rgba(200,168,75,0.2)` }}
                >
                  <AlertCircle size={15} style={{ color: GOLD }} className="shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(0,0,0,0.5)" }}>
                    By proceeding you agree to our{" "}
                    <Link href="/terms" target="_blank" className="font-bold underline" style={{ color: GREEN }}>
                      return policy
                    </Link>
                    . All sales are final unless specified.
                  </p>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  className="w-full py-4 text-[11px] font-black tracking-[0.22em] uppercase rounded-xl flex items-center justify-center gap-2 transition-opacity duration-150 hover:opacity-85 active:scale-[0.98]"
                  style={{
                    background: "#25D366",
                    color: "white",
                    boxShadow: "0 4px 16px rgba(37,211,102,0.35)",
                  }}
                >
                  <MessageCircle size={15} fill="white" />
                  Place Order via WhatsApp →
                </button>

                <p className="text-center text-[10px] -mt-3" style={{ color: "rgba(0,0,0,0.3)" }}>
                  You'll be redirected to WhatsApp to confirm with us
                </p>

              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutInner />
    </Suspense>
  );
}
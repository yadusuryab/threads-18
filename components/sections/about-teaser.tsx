"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

type AboutTeaserProps = {
  imageUrl?: string;
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  body?: string;
  ctaText?: string;
  ctaHref?: string;
  whatsappGroupUrl?: string;
  whatsappGroupLabel?: string;
  stat1?: { value: string; label: string };
  stat2?: { value: string; label: string };
  stat3?: { value: string; label: string };
};

export default function AboutTeaser({
  imageUrl = "/hero.avif",
  eyebrow = "Who We Are",
  headingLine1 = "BUILT FOR",
  headingLine2 = "THE GAME.",
  body = "Every jersey we carry is official, licensed, and match-ready. We source directly from federations and clubs — so you get the real thing, not a replica of a replica.",
  ctaText = "Our Story",
  ctaHref = "/about",
  whatsappGroupUrl = "https://chat.whatsapp.com/IVe2nZpMgdA6KISezSikZn",
  whatsappGroupLabel = "Join our WhatsApp Group",
  stat1 = { value: "200+", label: "Clubs & Teams" },
  stat2 = { value: "50k+", label: "Jerseys Sold" },
  stat3 = { value: "100%", label: "Authentic" },
}: AboutTeaserProps) {
  const { ref, visible } = useReveal();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .at-display { font-family: 'Bebas Neue', sans-serif; }
      `}</style>

      <section ref={ref} className="px-3 sm:px-4 py-4">
        <div className="relative grid grid-cols-1 md:grid-cols-[3fr_2fr] rounded-2xl overflow-hidden min-h-[560px] md:min-h-[640px]">

          {/* ── Image panel ── */}
          <div className="relative min-h-[380px] md:min-h-0 overflow-hidden">
            <Image
              src={imageUrl}
              alt="Jersey store — built for the game"
              fill
              className="object-cover"
              style={{
                transform: visible ? "scale(1.0)" : "scale(1.08)",
                transition: "transform 1.4s cubic-bezier(0.25,0.46,0.45,0.94)",
              }}
            />
            {/* Dark overlay so image reads moody */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Eyebrow pinned top-left on image */}
            <div
              className="absolute top-6 left-6 flex items-center gap-2"
              style={{
                opacity: visible ? 1 : 0,
                transition: "opacity 0.6s ease 0.2s",
              }}
            >
              <span
                className="block w-4 h-px"
                style={{ background: "#C8F400" }}
              />
              <span
                className="text-[9px] tracking-[0.3em] uppercase font-semibold"
                style={{ color: "#C8F400" }}
              >
                {eyebrow}
              </span>
            </div>

            {/* Huge display type bleeding over image bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 px-6 pb-6 md:hidden"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
              }}
            >
              <h2
                className="at-display text-white leading-none"
                style={{ fontSize: "clamp(52px, 14vw, 96px)", letterSpacing: "-0.01em" }}
              >
                {headingLine1}<br />
                <span style={{ color: "#C8F400" }}>{headingLine2}</span>
              </h2>
            </div>
          </div>

          {/* ── Right: Dark content panel ── */}
          <div
            className="flex flex-col justify-between px-8 py-10 sm:px-10 sm:py-12"
            style={{
              background: "#0a0a0a",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(24px)",
              transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s",
            }}
          >
            {/* Top section */}
            <div>
              {/* Heading — desktop only */}
              <h2
                className="at-display leading-none hidden md:block mb-10"
                style={{
                  fontSize: "clamp(56px, 5.5vw, 88px)",
                  letterSpacing: "-0.01em",
                  color: "#ffffff",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(18px)",
                  transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.28s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.28s",
                }}
              >
                {headingLine1}<br />
                <span style={{ color: "#C8F400" }}>{headingLine2}</span>
              </h2>

              {/* Body */}
              <p
                className="text-sm leading-relaxed mb-10 max-w-xs"
                style={{
                  color: "rgba(255,255,255,0.45)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 0.65s ease 0.38s, transform 0.65s ease 0.38s",
                }}
              >
                {body}
              </p>

              {/* CTAs */}
              <div
                className="flex flex-col gap-4"
                style={{
                  opacity: visible ? 1 : 0,
                  transition: "opacity 0.6s ease 0.46s",
                }}
              >
                {/* Existing "Our Story" CTA */}
                <Link
                  href={ctaHref}
                  className="group inline-flex items-center gap-3"
                >
                  <span
                    className="text-[10px] font-bold tracking-[0.22em] uppercase transition-colors duration-200"
                    style={{ color: "#C8F400" }}
                  >
                    {ctaText}
                  </span>
                  {/* Animated arrow line */}
                  <span
                    className="relative flex items-center"
                    style={{ width: 32 }}
                  >
                    <span
                      className="block h-px transition-all duration-300 group-hover:w-10"
                      style={{
                        background: "#C8F400",
                        width: 24,
                      }}
                    />
                    <svg
                      width="6"
                      height="10"
                      viewBox="0 0 6 10"
                      fill="none"
                      className="absolute right-0 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M1 1l4 4-4 4" stroke="#C8F400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>

                {/* WhatsApp Group CTA */}
                <a
                  href={whatsappGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3"
                >
                  {/* WhatsApp icon */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0"
                  >
                    <path
                      d="M20.472 3.528A11.955 11.955 0 0012.005 0C5.444 0 .103 5.34.1 11.902c0 2.097.546 4.143 1.588 5.946L0 24l6.304-1.654a11.942 11.942 0 005.694 1.447h.005c6.557 0 11.898-5.34 11.9-11.903a11.837 11.837 0 00-3.431-8.362z"
                      fill="#25D366"
                    />
                    <path
                      d="M12.005 21.793h-.004a9.918 9.918 0 01-5.056-1.384l-.363-.215-3.76.986 1.003-3.662-.236-.376a9.895 9.895 0 01-1.518-5.24C2.073 6.46 6.535 2 12.009 2a9.877 9.877 0 017.01 2.907 9.858 9.858 0 012.899 7.009c-.003 5.468-4.465 9.877-9.913 9.877z"
                      fill="#25D366"
                    />
                    <path
                      d="M17.006 14.382c-.296-.148-1.75-.864-2.022-.963-.272-.098-.47-.148-.669.148-.198.296-.768.963-.942 1.161-.173.197-.347.222-.643.074-.297-.148-1.252-.461-2.384-1.47-.881-.786-1.476-1.756-1.649-2.052-.173-.297-.018-.457.13-.604.133-.133.296-.347.445-.52.148-.173.197-.297.296-.495.099-.198.05-.372-.025-.52-.074-.148-.669-1.612-.916-2.208-.241-.579-.486-.5-.669-.51l-.569-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.48 0 1.463 1.065 2.876 1.213 3.074.148.198 2.095 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.693.248-1.287.173-1.412-.074-.124-.272-.198-.57-.347z"
                      fill="white"
                    />
                  </svg>
                  <span
                    className="text-[10px] font-bold tracking-[0.22em] uppercase transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {whatsappGroupLabel}
                  </span>
                  <span
                    className="relative flex items-center"
                    style={{ width: 32 }}
                  >
                    <span
                      className="block h-px transition-all duration-300 group-hover:w-10"
                      style={{
                        background: "rgba(255,255,255,0.25)",
                        width: 24,
                      }}
                    />
                    <svg
                      width="6"
                      height="10"
                      viewBox="0 0 6 10"
                      fill="none"
                      className="absolute right-0 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M1 1l4 4-4 4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>

            {/* Stats — pinned to bottom */}
            <div
              className="grid grid-cols-3 pt-8"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.65s ease 0.54s, transform 0.65s ease 0.54s",
              }}
            >
              {[stat1, stat2, stat3].map((stat, i) => (
                <div key={i} className={i > 0 ? "pl-4 border-l border-white/[0.08]" : ""}>
                  <p
                    className="at-display leading-none mb-1"
                    style={{ fontSize: 28, color: "#ffffff" }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-[9px] tracking-[0.18em] uppercase font-medium"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
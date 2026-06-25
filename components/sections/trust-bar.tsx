"use client";

import React, { useEffect, useRef, useState } from "react";
import { Truck, Ruler, ShieldCheck, RefreshCcw } from "lucide-react";

const GREEN = "#2D5016";
const GOLD = "#C8A84B";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const badges = [
  { icon: Truck,      title: "Fast Delivery",    desc: "Ships within 24 hrs — catch it before match day." },
  { icon: Ruler,      title: "Size Guarantee",   desc: "Wrong fit? Exchange it free, no questions asked." },
  { icon: ShieldCheck,title: "100% Authentic",   desc: "Official licensed jerseys, every single time." },
  { icon: RefreshCcw, title: "Easy Returns",     desc: "30-day returns on unworn, unmodified items." },
];

export default function TrustBar() {
  const { ref, visible } = useReveal();

  return (
    <section ref={ref} className="px-3 sm:px-4 py-2">
      <div
        className="rounded-2xl px-4 py-6 sm:py-8"
        style={{ background: "#f2f4f0", border: "1px solid rgba(45,80,22,0.1)" }}
      >
        <div
          className="grid grid-cols-2 md:grid-cols-4 rounded overflow-hidden"
          style={{ gap: 1, background: "rgba(45,80,22,0.1)" }}
        >
          {badges.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-2.5 px-4 py-6 sm:py-8 group transition-colors duration-300"
              style={{
                background: "#f9faf7",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s,
                             transform 0.55s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s,
                             background 0.3s`,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#eef1ea")}
              onMouseLeave={e => (e.currentTarget.style.background = "#f9faf7")}
            >
              {/* Icon circle */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ border: `1.5px solid rgba(45,80,22,0.2)` }}
              >
                <Icon size={17} strokeWidth={1.5} style={{ color: GREEN }} />
              </div>

              {/* Text */}
              <div>
                <p
                  className="text-[11px] font-bold tracking-[0.12em] uppercase mb-0.5"
                  style={{ color: GREEN }}
                >
                  {title}
                </p>
                <p className="text-[10.5px] leading-snug" style={{ color: "rgba(0,0,0,0.4)" }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
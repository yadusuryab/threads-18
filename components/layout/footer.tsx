"use client";

import * as React from "react";
import Link from "next/link";
import { Instagram, MessageCircle, ArrowRight } from "lucide-react";
import Brand from "../utils/brand";

const GOLD = "#C9A84C";
const OLIVE_DARK = "#1E2D10";
const OLIVE_DEEPER = "#151F0C";

function Footer() {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setCategories(data))
      .catch(() => {});
  }, []);

  const dynamicCategories = categories.slice(0, 5).map((c) => ({
    label: c.name || "Category",
    href: `/products?category=${c.slug?.current || c.slug || "category"}`,
  }));

  const shopCategories = dynamicCategories.length > 0
    ? dynamicCategories
    : [
        { label: "Football Jerseys", href: "/products?category=football" },
        { label: "Cricket Kits",     href: "/products?category=cricket"   },
        { label: "Basketball",       href: "/products?category=basketball" },
        { label: "Custom Orders",    href: "/custom" },
      ];

  const social = {
    instagram: process.env.NEXT_PUBLIC_INSTA    || "#",
    whatsapp:  process.env.NEXT_PUBLIC_WHATSAPP || "#",
  };

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "19 Threads";

  return (
    <>
      <style>{`
        @keyframes footerMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ft-marquee {
          display: inline-flex;
          animation: footerMarquee 24s linear infinite;
          white-space: nowrap;
        }
        .ft-link {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.2s;
          position: relative;
        }
        .ft-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: ${GOLD};
          transition: width 0.25s ease;
        }
        .ft-link:hover { color: rgba(255,255,255,0.85); }
        .ft-link:hover::after { width: 100%; }
        .ft-col-label {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: ${GOLD};
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ft-col-label::before {
          content: '';
          display: block;
          width: 16px;
          height: 2px;
          background: ${GOLD};
          flex-shrink: 0;
        }
      `}</style>

      <footer style={{ background: OLIVE_DEEPER }}>

        {/* Gold top bar */}
        <div style={{ height: 3, background: GOLD }} />

        {/* Marquee */}
        <div className="overflow-hidden py-2.5 select-none"
          style={{ borderBottom: "1px solid rgba(201,168,76,0.12)" }}>
          <div className="ft-marquee">
            {[
              "Free shipping on prepaid orders",
              "Custom name & number available",
              "Premium sublimation fabric",
              "Pan India delivery via DTDC",
              "48hr dispatch on stock items",
              "Free shipping on prepaid orders",
              "Custom name & number available",
              "Premium sublimation fabric",
              "Pan India delivery via DTDC",
              "48hr dispatch on stock items",
            ].map((t, i) => (
              <React.Fragment key={i}>
                <span className="text-[9px] font-black tracking-[0.3em] uppercase px-4"
                  style={{ color: "rgba(201,168,76,0.5)" }}>
                  {t}
                </span>
                <span style={{ color: "rgba(201,168,76,0.25)", fontSize: 8 }}>✦</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 pt-14 pb-10">

          {/* Top: Brand + Nav columns */}
          <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-14 pb-14"
            style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="block mb-5 w-fit hover:opacity-75 transition-opacity">
                <Brand className="h-7 w-auto brightness-0 invert" />
              </Link>
              <p className="text-[12px] leading-relaxed mb-7 max-w-[220px]"
                style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
                Premium jerseys crafted for those who play with purpose.
              </p>
              <div className="flex gap-2">
                {[
                  { href: social.instagram, Icon: Instagram, label: "Instagram" },
                  { href: social.whatsapp,  Icon: MessageCircle, label: "WhatsApp" },
                ].map(({ href, Icon, label }) => (
                  <Link key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 flex items-center justify-center transition-all duration-200
                      hover:border-[#C9A84C] hover:text-[#C9A84C]"
                    style={{
                      border: "1px solid rgba(201,168,76,0.2)",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    <Icon size={14} strokeWidth={1.5} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <div className="ft-col-label">Shop</div>
              <ul className="space-y-3">
                {shopCategories.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="ft-link">{l.label}</Link>
                  </li>
                ))}
                <li><Link href="/products" className="ft-link">All Products</Link></li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <div className="ft-col-label">Info</div>
              <ul className="space-y-3">
                {[
                  { label: "About Us",    href: "/about"   },
                  { label: "Contact Us",  href: "/contact" },
                  { label: "Custom Orders", href: "/custom" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="ft-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <div className="ft-col-label">Legal</div>
              <ul className="space-y-3">
                {[
                  { label: "Privacy Policy",     href: "/privacy-policy" },
                  { label: "Terms & Conditions", href: "/terms"          },
                  { label: "Cookies",            href: "/cookies"        },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="ft-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Big wordmark */}
          <div className="mb-10 overflow-hidden select-none -mx-2">
            <p style={{
              fontSize: "clamp(48px, 14vw, 140px)",
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "transparent",
              WebkitTextStroke: `1px rgba(201,168,76,0.12)`,
              whiteSpace: "nowrap",
              paddingLeft: "0.5rem",
            }}>
              {appName}
            </p>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
            style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>

            <p className="text-[10px] font-bold tracking-[0.15em] uppercase"
              style={{ color: "rgba(255,255,255,0.18)" }}>
              © {currentYear} {appName}. All rights reserved.
            </p>

            <Link
              href="https://instagram.com/getshopigo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold tracking-[0.15em] uppercase transition-colors duration-200
                hover:text-[#C9A84C]"
              style={{ color: "rgba(255,255,255,0.18)" }}
            >
              Made with ♥ by Shopigo
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

export { Footer };
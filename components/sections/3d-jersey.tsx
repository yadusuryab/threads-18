"use client";

import { useRef, useEffect } from "react";

export default function Jersey3D() {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner :any= innerRef.current;
    if (!inner) return;
    const wrap = inner.parentElement!;

    let dragging = false, lastX = 0, lastY = 0;
    let rotX = -6, rotY = 0, velX = 0, velY = 0;
    let raf: number;

    function set() {
      inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }

    function coast() {
      if (!dragging) {
        rotY += velX; rotX += velY;
        rotX = Math.max(-28, Math.min(28, rotX));
        velX *= 0.9; velY *= 0.9;
        set();
        if (Math.abs(velX) > 0.03 || Math.abs(velY) > 0.03)
          raf = requestAnimationFrame(coast);
      }
    }

    const onDown = (e: MouseEvent) => {
      dragging = true; inner.classList.add("dragging");
      lastX = e.clientX; lastY = e.clientY;
      cancelAnimationFrame(raf); e.preventDefault();
    };
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      velX = dx * 0.35; velY = dy * 0.2;
      rotY += dx * 0.45; rotX += dy * 0.25;
      rotX = Math.max(-28, Math.min(28, rotX));
      lastX = e.clientX; lastY = e.clientY; set();
    };
    const onUp = () => {
      dragging = false; inner.classList.remove("dragging");
      raf = requestAnimationFrame(coast);
    };
    const onTS = (e: TouchEvent) => {
      const t = e.touches[0]; dragging = true; inner.classList.add("dragging");
      lastX = t.clientX; lastY = t.clientY; cancelAnimationFrame(raf);
    };
    const onTM = (e: TouchEvent) => {
      if (!dragging) return;
      const t = e.touches[0];
      const dx = t.clientX - lastX, dy = t.clientY - lastY;
      velX = dx * 0.35; velY = dy * 0.2;
      rotY += dx * 0.45; rotX += dy * 0.25;
      rotX = Math.max(-28, Math.min(28, rotX));
      lastX = t.clientX; lastY = t.clientY; set();
    };
    const onTE = () => {
      dragging = false; inner.classList.remove("dragging");
      raf = requestAnimationFrame(coast);
    };

    wrap.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    wrap.addEventListener("touchstart", onTS, { passive: true });
    window.addEventListener("touchmove", onTM, { passive: true });
    window.addEventListener("touchend", onTE);
    set();

    return () => {
      wrap.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      wrap.removeEventListener("touchstart", onTS);
      window.removeEventListener("touchmove", onTM);
      window.removeEventListener("touchend", onTE);
      cancelAnimationFrame(raf);
    };
  }, []);

  const repeat = Array(8).fill("THREADS 18");

  return (
    <section className="relative w-full overflow-hidden flex flex-col items-center py-1">

      {/* Scrolling bold marquee behind jersey */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 -translate-y-1/2 w-full overflow-hidden pointer-events-none z-0"
      >
        <div
          className="flex w-max"
          style={{ animation: "jersey-marquee 18s linear infinite" }}
        >
          {repeat.map((t, i) => (
            <span
              key={i}
              className="text-[96px] font-black uppercase whitespace-nowrap pr-14 select-none"
              style={{
                fontFamily: "'Arial Black','Helvetica Neue',sans-serif",
                letterSpacing: "-0.03em",
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(120,120,120,0.15)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Jersey */}
      <div
        className="relative z-10 cursor-grab active:cursor-grabbing"
        style={{ width: 260, height: 300, perspective: 900 }}
      >
        <div
          ref={innerRef}
          className="jersey-inner"
          style={{ width: "100%", height: "100%", transformStyle: "preserve-3d" }}
        >
          <svg
            viewBox="0 0 280 320"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: "100%",
              height: "100%",
              filter:
                "drop-shadow(0 28px 50px rgba(0,0,0,0.18)) drop-shadow(0 8px 16px rgba(0,0,0,0.12))",
            }}
          >
            <defs>
              <linearGradient id="jbody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#111111" />
                <stop offset="50%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </linearGradient>
              <linearGradient id="jsheen" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.1} />
                <stop offset="40%" stopColor="#ffffff" stopOpacity={0.04} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="jsleeve" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c1c1c" />
                <stop offset="100%" stopColor="#080808" />
              </linearGradient>
              <linearGradient id="jbot" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0a0a0a" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#000000" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="jcollar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="jstripe" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <path d="M 30 100 L 0 140 L 15 165 L 65 140 L 65 100 Z" fill="url(#jsleeve)" />
            <path d="M 30 100 L 10 135 L 15 165 L 25 145 L 50 110 Z" fill="white" opacity={0.06} />
            <path d="M 36 108 L 6 145 L 11 148 L 41 111 Z" fill="white" opacity={0.1} />

            <path d="M 250 100 L 280 140 L 265 165 L 215 140 L 215 100 Z" fill="url(#jsleeve)" />
            <path d="M 250 100 L 278 138 L 265 165 L 255 145 L 230 110 Z" fill="black" opacity={0.2} />
            <path d="M 244 108 L 274 145 L 269 148 L 239 111 Z" fill="white" opacity={0.05} />

            <path d="M 65 95 L 65 295 Q 140 310 215 295 L 215 95 Z" fill="url(#jbody)" />
            <path d="M 65 95 L 65 295 Q 100 302 118 299 L 118 95 Z" fill="url(#jsheen)" />
            <path d="M 65 250 L 65 295 Q 140 310 215 295 L 215 250 Z" fill="url(#jbot)" />

            <rect x={93} y={95} width={2} height={200} fill="url(#jstripe)" />
            <rect x={139} y={95} width={2} height={215} fill="url(#jstripe)" />
            <rect x={185} y={95} width={2} height={200} fill="url(#jstripe)" />

            <path d="M 65 95 Q 140 85 215 95" fill="none" stroke="white" strokeWidth={1} opacity={0.12} />

            <text x={140} y={220} textAnchor="middle"
              fontFamily="'Arial Black','Helvetica Neue',sans-serif"
              fontSize={70} fontWeight={900} fill="white" opacity={0.95} letterSpacing={-2}>18</text>
            <text x={143} y={223} textAnchor="middle"
              fontFamily="'Arial Black','Helvetica Neue',sans-serif"
              fontSize={70} fontWeight={900} fill="black" opacity={0.5} letterSpacing={-2}>18</text>

            <text x={140} y={241} textAnchor="middle"
              fontFamily="'Arial Black','Helvetica Neue',sans-serif"
              fontSize={10} fontWeight={700} fill="white" opacity={0.5} letterSpacing={5}>THREADS</text>

            <path d="M 110 95 Q 140 75 170 95 Q 160 110 140 115 Q 120 110 110 95 Z" fill="url(#jcollar)" />
            <path d="M 118 96 Q 140 80 162 96 Q 155 106 140 110 Q 125 106 118 96 Z" fill="#f1f5f9" />
            <path d="M 118 96 Q 140 80 162 96 Q 152 88 140 85 Q 128 88 118 96 Z" fill="#64748b" opacity={0.4} />

            <path d="M 65 95 L 110 95" stroke="white" strokeWidth={0.8} opacity={0.1} fill="none" />
            <path d="M 170 95 L 215 95" stroke="white" strokeWidth={0.8} opacity={0.1} fill="none" />

            <path d="M 65 292 Q 140 308 215 292 L 215 297 Q 140 313 65 297 Z" fill="white" opacity={0.07} />
            <path d="M 0 140 L 15 165 L 22 162 L 7 138 Z" fill="white" opacity={0.15} />
            <path d="M 280 140 L 265 165 L 258 162 L 273 138 Z" fill="white" opacity={0.08} />
          </svg>
        </div>
      </div>

      <p className="relative z-10 mt-6 text-xs tracking-widest uppercase text-muted-foreground flex items-center gap-2">
        ↻ drag to rotate
      </p>

      <style>{`
        .jersey-inner {
          animation: j-float 4s ease-in-out infinite;
          transition: transform 0.05s linear;
        }
        .jersey-inner.dragging { animation: none !important; }
        @keyframes j-float {
          0%,100% { transform: rotateX(-6deg) rotateY(0deg) translateY(0); }
          50%      { transform: rotateX(-6deg) rotateY(0deg) translateY(-10px); }
        }
        @keyframes jersey-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
"use client";

import React, { useState } from "react";

// ── Brand tokens ───────────────────────────────────────────────
const GREEN      = "#2D5016";
const GOLD       = "#C8A84B";
const GREEN_BG   = "#f2f4f0";
const GREEN_MID  = "#eef1ea";

const CHANNELS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-5 h-5">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="m2 3 10 8.5L22 3"/>
      </svg>
    ),
    label: "Email",
    value: "threadseighteen@gmail.com",
    href: "mailto:threadseighteen@gmail.com",
    hint: "We reply within 24 hours",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-5 h-5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
      </svg>
    ),
    label: "Phone / WhatsApp",
    value: "+91 8139865988",
    href: "https://wa.me/918139865988",
    hint: "Mon – Sat, 9 am – 8 pm IST",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    label: "Instagram",
    value: "@threads_eighteen",
    href: "https://instagram.com/threads_eighteen",
    hint: "DM us anytime",
  },
];

type FormState = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [status, setStatus]   = useState<FormState>("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const fieldWrapper = (name: string) => ({
    borderRadius: 12,
    padding: "12px 16px",
    border: focused === name
      ? `1.5px solid ${GREEN}`
      : "1.5px solid rgba(0,0,0,0.1)",
    background: focused === name ? GREEN_MID : "white",
    transition: "all 0.2s",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .co-root { font-family: system-ui, -apple-system, sans-serif; }
        .co-display { font-family: 'Bebas Neue', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.13s; }
        .d3 { animation-delay: 0.22s; }
        .d4 { animation-delay: 0.32s; }
        .channel-card {
          background: white;
          border: 1px solid rgba(45,80,22,0.1);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          text-decoration: none;
          transition: border-color 0.22s, background 0.22s, transform 0.22s;
        }
        .channel-card:hover {
          border-color: rgba(200,168,75,0.45);
          background: #fdfcf6;
          transform: translateY(-2px);
        }
        .co-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 14px;
          color: #111;
          resize: none;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .co-input::placeholder { color: rgba(0,0,0,0.22); }
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: ${GREEN};
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: opacity 0.2s, transform 0.2s;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <div className="co-root" style={{ background: GREEN_BG, minHeight: "100vh" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 md:py-24">

          {/* ── Header ── */}
          <div className="mb-14 md:mb-20">
            {/* Eyebrow */}
            <div className="fade-up d1 flex items-center gap-2 mb-5">
              <span className="block w-5 h-px" style={{ background: GOLD }} />
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: GOLD }}>
                18 Threads — Get in Touch
              </span>
            </div>

            <h1
              className="fade-up d2 co-display leading-none"
              style={{ fontSize: "clamp(52px, 10vw, 96px)", color: GREEN, letterSpacing: "0.01em" }}
            >
              WE'D LOVE TO<br />
              <span style={{ color: GOLD }}>HEAR FROM YOU.</span>
            </h1>

            <p
              className="fade-up d3 mt-5 text-sm md:text-base leading-relaxed max-w-sm"
              style={{ color: "rgba(0,0,0,0.42)" }}
            >
              Questions, order support, or just want to say hi — we're quick to reply.
            </p>
          </div>

          {/* Divider */}
          <div className="mb-14" style={{ height: 1, background: `linear-gradient(to right, transparent, rgba(45,80,22,0.2), transparent)` }} />

          {/* ── Two-column ── */}
          <div className="grid md:grid-cols-[1fr_1.1fr] gap-10 md:gap-16 items-start">

            {/* LEFT — channels */}
            <div className="fade-up d3 space-y-3">
              <p
                className="text-[9px] font-bold tracking-[0.25em] uppercase mb-6"
                style={{ color: "rgba(0,0,0,0.3)" }}
              >
                Reach us directly
              </p>

              {CHANNELS.map((ch) => (
                <a
                  key={ch.label}
                  href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="channel-card"
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: GREEN_MID,
                      border: `1px solid rgba(45,80,22,0.15)`,
                      color: GREEN,
                    }}
                  >
                    {ch.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="text-[9px] font-bold tracking-[0.18em] uppercase mb-0.5"
                      style={{ color: "rgba(0,0,0,0.3)" }}
                    >
                      {ch.label}
                    </p>
                    <p className="text-sm font-bold truncate" style={{ color: GREEN }}>
                      {ch.value}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "rgba(0,0,0,0.35)" }}>
                      {ch.hint}
                    </p>
                  </div>

                  <svg viewBox="0 0 16 16" fill="none" stroke={GOLD} strokeWidth="1.5"
                    className="w-4 h-4 shrink-0 mt-1 ml-auto opacity-50">
                    <path d="M3 8h10M9 4l4 4-4 4"/>
                  </svg>
                </a>
              ))}
            </div>

            {/* RIGHT — form */}
            <div className="fade-up d4">
              <div
                className="relative overflow-hidden"
                style={{
                  background: "white",
                  border: `1px solid rgba(45,80,22,0.1)`,
                  borderRadius: 24,
                  padding: "36px",
                }}
              >
                {/* Gold corner accent */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, rgba(200,168,75,0.08) 0%, transparent 70%)`,
                  }}
                />

                <div className="relative">
                  {/* Form header */}
                  <div className="flex items-center gap-2 mb-7">
                    <span className="block w-4 h-px" style={{ background: GOLD }} />
                    <p className="text-[9px] font-bold tracking-[0.28em] uppercase" style={{ color: GOLD }}>
                      Send a Message
                    </p>
                  </div>

                  {status === "sent" ? (
                    <div className="text-center py-10">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                        style={{ background: GREEN_MID, border: `1.5px solid rgba(45,80,22,0.2)`, color: GREEN }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <h3
                        className="co-display mb-2"
                        style={{ fontSize: 36, color: GREEN, letterSpacing: "0.02em" }}
                      >
                        Message Sent!
                      </h3>
                      <p className="text-sm mb-7" style={{ color: "rgba(0,0,0,0.38)" }}>
                        We'll get back to you within 24 hours.
                      </p>
                      <button
                        onClick={() => setStatus("idle")}
                        className="text-[10px] font-bold tracking-[0.2em] uppercase pb-px transition-colors duration-200"
                        style={{ color: GREEN, borderBottom: `1px solid rgba(45,80,22,0.3)` }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = GREEN)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(45,80,22,0.3)")}
                      >
                        Send another
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">

                      {/* Name */}
                      <div style={fieldWrapper("name")}>
                        <label
                          className="block text-[9px] font-bold tracking-[0.22em] uppercase mb-1.5"
                          style={{ color: "rgba(0,0,0,0.3)" }}
                        >
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          onFocus={() => setFocused("name")}
                          onBlur={() => setFocused(null)}
                          placeholder="Arjun Menon"
                          required
                          className="co-input"
                        />
                      </div>

                      {/* Email */}
                      <div style={fieldWrapper("email")}>
                        <label
                          className="block text-[9px] font-bold tracking-[0.22em] uppercase mb-1.5"
                          style={{ color: "rgba(0,0,0,0.3)" }}
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          onFocus={() => setFocused("email")}
                          onBlur={() => setFocused(null)}
                          placeholder="you@example.com"
                          required
                          className="co-input"
                        />
                      </div>

                      {/* Message */}
                      <div style={fieldWrapper("message")}>
                        <label
                          className="block text-[9px] font-bold tracking-[0.22em] uppercase mb-1.5"
                          style={{ color: "rgba(0,0,0,0.3)" }}
                        >
                          Message
                        </label>
                        <textarea
                          value={form.message}
                          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                          onFocus={() => setFocused("message")}
                          onBlur={() => setFocused(null)}
                          placeholder="How can we help you?"
                          rows={4}
                          required
                          className="co-input"
                        />
                      </div>

                      {status === "error" && (
                        <p className="text-[11.5px] text-red-500">
                          Something went wrong. Please try WhatsApp or email directly.
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "sending" || !form.name || !form.email || !form.message}
                        className="submit-btn mt-2"
                      >
                        {status === "sending" ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/>
                              <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </>
                        )}
                      </button>

                      <p className="text-[10.5px] text-center leading-relaxed" style={{ color: "rgba(0,0,0,0.3)" }}>
                        Or reach us faster on{" "}
                        <a
                          href="https://wa.me/918139865988"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold transition-opacity hover:opacity-70"
                          style={{ color: GREEN }}
                        >
                          WhatsApp
                        </a>
                        {" "}or{" "}
                        <a
                          href="https://instagram.com/threads_eighteen"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold transition-opacity hover:opacity-70"
                          style={{ color: GREEN }}
                        >
                          Instagram DM
                        </a>
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

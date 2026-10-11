"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import { Play, Pause, Volume2, VolumeX, ArrowRight } from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type BannerItem = {
  _id: string;
  _type: "image" | "video";
  title?: string;
  subtitle?: string;
  mediaType?: "image" | "video";
  imageUrl?: string;
  image?: { asset?: { url: string } };
  video?: { url: string; mimeType?: string };
  videoPoster?: string;
  buttonText?: string;
  buttonLink?: string;
  ctaText?: string;
  ctaLink?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SLIDE_DURATION = 6000;
const GOLD = "#C9A84C";
const OLIVE_DARK = "#1E2D10";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const convertBannerToMediaItem = (banner: BannerItem, index: number) => {
  const isVideo = banner.mediaType === "video";
  return {
    _key: banner._id || `banner-${index}`,
    _type: isVideo ? "video" : "image",
    asset: isVideo
      ? undefined
      : { url: banner.imageUrl || banner.image?.asset?.url || "" },
    videoFile: isVideo
      ? {
          asset: {
            url: banner.video?.url || "",
            mimeType: banner.video?.mimeType,
          },
        }
      : undefined,
    poster: isVideo ? { asset: { url: banner.videoPoster || "" } } : undefined,
    alt: banner.title || "Banner",
  };
};

const getActiveBanners = async (): Promise<BannerItem[]> => {
  try {
    const res = await fetch("/api/banner");
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

// ─── Slide Media ──────────────────────────────────────────────────────────────

const SlideMedia: React.FC<{
  media: ReturnType<typeof convertBannerToMediaItem>;
  isActive: boolean;
  priority?: boolean;
}> = ({ media, isActive, priority }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const videoUrl = media.videoFile?.asset?.url;

  useEffect(() => {
    if (media._type !== "video" || !videoRef.current) return;
    if (isActive && playing) {
      videoRef.current.play().catch(() => setPlaying(false));
    } else {
      videoRef.current.pause();
      if (!isActive) setPlaying(false);
    }
  }, [playing, isActive, media._type]);

  if (media._type === "image") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-black">
        {media.asset?.url && (
          <>
            {/* Blurred backdrop fills any leftover space */}
            <img
              src={media.asset.url}
              alt=""
              aria-hidden="true"
              className="hidden md:block absolute inset-0 w-full h-full object-cover scale-110"
              style={{ filter: "blur(28px) brightness(0.6)" }}
            />
            {/* Full image, never cropped */}
            <img
              src={media.asset.url}
              alt={media.alt || ""}
              className="relative w-full h-full object-cover md:object-contain"
              loading={priority ? "eager" : "lazy"}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black">
      {videoUrl && (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            poster={media.poster?.asset?.url}
            className="w-full h-full object-cover md:object-contain"
            muted={muted}
            playsInline
            onEnded={() => setPlaying(false)}
          />
          {!playing && (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 z-10 flex items-center justify-center group"
              aria-label="Play video"
            >
              <span
                className="w-14 h-14 flex items-center justify-center
                  border border-white/30 bg-black/30 backdrop-blur-md
                  group-hover:bg-black/50 group-hover:border-[#C9A84C]
                  transition-all duration-300"
              >
                <Play className="w-5 h-5 text-white ml-0.5" />
              </span>
            </button>
          )}
          {playing && (
            <div className="absolute bottom-5 right-5 z-20 flex gap-2">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = !muted;
                    setMuted((m) => !m);
                  }
                }}
                aria-label={muted ? "Unmute" : "Mute"}
                className="w-8 h-8 bg-black/40 backdrop-blur-sm border border-white/15
                  flex items-center justify-center text-white
                  hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-200"
              >
                {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
              <button
                onClick={() => setPlaying(false)}
                aria-label="Pause"
                className="w-8 h-8 bg-black/40 backdrop-blur-sm border border-white/15
                  flex items-center justify-center text-white
                  hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-200"
              >
                <Pause size={13} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Animated Counter ─────────────────────────────────────────────────────────

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [displayed, setDisplayed] = useState(value);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    setEntering(true);
    const t = setTimeout(() => {
      setDisplayed(value);
      setEntering(false);
    }, 200);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <span
      style={{
        display: "inline-block",
        opacity: entering ? 0 : 1,
        transform: entering ? "translateY(6px)" : "translateY(0)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {String(displayed + 1).padStart(2, "0")}
    </span>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero: React.FC<{ className?: string }> = ({ className }) => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await getActiveBanners();
        setBanners(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const startAutoSlide = useCallback((count: number) => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    if (count <= 1) return;
    autoSlideRef.current = setInterval(() => {
      setSelectedIndex((p) => (p + 1) % count);
      setProgressKey((k) => k + 1);
    }, SLIDE_DURATION);
  }, []);

  useEffect(() => {
    startAutoSlide(banners.length);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [banners.length, startAutoSlide]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
    duration: 30,
  });

  const goTo = useCallback(
    (index: number) => {
      setTextVisible(false);
      setTimeout(() => {
        setSelectedIndex(index);
        setProgressKey((k) => k + 1);
        emblaApi?.scrollTo(index);
        setTextVisible(true);
      }, 250);
      startAutoSlide(banners.length);
    },
    [emblaApi, banners.length, startAutoSlide],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const i = emblaApi.selectedScrollSnap();
      if (i !== selectedIndex) {
        setTextVisible(false);
        setTimeout(() => {
          setSelectedIndex(i);
          setTextVisible(true);
        }, 250);
        setProgressKey((k) => k + 1);
      }
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, selectedIndex]);

  // Skeleton — 16:9
  if (loading) {
    return (
      <section className={cn("w-full", className)}>
        <div
          className="relative w-full h-[75vh] md:h-auto md:aspect-video overflow-hidden"
          style={{ background: OLIVE_DARK }}
        >
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite]
            bg-gradient-to-r from-transparent via-white/5 to-transparent"
          />
        </div>
        <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}`}</style>
      </section>
    );
  }

  // Fallback
  if (!banners.length) {
    return (
      <section className={cn("w-full", className)}>
        <div
          className="relative w-full aspect-video min-h-[260px] overflow-hidden flex items-end"
          style={{ background: OLIVE_DARK }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[40vw] font-black leading-none
            pointer-events-none select-none"
            style={{ color: "rgba(201,168,76,0.06)", letterSpacing: "-0.05em" }}
            aria-hidden="true"
          >
            19
          </div>
          <div className="relative z-10 p-6 md:p-16 max-w-2xl">
            <div className="flex items-center gap-3 mb-3 md:mb-5">
              <div className="h-[2px] w-8" style={{ background: GOLD }} />
              <span
                className="text-[9px] tracking-[0.35em] uppercase font-black"
                style={{ color: GOLD }}
              >
                New Collection
              </span>
            </div>
            <h1
              className="text-3xl md:text-6xl font-black text-white uppercase leading-[0.9]
              tracking-tight mb-4 md:mb-6"
            >
              Wear The <span style={{ color: GOLD }}>Game.</span>
            </h1>
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 text-[11px] font-black
                tracking-[0.2em] uppercase text-white transition-all duration-300
                hover:gap-5"
              style={{
                borderBottom: `1px solid rgba(201,168,76,0.4)`,
                paddingBottom: "2px",
              }}
            >
              Shop Collection
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const current = banners[selectedIndex];
  const ctaHref = current?.buttonLink || current?.ctaLink;
  const ctaLabel = current?.buttonText || current?.ctaText;

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes progressFill { from{transform:scaleY(0)} to{transform:scaleY(1)} }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes revealLine {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>

      <section
        className={cn("w-full select-none", className)}
        aria-label="Featured collection"
      >
        {/* ── Main slide area: 16:9 on mobile AND desktop ── */}
        <div
          className="relative w-full h-[75vh] md:h-auto md:aspect-video overflow-hidden"
          style={{ background: OLIVE_DARK }}
        >
          {/* Slides */}
          {banners.map((banner, index) => {
            const media = convertBannerToMediaItem(banner, index);
            const isActive = selectedIndex === index;
            return (
              <div
                key={banner._id || index}
                className="absolute inset-0"
                style={{
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 900ms cubic-bezier(0.4, 0, 0.2, 1)",
                  zIndex: isActive ? 1 : 0,
                }}
                aria-hidden={!isActive}
              >
                <SlideMedia
                  media={media}
                  isActive={isActive}
                  priority={index === 0}
                />
              </div>
            );
          })}

          {/* Gradient overlays — desktop only (mobile text sits below the banner) */}
          <div
            className="hidden md:block absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.3) 100%)",
            }}
          />
          <div
            className="hidden md:block absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.35) 0%, transparent 60%)",
            }}
          />

          {/* ── Slide counter ── */}
          <div className="absolute top-3 right-3 md:top-8 md:right-12 z-20">
            <div
              className="flex items-baseline gap-1 font-mono text-[10px] md:text-base"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              <AnimatedNumber value={selectedIndex} />
              <span
                className="text-[10px] mx-1"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                —
              </span>
              <span className="text-[11px]">
                {String(banners.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* ── Vertical progress dots (desktop) ── */}
          {banners.length > 1 && (
            <div
              className="hidden md:flex absolute right-12 top-1/2 -translate-y-1/2 z-20
              flex-col gap-3 items-center"
            >
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="relative flex items-center justify-center"
                >
                  <div
                    className="transition-all duration-500 overflow-hidden"
                    style={{
                      width: 2,
                      height: selectedIndex === i ? 32 : 12,
                      background:
                        selectedIndex === i ? GOLD : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {selectedIndex === i && (
                      <div
                        key={progressKey}
                        className="absolute inset-0 origin-top"
                        style={{
                          background: GOLD,
                          animation: `progressFill ${SLIDE_DURATION}ms linear forwards`,
                          transformOrigin: "top",
                        }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── Desktop text ── */}
          <div className="hidden md:flex absolute inset-0 z-20 items-end p-8 lg:p-14">
            <div className="max-w-xl">
              <div
                key={`tag-${selectedIndex}`}
                style={{
                  animation: textVisible
                    ? "fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s both"
                    : "none",
                  opacity: textVisible ? 1 : 0,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="h-[2px] w-8"
                    style={{
                      background: GOLD,
                      animation: "revealLine 0.5s ease forwards",
                    }}
                  />
                  <span
                    className="text-[9px] tracking-[0.35em] uppercase font-black"
                    style={{ color: GOLD }}
                  >
                    {current?.mediaType === "video" ? "Video" : "Collection"}
                  </span>
                </div>
              </div>

              {current?.title && (
                <h1
                  key={`title-${selectedIndex}`}
                  className="font-black text-white uppercase leading-[0.92] tracking-tight mb-4"
                  style={{
                    fontSize: "clamp(32px, 4.5vw, 72px)",
                    letterSpacing: "-0.03em",
                    animation: textVisible
                      ? "fadeSlideUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.12s both"
                      : "none",
                    opacity: textVisible ? 1 : 0,
                  }}
                >
                  {current.title}
                </h1>
              )}

              {current?.subtitle && (
                <p
                  key={`sub-${selectedIndex}`}
                  className="text-sm leading-relaxed max-w-sm tracking-wide"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    animation: textVisible
                      ? "fadeSlideUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.22s both"
                      : "none",
                    opacity: textVisible ? 1 : 0,
                  }}
                >
                  {current.subtitle}
                </p>
              )}

              {ctaLabel && ctaHref && (
                <div
                  key={`cta-${selectedIndex}`}
                  style={{
                    animation: textVisible
                      ? "fadeSlideUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.32s both"
                      : "none",
                    opacity: textVisible ? 1 : 0,
                    marginTop: "1.5rem",
                  }}
                >
                  <Link
                    href={ctaHref}
                    className="group inline-flex items-center gap-3 text-[11px] font-black
                      tracking-[0.2em] uppercase text-white transition-all duration-300
                      hover:gap-5 hover:text-[#C9A84C]"
                    style={{
                      borderBottom: `1px solid rgba(201,168,76,0.35)`,
                      paddingBottom: "3px",
                    }}
                  >
                    {ctaLabel}
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ── Mobile swipe dots ── */}
          {banners.length > 1 && (
            <div
              className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-20
              flex gap-1.5 px-3 py-2 backdrop-blur-md"
              style={{ background: "rgba(0,0,0,0.3)" }}
            >
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="transition-all duration-400"
                  style={{
                    width: selectedIndex === i ? 20 : 5,
                    height: 2,
                    background:
                      selectedIndex === i ? GOLD : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Mobile text panel ── */}
        <div
          className="md:hidden px-5 pt-5 pb-6"
          style={{ background: OLIVE_DARK }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-6" style={{ background: GOLD }} />
            <span
              className="text-[9px] tracking-[0.35em] uppercase font-black"
              style={{ color: GOLD }}
            >
              {current?.mediaType === "video" ? "Video" : "Collection"}
            </span>
          </div>

          {current?.title && (
            <h2
              key={`m-title-${selectedIndex}`}
              className="font-black text-white uppercase leading-[0.92] tracking-tight"
              style={{
                fontSize: "clamp(32px, 9vw, 48px)",
                letterSpacing: "-0.03em",
                animation: "fadeSlideUp 0.55s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              {current.title}
            </h2>
          )}

          {current?.subtitle && (
            <p
              key={`m-sub-${selectedIndex}`}
              className="text-sm mt-2 leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.4)",
                animation:
                  "fadeSlideUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.1s both",
              }}
            >
              {current.subtitle}
            </p>
          )}

          {ctaLabel && ctaHref && (
            <div
              key={`m-cta-${selectedIndex}`}
              style={{
                animation:
                  "fadeSlideUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.18s both",
                marginTop: "1.25rem",
              }}
            >
              <Link
                href={ctaHref}
                className="group inline-flex items-center gap-2.5 text-[11px] font-black
                  tracking-[0.2em] uppercase text-white hover:text-[#C9A84C]
                  transition-all duration-300 hover:gap-4"
                style={{
                  borderBottom: `1px solid rgba(201,168,76,0.3)`,
                  paddingBottom: "2px",
                }}
              >
                {ctaLabel}
                <ArrowRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          )}

          {banners.length > 1 && (
            <div
              className="flex items-center justify-between mt-6 pt-5"
              style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}
            >
              <span
                className="font-mono text-[11px] tracking-wider"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                <AnimatedNumber value={selectedIndex} />
                <span
                  className="mx-1.5"
                  style={{ color: "rgba(255,255,255,0.15)" }}
                >
                  ·
                </span>
                {String(banners.length).padStart(2, "0")}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => selectedIndex > 0 && goTo(selectedIndex - 1)}
                  disabled={selectedIndex === 0}
                  className="w-8 h-8 flex items-center justify-center
                    text-white/40 hover:text-[#C9A84C]
                    disabled:opacity-20 disabled:pointer-events-none
                    transition-all duration-200 active:scale-95"
                  style={{ border: "1px solid rgba(201,168,76,0.2)" }}
                  aria-label="Previous"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M7 2L3 6L7 10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    selectedIndex < banners.length - 1 &&
                    goTo(selectedIndex + 1)
                  }
                  disabled={selectedIndex === banners.length - 1}
                  className="w-8 h-8 flex items-center justify-center
                    text-white/40 hover:text-[#C9A84C]
                    disabled:opacity-20 disabled:pointer-events-none
                    transition-all duration-200 active:scale-95"
                  style={{ border: "1px solid rgba(201,168,76,0.2)" }}
                  aria-label="Next"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M5 2L9 6L5 10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Hero;
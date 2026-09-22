"use client";

import Image from "next/image";

interface ReviewsMarqueeProps {
  images: string[];
}

interface ColumnProps {
  images: string[];
  reverse: boolean;
}

function MarqueeColumn({ images, reverse }: ColumnProps) {
  // Duplicate the list so the track can loop seamlessly with a
  // 50%-translate animation (no gap/jump at the loop point).
  const track = [...images, ...images];

  return (
    <div className="group relative h-[80vh] w-full max-w-[300px] flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)]">
      <div
        className={`flex h-max flex-col gap-6 group-hover:[animation-play-state:paused] ${
          reverse
            ? "animate-[marquee-scroll-reverse_40s_linear_infinite]"
            : "animate-[marquee-scroll_40s_linear_infinite]"
        }`}
      >
        {track.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative aspect-[3/4] w-full flex-none overflow-hidden rounded-xl bg-neutral-100 shadow-lg"
          >
            <Image
              src={src}
              alt={`Review ${(i % images.length) + 1}`}
              fill
              sizes="(max-width: 300px) 90vw, 300px"
              className="object-cover"
              // Screenshots vary in size/aspect ratio, so we don't
              // want Next to complain about missing width/height —
              // "fill" + a fixed-ratio container handles that.
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewsMarquee({ images }: ReviewsMarqueeProps) {
  // Split round-robin into 3 columns so the count stays balanced
  // regardless of how many review images exist.
  const columns: string[][] = [[], [], []];
  images.forEach((src, i) => columns[i % 3].push(src));

  return (
    <div className="mx-auto flex w-full max-w-[1000px] justify-center gap-4 px-4">
      {columns.map((colImages, i) =>
        colImages.length > 0 ? (
          // Alternate direction per column: 0 up, 1 down, 2 up, ...
          <MarqueeColumn key={i} images={colImages} reverse={i % 2 === 1} />
        ) : null,
      )}

      {/* Tailwind has no built-in marquee keyframes, so this defines the
          two custom animations the arbitrary-value classes above refer to.
          styled-jsx is built into Next.js, so no extra setup is needed. */}
      <style jsx global>{`
        @keyframes marquee-scroll {
          from {
            transform: translateY(0);
          }
          to {
            /* Exactly half, since each track is its column duplicated once */
            transform: translateY(-50%);
          }
        }
        @keyframes marquee-scroll-reverse {
          from {
            transform: translateY(-50%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
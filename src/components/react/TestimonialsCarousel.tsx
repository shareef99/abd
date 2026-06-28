import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating: number;
};

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-1" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path
            d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"
            fill={i < n ? "#b08d57" : "rgba(22,21,15,0.12)"}
          />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (d: number) => setState(([i]) => [(i + d + items.length) % items.length, d]),
    [items.length]
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [paused, go]);

  const t = items[index];

  return (
    <div
      className="relative mx-auto max-w-4xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* big quote mark */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 font-display text-[12rem] leading-none text-bronze/15 sm:-top-24 sm:text-[16rem]">
        &ldquo;
      </div>

      <div className="relative min-h-[19rem] sm:min-h-[16rem]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.blockquote
            key={index}
            custom={dir}
            initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -22, filter: "blur(6px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center text-center"
          >
            <Stars n={t.rating} />
            <p className="mt-7 text-balance font-display text-2xl font-light leading-snug text-charcoal sm:text-[2.1rem]">
              {t.quote}
            </p>
            <footer className="mt-8">
              <div className="font-medium text-charcoal">{t.name}</div>
              <div className="mt-0.5 text-sm text-smoke">{t.role}</div>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      {/* controls */}
      <div className="mt-10 flex items-center justify-center gap-5">
        <button
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="grid size-11 place-items-center rounded-full border border-charcoal/15 text-charcoal transition-colors hover:border-bronze hover:bg-bronze hover:text-paper"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-4">
            <path d="M20 12H4M10 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setState([i, i > index ? 1 : -1])}
              aria-label={`Go to testimonial ${i + 1}`}
              className="group relative h-2 overflow-hidden rounded-full bg-charcoal/15 transition-all duration-500"
              style={{ width: i === index ? 34 : 8 }}
            >
              {i === index && <span className="absolute inset-0 bg-bronze" />}
            </button>
          ))}
        </div>

        <button
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="grid size-11 place-items-center rounded-full border border-charcoal/15 text-charcoal transition-colors hover:border-bronze hover:bg-bronze hover:text-paper"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-4">
            <path d="M4 12h16M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

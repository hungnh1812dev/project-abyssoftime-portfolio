"use client";

import { useEffect, useRef } from "react";
import type { PortfolioMetric } from "../home.types";

interface HomeImpactProps {
  stats: PortfolioMetric[];
  title: string;
}

export function HomeImpact({ stats, title }: HomeImpactProps) {
  const scrollRef = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      const firstCard = container.firstElementChild as HTMLElement | null;
      if (!firstCard) return;
      const step = firstCard.offsetWidth + 16; // 16 = gap-4
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 4) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(id);
  }, []);

  return (
    <section id="impact" aria-labelledby="impact-title" className="border-y border-border bg-muted/60 py-14 sm:py-16">
      <h2 id="impact-title" className="mb-8 px-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:px-6">
        {title}
      </h2>
      <dl
        ref={scrollRef}
        aria-label="Impact statistics"
        className="flex justify-center gap-4 overflow-x-hidden px-4 sm:px-6"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex shrink-0 flex-col items-center justify-center rounded-xl border border-border/60 bg-background p-6 text-center w-[calc(50%-8px)] sm:w-[calc(33.33%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)]"
          >
            <dt className="text-3xl font-bold tracking-tight sm:text-4xl">{stat.value}</dt>
            <dd className="mt-1 text-sm font-medium text-foreground/80">{stat.label}</dd>
            {stat.note && (
              <dd className="mt-0.5 text-xs text-muted-foreground">{stat.note}</dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}

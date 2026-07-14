"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type WaterInterfaceProps = {
  children: ReactNode;
};

const initialStyle = {
  "--water-x": "68%",
  "--water-y": "42%",
  "--water-fill": "16%",
  "--water-depth": "0",
  "--water-shift-x": "-8px",
  "--water-shift-y": "5px",
} as CSSProperties;

export function WaterInterface({ children }: WaterInterfaceProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = ref.current;
    if (!hero) return;
    hero.dataset.waterInterface = "ready";
  }, []);

  return (
    <section
      ref={ref}
      className="cinema-hero"
      id="top"
      aria-labelledby="hero-title"
      data-water-interface="idle"
      style={initialStyle}
    >
      <div className="cinema-hero-media" aria-hidden="true">
        <img src="/media/hero-pool.webp" alt="" />
      </div>
      <div className="water-refraction" aria-hidden="true">
        <img src="/media/hero-pool.webp" alt="" />
      </div>
      {children}
    </section>
  );
}

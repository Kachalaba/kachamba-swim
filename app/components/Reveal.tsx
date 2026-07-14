"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  surface?: boolean;
};

export function Reveal({ children, className = "", delay = 0, surface = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const markRevealed = () => {
      setRevealed(true);
      if (surface) element.closest<HTMLElement>(".scene")?.setAttribute("data-surface-pass", "true");
    };
    const revealWithoutMotion = () => {
      if (motionPreference.matches) markRevealed();
    };

    if (!("IntersectionObserver" in window) || motionPreference.matches) {
      const frame = window.requestAnimationFrame(markRevealed);
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        markRevealed();
        if (typeof element.animate === "function") {
          element.animate(
            [
              { opacity: 0.78, transform: "translateY(24px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 760,
              delay,
              easing: "cubic-bezier(.22,1,.36,1)",
              fill: "both",
            },
          );
        }
        observer.disconnect();
      },
      { threshold: 0.18 },
    );

    observer.observe(element);
    motionPreference.addEventListener("change", revealWithoutMotion);
    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", revealWithoutMotion);
    };
  }, [delay, surface]);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-revealed={revealed}
      data-surface={surface || undefined}
    >
      {children}
    </div>
  );
}

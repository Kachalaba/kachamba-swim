"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function RoutePair({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [activeRoute, setActiveRoute] = useState(0);

  useEffect(() => {
    const pair = ref.current;
    if (!pair) return;

    const update = () => {
      frameRef.current = null;
      const routes = [...pair.querySelectorAll<HTMLElement>(".route")];
      if (routes.length < 2) return;
      const focusLine = window.innerHeight * 0.52;
      const distances = routes.map((route) => {
        const rect = route.getBoundingClientRect();
        return Math.abs(rect.top + rect.height / 2 - focusLine);
      });
      setActiveRoute(distances[1] < distances[0] ? 1 : 0);
    };
    const requestUpdate = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    const frame = window.requestAnimationFrame(update);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.cancelAnimationFrame(frame);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return <div ref={ref} className="route-pair" data-active-route={activeRoute}>{children}</div>;
}

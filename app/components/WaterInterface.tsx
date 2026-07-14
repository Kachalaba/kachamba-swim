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
  "--water-depth-y": "0px",
  "--water-depth-scale": "1.015",
  "--water-shift-x": "-8px",
  "--water-shift-y": "5px",
} as CSSProperties;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export function WaterInterface({ children }: WaterInterfaceProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = ref.current;
    if (!hero) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const precisePointer = window.matchMedia("(pointer: fine)");
    let frame: number | null = null;
    let bounds = hero.getBoundingClientRect();
    let pageTop = window.scrollY + bounds.top;
    let targetX = 0.68;
    let targetY = 0.42;
    let currentX = targetX;
    let currentY = targetY;
    let pointerActive = false;
    let touchPointerId: number | null = null;

    const setPointerActive = (active: boolean) => {
      pointerActive = active;
      hero.dataset.waterPointer = active ? "active" : "idle";
    };

    const measure = () => {
      bounds = hero.getBoundingClientRect();
      pageTop = window.scrollY + bounds.top;
    };

    const requestPaint = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(paint);
    };

    const resetTarget = () => {
      targetX = 0.68;
      targetY = 0.42;
      setPointerActive(false);
      requestPaint();
    };

    function paint() {
      frame = null;

      if (motionPreference.matches) {
        hero.style.setProperty("--water-fill", "100%");
        hero.style.setProperty("--water-depth", "0");
        hero.style.setProperty("--water-depth-y", "0px");
        hero.style.setProperty("--water-depth-scale", "1");
        return;
      }

      const progress = clamp((window.scrollY - pageTop) / (bounds.height * 0.72), 0, 1);
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      const scrollFill = 16 + progress * 84;
      const pointerFill = clamp(100 - currentY * 100, 10, 94);
      const fill = pointerActive ? scrollFill * 0.55 + pointerFill * 0.45 : scrollFill;

      hero.style.setProperty("--water-x", `${(currentX * 100).toFixed(2)}%`);
      hero.style.setProperty("--water-y", `${(currentY * 100).toFixed(2)}%`);
      hero.style.setProperty("--water-fill", `${fill.toFixed(2)}%`);
      hero.style.setProperty("--water-depth", progress.toFixed(3));
      hero.style.setProperty("--water-depth-y", `${(-12 * progress).toFixed(2)}px`);
      hero.style.setProperty("--water-depth-scale", (1.015 + 0.03 * progress).toFixed(4));
      hero.style.setProperty("--water-shift-x", `${((0.5 - currentX) * 18).toFixed(2)}px`);
      hero.style.setProperty("--water-shift-y", `${((0.5 - currentY) * 14).toFixed(2)}px`);

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        requestPaint();
      }
    }

    const updateTarget = (event: PointerEvent) => {
      const target = event.target;
      const overControl = target instanceof Element && Boolean(target.closest("a, button"));

      if (event.pointerType === "touch") {
        if (touchPointerId !== event.pointerId || overControl) return;
      } else if (!precisePointer.matches || overControl) {
        resetTarget();
        return;
      }

      targetX = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
      targetY = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
      setPointerActive(true);
      requestPaint();
    };

    const handlePointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !precisePointer.matches) return;
      measure();
      updateTarget(event);
    };
    const handlePointerMove = (event: PointerEvent) => updateTarget(event);
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (event.pointerType !== "touch" || (target instanceof Element && target.closest("a, button"))) return;
      touchPointerId = event.pointerId;
      measure();
      updateTarget(event);
    };
    const handlePointerEnd = (event: PointerEvent) => {
      if (event.pointerType === "touch" && touchPointerId !== event.pointerId) return;
      touchPointerId = null;
      resetTarget();
    };
    const handleResize = () => {
      measure();
      requestPaint();
    };
    const configureMotion = () => {
      if (motionPreference.matches) {
        hero.dataset.waterInterface = "reduced";
        touchPointerId = null;
        setPointerActive(false);
      } else {
        hero.dataset.waterInterface = "ready";
      }
      requestPaint();
    };

    hero.dataset.waterPointer = "idle";
    configureMotion();
    hero.addEventListener("pointerenter", handlePointerEnter);
    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerleave", handlePointerEnd);
    hero.addEventListener("pointerdown", handlePointerDown);
    hero.addEventListener("pointerup", handlePointerEnd);
    hero.addEventListener("pointercancel", handlePointerEnd);
    window.addEventListener("scroll", requestPaint, { passive: true });
    window.addEventListener("resize", handleResize);
    motionPreference.addEventListener("change", configureMotion);

    return () => {
      hero.removeEventListener("pointerenter", handlePointerEnter);
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerEnd);
      hero.removeEventListener("pointerdown", handlePointerDown);
      hero.removeEventListener("pointerup", handlePointerEnd);
      hero.removeEventListener("pointercancel", handlePointerEnd);
      window.removeEventListener("scroll", requestPaint);
      window.removeEventListener("resize", handleResize);
      motionPreference.removeEventListener("change", configureMotion);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="cinema-hero"
      id="top"
      aria-labelledby="hero-title"
      data-water-interface="idle"
      data-water-pointer="idle"
      style={initialStyle}
    >
      <div className="cinema-hero-media" aria-hidden="true">
        {/* The same local crop is required for the paired CSS refraction layers. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/hero-pool.webp" alt="" />
      </div>
      <div className="water-refraction" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/hero-pool.webp" alt="" />
      </div>
      {children}
    </section>
  );
}

"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type ProgressRailProps = {
  label: string;
  items: readonly string[];
  mode: "method" | "coaching";
};

export function ProgressRail({ label, items, mode }: ProgressRailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const rail = ref.current;
    if (!rail) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | null = null;

    const complete = () => {
      setProgress(1);
      setActiveStep(Math.max(0, items.length - 1));
    };
    const updateCoachingProgress = () => {
      frameRef.current = null;
      if (motionPreference.matches) {
        complete();
        return;
      }

      const rect = rail.getBoundingClientRect();
      const travel = window.innerHeight + rect.height;
      const nextProgress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel));
      setProgress(nextProgress);
      setActiveStep(Math.min(items.length - 1, Math.floor(nextProgress * items.length)));
    };
    const requestProgressUpdate = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(updateCoachingProgress);
    };
    const configureMotion = () => {
      observer?.disconnect();
      window.removeEventListener("scroll", requestProgressUpdate);
      window.removeEventListener("resize", requestProgressUpdate);

      if (motionPreference.matches) {
        complete();
        return;
      }

      if (mode === "method") {
        if (!("IntersectionObserver" in window)) {
          complete();
          return;
        }
        observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            complete();
            observer?.disconnect();
          },
          { threshold: 0.22 },
        );
        observer.observe(rail);
        return;
      }

      window.addEventListener("scroll", requestProgressUpdate, { passive: true });
      window.addEventListener("resize", requestProgressUpdate);
      updateCoachingProgress();
    };

    configureMotion();
    motionPreference.addEventListener("change", configureMotion);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", requestProgressUpdate);
      window.removeEventListener("resize", requestProgressUpdate);
      motionPreference.removeEventListener("change", configureMotion);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [items.length, mode]);

  const railStyle = { "--rail-progress": progress } as CSSProperties;

  return (
    <div
      ref={ref}
      className="progress-rail"
      data-progress-rail
      data-progress-mode={mode}
      data-progress={progress.toFixed(3)}
      data-active-step={activeStep + 1}
      data-complete={progress === 1}
      aria-label={label}
      style={railStyle}
    >
      <span className="progress-rail-line" aria-hidden="true" />
      <ol>
        {items.map((item, index) => (
          <li key={item} data-active={mode === "coaching" && index === activeStep}>
            <span>0{index + 1}</span>
            <strong>{item}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}

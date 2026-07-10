"use client";

import { useEffect, useRef, useState } from "react";

type CinematicMediaProps = {
  videoSrc?: string;
  posterSrc: string;
  imageSrc?: string;
  alt: string;
  caption?: string;
  className?: string;
};

export function CinematicMedia({
  videoSrc,
  posterSrc,
  imageSrc,
  alt,
  caption,
  className = "",
}: CinematicMediaProps) {
  const figureRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const visibleRef = useRef(false);
  const fallback = imageSrc ?? posterSrc;

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      setReducedMotion(motionPreference.matches);
      if (motionPreference.matches) {
        setShouldLoad(false);
        const video = videoRef.current;
        if (video) {
          video.pause();
          video.currentTime = 0;
          video.removeAttribute("src");
          video.load();
        }
      }
    };

    syncPreference();
    motionPreference.addEventListener("change", syncPreference);
    return () => motionPreference.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const figure = figureRef.current;
    const video = videoRef.current;
    const motionReducedNow = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!figure || !video || !videoSrc || videoFailed || reducedMotion || motionReducedNow) {
      visibleRef.current = false;
      video?.pause();
      return;
    }

    if (!("IntersectionObserver" in window)) {
      visibleRef.current = true;
      const frame = window.requestAnimationFrame(() => setShouldLoad(true));
      return () => {
        window.cancelAnimationFrame(frame);
        visibleRef.current = false;
        video.pause();
      };
    }

    const nearViewport = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        nearViewport.disconnect();
      },
      { rootMargin: "240px 0px" },
    );
    const visibleViewport = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          video.pause();
          return;
        }

        if (video.getAttribute("src")) {
          video.muted = true;
          void video.play().catch(() => undefined);
        }
      },
      { threshold: 0.08 },
    );

    nearViewport.observe(figure);
    visibleViewport.observe(figure);

    return () => {
      nearViewport.disconnect();
      visibleViewport.disconnect();
      visibleRef.current = false;
      video.pause();
    };
  }, [reducedMotion, videoFailed, videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || reducedMotion || !visibleRef.current) return;
    video.muted = true;
    void video.play().catch(() => undefined);
  }, [reducedMotion, shouldLoad]);

  return (
    <figure ref={figureRef} className={`cinematic-media ${className}`.trim()}>
      {videoSrc && !videoFailed ? (
        <video
          ref={videoRef}
          src={shouldLoad && !reducedMotion ? videoSrc : undefined}
          data-video-src={videoSrc}
          poster={posterSrc}
          muted
          loop
          playsInline
          preload="none"
          aria-label={alt}
          onError={() => setVideoFailed(true)}
        />
      ) : (
        <img src={fallback} alt={alt} loading="lazy" />
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

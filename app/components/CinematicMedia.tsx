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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const fallback = imageSrc ?? posterSrc;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc || videoFailed) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (reducedMotion.matches) {
        video.pause();
        video.currentTime = 0;
        video.load();
        return;
      }

      video.muted = true;
      void video.play().catch(() => undefined);
    };

    syncPlayback();
    reducedMotion.addEventListener("change", syncPlayback);

    return () => {
      reducedMotion.removeEventListener("change", syncPlayback);
      video.pause();
    };
  }, [videoFailed, videoSrc]);

  return (
    <figure className={`cinematic-media ${className}`.trim()}>
      {videoSrc && !videoFailed ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          muted
          loop
          playsInline
          preload="metadata"
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

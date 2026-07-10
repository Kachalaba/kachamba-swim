"use client";

import { useState } from "react";

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
  const [videoFailed, setVideoFailed] = useState(false);
  const fallback = imageSrc ?? posterSrc;

  return (
    <figure className={`cinematic-media ${className}`.trim()}>
      {videoSrc && !videoFailed ? (
        <video
          src={videoSrc}
          poster={posterSrc}
          autoPlay
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

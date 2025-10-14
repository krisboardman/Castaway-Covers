'use client';

import { useEffect, useRef } from 'react';

export default function CastawayVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try to autoplay once
    video.play().catch(() => {
      // Autoplay blocked by browser, that's ok
    });
  }, []);

  const handleClick = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <video
      ref={videoRef}
      src="/castaway-video-optimized.mp4"
      muted
      playsInline
      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
      onClick={handleClick}
    />
  );
}

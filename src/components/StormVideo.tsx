'use client';

import { useEffect, useRef } from 'react';

export default function StormVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let playCount = 0;

    const handleEnded = () => {
      playCount++;
      if (playCount < 2) {
        video.play().catch(() => {
          // Autoplay failed, that's ok
        });
      }
    };

    video.addEventListener('ended', handleEnded);

    // Try to autoplay
    video.play().catch(() => {
      // Autoplay blocked by browser, that's ok
    });

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
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
      src="/storm-video.mp4"
      muted
      playsInline
      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
      onClick={handleClick}
    />
  );
}

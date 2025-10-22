'use client';

import { useEffect, useRef, useState } from 'react';

export default function StormVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try to autoplay once (muted for autoplay to work)
    video.play().catch(() => {
      // Autoplay blocked by browser, that's ok
    });
  }, []);

  const handleClick = () => {
    if (videoRef.current) {
      // Unmute and restart video
      setIsMuted(false);
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src="/storm-video.mp4"
        muted={isMuted}
        loop
        playsInline
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        onClick={handleClick}
      />
      {isMuted && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs pointer-events-none">
          Click for sound 🔊
        </div>
      )}
    </div>
  );
}

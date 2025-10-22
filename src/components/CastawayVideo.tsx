'use client';

import { useEffect, useRef, useState } from 'react';

export default function CastawayVideo() {
  const thumbnailVideoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = thumbnailVideoRef.current;
    if (!video) return;

    // Try to autoplay once (muted for autoplay)
    video.play().catch(() => {
      // Autoplay blocked by browser, that's ok
    });
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    // Check if clicking the mute button area (bottom right corner)
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // If clicking near bottom-right (where mute button is), toggle mute
    // Otherwise, open fullscreen
    if (x > rect.width - 100 && y > rect.height - 50) {
      setIsMuted(!isMuted);
      if (isMuted && thumbnailVideoRef.current) {
        thumbnailVideoRef.current.currentTime = 0;
        thumbnailVideoRef.current.play();
      }
    } else {
      // Open fullscreen modal
      setIsFullscreen(true);
    }
  };

  const handleCloseFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(false);
  };

  return (
    <>
      <div className="relative w-full h-full cursor-pointer" onClick={handleClick}>
        <video
          ref={thumbnailVideoRef}
          src="/castaway-video-optimized.mp4"
          muted={isMuted}
          loop
          playsInline
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-white/90 rounded-full p-4">
            <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs pointer-events-none z-10">
          {isMuted ? 'Click for sound 🔊' : 'Sound on 🔇'}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={handleCloseFullscreen}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
            onClick={handleCloseFullscreen}
          >
            ×
          </button>
          <video
            src="/castaway-video-optimized.mp4"
            controls
            autoPlay
            className="w-full h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

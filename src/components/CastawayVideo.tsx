'use client';

import { useEffect, useRef, useState } from 'react';

export default function CastawayVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try to autoplay once (muted for autoplay)
    video.play().catch(() => {
      // Autoplay blocked by browser, that's ok
    });
  }, []);

  const handleClick = () => {
    if (videoRef.current) {
      // Open fullscreen with sound
      setIsFullscreen(true);
      setIsMuted(false);
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleCloseFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(false);
    setIsMuted(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <>
      <div className="relative w-full h-full cursor-pointer" onClick={handleClick}>
        <video
          ref={videoRef}
          src="/castaway-video-optimized.mp4"
          muted={isMuted}
          playsInline={!isFullscreen}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-white/90 rounded-full p-4">
            <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={handleCloseFullscreen}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            onClick={handleCloseFullscreen}
          >
            ×
          </button>
          <video
            ref={videoRef}
            src="/castaway-video-optimized.mp4"
            controls
            autoPlay
            className="max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

export default function StormVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Only load the ~7MB storm video once the card is near the viewport.
  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Attempt autoplay once the video element is actually rendered.
  useEffect(() => {
    if (!isInView) return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      // Autoplay blocked by browser, that's ok
    });
  }, [isInView]);

  const handleClick = () => {
    if (videoRef.current) {
      // Toggle mute/unmute
      setIsMuted(!isMuted);
      if (isMuted) {
        // If currently muted, restart video with sound
        videoRef.current.currentTime = 0;
      }
      videoRef.current.play();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gray-100">
      {isInView && (
        <video
          ref={videoRef}
          src="/storm-video.mp4"
          muted={isMuted}
          loop
          playsInline
          preload="none"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          onClick={handleClick}
        />
      )}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs pointer-events-none">
        {isMuted ? 'Click for sound 🔊' : 'Click to mute 🔇'}
      </div>
    </div>
  );
}

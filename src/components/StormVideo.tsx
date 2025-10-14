'use client';

export default function StormVideo() {
  return (
    <video
      src="/storm-video.mp4"
      autoPlay
      muted
      playsInline
      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
      onLoadedMetadata={(e) => {
        const video = e.currentTarget;
        let playCount = 0;
        video.addEventListener('ended', function handleEnded() {
          playCount++;
          if (playCount < 2) {
            video.play();
          }
        });
      }}
      onClick={(e) => {
        const video = e.currentTarget;
        video.currentTime = 0;
        video.play();
      }}
    />
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';

const slides: Slide[] = [
  {
    image: '/images/hero/hero6.webp',
    title: 'Hard-to-Fit Covers, Made to Fit',
    subtitle: 'L-shaped bars, grill islands and tricky corners, measured in person and cut to fit.'
  },
  {
    image: '/images/hero/hero1-v3.webp',
    title: 'Cut to Fit Your Layout',
    subtitle: 'A grill island that backs up to a dining table, measured and made to fit the space around it.'
  },
  {
    image: '/images/hero/hero5.webp',
    title: 'Protection Meets the View',
    subtitle: 'Covers that blend into the scene so you never have to choose between protection and beauty.'
  },
  {
    image: '/images/hero/hero2-v2.webp',
    title: 'Marine-Grade Luxury',
    subtitle: 'Heavy-duty vinyl that stays put and looks beautiful year after year'
  },
  {
    image: '/images/hero/hero3.webp',
    title: 'Use Without Removing',
    subtitle: 'Innovative snap straps let you fold back covers for instant relaxing'
  },
  {
    // Portrait photo: desktop uses a wide crop, mobile uses a 4:3 crop so the whole cover shows.
    image: '/images/hero/hero7-grill.webp',
    mobileImage: '/images/hero/hero7-grill-mobile.webp',
    title: 'Stop Struggling With Your Grill Cover',
    subtitle: 'Drape it on and hook the preset bungees to secure it. Custom-fit marine vinyl that comes off just as easily.'
  }
];

type Slide = {
  image: string;
  mobileImage?: string;
  title: string;
  subtitle: string;
};

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="relative w-full h-[260px] md:h-[450px] lg:h-[550px] rounded-xl overflow-hidden bg-gray-100 shadow-2xl mb-8">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className={`object-contain md:object-cover ${slide.mobileImage ? 'hidden md:block' : ''}`}
            priority={index === 0}
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          {slide.mobileImage && (
            <Image
              src={slide.mobileImage}
              alt={slide.title}
              fill
              className="object-contain md:hidden"
              sizes="100vw"
            />
          )}
          
          {/* Text content (only if slide has text) */}
          {(slide.title || slide.subtitle) && (
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-16 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
              <h2 className="text-2xl md:text-6xl font-bold text-white mb-1 md:mb-3 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-sm md:text-2xl text-white/95 drop-shadow-md">
                {slide.subtitle}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Manual navigation arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-2 md:left-4 top-1/3 md:top-1/2 -translate-y-1/2 bg-gray-900/70 hover:bg-gray-900/90 backdrop-blur-sm rounded-full p-2 md:p-3 transition-colors shadow-lg border-2 border-white/30"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-2 md:right-4 top-1/3 md:top-1/2 -translate-y-1/2 bg-gray-900/70 hover:bg-gray-900/90 backdrop-blur-sm rounded-full p-2 md:p-3 transition-colors shadow-lg border-2 border-white/30"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
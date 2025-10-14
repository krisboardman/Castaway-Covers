'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  {
    image: '/images/hero1.jpg',
    title: 'Effortless Protection',
    subtitle: 'Just drape and go - our weighted design means no complicated tie-downs'
  },
  {
    image: '/images/hero2.jpg', 
    title: 'Marine-Grade Luxury',
    subtitle: 'Heavy-duty vinyl that stays put and looks beautiful year after year'
  },
  {
    image: '/images/hero3.jpg',
    title: 'Use Without Removing',
    subtitle: 'Innovative snap straps let you fold back covers for instant entertaining'
  },
  {
    image: '/images/homepage/feature1.jpg',
    title: 'Built to Last',
    subtitle: '5-year warranty on materials that outperform the competition'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[700px] rounded-xl overflow-hidden bg-gray-100 shadow-2xl mb-8">
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
            className="object-cover"
            priority={index === 0}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Text content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="text-xl md:text-2xl text-white/95 drop-shadow-md">
              {slide.subtitle}
            </p>
          </div>
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
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
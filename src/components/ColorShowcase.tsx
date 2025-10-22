'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ColorModalProps {
  color: { name: string; image: string };
  isOpen: boolean;
  onClose: () => void;
}

const standardColors = [
  { name: 'Classic Blue', image: 'classic-blue.webp' },
  { name: 'Cream', image: 'cream.webp' },
  { name: 'Green', image: 'green.webp' },
  { name: 'Grey', image: 'grey.webp' },
  { name: 'Lemon', image: 'lemon.webp' },
  { name: 'Light Brown', image: 'light-brown.webp' },
  { name: 'Mist Grey', image: 'mist-grey.webp' },
  { name: 'Navy', image: 'navy.webp' },
  { name: 'Sand Dune', image: 'sand-dune.webp' },
  { name: 'Wine', image: 'wine.webp' }
];

// Modal component for showing enlarged color texture
const ColorModal: React.FC<ColorModalProps> = ({ color, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-3">{color.name}</h3>
          <div className="relative h-96 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={`/images/colors/${color.image}`}
              alt={`${color.name} texture detail`}
              fill
              className="object-contain"
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">Click outside to close</p>
        </div>
      </div>
    </div>
  );
};

const ColorShowcase: React.FC = () => {
  const [modalColor, setModalColor] = useState<{ name: string; image: string } | null>(null);

  return (
    <>
      <div className="grid grid-cols-5 gap-3">
        {standardColors.map((color) => (
          <div
            key={color.name}
            className="relative rounded-xl overflow-hidden shadow-md bg-white border-2 border-gray-200"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={`/images/colors/${color.image}`}
                alt={color.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 20vw, 20vw"
              />
              <button
                onClick={() => setModalColor(color)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                title={`View ${color.name} detail`}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <div className="p-3 text-center bg-white">
              <span className="text-sm md:text-base font-semibold text-gray-900">{color.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for viewing color texture */}
      <ColorModal
        color={modalColor || { name: '', image: '' }}
        isOpen={!!modalColor}
        onClose={() => setModalColor(null)}
      />
    </>
  );
};

export default ColorShowcase;

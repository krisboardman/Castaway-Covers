'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ColorSelectorProps {
  onColorSelect: (color: string, isPremium: boolean) => void;
}

interface ColorModalProps {
  color: { name: string; image: string };
  isOpen: boolean;
  onClose: () => void;
}

const standardColors = [
  { name: 'Classic Blue', image: 'classic-blue.webp', premium: false },
  { name: 'Cream', image: 'cream.webp', premium: false },
  { name: 'Green', image: 'green.webp', premium: false },
  { name: 'Grey', image: 'grey.webp', premium: false },
  { name: 'Lemon', image: 'lemon.webp', premium: false },
  { name: 'Light Brown', image: 'light-brown.webp', premium: false },
  { name: 'Mist Grey', image: 'mist-grey.webp', premium: false },
  { name: 'Navy', image: 'navy.webp', premium: false },
  { name: 'Sand Dune', image: 'sand-dune.webp', premium: false },
  { name: 'Wine', image: 'wine.webp', premium: false }
];

const premiumColors = [
  { name: 'Diamond Pacific Blue', image: 'diamond-blue.webp', premium: true },
  { name: 'Diamond Red', image: 'diamond-red.webp', premium: true }
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

const ColorSelector: React.FC<ColorSelectorProps> = ({ onColorSelect }) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [modalColor, setModalColor] = useState<{ name: string; image: string } | null>(null);

  const handleColorSelect = (color: typeof standardColors[0]) => {
    setSelectedColor(color.name);
    onColorSelect(color.name, color.premium);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Select Color</h3>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Standard Colors (No Extra Charge)
          <span className="text-xs text-gray-500 ml-2 md:hidden">(Hold to see detail)</span>
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3">
          {standardColors.map((color) => (
            <div key={color.name} className="relative">
              <button
                onClick={() => handleColorSelect(color)}
                className={`relative rounded-lg border-2 transition-all overflow-hidden flex flex-col group w-full ${
                  selectedColor === color.name
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="relative w-full flex-1 min-h-[80px] md:min-h-[96px] overflow-hidden">
                  <Image
                    src={`/images/colors/${color.image}`}
                    alt={color.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-125"
                  />
                </div>
                <div className="p-2 bg-white h-14 flex items-center justify-center">
                  <span className="text-xs md:text-sm font-medium text-center leading-tight">{color.name}</span>
                </div>
              </button>
              <button
                onClick={() => setModalColor(color)}
                className="absolute top-1 right-1 bg-white bg-opacity-90 rounded-full p-1 shadow-md hover:bg-opacity-100 hidden md:block"
                title="View texture detail"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Premium Colors
          <span className="text-gray-500 ml-2">(+$4 per yard)</span>
          <span className="text-xs text-gray-500 ml-2 md:hidden">(Hold to see detail)</span>
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3">
          {premiumColors.map((color) => (
            <div key={color.name} className="relative">
              <button
                onClick={() => handleColorSelect(color)}
                className={`relative rounded-lg border-2 transition-all overflow-hidden flex flex-col group w-full ${
                  selectedColor === color.name
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="relative w-full flex-1 min-h-[80px] md:min-h-[96px] overflow-hidden">
                  <Image
                    src={`/images/colors/${color.image}`}
                    alt={color.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-125"
                  />
                  <span className="absolute top-1 left-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Premium
                  </span>
                </div>
                <div className="p-2 bg-white h-14 flex items-center justify-center">
                  <span className="text-xs md:text-sm font-medium text-center leading-tight">{color.name}</span>
                </div>
              </button>
              <button
                onClick={() => setModalColor(color)}
                className="absolute top-1 right-1 bg-white bg-opacity-90 rounded-full p-1 shadow-md hover:bg-opacity-100 hidden md:block"
                title="View texture detail"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal for viewing color texture */}
      <ColorModal 
        color={modalColor || { name: '', image: '' }} 
        isOpen={!!modalColor} 
        onClose={() => setModalColor(null)} 
      />
    </div>
  );
};

export default ColorSelector;
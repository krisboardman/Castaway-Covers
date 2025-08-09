'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ColorSelectorProps {
  onColorSelect: (color: string, isPremium: boolean) => void;
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

const ColorSelector: React.FC<ColorSelectorProps> = ({ onColorSelect }) => {
  const [selectedColor, setSelectedColor] = useState('');

  const handleColorSelect = (color: typeof standardColors[0]) => {
    setSelectedColor(color.name);
    onColorSelect(color.name, color.premium);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Select Color</h3>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Standard Colors (No Extra Charge)</h4>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3">
          {standardColors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorSelect(color)}
              className={`relative rounded-lg border-2 transition-all overflow-hidden flex flex-col group ${
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
                  className="object-cover transition-transform duration-300 group-hover:scale-150"
                />
              </div>
              <div className="p-2 bg-white h-14 flex items-center justify-center">
                <span className="text-xs md:text-sm font-medium text-center leading-tight">{color.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Premium Colors
          <span className="text-gray-500 ml-2">(+$4 per yard)</span>
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3">
          {premiumColors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorSelect(color)}
              className={`relative rounded-lg border-2 transition-all overflow-hidden flex flex-col group ${
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
                  className="object-cover transition-transform duration-300 group-hover:scale-150"
                />
                <span className="absolute top-1 right-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Premium
                </span>
              </div>
              <div className="p-2 bg-white h-14 flex items-center justify-center">
                <span className="text-xs md:text-sm font-medium text-center leading-tight">{color.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorSelector;
'use client';

import { useState } from 'react';

interface ColorSelectorProps {
  onColorSelect: (color: string, isPremium: boolean) => void;
}

const standardColors = [
  { name: 'Navy Blue', hex: '#000080', premium: false },
  { name: 'Charcoal Gray', hex: '#36454F', premium: false },
  { name: 'Forest Green', hex: '#228B22', premium: false },
  { name: 'Burgundy', hex: '#800020', premium: false },
  { name: 'Tan', hex: '#D2B48C', premium: false },
  { name: 'Black', hex: '#000000', premium: false }
];

const premiumColors = [
  { name: 'Turquoise', hex: '#40E0D0', premium: true },
  { name: 'Coral', hex: '#FF7F50', premium: true },
  { name: 'Lime Green', hex: '#32CD32', premium: true },
  { name: 'Hot Pink', hex: '#FF69B4', premium: true },
  { name: 'Orange', hex: '#FFA500', premium: true },
  { name: 'Purple', hex: '#800080', premium: true },
  { name: 'Yellow', hex: '#FFFF00', premium: true },
  { name: 'White', hex: '#FFFFFF', premium: true }
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
        <div className="grid grid-cols-3 gap-3">
          {standardColors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorSelect(color)}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                selectedColor === color.name
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm">{color.name}</span>
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
        <div className="grid grid-cols-3 gap-3">
          {premiumColors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorSelect(color)}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                selectedColor === color.name
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm">{color.name}</span>
              </div>
              <span className="absolute top-1 right-1 text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                Premium
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorSelector;
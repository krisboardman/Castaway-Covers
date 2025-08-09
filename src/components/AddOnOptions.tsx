'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AddOnOptionsProps {
  productType: string;
  onSnapStrapsChange: (value: boolean) => void;
  onHandlesChange: (value: boolean) => void;
  onMagnetsChange: (value: boolean) => void;
  initialSnapStraps?: boolean;
  initialHandles?: boolean;
  initialMagnets?: boolean;
}

const AddOnOptions: React.FC<AddOnOptionsProps> = ({
  productType,
  onSnapStrapsChange,
  onHandlesChange,
  onMagnetsChange,
  initialSnapStraps = false,
  initialHandles = false,
  initialMagnets = false
}) => {
  const [showSnapStrapImage, setShowSnapStrapImage] = useState(false);
  const [showHandlesImage, setShowHandlesImage] = useState(false);
  const [showMagnetsImage, setShowMagnetsImage] = useState(false);

  // Define which options are available for each product type
  const productOptions = {
    'chairs-recliners': { snapStraps: true, handles: true, magneticClosure: false },
    'sofas-loveseats': { snapStraps: true, handles: true, magneticClosure: true },
    'chaise-lounge': { snapStraps: true, handles: true, magneticClosure: false },
    'ottomans': { snapStraps: false, handles: true, magneticClosure: false },
    'tables': { snapStraps: false, handles: true, magneticClosure: false },
    'table-sets': { snapStraps: false, handles: true, magneticClosure: false }
  };
  
  const options = productOptions[productType as keyof typeof productOptions] || 
                  { snapStraps: false, handles: true, magneticClosure: false };
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Optional Add-Ons</h3>
      
      <div className="space-y-3">
        {options.snapStraps && (
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={initialSnapStraps}
                onChange={(e) => onSnapStrapsChange(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium">Snap Straps</span>
                <span className="text-gray-500 ml-2">+$20 per cover</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowSnapStrapImage(!showSnapStrapImage);
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  {showSnapStrapImage ? 'Hide' : 'View'} Example
                </button>
                <p className="text-sm text-gray-600">Secure your cover with adjustable snap straps</p>
              </div>
            </label>
            {showSnapStrapImage && (
              <div className="mt-4 ml-8 p-4 bg-gray-50 rounded-lg">
                <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
                  <Image
                    src="/images/Options/snap strap.JPEG"
                    alt="Snap straps example"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        {options.handles && (
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={initialHandles}
                onChange={(e) => onHandlesChange(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium">Handles</span>
                <span className="text-gray-500 ml-2">+$20 per cover</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowHandlesImage(!showHandlesImage);
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  {showHandlesImage ? 'Hide' : 'View'} Example
                </button>
                <p className="text-sm text-gray-600">Easy-grip handles for convenient removal</p>
              </div>
            </label>
            {showHandlesImage && (
              <div className="mt-4 ml-8 p-4 bg-gray-50 rounded-lg">
                <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
                  <Image
                    src="/images/Options/handles.JPEG"
                    alt="Handles example"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        {options.magneticClosure && (
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={initialMagnets}
                onChange={(e) => onMagnetsChange(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium">Magnetic Closure</span>
                <span className="text-gray-500 ml-2">+$20 per cover</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMagnetsImage(!showMagnetsImage);
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  {showMagnetsImage ? 'Hide' : 'View'} Example
                </button>
                <p className="text-sm text-gray-600">Magnetic closures for a secure fit</p>
              </div>
            </label>
            {showMagnetsImage && (
              <div className="mt-4 ml-8 p-4 bg-gray-50 rounded-lg">
                <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
                  <Image
                    src="/images/Options/Magnetic-closure.png"
                    alt="Magnetic closure example"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddOnOptions;
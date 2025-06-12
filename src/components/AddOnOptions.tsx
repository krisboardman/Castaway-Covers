'use client';

import { useState } from 'react';

interface AddOnOptionsProps {
  productType: string;
  onSnapStrapsChange: (value: boolean) => void;
  onHandlesChange: (value: boolean) => void;
  onMagnetsChange: (value: boolean) => void;
}

const AddOnOptions: React.FC<AddOnOptionsProps> = ({
  productType,
  onSnapStrapsChange,
  onHandlesChange,
  onMagnetsChange
}) => {
  const [showSnapStrapImage, setShowSnapStrapImage] = useState(false);
  const [showHandlesImage, setShowHandlesImage] = useState(false);
  const [showMagnetsImage, setShowMagnetsImage] = useState(false);
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Optional Add-Ons</h3>
      
      <div className="space-y-3">
        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
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
            <div className="mt-3 ml-8 p-3 bg-gray-50 rounded">
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">Snap Straps Example</span>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
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
            <div className="mt-3 ml-8 p-3 bg-gray-50 rounded">
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">Handles Example</span>
              </div>
            </div>
          )}
        </div>
        
        {productType === 'sofa' && (
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                onChange={(e) => onMagnetsChange(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium">Magnets</span>
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
              <div className="mt-3 ml-8 p-3 bg-gray-50 rounded">
                <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500">Magnets Example</span>
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
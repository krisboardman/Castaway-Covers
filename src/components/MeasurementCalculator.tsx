'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getShopifyClient, findVariantBySKU } from '@/lib/shopify-client';

interface MeasurementCalculatorProps {
  productType: string;
  onCalculate: (sku: string, variantId: string, price: number, yards: number, angle: number, measurements: any) => void;
}

interface BaseMeasurements {
  length: number;
  width: number;
  height: number;
}

interface ChairMeasurements extends BaseMeasurements {
  backHeight: number;
  armHeight: number;
  seatDepth: number;
}

type Measurements = BaseMeasurements | ChairMeasurements;

const productConfigs = {
  'chairs-recliners': {
    fields: ['width', 'length', 'height', 'backrestDepth', 'armrestHeight'],
    labels: {
      width: 'Width',
      length: 'Length',
      height: 'Height',
      backrestDepth: 'Backrest Depth',
      armrestHeight: 'Ground to Top of Armrest'
    },
    hasAngle: true,
    measurementImage: '/images/Measurements/chair measurements.jpg'
  },
  'sofas-loveseats': {
    fields: ['width', 'length', 'height', 'backrestDepth', 'armrestHeight'],
    labels: {
      width: 'Width',
      length: 'Length',
      height: 'Height',
      backrestDepth: 'Backrest Depth',
      armrestHeight: 'Ground to Top of Armrest'
    },
    hasAngle: true,
    measurementImage: '/images/Measurements/sofa_measurements_text.jpg'
  },
  'chaise-lounge': {
    fields: ['width', 'length', 'height', 'backrestDepth', 'armrestHeight'],
    labels: {
      width: 'Width',
      length: 'Length',
      height: 'Height',
      backrestDepth: 'Backrest Depth',
      armrestHeight: 'Ground to Top of Armrest'
    },
    hasAngle: true,
    measurementImage: null // No image available yet
  },
  'ottomans': {
    fields: ['width', 'length', 'height'],
    labels: {
      width: 'Width',
      length: 'Length',
      height: 'Height'
    },
    hasAngle: false,
    measurementImage: '/images/Measurements/ottoman measurements.jpg'
  },
  'tables': {
    fields: ['width', 'length', 'height'],
    labels: {
      width: 'Width',
      length: 'Length',
      height: 'Height'
    },
    hasAngle: false,
    measurementImage: '/images/Measurements/table measurements.jpg'
  },
  'table-sets': {
    fields: ['width', 'length', 'height'],
    labels: {
      width: 'Width',
      length: 'Length',
      height: 'Height'
    },
    hasAngle: false,
    measurementImage: '/images/Measurements/tableset measurements.jpg'
  }
};

const MeasurementCalculator: React.FC<MeasurementCalculatorProps> = ({ productType, onCalculate }) => {
  const [measurements, setMeasurements] = useState<any>({
    length: 0,
    width: 0,
    height: 0,
    backrestDepth: 0,
    armrestHeight: 0
  });
  const [showGuide, setShowGuide] = useState(false);

  // Calculate angle for furniture with backrests
  const calculateAngle = () => {
    if (measurements.backrestDepth > 0 && measurements.height > 0 && measurements.armrestHeight > 0) {
      const vertical = measurements.height - measurements.armrestHeight;
      const horizontal = measurements.backrestDepth;
      return Math.sqrt(vertical * vertical + horizontal * horizontal);
    }
    return 0;
  };

  const config = productConfigs[productType as keyof typeof productConfigs] || productConfigs.sofa;

  const calculateSKU = (measurements: any): string => {
    const baseCode = productType.toUpperCase().slice(0, 3);
    if (productType === 'chair') {
      return `${baseCode}-${measurements.length}x${measurements.width}x${measurements.height}-${measurements.backHeight}`;
    }
    return `${baseCode}-${measurements.length}x${measurements.width}x${measurements.height}`;
  };

  const generateShopifySKU = (yards: number): string => {
    // Map our product types to Shopify SKU formats based on the CSV
    const skuMappings: { [key: string]: string } = {
      'chairs-recliners': 'chairs/recliners',
      'sofas-loveseats': 'sofas-loveseats',
      'chaise-lounge': 'Chaiselounges',
      'ottomans': 'Ottomans',
      'tables': 'tables',
      'table-sets': 'tablesets'
    };
    
    const shopifyProductType = skuMappings[productType] || productType;
    return `${shopifyProductType}-${yards}`;
  };

  const calculateYards = (measurements: any): number => {
    const { width, length, height, backrestDepth, armrestHeight } = measurements;
    
    // Complex calculation for chairs/recliners, sofas/loveseats, and chaise lounge
    if (productType === 'chairs-recliners' || productType === 'sofas-loveseats' || productType === 'chaise-lounge') {
      if (!width || !length || !height || !backrestDepth || !armrestHeight) return 0;
      
      const angle = calculateAngle();
      const heightAdjusted = (height - 6) * 2;
      
      let yardsNeeded;
      if (width <= 54) {
        yardsNeeded = (length + backrestDepth + angle + heightAdjusted + 
                      (width + heightAdjusted - 54 + 1) + 1) / 36;
      } else {
        yardsNeeded = (length + backrestDepth + angle + heightAdjusted + 
                      ((width + heightAdjusted - 54 + 1) * 2) + 1) / 36;
      }
      
      return Math.ceil(yardsNeeded);
    }
    
    // Calculation for ottomans
    if (productType === 'ottomans') {
      if (!width || !length || !height) return 0;
      
      const lengthAdjusted = (length - 3) * 2;
      
      let yardsNeeded;
      if (width <= 54) {
        yardsNeeded = (height + lengthAdjusted + 
                      (width + lengthAdjusted - 54 + 1) + 1) / 36;
      } else {
        yardsNeeded = (height + lengthAdjusted + 
                      ((width + lengthAdjusted - 54 + 1) * 2) + 1) / 36;
      }
      
      return Math.ceil(yardsNeeded);
    }
    
    // Calculation for tables and table sets
    if (productType === 'tables' || productType === 'table-sets') {
      if (!width || !length || !height) return 0;
      
      const lengthAdjusted = (length - 6) * 2;
      
      let yardsNeeded;
      if (width <= 54) {
        yardsNeeded = (height + lengthAdjusted + 
                      (width + lengthAdjusted - 54 + 1) + 1) / 36;
      } else {
        yardsNeeded = (height + lengthAdjusted + 
                      ((width + lengthAdjusted - 54 + 1) * 2) + 1) / 36;
      }
      
      return Math.ceil(yardsNeeded);
    }
    
    return 0;
  };

  const calculatePrice = (yards: number): number => {
    const pricePerYard = 25;
    return yards * pricePerYard;
  };


  const handleCalculate = async () => {
    const requiredFields = config.fields;
    const hasAllMeasurements = requiredFields.every(field => measurements[field] > 0);
    
    if (hasAllMeasurements) {
      const displaySKU = calculateSKU(measurements); // Keep existing SKU for display
      const yards = calculateYards(measurements);
      const shopifySKU = generateShopifySKU(yards); // New Shopify SKU format
      const price = calculatePrice(yards);
      
      // Log calculations for debugging
      console.log('Measurements:', measurements);
      console.log('Calculated yards:', yards);
      console.log('Shopify SKU:', shopifySKU);
      console.log('Display SKU:', displaySKU);
      console.log('Price:', price);
      
      // Look up the variant in Shopify
      const variantInfo = await findVariantBySKU(shopifySKU);
      
      if (variantInfo) {
        console.log('Found variant:', variantInfo);
        // Use the actual price from Shopify if available
        const finalPrice = parseFloat(variantInfo.price) || price;
        const angle = config.hasAngle ? calculateAngle() : 0;
        onCalculate(displaySKU, variantInfo.variantId, finalPrice, yards, angle, measurements);
      } else {
        console.error('No variant found for SKU:', shopifySKU);
        alert(`Product variant not found for ${yards} yards. Please contact support.`);
        const angle = config.hasAngle ? calculateAngle() : 0;
        onCalculate(displaySKU, '', price, yards, angle, measurements);
      }
    }
  };

  const handleMeasurementChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setMeasurements((prev: any) => ({
      ...prev,
      [field]: numValue
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Enter Measurements (inches)</h3>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="text-blue-600 hover:text-blue-800 text-sm underline"
        >
          {showGuide ? 'Hide' : 'Show'} Measurement Guide
        </button>
      </div>
      
      {showGuide && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          {config.measurementImage ? (
            <div className="relative h-64 md:h-96 rounded overflow-hidden">
              <Image
                src={config.measurementImage}
                alt={`${productType} measurement guide`}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500">
                Measurement guide not available yet
              </span>
            </div>
          )}
          <p className="text-sm text-gray-600 mt-2">
            Measure your furniture at the widest points for each dimension
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {config.fields.map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {config.labels[field as keyof typeof config.labels]}
            </label>
            <input
              type="number"
              min="0"
              step="0.25"
              value={measurements[field] || ''}
              onChange={(e) => handleMeasurementChange(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        ))}
        
        {/* Angle is calculated internally but not shown to customers */}
      </div>
      
      <button
        onClick={handleCalculate}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        disabled={!config.fields.every(field => measurements[field] > 0)}
      >
        Calculate Cover Size & Price
      </button>
    </div>
  );
};

export default MeasurementCalculator;
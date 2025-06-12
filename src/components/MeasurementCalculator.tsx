'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getShopifyClient } from '@/lib/shopify-client';

interface MeasurementCalculatorProps {
  productType: string;
  onCalculate: (sku: string, variantId: string, price: number, yards: number) => void;
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
  sofa: {
    fields: ['length', 'width', 'height'],
    labels: {
      length: 'Length (side to side)',
      width: 'Width (front to back)',
      height: 'Height (bottom to top)'
    },
    measurementImage: '/images/sofa-measurement-guide.jpg'
  },
  chair: {
    fields: ['length', 'width', 'height', 'backHeight', 'armHeight', 'seatDepth'],
    labels: {
      length: 'Width (arm to arm)',
      width: 'Depth (front to back)',
      height: 'Total Height',
      backHeight: 'Back Height',
      armHeight: 'Arm Height',
      seatDepth: 'Seat Depth'
    },
    measurementImage: '/images/chair-measurement-guide.jpg'
  },
  table: {
    fields: ['length', 'width', 'height'],
    labels: {
      length: 'Length',
      width: 'Width',
      height: 'Height'
    },
    measurementImage: '/images/table-measurement-guide.jpg'
  },
  ottoman: {
    fields: ['length', 'width', 'height'],
    labels: {
      length: 'Length',
      width: 'Width',
      height: 'Height'
    },
    measurementImage: '/images/ottoman-measurement-guide.jpg'
  },
  loveseat: {
    fields: ['length', 'width', 'height'],
    labels: {
      length: 'Length (side to side)',
      width: 'Width (front to back)',
      height: 'Height (bottom to top)'
    },
    measurementImage: '/images/loveseat-measurement-guide.jpg'
  },
  sectional: {
    fields: ['length', 'width', 'height'],
    labels: {
      length: 'Total Length (all sections)',
      width: 'Width (front to back)',
      height: 'Height (bottom to top)'
    },
    measurementImage: '/images/sectional-measurement-guide.jpg'
  }
};

const MeasurementCalculator: React.FC<MeasurementCalculatorProps> = ({ productType, onCalculate }) => {
  const [measurements, setMeasurements] = useState<any>({
    length: 0,
    width: 0,
    height: 0,
    backHeight: 0,
    armHeight: 0,
    seatDepth: 0
  });
  const [showGuide, setShowGuide] = useState(false);
  const [shopifyClient, setShopifyClient] = useState<any>(null);

  useEffect(() => {
    const initClient = async () => {
      const client = await getShopifyClient();
      if (client) {
        setShopifyClient(client);
      }
    };
    initClient();
  }, []);

  const config = productConfigs[productType as keyof typeof productConfigs] || productConfigs.sofa;

  const calculateSKU = (measurements: any): string => {
    const baseCode = productType.toUpperCase().slice(0, 3);
    if (productType === 'chair') {
      return `${baseCode}-${measurements.length}x${measurements.width}x${measurements.height}-${measurements.backHeight}`;
    }
    return `${baseCode}-${measurements.length}x${measurements.width}x${measurements.height}`;
  };

  const generateShopifySKU = (yards: number): string => {
    return `${productType}-${yards}`;
  };

  const calculateYards = (measurements: any): number => {
    let surfaceArea;
    
    switch (productType) {
      case 'chair':
        // More complex calculation for chairs
        surfaceArea = (measurements.length * measurements.height) + 
                     (measurements.width * measurements.height * 2) + 
                     (measurements.length * measurements.width) +
                     (measurements.backHeight * measurements.length);
        break;
      case 'sectional':
        // Sectionals need more fabric
        surfaceArea = 2.5 * (measurements.length * measurements.width + 
                           measurements.length * measurements.height + 
                           measurements.width * measurements.height);
        break;
      default:
        // Standard calculation for sofas, tables, ottomans, loveseats
        surfaceArea = 2 * (measurements.length * measurements.width + 
                          measurements.length * measurements.height + 
                          measurements.width * measurements.height);
    }
    
    const yardsNeeded = Math.ceil(surfaceArea / (36 * 36));
    return Math.max(2, Math.min(10, yardsNeeded));
  };

  const calculatePrice = (yards: number): number => {
    const pricePerYard = 25;
    return yards * pricePerYard;
  };

  const lookupVariantIdBySKU = async (sku: string): Promise<string> => {
    if (!shopifyClient) {
      console.log(`No Shopify client available to lookup SKU: ${sku}`);
      return '';
    }
    
    try {
      // Fetch all products
      const products = await shopifyClient.product.fetchAll();
      
      // Search through all products and their variants for matching SKU
      for (const product of products) {
        const variant = product.variants.find((v: any) => v.sku === sku);
        if (variant) {
          return variant.id;
        }
      }
      
      console.warn(`No variant found with SKU: ${sku}`);
      return '';
    } catch (error) {
      console.error('Error looking up variant:', error);
      return '';
    }
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
      
      // Temporary alert to verify calculations
      alert(`Calculated: ${yards} yards, SKU: ${shopifySKU}`);
      
      const variantId = await lookupVariantIdBySKU(shopifySKU); // Lookup by SKU
      console.log('Found variant ID:', variantId);
      console.log('Variant ID empty?', !variantId);
      console.log('Shopify client available?', !!shopifyClient);
      
      // Pass the display SKU for showing in order summary, but use Shopify SKU for lookup
      onCalculate(displaySKU, variantId, price, yards);
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
          <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-500">
              {productType.charAt(0).toUpperCase() + productType.slice(1)} Measurement Guide
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Measure your {productType} at the widest points for each dimension
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
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getShopifyClient, findVariantBySKU, clearProductCache } from '@/lib/shopify-client';

interface MeasurementCalculatorProps {
  productType: string;
  onCalculate: (sku: string, variantId: string, price: number, yards: number, angle: number, measurements: any) => void;
  initialMeasurements?: any;
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

const MeasurementCalculator: React.FC<MeasurementCalculatorProps> = ({ productType, onCalculate, initialMeasurements }) => {
  const [measurements, setMeasurements] = useState<any>(initialMeasurements || {
    length: 0,
    width: 0,
    height: 0,
    backrestDepth: 0,
    armrestHeight: 0
  });
  const [showGuide, setShowGuide] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const config = productConfigs[productType as keyof typeof productConfigs] || productConfigs['sofas-loveseats'];

  // Auto-calculate when initial measurements are provided (editing mode)
  useEffect(() => {
    if (initialMeasurements && config.fields.every(field => initialMeasurements[field] > 0)) {
      // Small delay to ensure component is fully mounted
      setTimeout(() => handleCalculate(), 100);
    }
  }, []); // Only run once on mount

  // Reset calculated state when measurements change
  useEffect(() => {
    setHasCalculated(false);
  }, [measurements]);

  // Calculate angle for furniture with backrests
  const calculateAngle = () => {
    if (measurements.backrestDepth > 0 && measurements.height > 0 && measurements.armrestHeight > 0) {
      const vertical = measurements.height - measurements.armrestHeight;
      const horizontal = measurements.backrestDepth;
      return Math.sqrt(vertical * vertical + horizontal * horizontal);
    }
    return 0;
  };

  const calculateSKU = (measurements: any): string => {
    const baseCode = productType.toUpperCase().slice(0, 3);
    if (productType === 'chair') {
      return `${baseCode}-${measurements.length}x${measurements.width}x${measurements.height}-${measurements.backHeight}`;
    }
    return `${baseCode}-${measurements.length}x${measurements.width}x${measurements.height}`;
  };

  const generateShopifySKU = (yards: number): string => {
    // Map our product types to Shopify SKU formats based on the actual CSV/Shopify data
    const skuMappings: { [key: string]: string } = {
      'chairs-recliners': 'chairs/recliners',
      'sofas-loveseats': 'sofas-loveseats',
      'chaise-lounge': 'Chaiselounges',  // Note: singular in URL, but SKU uses "Chaiselounges"
      'chaise-lounges': 'Chaiselounges', // Handle both singular and plural
      'ottomans': 'Ottomans',
      'tables': 'tables',
      'table-sets': 'tablesets'
    };
    
    const shopifyProductType = skuMappings[productType] || productType;
    console.log(`Generating SKU for productType: ${productType}, yards: ${yards}, result: ${shopifyProductType}-${yards}`);
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
      setHasCalculated(true);
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
        console.log('Attempting fallback search for yards:', yards);
        
        // Try to find by variant title instead of SKU
        const client = await getShopifyClient();
        if (client) {
          try {
            const products = await client.product.fetchAll(250);
            let foundVariant = null;
            
            console.log(`Fallback search for ${productType} with ${yards} yards`);
            
            for (const product of products) {
              // More flexible product matching
              const productHandle = product.handle.toLowerCase();
              const productTitle = product.title.toLowerCase();
              const searchType = productType.toLowerCase().replace('-', '');
              
              console.log(`Checking product: ${product.title} (${product.handle})`);
              
              // Check if this product matches our type
              if (productHandle.includes('chair') && productType === 'chairs-recliners' ||
                  productTitle.includes('chair') && productType === 'chairs-recliners' ||
                  productHandle.includes(searchType) ||
                  productTitle.includes(searchType)) {
                
                console.log(`Product matches type ${productType}, checking variants...`);
                
                for (const variant of product.variants) {
                  console.log(`  Variant: ${variant.title}, SKU: ${variant.sku}`);
                  
                  if (variant.title === `${yards} yards` || 
                      variant.title === `${yards} Yards` ||
                      variant.title.toLowerCase() === `${yards} yards`) {
                    console.log('Found variant by title match:', variant);
                    foundVariant = {
                      variantId: variant.id.toString().split('/').pop(),
                      price: variant.price.amount,
                      title: variant.title,
                      productTitle: product.title
                    };
                    break;
                  }
                }
              }
              if (foundVariant) break;
            }
            
            if (foundVariant) {
              const finalPrice = parseFloat(foundVariant.price) || price;
              const angle = config.hasAngle ? calculateAngle() : 0;
              onCalculate(displaySKU, foundVariant.variantId, finalPrice, yards, angle, measurements);
              return;
            }
          } catch (e) {
            console.error('Fallback search failed:', e);
          }
        }
        
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
        <div className="flex gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            {showGuide ? 'Hide' : 'Show'} Measurement Guide
          </button>
          {/* Debug button - only show in development */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => {
                clearProductCache();
                alert('Product cache cleared. Try calculating again.');
              }}
              className="text-red-600 hover:text-red-800 text-sm underline"
            >
              Clear Cache
            </button>
          )}
        </div>
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
        className={`w-full py-3 px-4 rounded-md font-medium transition-all ${
          config.fields.every(field => measurements[field] > 0) && !hasCalculated
            ? 'bg-orange-600 hover:bg-orange-700 text-white animate-pulse'
            : 'bg-brand-teal hover:bg-brand-teal-dark text-white'
        }`}
        disabled={!config.fields.every(field => measurements[field] > 0)}
      >
        {config.fields.every(field => measurements[field] > 0) && !hasCalculated
          ? '⚠️ Click to Update Price & Size'
          : 'Calculate Cover Size & Price'}
      </button>
    </div>
  );
};

export default MeasurementCalculator;
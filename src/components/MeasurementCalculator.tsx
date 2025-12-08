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
    fields: ['width', 'length', 'height', 'backrestDepth', 'armrestHeight', 'backWidth'],
    labels: {
      width: 'Width',
      length: 'Depth (drop a line straight down from the back of the chair to the ground, then measure horizontally to the front edge)',
      height: 'Height',
      backrestDepth: 'Backrest Depth',
      armrestHeight: 'Ground to Top of Armrest',
      backWidth: 'Back Width (if smaller than width)'
    },
    hasAngle: true,
    measurementImage: '/images/Measurements/chair measurements.jpg'
  },
  'sofas-loveseats': {
    fields: ['width', 'length', 'height', 'backrestDepth', 'armrestHeight'],
    labels: {
      width: 'Length',
      length: 'Depth (drop a line straight down from the back to the ground, then measure horizontally to the front edge)',
      height: 'Height',
      backrestDepth: 'Backrest Depth',
      armrestHeight: 'Ground to Top of Armrest'
    },
    hasAngle: true,
    measurementImage: '/images/Measurements/sofa_measurements_text.jpg'
  },
  'chaise-lounge': {
    fields: ['width', 'length', 'height', 'armrestHeight', 'armLength'],
    labels: {
      width: 'Width (arm to arm)',
      length: 'Length (folded down)',
      height: 'Floor to Bottom of Seat',
      armrestHeight: 'Floor to Top of Armrest',
      armLength: 'Arm Length'
    },
    hasAngle: false,
    measurementImage: '/images/Measurements/chaise measurements.jpg'
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
    armrestHeight: 0,
    backWidth: 0,
    armLength: 0
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

  // Calculate AT2F (Armrest-Top to Front) for furniture with backrests
  // This uses the HTML calculator formula: √[(H - F2A)² + D²]
  const calculateAngle = () => {
    if (measurements.length > 0 && measurements.height > 0 && measurements.armrestHeight > 0) {
      const vertical = measurements.height - measurements.armrestHeight;
      const horizontal = measurements.length; // length = depth
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
    return `${shopifyProductType}-${yards}`;
  };

  const calculateYards = (measurements: any): number => {
    const { width, length, height, backrestDepth, armrestHeight } = measurements;

    // Calculation for chaise lounge (new formula based on spreadsheet)
    if (productType === 'chaise-lounge') {
      if (!width || !length || !height || !armrestHeight) return 0;

      // Constants
      const BOLT_WIDTH = 54; // Width of material bolt from supplier
      const CLEARANCE = 3;   // Floor clearance

      // FTBS = height (floor to bottom of seat/cushion)
      // FTA = armrestHeight (floor to top of armrest)
      const FTBS = height;
      const FTA = armrestHeight;

      // Main length = length + 2(FTBS - 3 clearance)
      const mainLength = length + 2 * (FTBS - CLEARANCE);

      // Main width = width + 2(FTA - 3 clearance)
      const mainWidth = width + 2 * (FTA - CLEARANCE);

      // Additional length if main width > bolt width (54")
      // Formula: (main width - bolt width) + 2
      let additionalLength = 0;
      if (mainWidth > BOLT_WIDTH) {
        additionalLength = (mainWidth - BOLT_WIDTH) + 2;
      }

      // Total length needed
      const totalLength = mainLength + additionalLength;

      // Convert to yards and round up
      const yardsNeeded = totalLength / 36;

      return Math.ceil(yardsNeeded);
    }

    // Calculation for chairs/recliners (single piece)
    if (productType === 'chairs-recliners') {
      if (!width || !length || !height || !backrestDepth || !armrestHeight) return 0;

      // Constants from HTML calculator
      const FC = 6;    // Floor clearance
      const hem = 0.5; // Hem allowance

      // AT2F = √[(H - F2A)² + D²] where:
      // H = height, F2A = armrestHeight, D = length (depth)
      const AT2F = calculateAngle();

      // ML = (H + BR + AT2F + F2A) - (2 × FC)
      // Main length calculation
      const ML = (height + backrestDepth + AT2F + armrestHeight) - (2 * FC);

      // addLength = F2A + AT2F + BR - FC + hem
      const addLength = armrestHeight + AT2F + backrestDepth - FC + hem;

      // Total length needed = ML + addLength
      const lengthNeeded = ML + addLength;

      // Convert to yards and round up
      const yardsNeeded = lengthNeeded / 36;

      return Math.ceil(yardsNeeded);
    }

    // Calculation for sofas/loveseats (uses 2 lanes with center seam)
    if (productType === 'sofas-loveseats') {
      if (!width || !length || !height || !backrestDepth || !armrestHeight) return 0;

      // Constants from HTML calculator
      const FC = 4;    // Floor clearance (different for sofas)
      const hem = 0.5; // Hem allowance

      // AT2F = √[(H - F2A)² + D²]
      const AT2F = calculateAngle();

      // ML = (H + BR + AT2F + F2A) - (2 × FC)
      const ML = (height + backrestDepth + AT2F + armrestHeight) - (2 * FC);

      // addLength = F2A + AT2F + BR - FC + hem
      const addLength = armrestHeight + AT2F + backrestDepth - FC + hem;

      // Per lane length needed = ML + addLength
      const perLaneLength = ML + addLength;

      // Yards per lane
      const yardsPerLane = perLaneLength / 36;

      // Total yards = (yards per lane × 2 lanes), rounded up
      // Round AFTER multiplying to avoid over-rounding
      const totalYards = Math.ceil(yardsPerLane * 2);

      return totalYards;
    }
    
    // Calculation for ottomans (using HTML calculator formula)
    if (productType === 'ottomans') {
      if (!width || !length || !height) return 0;

      // Constants from HTML calculator
      const FC = 4; // Floor clearance

      // HTML calculator formula:
      // drop = H - FC (square cutouts)
      // MD = W + 2*drop (overall cut width)
      // ML = L + 2*drop (overall cut length)
      // Yards = ML / 36, rounded up

      const drop = Math.max(0, height - FC);
      const ML = Math.max(0, length + 2 * drop);

      const yardsNeeded = ML / 36;

      return Math.ceil(yardsNeeded);
    }

    // Calculation for tables and table sets (using HTML calculator formula)
    if (productType === 'tables' || productType === 'table-sets') {
      if (!width || !length || !height) return 0;

      // Constants from HTML calculator
      const FC = 4; // Floor clearance

      // HTML calculator formula (same as ottomans):
      // drop = H - FC
      // ML = L + 2*drop
      // Yards = ML / 36, rounded up

      const drop = Math.max(0, height - FC);
      const ML = Math.max(0, length + 2 * drop);

      const yardsNeeded = ML / 36;

      return Math.ceil(yardsNeeded);
    }
    
    return 0;
  };

  const calculatePrice = (yards: number): number => {
    const pricePerYard = 45;
    return yards * pricePerYard;
  };


  const handleCalculate = async () => {
    // backWidth and armLength are optional, exclude them from required fields validation
    const requiredFields = config.fields.filter(field => field !== 'backWidth' && field !== 'armLength');
    const hasAllMeasurements = requiredFields.every(field => measurements[field] > 0);
    
    if (hasAllMeasurements) {
      setHasCalculated(true);
      const displaySKU = calculateSKU(measurements); // Keep existing SKU for display
      const yards = calculateYards(measurements);
      const shopifySKU = generateShopifySKU(yards); // New Shopify SKU format
      const price = calculatePrice(yards);

      // Look up the variant in Shopify
      const variantInfo = await findVariantBySKU(shopifySKU);

      if (variantInfo) {
        // Use the actual price from Shopify if available
        const finalPrice = parseFloat(variantInfo.price) || price;
        const angle = config.hasAngle ? calculateAngle() : 0;
        onCalculate(displaySKU, variantInfo.variantId, finalPrice, yards, angle, measurements);
      } else {
        // Try to find by variant title instead of SKU
        const client = await getShopifyClient();
        if (client) {
          try {
            const products = await client.product.fetchAll(250);
            let foundVariant = null;
            
            for (const product of products) {
              // More flexible product matching
              const productHandle = product.handle.toLowerCase();
              const productTitle = product.title.toLowerCase();
              const searchType = productType.toLowerCase().replace('-', '');

              // Check if this product matches our type
              if (productHandle.includes('chair') && productType === 'chairs-recliners' ||
                  productTitle.includes('chair') && productType === 'chairs-recliners' ||
                  productHandle.includes(searchType) ||
                  productTitle.includes(searchType)) {

                for (const variant of product.variants) {
                  if (variant.title === `${yards} yards` ||
                      variant.title === `${yards} Yards` ||
                      variant.title.toLowerCase() === `${yards} yards`) {
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
            // Fallback search failed
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
      
      {/* Important measurement warning */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm font-semibold text-yellow-800 mb-1">
          ⚠️ Important: Custom Cover Measurement Notice
        </p>
        <p className="text-sm text-yellow-700">
          We manufacture exactly to the dimensions you provide. Please double-check all measurements before ordering.
          We recommend measuring twice to ensure accuracy. We cannot accept returns for covers that don't fit due to
          incorrect measurements provided at checkout.{' '}
          <a href="/contact" className="underline hover:text-yellow-900">Contact us</a> if you have any questions on measuring.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {config.fields.map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {config.labels[field as keyof typeof config.labels]}
            </label>
            <input
              type="number"
              min="0"
              step="1"
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
          config.fields.filter(field => field !== 'backWidth' && field !== 'armLength').every(field => measurements[field] > 0) && !hasCalculated
            ? 'bg-orange-600 hover:bg-orange-700 text-white animate-pulse'
            : 'bg-brand-teal hover:bg-brand-teal-dark text-white'
        }`}
        disabled={!config.fields.filter(field => field !== 'backWidth' && field !== 'armLength').every(field => measurements[field] > 0)}
      >
        {config.fields.filter(field => field !== 'backWidth' && field !== 'armLength').every(field => measurements[field] > 0) && !hasCalculated
          ? '⚠️ Click to Update Price & Size'
          : 'Calculate Cover Size & Price'}
      </button>
    </div>
  );
};

export default MeasurementCalculator;
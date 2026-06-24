'use client';

/**
 * ⚠️ READ BEFORE EDITING MEASUREMENT LOGIC
 *
 * For sofas, the internal field `width` holds the sofa's LENGTH, and the
 * internal field `length` holds the sofa's front-to-back depth. The customer
 * label `Length` is mapped from `width` and `Front-to-Back Depth` is mapped
 * from `length`. Every place that reads sofa measurements must account for
 * this inversion — the cart store, email templates, and Shopify metadata
 * all depend on it being correct.
 *
 * See docs/framework/principles.md §6 ("It treats the sofa like every other
 * product type") — the project's own documentation calls this the single
 * most dangerous trap in the codebase. Do not "fix" the inversion without
 * tracing every consumer first.
 *
 * Customer-facing labels live in src/lib/measurement-labels.ts and the
 * `productConfigs` map below. Keep them in sync.
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getShopifyClient, findVariantBySKU, clearProductCache } from '@/lib/shopify-client';
import { MEASUREMENT_PROMO_ACTIVE } from '@/config/site';
// Single source of truth for yardage math, shared with the standalone HTML
// calculators in /calculators. Pilot scope: tables/table-sets.
// @ts-ignore — plain JS module, no type declarations.
import CoverMath from '../../calculators/shared/cover-math.js';

interface MeasurementCalculatorProps {
  productType: string;
  onCalculate: (sku: string, variantId: string, price: number, yards: number, angle: number, measurements: any) => void;
  initialMeasurements?: any;
  // Tables page only: 'table' | 'set' | 'grill'. Only a 'set' has chair seats,
  // so the "Over the seats" drape is hidden otherwise.
  coverType?: 'table' | 'set' | 'grill';
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

// Soft validation ranges per furniture type and field.
// Values outside these ranges trigger a gentle warning, but never block submission.
const validationRanges: Record<string, Record<string, { min: number; max: number; label: string }>> = {
  'chairs-recliners': {
    width:          { min: 18, max: 50,  label: 'Chair width' },
    length:         { min: 18, max: 45,  label: 'Front-to-back depth' },
    height:         { min: 28, max: 50,  label: 'Chair height' },
    backrestDepth:  { min: 1,  max: 14,  label: 'Backrest thickness' },
    armrestHeight:  { min: 14, max: 34,  label: 'Ground-to-armrest height' },
    backWidth:      { min: 12, max: 50,  label: 'Back width' },
  },
  'sofas-loveseats': {
    width:          { min: 40, max: 84, label: 'Sofa length' },
    length:         { min: 20, max: 50,  label: 'Front-to-back depth' },
    height:         { min: 28, max: 50,  label: 'Sofa height' },
    backrestDepth:  { min: 1,  max: 14,  label: 'Backrest thickness' },
    armrestHeight:  { min: 14, max: 34,  label: 'Ground-to-armrest height' },
  },
  'chaise-lounge': {
    width:              { min: 20, max: 50,  label: 'Chaise width' },
    length:             { min: 40, max: 100, label: 'Chaise length' },
    height:             { min: 6,  max: 28,  label: 'Floor-to-seat height' },
    cushionThickness:   { min: 0,  max: 8,   label: 'Cushion thickness' },
    armrestHeight:      { min: 14, max: 40,  label: 'Floor-to-armrest height' },
    armLength:          { min: 8,  max: 70,  label: 'Arm length' },
  },
  'ottomans': {
    width:  { min: 10, max: 72, label: 'Ottoman width' },
    length: { min: 10, max: 72, label: 'Ottoman length' },
    height: { min: 8,  max: 28, label: 'Ottoman height' },
  },
  'tables': {
    width:  { min: 18, max: 84,  label: 'Table width' },
    length: { min: 18, max: 130, label: 'Table length' },
    height: { min: 12, max: 36,  label: 'Table height' },
  },
  'table-sets': {
    width:  { min: 30, max: 108, label: 'Table set width' },
    length: { min: 30, max: 130, label: 'Table set length' },
    height: { min: 20, max: 38,  label: 'Table set height' },
  },
};

/** Return a warning message if the value is outside the soft range, or null if it looks fine. */
function getMeasurementWarning(productType: string, field: string, value: number): string | null {
  if (!value || value <= 0) return null; // Don't warn on empty/zero — the required-fields check handles that
  const ranges = validationRanges[productType];
  if (!ranges || !ranges[field]) return null;
  const { min, max, label } = ranges[field];
  if (value < min) return `${label} under ${min}″ — double-check this measurement`;
  if (value > max) return `${label} over ${max}″ — double-check this measurement`;
  return null;
}

// Hard maximums per furniture type/field. The input will not accept values
// above these caps. Used to enforce manufacturable size limits (e.g., sofa
// width is capped at 84" because anything wider exceeds our 3-bolt material
// budget).
const hardMaximums: Record<string, Record<string, number>> = {
  'sofas-loveseats': {
    width: 84,
  },
};

// Helper hints shown below specific field labels to clarify measurement technique
const fieldHints: Record<string, Record<string, string>> = {
  'chairs-recliners': {
    length: 'Drop an imaginary vertical line from the top-back corner of the backrest straight down to the ground. Measure along the ground from that point to the front edge of the chair. Don\'t measure along the seat surface.',
    backrestDepth: 'Just the thickness of the backrest itself at the top — measure the chair\'s back panel from front to back across the top edge, with cushions removed. Typically 4–8″. This is NOT the front-to-back depth of the seat.',
    backWidth: 'Measure the back panel only — this is often shorter than the overall width, which spans arm-to-arm.',
  },
  'sofas-loveseats': {
    width: 'Maximum width 84″. Contact us for a quote on additional or larger pieces. Note: the cover will have a seam down the center, or snaps along the center if the split cover with straps option is chosen.',
    length: 'Drop an imaginary vertical line from the top-back corner of the backrest straight down to the ground. Measure along the ground from that point to the front edge of the sofa. Don\'t measure along the seat surface.',
    backrestDepth: 'Just the thickness of the backrest itself at the top — measure the sofa\'s back panel from front to back across the top edge, with cushions removed. Typically 4–8″. This is NOT the front-to-back depth of the seat.',
    backWidth: 'Measure the back panel only — this is often shorter than the overall width, which spans arm-to-arm.',
  },
  'tables': {
    width: 'Short side. For a table set, measure to the outside edges of the chairs (pushed in). Wide covers are sewn from multiple fabric strips — that’s normal.',
    length: 'Long side. For a table set, measure to the outside edges of the chairs (pushed in).',
    height: 'To the top of the table — or the chairs/grill, whichever is taller.',
  },
  'chaise-lounge': {
    height: 'Measure from the floor to the top of the chaise frame — remove or ignore the cushion.',
    cushionThickness: 'If you use a cushion, enter its thickness here. The cover will be sized to fit over the cushion with 4″ floor clearance. Leave 0 if no cushion.',
  },
  'ottomans': {
    height: 'Measure from the floor to the top of the ottoman — include the cushion if present. Note: if your cushion exceeds 2″ in thickness and you use the cover without the cushion, the cover may drag on the ground.',
  },
};

const productConfigs = {
  'chairs-recliners': {
    fields: ['width', 'length', 'height', 'backrestDepth', 'armrestHeight', 'backWidth'],
    labels: {
      width: 'Width',
      length: 'Front-to-Back Depth',
      height: 'Height',
      backrestDepth: 'Backrest Thickness',
      armrestHeight: 'Ground to Top of Armrest',
      backWidth: 'Back Width'
    },
    hasAngle: true,
    measurementImage: '/images/Measurements/chair measurements.png',
    curvedBackImage: '/images/Measurements/curved-back-measuring.svg'
  },
  'sofas-loveseats': {
    fields: ['width', 'length', 'height', 'backrestDepth', 'armrestHeight', 'backWidth'],
    labels: {
      width: 'Length',
      length: 'Front-to-Back Depth',
      height: 'Height',
      backrestDepth: 'Backrest Thickness',
      armrestHeight: 'Ground to Top of Armrest',
      backWidth: 'Back Width'
    },
    hasAngle: true,
    measurementImage: '/images/Measurements/sofa_measurements_text.jpg',
    curvedBackImage: '/images/Measurements/curved-back-measuring.svg'
  },
  'chaise-lounge': {
    fields: ['width', 'length', 'height', 'cushionThickness'],
    labels: {
      width: 'Width',
      length: 'Length (head to foot)',
      height: 'Height (frame top to floor — do not include cushion)',
      cushionThickness: 'Cushion Thickness (optional — enter 0 if no cushion)'
    },
    hasAngle: false,
    measurementImage: '/images/Measurements/chaise measurements.jpg'
  },
  'ottomans': {
    fields: ['width', 'length', 'height'],
    labels: {
      width: 'Width',
      length: 'Length',
      height: 'Height (top of ottoman to floor — include cushion if present)'
    },
    hasAngle: false,
    measurementImage: '/images/Measurements/ottoman measurements.jpg'
  },
  'tables': {
    fields: ['width', 'length', 'height'],
    labels: {
      width: 'Width (short side)',
      length: 'Length (long side)',
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

const MeasurementCalculator: React.FC<MeasurementCalculatorProps> = ({ productType, onCalculate, initialMeasurements, coverType }) => {
  const [measurements, setMeasurements] = useState<any>(initialMeasurements || {
    length: 0,
    width: 0,
    height: 0,
    backrestDepth: 0,
    armrestHeight: 0,
    backWidth: 0,
    armLength: 0,
    cushionThickness: 0
  });
  const [showGuide, setShowGuide] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  // Tracks fields where the user attempted to enter a value above the hard cap.
  // Used to display a prominent error message so they know the value was clamped.
  const [capExceeded, setCapExceeded] = useState<Record<string, number | null>>({});
  // Drape depth for tables / sets / grills:
  //   'tabletop' = 10" drop (legs/chairs exposed)
  //   'seats'    = ~5" below the chair seats (needs floor-to-seat height)
  //   'full'     = ~3" above the floor (covers legs)
  const [tableDropMode, setTableDropMode] = useState<'tabletop' | 'seats' | 'full'>('tabletop');
  const [tableSeatHeight, setTableSeatHeight] = useState<number>(0);

  const config = productConfigs[productType as keyof typeof productConfigs] || productConfigs['sofas-loveseats'];

  // Only a table set has chair seats, so the "Over the seats" drape only applies
  // to a set. (coverType is passed on the tables page; when absent — e.g. the
  // table-sets product type — treat it as a set so the option still shows.)
  const showSeatsDrape = coverType !== 'table' && coverType !== 'grill';

  // If the seats drape no longer applies but was selected, fall back to tabletop.
  useEffect(() => {
    if (!showSeatsDrape && tableDropMode === 'seats') {
      setTableDropMode('tabletop');
    }
  }, [showSeatsDrape, tableDropMode]);

  // "Over the seats" needs the floor-to-seat measurement before we can calculate.
  const needsSeatHeight = (productType === 'tables' || productType === 'table-sets') && tableDropMode === 'seats';
  const seatHeightOk = !needsSeatHeight || tableSeatHeight > 0;

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

    // Chaise lounge — clean rectangle + chamfered corners, mirrors chaise_lounge_cover_calculator_MFG.html
    if (productType === 'chaise-lounge') {
      if (!width || !length || !height) return 0;
      const BOLT_WIDTH = CoverMath.CONST.BOLT_WIDTH;   // shared 55.25" bolt (single source)
      const CT = measurements.cushionThickness || 0;
      const FC_CUSHION = 4;    // floor clearance when cushion is on
      const FC_NO_CUSHION = 3; // floor clearance when no cushion
      const centerSeam = 1;    // seam allowance for split-and-sew joins

      // Cushion-aware side drop: size cover for frame+cushion with 4" clearance,
      // or frame-only with 3" clearance when no cushion.
      const effectiveHeight = CT > 0 ? height + CT : height;
      const effectiveFC = CT > 0 ? FC_CUSHION : FC_NO_CUSHION;
      const sideDrop = Math.max(0, effectiveHeight - effectiveFC);

      const ML = length + 2 * sideDrop;  // along bolt (head-to-foot)
      const MD = width + 2 * sideDrop;   // across bolt

      let totalBoltLength: number;
      if (MD <= BOLT_WIDTH) {
        // Width fits in bolt — single panel, no extensions needed
        totalBoltLength = ML;
      } else {
        // Width exceeds bolt — split-and-sew side extensions.
        // Each extension = 2 half-strips cut ACROSS the bolt width, sewn at center.
        // extCutW = raw overshoot per side + center seam allowance.
        // 4 half-strips total, all from the same bolt right after the main panel.
        const extCutW = (MD - BOLT_WIDTH) / 2 + centerSeam;
        const extBoltPull = 4 * extCutW;
        totalBoltLength = ML + extBoltPull;
      }
      return Math.ceil(totalBoltLength / 36);
    }

    // Chairs/recliners — delegated to the shared single-source module
    // (calculators/shared/cover-math.js), which ports the v2 standalone calculator
    // (split-back + split-flap + waste-nesting). Same math as the website and the
    // standalone calculator, so they can't drift.
    if (productType === 'chairs-recliners') {
      if (!width || !length || !height || !backrestDepth || !armrestHeight) return 0;
      return CoverMath.chairCover({
        width,
        depth: length,            // our internal "length" is the chair's front-to-back depth
        height,
        armrestHeight,
        backrestDepth,
        backWidth: (measurements.backWidth && measurements.backWidth > 0) ? measurements.backWidth : width,
      }).yards;
    }

    // Sofas/loveseats — delegated to the shared single-source module
    // (calculators/shared/cover-math.js), ported from the v4 standalone couch
    // calculator (two panels + center seam + side-extension scrap-nesting).
    if (productType === 'sofas-loveseats') {
      if (!width || !length || !height || !backrestDepth || !armrestHeight) return 0;
      return CoverMath.sofaCover({
        width,
        depth: length,            // our internal "length" is the front-to-back depth
        height,
        armrestHeight,
        backrestDepth,
        backWidth: (measurements.backWidth && measurements.backWidth > 0) ? measurements.backWidth : width,
      }).yards;
    }
    
    // Calculation for ottomans — matches ottoman_cover_calculator_MFG.html.
    // Cover is a rectangle (W+2*drop) × (L+2*drop) with diagonal corner cuts of
    // size `drop`. When the cover width (MD) exceeds the bolt, we use the
    // "main panel + two side strips" layout: a 54"-wide main panel along the
    // bolt length, plus two trapezoidal side strips that are shortened by the
    // chamfered corners. Strip max length = W + 2*stripWidth, where
    // stripWidth = (MD - 54)/2. Total bolt length needed = ML + (W + 2*stripWidth).
    // Ottomans — delegated to the shared single-source module. Always drops to
    // the floor; single panel or main panel + side strips.
    if (productType === 'ottomans') {
      if (!width || !length || !height) return 0;
      return CoverMath.ottomanCover({ length, width, height }).yards;
    }

    // Calculation for tables / table sets — delegated to the shared
    // single-source module (calculators/shared/cover-math.js) so the website
    // and table_cover_calculator_MFG.html always produce identical results.
    if (productType === 'tables' || productType === 'table-sets') {
      if (!width || !length || !height) return 0;
      return CoverMath.tableCover({
        length,
        width,
        height,
        dropMode: tableDropMode,        // 'tabletop' | 'seats' | 'full'
        seatHeight: tableSeatHeight,    // floor to bottom of seat (used by 'seats')
      }).yards;
    }
    
    return 0;
  };

  const calculatePrice = (yards: number): number => {
    const pricePerYard = 45;
    return yards * pricePerYard;
  };


  const handleCalculate = async () => {
    // backWidth, armLength, and cushionThickness are optional — exclude from required fields validation
    const requiredFields = config.fields.filter(field => field !== 'armLength' && field !== 'cushionThickness');
    const hasAllMeasurements = requiredFields.every(field => measurements[field] > 0);

    if (hasAllMeasurements && seatHeightOk) {
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

        // No matching variant — signal custom order to parent (empty variantId)
        const angle = config.hasAngle ? calculateAngle() : 0;
        onCalculate(displaySKU, '', price, yards, angle, measurements);
      }
    }
  };

  const handleMeasurementChange = (field: string, value: string) => {
    const rawValue = parseFloat(value) || 0;
    let numValue = rawValue;
    const cap = hardMaximums[productType]?.[field];
    if (cap != null && rawValue > cap) {
      numValue = cap;
      setCapExceeded(prev => ({ ...prev, [field]: rawValue }));
    } else {
      setCapExceeded(prev => {
        if (prev[field] == null) return prev;
        const next = { ...prev }; delete next[field]; return next;
      });
    }
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
      
      {/* Measurement diagrams are now shown in the left panel on the product page */}
      
      {/* Measurement service callout */}
      <div className="mb-3 p-3 bg-brand-teal/10 border-l-4 border-brand-teal rounded-md flex items-start gap-3">
        <span className="text-xl leading-none">📏</span>
        <div className="flex-1 text-sm">
          <p className="font-semibold text-brand-teal-dark">Not sure how to measure?</p>
          <p className="text-gray-700">
            We offer an in-home measurement service — {MEASUREMENT_PROMO_ACTIVE ? (
              <><span className="line-through text-gray-400">$75</span> <span className="font-semibold text-green-700">free during our current promotion</span> (Rumson, Fair Haven &amp; local area)</>
            ) : (
              <>$75, credited toward your cover purchase of $400+</>
            )}.{' '}
            <a href="/measurement-service" className="underline font-semibold text-brand-teal hover:text-brand-teal-dark">Learn more</a>
          </p>
        </div>
      </div>

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
        {config.fields.map((field) => {
          const warning = getMeasurementWarning(productType, field, measurements[field]);
          const hint = fieldHints[productType]?.[field];
          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {config.labels[field as keyof typeof config.labels]}
              </label>
              {hint && (
                <p className="text-xs text-gray-500 mb-1">{hint}</p>
              )}
              <input
                type="number"
                min="0"
                step="1"
                max={hardMaximums[productType]?.[field] ?? undefined}
                value={measurements[field] || ''}
                onChange={(e) => handleMeasurementChange(field, e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  warning
                    ? 'border-amber-400 focus:ring-amber-400'
                    : 'border-gray-300 focus:ring-brand-teal'
                }`}
                placeholder="0"
              />
              {warning && (
                <p className="text-xs text-amber-600 mt-1">⚠️ {warning}</p>
              )}
              {capExceeded[field] != null && (
                <div className="mt-2 p-2 bg-red-50 border border-red-300 rounded">
                  <p className="text-sm font-semibold text-red-700">
                    🚫 You entered {capExceeded[field]}″, which exceeds our maximum of {hardMaximums[productType]?.[field]}″ for this measurement.
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    The value has been reduced to {hardMaximums[productType]?.[field]}″. If your piece is actually larger,{' '}
                    <a href="/contact" className="underline font-semibold">contact us for a custom quote</a>{' '}
                    — do not place this order at the reduced size.
                  </p>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Angle is calculated internally but not shown to customers */}
      </div>

      {(productType === 'tables' || productType === 'table-sets') && (
        <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
          <p className="font-medium text-gray-800 mb-2">How far down should the cover hang?</p>
          <label className="flex items-start gap-2 mb-2 cursor-pointer">
            <input
              type="radio"
              name="tableDropMode"
              value="tabletop"
              checked={tableDropMode === 'tabletop'}
              onChange={() => setTableDropMode('tabletop')}
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              <strong>Tabletop only</strong> — 10″ side drop; table legs (and chairs) left exposed
            </span>
          </label>
          {showSeatsDrape && (
            <label className="flex items-start gap-2 mb-2 cursor-pointer">
              <input
                type="radio"
                name="tableDropMode"
                value="seats"
                checked={tableDropMode === 'seats'}
                onChange={() => setTableDropMode('seats')}
                className="mt-1"
              />
              <span className="text-sm text-gray-700">
                <strong>Over the seats</strong> — hangs about 5″ below the chair seats; covers the table and seats but not the legs
              </span>
            </label>
          )}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="tableDropMode"
              value="full"
              checked={tableDropMode === 'full'}
              onChange={() => setTableDropMode('full')}
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              <strong>Full coverage</strong> — hangs about 3″ above the floor; covers the legs too
            </span>
          </label>

          {tableDropMode === 'seats' && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor to bottom of chair seat (inches)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={tableSeatHeight || ''}
                onChange={(e) => setTableSeatHeight(parseFloat(e.target.value) || 0)}
                className={`w-full max-w-xs px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  needsSeatHeight && !seatHeightOk ? 'border-amber-400 focus:ring-amber-400' : 'border-gray-300 focus:ring-brand-teal'
                }`}
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Measure from the floor to the underside of the chair seat. The cover hangs ~5″ below this point.
              </p>
              {needsSeatHeight && !seatHeightOk && (
                <p className="text-xs text-amber-600 mt-1">⚠️ Enter the seat height to price an over-the-seats cover.</p>
              )}
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleCalculate}
        className={`w-full py-3 px-4 rounded-md font-medium transition-all ${
          config.fields.filter(field => field !== 'armLength' && field !== 'cushionThickness').every(field => measurements[field] > 0) && !hasCalculated
            ? 'bg-orange-600 hover:bg-orange-700 text-white animate-pulse'
            : 'bg-brand-teal hover:bg-brand-teal-dark text-white'
        }`}
        disabled={!config.fields.filter(field => field !== 'armLength' && field !== 'cushionThickness').every(field => measurements[field] > 0) || !seatHeightOk || Object.keys(capExceeded).length > 0}
      >
        {Object.keys(capExceeded).length > 0
          ? '🚫 Cannot order — measurement exceeds maximum'
          : (config.fields.filter(field => field !== 'armLength' && field !== 'cushionThickness').every(field => measurements[field] > 0) && !hasCalculated
            ? '⚠️ Click to Update Price & Size'
            : 'Calculate Cover Size & Price')}
      </button>

      {/* Cushion warning for chaise lounge — show after calculation */}
      {productType === 'chaise-lounge' && hasCalculated && (measurements.cushionThickness || 0) > 0 && (() => {
        const CT = measurements.cushionThickness;
        const H = measurements.height;
        const FC_CUSHION = 4;
        const sideDrop = Math.max(0, (H + CT) - FC_CUSHION);
        const noCushionClearance = H - sideDrop;
        return (
          <div className={`mt-3 p-3 rounded-md border ${noCushionClearance < 0 ? 'bg-amber-50 border-amber-300' : 'bg-green-50 border-green-200'}`}>
            <p className="text-sm font-semibold mb-1">
              {noCushionClearance < 0 ? '⚠️' : '✅'} Cushion Info
            </p>
            <p className="text-sm text-gray-700">
              Side drop: {sideDrop}″ (sized for frame + {CT}″ cushion, {FC_CUSHION}″ floor clearance with cushion on).
            </p>
            {noCushionClearance < 0 ? (
              <p className="text-sm text-amber-700 mt-1 font-medium">
                Without the cushion, the cover will drag on the floor by {Math.abs(noCushionClearance)}″. Use the bungee cord to cinch it up when the cushion is removed.
              </p>
            ) : noCushionClearance < 3 ? (
              <p className="text-sm text-amber-600 mt-1">
                Without the cushion, floor clearance is only {noCushionClearance}″ — the cover may touch the ground. We recommend using the bungee cord to keep it off the floor when the cushion is removed.
              </p>
            ) : (
              <p className="text-sm text-green-700 mt-1">
                Without the cushion, floor clearance is {noCushionClearance}″ — still good.
              </p>
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default MeasurementCalculator;

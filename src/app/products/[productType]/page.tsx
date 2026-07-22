'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MeasurementCalculator from '@/components/MeasurementCalculator';
import MeasurementCTA from '@/components/MeasurementCTA';
import AddOnOptions from '@/components/AddOnOptions';
import ColorSelector from '@/components/ColorSelector';
import ShopifyBuyButton from '@/components/ShopifyBuyButton';
import { useCartStore } from '@/store/cartStore';
import { getProductSchemaForType } from '@/lib/structured-data';

const measurementImages: Record<string, { main: string; curvedBack?: string; backrestThickness?: string }> = {
  'chairs-recliners': {
    main: '/images/Measurements/chair measurements.png',
    curvedBack: '/images/Measurements/curved-back-measuring.svg',
    backrestThickness: '/images/Measurements/backrest-thickness-measuring.svg'
  },
  'sofas-loveseats': {
    main: '/images/Measurements/sofa_measurements_text.jpg',
    curvedBack: '/images/Measurements/curved-back-measuring.svg',
    backrestThickness: '/images/Measurements/backrest-thickness-measuring.svg'
  },
  'chaise-lounge': { main: '/images/Measurements/chaise measurements.jpg' },
  'chaise-lounges': { main: '/images/Measurements/chaise measurements.jpg' },
  'ottomans': { main: '/images/Measurements/ottoman measurements.jpg' },
  'tables': { main: '/images/Measurements/table measurements.jpg' },
  'table-sets': { main: '/images/Measurements/tableset measurements.jpg' },
};

function MeasurementDiagrams({ productType }: { productType: string }) {
  const images = measurementImages[productType];
  if (!images) return null;
  return (
    <div>
      <div className="relative h-64 md:h-80 rounded overflow-hidden">
        <Image
          src={images.main}
          alt={`${productType} measurement guide`}
          fill
          className="object-contain"
        />
      </div>
      <p className="text-sm text-gray-500 mt-3">Measure at the widest points for each dimension</p>
      {images.backrestThickness && (
        <details className="mt-3 pt-3 border-t border-gray-200">
          <summary className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
            How to measure backrest thickness
          </summary>
          <div className="mt-3 flex justify-center">
            <img
              src={images.backrestThickness}
              alt="How to measure backrest thickness — side view showing top edge from front face to back face"
              className="max-h-56 md:max-h-72 w-auto"
            />
          </div>
        </details>
      )}
      {images.curvedBack && (
        <details className="mt-3 pt-3 border-t border-gray-200">
          <summary className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
            Have curved-back furniture? See how to measure
          </summary>
          <div className="mt-3 flex justify-center">
            <img
              src={images.curvedBack}
              alt="How to measure curved-back furniture — top view showing width and depth"
              className="max-h-48 md:max-h-64 w-auto"
            />
          </div>
        </details>
      )}
    </div>
  );
}

const productTypes = {
  'chairs-recliners': 'Chairs / Recliners',
  'sofas-loveseats': 'Sofas / Sectionals',
  'chaise-lounge': 'Chaise Lounge',
  'chaise-lounges': 'Chaise Lounge',  // Support both singular and plural URLs
  'ottomans': 'Ottomans',
  'tables': 'Tables & Grills',
  'table-sets': 'Table Sets'
};

export default function ProductPage() {
  const params = useParams();
  const productType = params.productType as string;
  const productName = productTypes[productType as keyof typeof productTypes] || 'Custom Covers';
  
  const [mounted, setMounted] = useState(false);
  const [coverSKU, setCoverSKU] = useState('');
  const [coverVariantId, setCoverVariantId] = useState('');
  const [coverPrice, setCoverPrice] = useState(0);
  const [yards, setYards] = useState(0);
  const [angle, setAngle] = useState(0);
  const [measurements, setMeasurements] = useState<any>({});
  
  const [snapStraps, setSnapStraps] = useState(false);
  const [handles, setHandles] = useState(false);
  const [magnets, setMagnets] = useState(false);
  
  const [selectedColor, setSelectedColor] = useState('');
  const [isPremiumColor, setIsPremiumColor] = useState(false);
  const [premiumColorCharge, setPremiumColorCharge] = useState(0);
  
  const [quantity, setQuantity] = useState(1);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [measurementConfirmed, setMeasurementConfirmed] = useState(false);
  const [isCustomOrder, setIsCustomOrder] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);
  // What's being covered (tables page only): a plain table, a table set with
  // chairs, or a grill island. Mutually exclusive — drives the measuring note
  // and whether the "Over the seats" drape applies.
  const [coverType, setCoverType] = useState<'table' | 'set' | 'grill'>('table');
  // Sofas page only: sectionals are custom-quoted, so we hide the self-serve
  // calculator/cart and route to contact instead.
  const [isSofaSectional, setIsSofaSectional] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const updateItem = useCartStore((state) => state.updateItem);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  
  // Inject product structured data for SEO
  useEffect(() => {
    const schema = getProductSchemaForType(productType);
    if (schema) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      script.id = 'product-schema';
      // Remove any existing one first
      const existing = document.getElementById('product-schema');
      if (existing) existing.remove();
      document.head.appendChild(script);
      return () => { script.remove(); };
    }
  }, [productType]);

  // Fire Meta Pixel ViewContent event for ad-campaign optimization.
  // Meta uses this signal to find more users likely to view product content,
  // which is what we're optimizing toward in the Sales campaign ad set.
  // The pixel loads with strategy="afterInteractive" in layout.tsx, which
  // can race with React hydration — fbq may not be defined when this effect
  // first runs. We retry briefly until it's available, then give up.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fire = () => {
      const w = window as any;
      if (!w.fbq) return false;
      w.fbq('track', 'ViewContent', {
        content_name: productName,
        content_category: productType,
        content_type: 'product',
      });
      return true;
    };

    if (fire()) return;

    const interval = setInterval(() => {
      if (fire()) clearInterval(interval);
    }, 250);
    const timeout = setTimeout(() => clearInterval(interval), 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [productType, productName]);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    // Store the current product type in sessionStorage for back navigation
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lastProductType', productType);

      // Check if we're editing an item
      const editData = sessionStorage.getItem('editCartItem');
      if (editData) {
        const item = JSON.parse(editData);
        if (item.productType === productType) {
          // Load all the saved data
          setCoverSKU(item.coverSKU);
          setCoverVariantId(item.coverVariantId);
          setCoverPrice(item.coverPrice);
          setYards(item.yards);
          setAngle(item.angle);
          setMeasurements(item.measurements || {});
          setSnapStraps(item.snapStraps);
          setHandles(item.handles);
          setMagnets(item.magnets);
          setSelectedColor(item.selectedColor);
          setIsPremiumColor(item.isPremiumColor);
          setPremiumColorCharge(item.premiumColorCharge);
          setQuantity(item.quantity);
          setEditingItemId(item.id);
          
          // Clear the edit data
          sessionStorage.removeItem('editCartItem');
        }
      }
    }
  }, [productType]);

  useEffect(() => {
    if (isPremiumColor && yards > 0) {
      setPremiumColorCharge(yards * quantity * 4);
    } else {
      setPremiumColorCharge(0);
    }
  }, [isPremiumColor, yards, quantity]);

  const calculateTotal = () => {
    let total = coverPrice * quantity;
    if (snapStraps) total += 20 * quantity;
    if (handles) total += 20 * quantity;
    if (magnets) total += 35 * quantity;
    if (premiumColorCharge > 0) total += premiumColorCharge;
    return total;
  };

  const handleAddToCart = () => {
    const cartItem = {
      productType,
      coverSKU,
      coverVariantId,
      coverPrice,
      yards,
      angle,
      measurements,
      snapStraps,
      handles,
      magnets,
      selectedColor,
      isPremiumColor,
      premiumColorCharge,
      quantity,
      total: calculateTotal()
    };
    
    if (editingItemId) {
      // Update existing item
      updateItem(editingItemId, cartItem);
      // Go back to cart after updating
      window.location.href = '/cart';
    } else {
      // Add new item — show inline toast instead of a blocking confirm dialog.
      addToCart(cartItem);
      setShowAddedToast(true);
      // Auto-dismiss after 8 seconds in case the customer ignores it.
      window.setTimeout(() => setShowAddedToast(false), 8000);
    }

    // Reset editing state
    setEditingItemId(null);
  };

  const handleRequestQuote = () => {
    // Add the item to cart as a custom/quote item so the manual checkout
    // form picks it up with all measurements pre-filled.
    const cartItem = {
      productType,
      coverSKU,
      coverVariantId: '', // no Shopify variant
      coverPrice,
      yards,
      angle,
      measurements,
      snapStraps,
      handles,
      magnets,
      selectedColor,
      isPremiumColor,
      premiumColorCharge,
      quantity,
      total: calculateTotal(),
      isCustomOrder: true, // flag for the cart page
    };
    addToCart(cartItem);
    window.location.href = '/cart';
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      {/* Inline "Added to cart" toast — replaces the old window.confirm dialog.
          Floats top-right, stays until the user acts or auto-dismisses after 8s. */}
      {showAddedToast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm w-[calc(100%-2rem)] sm:w-auto">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">Added to cart</p>
              <p className="text-sm text-gray-600 mt-0.5">Your custom cover is in your cart.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => { window.location.href = '/cart'; }}
                  className="px-4 py-2 bg-brand-teal text-white text-sm rounded-md font-semibold hover:bg-brand-teal-dark"
                >
                  View Cart
                </button>
                <button
                  onClick={() => setShowAddedToast(false)}
                  className="px-4 py-2 text-gray-700 text-sm rounded-md font-medium hover:bg-gray-100"
                >
                  Keep Shopping
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowAddedToast(false)}
              aria-label="Dismiss"
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 -mt-1 -mr-1 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => {
            // Try to go back, or go to design page if no history
            if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = '/design';
            }
          }}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Design</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{productName}</h1>

        {/* Premium Features Banner - Prominent CTA */}
        <div className="mb-8 bg-gradient-to-r from-brand-teal to-teal-600 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Why Choose Castaway Covers?
                </h2>
                <p className="text-white/90 text-sm sm:text-base">
                  Discover our premium features: marine-grade snaps, weather-rated grommets, durable bungee systems, and more.
                </p>
              </div>
              <a
                href="/features"
                className="flex-shrink-0 inline-flex items-center bg-white text-brand-teal px-6 py-3 rounded-lg font-semibold text-base hover:bg-gray-100 transition-all shadow-md hover:shadow-lg group"
              >
                View Craftsmanship Details
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Product Gallery with new layout */}
        <MainProductImage
          productType={productType}
          selectedIndex={selectedImageIndex}
          onImageSelect={setSelectedImageIndex}
          selectedColor={selectedColor}
        />
        <ProductGallery
          productType={productType}
          selectedIndex={selectedImageIndex}
          onImageSelect={setSelectedImageIndex}
          selectedColor={selectedColor}
        />

        {/* Chaise flat-position note */}
        {(productType === 'chaise-lounge' || productType === 'chaise-lounges') && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-5 py-3 text-sm text-amber-800">
            <strong>Note:</strong> Chaise lounge covers are designed to be used with the chaise in the fully flat (reclined) position.
          </div>
        )}

        {/* What are you covering? (mutually exclusive) + measuring note */}
        {productType === 'tables' && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-800 mb-2">What are you covering?</p>
            <div className="flex flex-wrap gap-2">
              {([
                { value: 'table', label: 'Table' },
                { value: 'set', label: 'Table set (with chairs)' },
                { value: 'grill', label: 'Grill island' },
              ] as const).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 cursor-pointer select-none rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    coverType === opt.value
                      ? 'border-brand-teal bg-brand-teal/5 text-gray-900'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="coverType"
                    value={opt.value}
                    checked={coverType === opt.value}
                    onChange={() => setCoverType(opt.value)}
                    className="h-4 w-4 text-brand-teal border-gray-300 focus:ring-brand-teal"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-5 py-3 text-sm text-amber-800">
              {coverType === 'table' && (
                <><strong>Measuring a table:</strong> Measure the width and length to the table edges, and the height from the floor to the tabletop.</>
              )}
              {coverType === 'set' && (
                <><strong>Measuring a table set:</strong> Take your measurements with the chairs pushed in under the table. Measure the width and length to the <strong>outside edges of the chairs</strong> (not just the table), and for height use the <strong>chairs or the table — whichever is taller</strong>.</>
              )}
              {coverType === 'grill' && (
                <><strong>Measuring a grill island:</strong> Measure the width and length to the outer edges, and for height <strong>measure to the top of the grill</strong> (or its raised lid) so the cover clears it.</>
              )}
            </div>
          </div>
        )}

        {/* Sofa vs sectional picker — sectionals are custom-quoted */}
        {productType === 'sofas-loveseats' && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-800 mb-2">What are you covering?</p>
            <div className="flex flex-wrap gap-2">
              {([
                { value: false, label: 'Sofa or loveseat' },
                { value: true, label: 'Sectional' },
              ] as const).map((opt) => (
                <label
                  key={String(opt.value)}
                  className={`flex items-center gap-2 cursor-pointer select-none rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    isSofaSectional === opt.value
                      ? 'border-brand-teal bg-brand-teal/5 text-gray-900'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="sofaType"
                    checked={isSofaSectional === opt.value}
                    onChange={() => setIsSofaSectional(opt.value)}
                    className="h-4 w-4 text-brand-teal border-gray-300 focus:ring-brand-teal"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* In-Home Measurement Service CTA — right where measuring begins */}
        <MeasurementCTA className="mt-8" />

        {isSofaSectional ? (
          /* Sectional: no self-serve calculator — route to a custom quote. */
          <div className="mt-8 bg-amber-50 border-2 border-amber-300 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Sectionals are made to order</h3>
            <p className="text-gray-700 max-w-xl mx-auto mb-5">
              Every sectional is different, so we quote them personally to make sure the cover fits
              perfectly. Reach out and we&apos;ll take it from there — and if you&apos;d like, we can
              measure it for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-brand-teal text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-teal-dark transition-colors"
              >
                Contact us for a sectional quote
              </Link>
              <Link
                href="/measurement-service"
                className="inline-block border-2 border-brand-teal text-brand-teal font-semibold px-6 py-3 rounded-lg hover:bg-brand-teal/5 transition-colors"
              >
                See our measurement service
              </Link>
            </div>
          </div>
        ) : (
        <>
        {/* Measurement Diagrams and Calculator Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left: Measurement Diagrams */}
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4 self-start">
            <h3 className="text-lg font-semibold mb-4">Measurement Guide</h3>
            <MeasurementDiagrams productType={productType} />
          </div>

          {/* Right: Measurements */}
          <div>
            <MeasurementCalculator
              productType={productType}
              coverType={coverType}
              onCalculate={(sku, variantId, price, yardsNeeded, calculatedAngle, allMeasurements) => {
                setCoverSKU(sku);
                setCoverVariantId(variantId);
                setCoverPrice(price);
                setYards(yardsNeeded);
                setAngle(calculatedAngle);
                setMeasurements(allMeasurements);
                setMeasurementConfirmed(false); // Reset confirmation when measurements change
                setIsCustomOrder(!variantId); // No variant = custom order
              }}
              initialMeasurements={measurements}
            />
          </div>
        </div>

        {/* Photo upload heads-up — appears between measurements and add-ons */}
        <div className="mt-6 bg-brand-teal/5 border border-brand-teal/30 rounded-lg px-5 py-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="text-sm text-gray-700">
            <p className="font-semibold text-brand-teal-dark mb-1">Not sure about a measurement?</p>
            <p>You&apos;ll be able to upload photos of your furniture at checkout — we personally review every order and will reach out if anything looks off before charging you.</p>
          </div>
        </div>

        {/* Options and Add to Cart Below */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <AddOnOptions
              productType={productType}
              onSnapStrapsChange={setSnapStraps}
              onHandlesChange={setHandles}
              onMagnetsChange={setMagnets}
              initialSnapStraps={snapStraps}
              initialHandles={handles}
              initialMagnets={magnets}
            />
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <span className="text-xl">−</span>
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setQuantity(1);
                    } else {
                      const num = parseInt(value);
                      if (!isNaN(num) && num > 0) {
                        setQuantity(num);
                      }
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <span className="text-xl">+</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Color Selector with Preview Image */}
        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Color Selector */}
            <div>
              <ColorSelector
                onColorSelect={(color, isPremium) => {
                  setSelectedColor(color);
                  setIsPremiumColor(isPremium);
                }}
              />
            </div>
            
            {/* Right: Standard Features List */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Your Custom {productTypes[productType as keyof typeof productTypes]} Cover Includes:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-brand-teal mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Heavy-duty marine vinyl that is UV protected, fire retardant and mildew resistant</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-brand-teal mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Reinforced grommets</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-brand-teal mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Durable bungee cords with hooks and locking clips to secure covers</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-brand-teal mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Snap closures at corners for a tailored, secure fit</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-brand-teal mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Custom-fit design</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-brand-teal mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Seamless wavy edge design</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Order Summary - Bottom */}
        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Cover {coverSKU ? `(${coverSKU})` : ''} x{quantity}</span>
                <span>{coverPrice > 0 ? `$${(coverPrice * quantity).toFixed(2)}` : '—'}</span>
              </div>
              
              {snapStraps && (
                <div className="flex justify-between">
                  <span>Snap Straps ({quantity}x)</span>
                  <span>${(20 * quantity).toFixed(2)}</span>
                </div>
              )}
              
              {handles && (
                <div className="flex justify-between">
                  <span>Handles ({quantity}x)</span>
                  <span>${(20 * quantity).toFixed(2)}</span>
                </div>
              )}
              
              {magnets && (productType === 'sofas-loveseats' || productType === 'table-sets') && (
                <div className="flex justify-between">
                  <span>Split Cover with Snaps ({quantity}x)</span>
                  <span>${(35 * quantity).toFixed(2)}</span>
                </div>
              )}
              
              {premiumColorCharge > 0 && (
                <div className="flex justify-between">
                  <span>Premium Color: {selectedColor}</span>
                  <span>${premiumColorCharge.toFixed(2)}</span>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Measurement confirmation checkbox */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={measurementConfirmed}
                  onChange={(e) => setMeasurementConfirmed(e.target.checked)}
                  className="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I confirm my measurements are accurate and understand custom covers cannot be returned for sizing errors
                </span>
              </label>
            </div>
            
            <ShopifyBuyButton
              variantId={coverVariantId}
              quantity={quantity}
              customAttributes={{
                productType,
                sku: coverSKU,
                yards: yards.toString(),
                angle: angle.toFixed(2),
                width: measurements.width?.toString() || '0',
                length: measurements.length?.toString() || '0',
                height: measurements.height?.toString() || '0',
                backrestDepth: measurements.backrestDepth?.toString() || '0',
                armrestHeight: measurements.armrestHeight?.toString() || '0',
                backWidth: measurements.backWidth?.toString() || '0',
                snapStraps: snapStraps.toString(),
                handles: handles.toString(),
                magneticClosure: magnets.toString(),
                color: selectedColor,
                premiumColorCharge: premiumColorCharge.toString()
              }}
              onAddToCart={handleAddToCart}
              disabled={!isCustomOrder && (!coverVariantId || !selectedColor || !measurementConfirmed)}
              isCustomOrder={isCustomOrder && !!coverSKU && !!selectedColor && measurementConfirmed}
              onRequestQuote={handleRequestQuote}
            />
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}

// Product gallery component with 4-5 images at the top
// Map color names to file names
const colorToFileName: { [key: string]: string } = {
  'Classic Blue': 'classic blue',
  'Cream': 'cream',
  'Diamond Pacific Blue': 'diamond blue',  // Note: Color selector uses "Diamond Pacific Blue"
  'Diamond Red': 'diamond red',
  'Green': 'green',
  'Grey': 'grey',
  'Lemon': 'lemon',
  'Light Brown': 'light brown',
  'Mist Grey': 'mist grey',
  'Navy': 'navy',
  'Pacific Blue': 'pacific blue',
  'Sand Dune': 'sand dune',
  'Wine': 'wine'
};

// Get gallery images for a product type
const getGalleryImages = (productType: string, selectedColor?: string) => {
  const galleryImages = {
    'chairs-recliners': [
      { src: '/images/Chairs-Recliners/chair1.jpg', alt: 'Chair Cover - Front View' },
      { src: '/images/Chairs-Recliners/chair3.jpg', alt: 'Chair Cover - Side View' },
      { src: '/images/Chairs-Recliners/chair7.jpg', alt: 'Chair Cover - Outdoor View' },
      { src: '/images/Chairs-Recliners/chair7.5.jpg', alt: 'Patio chairs before Castaway Covers', badge: 'Before' },
      { src: '/images/Chairs-Recliners/chair7.6.jpg', alt: 'Same patio chairs protected with Castaway Covers', badge: 'After' },
      { src: '/images/Chairs-Recliners/chair8.jpg', alt: 'Chair Cover - Built-In Bungee Storage' },
      { src: '/images/Chairs-Recliners/chair8.5.jpg', alt: 'Wicker chair before Castaway Cover', badge: 'Before' },
      { src: '/images/Chairs-Recliners/chair8.6.jpg', alt: 'Same wicker chair protected with Castaway Cover', badge: 'After' }
    ],
    'sofas-loveseats': [
      { src: '/images/Sofas-Loveseats/sofa8.jpg', alt: 'Outdoor sectional before a Castaway Cover', badge: 'Before' },
      { src: '/images/Sofas-Loveseats/sofa9.jpg', alt: 'Same sectional protected with a Castaway Cover', badge: 'After' },
      { src: '/images/Sofas-Loveseats/sofa10.jpg', alt: 'Sectional Castaway Cover on a waterfront deck', badge: 'After' },
      { src: '/images/Sofas-Loveseats/sofa4.jpg', alt: 'Wicker sofa before a Castaway Cover', badge: 'Before' },
      { src: '/images/Sofas-Loveseats/sofa1.jpg', alt: 'Same wicker sofa protected with a Castaway Cover', badge: 'After' },
      { src: '/images/Sofas-Loveseats/sofa6.jpg', alt: 'Loveseat Cover in Blue - Outdoor View' },
      { src: '/images/Sofas-Loveseats/sofa7.jpg', alt: 'Sofa Cover - Built-In Bungee Storage' }
    ],
    'chaise-lounge': [
      { src: '/images/ChaiseLounges/chaise1.jpg', alt: 'Chaise Lounge Cover in Blue - Flat Position' },
      { src: '/images/ChaiseLounges/chaise2.jpg', alt: 'Chaise Lounge Cover in Cream - Flat Position' }
    ],
    'chaise-lounges': [
      { src: '/images/ChaiseLounges/chaise1.jpg', alt: 'Chaise Lounge Cover in Blue - Flat Position' },
      { src: '/images/ChaiseLounges/chaise2.jpg', alt: 'Chaise Lounge Cover in Cream - Flat Position' }
    ],
    'ottomans': [
      { src: '/images/Ottomans/ottoman1.jpg', alt: 'Ottoman Cover' },
      { src: '/images/Ottomans/ottoman4.jpg', alt: 'Ottoman Cover - Gray Outdoor View' }
    ],
    'tables': [
      // Lakefront teak table set — before, then covered in summer & winter
      { src: '/images/Tablesets/tableset5.jpg', alt: 'Teak table set before a Castaway Cover', badge: 'Before' },
      { src: '/images/Tables/tableset-lakefront.jpg', alt: 'Same table set protected with a Castaway Cover - Summer', badge: 'After' },
      { src: '/images/Tablesets/tableset6.jpg', alt: 'Same table set protected with a Castaway Cover - Winter', badge: 'After' },
      // Bayfront grill island
      { src: '/images/Tables/grill-before.jpg', alt: 'Stone grill island before a Castaway Cover', badge: 'Before' },
      { src: '/images/Tables/grill-island.jpg', alt: 'Same grill island protected with Castaway Cover - Waterfront Deck', badge: 'After' },
      { src: '/images/Tables/river-view.jpg', alt: 'Table Set Cover - River View', badge: 'After' },
      // Individual tables
      { src: '/images/Tables/table1.jpg', alt: 'Wine Table with Castaway Cover' },
      { src: '/images/Tables/table4.jpg', alt: 'Table Cover - Scalloped Edge on Patio' }
    ],
    'table-sets': [
      { src: '/images/Tablesets/tableset6.jpg', alt: 'Table Set Cover - Winter Snow Protection' },
      { src: '/images/Tablesets/tableset2.jpg', alt: 'Table Set Cover - Bungee System' },
      { src: '/images/Tablesets/tableset4.jpg', alt: 'Table Set - Complete View' },
      { src: '/images/Tablesets/tableset5.jpg', alt: 'Table Set - Additional View' }
    ]
  };
  
  const images = galleryImages[productType as keyof typeof galleryImages] || galleryImages['chairs-recliners'];

  return images;
};

// Main Product Image Component
const MainProductImage = ({ productType, selectedIndex, onImageSelect, selectedColor }: { productType: string; selectedIndex: number; onImageSelect?: (index: number) => void; selectedColor?: string }) => {
  const images = getGalleryImages(productType, selectedColor);
  const total = images.length;
  const selectedImage = images[selectedIndex] || images[0];

  const badge = (selectedImage as { badge?: string }).badge;

  const goTo = (index: number) => {
    if (!onImageSelect || total === 0) return;
    onImageSelect((index + total) % total);
  };

  // Mobile swipe support
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(selectedIndex + (dx < 0 ? 1 : -1));
    setTouchStartX(null);
  };

  return (
    <div
      className="relative h-[300px] md:h-[400px] lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {badge && (
        <span
          className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-md ${
            badge === 'After' ? 'bg-brand-teal text-white' : 'bg-gray-900/75 text-white'
          }`}
        >
          {badge}
        </span>
      )}
      <Image
        src={selectedImage.src}
        alt={selectedImage.alt}
        fill
        className="object-contain p-2 md:p-4"
        sizes="(max-width: 768px) 100vw, 80vw"
        priority
      />

      {total > 1 && onImageSelect && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => goTo(selectedIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => goTo(selectedIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-gray-900/70 text-white text-xs font-medium">
            {selectedIndex + 1} / {total}
          </span>
        </>
      )}
    </div>
  );
};

// Horizontal Scroll Gallery Component
const ProductGallery = ({ 
  productType, 
  selectedIndex, 
  onImageSelect,
  selectedColor 
}: { 
  productType: string; 
  selectedIndex: number;
  onImageSelect: (index: number) => void;
  selectedColor?: string;
}) => {
  const images = getGalleryImages(productType, selectedColor);

  return (
    <div className="mb-6">
      {/* Horizontal Scrolling Gallery */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`relative flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index 
                  ? 'border-brand-teal shadow-lg' 
                  : 'border-gray-200 hover:border-brand-teal'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
              {(image as { badge?: string }).badge && (
                <span
                  className={`absolute bottom-1 left-1 z-10 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    (image as { badge?: string }).badge === 'After'
                      ? 'bg-brand-teal text-white'
                      : 'bg-gray-900/75 text-white'
                  }`}
                >
                  {(image as { badge?: string }).badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

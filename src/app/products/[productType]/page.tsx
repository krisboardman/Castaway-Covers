'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MeasurementCalculator from '@/components/MeasurementCalculator';
import AddOnOptions from '@/components/AddOnOptions';
import ColorSelector from '@/components/ColorSelector';
import ShopifyBuyButton from '@/components/ShopifyBuyButton';
import { useCartStore } from '@/store/cartStore';

const productTypes = {
  sofa: 'Sofa Covers',
  chair: 'Chair Covers', 
  table: 'Table Covers',
  ottoman: 'Ottoman Covers',
  loveseat: 'Loveseat Covers',
  sectional: 'Sectional Covers'
};

export default function ProductPage() {
  const params = useParams();
  const productType = params.productType as string;
  const productName = productTypes[productType as keyof typeof productTypes] || 'Custom Covers';
  
  const [coverSKU, setCoverSKU] = useState('');
  const [coverVariantId, setCoverVariantId] = useState('');
  const [coverPrice, setCoverPrice] = useState(0);
  const [yards, setYards] = useState(0);
  
  const [snapStraps, setSnapStraps] = useState(false);
  const [handles, setHandles] = useState(false);
  const [magnets, setMagnets] = useState(false);
  
  const [selectedColor, setSelectedColor] = useState('');
  const [isPremiumColor, setIsPremiumColor] = useState(false);
  const [premiumColorCharge, setPremiumColorCharge] = useState(0);
  
  const [quantity, setQuantity] = useState(1);
  
  const addToCart = useCartStore((state) => state.addToCart);

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
    if (magnets) total += 20 * quantity;
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
      snapStraps,
      handles,
      magnets,
      selectedColor,
      isPremiumColor,
      premiumColorCharge,
      quantity,
      total: calculateTotal()
    };
    
    addToCart(cartItem);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{productName}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <MeasurementCalculator
              productType={productType}
              onCalculate={(sku, variantId, price, yardsNeeded) => {
                setCoverSKU(sku);
                setCoverVariantId(variantId);
                setCoverPrice(price);
                setYards(yardsNeeded);
              }}
            />
            
            <AddOnOptions
              productType={productType}
              onSnapStrapsChange={setSnapStraps}
              onHandlesChange={setHandles}
              onMagnetsChange={setMagnets}
            />
            
            <ColorSelector
              onColorSelect={(color, isPremium) => {
                setSelectedColor(color);
                setIsPremiumColor(isPremium);
              }}
            />
            
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Cover ({coverSKU}) x{quantity}</span>
                <span>${(coverPrice * quantity).toFixed(2)}</span>
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
              
              {magnets && productType === 'sofa' && (
                <div className="flex justify-between">
                  <span>Magnets ({quantity}x)</span>
                  <span>${(20 * quantity).toFixed(2)}</span>
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
            
            <ShopifyBuyButton
              variantId={coverVariantId}
              quantity={quantity}
              customAttributes={{
                productType,
                sku: coverSKU,
                yards: yards.toString(),
                snapStraps: snapStraps.toString(),
                handles: handles.toString(),
                magnets: magnets.toString(),
                color: selectedColor,
                premiumColorCharge: premiumColorCharge.toString()
              }}
              onAddToCart={handleAddToCart}
              disabled={!coverVariantId || !selectedColor}
            />
            
            {/* Product Showcase Images */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">See It In Action</h3>
              <ProductShowcase productType={productType} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product showcase component for furniture-specific images
const ProductShowcase = ({ productType }: { productType: string }) => {
  const showcaseImages = {
    sofa: [
      { src: '/images/sofa-covered.jpg', alt: 'Sofa with Castaway Cover' },
      { src: '/images/sofa-before-after.jpg', alt: 'Before and After Protection' },
      { src: '/images/sofa-features.jpg', alt: 'Cover Features Detail' }
    ],
    chair: [
      { src: '/images/chair-covered.jpg', alt: 'Chair with Castaway Cover' },
      { src: '/images/chair-features.jpg', alt: 'Chair Cover Features' },
      { src: '/images/chair-installation.jpg', alt: 'Easy Installation' }
    ],
    table: [
      { src: '/images/table-covered.jpg', alt: 'Table with Castaway Cover' },
      { src: '/images/table-weatherproof.jpg', alt: 'Weather Protection' },
      { src: '/images/table-features.jpg', alt: 'Table Cover Features' }
    ],
    ottoman: [
      { src: '/images/ottoman-covered.jpg', alt: 'Ottoman with Castaway Cover' },
      { src: '/images/ottoman-compact.jpg', alt: 'Compact Storage' },
      { src: '/images/ottoman-features.jpg', alt: 'Ottoman Cover Features' }
    ],
    loveseat: [
      { src: '/images/loveseat-covered.jpg', alt: 'Loveseat with Castaway Cover' },
      { src: '/images/loveseat-protection.jpg', alt: 'Complete Protection' },
      { src: '/images/loveseat-features.jpg', alt: 'Loveseat Cover Features' }
    ],
    sectional: [
      { src: '/images/sectional-covered.jpg', alt: 'Sectional with Castaway Cover' },
      { src: '/images/sectional-modular.jpg', alt: 'Modular Coverage System' },
      { src: '/images/sectional-features.jpg', alt: 'Sectional Cover Features' }
    ]
  };

  const images = showcaseImages[productType as keyof typeof showcaseImages] || showcaseImages.sofa;

  return (
    <div className="grid grid-cols-1 gap-4">
      {images.map((image, index) => (
        <div key={index} className="rounded-lg overflow-hidden">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <span className="text-gray-500 text-sm">{image.alt}</span>
              <p className="text-xs text-gray-400 mt-1">Image: {image.src}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
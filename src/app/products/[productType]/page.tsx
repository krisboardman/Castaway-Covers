'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import MeasurementCalculator from '@/components/MeasurementCalculator';
import AddOnOptions from '@/components/AddOnOptions';
import ColorSelector from '@/components/ColorSelector';
import ShopifyBuyButton from '@/components/ShopifyBuyButton';
import { useCartStore } from '@/store/cartStore';

const productTypes = {
  'chairs-recliners': 'Chairs / Recliners',
  'sofas-loveseats': 'Sofas / Loveseats',
  'chaise-lounge': 'Chaise Lounge',
  'chaise-lounges': 'Chaise Lounge',  // Support both singular and plural URLs
  'ottomans': 'Ottomans',
  'tables': 'Tables',
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
  
  const addToCart = useCartStore((state) => state.addToCart);
  const updateItem = useCartStore((state) => state.updateItem);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  
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
      console.log('Item updated in cart:', cartItem);
      // Go back to cart after updating
      window.location.href = '/cart';
    } else {
      // Add new item
      addToCart(cartItem);
      console.log('Item added to cart:', cartItem);
      console.log('Cart after adding:', useCartStore.getState().items);
      
      // Show success message with options
      const goToCart = window.confirm('Item added to cart! Click OK to view cart or Cancel to continue shopping.');
      if (goToCart) {
        window.location.href = '/cart';
      }
    }
    
    // Reset editing state
    setEditingItemId(null);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{productName}</h1>
        
        {/* Product Gallery with new layout */}
        <ProductGallery 
          productType={productType} 
          selectedIndex={selectedImageIndex}
          onImageSelect={setSelectedImageIndex}
        />
        
        {/* Main Image and Measurements Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left: Main Product Image */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <MainProductImage 
              productType={productType} 
              selectedIndex={selectedImageIndex}
            />
          </div>
          
          {/* Right: Measurements */}
          <div>
            <MeasurementCalculator
              productType={productType}
              onCalculate={(sku, variantId, price, yardsNeeded, calculatedAngle, allMeasurements) => {
                setCoverSKU(sku);
                setCoverVariantId(variantId);
                setCoverPrice(price);
                setYards(yardsNeeded);
                setAngle(calculatedAngle);
                setMeasurements(allMeasurements);
              }}
              initialMeasurements={measurements}
            />
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
        
        {/* Color Selector - Full Width */}
        <div className="mt-8">
          <ColorSelector
            onColorSelect={(color, isPremium) => {
              setSelectedColor(color);
              setIsPremiumColor(isPremium);
            }}
          />
        </div>
        
        {/* Order Summary - Bottom */}
        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
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
              
              {magnets && productType === 'sofas-loveseats' && (
                <div className="flex justify-between">
                  <span>Magnetic Closure ({quantity}x)</span>
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
                angle: angle.toFixed(2),
                width: measurements.width?.toString() || '0',
                length: measurements.length?.toString() || '0',
                height: measurements.height?.toString() || '0',
                backrestDepth: measurements.backrestDepth?.toString() || '0',
                armrestHeight: measurements.armrestHeight?.toString() || '0',
                snapStraps: snapStraps.toString(),
                handles: handles.toString(),
                magneticClosure: magnets.toString(),
                color: selectedColor,
                premiumColorCharge: premiumColorCharge.toString()
              }}
              onAddToCart={handleAddToCart}
              disabled={!coverVariantId || !selectedColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Product gallery component with 4-5 images at the top
// Get gallery images for a product type
const getGalleryImages = (productType: string) => {
  const galleryImages = {
    'chairs-recliners': [
      { src: '/images/Chairs-Recliners/chair front.jpg', alt: 'Chair with Castaway Cover - Front View' },
      { src: '/images/Chairs-Recliners/chair back.png', alt: 'Chair Cover - Back View' },
      { src: '/images/Chairs-Recliners/chair side bungee.JPEG', alt: 'Chair Cover - Bungee System' },
      { src: '/images/Chairs-Recliners/chair4.png', alt: 'Chair Cover - Additional View' },
      { src: '/images/homepage/side-bungee.jpeg', alt: 'Bungee Detail' }
    ],
    'sofas-loveseats': [
      { src: '/images/Sofas-Loveseats/couch covered.png', alt: 'Sofa with Castaway Cover' },
      { src: '/images/Sofas-Loveseats/couch bungee handle.png', alt: 'Sofa Cover - Bungee & Handle Detail' },
      { src: '/images/Sofas-Loveseats/couch magnetic closure.PNG', alt: 'Sofa Cover - Magnetic Closure' },
      { src: '/images/Sofas-Loveseats/Sofa-New-1.jpg', alt: 'Sofa Cover - Style View' },
      { src: '/images/homepage/actual-with-gusset.jpeg', alt: 'Corner Gusset Detail' }
    ],
    'chaise-lounge': [
      { src: '/images/ChaiseLounges/chaise front side.png', alt: 'Chaise Lounge Cover - Front Side View' },
      { src: '/images/ChaiseLounges/chaise handle.png', alt: 'Chaise Cover - Handle Detail' },
      { src: '/images/ChaiseLounges/chaise bungee.png', alt: 'Chaise Cover - Bungee System' },
      { src: '/images/ChaiseLounges/CC-chaise.png', alt: 'Chaise Cover - Style View' },
      { src: '/images/homepage/snap-strap.jpeg', alt: 'Snap Strap Detail' }
    ],
    'chaise-lounges': [
      { src: '/images/ChaiseLounges/chaise front side.png', alt: 'Chaise Lounge Cover - Front Side View' },
      { src: '/images/ChaiseLounges/chaise handle.png', alt: 'Chaise Cover - Handle Detail' },
      { src: '/images/ChaiseLounges/chaise bungee.png', alt: 'Chaise Cover - Bungee System' },
      { src: '/images/ChaiseLounges/CC-chaise.png', alt: 'Chaise Cover - Style View' },
      { src: '/images/homepage/snap-strap.jpeg', alt: 'Snap Strap Detail' }
    ],
    'ottomans': [
      { src: '/images/Ottomans/ottoman side.jpg', alt: 'Ottoman with Castaway Cover' },
      { src: '/images/Ottomans/ottoman handle.jpg', alt: 'Ottoman Cover - Handle Detail' },
      { src: '/images/Ottomans/ottoman bungee.jpg', alt: 'Ottoman Cover - Bungee System' },
      { src: '/images/Ottomans/ottoman.jpg', alt: 'Ottoman Cover - Full View' },
      { src: '/images/homepage/bungee.jpeg', alt: 'Heavy Duty Bungee' }
    ],
    'tables': [
      { src: '/images/Tables/table side.JPEG', alt: 'Table with Castaway Cover' },
      { src: '/images/Tables/table handle.JPEG', alt: 'Table Cover - Handle Detail' },
      { src: '/images/Tables/table bungee.JPEG', alt: 'Table Cover - Bungee System' },
      { src: '/images/Tables/CC-table-1.png', alt: 'Table Cover - Style View' }
    ],
    'table-sets': [
      { src: '/images/Tablesets/tableset side.JPEG', alt: 'Table Set with Castaway Cover' },
      { src: '/images/Tablesets/tableset handle.JPEG', alt: 'Table Set Cover - Handle Detail' },
      { src: '/images/Tablesets/tableset bungee.JPEG', alt: 'Table Set Cover - Bungee System' },
      { src: '/images/Tablesets/CC-table-set.png', alt: 'Table Set - Complete View' }
    ]
  };
  
  return galleryImages[productType as keyof typeof galleryImages] || galleryImages['chairs-recliners'];
};

// Main Product Image Component
const MainProductImage = ({ productType, selectedIndex }: { productType: string; selectedIndex: number }) => {
  const images = getGalleryImages(productType);
  const selectedImage = images[selectedIndex] || images[0];

  return (
    <div className="relative h-[400px] bg-gray-100 rounded-lg overflow-hidden">
      <Image
        src={selectedImage.src}
        alt={selectedImage.alt}
        fill
        className="object-contain p-4"
        priority
      />
    </div>
  );
};

// Horizontal Scroll Gallery Component
const ProductGallery = ({ 
  productType, 
  selectedIndex, 
  onImageSelect 
}: { 
  productType: string; 
  selectedIndex: number;
  onImageSelect: (index: number) => void;
}) => {
  const images = getGalleryImages(productType);

  return (
    <div className="mb-6">
      {/* Horizontal Scrolling Gallery */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`relative flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden border-2 transition-all ${
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
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
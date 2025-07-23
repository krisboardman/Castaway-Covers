'use client';

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
    console.log('Cart mounted, items:', items);
    console.log('localStorage:', localStorage.getItem('castaway-covers-cart'));
  }, [items]);
  
  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading cart...</h1>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);
    try {
      console.log('Cart items to submit:', items);
      
      // Build cart note with all custom properties
      const cartNote = items.map((item, index) => {
        const props = [
          `Item ${index + 1}:`,
          `Product Type: ${item.productType}`,
          `SKU: ${item.coverSKU}`,
          `Yards: ${item.yards}`,
          `Width: ${item.measurements?.width || 0}`,
          `Length: ${item.measurements?.length || 0}`,
          `Height: ${item.measurements?.height || 0}`,
          `Backrest Depth: ${item.measurements?.backrestDepth || 0}`,
          `Armrest Height: ${item.measurements?.armrestHeight || 0}`,
          `Angle: ${item.angle || 0}`,
          `Color: ${item.selectedColor}`,
          `Snap Straps: ${item.snapStraps ? 'Yes' : 'No'}`,
          `Handles: ${item.handles ? 'Yes' : 'No'}`,
          `Magnetic Closure: ${item.magnets ? 'Yes' : 'No'}`,
          `Premium Color Charge: $${item.premiumColorCharge}`,
          '---'
        ].join('\n');
        return props;
      }).join('\n');
      
      // Validate variant IDs
      const invalidItems = items.filter(item => !item.coverVariantId || item.coverVariantId === 'null');
      if (invalidItems.length > 0) {
        console.error('Invalid variant IDs found:', invalidItems);
        alert('Some items in your cart have invalid product IDs. Please remove them and try again.');
        setLoading(false);
        return;
      }
      
      const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
      
      if (!shopifyDomain) {
        throw new Error('Shopify domain not configured');
      }
      
      // Store cart in sessionStorage as backup
      sessionStorage.setItem('castaway-cart-backup', JSON.stringify(items));
      
      // Method 1: Try API route first (handles password-protected stores better)
      try {
        const apiResponse = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ items, cartNote })
        });
        
        const apiData = await apiResponse.json();
        
        if (apiData.checkoutUrl) {
          clearCart();
          window.location.href = apiData.checkoutUrl;
          return;
        }
      } catch (apiError) {
        console.log('API method failed, trying direct method', apiError);
      }
      
      // Method 2: Try direct AJAX
      try {
        const formData = new FormData();
        
        // Add all items to the form
        items.forEach((item, index) => {
          formData.append(`items[${index}][id]`, item.coverVariantId);
          formData.append(`items[${index}][quantity]`, item.quantity.toString());
          
          // Add properties as line items
          const properties = {
            'Product Type': item.productType,
            'SKU': item.coverSKU,
            'Color': item.selectedColor,
            'Width': item.measurements?.width || 0,
            'Length': item.measurements?.length || 0,
            'Height': item.measurements?.height || 0,
            'Snap Straps': item.snapStraps ? 'Yes' : 'No',
            'Handles': item.handles ? 'Yes' : 'No',
            'Magnetic Closure': item.magnets ? 'Yes' : 'No'
          };
          
          Object.entries(properties).forEach(([key, value]) => {
            formData.append(`items[${index}][properties][${key}]`, value.toString());
          });
        });
        
        formData.append('note', cartNote);
        
        const response = await fetch(`https://${shopifyDomain}/cart/add.js`, {
          method: 'POST',
          body: formData,
          credentials: 'same-origin'
        });
        
        if (response.ok) {
          // Successfully added to cart, now redirect to cart page
          clearCart();
          window.location.href = `https://${shopifyDomain}/cart`;
          return;
        }
      } catch (ajaxError) {
        console.log('AJAX method failed, trying permalink method', ajaxError);
      }
      
      // Method 3: Fallback to permalink method
      const cartItems = items.map(item => `${item.coverVariantId}:${item.quantity}`).join(',');
      const encodedNote = encodeURIComponent(cartNote);
      const cartUrl = `https://${shopifyDomain}/cart/${cartItems}?note=${encodedNote}`;
      
      console.log('Redirecting to Shopify cart:', cartUrl);
      window.location.href = cartUrl;
      
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Error processing checkout. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <a
            href="https://castawaycovers.com/design-my-cover/"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <a href="https://castawaycovers.com/">
            <Image
              src="/images/Logo.png"
              alt="Castaway Covers Logo"
              width={200}
              height={80}
              className="object-contain"
            />
          </a>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {productTypes[item.productType as keyof typeof productTypes] || 'Custom Cover'}
                    </h3>
                    <p className="text-gray-600">SKU: {item.coverSKU}</p>
                    <p className="text-gray-600">Color: {item.selectedColor}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    
                    <div className="mt-2 space-y-1">
                      {item.snapStraps && <p className="text-sm">✓ Snap Straps</p>}
                      {item.handles && <p className="text-sm">✓ Handles</p>}
                      {item.magnets && <p className="text-sm">✓ Magnetic Closure</p>}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-semibold">${item.total.toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-md font-semibold transition-colors mb-3 ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            
            <a
              href="https://castawaycovers.com/design-my-cover/"
              className="block w-full text-center py-3 px-6 rounded-md font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const productTypes = {
  'chairs-recliners': 'Chairs / Recliners',
  'sofas-loveseats': 'Sofas / Loveseats',
  'chaise-lounge': 'Chaise Lounge',
  'ottomans': 'Ottomans',
  'tables': 'Tables',
  'table-sets': 'Table Sets'
};
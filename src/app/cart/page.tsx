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
    setLoading(false); // Reset loading state when component mounts
    console.log('Cart mounted, items:', items);
    console.log('Loading state:', loading);
    console.log('localStorage:', localStorage.getItem('castaway-covers-cart'));
  }, [items]);
  
  // Reset loading state when page becomes visible (e.g., back button)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setLoading(false);
        console.log('Page visible again, reset loading state');
      }
    };
    
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setLoading(false);
        console.log('Page restored from cache, reset loading state');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);
  
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
      console.log('Items details:', items.map(item => ({
        variantId: item.coverVariantId,
        sku: item.coverSKU,
        color: item.selectedColor,
        total: item.total
      })));
      
      // Build cart note with all custom properties
      const cartNote = items.map((item, index) => {
        const addOns = [];
        if (item.snapStraps) addOns.push('Snap Straps (+$20)');
        if (item.handles) addOns.push('Handles (+$20)');
        if (item.magnets) addOns.push('Magnetic Closure (+$20)');
        
        const props = [
          `Item ${index + 1}: ${item.productType} - ${item.selectedColor}`,
          addOns.length > 0 ? `Add-ons: ${addOns.join(', ')}` : null,
          `Measurements: ${item.measurements?.width || 0}"W x ${item.measurements?.length || 0}"L x ${item.measurements?.height || 0}"H`,
          item.measurements?.backrestDepth ? `Backrest: ${item.measurements.backrestDepth}", Armrest: ${item.measurements?.armrestHeight || 0}"` : null,
          `SKU: ${item.coverSKU}`,
          `Yards: ${item.yards}`,
          `Angle: ${item.angle || 0}°`,
          `---`
        ].filter(Boolean).join('\n');
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
      
      // Important: We don't clear the cart here anymore. 
      // Cart is only cleared after successful checkout or on the success page.
      
      // Method 1: Create a fresh checkout with all properties
      try {
        console.log('Creating fresh checkout with properties');
        const checkoutResponse = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ items })
        });
        
        const checkoutData = await checkoutResponse.json();
        console.log('Checkout response:', checkoutData);
        
        if (checkoutData.checkoutUrl) {
          console.log('Fresh checkout created, redirecting to:', checkoutData.checkoutUrl);
          window.location.href = checkoutData.checkoutUrl;
          return;
        } else if (checkoutData.error) {
          console.error('Checkout creation failed:', checkoutData);
        }
      } catch (error) {
        console.error('Failed to create checkout:', error);
      }
      
      // Method 2: Fallback to clearing cart and adding items
      try {
        console.log('Fallback: Clearing Shopify cart and adding current items via AJAX');
        
        // First, clear the Shopify cart
        const clearResponse = await fetch(`https://${shopifyDomain}/cart/clear.js`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin'
        });
        
        console.log('Cart cleared:', clearResponse.ok);
        
        // Prepare items for Shopify's expected format
        const shopifyItems = items.map(item => {
          console.log('Processing item:', {
            variantId: item.coverVariantId,
            sku: item.coverSKU,
            hasProperties: true
          });
          return {
            id: item.coverVariantId,
            quantity: item.quantity,
            properties: {
            'Product Type': item.productType,
            'SKU': item.coverSKU,
            'Color': item.selectedColor,
            'Width': `${item.measurements?.width || 0}"`,
            'Length': `${item.measurements?.length || 0}"`,
            'Height': `${item.measurements?.height || 0}"`,
            'Backrest Depth': `${item.measurements?.backrestDepth || 0}"`,
            'Armrest Height': `${item.measurements?.armrestHeight || 0}"`,
            'Yards': item.yards,
            'Snap Straps': item.snapStraps ? 'Yes' : 'No',
            'Handles': item.handles ? 'Yes' : 'No',
            'Magnetic Closure': item.magnets ? 'Yes' : 'No',
            'Premium Color Charge': `$${item.premiumColorCharge}`,
            'Total Price': `$${item.total.toFixed(2)}`
          }
        };
        });
        
        // Add items using AJAX
        const addResponse = await fetch(`https://${shopifyDomain}/cart/add.js`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            items: shopifyItems,
            note: cartNote
          })
        });
        
        if (addResponse.ok) {
          const cartData = await addResponse.json();
          console.log('Items added to cart:', cartData);
          console.log('Cart items in response:', cartData.items);
          
          // Wait a moment for cart to update
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Get the cart to verify items
          const cartCheck = await fetch(`https://${shopifyDomain}/cart.js`, {
            credentials: 'same-origin'
          });
          const currentCart = await cartCheck.json();
          console.log('Current cart contents:', currentCart);
          console.log('Cart item properties:', currentCart.items?.map((item: any) => ({
            title: item.title,
            properties: item.properties
          })));
          
          // Navigate to cart first to see what's there
          window.location.href = `https://${shopifyDomain}/cart`;
          return;
        } else {
          console.error('Failed to add items:', await addResponse.text());
        }
      } catch (ajaxError) {
        console.error('AJAX method failed:', ajaxError);
      }
      
      // Method 4: Fallback to permalink method
      console.log('Attempting Method 4: Cart permalink');
      const cartItems = items.map(item => `${item.coverVariantId}:${item.quantity}`).join(',');
      const encodedNote = encodeURIComponent(cartNote);
      const cartUrl = `https://${shopifyDomain}/cart/${cartItems}?note=${encodedNote}`;
      
      console.log('Cart permalink URL:', cartUrl);
      console.log('Variant IDs being sent:', items.map(i => i.coverVariantId));
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
          <button
            onClick={() => {
              const lastProduct = sessionStorage.getItem('lastProductType');
              window.location.href = lastProduct ? `/products/${lastProduct}` : '/design';
            }}
            className="inline-block bg-brand-teal text-white py-2 px-6 rounded-md hover:bg-brand-teal-dark"
          >
            {typeof window !== 'undefined' && sessionStorage.getItem('lastProductType') ? 'Continue Designing' : 'Design a Cover'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/images/castaway-logo.png"
              alt="Castaway Covers Logo"
              width={200}
              height={80}
              className="object-contain"
            />
          </Link>
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
                    <div className="flex gap-2 justify-end mt-2">
                      <button
                        onClick={() => {
                          // Store the item to edit in sessionStorage
                          sessionStorage.setItem('editCartItem', JSON.stringify(item));
                          window.location.href = `/products/${item.productType}`;
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
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
                  : 'bg-brand-teal text-white hover:bg-brand-teal-dark'
              }`}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            
            <button
              onClick={() => {
                const lastProduct = sessionStorage.getItem('lastProductType');
                window.location.href = lastProduct ? `/products/${lastProduct}` : '/design';
              }}
              className="block w-full text-center py-3 px-6 rounded-md font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Continue Shopping
            </button>
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
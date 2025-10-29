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
  const [showContactForm, setShowContactForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  // Check if manual checkout mode is enabled
  const isManualCheckout = process.env.NEXT_PUBLIC_MANUAL_CHECKOUT === 'true';
  
  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
    setLoading(false); // Reset loading state when component mounts
  }, [items]);
  
  // Reset loading state when page becomes visible (e.g., back button)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setLoading(false);
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setLoading(false);
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

  const handleManualOrder = async () => {
    if (items.length === 0) return;

    // Validate customer info
    if (!customerInfo.name || !customerInfo.email) {
      alert('Please provide your name and email address.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      alert('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerInfo,
          items,
          totalPrice: getTotalPrice()
        })
      });

      const data = await response.json();

      if (data.success) {
        // Clear cart after successful submission
        clearCart();

        // Show success message
        alert(`Thank you ${customerInfo.name}! Your order has been received. We'll send you an invoice at ${customerInfo.email} within 24 hours.`);

        // Redirect to home or confirmation page
        window.location.href = '/';
      } else {
        alert(data.message || 'Error submitting order. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      alert('Error submitting order. Please try again.');
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);
    try {
      
      // Build cart note with all custom properties
      const cartNote = items.map((item, index) => {
        const addOns = [];
        if (item.snapStraps) addOns.push('Snap Straps (+$20)');
        if (item.handles) addOns.push('Handles (+$20)');
        if (item.magnets) addOns.push('Split Cover with Snaps (+$35)');
        
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
        const checkoutResponse = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ items })
        });

        const checkoutData = await checkoutResponse.json();

        if (checkoutData.checkoutUrl) {
          window.location.href = checkoutData.checkoutUrl;
          return;
        }
      } catch (error) {
        // Fall through to next method
      }
      
      // Method 2: Fallback to clearing cart and adding items
      try {
        // First, clear the Shopify cart
        const clearResponse = await fetch(`https://${shopifyDomain}/cart/clear.js`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin'
        });
        
        // Prepare items for Shopify's expected format
        const shopifyItems = items.map(item => {
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
            'Split Cover with Snaps': item.magnets ? 'Yes' : 'No',
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
          // Wait a moment for cart to update
          await new Promise(resolve => setTimeout(resolve, 500));

          // Get the cart to verify items
          const cartCheck = await fetch(`https://${shopifyDomain}/cart.js`, {
            credentials: 'same-origin'
          });
          await cartCheck.json();

          // Navigate to cart first to see what's there
          window.location.href = `https://${shopifyDomain}/cart`;
          return;
        }
      } catch (ajaxError) {
        // Fall through to next method
      }
      
      // Method 4: Fallback to permalink method
      const cartItems = items.map(item => `${item.coverVariantId}:${item.quantity}`).join(',');
      const encodedNote = encodeURIComponent(cartNote);
      const cartUrl = `https://${shopifyDomain}/cart/${cartItems}?note=${encodedNote}`;

      window.location.href = cartUrl;

    } catch (error) {
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
                      {item.magnets && <p className="text-sm">✓ Split Cover with Snaps</p>}
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

            {isManualCheckout ? (
              <>
                {!showContactForm ? (
                  <button
                    onClick={() => setShowContactForm(true)}
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-md font-semibold transition-colors mb-3 bg-brand-teal text-white hover:bg-brand-teal-dark"
                  >
                    Place Order
                  </button>
                ) : (
                  <div className="space-y-4 mb-4">
                    <h3 className="font-semibold text-gray-900">Contact Information</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-teal focus:border-brand-teal"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes (optional)
                      </label>
                      <textarea
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-teal focus:border-brand-teal"
                        rows={3}
                        placeholder="Any special requests or questions?"
                      />
                    </div>

                    <button
                      onClick={handleManualOrder}
                      disabled={loading}
                      className={`w-full py-3 px-6 rounded-md font-semibold transition-colors ${
                        loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-brand-teal text-white hover:bg-brand-teal-dark'
                      }`}
                    >
                      {loading ? 'Submitting...' : 'Submit Order'}
                    </button>

                    <button
                      onClick={() => setShowContactForm(false)}
                      disabled={loading}
                      className="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            ) : (
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
            )}
            
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
'use client';

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);
    try {
      // Shopify checkout temporarily disabled for deployment
      alert('Checkout functionality will be available once Shopify is configured.');
      
      // For now, just log the items that would be checked out
      console.log('Items to checkout:', items);
      
      clearCart();
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Error processing checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/Logo.png"
            alt="Castaway Covers Logo"
            width={200}
            height={80}
            className="object-contain"
          />
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
                      {item.magnets && <p className="text-sm">✓ Magnets</p>}
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
            
            <Link
              href="/"
              className="block w-full text-center py-3 px-6 rounded-md font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const productTypes = {
  sofa: 'Sofa Covers',
  chair: 'Chair Covers', 
  table: 'Table Covers',
  ottoman: 'Ottoman Covers',
  loveseat: 'Loveseat Covers',
  sectional: 'Sectional Covers'
};
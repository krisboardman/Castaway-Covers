'use client';

import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';

export default function TestCheckoutPage() {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const [password, setPassword] = useState('');
  
  const handleTestCheckout = () => {
    if (!password) {
      alert('Please enter the store password');
      return;
    }
    
    // Build the checkout URL with password
    const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    const cartItems = items.map(item => `${item.coverVariantId}:${item.quantity}`).join(',');
    
    // First navigate to password page with the password
    const passwordUrl = `https://${shopifyDomain}/password?password=${encodeURIComponent(password)}`;
    
    // Then redirect to cart
    const cartUrl = `https://${shopifyDomain}/cart/${cartItems}`;
    
    // Open password page, then cart
    window.open(passwordUrl, '_blank');
    setTimeout(() => {
      window.location.href = cartUrl;
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Test Checkout</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
          <p>Items: {items.length}</p>
          <p>Total: ${getTotalPrice().toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Store Password</h2>
          <p className="text-gray-600 mb-4">
            Enter your Shopify store password to access checkout in test mode:
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Store password"
            className="w-full px-4 py-2 border rounded-md mb-4"
          />
          <button
            onClick={handleTestCheckout}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Proceed to Test Checkout
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This page is for testing with password-protected stores. 
            In production, customers will go directly to checkout without needing a password.
          </p>
        </div>
      </div>
    </div>
  );
}
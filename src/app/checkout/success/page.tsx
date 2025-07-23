'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Clear the cart after successful checkout
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank you for your order!</h1>
        <p className="text-gray-600 mb-8">Your order has been successfully placed.</p>
        <Link
          href="https://castawaycovers.com/"
          className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  useEffect(() => {
    // Fire Meta Pixel Purchase event BEFORE clearing the cart, while the
    // cart still has line items. This is the highest-value conversion
    // signal we can send to Meta — used for sales-objective ad optimization.
    // Snapshot the order details now so we still have them after clearCart().
    const orderSnapshot = items.length > 0 ? {
      value: getTotalPrice(),
      currency: 'USD',
      num_items: items.reduce((sum, i) => sum + i.quantity, 0),
      content_ids: items.map((i) => i.coverSKU).filter(Boolean),
      content_type: 'product',
    } : null;

    // Retry firing Purchase until fbq is loaded (handles the afterInteractive
    // race condition on fresh page loads).
    if (typeof window !== 'undefined' && orderSnapshot) {
      const fire = () => {
        const w = window as any;
        if (!w.fbq) return false;
        w.fbq('track', 'Purchase', orderSnapshot);
        return true;
      };
      if (!fire()) {
        const interval = setInterval(() => {
          if (fire()) clearInterval(interval);
        }, 250);
        setTimeout(() => clearInterval(interval), 8000);
      }
    }

    // Clear the cart after capturing the snapshot.
    clearCart();
    // We intentionally fire-and-clear on first mount; deps left minimal
    // so we don't re-fire on re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
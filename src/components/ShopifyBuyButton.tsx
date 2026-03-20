'use client';

import { useEffect, useState } from 'react';
import { getShopifyClient } from '@/lib/shopify-client';

interface ShopifyBuyButtonProps {
  variantId: string;
  quantity: number;
  customAttributes: Record<string, string>;
  onAddToCart: () => void;
  disabled?: boolean;
  isCustomOrder?: boolean;
  onRequestQuote?: () => void;
}

const ShopifyBuyButton: React.FC<ShopifyBuyButtonProps> = ({
  variantId,
  quantity,
  customAttributes,
  onAddToCart,
  disabled = false,
  isCustomOrder = false,
  onRequestQuote
}) => {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initClient = async () => {
      const shopifyClient = await getShopifyClient();
      if (shopifyClient) {
        setClient(shopifyClient);
      }
    };
    initClient();
  }, []);

  const handleBuyNow = async () => {
    if (!variantId || disabled) return;

    setLoading(true);
    try {
      // Add to local cart
      onAddToCart();

      // Wait a moment for cart to update
      setTimeout(() => {
        // Redirect to the Vercel app cart page
        window.location.href = '/cart';
      }, 100);
    } catch (error) {
      alert('Error adding to cart. Please try again.');
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!client || !variantId || disabled) return;

    setLoading(true);
    try {
      // Add to local cart
      onAddToCart();

      // Show success feedback
      setLoading(false);

      // Optional: Add a temporary success state
      setTimeout(() => {
        // Reset any success states if needed
      }, 2000);
    } catch (error) {
      alert('Error adding to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ââ Custom order: no matching Shopify variant ââââââââââââââââââ
  if (isCustomOrder) {
    return (
      <div className="space-y-3">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <p className="text-sm font-semibold text-amber-900 mb-1">Custom Order Required</p>
          <p className="text-sm text-amber-800">
            We don't carry a ready-made cover for these dimensions. We can
            make one â request a quote and we'll follow up within 24 hours.
          </p>
        </div>
        <button
          onClick={onRequestQuote}
          className="w-full py-3 px-6 rounded-md font-semibold transition-colors bg-brand-teal text-white hover:bg-brand-teal-dark"
        >
          Request a Quote
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleBuyNow}
        disabled={disabled || loading}
        className={`w-full py-3 px-6 rounded-md font-semibold transition-colors ${
          disabled || loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-brand-teal text-white hover:bg-brand-teal-dark'
        }`}
      >
        {loading ? 'Processing...' : 'Buy Now'}
      </button>

      <button
        onClick={handleAddToCart}
        disabled={disabled || loading}
        className={`w-full py-3 px-6 rounded-md font-semibold transition-colors ${
          disabled || loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
      >
        {loading ? 'Processing...' : 'Add to Cart'}
      </button>

      {disabled && (
        <p className="text-sm text-red-600 text-center">
          Please complete all required fields
        </p>
      )}
    </div>
  );
};

export default ShopifyBuyButton;

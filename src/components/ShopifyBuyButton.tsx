'use client';

import { useEffect, useState } from 'react';
import { getShopifyClient } from '@/lib/shopify-client';

interface ShopifyBuyButtonProps {
  variantId: string;
  quantity: number;
  customAttributes: Record<string, string>;
  onAddToCart: () => void;
  disabled?: boolean;
}

const ShopifyBuyButton: React.FC<ShopifyBuyButtonProps> = ({
  variantId,
  quantity,
  customAttributes,
  onAddToCart,
  disabled = false
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

    console.log('Variant ID:', variantId);
    console.log('Variant ID type:', typeof variantId);

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
      console.error('Error creating checkout:', error);
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
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleBuyNow}
        disabled={disabled || loading}
        className={`w-full py-3 px-6 rounded-md font-semibold transition-colors ${
          disabled || loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
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
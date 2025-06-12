'use client';

import { useEffect, useState } from 'react';

let ShopifyBuy: any;
if (typeof window !== 'undefined') {
  ShopifyBuy = require('@shopify/buy-button-js');
}

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
    if (typeof window !== 'undefined' && ShopifyBuy) {
      const shopifyClient = ShopifyBuy.buildClient({
        domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
        storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      });
      setClient(shopifyClient);
    }
  }, []);

  const handleBuyNow = async () => {
    if (!client || !variantId || disabled) return;

    setLoading(true);
    try {
      const checkout = await client.checkout.create();
      
      const lineItemsToAdd = [{
        variantId,
        quantity,
        customAttributes: Object.entries(customAttributes).map(([key, value]) => ({
          key,
          value
        }))
      }];

      const newCheckout = await client.checkout.addLineItems(checkout.id, lineItemsToAdd);
      
      // Also add to local cart
      onAddToCart();
      
      // Redirect to Shopify checkout
      window.location.href = newCheckout.webUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Error adding to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!client || !variantId || disabled) return;

    setLoading(true);
    try {
      // For now, just add to local cart
      // In a full implementation, you might also sync with Shopify cart
      onAddToCart();
      alert('Added to cart! Continue shopping or proceed to checkout.');
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
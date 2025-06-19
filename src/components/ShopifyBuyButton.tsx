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
      // Create a form and submit it to avoid CORS issues
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/cart/add`;
      
      // Add variant ID
      const idInput = document.createElement('input');
      idInput.type = 'hidden';
      idInput.name = 'id';
      idInput.value = variantId;
      form.appendChild(idInput);
      
      // Add quantity
      const qtyInput = document.createElement('input');
      qtyInput.type = 'hidden';
      qtyInput.name = 'quantity';
      qtyInput.value = quantity.toString();
      form.appendChild(qtyInput);
      
      // Add custom attributes
      Object.entries(customAttributes).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = `properties[${key}]`;
        input.value = value;
        form.appendChild(input);
      });
      
      // Don't add return_to - let Shopify handle the redirect
      
      // Add to local cart before submitting
      onAddToCart();
      
      console.log('Submitting to Shopify - Variant ID:', variantId);
      console.log('Form action:', form.action);
      
      // Submit the form
      document.body.appendChild(form);
      form.submit();
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
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
      console.log('Cart items to submit:', items);
      
      // Create a form to submit to Shopify
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/cart/add`;
      
      // Add all items to the form
      items.forEach((item, index) => {
        if (!item.coverVariantId) {
          console.error('Missing variant ID for item:', item);
          return;
        }
        
        // For multiple items, use array notation
        const prefix = items.length > 1 ? `items[${index}]` : '';
        
        // Add variant ID
        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.name = prefix ? `${prefix}[id]` : 'id';
        idInput.value = item.coverVariantId;
        form.appendChild(idInput);
        
        // Add quantity
        const qtyInput = document.createElement('input');
        qtyInput.type = 'hidden';
        qtyInput.name = prefix ? `${prefix}[quantity]` : 'quantity';
        qtyInput.value = item.quantity.toString();
        form.appendChild(qtyInput);
        
        // Add all custom properties including measurements
        const properties = {
          productType: item.productType,
          sku: item.coverSKU,
          yards: item.yards.toString(),
          width: item.measurements?.width?.toString() || '0',
          length: item.measurements?.length?.toString() || '0',
          height: item.measurements?.height?.toString() || '0',
          backrestDepth: item.measurements?.backrestDepth?.toString() || '0',
          armrestHeight: item.measurements?.armrestHeight?.toString() || '0',
          angle: item.angle?.toString() || '0',
          color: item.selectedColor,
          snapStraps: item.snapStraps.toString(),
          handles: item.handles.toString(),
          magneticClosure: item.magnets.toString(),
          premiumColorCharge: item.premiumColorCharge.toString()
        };
        
        Object.entries(properties).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = prefix ? `${prefix}[properties][${key}]` : `properties[${key}]`;
          input.value = value;
          form.appendChild(input);
        });
      });
      
      // Add return to cart
      const returnInput = document.createElement('input');
      returnInput.type = 'hidden';
      returnInput.name = 'return_to';
      returnInput.value = '/cart';
      form.appendChild(returnInput);
      
      console.log('Submitting form with custom properties');
      
      // Clear local cart after form is ready
      clearCart();
      
      // Submit the form
      document.body.appendChild(form);
      form.submit();
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
          <a href="https://castawaycovers.com/">
            <Image
              src="/images/Logo.png"
              alt="Castaway Covers Logo"
              width={200}
              height={80}
              className="object-contain"
            />
          </a>
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
  'chairs-recliners': 'Chairs / Recliners',
  'sofas-loveseats': 'Sofas / Loveseats',
  'chaise-lounge': 'Chaise Lounge',
  'ottomans': 'Ottomans',
  'tables': 'Tables',
  'table-sets': 'Table Sets'
};
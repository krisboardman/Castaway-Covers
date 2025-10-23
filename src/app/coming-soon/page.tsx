'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/castaway-logo.png"
            alt="Castaway Covers"
            width={300}
            height={120}
            className="mx-auto"
          />
        </div>

        {/* Coming Soon Text */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Coming Soon
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          We're working hard to bring you the best custom patio furniture covers. 
          Our new site will be launching shortly!
        </p>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="font-semibold mb-2">Premium Protection</h3>
            <p className="text-gray-600 text-sm">Marine-grade materials that last</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">📏</div>
            <h3 className="font-semibold mb-2">Custom Fit</h3>
            <p className="text-gray-600 text-sm">Tailored to your exact measurements</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600 text-sm">On and off in seconds</p>
          </div>
        </div>

        {/* Email Signup */}
        {!submitted ? (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Get Notified When We Launch</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                Notify Me
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-green-50 p-8 rounded-lg max-w-md mx-auto">
            <div className="text-green-600 text-xl mb-2">✓ Thank you!</div>
            <p className="text-gray-700">We'll notify you as soon as we launch.</p>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-12 text-gray-500 text-sm">
          <p>Questions? Contact us at support@castawaycovers.com</p>
        </div>
      </div>
    </div>
  );
}
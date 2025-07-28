'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="flex items-center">
            <img
              src="/images/castaway-logo.png"
              alt="Castaway Covers"
              className="h-12 object-contain"
            />
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-brand-teal font-medium transition-colors">
              Home
            </Link>
            <Link href="/cart" className="relative text-gray-700 hover:text-brand-teal font-medium transition-colors">
              Cart
              {mounted && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-teal text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link 
              href="/design" 
              className="bg-brand-teal text-white px-6 py-2 rounded-full hover:bg-brand-teal-dark transition-colors font-semibold"
            >
              Design My Cover
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
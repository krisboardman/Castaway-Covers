'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const itemCount = useCartStore((state) => state.getTotalItems());

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="flex items-center">
            <img
              src="https://castawaycovers.com/wp-content/uploads/elementor/thumbs/logo6-r6512v076y22m3rl5vemzshr2rxnj9a4uqoceb06q4.png"
              alt="Castaway Covers"
              className="h-12 object-contain"
            />
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link href="/#products" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>
            <Link href="/#how-it-works" className="text-gray-700 hover:text-gray-900">
              How It Works
            </Link>
            <Link href="/cart" className="relative text-gray-700 hover:text-gray-900">
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
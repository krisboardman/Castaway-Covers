'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const itemCount = getTotalItems();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/Logo.png"
              alt="Castaway Covers"
              width={150}
              height={40}
              className="object-contain"
            />
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
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
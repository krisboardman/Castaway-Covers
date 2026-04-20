'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close the mobile menu whenever a link is tapped
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 gap-3">
          {/* Logo (always visible) */}
          <Link href="/" className="flex items-center shrink-0" onClick={closeMenu}>
            <Image
              src="/images/logos/castaway-logo.png"
              alt="Castaway Covers"
              width={200}
              height={48}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-brand-teal font-medium transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-gray-700 hover:text-brand-teal font-medium transition-colors">
              Craftsmanship
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

          {/* Mobile: cart + hamburger */}
          <div className="flex md:hidden items-center gap-4">
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-brand-teal font-medium transition-colors"
              onClick={closeMenu}
            >
              Cart
              {mounted && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-teal text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 -mr-2 text-gray-700 hover:text-brand-teal transition-colors"
            >
              {mobileMenuOpen ? (
                // X icon
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav"
            className="md:hidden border-t border-gray-200 py-3 flex items-center justify-between gap-2 flex-wrap"
            aria-label="Mobile navigation"
          >
            <Link
              href="/"
              onClick={closeMenu}
              className="text-sm font-medium text-gray-700 hover:text-brand-teal transition-colors whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              href="/features"
              onClick={closeMenu}
              className="text-sm font-medium text-gray-700 hover:text-brand-teal transition-colors whitespace-nowrap"
            >
              Craftsmanship
            </Link>
            <Link
              href="/design"
              onClick={closeMenu}
              className="text-sm font-semibold bg-brand-teal text-white px-4 py-2 rounded-full hover:bg-brand-teal-dark transition-colors whitespace-nowrap"
            >
              Design My Cover
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

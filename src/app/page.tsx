'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Premium Covers for Your
              <span className="text-blue-600 block mt-2">Patio Furniture</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Custom-fit, weather-resistant covers designed to protect your outdoor furniture with style
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#products" 
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Shop Now
              </Link>
              <Link 
                href="#how-it-works" 
                className="inline-block bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">✓</div>
              <div className="font-semibold">Hassle Free</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🎨</div>
              <div className="font-semibold">Unique Design</div>
            </div>
            <div>
              <div className="text-3xl mb-2">💪</div>
              <div className="font-semibold">Heavy Duty</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🌧️</div>
              <div className="font-semibold">Weather Proof</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🛡️</div>
              <div className="font-semibold">Mildew Resistant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Furniture Type
            </h2>
            <p className="text-xl text-gray-600">
              Select your furniture type to get started with a custom cover
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/products/chairs-recliners" className="group">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-6xl">🪑</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Chairs / Recliners
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Perfect fit for all types of outdoor chairs and recliners
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/products/sofas-loveseats" className="group">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <span className="text-6xl">🛋️</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Sofas / Loveseats
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Protect your outdoor sofas and loveseats in style
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/products/chaise-lounge" className="group">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <span className="text-6xl">🛏️</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Chaise Lounge
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Custom covers for your poolside loungers
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/products/ottomans" className="group">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                  <span className="text-6xl">🟦</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Ottomans
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Keep your ottomans protected year-round
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/products/tables" className="group">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                  <span className="text-6xl">🪜</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Tables
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Durable covers for outdoor dining tables
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/products/table-sets" className="group">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                  <span className="text-6xl">🪑🪜</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Table Sets
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Complete coverage for table and chair sets
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get your custom cover in 3 easy steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Select Your Furniture</h3>
              <p className="text-gray-600">
                Choose from our range of furniture types - chairs, sofas, tables, and more
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Measurements</h3>
              <p className="text-gray-600">
                Provide your furniture dimensions for a perfect custom fit
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Options & Order</h3>
              <p className="text-gray-600">
                Select your color, add-ons, and complete your order. We'll handle the rest!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Castaway Covers
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📏</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Custom Fit</h3>
                <p className="text-gray-600">
                  Every cover is made to your exact measurements for a perfect fit
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🌟</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Premium Materials</h3>
                <p className="text-gray-600">
                  Heavy-duty, weather-resistant fabric that lasts for years
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎨</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Style Options</h3>
                <p className="text-gray-600">
                  Choose from multiple colors to match your outdoor aesthetic
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🚚</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Quick production and shipping to get your covers when you need them
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Protect Your Furniture?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start designing your custom covers today
          </p>
          <Link 
            href="#products" 
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Castaway Covers</h3>
              <p className="text-gray-400">
                Premium custom-fit covers for your outdoor furniture
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#products" className="hover:text-white">Products</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">
                Questions? We're here to help!<br />
                Email: support@castawaycovers.com
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Castaway Covers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
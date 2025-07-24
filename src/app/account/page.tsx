'use client';

import { useState } from 'react';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Account</h1>
        
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeTab === 'orders' 
                        ? 'bg-blue-50 text-blue-600 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Order History
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeTab === 'addresses' 
                        ? 'bg-blue-50 text-blue-600 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Addresses
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('account-details')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeTab === 'account-details' 
                        ? 'bg-blue-50 text-blue-600 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Account Details
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeTab === 'wishlist' 
                        ? 'bg-blue-50 text-blue-600 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Wishlist
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 rounded text-gray-700 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Order History Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h2>
                  <div className="space-y-4">
                    {/* Sample Order */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold text-gray-900">Order #12345</p>
                          <p className="text-sm text-gray-600">Placed on January 15, 2024</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          Delivered
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <p>Patio Sofa Cover - Large</p>
                        <p>Total: $89.99</p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="text-blue-600 hover:underline text-sm">View Details</button>
                        <button className="text-blue-600 hover:underline text-sm">Track Package</button>
                        <button className="text-blue-600 hover:underline text-sm">Buy Again</button>
                      </div>
                    </div>

                    {/* No Orders Message */}
                    <div className="text-center py-8 text-gray-500">
                      <p>You haven't placed any orders yet.</p>
                      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                        Start Shopping
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Saved Addresses</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Billing Address */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Billing Address</h3>
                      <p className="text-gray-700 text-sm">
                        John Doe<br />
                        123 Main Street<br />
                        Apt 4B<br />
                        New York, NY 10001<br />
                        United States
                      </p>
                      <button className="mt-3 text-blue-600 hover:underline text-sm">Edit</button>
                    </div>

                    {/* Shipping Address */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                      <p className="text-gray-700 text-sm">
                        Same as billing address
                      </p>
                      <button className="mt-3 text-blue-600 hover:underline text-sm">Edit</button>
                    </div>
                  </div>
                  <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Add New Address
                  </button>
                </div>
              )}

              {/* Account Details Tab */}
              {activeTab === 'account-details' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Details</h2>
                  <form className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="pt-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Wishlist</h2>
                  <div className="text-center py-8 text-gray-500">
                    <p>Your wishlist is empty.</p>
                    <p className="mt-2">Save items you'd like to purchase later.</p>
                    <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MeasurementServicePage() {
  const [isNearRumson, setIsNearRumson] = useState<boolean | null>(null);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    furnitureTypes: [] as string[],
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });

  // Check if user is near Rumson (within ~10 miles)
  useEffect(() => {
    if (navigator.geolocation) {
      setCheckingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const rumsonLat = 40.3723;
          const rumsonLng = -74.0018;
          const distance = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            rumsonLat,
            rumsonLng
          );
          setIsNearRumson(distance <= 10);
          setCheckingLocation(false);
        },
        () => {
          // If geolocation fails, show the form anyway
          setCheckingLocation(false);
        }
      );
    }
  }, []);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send to Formspree
      const response = await fetch('https://formspree.io/f/xblkwzzr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, NJ ${formData.zipCode}`,
          furnitureTypes: formData.furnitureTypes.join(', '),
          preferredDate: formData.preferredDate || 'Not specified',
          preferredTime: formData.preferredTime || 'Not specified',
          notes: formData.notes || 'None',
          _subject: 'New Measurement Service Request',
        }),
      });

      if (response.ok) {
        alert('Thank you! We\'ll contact you within 24 hours to confirm your appointment and process payment.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          zipCode: '',
          furnitureTypes: [],
          preferredDate: '',
          preferredTime: '',
          notes: ''
        });
      } else {
        alert('There was an error submitting your request. Please try again or email us directly at support@castawaycovers.com');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again or email us directly at support@castawaycovers.com');
    }
  };

  const furnitureOptions = [
    'Chairs/Recliners',
    'Sofas/Loveseats',
    'Chaise Lounges',
    'Tables',
    'Table Sets',
    'Ottomans',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Measurement Service
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Let us take the guesswork out of ordering your custom covers
            </p>
            {isNearRumson === true && (
              <div className="inline-block bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mt-2">
                ✓ Great news! You're in our service area
              </div>
            )}
            {isNearRumson === false && (
              <div className="inline-block bg-yellow-50 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mt-2">
                ⚠️ You may be outside our 10-mile service area - we'll verify your address
              </div>
            )}
          </div>

          {/* Service Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <ol className="space-y-3">
              <li className="flex">
                <span className="flex-shrink-0 w-8 h-8 bg-[#2C8B80] text-white rounded-full flex items-center justify-center font-semibold mr-3">1</span>
                <div>
                  <strong>Book Your Appointment</strong> - Fill out the form below
                </div>
              </li>
              <li className="flex">
                <span className="flex-shrink-0 w-8 h-8 bg-[#2C8B80] text-white rounded-full flex items-center justify-center font-semibold mr-3">2</span>
                <div>
                  <strong>Pay Service Fee</strong> - $75 via our secure checkout (link sent after booking)
                </div>
              </li>
              <li className="flex">
                <span className="flex-shrink-0 w-8 h-8 bg-[#2C8B80] text-white rounded-full flex items-center justify-center font-semibold mr-3">3</span>
                <div>
                  <strong>We Visit Your Home</strong> - Professional measurement of all furniture
                </div>
              </li>
              <li className="flex">
                <span className="flex-shrink-0 w-8 h-8 bg-[#2C8B80] text-white rounded-full flex items-center justify-center font-semibold mr-3">4</span>
                <div>
                  <strong>Receive Your Quote</strong> - Custom order created with perfect measurements
                </div>
              </li>
            </ol>
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> The $75 service fee can be credited toward your cover purchase of $500 or more
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C8B80]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C8B80]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C8B80]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C8B80]"
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C8B80]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{5}"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C8B80]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Furniture to Measure * (check all that apply)
              </label>
              <div className="space-y-2">
                {furnitureOptions.map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      value={option}
                      checked={formData.furnitureTypes.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, furnitureTypes: [...formData.furnitureTypes, option]});
                        } else {
                          setFormData({...formData, furnitureTypes: formData.furnitureTypes.filter(t => t !== option)});
                        }
                      }}
                      className="mr-3 h-4 w-4 text-[#2C8B80] border-gray-300 rounded focus:ring-[#2C8B80]"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C8B80]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time
                </label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C8B80]"
                >
                  <option value="">Select a time</option>
                  <option value="morning">Morning (9am-12pm)</option>
                  <option value="afternoon">Afternoon (12pm-3pm)</option>
                  <option value="late-afternoon">Late Afternoon (3pm-6pm)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C8B80]"
                placeholder="Any special instructions or questions?"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={formData.furnitureTypes.length === 0}
                className="flex-1 bg-[#2C8B80] text-white px-6 py-3 rounded-md hover:bg-[#1F6259] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Book Measurement Service
              </button>
              <Link
                href="/design"
                className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-center"
              >
                Back to Design
              </Link>
            </div>
          </form>

          {/* Service Area Note */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Service Area:</strong> We provide in-home measurement service within 10 miles of Rumson, NJ. 
              This includes Rumson, Fair Haven, Little Silver, Red Bank, Shrewsbury, Sea Bright, Monmouth Beach, 
              Long Branch (partial), Middletown (partial), and surrounding areas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
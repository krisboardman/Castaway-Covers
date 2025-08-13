'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminTogglePage() {
  const [isComingSoon, setIsComingSoon] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Generate preview URL
    const baseUrl = window.location.origin;
    const token = process.env.NEXT_PUBLIC_PREVIEW_TOKEN || 'secret123';
    setPreviewUrl(`${baseUrl}?preview=${token}`);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, this should be more secure
    if (password === 'castaway2024') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleToggle = async () => {
    // In a real implementation, this would update the environment variable
    // For now, we'll just show how it would work
    setIsComingSoon(!isComingSoon);
    alert(`Site is now ${!isComingSoon ? 'in Coming Soon mode' : 'Live'}! 
    
Note: In production, this would update the COMING_SOON_MODE environment variable in Vercel.`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Admin Access</h1>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Site Mode Control</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Current Status</h2>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-white ${
              isComingSoon ? 'bg-yellow-500' : 'bg-green-500'
            }`}>
              {isComingSoon ? '🚧 Coming Soon Mode' : '🟢 Live Mode'}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Toggle Site Mode</h2>
            <button
              onClick={handleToggle}
              className={`w-full py-4 rounded-lg text-white font-semibold transition-colors ${
                isComingSoon 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-yellow-600 hover:bg-yellow-700'
              }`}
            >
              {isComingSoon ? 'Switch to Live Mode' : 'Switch to Coming Soon Mode'}
            </button>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Preview Options</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Preview URL (share this to show the live site):</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={previewUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(previewUrl);
                      alert('Preview URL copied!');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <button
                  onClick={() => window.open(previewUrl, '_blank')}
                  className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                >
                  Open Preview in New Tab
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Coming Soon Mode: All visitors see the coming soon page</li>
              <li>• Live Mode: Site is fully accessible to everyone</li>
              <li>• Preview URL: Bypasses coming soon page for 24 hours</li>
              <li>• Share the preview URL to show the site without going live</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
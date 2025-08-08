'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ComingSoonRedirect() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Check if coming soon mode is enabled
    const COMING_SOON_ENABLED = false;
    const PREVIEW_TOKEN = 'castaway2025';
    
    // Skip redirect for certain pages
    if (pathname === '/coming-soon' || pathname === '/admin-toggle') {
      return;
    }
    
    // Check for preview parameter
    const urlParams = new URLSearchParams(window.location.search);
    const hasPreview = urlParams.get('preview') === PREVIEW_TOKEN;
    
    // Check for preview cookie
    const hasPreviewCookie = document.cookie.includes('preview-mode=true');
    
    // Set preview cookie if preview token is present
    if (hasPreview && !hasPreviewCookie) {
      document.cookie = 'preview-mode=true; max-age=86400; path=/; domain=.castawaycovers.com';
      // Also set for the root domain
      document.cookie = 'preview-mode=true; max-age=86400; path=/';
    }
    
    // Only redirect if coming soon is enabled AND no preview access
    if (COMING_SOON_ENABLED && !hasPreview && !hasPreviewCookie) {
      // Redirect to coming soon page
      window.location.href = '/coming-soon';
    }
  }, [pathname]);
  
  return null;
}
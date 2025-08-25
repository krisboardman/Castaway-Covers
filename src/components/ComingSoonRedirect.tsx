'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ComingSoonRedirect() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Check if coming soon mode is enabled
    const COMING_SOON_ENABLED = true;
    const PREVIEW_TOKEN = 'castaway2025';
    
    // Skip redirect for coming soon page itself
    if (pathname === '/coming-soon') {
      return;
    }
    
    // Check for preview parameter
    const urlParams = new URLSearchParams(window.location.search);
    const hasPreview = urlParams.get('preview') === PREVIEW_TOKEN;
    
    // If preview token is present, set cookie and allow access
    if (hasPreview) {
      document.cookie = 'preview-mode=true; max-age=86400; path=/';
      return; // Don't redirect
    }
    
    // Check for preview cookie
    const hasPreviewCookie = document.cookie.includes('preview-mode=true');
    
    // If preview cookie exists, allow access
    if (hasPreviewCookie) {
      return; // Don't redirect
    }
    
    // Only redirect to coming soon if enabled and no preview access
    if (COMING_SOON_ENABLED) {
      window.location.href = '/coming-soon';
    }
  }, [pathname]);
  
  return null;
}
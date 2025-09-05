'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ComingSoonRedirect() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Check if coming soon mode is enabled
    const COMING_SOON_ENABLED = true;
    const PREVIEW_TOKEN = 'castaway2025';
    const ADMIN_TOKEN = 'kbadmin2025';
    
    // Skip redirect for coming soon page itself
    if (pathname === '/coming-soon') {
      return;
    }
    
    // Check for preview parameter
    const urlParams = new URLSearchParams(window.location.search);
    const previewParam = urlParams.get('preview');
    
    // If admin token is present, set longer-lasting cookie
    if (previewParam === ADMIN_TOKEN) {
      document.cookie = 'preview-mode=true; max-age=2592000; path=/'; // 30 days
      return; // Don't redirect
    }
    
    // If regular preview token is present, set 24-hour cookie
    if (previewParam === PREVIEW_TOKEN) {
      document.cookie = 'preview-mode=true; max-age=86400; path=/'; // 24 hours
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
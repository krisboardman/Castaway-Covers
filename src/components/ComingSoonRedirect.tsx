'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ComingSoonRedirect() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Skip entirely for coming soon page to prevent any redirect loops
    if (pathname === '/coming-soon') {
      return;
    }
    
    // Check if coming soon mode is enabled
    const COMING_SOON_ENABLED = true;
    const PREVIEW_TOKEN = 'castaway2025';
    const ADMIN_TOKEN = 'kbadmin2025'; // Special admin token for permanent access
    
    // Helper function to get cookie value by name
    const getCookieValue = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue || null;
      }
      return null;
    };
    
    // Helper function to set preview cookie with proper cleanup
    const setPreviewCookie = (isAdmin = false) => {
      // Clear any existing preview-mode cookies first
      document.cookie = 'preview-mode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      // Set cookie duration: 30 days for admin, 24 hours for regular preview
      const maxAge = isAdmin ? 2592000 : 86400; // 30 days vs 24 hours
      // Set the new preview cookie
      document.cookie = `preview-mode=true; max-age=${maxAge}; path=/; SameSite=Lax`;
    };
    
    // Check for preview parameter - this always takes precedence
    const urlParams = new URLSearchParams(window.location.search);
    const previewParam = urlParams.get('preview');
    const hasPreview = previewParam === PREVIEW_TOKEN;
    const hasAdminAccess = previewParam === ADMIN_TOKEN;
    
    // If admin token is present, set long-lasting cookie
    if (hasAdminAccess) {
      setPreviewCookie(true); // Sets 30-day cookie
      // Also set an admin flag cookie
      document.cookie = 'admin-access=true; max-age=2592000; path=/; SameSite=Lax';
      // Clean URL by removing the preview parameter
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('preview');
      window.history.replaceState({}, '', cleanUrl.toString());
      return; // Don't redirect
    }
    
    // If regular preview token is present, set 24-hour cookie
    if (hasPreview) {
      setPreviewCookie(false); // Sets 24-hour cookie
      // Clean URL by removing the preview parameter
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('preview');
      window.history.replaceState({}, '', cleanUrl.toString());
      return; // Don't redirect
    }
    
    // Check for valid preview cookie or admin cookie using proper parsing
    const previewCookieValue = getCookieValue('preview-mode');
    const adminCookieValue = getCookieValue('admin-access');
    const hasValidPreviewCookie = previewCookieValue === 'true';
    const hasValidAdminCookie = adminCookieValue === 'true';
    
    // If valid preview cookie or admin cookie exists, allow access
    if (hasValidPreviewCookie || hasValidAdminCookie) {
      return; // Don't redirect
    }
    
    // Only redirect to coming soon if enabled and no preview access
    if (COMING_SOON_ENABLED) {
      window.location.href = '/coming-soon';
    }
  }, [pathname]);
  
  return null;
}
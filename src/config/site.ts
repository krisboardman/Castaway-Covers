// Site configuration
export const siteConfig = {
  comingSoonMode: process.env.NEXT_PUBLIC_COMING_SOON_MODE === 'true',
  previewToken: process.env.NEXT_PUBLIC_PREVIEW_TOKEN || 'castaway2025'
};
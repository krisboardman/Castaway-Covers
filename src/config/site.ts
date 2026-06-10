// Site configuration
export const siteConfig = {
  previewToken: process.env.NEXT_PUBLIC_PREVIEW_TOKEN || 'castaway2025'
};

// Measurement service promotion.
// While true, the in-home measurement service is advertised as FREE (promo
// sticker shown, $75 struck through, booking confirmation says no charge).
// Set this to false to END the promotion and restore the $75 fee everywhere
// in one place — no other files need editing.
export const MEASUREMENT_PROMO_ACTIVE = true;

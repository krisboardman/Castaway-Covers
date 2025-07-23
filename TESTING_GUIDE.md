# Testing Guide for Castaway Covers

## The Password Protection / Test Mode Issue

Shopify links password protection with test mode:
- **Password ON** = Test mode ON (no real charges)
- **Password OFF** = Test mode OFF (real charges possible)

This creates a problem: you can't access checkout with password protection enabled.

## Solution: Share Preview Link

The proper way to test with password-protected Shopify stores:

1. **In Shopify Admin:**
   - Go to Online Store → Preferences
   - Keep password protection ENABLED
   - Look for "Share preview" button
   - Click it to generate a preview link

2. **The preview link:**
   - Bypasses password protection for 14 days
   - Allows testing checkout in test mode
   - Can be shared with team members
   - Format: `https://your-store.myshopify.com/?preview_theme_id=xxxxx`

3. **Testing workflow:**
   - Use the preview link to access your store
   - Add items to cart normally
   - Proceed to checkout
   - Use Shopify test credit cards

## Test Credit Cards

When in test mode, use these credit card numbers:
- **Visa**: 4242 4242 4242 4242
- **Mastercard**: 5555 5555 5555 4444
- **Amex**: 3782 822463 10005

Use any future expiry date and any 3-digit CVV.

## Alternative: Development Store

If you're frequently testing, consider:
1. Create a Shopify development store (free)
2. Duplicate your products there
3. No password protection needed
4. Always in test mode

## Current App Behavior

The app now:
1. Attempts multiple checkout methods
2. Shows detailed console logs for debugging
3. Has a test checkout page at `/test-checkout`
4. Stores backup cart data in sessionStorage

## Debugging Checklist

If checkout isn't working:
1. Check browser console for variant IDs
2. Verify NEXT_PUBLIC_SHOPIFY_DOMAIN is correct
3. Ensure products have valid variant IDs
4. Try using Shopify's preview link
5. Check if cart data is in sessionStorage (backup)
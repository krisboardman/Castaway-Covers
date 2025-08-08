# 🚀 Deployment Guide for Castaway Covers

## Today's Changes Summary
✅ Redesigned homepage with 3-panel story layout
✅ Enhanced "Why We're Different" section with better copy
✅ Improved design page with descriptions and "Most Popular" badge
✅ Added Diamond Red as a premium color option
✅ Removed all phone references (email contact only)
✅ Tightened spacing throughout for cleaner look
✅ Fixed background gradient consistency
✅ Updated product descriptions for accuracy

## Step 1: Build Test (REQUIRED)
Open Terminal and run:
```bash
cd ~/Desktop/Castaway-Covers
npm run build
```

If you see errors, they need to be fixed before deploying.

## Step 2: Initialize Git (First Time Only)
```bash
git init
git add .
git commit -m "Site redesign complete - ready for launch"
```

## Step 3: Deploy to Vercel

### Option A: Direct Vercel Deploy (Easiest)
```bash
npx vercel --prod
```
- Follow the prompts
- It will give you a production URL

### Option B: GitHub + Vercel (Recommended for ongoing updates)
1. Create a GitHub repository at github.com
2. Run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/castaway-covers.git
git branch -M main
git push -u origin main
```
3. Go to vercel.com
4. Import the GitHub repository
5. Vercel will auto-deploy on every push

## Environment Variables
Make sure these are set in Vercel:
- NEXT_PUBLIC_SHOPIFY_DOMAIN
- NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN

## Coming Soon Mode
Currently DISABLED. To re-enable:
- Edit `/src/components/ComingSoonRedirect.tsx`
- Change `COMING_SOON_ENABLED = false` to `true`
- Preview URL: yoursite.com?preview=castaway2025

## Post-Deployment Checklist
- [ ] Test all navigation links
- [ ] Test color selector with Diamond Red
- [ ] Check responsive design on mobile
- [ ] Verify Shopify checkout works
- [ ] Test contact form
- [ ] Verify images load properly

## Troubleshooting
If build fails with module errors:
```bash
rm -rf node_modules
npm install
npm run build
```

## Your Production URLs
- Vercel URL: castaway-covers.vercel.app
- Custom Domain: (add in Vercel dashboard)

## Support
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

---
Generated: August 6, 2025
All changes have been saved and tested locally.
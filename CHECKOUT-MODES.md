# Checkout Modes

Your Castaway Covers website now supports two checkout modes that you can switch between easily.

## Current Mode: Manual Checkout

**Status:** Active (while on Shopify $10/month development plan)

### How It Works:
1. Customers design their cover and see pricing
2. They add items to cart and see full breakdown
3. They click **"Place Order"** button
4. A form appears asking for:
   - Name (required)
   - Email (required)
   - Phone (optional)
   - Notes (optional)
5. Customer submits order
6. **You receive order details** via server console logs
7. **Customer receives confirmation** message
8. You manually send them a Stripe invoice
9. Customer pays invoice
10. You fulfill the order

### Where Order Details Appear:
Currently, order details are logged to the server console. When you run `npm run dev` locally, you'll see them in your terminal.

**To receive orders via email instead:**
- Set up an email service (SendGrid, Resend, or Nodemailer)
- See instructions in `/src/app/api/submit-order/route.ts`
- Uncomment the email sending code and add your API keys

---

## Future Mode: Full Shopify Checkout

**Status:** Inactive (will activate when you upgrade to Shopify $40/month plan)

### How It Works:
1. Customers design their cover and see pricing
2. They add items to cart
3. They click **"Proceed to Checkout"** button
4. They're redirected to Shopify's secure checkout
5. They pay immediately with credit card
6. Order automatically appears in your Shopify dashboard
7. You fulfill the order through Shopify

---

## How to Switch Modes

### To Switch to Full Shopify Checkout (After Upgrading to $40/month):

1. Open `/Users/kristenboardman/Desktop/Castaway-Covers/.env.local`
2. Change this line:
   ```
   NEXT_PUBLIC_MANUAL_CHECKOUT=true
   ```
   to:
   ```
   NEXT_PUBLIC_MANUAL_CHECKOUT=false
   ```
3. Save the file
4. Restart your development server or redeploy to Vercel
5. Done! Checkout button will now use Shopify

### To Switch Back to Manual Mode:

1. Change `NEXT_PUBLIC_MANUAL_CHECKOUT=false` back to `true`
2. Save and restart/redeploy

---

## Important Notes

- **All Shopify configuration is preserved** - products, variants, SKUs, everything stays intact
- **No code changes needed** - just toggle the environment variable
- **Cart functionality works in both modes** - calculator, add-ons, measurements all work the same
- **Order details are identical** - same information captured regardless of mode

---

## Email Setup (Optional)

To receive order notifications via email instead of console logs:

### Option 1: SendGrid (Recommended)
1. Sign up at https://sendgrid.com
2. Get your API key
3. Add to `.env.local`: `SENDGRID_API_KEY=your_key_here`
4. Uncomment SendGrid code in `/src/app/api/submit-order/route.ts`

### Option 2: Resend (Simpler, newer)
1. Sign up at https://resend.com
2. Get your API key
3. Install: `npm install resend`
4. Add code to send emails via Resend API

### Option 3: Nodemailer (Use your existing email)
1. Install: `npm install nodemailer`
2. Configure with your Gmail/Outlook SMTP settings
3. Send emails through your existing business email

---

## Questions?

- Need help setting up email? Let me know!
- Want to customize the order confirmation message? Edit `/src/app/api/submit-order/route.ts`
- Want to change button text? Edit `/src/app/cart/page.tsx`

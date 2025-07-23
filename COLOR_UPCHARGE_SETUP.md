# Setting Up Color Upcharge Product in Shopify

Follow these steps to create the color upcharge product in your Shopify admin:

## Step 1: Create Color Upcharge Product in Shopify Admin

1. Log in to your Shopify admin at: https://uhrtqs-jx.myshopify.com/admin

2. Go to **Products** → **Add product**

3. Create the following product:

### Premium Color Upcharge
- **Title**: Premium Color Upcharge (Per Yard)
- **Description**: Additional charge for premium color selections - $4 per yard
- **Product type**: Add-On
- **Vendor**: Castaway Covers
- **Price**: $4.00
- **SKU**: ADDON-COLOR-UPCHARGE
- **Track quantity**: Uncheck (it's a service)
- **Shipping**: Uncheck "This is a physical product"
- **Status**: Active

## Step 2: Get the Variant ID

After creating the product, run this command in your terminal:

```bash
cd ~/Desktop/Castaway-Covers
node find-color-upcharge-variant.js
```

## Step 3: Update Environment Variables

Add the variant ID to your `.env.local` file:

```
COLOR_UPCHARGE_VARIANT_ID="your_color_upcharge_variant_id_here"
NEXT_PUBLIC_COLOR_UPCHARGE_VARIANT_ID="your_color_upcharge_variant_id_here"
```

## Step 4: Restart Your Development Server

After updating the environment variables:

```bash
npm run dev
```

## Notes

- The color upcharge is $4 per yard
- The upcharge will appear as a separate line item with quantity equal to the number of yards
- For example: 5 yards of premium color = 5 × $4 = $20 upcharge
- This ensures the checkout total matches the expected price
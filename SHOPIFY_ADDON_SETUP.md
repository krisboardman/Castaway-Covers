# Setting Up Add-On Products in Shopify

Follow these steps to create the add-on products in your Shopify admin:

## Step 1: Create Add-On Products in Shopify Admin

1. Log in to your Shopify admin at: https://uhrtqs-jx.myshopify.com/admin

2. Go to **Products** → **Add product**

3. Create three separate products:

### Product 1: Snap Straps Add-On
- **Title**: Snap Straps Add-On
- **Description**: Professional snap straps installation for your custom cover
- **Product type**: Add-On
- **Vendor**: Castaway Covers
- **Price**: $20.00
- **SKU**: ADDON-SNAP-STRAPS
- **Track quantity**: Uncheck (it's a service)
- **Shipping**: Uncheck "This is a physical product"
- **Status**: Active

### Product 2: Handles Add-On
- **Title**: Handles Add-On
- **Description**: Durable handles for easy cover removal and installation
- **Product type**: Add-On
- **Vendor**: Castaway Covers
- **Price**: $20.00
- **SKU**: ADDON-HANDLES
- **Track quantity**: Uncheck (it's a service)
- **Shipping**: Uncheck "This is a physical product"
- **Status**: Active

### Product 3: Magnetic Closure Add-On
- **Title**: Magnetic Closure Add-On
- **Description**: Magnetic closure system for secure and easy cover attachment
- **Product type**: Add-On
- **Vendor**: Castaway Covers
- **Price**: $20.00
- **SKU**: ADDON-MAGNETS
- **Track quantity**: Uncheck (it's a service)
- **Shipping**: Uncheck "This is a physical product"
- **Status**: Active

## Step 2: Get the Variant IDs

After creating the products, you need to get their variant IDs. Run this command in your terminal:

```bash
cd ~/Desktop/Castaway-Covers
node find-addon-variants.js
```

This will display the variant IDs for all add-on products.

## Step 3: Update Environment Variables

Add the variant IDs to your `.env.local` file:

```
NEXT_PUBLIC_SNAP_STRAPS_VARIANT_ID=your_snap_straps_variant_id_here
NEXT_PUBLIC_HANDLES_VARIANT_ID=your_handles_variant_id_here  
NEXT_PUBLIC_MAGNETS_VARIANT_ID=your_magnets_variant_id_here
```

## Step 4: Restart Your Development Server

After updating the environment variables:

```bash
npm run dev
```

## Step 5: Test the Checkout

1. Add a product to your cart
2. Select some add-ons (handles, straps, etc.)
3. Proceed to checkout
4. Verify that:
   - Add-on items appear as separate line items
   - The total includes all add-on costs
   - Each add-on shows which cover it's for

## Troubleshooting

If add-ons don't appear in checkout:
1. Check that the variant IDs are correct in `.env.local`
2. Ensure the add-on products are set to "Active" in Shopify
3. Check the browser console for any errors
4. Try clearing your browser cache

## Optional: Hide Add-On Products from Store

Since customers shouldn't buy add-ons separately:

1. Go to **Online Store** → **Navigation**
2. Edit your product collections
3. Create a collection that excludes products with type "Add-On"
4. Or use the Shopify Search & Discovery app to hide them from search

## Notes

- Add-ons are charged per cover (if quantity is 2, add-ons cost $40)
- The add-on products won't need inventory tracking
- They're marked as non-physical products (no shipping needed)
- Customers will see them as separate line items in their order
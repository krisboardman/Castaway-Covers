# Shipping Weight Guide

## Quick Reference: Product Weights

Based on 32oz marine-grade vinyl (~2 lbs per yard) + packaging:

| Yards | Estimated Weight | Recommended Setting |
|-------|-----------------|---------------------|
| 2     | 4-5 lbs        | 5 lbs               |
| 3     | 6-7 lbs        | 7 lbs               |
| 4     | 8-9 lbs        | 9 lbs               |
| 5     | 10-11 lbs      | 11 lbs              |
| 6     | 12-13 lbs      | 13 lbs              |
| 7     | 14-15 lbs      | 15 lbs              |
| 8     | 16-17 lbs      | 17 lbs              |
| 10    | 20-21 lbs      | 21 lbs              |

## How to Check Weights in Shopify

### Method 1: Check Individual Products
1. Go to **Shopify Admin** → **Products**
2. Click on any product (e.g., "Chair Cover - 4 yards")
3. Scroll to **"Variants"** section
4. Look at the **"Weight"** column
5. If blank or "0" - weights need to be set!

### Method 2: Export & Check in Bulk
1. **Shopify Admin** → **Products** → **Export**
2. Download CSV file
3. Open in Excel/Google Sheets
4. Check the **"Variant Weight"** and **"Variant Weight Unit"** columns

## How to Set Weights

### Option 1: Set Individual Product Weights
1. **Shopify Admin** → **Products**
2. Click product to edit
3. Under **Variants**, click **Edit** on each variant
4. Set **Weight** (use table above)
5. Set **Weight unit** to "lb"
6. Click **Save**

### Option 2: Bulk Update via CSV
1. **Export** all products (Products → Export)
2. Open CSV in spreadsheet software
3. Find **"Variant Weight"** column
4. Add weights based on yard count (use table above)
5. Make sure **"Variant Weight Unit"** = "lb"
6. **Save** CSV
7. **Import** back (Products → Import)

## Why Accurate Weights Matter

✅ **Accurate Shipping Costs**: Customers see correct shipping at checkout
✅ **Better Carrier Selection**: Shopify chooses the right carrier (USPS/UPS/FedEx)
✅ **Customer Satisfaction**: No surprise shipping costs
✅ **Reduced Cart Abandonment**: Transparent pricing builds trust

❌ **Without Weights**:
- Shopify uses default/estimated rates
- May overcharge or undercharge shipping
- Could lose money on heavy orders
- Customers may abandon cart if shipping seems too high

## Calculation Formula

**Base Material**: 32oz vinyl ≈ 2 lbs per yard
**Packaging**: +0.5 lbs (box, tape, label)
**Add-ons**: Snap straps, handles, magnets add ~0.2 lbs each

**Formula**: `Weight = (Yards × 2) + 0.5 lbs`

Example for 4-yard cover:
- Material: 4 yards × 2 lbs = 8 lbs
- Packaging: +0.5 lbs
- **Total: 8.5 lbs** (round to 9 lbs for safety)

## Shipping Zones in Shopify

Make sure you've configured shipping zones in Shopify Admin:

1. **Settings** → **Shipping and delivery**
2. Set up shipping zones:
   - **Domestic** (Continental US)
   - **Alaska & Hawaii** (higher rates)
   - **International** (if applicable)
3. Add shipping rates:
   - Weight-based rates
   - Price-based rates
   - Or use carrier-calculated rates

## Recommended Shopify Shipping Setup

### For Small Orders (2-4 yards):
- USPS Priority Mail (2-3 days)
- Weight: 5-9 lbs
- Typical cost: $10-$15

### For Medium Orders (5-7 yards):
- USPS Priority Mail or UPS Ground
- Weight: 11-15 lbs
- Typical cost: $15-$25

### For Large Orders (8+ yards):
- UPS Ground or FedEx Ground
- Weight: 17+ lbs
- Typical cost: $20-$35

## Free Shipping Threshold (Optional)

Consider offering free shipping on orders over a certain amount:

Example: Free shipping on orders $500+
- Set in Shopify → Settings → Shipping → Add rate
- Type: "Free Shipping"
- Conditions: Order total > $500

## Testing Shipping Rates

1. Go to your live site
2. Add a product to cart
3. Go to checkout (use test mode)
4. Enter a shipping address
5. Verify shipping rates look correct
6. Adjust weights in Shopify if needed

## Notes

- Update weights if you change materials or packaging
- Consider seasonal variations (holiday packaging may be heavier)
- Weigh actual finished products to verify estimates
- Keep track of actual shipping costs vs. charged amounts
- Adjust rates periodically based on real data

## Quick Commands

**Check if weights are set** (requires Shopify Admin access):
```bash
node check-product-weights.js
```

This will show which products have weights and which don't.

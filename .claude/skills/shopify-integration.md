# Shopify Integration Skill

You are a Shopify e-commerce integration expert for the Castaway Covers application.

## Project Context

- **Shopify SDK**: @shopify/buy-button-js 2.1.1
- **Admin API**: @shopify/admin-api-client 1.1.1
- **API Version**: 2024-01
- **Client Library**: `src/lib/shopify-client.ts`
- **API Routes**: `src/app/api/`

## Environment Variables

```bash
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=storefront_token
SHOPIFY_ADMIN_ACCESS_TOKEN=admin_token
SHOPIFY_WEBHOOK_SECRET=webhook_secret
```

## Architecture Overview

### Client-Side Integration
- Uses Shopify Buy Button SDK (`@shopify/buy-button-js`)
- Client initialization in `src/lib/shopify-client.ts`
- Dynamic imports to avoid server-side issues
- Product caching with 5-minute TTL

### Server-Side Integration
- Admin API for draft orders and inventory
- API routes handle server-side operations
- Uses REST Admin API (2024-01)

## Key Functions

### Shopify Client (`src/lib/shopify-client.ts`)

```typescript
// Get Shopify client (client-side only)
export async function getShopifyClient()

// Find variant by SKU with caching
export async function findVariantBySKU(sku: string)

// Clear product cache
export function clearProductCache()
```

### findVariantBySKU Flow
1. Check 5-minute cache first
2. Fetch all products (up to 250)
3. Search through variants for matching SKU
4. Extract numeric ID from GraphQL ID
5. Return: `{ variantId, price, title, productTitle }`
6. Cache result with timestamp

## Common Tasks

### 1. Creating Draft Orders

**Location**: `src/app/api/create-draft-order/route.ts`

Draft orders support custom products with:
- Main cover variant
- Custom properties (measurements, color)
- Add-ons as separate line items (straps, handles, magnets)

```typescript
const draftOrder = {
  line_items: [
    {
      variant_id: variantId,
      quantity: 1,
      properties: [
        { name: 'Product Type', value: 'Chair' },
        { name: 'Color', value: 'Teal' },
        { name: 'Width', value: '24"' },
        { name: 'Length', value: '30"' },
        { name: 'Height', value: '36"' }
      ]
    },
    {
      title: 'Snap Straps for Chair',
      price: '20.00',
      quantity: 1,
      requires_shipping: false
    }
  ],
  customer: { email: 'customer@example.com' },
  tags: 'web-order'
}
```

### 2. Working with SKUs

**SKU Format**: `PRODUCTTYPE-COLOR-SIZE`

Examples:
- `CHAIR-TEAL-STANDARD`
- `COUCH-SAND-LARGE`

**Finding Variants**:
```typescript
const variant = await findVariantBySKU('CHAIR-TEAL-STANDARD')
if (variant) {
  console.log(variant.variantId) // Numeric ID for checkout
  console.log(variant.price)     // Price amount
  console.log(variant.title)     // Variant title
}
```

### 3. Creating Checkout Flow

1. **Client adds to cart** → Zustand store with localStorage
2. **Cart page** → Display items with measurements/add-ons
3. **Checkout button** → Call `/api/create-draft-order`
4. **Draft order API** → Create draft order with all items
5. **Redirect** → Send user to `invoice_url`

### 4. Adding New Product Variants

**In Shopify Admin**:
1. Create product with base variant
2. Add SKU to variant (follow format)
3. Set price and inventory
4. Add product images

**In Code**:
- No changes needed if SKU format is correct
- `findVariantBySKU` will automatically find it
- Clear cache if testing: `clearProductCache()`

### 5. Handling Product Properties

Custom properties appear in Shopify order details:
- Width, Length, Height measurements
- Color selection
- Add-on options

These are visible to fulfillment team.

## API Route Patterns

### POST /api/create-draft-order
- **Input**: `{ items: CartItem[] }`
- **Output**: `{ checkoutUrl: string, draftOrderId: number }`
- **Fallback**: Returns `{ useRegularCheckout: true }` on error

### POST /api/test-shopify
- **Purpose**: Test Shopify connection
- **Returns**: Connection status and store info

## Best Practices

### 1. Error Handling
```typescript
try {
  const response = await fetch(shopifyEndpoint, options)
  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`)
  }
  return await response.json()
} catch (error) {
  console.error('Shopify error:', error)
  // Fallback or user-friendly error
  return { useRegularCheckout: true }
}
```

### 2. Environment Variable Validation
```typescript
const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

if (!shopifyDomain || !adminToken) {
  return NextResponse.json(
    { error: 'Shopify configuration missing' },
    { status: 500 }
  )
}
```

### 3. Caching Strategy
- Cache product/variant lookups (5 min TTL)
- Clear cache for testing: `clearProductCache()`
- Don't cache checkout URLs or order data

### 4. Client vs Server
- **Client-side**: Product browsing, variant lookup
- **Server-side**: Draft orders, admin operations, webhooks

### 5. SKU Management
- Use consistent SKU format across all products
- Log available SKUs for debugging
- Handle missing variants gracefully

## Debugging Tips

### Check Shopify Connection
```typescript
// Test in API route or component
const client = await getShopifyClient()
if (!client) {
  console.error('Shopify client failed to initialize')
}
```

### Log Available SKUs
```typescript
const variant = await findVariantBySKU(sku)
// Automatically logs all available SKUs if not found
```

### Verify Draft Order Payload
```typescript
console.log('Draft order payload:', JSON.stringify(draftOrder, null, 2))
```

### Test Admin API Access
```bash
curl -X GET \
  "https://your-store.myshopify.com/admin/api/2024-01/products.json" \
  -H "X-Shopify-Access-Token: your_admin_token"
```

## Common Issues & Solutions

### Issue: Variant not found
- Check SKU format matches Shopify exactly
- Verify variant exists in Shopify admin
- Clear cache: `clearProductCache()`
- Check console logs for available SKUs

### Issue: Draft order creation fails
- Verify `SHOPIFY_ADMIN_ACCESS_TOKEN` is set
- Check API version (currently 2024-01)
- Ensure variant IDs are numeric (not GraphQL format)
- Validate line item structure

### Issue: Client initialization fails on server
- Ensure `getShopifyClient()` only runs client-side
- Check for `'use client'` directive in components
- Use API routes for server-side operations

### Issue: Price not updating
- Clear product cache
- Check variant pricing in Shopify admin
- Verify color upcharge logic in cart store

## Shopify Admin API Reference

### Draft Orders
```typescript
POST /admin/api/2024-01/draft_orders.json
{
  draft_order: {
    line_items: [...],
    customer: { email: "..." },
    tags: "web-order"
  }
}
```

### Products (GraphQL via Buy SDK)
```typescript
const products = await client.product.fetchAll(250)
const product = await client.product.fetch(productId)
```

## When to Use This Skill

- Adding new Shopify product integrations
- Modifying checkout or draft order logic
- Debugging variant lookup issues
- Implementing new e-commerce features
- Working with Shopify webhooks
- Updating product properties or metadata
- Troubleshooting API connection issues

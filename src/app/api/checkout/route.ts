import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { items, cartNote } = await request.json();
    const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    
    if (!shopifyDomain) {
      return NextResponse.json({ error: 'Shopify domain not configured' }, { status: 500 });
    }
    
    // Create checkout using Shopify Storefront API
    const checkoutInput = {
      lineItems: items.map((item: any) => ({
        variantId: `gid://shopify/ProductVariant/${item.coverVariantId}`,
        quantity: item.quantity,
        customAttributes: [
          { key: 'Product Type', value: item.productType },
          { key: 'SKU', value: item.coverSKU },
          { key: 'Color', value: item.selectedColor },
          { key: 'Width', value: String(item.measurements?.width || 0) },
          { key: 'Length', value: String(item.measurements?.length || 0) },
          { key: 'Height', value: String(item.measurements?.height || 0) },
          { key: 'Snap Straps', value: item.snapStraps ? 'Yes' : 'No' },
          { key: 'Handles', value: item.handles ? 'Yes' : 'No' },
          { key: 'Magnetic Closure', value: item.magnets ? 'Yes' : 'No' }
        ]
      })),
      note: cartNote
    };
    
    const graphqlQuery = `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
          }
          checkoutUserErrors {
            field
            message
          }
        }
      }
    `;
    
    const response = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { input: checkoutInput }
      })
    });
    
    const data = await response.json();
    
    if (data.data?.checkoutCreate?.checkout?.webUrl) {
      return NextResponse.json({ 
        checkoutUrl: data.data.checkoutCreate.checkout.webUrl 
      });
    }
    
    // Fallback to cart permalink
    const cartItems = items.map((item: any) => `${item.coverVariantId}:${item.quantity}`).join(',');
    const encodedNote = encodeURIComponent(cartNote);
    const cartUrl = `https://${shopifyDomain}/cart/${cartItems}?note=${encodedNote}`;
    
    return NextResponse.json({ checkoutUrl: cartUrl });
    
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
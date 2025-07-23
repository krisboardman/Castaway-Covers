import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();
    const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    
    if (!shopifyDomain || !storefrontToken) {
      return NextResponse.json({ error: 'Shopify configuration missing' }, { status: 500 });
    }
    
    // Build line items with all properties
    const lineItems = items.map((item: any) => ({
      variantId: `gid://shopify/ProductVariant/${item.coverVariantId}`,
      quantity: item.quantity,
      customAttributes: [
        { key: 'Product Type', value: item.productType },
        { key: 'SKU', value: item.coverSKU },
        { key: 'Color', value: item.selectedColor },
        { key: 'Width', value: `${item.measurements?.width || 0}"` },
        { key: 'Length', value: `${item.measurements?.length || 0}"` },
        { key: 'Height', value: `${item.measurements?.height || 0}"` },
        { key: 'Backrest Depth', value: `${item.measurements?.backrestDepth || 0}"` },
        { key: 'Armrest Height', value: `${item.measurements?.armrestHeight || 0}"` },
        { key: 'Angle', value: `${item.angle || 0}°` },
        { key: 'Yards', value: String(item.yards) },
        { key: 'Snap Straps', value: item.snapStraps ? 'Yes' : 'No' },
        { key: 'Handles', value: item.handles ? 'Yes' : 'No' },
        { key: 'Magnetic Closure', value: item.magnets ? 'Yes' : 'No' },
        { key: 'Premium Color Charge', value: `$${item.premiumColorCharge}` },
        { key: 'Item Total', value: `$${item.total.toFixed(2)}` }
      ].filter(attr => attr.value && attr.value !== '0' && attr.value !== '$0')
    }));
    
    // Create checkout using Storefront API
    const mutation = `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
          }
          checkoutUserErrors {
            field
            message
            code
          }
        }
      }
    `;
    
    const variables = {
      input: {
        lineItems: lineItems,
        allowPartialAddresses: true,
        shippingAddress: {
          countryCode: "US"
        }
      }
    };
    
    console.log('Creating checkout with line items:', JSON.stringify(lineItems, null, 2));
    
    const response = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken
      },
      body: JSON.stringify({ query: mutation, variables })
    });
    
    const data = await response.json();
    console.log('Shopify response:', JSON.stringify(data, null, 2));
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return NextResponse.json({ error: 'Failed to create checkout', details: data.errors }, { status: 500 });
    }
    
    if (data.data?.checkoutCreate?.checkoutUserErrors?.length > 0) {
      console.error('Checkout errors:', data.data.checkoutCreate.checkoutUserErrors);
      return NextResponse.json({ 
        error: 'Checkout creation failed', 
        details: data.data.checkoutCreate.checkoutUserErrors 
      }, { status: 400 });
    }
    
    if (data.data?.checkoutCreate?.checkout?.webUrl) {
      return NextResponse.json({ 
        checkoutUrl: data.data.checkoutCreate.checkout.webUrl,
        checkoutId: data.data.checkoutCreate.checkout.id
      });
    }
    
    return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 });
    
  } catch (error) {
    console.error('Create checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
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
    const allLineItems = [];

    // Add cover items and their add-ons
    items.forEach((item: any) => {
      
      // Main cover item
      allLineItems.push({
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
          { key: 'Yards', value: String(item.yards) },
          item.isPremiumColor && item.premiumColorCharge > 0 ? { key: 'Premium Color Charge', value: `$${item.premiumColorCharge.toFixed(2)}` } : null
        ].filter(attr => attr && attr.value && attr.value !== '0')
      });
      
      // Check if we have specific variant IDs for add-ons
      const ADD_ON_VARIANT_IDS = {
        snapStraps: process.env.SNAP_STRAPS_VARIANT_ID,
        handles: process.env.HANDLES_VARIANT_ID,
        magnets: process.env.MAGNETS_VARIANT_ID,
        colorUpcharge: process.env.COLOR_UPCHARGE_VARIANT_ID
      };

      // Add snap straps if selected
      if (item.snapStraps && ADD_ON_VARIANT_IDS.snapStraps) {
        allLineItems.push({
          variantId: `gid://shopify/ProductVariant/${ADD_ON_VARIANT_IDS.snapStraps}`,
          quantity: item.quantity,
          customAttributes: [
            { key: 'For', value: `${item.productType} - ${item.selectedColor}` }
          ]
        });
      }
      
      // Add handles if selected
      if (item.handles && ADD_ON_VARIANT_IDS.handles) {
        allLineItems.push({
          variantId: `gid://shopify/ProductVariant/${ADD_ON_VARIANT_IDS.handles}`,
          quantity: item.quantity,
          customAttributes: [
            { key: 'For', value: `${item.productType} - ${item.selectedColor}` }
          ]
        });
      }
      
      // Add magnetic closure if selected
      if (item.magnets && ADD_ON_VARIANT_IDS.magnets) {
        allLineItems.push({
          variantId: `gid://shopify/ProductVariant/${ADD_ON_VARIANT_IDS.magnets}`,
          quantity: item.quantity,
          customAttributes: [
            { key: 'For', value: `${item.productType} - ${item.selectedColor}` }
          ]
        });
      }
      
      // Add color upcharge if premium color is selected
      if (item.isPremiumColor && item.premiumColorCharge > 0 && ADD_ON_VARIANT_IDS.colorUpcharge) {
        // Quantity is the number of yards (since it's $4 per yard)
        const colorQuantity = item.yards * item.quantity;
        allLineItems.push({
          variantId: `gid://shopify/ProductVariant/${ADD_ON_VARIANT_IDS.colorUpcharge}`,
          quantity: colorQuantity,
          customAttributes: [
            { key: 'For', value: `${item.productType} - ${item.selectedColor}` },
            { key: 'Details', value: `${item.yards} yards × ${item.quantity} qty × $4/yard` }
          ]
        });
      }
    });
    
    const lineItems = allLineItems;
    
    // Create cart using Storefront API (Checkout API is deprecated)
    const mutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `;
    
    // Create a note with all the options and total for visibility
    let grandTotal = 0;
    const orderDetails = items.map((item: any, index: number) => {
      const options = [];
      let addOnCost = 0;
      
      if (item.snapStraps) {
        options.push('Snap Straps (+$20)');
        addOnCost += 20 * item.quantity;
      }
      if (item.handles) {
        options.push('Handles (+$20)');
        addOnCost += 20 * item.quantity;
      }
      if (item.magnets) {
        options.push('Split Cover with Snaps (+$35)');
        addOnCost += 35 * item.quantity;
      }
      
      grandTotal += item.total;
      
      const lines = [
        `Item ${index + 1}: ${item.productType} - ${item.selectedColor}`,
        `Quantity: ${item.quantity}`,
        `Base Price: $${(item.coverPrice * item.quantity).toFixed(2)}`,
        `Angle: ${item.angle || 0}°`,
        item.isPremiumColor && item.premiumColorCharge > 0 ? `Premium Color Charge: +$${item.premiumColorCharge.toFixed(2)} (${item.selectedColor} - $4/yard × ${item.yards} yards × ${item.quantity} qty)` : null,
        options.length > 0 ? `Add-ons: ${options.join(', ')}` : null,
        `Item Subtotal: $${item.total.toFixed(2)}`
      ].filter(Boolean);
      
      return lines.join('\n');
    }).join('\n---\n');
    
    const orderNote = `${orderDetails}\n\n===========================\nORDER TOTAL: $${grandTotal.toFixed(2)}\n===========================\n\nAll charges including premium colors and add-ons are included as separate line items.`;

    const variables = {
      input: {
        lines: lineItems.map(item => ({
          merchandiseId: item.variantId,
          quantity: item.quantity,
          attributes: item.customAttributes
        })),
        note: orderNote || undefined,
        buyerIdentity: {
          countryCode: "US"
        }
      }
    };

    const response = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken
      },
      body: JSON.stringify({ query: mutation, variables })
    });

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json({ error: 'Failed to create checkout', details: data.errors }, { status: 500 });
    }

    if (data.data?.cartCreate?.userErrors?.length > 0) {
      return NextResponse.json({ 
        error: 'Cart creation failed', 
        details: data.data.cartCreate.userErrors 
      }, { status: 400 });
    }
    
    if (data.data?.cartCreate?.cart?.checkoutUrl) {
      return NextResponse.json({ 
        checkoutUrl: data.data.cartCreate.cart.checkoutUrl,
        cartId: data.data.cartCreate.cart.id
      });
    }
    
    return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
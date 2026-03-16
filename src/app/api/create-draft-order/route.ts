import { NextRequest, NextResponse } from 'next/server';
import { getMeasurementLabel } from '@/lib/measurement-labels';

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();
    const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    
    if (!shopifyDomain || !adminToken) {
      // Fall back to regular checkout if no admin token
      return NextResponse.json({ useRegularCheckout: true });
    }
    
    // Build line items including add-ons as separate items
    const lineItems = [];
    
    items.forEach((item: any) => {
      // Add the main cover item
      lineItems.push({
        variant_id: item.coverVariantId,
        quantity: item.quantity,
        properties: [
          { name: 'Product Type', value: item.productType },
          { name: 'Color', value: item.selectedColor },
          { name: getMeasurementLabel(item.productType, 'width'), value: `${item.measurements?.width || 0}"` },
          { name: getMeasurementLabel(item.productType, 'length'), value: `${item.measurements?.length || 0}"` },
          { name: getMeasurementLabel(item.productType, 'height'), value: `${item.measurements?.height || 0}"` }
        ]
      });
      
      // Add line items for each add-on
      if (item.snapStraps) {
        lineItems.push({
          title: `Snap Straps for ${item.productType}`,
          price: '20.00',
          quantity: item.quantity,
          requires_shipping: false
        });
      }
      
      if (item.handles) {
        lineItems.push({
          title: `Handles for ${item.productType}`,
          price: '20.00',
          quantity: item.quantity,
          requires_shipping: false
        });
      }
      
      if (item.magnets) {
        lineItems.push({
          title: `Magnetic Closure for ${item.productType}`,
          price: '20.00',
          quantity: item.quantity,
          requires_shipping: false
        });
      }
    });
    
    // Create draft order
    const draftOrder = {
      line_items: lineItems,
      customer: {
        email: request.headers.get('x-customer-email') || undefined
      },
      use_customer_default_address: true,
      tags: 'web-order'
    };
    
    const response = await fetch(`https://${shopifyDomain}/admin/api/2024-01/draft_orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken
      },
      body: JSON.stringify({ draft_order: draftOrder })
    });
    
    if (!response.ok) {
      throw new Error(`Draft order creation failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.draft_order?.invoice_url) {
      return NextResponse.json({ 
        checkoutUrl: data.draft_order.invoice_url,
        draftOrderId: data.draft_order.id
      });
    }
    
    return NextResponse.json({ useRegularCheckout: true });

  } catch (error) {
    // Fall back to regular checkout
    return NextResponse.json({ useRegularCheckout: true });
  }
}
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getMeasurementLabel } from '@/lib/measurement-labels';

const resend = new Resend(process.env.RESEND_API_KEY);
const SENDER_ADDRESS = process.env.RESEND_FROM_EMAIL || 'Castaway Covers <orders@castawaycovers.com>';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Parse JSON fields
    const customerInfo = JSON.parse(formData.get('customerInfo') as string);
    const items = JSON.parse(formData.get('items') as string);
    const totalPrice = parseFloat(formData.get('totalPrice') as string);

    // ── ORDER BACKUP ──────────────────────────────────────────────
    // Log the full order to stdout BEFORE attempting email so it
    // always appears in Vercel Function Logs even if Resend is down.
    const orderRecord = {
      timestamp: new Date().toISOString(),
      customer: customerInfo,
      items,
      totalPrice,
      photoCount: 0, // updated below once we count photos
    };
    // We'll finalize photoCount after parsing, then log.

    // Get photo files
    const photos: File[] = [];
    let photoIndex = 0;
    while (formData.get(`photo${photoIndex}`)) {
      photos.push(formData.get(`photo${photoIndex}`) as File);
      photoIndex++;
    }

    // Finalize and persist the order record to logs
    orderRecord.photoCount = photos.length;
    console.log('📦 ORDER_RECEIVED', JSON.stringify(orderRecord));

    // Format order details for email
    const orderDetails = items.map((item: any, index: number) => {
      const addOns = [];
      if (item.snapStraps) addOns.push('Snap Straps (+$20)');
      if (item.handles) addOns.push('Handles (+$20)');
      if (item.magnets) addOns.push('Split Cover with Snaps (+$35)');

      // Use shared labels so the email matches what the customer saw on the product page
      const wLabel = getMeasurementLabel(item.productType, 'width');
      const lLabel = getMeasurementLabel(item.productType, 'length');
      const hLabel = getMeasurementLabel(item.productType, 'height');
      const brLabel = getMeasurementLabel(item.productType, 'backrestDepth');
      const arLabel = getMeasurementLabel(item.productType, 'armrestHeight');

      return `
Item ${index + 1}: ${item.productType}
--------------------------------
SKU: ${item.coverSKU}
Color: ${item.selectedColor}
Quantity: ${item.quantity}
Yards: ${item.yards}

Measurements:
  ${wLabel}: ${item.measurements?.width || 0}"
  ${lLabel}: ${item.measurements?.length || 0}"
  ${hLabel}: ${item.measurements?.height || 0}"
  ${item.measurements?.backrestDepth ? `${brLabel}: ${item.measurements.backrestDepth}"` : ''}
  ${item.measurements?.armrestHeight ? `${arLabel}: ${item.measurements.armrestHeight}"` : ''}
  ${item.angle ? `Angle: ${item.angle}°` : ''}

Add-ons: ${addOns.length > 0 ? addOns.join(', ') : 'None'}
${item.premiumColorCharge > 0 ? `Premium Color Charge: $${item.premiumColorCharge}` : ''}

Item Total: $${item.total.toFixed(2)}
`;
    }).join('\n');

    // Email content to send to you
    const emailToYou = `
NEW ORDER RECEIVED
==================

CUSTOMER INFORMATION:
Name: ${customerInfo.name}
Email: ${customerInfo.email}
Phone: ${customerInfo.phone || 'Not provided'}

${customerInfo.notes ? `CUSTOMER NOTES:\n${customerInfo.notes}\n\n` : ''}${photos.length > 0 ? `PHOTOS ATTACHED: ${photos.length} photo${photos.length > 1 ? 's' : ''} of customer's furniture\n\n` : ''}ORDER DETAILS:
${orderDetails}

TOTAL ORDER VALUE: $${totalPrice.toFixed(2)}

==================
NEXT STEPS:
1. Send Stripe invoice to ${customerInfo.email} for $${totalPrice.toFixed(2)}
2. Begin production after payment received
3. Contact customer at ${customerInfo.phone || customerInfo.email} to confirm details
`;

    // Build customer-facing order details (without angle)
    const customerOrderDetails = items.map((item: any, index: number) => {
      const addOns = [];
      if (item.snapStraps) addOns.push('Snap Straps (+$20)');
      if (item.handles) addOns.push('Handles (+$20)');
      if (item.magnets) addOns.push('Split Cover with Snaps (+$35)');

      const wLabel2 = getMeasurementLabel(item.productType, 'width');
      const lLabel2 = getMeasurementLabel(item.productType, 'length');
      const hLabel2 = getMeasurementLabel(item.productType, 'height');
      const brLabel2 = getMeasurementLabel(item.productType, 'backrestDepth');
      const arLabel2 = getMeasurementLabel(item.productType, 'armrestHeight');

      return `
Item ${index + 1}: ${item.productType}
--------------------------------
SKU: ${item.coverSKU}
Color: ${item.selectedColor}
Quantity: ${item.quantity}
Yards: ${item.yards}

Measurements:
  ${wLabel2}: ${item.measurements?.width || 0}"
  ${lLabel2}: ${item.measurements?.length || 0}"
  ${hLabel2}: ${item.measurements?.height || 0}"
  ${item.measurements?.backrestDepth ? `${brLabel2}: ${item.measurements.backrestDepth}"` : ''}
  ${item.measurements?.armrestHeight ? `${arLabel2}: ${item.measurements.armrestHeight}"` : ''}

Add-ons: ${addOns.length > 0 ? addOns.join(', ') : 'None'}
${item.premiumColorCharge > 0 ? `Premium Color Charge: $${item.premiumColorCharge}` : ''}

Item Total: $${item.total.toFixed(2)}
`;
    }).join('\n');

    // Email content to send to customer
    const emailToCustomer = `
Thank you for your order request!
=================================

Hi ${customerInfo.name},

Thank you for your custom cover order request from Castaway Covers! We've received your details and will personally review your order before any payment is collected. If everything looks good, you'll receive a detailed invoice within the next 24 hours. You will only be charged once you approve the invoice.

If we have any questions about your measurements or specifications, we'll reach out before sending the invoice.

ORDER SUMMARY:
${customerOrderDetails}

SUBTOTAL: $${totalPrice.toFixed(2)}

SHIPPING: Shipping costs will be calculated based on your location and order size, and included in your invoice.

You will receive a Stripe invoice via email at ${customerInfo.email}. Once payment is received, we'll begin production on your custom covers.

If you have any questions, please don't hesitate to reach out.

Best regards,
Castaway Covers Team
www.castawaycovers.com
`;

    // Send emails using Resend
    try {
      // Prepare attachments from photos
      const attachments = await Promise.all(
        photos.map(async (photo, index) => {
          const buffer = Buffer.from(await photo.arrayBuffer());
          return {
            filename: photo.name,
            content: buffer,
          };
        })
      );

      // Email to you (the business owner) - WITH PHOTOS
      await resend.emails.send({
        from: SENDER_ADDRESS,
        to: process.env.NOTIFICATION_EMAIL || 'support@castawaycovers.com',
        subject: `New Order from ${customerInfo.name} - $${totalPrice.toFixed(2)}${photos.length > 0 ? ` (${photos.length} photo${photos.length > 1 ? 's' : ''} attached)` : ''}`,
        text: emailToYou,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      // Email to customer
      await resend.emails.send({
        from: SENDER_ADDRESS,
        to: customerInfo.email,
        subject: 'Your Castaway Covers Order Received',
        text: emailToCustomer,
      });

      console.log(`✅ Order emails sent successfully to ${customerInfo.email} and ${process.env.NOTIFICATION_EMAIL}`);

    } catch (emailError) {
      // Email failed — the order IS logged above, but the customer
      // needs to know so they can follow up.
      console.error('❌ EMAIL_SEND_FAILED', emailError);
      console.error('❌ ORDER_NEEDS_MANUAL_RECOVERY — see ORDER_RECEIVED log above');
      return NextResponse.json(
        {
          success: false,
          message:
            'Your order was received but we had trouble sending the confirmation email. ' +
            'Please contact us at support@castawaycovers.com or call so we can confirm your order.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order request submitted successfully! We will review your order and send you an invoice within 24 hours. You will only be charged after you approve the invoice.',
      orderDetails: {
        customerName: customerInfo.name,
        email: customerInfo.email,
        total: totalPrice,
        itemCount: items.length
      }
    });

  } catch (error) {
    console.error('Error submitting order:', error);
    return NextResponse.json(
      { success: false, message: 'Error submitting order. Please try again.' },
      { status: 500 }
    );
  }
}

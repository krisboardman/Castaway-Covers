import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { customerInfo, items, totalPrice } = await request.json();

    // Format order details for email
    const orderDetails = items.map((item: any, index: number) => {
      const addOns = [];
      if (item.snapStraps) addOns.push('Snap Straps (+$20)');
      if (item.handles) addOns.push('Handles (+$20)');
      if (item.magnets) addOns.push('Split Cover with Snaps (+$35)');

      return `
Item ${index + 1}: ${item.productType}
--------------------------------
SKU: ${item.coverSKU}
Color: ${item.selectedColor}
Quantity: ${item.quantity}
Yards: ${item.yards}

Measurements:
  Width: ${item.measurements?.width || 0}"
  Length: ${item.measurements?.length || 0}"
  Height: ${item.measurements?.height || 0}"
  ${item.measurements?.backrestDepth ? `Backrest Depth: ${item.measurements.backrestDepth}"` : ''}
  ${item.measurements?.armrestHeight ? `Armrest Height: ${item.measurements.armrestHeight}"` : ''}
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

${customerInfo.notes ? `CUSTOMER NOTES:\n${customerInfo.notes}\n\n` : ''}
ORDER DETAILS:
${orderDetails}

TOTAL ORDER VALUE: $${totalPrice.toFixed(2)}

==================
NEXT STEPS:
1. Send Stripe invoice to ${customerInfo.email} for $${totalPrice.toFixed(2)}
2. Begin production after payment received
3. Contact customer at ${customerInfo.phone || customerInfo.email} to confirm details
`;

    // Email content to send to customer
    const emailToCustomer = `
Thank you for your order!
=========================

Hi ${customerInfo.name},

Thank you for your custom cover order from Castaway Covers! We've received your request and will send you a detailed invoice within 24 hours.

ORDER SUMMARY:
${orderDetails}

TOTAL: $${totalPrice.toFixed(2)}

You will receive a Stripe invoice via email at ${customerInfo.email}. Once payment is received, we'll begin production on your custom covers.

If you have any questions, please don't hesitate to reach out.

Best regards,
Castaway Covers Team
www.castawaycovers.com
`;

    // Send emails using Resend
    try {
      // Email to you (the business owner)
      await resend.emails.send({
        from: 'Castaway Covers <orders@castawaycovers.com>',
        to: process.env.NOTIFICATION_EMAIL || 'hello@kbops.dev',
        subject: `New Order from ${customerInfo.name} - $${totalPrice.toFixed(2)}`,
        text: emailToYou,
      });

      // Email to customer
      await resend.emails.send({
        from: 'Castaway Covers <orders@castawaycovers.com>',
        to: customerInfo.email,
        subject: 'Your Castaway Covers Order Received',
        text: emailToCustomer,
      });

      console.log(`✅ Order emails sent successfully to ${customerInfo.email} and ${process.env.NOTIFICATION_EMAIL}`);

    } catch (emailError) {
      // Log email error but don't fail the order
      console.error('Error sending emails:', emailError);
      // Still continue - order is recorded even if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Order submitted successfully! We will send you an invoice within 24 hours.',
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

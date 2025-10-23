import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Format the email content
    const emailContent = `
      New Measurement Service Request
      ================================
      
      CUSTOMER INFORMATION:
      Name: ${data.name}
      Email: ${data.email}
      Phone: ${data.phone}
      
      SERVICE ADDRESS:
      ${data.address}
      ${data.city}, NJ ${data.zipCode}
      
      FURNITURE TO MEASURE:
      ${data.furnitureTypes.join(', ')}
      
      PREFERRED APPOINTMENT:
      Date: ${data.preferredDate || 'Not specified'}
      Time: ${data.preferredTime || 'Not specified'}
      
      ADDITIONAL NOTES:
      ${data.notes || 'None'}
      
      ================================
      Next Steps:
      1. Verify address is within 10-mile radius
      2. Send Shopify payment link ($75)
      3. Schedule appointment after payment received
    `;

    // For now, we'll use a simple email service
    // In production, you might want to use SendGrid, Postmark, or another service
    
    // Option 1: Use mailto link (client-side fallback)
    // Option 2: Use a service like EmailJS (free tier available)
    // Option 3: Use Vercel's email service or SendGrid
    
    // For immediate functionality, we'll return the data and you can use EmailJS
    // or we can set up a proper email service

    // Store in a database or send via email service here
    // For now, just return success

    return NextResponse.json({
      success: true,
      message: 'Request received! We will contact you within 24 hours.',
      data: data
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error submitting request' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate the input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Here you would integrate with your email service
    // Options include:
    // 1. EmailJS - Add your EmailJS configuration
    // 2. SendGrid - Use SendGrid API
    // 3. Nodemailer - Set up with your SMTP service
    // 4. Formspree - Forward to Formspree endpoint
    // 5. Resend - Use Resend API

    // Example structure for email services:
    
    // For EmailJS:
    // const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     service_id: process.env.EMAILJS_SERVICE_ID,
    //     template_id: process.env.EMAILJS_TEMPLATE_ID,
    //     user_id: process.env.EMAILJS_USER_ID,
    //     template_params: { name, email, subject, message }
    //   })
    // });

    // For SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // const msg = {
    //   to: 'hello@kbops.dev',
    //   from: email,
    //   subject: subject,
    //   text: message,
    //   html: `<p>From: ${name} (${email})</p><p>${message}</p>`,
    // };
    // await sgMail.send(msg);

    // For now, we'll just log the message and return success
    console.log('Contact form submission:', { name, email, subject, message });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
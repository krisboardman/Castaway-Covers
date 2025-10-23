import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Use dedicated Formspree endpoint for Coming Soon signups
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdklnpnk';
    
    // Send to Formspree (which forwards to your email)
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _subject: '🚀 New Coming Soon Signup',
        email: email,
        message: `New email signup for launch notifications`,
        signup_time: new Date().toLocaleString()
      }),
    });

    if (!response.ok) {
      // Still return success to avoid showing errors to users
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Still return success to avoid showing errors to users
    return NextResponse.json({ success: true });
  }
}
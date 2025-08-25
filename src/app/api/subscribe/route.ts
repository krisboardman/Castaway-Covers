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
    
    // Use the same Formspree endpoint that's working for your contact form
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xblkwzzr';
    
    // Send to Formspree (which forwards to your email)
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _subject: '🚀 COMING SOON SIGNUP - Castaway Covers',
        '📧 COMING SOON EMAIL SIGNUP': email,
        'Type': 'COMING SOON PAGE SIGNUP (not measurement service)',
        'Customer Email': email,
        'Signup Time': new Date().toLocaleString(),
        'Action Needed': 'Add to launch notification list'
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to send to Formspree:', response.statusText);
      // Still return success to avoid showing errors to users
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing subscription:', error);
    // Still return success to avoid showing errors to users
    return NextResponse.json({ success: true });
  }
}
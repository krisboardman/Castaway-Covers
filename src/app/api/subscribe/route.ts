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
    
    // Google Sheets webhook URL - you'll need to replace this
    const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    
    if (!GOOGLE_SHEETS_WEBHOOK_URL) {
      console.error('Google Sheets webhook URL not configured');
      // Still return success to user
      return NextResponse.json({ success: true });
    }
    
    // Send to Google Sheets
    const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        timestamp: new Date().toISOString(),
        source: 'coming-soon-page'
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to save to Google Sheets:', response.statusText);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
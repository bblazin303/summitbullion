import { NextResponse } from 'next/server';

/**
 * Newsletter subscription API route
 * Sends subscriber emails to a Google Sheet via Google Apps Script
 * 
 * Required environment variable:
 * - GOOGLE_SHEETS_WEBHOOK_URL: Your Google Apps Script web app URL
 * 
 * Setup instructions:
 * 1. Create a Google Sheet with columns: Timestamp, Email, Source, Campaign
 * 2. Go to Extensions > Apps Script
 * 3. Paste the provided script and deploy as web app
 * 4. Copy the web app URL to your .env.local
 */

interface SubscribeRequest {
  email: string;
  utm_source?: string;
  utm_campaign?: string;
}

export async function POST(request: Request) {
  try {
    const body: SubscribeRequest = await request.json();
    const { email, utm_source, utm_campaign } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('Missing Google Sheets webhook URL');
      
      // In development, log the submission anyway
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📧 Newsletter subscription (Google Sheets not configured)');
        console.log('Email:', email.toLowerCase().trim());
        console.log('Source:', utm_source || 'website');
        console.log('Campaign:', utm_campaign || 'homepage_signup');
        console.log('\nTo enable Google Sheets, add GOOGLE_SHEETS_WEBHOOK_URL to .env.local\n');
        
        // Return success in dev so you can test the UI
        return NextResponse.json({
          success: true,
          message: "You're on the list! We'll be in touch soon.",
          dev: true,
        });
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Newsletter service is not configured. Please contact support.' 
        },
        { status: 503 }
      );
    }

    // Send to Google Sheets via Apps Script webhook
    const payload = {
      email: email.toLowerCase().trim(),
      source: utm_source || 'website',
      campaign: utm_campaign || 'homepage_signup',
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Google Apps Script returns different response formats
    // We consider any 2xx or redirect as success
    if (response.ok || response.status === 302) {
      console.log('✅ New waitlist subscriber:', payload.email);
      
      return NextResponse.json({
        success: true,
        message: "You're on the list! We'll be in touch soon.",
      });
    }

    // Try to get error details
    let errorMessage = 'Failed to subscribe. Please try again.';
    try {
      const errorData = await response.text();
      console.error('Google Sheets error:', errorData);
    } catch {
      console.error('Google Sheets error - status:', response.status);
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


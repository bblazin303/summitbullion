/**
 * POST /api/test-email
 * Test endpoint to verify Resend email integration
 * 
 * Usage: POST with { "email": "your-email@example.com" }
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendTestEmail, sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, type = 'test' } = body as { email: string; type?: 'test' | 'order' };

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'RESEND_API_KEY is not configured' },
        { status: 500 }
      );
    }

    let result;

    if (type === 'order') {
      // Send a sample order confirmation email
      result = await sendOrderConfirmationEmail({
        orderId: 'TEST123456789',
        customerEmail: email,
        customerName: 'Test Customer',
        items: [
          {
            name: 'American Gold Eagle 1 oz',
            quantity: 2,
            pricing: { finalPrice: 2150.00 },
            totalPrice: 4300.00,
          },
          {
            name: 'Silver Canadian Maple Leaf 1 oz',
            quantity: 10,
            pricing: { finalPrice: 32.50 },
            totalPrice: 325.00,
          },
        ],
        subtotal: 4625.00,
        deliveryFee: 15.00,
        total: 4640.00,
        shippingAddress: {
          addressee: 'Test Customer',
          addr1: '123 Gold Street',
          addr2: 'Suite 100',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
      });
    } else {
      // Send simple test email
      result = await sendTestEmail(email);
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `${type === 'order' ? 'Order confirmation' : 'Test'} email sent to ${email}`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

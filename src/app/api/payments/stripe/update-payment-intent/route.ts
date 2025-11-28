import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { requireFlexibleAuth } from '@/lib/auth/verifyAlchemyToken';

// Processing fee rates by payment method (must match frontend and create-payment-intent)
const PROCESSING_FEES: Record<string, { percentage: number; fixed: number; cap?: number }> = {
  card: { percentage: 2.9, fixed: 0.30 },
  us_bank_account: { percentage: 0.8, fixed: 0, cap: 5.00 },
  crypto: { percentage: 1.5, fixed: 0 },
  default: { percentage: 2.9, fixed: 0.30 },
};

// Calculate processing fee based on payment method and subtotal
function calculateProcessingFee(subtotal: number, paymentMethodType: string): number {
  const fees = PROCESSING_FEES[paymentMethodType] || PROCESSING_FEES.default;
  let fee = (subtotal * fees.percentage / 100) + fees.fixed;
  
  // Apply cap for ACH payments
  if (fees.cap && fee > fees.cap) {
    fee = fees.cap;
  }
  
  return fee;
}

/**
 * POST /api/payments/stripe/update-payment-intent
 * Updates a PaymentIntent when the user changes payment method
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { 
      authType, 
      userId: bodyUserId, 
      email: bodyEmail, 
      paymentIntentId,
      paymentMethodType,
      subtotal, // Base subtotal before processing fee
    } = body as {
      authType?: 'email' | 'google';
      userId?: string;
      email?: string;
      paymentIntentId: string;
      paymentMethodType: string;
      subtotal: number;
    };
    
    // Verify authentication
    const user = await requireFlexibleAuth({ authType, userId: bodyUserId, email: bodyEmail });
    
    console.log('🔄 Updating PaymentIntent:', paymentIntentId);
    console.log('   Payment method:', paymentMethodType);
    console.log('   Subtotal:', subtotal);
    
    // Calculate new processing fee
    const processingFee = calculateProcessingFee(subtotal, paymentMethodType);
    const newTotal = subtotal + processingFee;
    
    console.log('   New processing fee:', processingFee.toFixed(2));
    console.log('   New total:', newTotal.toFixed(2));
    
    // Update the PaymentIntent with the new amount
    const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      amount: Math.round(newTotal * 100), // Convert to cents
      metadata: {
        processingFee: processingFee.toFixed(2),
        paymentMethodType: paymentMethodType,
        orderTotal: newTotal.toFixed(2),
      },
    });
    
    console.log('✅ PaymentIntent updated:', paymentIntent.id);
    
    return NextResponse.json({
      success: true,
      pricing: {
        subtotal: subtotal,
        processingFee: processingFee,
        total: newTotal,
      },
    });
    
  } catch (error) {
    console.error('❌ Error updating PaymentIntent:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update payment intent' },
      { status: 500 }
    );
  }
}


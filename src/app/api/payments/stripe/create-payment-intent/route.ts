import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { requireFlexibleAuth } from '@/lib/auth/verifyAlchemyToken';
import { getCart } from '@/lib/firebaseAdminHelpers';
import { ShippingAddress } from '@/types/user';

/**
 * POST /api/payments/stripe/create-payment-intent
 * Creates a Stripe PaymentIntent for embedded checkout
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { authType, userId: bodyUserId, email: bodyEmail, shippingAddress } = body as {
      authType?: 'email' | 'google';
      userId?: string;
      email?: string;
      shippingAddress: Partial<ShippingAddress>;
    };
    
    // Verify authentication (supports both Google OAuth and email auth)
    const user = await requireFlexibleAuth({ authType, userId: bodyUserId, email: bodyEmail });
    
    console.log('💳 Creating PaymentIntent for user:', user.userId);
    console.log('📦 Shipping address:', shippingAddress);
    
    // Get user's cart from Firebase
    const cart = await getCart(user.userId);
    
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    // Calculate total (cart subtotal + delivery fee)
    const deliveryFee = 15;
    const total = cart.subtotal + deliveryFee;
    
    console.log('💰 Total amount:', total);
    
    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true, // Enables Apple Pay, Google Pay, Link, etc.
      },
      metadata: {
        userId: user.userId,
        userEmail: user.email,
        orderTotal: total.toFixed(2),
        itemCount: cart.itemCount.toString(),
        deliveryFee: deliveryFee.toFixed(2),
        // Store shipping address as JSON string (Stripe metadata values must be strings)
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });
    
    console.log('✅ PaymentIntent created:', paymentIntent.id);
    
    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: total,
    });
    
  } catch (error) {
    console.error('❌ Error creating PaymentIntent:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}


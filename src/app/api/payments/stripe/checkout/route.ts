import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { requireAuth } from '@/lib/auth/verifyAlchemyToken';
import { getCart } from '@/lib/firebaseAdminHelpers';

/**
 * POST /api/payments/stripe/checkout
 * Creates a Stripe checkout session for the authenticated user's cart
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await requireAuth();
    
    console.log('🛒 Creating Stripe checkout for user:', user.userId);
    
    // Get user's cart from Firebase
    const cart = await getCart(user.userId);
    
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    // Convert cart items to Stripe line items
    const lineItems = cart.items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `${item.manufacturer} - ${item.sku}`,
          images: item.image ? [item.image] : [],
          metadata: {
            inventoryId: item.inventoryId.toString(),
            sku: item.sku,
            manufacturer: item.manufacturer,
            metalSymbol: item.metalSymbol || '',
            metalOz: item.metalOz?.toString() || '0',
          },
        },
        unit_amount: Math.round(item.pricing.finalPrice * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));
    
    // Calculate order total for validation
    const orderTotal = cart.subtotal;
    
    console.log('💰 Order total:', orderTotal);
    console.log('📦 Line items:', lineItems.length);
    
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout?canceled=true`,
      customer_email: user.email,
      client_reference_id: user.userId, // Link session to our user
      metadata: {
        userId: user.userId,
        userEmail: user.email,
        orderTotal: orderTotal.toFixed(2),
        itemCount: cart.itemCount.toString(),
      },
      payment_intent_data: {
        metadata: {
          userId: user.userId,
          userEmail: user.email,
        },
      },
    });
    
    console.log('✅ Stripe checkout session created:', session.id);
    
    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
    
  } catch (error) {
    console.error('❌ Error creating Stripe checkout session:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}


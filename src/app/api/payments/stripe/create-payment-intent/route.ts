import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { requireFlexibleAuth } from '@/lib/auth/verifyAlchemyToken';
import { getCart } from '@/lib/firebaseAdminHelpers';
import { ShippingAddress } from '@/types/user';
import { 
  fetchPaymentMethods, 
  fetchShippingInstructions,
  createSalesOrderQuote,
  convertToPlatformGoldAddress,
  type PlatformGoldQuoteResponse
} from '@/lib/platformGoldHelpers';

/**
 * POST /api/payments/stripe/create-payment-intent
 * Creates a Stripe PaymentIntent with dynamic pricing from Platform Gold
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
    
    // ========================================================================
    // DYNAMIC PRICING: Get Platform Gold Quote
    // ========================================================================
    console.log('📊 Fetching Platform Gold quote for accurate pricing...');
    
    let platformGoldQuote: PlatformGoldQuoteResponse;
    let deliveryFee = 0;
    
    try {
      // Fetch payment methods and shipping instructions
      const [paymentMethods, shippingInstructions] = await Promise.all([
        fetchPaymentMethods(),
        fetchShippingInstructions(),
      ]);
      
      if (!paymentMethods.length || !shippingInstructions.length) {
        throw new Error('Platform Gold configuration missing');
      }
      
      // Use first available options
      const paymentMethod = paymentMethods[0];
      const shippingInstruction = shippingInstructions[0];
      
      // Format cart items for Platform Gold
      const platformGoldItems = cart.items.map(item => ({
        id: parseInt(item.id),
        quantity: item.quantity,
      }));
      
      // Create quote request
      // Note: customerReferenceNumber must be <= 35 characters
      const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
      const userIdShort = user.userId.slice(-10); // Last 10 chars of userId
      const quoteRequest = {
        items: platformGoldItems,
        shippingAddress: convertToPlatformGoldAddress(shippingAddress),
        email: user.email,
        paymentMethodId: paymentMethod.id,
        shippingInstructionId: shippingInstruction.id,
        customerReferenceNumber: `SB-${userIdShort}-${timestamp}`, // Max 35 chars: "SB-" (3) + userId (10) + "-" (1) + timestamp (8) = 22 chars
      };
      
      // Get quote from Platform Gold
      platformGoldQuote = await createSalesOrderQuote(quoteRequest);
      
      console.log('✅ Platform Gold quote received:');
      console.log(`   Quote amount (includes item + handling): $${platformGoldQuote.amount.toFixed(2)}`);
      console.log(`   Handling fee breakdown (for info): $${platformGoldQuote.handlingFee.toFixed(2)}`);
      
      // IMPORTANT: Platform Gold's amount ALREADY includes handling fee
      // The handlingFee field is just for display/breakdown purposes
      const platformGoldTotalCost = platformGoldQuote.amount;
      console.log(`   Total Platform Gold cost: $${platformGoldTotalCost.toFixed(2)}`);
      
      // Store handling fee separately for display purposes only
      deliveryFee = platformGoldQuote.handlingFee;
      
    } catch (error) {
      console.error('❌ Error fetching Platform Gold quote:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to calculate accurate pricing. Please try again.' },
        { status: 500 }
      );
    }
    
    // ========================================================================
    // APPLY YOUR 2% MARKUP
    // ========================================================================
    // Apply 2% markup to Platform Gold's total (which already includes handling)
    const platformGoldTotal = platformGoldQuote.amount;
    const markupPercentage = 2;
    const markupAmount = platformGoldTotal * (markupPercentage / 100);
    const subtotalWithMarkup = platformGoldTotal + markupAmount;
    
    // Final total
    const total = subtotalWithMarkup;
    
    console.log('💰 Pricing breakdown:');
    console.log(`   Platform Gold total (item + handling): $${platformGoldTotal.toFixed(2)}`);
    console.log(`   Your ${markupPercentage}% markup: $${markupAmount.toFixed(2)}`);
    console.log(`   Final total: $${total.toFixed(2)}`);
    
    // ========================================================================
    // CREATE PAYMENT INTENT
    // ========================================================================
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
        platformGoldQuoteHandle: platformGoldQuote.handle,
        platformGoldAmount: platformGoldTotal.toFixed(2),
        markupAmount: markupAmount.toFixed(2),
        markupPercentage: markupPercentage.toString(),
        // Store shipping address as JSON string (Stripe metadata values must be strings)
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });
    
    console.log('✅ PaymentIntent created:', paymentIntent.id);
    
    // Return updated pricing to frontend
    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      pricing: {
        subtotal: subtotalWithMarkup,
        deliveryFee: deliveryFee,
        total: total,
        platformGoldQuote: platformGoldTotal,
        markup: markupAmount,
        markupPercentage: markupPercentage,
      },
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


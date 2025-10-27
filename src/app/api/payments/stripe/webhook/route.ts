import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';
import { clearCart } from '@/lib/firebaseAdminHelpers';
import Stripe from 'stripe';

/**
 * POST /api/payments/stripe/webhook
 * Handles Stripe webhook events (payment success, failures, etc.)
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  if (!signature) {
    console.error('❌ No Stripe signature found');
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }
  
  try {
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    console.log('📨 Stripe webhook event received:', event.type);
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
        
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
        
      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed:', event.data.object.id);
        break;
        
      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

/**
 * Handle successful PaymentIntent (embedded checkout)
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('🎉 PaymentIntent succeeded:', paymentIntent.id);
  console.log('💰 Amount:', paymentIntent.amount / 100);
  
  const userId = paymentIntent.metadata?.userId;
  const userEmail = paymentIntent.metadata?.userEmail;
  
  if (!userId || !userEmail) {
    console.error('❌ Missing user metadata in PaymentIntent');
    return;
  }
  
  if (!adminDb) {
    console.error('❌ Firebase Admin not initialized');
    return;
  }
  
  try {
    // Get cart data
    const cartRef = adminDb.collection('users').doc(userId).collection('cart').doc('current');
    const cartDoc = await cartRef.get();
    const cartData = cartDoc.data();
    
    if (!cartData || !cartData.items) {
      console.error('❌ Cart not found for user:', userId);
      return;
    }
    
    // Build order items from cart
    const orderItems = cartData.items.map((cartItem: any) => ({
      id: cartItem.inventoryId,
      sku: cartItem.sku,
      name: cartItem.name,
      quantity: cartItem.quantity,
      pricing: {
        basePrice: cartItem.pricing?.basePrice || 0,
        markupPercentage: cartItem.pricing?.markupPercentage || 0,
        markup: cartItem.pricing?.markup || 0,
        finalPrice: cartItem.pricing?.finalPrice || 0,
      },
      totalPrice: (cartItem.pricing?.finalPrice || 0) * cartItem.quantity,
      image: cartItem.image,
    }));
    
    // Calculate totals
    const subtotal = cartData.subtotal || 0;
    const deliveryFee = parseFloat(paymentIntent.metadata?.deliveryFee || '15');
    const platformGoldCost = orderItems.reduce(
      (sum: number, item: any) => sum + (item.pricing.basePrice * item.quantity),
      0
    );
    const totalMarkup = subtotal - platformGoldCost;
    
    // Extract shipping address from metadata
    let shippingAddress;
    try {
      shippingAddress = JSON.parse(paymentIntent.metadata?.shippingAddress || '{}');
    } catch (e) {
      console.error('❌ Failed to parse shipping address from metadata');
      shippingAddress = {};
    }
    
    // Create order document
    const orderRef = adminDb.collection('orders').doc();
    const orderId = orderRef.id;
    
    const orderData = {
      id: orderId,
      userId,
      userEmail,
      
      // Order details
      items: orderItems,
      subtotal,
      platformGoldCost,
      totalMarkup,
      deliveryFee,
      total: paymentIntent.amount / 100,
      
      // Shipping info
      shippingAddress: shippingAddress,
      
      // Payment info
      paymentMethod: 'stripe' as const,
      paymentStatus: 'completed' as const,
      paymentId: paymentIntent.id,
      
      // Order status
      status: 'pending_fulfillment' as const,
      platformGoldOrderId: null,
      platformGoldStatus: null,
      
      // KYC status
      requiredKYC: subtotal >= 1500,
      kycStatus: null,
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await orderRef.set(orderData);
    
    console.log('✅ Order created in Firebase:', orderId);
    
    // Clear user's cart
    await clearCart(userId);
    console.log('🧹 Cart cleared for user:', userId);
    
    // TODO: Phase 7 - Send order to Platform Gold for fulfillment
    
  } catch (error) {
    console.error('❌ Error handling PaymentIntent:', error);
  }
}

/**
 * Handle successful checkout session (hosted checkout)
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('🎉 Checkout session completed:', session.id);
  console.log('💰 Amount total:', session.amount_total);
  console.log('👤 Customer email:', session.customer_email);
  
  const userId = session.metadata?.userId;
  const userEmail = session.metadata?.userEmail;
  
  if (!userId || !userEmail) {
    console.error('❌ Missing user metadata in session');
    return;
  }
  
  if (!adminDb) {
    console.error('❌ Firebase Admin not initialized');
    return;
  }
  
  try {
    // Retrieve full session with line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items.data.price.product'],
    });
    
    // Get cart data (for metadata like inventoryId, pricing breakdown)
    const cartRef = adminDb.collection('users').doc(userId).collection('cart').doc('current');
    const cartDoc = await cartRef.get();
    const cartData = cartDoc.data();
    
    if (!cartData || !cartData.items) {
      console.error('❌ Cart not found for user:', userId);
      return;
    }
    
    // Build order items from cart and session line items
    const orderItems = cartData.items.map((cartItem: any) => ({
      id: cartItem.inventoryId,
      sku: cartItem.sku,
      name: cartItem.name,
      quantity: cartItem.quantity,
      pricing: {
        basePrice: cartItem.pricing?.basePrice || 0,
        markupPercentage: cartItem.pricing?.markupPercentage || 0,
        markup: cartItem.pricing?.markup || 0,
        finalPrice: cartItem.pricing?.finalPrice || 0,
      },
      totalPrice: (cartItem.pricing?.finalPrice || 0) * cartItem.quantity,
      image: cartItem.image,
    }));
    
    // Calculate totals
    const subtotal = cartData.subtotal || 0;
    const platformGoldCost = orderItems.reduce(
      (sum: number, item: any) => sum + (item.pricing.basePrice * item.quantity),
      0
    );
    const totalMarkup = subtotal - platformGoldCost;
    
    // Create order document in Firebase
    const orderRef = adminDb.collection('orders').doc();
    const orderId = orderRef.id;
    
    const orderData = {
      id: orderId,
      userId,
      userEmail,
      
      // Order details
      items: orderItems,
      subtotal,
      platformGoldCost,
      totalMarkup,
      deliveryFee: 0, // Add delivery fee logic if needed
      total: session.amount_total ? session.amount_total / 100 : subtotal,
      
      // Payment info
      paymentMethod: 'stripe' as const,
      paymentStatus: 'completed' as const,
      paymentId: session.payment_intent as string,
      stripeSessionId: session.id,
      stripeCustomerEmail: session.customer_email,
      
      // Order status
      status: 'pending_fulfillment' as const,
      platformGoldOrderId: null,
      platformGoldStatus: null,
      
      // KYC status (will be relevant when we add KYC)
      requiredKYC: subtotal >= 1500,
      kycStatus: null,
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await orderRef.set(orderData);
    
    console.log('✅ Order created in Firebase:', orderId);
    
    // Clear user's cart
    await clearCart(userId);
    console.log('🧹 Cart cleared for user:', userId);
    
    // TODO: Phase 7 - Send order to Platform Gold for fulfillment
    // await createPlatformGoldOrder(orderData);
    
  } catch (error) {
    console.error('❌ Error handling checkout session:', error);
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';
import { clearCart } from '@/lib/firebaseAdminHelpers';
import Stripe from 'stripe';
import {
  createPlatformGoldOrder,
  fetchPaymentMethods,
  fetchShippingInstructions,
  getCorrectPaymentMethod,
  getCorrectShippingInstruction,
  convertToPlatformGoldAddress,
  formatOrderItems,
} from '@/lib/platformGoldHelpers';
import { sendOrderConfirmationEmail } from '@/lib/email';

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
      
      case 'identity.verification_session.verified':
        await handleIdentityVerified(event.data.object as Stripe.Identity.VerificationSession);
        break;
      
      case 'identity.verification_session.requires_input':
        await handleIdentityRequiresInput(event.data.object as Stripe.Identity.VerificationSession);
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
  console.log('\n========================================');
  console.log('🎉 PaymentIntent succeeded:', paymentIntent.id);
  console.log('💰 Amount:', paymentIntent.amount / 100);
  console.log('📧 Metadata:', JSON.stringify(paymentIntent.metadata, null, 2));
  console.log('========================================\n');
  
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
    interface CartItem {
      inventoryId: number;
      sku: string;
      name: string;
      quantity: number;
      pricing?: {
        basePrice?: number;
        markupPercentage?: number;
        markup?: number;
        finalPrice?: number;
      };
      image?: string;
    }
    
    const orderItems = cartData.items.map((cartItem: CartItem) => ({
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
      (sum: number, item: typeof orderItems[0]) => sum + (item.pricing.basePrice * item.quantity),
      0
    );
    const totalMarkup = subtotal - platformGoldCost;
    
    // Get shipping address directly from cart (stored in Firebase)
    // This is more reliable than parsing JSON from Stripe metadata
    const shippingAddress = cartData.shippingAddress || {};
    
    if (!shippingAddress.addr1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip) {
      console.error('❌ Shipping address missing required fields:', shippingAddress);
      // Continue anyway - the order will be saved but Platform Gold order may fail
    }
    
    console.log('📦 Shipping address from Firebase:', shippingAddress);
    
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
    
    // ========================================================================
    // PHASE 7: Create Platform Gold Order/Quote
    // ========================================================================
    try {
      console.log('📦 Creating Platform Gold order/quote...');
      
      // Fetch payment methods and shipping instructions
      const [paymentMethods, shippingInstructions] = await Promise.all([
        fetchPaymentMethods(),
        fetchShippingInstructions(),
      ]);
      
      if (!paymentMethods.length || !shippingInstructions.length) {
        console.error('❌ No payment methods or shipping instructions available');
        throw new Error('Platform Gold configuration missing');
      }
      
      // Select the CORRECT payment method and shipping instruction by name
      // Payment Method: "Pre-Payment Check" (not "Trade")
      // Shipping Instruction: "Confidential Drop Ship to Customer" (not "Depository")
      const paymentMethod = getCorrectPaymentMethod(paymentMethods);
      const shippingInstruction = getCorrectShippingInstruction(shippingInstructions);
      
      console.log('💳 Using payment method:', paymentMethod.title, `(ID: ${paymentMethod.id})`);
      console.log('📮 Using shipping instruction:', shippingInstruction.name, `(ID: ${shippingInstruction.id})`);
      
      // Format order for Platform Gold
      const platformGoldRequest = {
        confirmationNumber: orderId, // Use Firebase order ID as confirmation number
        items: formatOrderItems(orderItems),
        shippingAddress: convertToPlatformGoldAddress(shippingAddress),
        email: userEmail,
        paymentMethodId: paymentMethod.id,
        shippingInstructionId: shippingInstruction.id,
        customerReferenceNumber: orderId,
        notes: `Summit Bullion Order - Stripe Payment ID: ${paymentIntent.id}`,
      };
      
      // Create order/quote on Platform Gold
      const platformGoldResult = await createPlatformGoldOrder(platformGoldRequest);
      
      if (platformGoldResult.success) {
        // Update Firebase order with Platform Gold details
        await orderRef.update({
          platformGoldOrderId: platformGoldResult.orderId || null,
          platformGoldTransactionId: platformGoldResult.transactionId || null,
          platformGoldHandle: platformGoldResult.handle || null,
          platformGoldStatus: platformGoldResult.status || 'quote_created',
          platformGoldMode: platformGoldResult.mode,
          platformGoldAmount: platformGoldResult.amount,
          updatedAt: new Date(),
        });
        
        console.log('✅ Platform Gold order/quote linked to Firebase order');
        console.log(`📊 Mode: ${platformGoldResult.mode}`);
        console.log(`💰 Amount: $${platformGoldResult.amount}`);
        
        if (platformGoldResult.handle) {
          console.log(`🔗 Handle: ${platformGoldResult.handle}`);
        }
        if (platformGoldResult.orderId) {
          console.log(`🆔 Order ID: ${platformGoldResult.orderId}`);
        }
      } else {
        console.error('❌ Failed to create Platform Gold order/quote');
        await orderRef.update({
          platformGoldStatus: 'failed',
          platformGoldError: 'Failed to create order on Platform Gold',
          updatedAt: new Date(),
        });
      }
    } catch (platformGoldError) {
      console.error('❌ Platform Gold integration error:', platformGoldError);
      // Don't fail the entire webhook - order is still saved in Firebase
      await orderRef.update({
        platformGoldStatus: 'error',
        platformGoldError: platformGoldError instanceof Error ? platformGoldError.message : 'Unknown error',
        updatedAt: new Date(),
      });
    }
    
    // ========================================================================
    // Send Order Confirmation Email
    // ========================================================================
    try {
      console.log('📧 Sending order confirmation email...');
      
      const emailResult = await sendOrderConfirmationEmail({
        orderId,
        customerEmail: userEmail,
        customerName: shippingAddress?.addressee || undefined,
        items: orderItems,
        subtotal,
        deliveryFee,
        total: paymentIntent.amount / 100,
        shippingAddress: shippingAddress,
      });
      
      if (emailResult.success) {
        console.log('✅ Order confirmation email sent successfully');
        await orderRef.update({
          emailSent: true,
          emailSentAt: new Date(),
        });
      } else {
        console.error('❌ Failed to send order confirmation email:', emailResult.error);
        await orderRef.update({
          emailSent: false,
          emailError: emailResult.error,
        });
      }
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError);
      // Don't fail the webhook - email is non-critical
    }
    
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
    // Get cart data (for metadata like inventoryId, pricing breakdown)
    const cartRef = adminDb.collection('users').doc(userId).collection('cart').doc('current');
    const cartDoc = await cartRef.get();
    const cartData = cartDoc.data();
    
    if (!cartData || !cartData.items) {
      console.error('❌ Cart not found for user:', userId);
      return;
    }
    
    // Build order items from cart and session line items
    interface CartItem {
      inventoryId: number;
      sku: string;
      name: string;
      quantity: number;
      pricing?: {
        basePrice?: number;
        markupPercentage?: number;
        markup?: number;
        finalPrice?: number;
      };
      image?: string;
    }
    
    const orderItems = cartData.items.map((cartItem: CartItem) => ({
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
      (sum: number, item: typeof orderItems[0]) => sum + (item.pricing.basePrice * item.quantity),
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

/**
 * Handle successful identity verification
 */
async function handleIdentityVerified(session: Stripe.Identity.VerificationSession) {
  console.log('\n========================================');
  console.log('✅ Identity verification succeeded:', session.id);
  console.log('📧 Email:', session.provided_details?.email);
  console.log('========================================\n');
  
  const userId = session.metadata?.userId;
  const email = session.metadata?.email || session.provided_details?.email;
  
  if (!userId || !email) {
    console.error('❌ Missing user metadata in VerificationSession');
    return;
  }
  
  if (!adminDb) {
    console.error('❌ Firebase Admin not initialized');
    return;
  }
  
  try {
    // Update user profile with KYC status
    const userRef = adminDb.collection('users').doc(userId);
    await userRef.update({
      kycStatus: 'approved',
      kycVerificationId: session.id,
      kycCompletedAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('✅ User KYC status updated to approved:', userId);
    
  } catch (error) {
    console.error('❌ Error updating user KYC status:', error);
  }
}

/**
 * Handle identity verification that requires input (failed)
 */
async function handleIdentityRequiresInput(session: Stripe.Identity.VerificationSession) {
  console.log('\n========================================');
  console.log('⚠️ Identity verification requires input:', session.id);
  console.log('📧 Email:', session.provided_details?.email);
  console.log('❌ Last error:', session.last_error);
  console.log('========================================\n');
  
  const userId = session.metadata?.userId;
  const email = session.metadata?.email || session.provided_details?.email;
  
  if (!userId || !email) {
    console.error('❌ Missing user metadata in VerificationSession');
    return;
  }
  
  if (!adminDb) {
    console.error('❌ Firebase Admin not initialized');
    return;
  }
  
  try {
    // Update user profile with KYC status
    const userRef = adminDb.collection('users').doc(userId);
    await userRef.update({
      kycStatus: 'rejected',
      kycVerificationId: session.id,
      kycCompletedAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('⚠️ User KYC status updated to rejected:', userId);
    
  } catch (error) {
    console.error('❌ Error updating user KYC status:', error);
  }
}


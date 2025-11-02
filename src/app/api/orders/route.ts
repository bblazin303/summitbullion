import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verifyAlchemyToken';
import { adminDb } from '@/lib/firebase-admin';

/**
 * GET /api/orders
 * Fetches all orders for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authType = searchParams.get('authType');
    const userIdParam = searchParams.get('userId');
    
    let userId: string;
    
    // Handle email auth vs Google OAuth
    if (authType === 'email' && userIdParam) {
      userId = userIdParam;
    } else {
      const user = await requireAuth();
      userId = user.userId;
    }
    
    if (!adminDb) {
      throw new Error('Firebase Admin not initialized');
    }
    
    // Query orders for this user, sorted by creation date (newest first)
    const ordersRef = adminDb.collection('orders');
    const snapshot = await ordersRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id,
        userId: data.userId,
        userEmail: data.userEmail,
        items: data.items,
        subtotal: data.subtotal,
        deliveryFee: data.deliveryFee,
        total: data.total,
        platformGoldCost: data.platformGoldCost,
        totalMarkup: data.totalMarkup,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        paymentId: data.paymentId,
        status: data.status,
        // Platform Gold fields
        platformGoldOrderId: data.platformGoldOrderId,
        platformGoldTransactionId: data.platformGoldTransactionId,
        platformGoldHandle: data.platformGoldHandle,
        platformGoldStatus: data.platformGoldStatus,
        platformGoldMode: data.platformGoldMode,
        platformGoldError: data.platformGoldError,
        platformGoldTrackingNumbers: data.platformGoldTrackingNumbers,
        requiredKYC: data.requiredKYC,
        kycStatus: data.kycStatus,
        trackingNumbers: data.trackingNumbers,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      };
    });
    
    console.log(`📦 Found ${orders.length} orders for user ${userId}`);
    if (orders.length > 0) {
      console.log('📋 Most recent order:', {
        id: orders[0].id.slice(-8),
        total: orders[0].total,
        platformGoldMode: orders[0].platformGoldMode,
        platformGoldStatus: orders[0].platformGoldStatus,
        createdAt: orders[0].createdAt,
      });
    }
    
    return NextResponse.json({
      success: true,
      orders,
    });
    
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}


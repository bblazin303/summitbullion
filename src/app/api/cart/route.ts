/**
 * GET /api/cart
 * Get user's cart from Firebase
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verifyAlchemyToken';
import { getCart } from '@/lib/firebaseAdminHelpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authType = searchParams.get('authType');
    const userIdParam = searchParams.get('userId');
    
    let userId: string;
    
    // Handle email auth vs Google OAuth
    if (authType === 'email' && userIdParam) {
      console.log('📧 Email auth cart request');
      userId = userIdParam;
    } else {
      console.log('🔐 Google OAuth cart request');
      const user = await requireAuth();
      userId = user.userId;
    }
    
    console.log('🛒 Fetching cart for user:', userId);
    
    // Get cart from Firebase using Admin SDK
    const cart = await getCart(userId);
    
    console.log('🛒 Cart from Firebase:', JSON.stringify(cart, null, 2));
    
    return NextResponse.json({
      success: true,
      cart: cart || { userId: userId, items: [], subtotal: 0, itemCount: 0 },
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to get cart' },
      { status: 500 }
    );
  }
}


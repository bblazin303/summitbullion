/**
 * GET /api/cart
 * Get user's cart from Firebase
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verifyAlchemyToken';
import { getCart } from '@/lib/firebaseAdminHelpers';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 === CART API ROUTE CALLED ===');
    const { searchParams } = new URL(request.url);
    const authType = searchParams.get('authType');
    const userIdParam = searchParams.get('userId');
    
    console.log('🔍 Auth type:', authType);
    console.log('🔍 User ID param:', userIdParam);
    
    let userId: string;
    
    // Handle email auth vs Google OAuth
    if (authType === 'email' && userIdParam) {
      console.log('📧 Email auth cart request');
      userId = userIdParam;
    } else {
      console.log('🔐 Google OAuth cart request');
      const user = await requireAuth();
      console.log('🔐 Authenticated user:', user);
      userId = user.userId;
    }
    
    console.log('🛒 Fetching cart for user ID:', userId);
    console.log('🛒 Cart path: users/' + userId + '/cart/current');
    
    // Get cart from Firebase using Admin SDK
    const cart = await getCart(userId);
    
    console.log('🛒 Cart from Firebase (raw):', cart);
    console.log('🛒 Cart exists:', !!cart);
    console.log('🛒 Cart items:', cart?.items);
    console.log('🛒 Cart items length:', cart?.items?.length);
    console.log('🛒 Cart stringified:', JSON.stringify(cart, null, 2));
    
    const responseCart = cart || { userId: userId, items: [], subtotal: 0, itemCount: 0 };
    
    console.log('🛒 Response cart:', responseCart);
    console.log('🛒 Response items:', responseCart.items);
    console.log('🛒 Response items length:', responseCart.items?.length);
    
    return NextResponse.json({
      success: true,
      cart: responseCart,
    });
  } catch (error) {
    console.error('❌ Error getting cart:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to get cart', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


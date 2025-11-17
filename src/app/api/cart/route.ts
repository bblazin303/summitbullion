/**
 * GET /api/cart
 * Get user's cart from Firebase
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verifyAlchemyToken';
import { getCart } from '@/lib/firebaseAdminHelpers';
import { emailToUserId } from '@/lib/userIdHelper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authType = searchParams.get('authType');
    const emailParam = searchParams.get('email');
    
    let userId: string;
    
    // Handle email auth vs Google OAuth
    if (authType === 'email' && emailParam) {
      // For email auth, use email-based userId for consistency
      userId = emailToUserId(emailParam);
      console.log('📧 Email auth cart request - converting email to userId:', emailParam, '->', userId);
    } else {
      const user = await requireAuth();
      userId = user.userId;
    }
    
    // Get cart from Firebase using Admin SDK
    const cart = await getCart(userId);
    console.log('📦 Cart fetched from Firebase for user:', userId);
    console.log('📦 Cart data:', cart);
    console.log('📦 Items count:', cart?.items?.length || 0);
    
    const responseCart = cart || { userId: userId, items: [], subtotal: 0, itemCount: 0 };
    
    return NextResponse.json({
      success: true,
      cart: responseCart,
    });
  } catch (error) {
    console.error('❌ Error getting cart:', error);
    
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


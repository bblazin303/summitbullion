/**
 * DELETE /api/cart/clear
 * Clear user's entire cart
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verifyAlchemyToken';
import { clearCart } from '@/lib/firebaseAdminHelpers';
import { emailToUserId } from '@/lib/userIdHelper';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authType = searchParams.get('authType');
    const emailParam = searchParams.get('email');
    
    let userId: string;
    
    // Handle email auth vs Google OAuth
    if (authType === 'email' && emailParam) {
      userId = emailToUserId(emailParam);
      console.log('📧 Email auth cart clear - converting email to userId:', emailParam, '->', userId);
    } else {
      console.log('🔐 Google OAuth cart clear request');
      const user = await requireAuth();
      userId = user.userId;
    }
    
    // Clear cart using Firebase Admin SDK
    await clearCart(userId);
    
    return NextResponse.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}


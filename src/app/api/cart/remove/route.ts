/**
 * DELETE /api/cart/remove
 * Remove item from user's cart
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verifyAlchemyToken';
import { removeFromCart } from '@/lib/firebaseAdminHelpers';
import { emailToUserId } from '@/lib/userIdHelper';

export async function DELETE(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { itemId, authType, email } = body as {
      itemId: string;
      authType?: 'email' | 'google';
      userId?: string;
      email?: string;
    };
    
    let userId: string;
    
    // Handle email auth vs Google OAuth
    if (authType === 'email' && email) {
      userId = emailToUserId(email);
      console.log('📧 Email auth cart remove - converting email to userId:', email, '->', userId);
    } else {
      console.log('🔐 Google OAuth cart remove request');
      const user = await requireAuth();
      userId = user.userId;
    }
    
    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Remove from cart using Firebase Admin SDK
    await removeFromCart(userId, itemId);
    
    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}


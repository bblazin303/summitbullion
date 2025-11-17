/**
 * PUT /api/cart/update
 * Update item quantity in user's cart
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verifyAlchemyToken';
import { updateCartItemQuantity } from '@/lib/firebaseAdminHelpers';
import { emailToUserId } from '@/lib/userIdHelper';

export async function PUT(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { itemId, quantity, authType, email } = body as {
      itemId: string;
      quantity: number;
      authType?: 'email' | 'google';
      userId?: string;
      email?: string;
    };
    
    let userId: string;
    
    // Handle email auth vs Google OAuth
    if (authType === 'email' && email) {
      userId = emailToUserId(email);
      console.log('📧 Email auth cart update - converting email to userId:', email, '->', userId);
    } else {
      console.log('🔐 Google OAuth cart update request');
      const user = await requireAuth();
      userId = user.userId;
    }
    
    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Update cart using Firebase Admin SDK
    await updateCartItemQuantity(userId, itemId, quantity);
    
    return NextResponse.json({
      success: true,
      message: 'Cart updated',
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}


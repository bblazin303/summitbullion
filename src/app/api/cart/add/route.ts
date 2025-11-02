/**
 * POST /api/cart/add
 * Add item to user's cart
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verifyAlchemyToken';
import { addToCart } from '@/lib/firebaseAdminHelpers';
import { CartItem } from '@/types/cart';
import { emailToUserId } from '@/lib/userIdHelper';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { item, authType, userId: bodyUserId, email } = body as {
      item: CartItem;
      authType?: 'email' | 'google';
      userId?: string;
      email?: string;
    };
    
    let userId: string;
    
    // Handle email auth vs Google OAuth
    if (authType === 'email' && email) {
      userId = emailToUserId(email);
      console.log('📧 Email auth cart add - converting email to userId:', email, '->', userId);
    } else {
      console.log('🔐 Google OAuth cart add request');
      const user = await requireAuth();
      userId = user.userId;
    }
    
    if (!item || !item.id) {
      return NextResponse.json(
        { success: false, error: 'Invalid item data' },
        { status: 400 }
      );
    }
    
    // Add to cart using Firebase Admin SDK
    await addToCart(userId, {
      ...item,
      addedAt: new Date(),
    });
    
    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}


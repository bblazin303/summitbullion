import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { emailToUserId } from '@/lib/userIdHelper';

/**
 * GET /api/user/profile?email=user@example.com
 * 
 * Fetches user profile from Firebase
 * Used to check KYC status and other user data
 */
export async function GET(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { success: false, error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter required' },
        { status: 400 }
      );
    }

    // Convert email to consistent userId
    const userId = emailToUserId(email);

    console.log('📋 Fetching user profile for:', email, '→', userId);

    // Fetch user document from Firebase
    const userDoc = await adminDb.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    console.log('✅ User profile found, KYC status:', userData?.kycStatus || 'none');

    return NextResponse.json({
      success: true,
      ...userData,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user profile';
    console.error('❌ Error fetching user profile:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: 500 }
    );
  }
}


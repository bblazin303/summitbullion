/**
 * POST /api/user/sync
 * Sync user profile from Alchemy to Firebase
 * Creates new user or updates existing user
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verifyAlchemyToken';
import { createUserProfile, getUserProfile, updateUserProfile } from '@/lib/firebaseAdminHelpers';

// Helper function to generate consistent userId from email
function emailToUserId(email: string): string {
  // Remove special characters and convert to lowercase
  return email.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body first to determine auth type
    const body = await request.json();
    const { authType, email, walletAddress, solanaAddress, accountType, orgId } = body as { 
      authType?: 'email' | 'google';
      userId?: string;
      email?: string;
      walletAddress: string;
      solanaAddress?: string; 
      accountType: 'sca' | 'eoa';
      orgId: string;
    };
    
    let verifiedUserId: string;
    let verifiedEmail: string;
    
    // Handle different auth types
    if (authType === 'email') {
      // For email auth, use email as the consistent userId
      if (!email) {
        return NextResponse.json(
          { success: false, error: 'Missing email for email auth' },
          { status: 400 }
        );
      }
      verifiedUserId = emailToUserId(email); // Use email-based ID for consistency
      verifiedEmail = email;
      console.log('📧 Email auth - using email-based userId:', verifiedUserId);
    } else {
      // For Google OAuth, verify JWT token
      const user = await requireAuth();
      verifiedUserId = user.userId;
      verifiedEmail = user.email;
      console.log('🔐 Google OAuth - using JWT userId:', verifiedUserId);
    }
    
    // Validate required fields
    if (!walletAddress || !orgId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: walletAddress, orgId' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await getUserProfile(verifiedUserId);
    
    if (existingUser) {
      // User exists - update their profile
      await updateUserProfile(verifiedUserId, {
        email: verifiedEmail,
        walletAddress: walletAddress,
        solanaAddress: solanaAddress,
        alchemyOrgId: orgId,
        accountType: accountType || 'sca',
      });
      
      return NextResponse.json({
        success: true,
        message: 'User profile updated',
        isNewUser: false,
      });
    } else {
      // New user - create profile
      await createUserProfile(
        verifiedUserId,
        verifiedEmail,
        walletAddress,
        orgId,
        accountType || 'sca',
        solanaAddress
      );
      
      return NextResponse.json({
        success: true,
        message: 'User profile created',
        isNewUser: true,
      });
    }
  } catch (error) {
    console.error('Error syncing user:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to sync user profile' },
      { status: 500 }
    );
  }
}


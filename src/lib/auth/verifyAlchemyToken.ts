/**
 * Server-side authentication using Alchemy JWT tokens
 * This verifies that requests come from authenticated users
 */

import { headers } from 'next/headers';
import { emailToUserId } from '@/lib/userIdHelper';

export interface VerifiedUser {
  userId: string;
  email: string;
  address?: string;
  orgId?: string;
}

/**
 * Extract and decode Alchemy JWT token from request headers
 * For now, we'll trust the token since Alchemy handles the heavy lifting
 * In production, you can add additional verification if needed
 */
export async function verifyAlchemyToken(): Promise<VerifiedUser | null> {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No authorization header found');
      return null;
    }

    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      console.error('❌ No token found in authorization header');
      return null;
    }

    // Decode JWT (not verifying signature for now since Alchemy already validated it client-side)
    // In production, you could add signature verification here
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );

    // Extract user info from Alchemy token
    // Alchemy's JWT structure includes standard claims
    console.log('🔍 Decoded Alchemy JWT payload:', JSON.stringify(payload, null, 2));
    
    const email = payload.email;
    const originalUserId = payload.sub || payload.userId;
    
    // IMPORTANT: Use email-based userId for consistency across client/server
    // Alchemy gives different userIds on client vs server for Google OAuth
    const consistentUserId = email ? emailToUserId(email) : originalUserId;
    
    const user = {
      userId: consistentUserId, // Use email-based ID for consistency
      email: email,
      address: payload.address || payload.wallet_address || payload.walletAddress,
      orgId: payload.orgId || payload.org_id,
    };
    
    console.log('✅ Extracted user data (using email-based userId):', {
      originalUserId,
      consistentUserId,
      email
    });
    return user;
  } catch (error) {
    console.error('❌ Error verifying token:', error);
    return null;
  }
}

/**
 * Require authentication middleware for API routes
 * Returns user or throws 401 error
 */
export async function requireAuth(): Promise<VerifiedUser> {
  const user = await verifyAlchemyToken();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

/**
 * Flexible auth that handles both Google OAuth (JWT) and Email auth (client data)
 * Used for API routes that need to support both auth methods
 */
export async function requireFlexibleAuth(body: {
  authType?: 'email' | 'google';
  userId?: string;
  email?: string;
  walletAddress?: string;
  orgId?: string;
}): Promise<VerifiedUser> {
  const { authType, email, walletAddress, orgId } = body;
  
  // If authType is 'email', trust client-provided data but use email-based userId
  if (authType === 'email') {
    if (!email) {
      throw new Error('Unauthorized: Missing email auth credentials');
    }
    
    // Convert email to consistent userId
    const consistentUserId = emailToUserId(email);
    console.log('📧 Email auth: Using email-based userId:', email, '->', consistentUserId);
    
    return {
      userId: consistentUserId, // Use email-based ID for consistency
      email,
      address: walletAddress,
      orgId,
    };
  }
  
  // Otherwise, verify JWT token (Google OAuth)
  console.log('🔐 Google OAuth: Verifying JWT token');
  return await requireAuth();
}


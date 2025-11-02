"use client";

import { useUser } from '@account-kit/react';
import { useMemo } from 'react';
import { emailToUserId } from '@/lib/userIdHelper';

/**
 * Hook that returns a consistent userId for the current user
 * For email auth: returns email-based ID (e.g., "jcruzfff_gmail_com")
 * For Google OAuth: returns Alchemy userId
 * 
 * This ensures the same user always gets the same ID across sessions
 */
export function useConsistentUserId() {
  const user = useUser();
  
  const consistentUserId = useMemo(() => {
    if (!user?.userId || !user?.email) {
      return null;
    }
    
    // Check if this is Google OAuth by looking at the userId format
    // Google OAuth userIds are numeric strings (e.g., "101838333071877152968")
    const isGoogleOAuth = /^\d+$/.test(user.userId);
    
    // Check for idToken presence
    const hasIdToken = !!user.idToken;
    
    // Check user type (Alchemy provides this)
    // 'sca' = Smart Contract Account (can be email or social)
    // We need to check the orgId to determine if it's Google OAuth
    const hasGoogleOrgId = user.orgId && user.orgId.length > 0;
    
    // IMPORTANT: For Google OAuth, Alchemy gives us a UUID on client but numeric ID on server
    // We need to use email-based ID for ALL users to ensure consistency
    // The backend will handle Google OAuth JWT verification separately
    const isEmailAuth = true; // Always use email-based ID for consistency
    
    console.log('🔍 useConsistentUserId - Auth detection:', {
      userId: user.userId,
      email: user.email,
      hasIdToken,
      isGoogleOAuth,
      hasGoogleOrgId,
      userType: user.type,
      orgId: user.orgId,
      isEmailAuth,
      finalUserId: emailToUserId(user.email)
    });
    
    // Always use email-based ID for consistency
    // This ensures cart persists regardless of Alchemy's client/server userId mismatch
    return emailToUserId(user.email);
  }, [user?.userId, user?.email, user?.idToken, user?.type, user?.orgId]);
  
  return {
    userId: consistentUserId,
    originalUserId: user?.userId || null,
    email: user?.email || null,
    isEmailAuth: true, // Always treat as email-based for consistency
  };
}


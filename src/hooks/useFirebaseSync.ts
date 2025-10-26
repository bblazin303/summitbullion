"use client";

import { useEffect, useRef } from 'react';
import { useUser } from '@account-kit/react';

/**
 * Hook that automatically syncs Alchemy auth to Firebase via API route
 * Creates/updates user profile in Firestore when user logs in
 */
export function useFirebaseSync() {
  const user = useUser();
  const syncedUserIdRef = useRef<string | null>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    // If no user, reset the synced ID
    if (!user) {
      console.log('🔴 No user detected, clearing sync');
      syncedUserIdRef.current = null;
      return;
    }

    console.log('👤 User detected:', {
      userId: user.userId,
      email: user.email,
      hasIdToken: !!user.idToken,
      alreadySynced: syncedUserIdRef.current === user.userId,
      isSyncing: isSyncingRef.current
    });

    // Skip if already synced this user
    if (syncedUserIdRef.current === user.userId) {
      console.log('⏭️ User already synced, skipping');
      return;
    }

    // Skip if currently syncing
    if (isSyncingRef.current) {
      console.log('⏳ Sync already in progress, skipping');
      return;
    }

    // Sync user to Firebase via API route
    const syncUserToAPI = async () => {
      if (!user.email) {
        console.warn('⚠️ User logged in but no email provided');
        return;
      }

      // Handle email auth (no idToken) vs Google OAuth (has idToken)
      const isEmailAuth = !user.idToken;
      
      if (isEmailAuth) {
        console.log('📧 Email auth detected - using alternative sync method');
      }

      try {
        isSyncingRef.current = true;
        console.log('🔄 Syncing user to Firebase via API...', {
          userId: user.userId,
          email: user.email,
          wallet: user.address,
          authType: isEmailAuth ? 'email' : 'google'
        });

        // Prepare request headers and body based on auth type
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        // Add JWT token for Google OAuth users only
        if (!isEmailAuth && user.idToken) {
          headers['Authorization'] = `Bearer ${user.idToken}`;
        }

        // Call API route to sync user
        const response = await fetch('/api/user/sync', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            // For email auth, we send user data directly (no JWT to verify)
            userId: user.userId,
            email: user.email,
            walletAddress: user.address, // EVM wallet address from Alchemy
            solanaAddress: user.solanaAddress, // Solana wallet address
            accountType: user.type, // 'sca' or 'eoa'
            orgId: user.orgId, // Alchemy organization ID
            authType: isEmailAuth ? 'email' : 'google', // Indicate auth method
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to sync user');
        }

        const data = await response.json();

        if (data.success) {
          if (data.isNewUser) {
            console.log('✅ New user profile created in Firebase');
          } else {
            console.log('✅ User profile updated in Firebase');
          }
        }

        // Mark this user as synced
        syncedUserIdRef.current = user.userId;
      } catch (error) {
        console.error('❌ Error syncing user to API:', error);
      } finally {
        isSyncingRef.current = false;
      }
    };

    syncUserToAPI();
  }, [user?.userId, user?.email, user?.address, user?.idToken, user?.solanaAddress, user?.type]);

  return {
    isSynced: syncedUserIdRef.current === user?.userId,
    user,
  };
}


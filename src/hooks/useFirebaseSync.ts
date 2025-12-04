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
      syncedUserIdRef.current = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('firebase_synced_user');
      }
      return;
    }

    // Check if already synced in this session (persists across page navigations)
    const sessionSyncedUser = typeof window !== 'undefined' 
      ? sessionStorage.getItem('firebase_synced_user') 
      : null;
    
    if (sessionSyncedUser === user.userId) {
      syncedUserIdRef.current = user.userId;
      return;
    }

    // Skip if already synced this user
    if (syncedUserIdRef.current === user.userId) {
      return;
    }

    // Skip if currently syncing
    if (isSyncingRef.current) {
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

      try {
        isSyncingRef.current = true;

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

        await response.json(); // Response data currently unused

        // Mark this user as synced (both in ref and sessionStorage)
        syncedUserIdRef.current = user.userId;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('firebase_synced_user', user.userId);
        }
      } catch (error) {
        console.error('❌ Error syncing user to API:', error);
      } finally {
        isSyncingRef.current = false;
      }
    };

    syncUserToAPI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, user?.email, user?.address, user?.idToken, user?.solanaAddress, user?.type]); // user object itself excluded to prevent re-renders

  return {
    isSynced: syncedUserIdRef.current === user?.userId,
    user,
  };
}


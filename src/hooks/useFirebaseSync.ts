"use client";

import { useEffect, useRef } from 'react';
import { useUser } from '@account-kit/react';
import { createUserProfile, getUserProfile, updateUserProfile } from '@/lib/firebaseHelpers';

/**
 * Hook that automatically syncs Alchemy auth to Firebase
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

    // Sync user to Firebase
    const syncUserToFirebase = async () => {
      if (!user.email) {
        console.warn('⚠️ User logged in but no email provided');
        return;
      }

      try {
        isSyncingRef.current = true;
        console.log('🔄 Syncing user to Firebase...', {
          userId: user.userId,
          email: user.email,
          wallet: user.address
        });

        // Check if user already exists in Firebase
        const existingUser = await getUserProfile(user.userId);

        if (existingUser) {
          // User exists - update their profile
          console.log('✅ User exists, updating profile...');
          await updateUserProfile(user.userId, {
            email: user.email,
            walletAddress: user.address,
            solanaAddress: user.solanaAddress,
            alchemyOrgId: user.orgId,
            accountType: user.type,
            updatedAt: new Date(),
          });
          console.log('✅ User profile updated in Firebase');
        } else {
          // New user - create profile
          console.log('🆕 New user, creating profile...');
          await createUserProfile(
            user.userId,
            user.email,
            user.address,
            user.orgId,
            user.type,
            user.solanaAddress
          );
          console.log('✅ User profile created in Firebase');
        }

        // Mark this user as synced
        syncedUserIdRef.current = user.userId;
      } catch (error) {
        console.error('❌ Error syncing user to Firebase:', error);
      } finally {
        isSyncingRef.current = false;
      }
    };

    syncUserToFirebase();
  }, [user]);

  return {
    isSynced: syncedUserIdRef.current === user?.userId,
    user,
  };
}


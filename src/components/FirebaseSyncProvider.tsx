"use client";

import { useFirebaseSync } from '@/hooks/useFirebaseSync';

/**
 * Provider component that automatically syncs Alchemy auth to Firebase
 * Add this to your app layout to enable auto-sync on login
 */
export function FirebaseSyncProvider({ children }: { children: React.ReactNode }) {
  // This hook runs automatically and syncs users to Firebase
  useFirebaseSync();

  return <>{children}</>;
}


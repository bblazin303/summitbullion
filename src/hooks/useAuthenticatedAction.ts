// Custom hook to require authentication before performing actions
// Based on: https://www.alchemy.com/docs/wallets/react/quickstart/existing-project

"use client";

import { useAuthModal, useUser, useSignerStatus } from "@account-kit/react";
import { useCallback } from "react";

/**
 * Hook to require authentication before performing an action (like adding to cart)
 * 
 * Usage:
 * const executeIfAuthenticated = useAuthenticatedAction();
 * executeIfAuthenticated(() => addItemToCart(item));
 */
export function useAuthenticatedAction() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();

  const executeIfAuthenticated = useCallback(
    (action: () => void | Promise<void>) => {
      // Check if still initializing
      if (signerStatus.isInitializing) {
        return;
      }

      // If user is authenticated, execute the action
      if (user) {
        action();
        return;
      }

      // If not authenticated, show login modal
      openAuthModal();
    },
    [user, openAuthModal, signerStatus.isInitializing]
  );

  return {
    executeIfAuthenticated,
    isAuthenticated: !!user,
    isInitializing: signerStatus.isInitializing,
    user,
  };
}


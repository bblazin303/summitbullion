// Alchemy Account Kit Configuration
// Based on: https://www.alchemy.com/docs/wallets/react/quickstart/existing-project

import { AlchemyAccountsUIConfig, createConfig } from "@account-kit/react";
import { sepolia, alchemy } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

// UI Configuration - Customize the appearance of Alchemy components
const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" as const }],
      [
        { type: "social" as const, authProviderId: "google", mode: "popup" as const },
      ],
    ],
    addPasskeyOnSignup: false, // Disabled - too cumbersome for marketplace
  },
};

// Create Alchemy Config
// Get your API key from: https://dashboard.alchemy.com/
export const config = createConfig(
  {
    // Required: Alchemy transport with API key
    transport: alchemy({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
    }),
    
    // Chain configuration (using Sepolia testnet for now, change to mainnet for production)
    chain: sepolia,
    
    // Enable server-side rendering
    ssr: true,
    
    // Optional: Gas manager policy ID for sponsored transactions
    ...(process.env.NEXT_PUBLIC_ALCHEMY_GAS_POLICY_ID && {
      policyId: process.env.NEXT_PUBLIC_ALCHEMY_GAS_POLICY_ID,
    }),
    
    // Optional: Session configuration
    sessionConfig: {
      expirationTimeMs: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  },
  uiConfig
);

// Query Client for React Query (required by Alchemy)
export const queryClient = new QueryClient();

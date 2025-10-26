// User-related TypeScript types

export type KYCStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface User {
  uid: string; // Alchemy userId
  email: string;
  walletAddress: string; // Alchemy smart wallet address (EVM)
  solanaAddress?: string; // Alchemy Solana wallet address
  alchemyOrgId: string; // Alchemy organization ID
  accountType: 'sca' | 'eoa'; // Smart contract account or EOA
  displayName?: string;
  kycStatus: KYCStatus;
  kycVerificationId?: string; // Stripe Identity session ID
  kycCompletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  // Additional profile fields can go here
  phoneNumber?: string;
  savedAddresses?: ShippingAddress[];
}

export interface ShippingAddress {
  id: string;
  addressee: string;
  attention?: string;
  addr1: string;
  addr2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}


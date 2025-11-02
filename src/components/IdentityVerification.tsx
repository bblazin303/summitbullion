"use client";

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useUser } from '@account-kit/react';
import { useConsistentUserId } from '@/hooks/useConsistentUserId';

// Load Stripe outside component to avoid recreating on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface IdentityVerificationProps {
  onVerificationComplete?: (verificationSessionId: string) => void;
  onVerificationError?: (error: string) => void;
}

/**
 * Component to trigger Stripe Identity verification
 * Shows a button that opens the Stripe Identity modal
 */
export default function IdentityVerification({
  onVerificationComplete,
  onVerificationError,
}: IdentityVerificationProps) {
  const user = useUser();
  const { userId: consistentUserId, email, isEmailAuth } = useConsistentUserId();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyIdentity = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 Starting identity verification...');

      // Get Stripe instance
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Create verification session
      const response = await fetch('/api/kyc/create-verification-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.idToken && { 'Authorization': `Bearer ${user.idToken}` }),
        },
        body: JSON.stringify({
          authType: isEmailAuth ? 'email' : 'google',
          userId: user?.userId,
          email: email,
          walletAddress: user?.address,
          orgId: user?.orgId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create verification session');
      }

      const { clientSecret, verificationSessionId } = await response.json();

      console.log('✅ Verification session created:', verificationSessionId);

      // Show Stripe Identity modal
      const result = await stripe.verifyIdentity(clientSecret);

      if (result.error) {
        // Handle error
        console.error('❌ Identity verification error:', result.error.message);
        setError(result.error.message || 'Verification failed');
        onVerificationError?.(result.error.message || 'Verification failed');
      } else {
        // Success - verification submitted
        console.log('✅ Identity verification submitted');
        onVerificationComplete?.(verificationSessionId);
      }

    } catch (err: any) {
      console.error('❌ Error during identity verification:', err);
      setError(err.message || 'An unexpected error occurred');
      onVerificationError?.(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Info Box */}
      <div className="bg-[#fff9e6] border border-[#ffb546]/30 rounded-[12px] p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#ffb546"/>
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-inter font-semibold text-[14px] text-[#141722] mb-1">
              Identity Verification Required
            </h4>
            <p className="font-inter text-[13px] text-[#7c7c7c] leading-relaxed">
              Orders over <strong className="text-[#141722]">$3,000</strong> require identity verification for compliance with federal regulations. 
              This is a one-time process that takes about 2 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-[12px] p-4">
          <p className="font-inter text-[13px] text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Verify Button */}
      <button
        onClick={handleVerifyIdentity}
        disabled={isLoading}
        className="w-full bg-[#141722] text-white rounded-[42px] px-6 py-4 font-inter font-medium text-[14px] uppercase hover:bg-[#2a2d3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Opening Verification...</span>
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor"/>
            </svg>
            <span>Verify Identity</span>
          </>
        )}
      </button>

      {/* What to Expect */}
      <div className="bg-white border border-[#e5ddd0] rounded-[12px] p-4">
        <h5 className="font-inter font-semibold text-[13px] text-[#141722] mb-3">
          What to expect:
        </h5>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-[#ffb546] font-bold">1.</span>
            <span className="font-inter text-[12px] text-[#7c7c7c]">
              Upload a photo of your government-issued ID (passport, driver&apos;s license, or national ID)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#ffb546] font-bold">2.</span>
            <span className="font-inter text-[12px] text-[#7c7c7c]">
              Take a selfie to confirm your identity
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#ffb546] font-bold">3.</span>
            <span className="font-inter text-[12px] text-[#7c7c7c]">
              Verification typically completes in under 1 minute
            </span>
          </li>
        </ul>
        <p className="font-inter text-[11px] text-[#7c7c7c] mt-3 italic">
          Your information is securely processed by Stripe and never stored on our servers.
        </p>
      </div>
    </div>
  );
}


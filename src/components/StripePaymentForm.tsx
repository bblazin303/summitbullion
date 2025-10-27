"use client";

import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { useUser } from '@account-kit/react';
import { ShippingAddress } from '@/types/user';

// Load Stripe outside component to avoid recreating on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/**
 * The actual payment form with Stripe Elements
 */
interface CheckoutFormProps {
  isShippingValid: boolean;
}

function CheckoutForm({ isShippingValid }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      });

      if (error) {
        // This point will only be reached if there's an immediate error
        setErrorMessage(error.message || 'An error occurred');
        setIsProcessing(false);
      }
      // Otherwise, Stripe will redirect to the return_url
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      {/* Stripe Payment Element - Floats naturally in parent */}
      <PaymentElement
        options={{
          layout: 'tabs',
          terms: {
            card: 'auto',
          },
        }}
      />

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-[12px]">
          <p className="text-red-600 font-inter text-[14px]">{errorMessage}</p>
        </div>
      )}

      {/* Shipping Validation Warning */}
      {!isShippingValid && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-[12px]">
          <p className="text-amber-800 font-inter text-[14px]">
            Please complete your shipping address before proceeding with payment.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing || !isShippingValid}
        className="w-full bg-[#141722] text-[#efe9e0] font-inter font-medium text-[14px] uppercase py-[17px] rounded-[42px] hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:to-[#FFB546] hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

/**
 * Wrapper component that loads the PaymentIntent and provides Stripe context
 */
interface StripePaymentFormProps {
  shippingAddress: Partial<ShippingAddress>;
  isShippingValid: boolean;
}

export default function StripePaymentForm({ shippingAddress, isShippingValid }: StripePaymentFormProps) {
  const user = useUser();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.userId) {
      return;
    }

    // Create PaymentIntent on component mount
    const createPaymentIntent = async () => {
      try {
        const isEmailAuth = !user.idToken;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (!isEmailAuth && user.idToken) {
          headers['Authorization'] = `Bearer ${user.idToken}`;
        }

        const response = await fetch('/api/payments/stripe/create-payment-intent', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            authType: isEmailAuth ? 'email' : 'google',
            userId: user.userId,
            email: user.email,
            shippingAddress: shippingAddress,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();

        if (data.success && data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error('No client secret returned');
        }
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError('Failed to initialize payment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [user?.userId, user?.idToken]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-12 rounded-[12px]"></div>
        <div className="animate-pulse bg-gray-200 h-32 rounded-[12px]"></div>
        <div className="animate-pulse bg-gray-200 h-12 rounded-[42px]"></div>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-[12px]">
        <p className="text-red-600 font-inter text-[14px]">
          {error || 'Failed to load payment form'}
        </p>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#141722',
        colorBackground: '#ffffff',
        colorText: '#000000',
        colorDanger: '#df1b41',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '12px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm isShippingValid={isShippingValid} />
    </Elements>
  );
}


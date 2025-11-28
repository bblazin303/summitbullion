"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { useUser } from '@account-kit/react';
import { ShippingAddress } from '@/types/user';

// Load Stripe outside component to avoid recreating on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Processing fee rates by payment method
const PROCESSING_FEES = {
  card: { percentage: 2.9, fixed: 0.30, label: 'Card (2.9% + $0.30)' },
  us_bank_account: { percentage: 0.8, fixed: 0, cap: 5.00, label: 'Bank (0.8%, max $5)' },
  crypto: { percentage: 1.5, fixed: 0, label: 'Crypto (1.5%)' },
  // Default fallback for unknown methods
  default: { percentage: 2.9, fixed: 0.30, label: 'Processing Fee' },
};

type PaymentMethodType = keyof typeof PROCESSING_FEES;

// Calculate processing fee based on payment method and subtotal
function calculateProcessingFee(subtotal: number, paymentMethod: PaymentMethodType): number {
  const fees = PROCESSING_FEES[paymentMethod] || PROCESSING_FEES.default;
  let fee = (subtotal * fees.percentage / 100) + fees.fixed;
  
  // Apply cap for ACH payments
  if ('cap' in fees && fees.cap && fee > fees.cap) {
    fee = fees.cap;
  }
  
  return fee;
}

/**
 * The actual payment form with Stripe Elements
 */
interface CheckoutFormProps {
  isShippingValid: boolean;
  onPaymentMethodChange: (method: PaymentMethodType) => void;
}

function CheckoutForm({ isShippingValid, onPaymentMethodChange }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Listen for payment method changes from Stripe Elements
  useEffect(() => {
    if (!elements) return;

    const paymentElement = elements.getElement('payment');
    if (!paymentElement) return;

    const handleChange = (event: { value: { type: string } }) => {
      // Map Stripe's payment method types to our fee structure
      const stripeType = event.value?.type || 'card';
      let mappedType: PaymentMethodType = 'card';
      
      if (stripeType === 'us_bank_account' || stripeType === 'ach_debit') {
        mappedType = 'us_bank_account';
      } else if (stripeType === 'crypto' || stripeType.includes('crypto')) {
        mappedType = 'crypto';
      } else if (stripeType === 'card' || stripeType === 'link' || stripeType === 'apple_pay' || stripeType === 'google_pay') {
        mappedType = 'card';
      }
      
      onPaymentMethodChange(mappedType);
    };

    paymentElement.on('change', handleChange);

    return () => {
      paymentElement.off('change', handleChange);
    };
  }, [elements, onPaymentMethodChange]);

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
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('card');
  const [baseSubtotal, setBaseSubtotal] = useState<number>(0); // Store base subtotal separately
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pricing, setPricing] = useState<{
    subtotal: number;
    deliveryFee: number;
    total: number;
    platformGoldQuote: number;
    markup: number;
    markupPercentage: number;
    processingFee: number;
  } | null>(null);

  // Handle payment method change from Stripe Elements
  const handlePaymentMethodChange = useCallback((method: PaymentMethodType) => {
    console.log('💳 Payment method changed to:', method);
    setSelectedPaymentMethod(method);
  }, []);

  // Recalculate total and update PaymentIntent when payment method changes
  useEffect(() => {
    if (!paymentIntentId || !user?.userId || baseSubtotal === 0) return;
    
    // Calculate new processing fee based on selected payment method
    const newProcessingFee = calculateProcessingFee(baseSubtotal, selectedPaymentMethod);
    const newTotal = baseSubtotal + newProcessingFee;
    
    console.log('💰 Recalculating with', selectedPaymentMethod, 'fee:', newProcessingFee.toFixed(2));
    
    // Update pricing state with new processing fee
    setPricing(prev => prev ? {
      ...prev,
      processingFee: newProcessingFee,
      total: newTotal,
    } : null);
    
    // Update the left-side summary immediately for responsive UI
    updateLeftSideSummary({
      subtotal: baseSubtotal,
      processingFee: newProcessingFee,
      total: newTotal,
      paymentMethod: selectedPaymentMethod,
    });
    
    // Update PaymentIntent on Stripe's side (in background)
    const updatePaymentIntent = async () => {
      try {
        const isEmailAuth = !user.idToken;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (!isEmailAuth && user.idToken) {
          headers['Authorization'] = `Bearer ${user.idToken}`;
        }

        const response = await fetch('/api/payments/stripe/update-payment-intent', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            authType: isEmailAuth ? 'email' : 'google',
            userId: user.userId,
            email: user.email,
            paymentIntentId: paymentIntentId,
            paymentMethodType: selectedPaymentMethod,
            subtotal: baseSubtotal,
          }),
        });

        if (!response.ok) {
          console.error('Failed to update PaymentIntent');
        } else {
          console.log('✅ PaymentIntent updated with new amount');
        }
      } catch (err) {
        console.error('Error updating PaymentIntent:', err);
      }
    };
    
    updatePaymentIntent();
  }, [selectedPaymentMethod, paymentIntentId, baseSubtotal, user?.userId, user?.idToken, user?.email]); // Re-run when payment method changes

  useEffect(() => {
    if (!user?.userId) {
      return;
    }

    // Create PaymentIntent with dynamic pricing from Platform Gold
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
            paymentMethodType: selectedPaymentMethod, // Send initial payment method
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();

        if (data.success && data.clientSecret) {
          setClientSecret(data.clientSecret);
          
          // Extract PaymentIntent ID from client secret (format: pi_xxx_secret_xxx)
          const piId = data.clientSecret.split('_secret_')[0];
          setPaymentIntentId(piId);
          
          // Store the base subtotal (before processing fee) for recalculations
          const subtotalBeforeFee = data.pricing.subtotal;
          setBaseSubtotal(subtotalBeforeFee);
          
          // Calculate initial processing fee (default to card)
          const initialProcessingFee = calculateProcessingFee(subtotalBeforeFee, 'card');
          const totalWithFee = subtotalBeforeFee + initialProcessingFee;
          
          // Store full pricing state
          setPricing({
            ...data.pricing,
            processingFee: initialProcessingFee,
            total: totalWithFee,
          });
          
          // Update the left-side summary with final price
          updateLeftSideSummary({
            subtotal: subtotalBeforeFee,
            processingFee: initialProcessingFee,
            total: totalWithFee,
            paymentMethod: 'card',
          });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, user?.idToken, shippingAddress]);
  
  // Function to update the left-side summary with final pricing
  const updateLeftSideSummary = (pricingData: { 
    subtotal: number; 
    processingFee: number; 
    total: number;
    paymentMethod: PaymentMethodType;
  }) => {
    const feeLabel = PROCESSING_FEES[pricingData.paymentMethod]?.label || 'Processing Fee';
    
    // Update desktop summary
    const summaryElement = document.getElementById('final-price-summary');
    if (summaryElement) {
      summaryElement.innerHTML = `
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between font-inter text-[14px] text-[#7c7c7c]">
            <span>Subtotal</span>
            <span>$${pricingData.subtotal.toFixed(2)}</span>
          </div>
          <div class="flex items-center justify-between font-inter text-[14px] text-[#7c7c7c]">
            <span>${feeLabel}</span>
            <span>$${pricingData.processingFee.toFixed(2)}</span>
          </div>
          <div class="pt-2 mt-1">
        <div class="flex items-center justify-between font-inter text-[18px] xl:text-[20px] 2xl:text-[24px]">
          <span class="font-semibold text-black">Total</span>
              <span class="font-bold text-black">$${pricingData.total.toFixed(2)} USD</span>
            </div>
        </div>
        <div class="text-right" style="margin-top: 2px;">
          <span class="font-inter text-[10px] text-[#7c7c7c]">Includes all fees and shipping</span>
          </div>
        </div>
      `;
    }

    // Update mobile summary
    const mobileSummaryElement = document.getElementById('mobile-final-price-summary');
    if (mobileSummaryElement) {
      mobileSummaryElement.innerHTML = `
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between font-inter text-[13px] text-[#7c7c7c]">
            <span>Subtotal</span>
            <span>$${pricingData.subtotal.toFixed(2)}</span>
          </div>
          <div class="flex items-center justify-between font-inter text-[13px] text-[#7c7c7c]">
            <span>${feeLabel}</span>
            <span>$${pricingData.processingFee.toFixed(2)}</span>
          </div>
          <div class="pt-2 mt-1">
        <div class="flex items-center justify-between font-inter text-[18px] sm:text-[20px]">
          <span class="font-semibold text-black">Total</span>
              <span class="font-bold text-black">$${pricingData.total.toFixed(2)} USD</span>
            </div>
        </div>
        <div class="text-right" style="margin-top: 2px;">
          <span class="font-inter text-[10px] text-[#7c7c7c]">Includes all fees and shipping</span>
          </div>
        </div>
      `;
    }
  };

  // Cleanup effect to prevent DOM errors when navigating back
  useEffect(() => {
    return () => {
      // Component is unmounting, no cleanup needed since React will handle the DOM
      // This just ensures we don't have any lingering references
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
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
      <CheckoutForm 
        isShippingValid={isShippingValid} 
        onPaymentMethodChange={handlePaymentMethodChange}
      />
    </Elements>
  );
}


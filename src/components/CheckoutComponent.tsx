"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useUser } from '@account-kit/react';
import StripePaymentForm from '@/components/StripePaymentForm';
import { ShippingAddressForm } from '@/components/ShippingAddressForm';
import IdentityVerification from '@/components/IdentityVerification';
import { ShippingAddress } from '@/types/user';
import { User } from '@/types/user';

const CheckoutComponent: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, isLoading } = useCart();
  const user = useUser();
  const [checkoutStep, setCheckoutStep] = useState<'address' | 'kyc' | 'payment'>('address');
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'crypto'>('credit');
  const [shippingAddress, setShippingAddress] = useState<Partial<ShippingAddress>>({
    country: 'US', // Default to US
  });
  const [shippingErrors, setShippingErrors] = useState<string[]>([]);
  const [isShippingValid, setIsShippingValid] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [kycVerified, setKycVerified] = useState(false);

  // KYC threshold
  const KYC_THRESHOLD = 3000;

  // Validate shipping address
  const validateShippingAddress = (address: Partial<ShippingAddress>): boolean => {
    const errors: string[] = [];
    
    if (!address.addressee?.trim()) {
      errors.push('Full name is required');
    }
    
    if (!address.addr1?.trim()) {
      errors.push('Street address is required');
    }
    
    if (!address.city?.trim()) {
      errors.push('City is required');
    }
    
    if (!address.state?.trim()) {
      errors.push('State is required');
    }
    
    if (!address.zip?.trim()) {
      errors.push('ZIP code is required');
    } else if (!/^\d{5}(-\d{4})?$/.test(address.zip)) {
      errors.push('ZIP code must be 5 digits (e.g., 90210)');
    }
    
    setShippingErrors(errors);
    setIsShippingValid(errors.length === 0);
    return errors.length === 0;
  };

  // Handle shipping address changes
  const handleShippingAddressChange = (address: Partial<ShippingAddress>) => {
    setShippingAddress(address);
    // Validate on change (but don't show errors until user tries to proceed)
    validateShippingAddress(address);
  };

  // Fetch user profile to check KYC status
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.email) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        const response = await fetch(`/api/user/profile?email=${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
          setKycVerified(profile.kycStatus === 'approved');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [user?.email]);

  // Calculate totals
  const deliveryFee = 15;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;

  // Check if KYC is required for this order (TEMPORARILY DISABLED)
  const requiresKyc = false; // TODO: Re-enable after admin enables Stripe Identity: subtotal >= KYC_THRESHOLD;

  // Handle "Continue to Payment" or "Continue to KYC" button
  const handleContinueToPayment = () => {
    if (validateShippingAddress(shippingAddress)) {
      // If order requires KYC and user is not verified, go to KYC step
      if (requiresKyc && !kycVerified) {
        setCheckoutStep('kyc');
      } else {
        setCheckoutStep('payment');
      }
      // Scroll to top of section
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle "Back to Address" button
  const handleBackToAddress = () => {
    setCheckoutStep('address');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle KYC verification complete
  const handleKycComplete = () => {
    setKycVerified(true);
    setCheckoutStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show loading state while cart is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffc633]"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <h2 className="font-inter font-bold text-[32px] sm:text-[42px] text-black mb-4">Your cart is empty</h2>
          <Link
            href="/marketplace"
            className="inline-block bg-[#141722] text-[#efe9e0] font-inter font-medium text-[14px] uppercase px-[28px] py-[17px] rounded-[42px] hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:from-[4.98%] hover:to-[#FFB546] hover:to-[95.02%] hover:text-black transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex-1 flex flex-col overflow-hidden">
      {/* Breadcrumb - Fixed Position */}
      <div className="px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px] pt-[120px] sm:pt-[140px] lg:pt-[160px] flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[16px] text-[rgba(0,0,0,0.6)] hover:text-black transition-colors">
            Home
          </Link>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-[-90deg]">
            <path d="M12 6L8 10L4 6" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Link href="/marketplace" className="text-[16px] text-[rgba(0,0,0,0.6)] hover:text-black transition-colors">
            Shop
          </Link>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-[-90deg]">
            <path d="M12 6L8 10L4 6" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Link href="/marketplace" className="text-[16px] text-[rgba(0,0,0,0.6)] hover:text-black transition-colors">
            Gold
          </Link>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-[-90deg]">
            <path d="M12 6L8 10L4 6" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[16px] text-[rgba(0,0,0,0.6)]">Cart</span>
        </div>
      </div>

      {/* Main Content Grid - 64px below breadcrumb */}
      <div className="flex-1 overflow-y-auto xl:overflow-hidden px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px] pt-16 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-6 md:gap-8 xl:gap-10 2xl:gap-12 xl:h-full items-start">
        {/* Left Column - Cart Items */}
        <div className="flex flex-col gap-6 xl:h-full xl:overflow-hidden">
          {/* Page Title */}
          <h1 className="font-inter font-bold text-[32px] sm:text-[36px] lg:text-[42px] leading-none flex-shrink-0">
            <span className="text-[#ffc633]">My</span>
            <span className="text-black"> Cart</span>
          </h1>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Step 1 - Shipping Address */}
            <button
              onClick={() => (checkoutStep === 'kyc' || checkoutStep === 'payment') && handleBackToAddress()}
              disabled={checkoutStep === 'address'}
              className={`flex items-center gap-2 transition-opacity ${
                checkoutStep !== 'address' ? 'cursor-pointer hover:opacity-70' : 'cursor-default'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-inter font-semibold text-[14px] transition-all ${
                checkoutStep === 'address' ? 'bg-[#141722] text-white' : 'bg-[#FFB546] text-black'
              }`}>
                {checkoutStep !== 'address' ? '✓' : '1'}
              </div>
              <span className={`hidden sm:inline font-inter text-[14px] transition-all ${
                checkoutStep === 'address' ? 'font-semibold text-black' : 'text-[#7c7c7c]'
              }`}>
                Address
              </span>
            </button>

            {/* Separator */}
            <div className="w-8 h-[2px] bg-[rgba(0,0,0,0.1)]"></div>

            {/* Step 2 - KYC (only show if required) */}
            {requiresKyc && (
              <>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-inter font-semibold text-[14px] transition-all ${
                    checkoutStep === 'kyc' ? 'bg-[#141722] text-white' : 
                    checkoutStep === 'payment' ? 'bg-[#FFB546] text-black' : 
                    'bg-[rgba(0,0,0,0.1)] text-[#7c7c7c]'
                  }`}>
                    {checkoutStep === 'payment' ? '✓' : '2'}
                  </div>
                  <span className={`hidden sm:inline font-inter text-[14px] transition-all ${
                    checkoutStep === 'kyc' ? 'font-semibold text-black' : 'text-[#7c7c7c]'
                  }`}>
                    Verify ID
                  </span>
                </div>

                {/* Separator */}
                <div className="w-8 h-[2px] bg-[rgba(0,0,0,0.1)]"></div>
              </>
            )}

            {/* Step 3 (or 2 if no KYC) - Payment */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-inter font-semibold text-[14px] transition-all ${
                checkoutStep === 'payment' ? 'bg-[#141722] text-white' : 'bg-[rgba(0,0,0,0.1)] text-[#7c7c7c]'
              }`}>
                {requiresKyc ? '3' : '2'}
              </div>
              <span className={`hidden sm:inline font-inter text-[14px] transition-all ${
                checkoutStep === 'payment' ? 'font-semibold text-black' : 'text-[#7c7c7c]'
              }`}>
                Payment
              </span>
            </div>
          </div>

          {/* Table Headers - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] gap-4 pb-4 border-b border-[rgba(0,0,0,0.1)] items-center flex-shrink-0">
            <p className="font-inter font-normal text-[16px] sm:text-[20px] text-[rgba(0,0,0,0.6)]">Product</p>
            <p className="font-inter font-normal text-[16px] sm:text-[20px] text-[rgba(0,0,0,0.6)] text-center">Quantity</p>
            <p className="font-inter font-normal text-[16px] sm:text-[20px] text-[rgba(0,0,0,0.6)] text-center">Price</p>
          </div>

          {/* Cart Items - Scrollable after 2.25 items */}
          <div className={`flex flex-col gap-6 ${cart.length > 2 ? 'overflow-y-auto max-h-[400px] sm:max-h-[450px] md:max-h-[500px] xl:max-h-[550px] pr-2 checkout-scrollbar' : ''}`}>
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-4 items-center pb-6 border-b border-[rgba(0,0,0,0.1)]">
                {/* Product Info */}
                <div className="flex gap-3 md:gap-4 min-w-0">
                  <div className="bg-[#f0eeed] rounded-[6px] w-[60px] sm:w-[70px] md:w-[90px] h-[60px] sm:h-[70px] md:h-[90px] flex-shrink-0 overflow-hidden p-2">
                    <div className="relative w-full h-full">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-2 min-w-0 flex-1">
                    <h3 className="font-inter font-semibold text-[16px] sm:text-[20px] md:text-[24px] text-black leading-tight overflow-hidden text-ellipsis" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {item.name}
                    </h3>
                    <div className="flex flex-col gap-1">
                      <p className="font-inter font-normal text-[10px] text-black">
                        <span className="text-[rgba(0,0,0,0.6)]">Material: </span>Gold
                      </p>
                      <p className="font-inter font-normal text-[10px] text-black">
                        <span className="text-[rgba(0,0,0,0.6)]">Weight: </span>1000kg
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex justify-start md:justify-center">
                  <div className="border border-[#dfdfdf] rounded-full flex items-center gap-3 px-3 py-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex items-center justify-center w-[32px] h-[32px] rounded-full text-black text-[16px] font-medium hover:bg-[#f7f7f7] hover:text-[#ffb546] transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <span className="font-satoshi text-[14px] text-black min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex items-center justify-center w-[32px] h-[32px] rounded-full text-black text-[16px] font-medium hover:bg-[#f7f7f7] hover:text-[#ffb546] transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price & Remove */}
                <div className="flex items-center md:justify-center relative">
                  <div className="flex flex-col gap-1">
                    <p className="font-inter font-medium text-[14px] sm:text-[16px] text-black">
                      ${(item.pricing.finalPrice * item.quantity).toFixed(2)} USD
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#ff3333] hover:text-[#cc0000] transition-colors p-2 absolute right-0"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Mobile Summary - Shows on mobile/tablet, hidden on desktop */}
          <div className="flex xl:hidden flex-col gap-3 flex-shrink-0 pt-6 border-t border-[rgba(0,0,0,0.1)]">
            {checkoutStep === 'address' ? (
              <>
                {/* Address Step - Show Estimated */}
                <div className="flex items-center justify-between font-inter text-[18px] sm:text-[20px]">
                  <span className="font-semibold text-black">Estimated Total</span>
                  <span className="font-bold text-black">${subtotal.toFixed(2)} USD</span>
                </div>
              </>
            ) : (
              <>
                {/* Payment Step - Show Final Price (will be updated by StripePaymentForm) */}
                <div key="mobile-payment-summary" id="mobile-final-price-summary" className="flex flex-col">
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-[#141722] border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 font-inter text-[14px] text-[#7c7c7c]">Calculating final price...</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Summary & Continue Shopping - Desktop Only */}
          <div className="hidden xl:flex flex-col 2xl:flex-row items-start 2xl:items-end justify-between gap-6 flex-shrink-0 pt-6 border-t border-[rgba(0,0,0,0.1)]">
            {/* Summary */}
            <div className="flex flex-col gap-3 xl:gap-4 w-full 2xl:min-w-[400px] 2xl:w-auto 2xl:order-2">
              {checkoutStep === 'address' ? (
                <>
                  {/* Address Step - Show Estimated */}
                  <div className="flex items-center justify-between font-inter text-[18px] xl:text-[20px] 2xl:text-[24px]">
                    <span className="font-semibold text-black">Estimated Total</span>
                    <span className="font-bold text-black">${subtotal.toFixed(2)} USD</span>
                  </div>
                </>
              ) : (
                <>
                  {/* Payment Step - Show Final Price (will be updated by StripePaymentForm) */}
                  <div key="payment-summary" id="final-price-summary" className="flex flex-col">
                    <div className="flex items-center justify-center py-4">
                      <div className="w-6 h-6 border-2 border-[#141722] border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 font-inter text-[14px] text-[#7c7c7c]">Calculating final price...</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Continue Shopping Button */}
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center gap-2 border border-[#dfdfdf] rounded-[42px] px-[28px] py-[17px] font-inter font-medium text-[14px] text-black uppercase hover:border-black transition-colors whitespace-nowrap w-full 2xl:w-auto 2xl:order-1"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* Continue Shopping Button - Mobile Only */}
          <Link
            href="/marketplace"
            className="flex xl:hidden items-center justify-center gap-2 border border-[#dfdfdf] rounded-[42px] px-[28px] py-[17px] font-inter font-medium text-[14px] text-black uppercase hover:border-black transition-colors w-full"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* Right Column - Address or Payment Section */}
        <div className="w-full xl:h-full xl:overflow-y-auto xl:pr-2 checkout-scrollbar">
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[18px] md:rounded-[24px] p-4 sm:p-5 md:p-6">
            
            {/* STEP 1: Shipping Address */}
            {checkoutStep === 'address' && (
              <>
                <h2 className="font-inter font-semibold text-[18px] sm:text-[20px] md:text-[24px] text-black mb-2">
                  Shipping Address
                </h2>
                <p className="font-inter font-normal text-[11px] sm:text-[12px] text-[#8a8a8a] mb-6">
                  Enter your delivery information
                </p>

                {/* Shipping Address Form */}
                <div className="mb-6">
                  <ShippingAddressForm
                    value={shippingAddress}
                    onChange={handleShippingAddressChange}
                    errors={shippingErrors}
                  />
                </div>

                {/* KYC Notice (if order requires KYC) */}
                {requiresKyc && !kycVerified && (
                  <div className="mb-6 bg-[#fff9e6] border border-[#ffb546]/30 rounded-[12px] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#ffb546"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-inter font-semibold text-[13px] text-[#141722] mb-1">
                          Identity Verification Required
                        </h4>
                        <p className="font-inter text-[12px] text-[#7c7c7c]">
                          Your order total exceeds $3,000. You&apos;ll need to verify your identity on the next step.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Continue Button */}
                <button
                  onClick={handleContinueToPayment}
                  disabled={!isShippingValid}
                  className="w-full bg-[#141722] text-[#efe9e0] font-inter font-medium text-[14px] uppercase py-[17px] rounded-[42px] hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:to-[#FFB546] hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {requiresKyc && !kycVerified ? 'Continue to Verification' : 'Continue to Payment'}
                </button>
              </>
            )}

            {/* STEP 2: Identity Verification (KYC) */}
            {checkoutStep === 'kyc' && (
              <>
                <h2 className="font-inter font-semibold text-[18px] sm:text-[20px] md:text-[24px] text-black mb-2">
                  Identity Verification
                </h2>
                <p className="font-inter font-normal text-[11px] sm:text-[12px] text-[#8a8a8a] mb-6">
                  Verify your identity to complete this order
                </p>

                {/* Identity Verification Component */}
                <div className="mb-6">
                  <IdentityVerification
                    onVerificationComplete={handleKycComplete}
                    onVerificationError={(error) => {
                      console.error('KYC verification error:', error);
                    }}
                  />
                </div>

                {/* Back to Address Button */}
                <button
                  onClick={handleBackToAddress}
                  className="w-full border border-[#dfdfdf] text-[#141722] font-inter font-medium text-[14px] uppercase py-[17px] rounded-[42px] hover:border-black transition-colors"
                >
                  Back to Address
                </button>
              </>
            )}

            {/* STEP 3: Payment Method */}
            {checkoutStep === 'payment' && (
              <>
                <h2 className="font-inter font-semibold text-[18px] sm:text-[20px] md:text-[24px] text-black mb-2">
                  Payment Method
                </h2>
                <p className="font-inter font-normal text-[11px] sm:text-[12px] text-[#8a8a8a] mb-6">
                  Choose your preferred method of payment
                </p>

            {/* Stripe Payment Element with all payment methods */}
            <StripePaymentForm
              shippingAddress={shippingAddress}
              isShippingValid={isShippingValid}
            />
              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutComponent;


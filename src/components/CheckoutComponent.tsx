"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

// Import payment icons
import VisaLogo from '/public/images/icons/Visa.svg';
import MastercardLogo from '/public/images/icons/Mastercard.svg';
import PaypalLogo from '/public/images/icons/Paypal.svg';
import ApplePayLogo from '/public/images/icons/ApplePay.svg';
import GooglePayLogo from '/public/images/icons/GooglePay.svg';
import SolLogo from '/public/images/icons/sol-logo.svg';

const CheckoutComponent: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'crypto'>('credit');
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 25 });

  console.log('CheckoutComponent rendered');
  console.log('Cart contents:', cart);
  console.log('Cart count:', getCartCount());

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => String(num).padStart(2, '0');
  const deliveryFee = 15;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;

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

          {/* Table Headers - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] gap-4 pb-4 border-b border-[rgba(0,0,0,0.1)] items-center flex-shrink-0">
            <p className="font-inter font-normal text-[16px] sm:text-[20px] text-[rgba(0,0,0,0.6)]">Product</p>
            <p className="font-inter font-normal text-[16px] sm:text-[20px] text-[rgba(0,0,0,0.6)] text-center">Quantity</p>
            <p className="font-inter font-normal text-[16px] sm:text-[20px] text-[rgba(0,0,0,0.6)] text-center">Price</p>
          </div>

          {/* Cart Items - Scrollable when more than 3 items */}
          <div className={`flex flex-col gap-6 ${cart.length > 3 ? 'xl:overflow-y-auto xl:flex-1 xl:pr-4 checkout-scrollbar' : ''}`}>
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
                    <div className="flex items-center gap-1">
                      <div className="relative w-[12px] h-[12px]">
                        <Image
                          src={SolLogo}
                          alt="SOL"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-inter font-medium text-[12px] text-[#8a8a8a]">
                        186.8862
                      </span>
                    </div>
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

          {/* Summary & Continue Shopping - Desktop Only */}
          <div className="hidden xl:flex flex-col 2xl:flex-row items-start 2xl:items-end justify-between gap-6 flex-shrink-0">
            {/* Summary */}
            <div className="flex flex-col gap-3 xl:gap-4 w-full 2xl:min-w-[400px] 2xl:w-auto 2xl:order-2">
              <div className="flex items-center justify-between font-inter font-semibold text-[18px] xl:text-[20px] 2xl:text-[24px]">
                <span className="text-black">Subtotal</span>
                <span className="text-[#8a8a8a]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between font-inter font-semibold text-[18px] xl:text-[20px] 2xl:text-[24px]">
                <span className="text-black">Delivery Fee</span>
                <span className="text-[#8a8a8a]">${deliveryFee}</span>
              </div>
              <div className="border-t border-[rgba(0,0,0,0.1)] pt-3 xl:pt-4">
                <div className="flex items-center justify-between font-inter text-[18px] xl:text-[20px] 2xl:text-[24px]">
                  <span className="font-semibold text-black">Total</span>
                  <span className="font-bold text-black">${total.toFixed(2)} USD</span>
                </div>
              </div>
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

        {/* Right Column - Payment Section */}
        <div className="w-full xl:h-full xl:overflow-y-auto xl:pr-2 checkout-scrollbar">
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[18px] md:rounded-[24px] p-4 sm:p-5 md:p-6">
            {/* Delivery Timer */}
            <div className="bg-white border border-neutral-200 rounded-[62px] h-[34px] px-3 sm:px-5 flex items-center mb-4 md:mb-6 overflow-hidden">
              <p className="font-inter font-normal text-[12px] sm:text-[14px] text-[#141722] whitespace-nowrap overflow-hidden text-ellipsis">
                Order in <span className="font-bold text-[#ff3333]">{formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}</span> to get next day delivery
              </p>
            </div>

            {/* Payment Method */}
            <div className="mb-4 md:mb-6">
              <h2 className="font-inter font-semibold text-[18px] sm:text-[20px] md:text-[24px] text-black mb-2">Payment Method</h2>
              <p className="font-inter font-normal text-[11px] sm:text-[12px] text-[#8a8a8a] mb-4">Choose your preferred method of payment</p>
            </div>

            <div className="border-t border-[rgba(0,0,0,0.1)] pt-6 mb-0"></div>

            {/* Payment Options */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'credit' ? 'border-[#1a1a1a]' : 'border-[#cccccc]'}`}>
                  {paymentMethod === 'credit' && <div className="w-3 h-3 rounded-full bg-[#1a1a1a]"></div>}
                </div>
                <input
                  type="radio"
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={() => setPaymentMethod('credit')}
                  className="sr-only"
                />
                <span className="font-inter font-medium text-[12px] sm:text-[13px] text-[#1a1a1a]">Pay with Credit Card</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'crypto' ? 'border-[#1a1a1a]' : 'border-[#cccccc]'}`}>
                  {paymentMethod === 'crypto' && <div className="w-3 h-3 rounded-full bg-[#1a1a1a]"></div>}
                </div>
                <input
                  type="radio"
                  value="crypto"
                  checked={paymentMethod === 'crypto'}
                  onChange={() => setPaymentMethod('crypto')}
                  className="sr-only"
                />
                <span className="font-inter font-medium text-[12px] sm:text-[13px] text-[#1a1a1a]">Pay with Crypto</span>
              </label>
            </div>

            {/* Payment Logos */}
            <div className="flex items-center gap-2 sm:gap-3 mb-6 flex-wrap">
              <div className="relative w-[40px] sm:w-[46px] h-[26px] sm:h-[30px]">
                <Image src={VisaLogo} alt="Visa" fill className="object-contain" />
              </div>
              <div className="relative w-[40px] sm:w-[46px] h-[26px] sm:h-[30px]">
                <Image src={MastercardLogo} alt="Mastercard" fill className="object-contain" />
              </div>
              <div className="relative w-[40px] sm:w-[46px] h-[26px] sm:h-[30px]">
                <Image src={PaypalLogo} alt="PayPal" fill className="object-contain" />
              </div>
              <div className="relative w-[40px] sm:w-[46px] h-[26px] sm:h-[30px]">
                <Image src={ApplePayLogo} alt="Apple Pay" fill className="object-contain" />
              </div>
              <div className="relative w-[40px] sm:w-[46px] h-[26px] sm:h-[30px]">
                <Image src={GooglePayLogo} alt="Google Pay" fill className="object-contain" />
              </div>
            </div>

            {/* Card Details */}
            <div className="mb-6">
              <label className="block font-inter font-normal text-[12px] text-[#141722] mb-2 px-3">
                Card Details
              </label>
              <div className="border border-[rgba(0,0,0,0.1)] rounded-[12px] px-4 py-3 flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="#8a8a8a" strokeWidth="2"/>
                  <path d="M2 10H22" stroke="#8a8a8a" strokeWidth="2"/>
                </svg>
                <input
                  type="text"
                  placeholder="Add a credit card"
                  className="flex-1 font-inter font-normal text-[12px] text-black placeholder:text-[#8a8a8a] outline-none bg-transparent"
                />
                <input
                  type="text"
                  placeholder="MM"
                  maxLength={2}
                  className="w-[30px] font-inter font-normal text-[12px] text-black placeholder:text-[#8a8a8a] outline-none bg-transparent text-center"
                />
                <input
                  type="text"
                  placeholder="YY"
                  maxLength={2}
                  className="w-[30px] font-inter font-normal text-[12px] text-black placeholder:text-[#8a8a8a] outline-none bg-transparent text-center"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  maxLength={3}
                  className="w-[40px] font-inter font-normal text-[12px] text-black placeholder:text-[#8a8a8a] outline-none bg-transparent text-center"
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="mb-6">
              <label className="block font-inter font-normal text-[12px] text-[#141722] mb-2 px-3">
                Billing Address
              </label>
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Street Address"
                  className="flex-1 border border-[rgba(0,0,0,0.1)] rounded-[12px] px-4 py-3 font-inter font-normal text-[12px] text-[#8a8a8a] outline-none focus:border-[#ffb546] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Apt"
                  className="w-[120px] border border-[rgba(0,0,0,0.1)] rounded-[12px] px-4 py-3 font-inter font-normal text-[12px] text-[#8a8a8a] outline-none focus:border-[#ffb546] transition-colors"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  className="border border-[rgba(0,0,0,0.1)] rounded-[12px] px-4 py-3 font-inter font-normal text-[12px] text-[#8a8a8a] outline-none focus:border-[#ffb546] transition-colors"
                />
                <input
                  type="text"
                  placeholder="State"
                  className="border border-[rgba(0,0,0,0.1)] rounded-[12px] px-4 py-3 font-inter font-normal text-[12px] text-[#8a8a8a] outline-none focus:border-[#ffb546] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Zip"
                  className="border border-[rgba(0,0,0,0.1)] rounded-[12px] px-4 py-3 font-inter font-normal text-[12px] text-[#8a8a8a] outline-none focus:border-[#ffb546] transition-colors"
                />
              </div>
            </div>

            <div className="border-t border-[rgba(0,0,0,0.1)] pt-6 mb-0"></div>

            {/* Mobile Summary */}
            <div className="flex flex-col gap-3 mb-6 xl:hidden">
              <div className="flex items-center justify-between font-inter font-semibold text-[16px] sm:text-[18px]">
                <span className="text-black">Subtotal</span>
                <span className="text-[#8a8a8a]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between font-inter font-semibold text-[16px] sm:text-[18px]">
                <span className="text-black">Delivery Fee</span>
                <span className="text-[#8a8a8a]">${deliveryFee}</span>
              </div>
              <div className="border-t border-[rgba(0,0,0,0.1)] pt-3">
                <div className="flex items-center justify-between font-inter text-[18px] sm:text-[20px]">
                  <span className="font-semibold text-black">Total</span>
                  <span className="font-bold text-black">${total.toFixed(2)} USD</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button className="w-full bg-[#141722] text-[#efe9e0] font-inter font-medium text-[14px] uppercase py-[17px] rounded-[42px] hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:from-[4.98%] hover:to-[#FFB546] hover:to-[95.02%] hover:text-black transition-all duration-300 cursor-pointer">
              Checkout
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutComponent;


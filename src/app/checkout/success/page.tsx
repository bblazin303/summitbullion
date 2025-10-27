"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  useEffect(() => {
    const session_id = searchParams?.get('session_id');
    setSessionId(session_id);
    
    // Clear cart from local state (Firebase cart already cleared by webhook)
    // The CartContext will reload from Firebase and show empty cart
  }, [searchParams]);
  
  return (
    <div className="min-h-screen bg-[#fcf8f1] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-[24px] shadow-[0_8px_31.1px_-9px_rgba(0,0,0,0.25)] p-8 md:p-12 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-[#FFF0C1] to-[#FFB546] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-[#141722]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        {/* Success Message */}
        <h1 className="font-inter font-bold text-[32px] md:text-[40px] text-black mb-4">
          Payment Successful!
        </h1>
        
        <p className="font-inter font-normal text-[16px] md:text-[18px] text-[#7c7c7c] mb-8">
          Thank you for your order. It is now being processed and you will receive a confirmation email shortly with tracking information.
        </p>
        
        {sessionId && (
          <p className="font-inter font-normal text-[14px] text-[#7c7c7c] mb-8">
            Order Reference: <span className="font-mono text-black">{sessionId.slice(-12)}</span>
          </p>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="px-8 py-4 bg-[#141722] text-[#efe9e0] font-inter font-medium text-[14px] uppercase rounded-full hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:to-[#FFB546] hover:text-black transition-all duration-300"
          >
            View Orders
          </Link>
          
          <Link
            href="/marketplace"
            className="px-8 py-4 bg-white border-2 border-[#141722] text-[#141722] font-inter font-medium text-[14px] uppercase rounded-full hover:bg-[#141722] hover:text-[#efe9e0] transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
        
        {/* What's Next */}
        <div className="mt-12 pt-8 border-t border-[rgba(0,0,0,0.1)]">
          <h2 className="font-inter font-semibold text-[20px] text-black mb-4">
            What Happens Next?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div>
              <div className="w-10 h-10 bg-[#fcf8f1] rounded-full flex items-center justify-center mb-3">
                <span className="font-inter font-bold text-[18px] text-black">1</span>
              </div>
              <h3 className="font-inter font-semibold text-[16px] text-black mb-2">
                Order Confirmation
              </h3>
              <p className="font-inter font-normal text-[14px] text-[#7c7c7c]">
                Check your email for order details and receipt
              </p>
            </div>
            
            <div>
              <div className="w-10 h-10 bg-[#fcf8f1] rounded-full flex items-center justify-center mb-3">
                <span className="font-inter font-bold text-[18px] text-black">2</span>
              </div>
              <h3 className="font-inter font-semibold text-[16px] text-black mb-2">
                Processing
              </h3>
              <p className="font-inter font-normal text-[14px] text-[#7c7c7c]">
                We&apos;ll prepare your precious metals for shipment
              </p>
            </div>
            
            <div>
              <div className="w-10 h-10 bg-[#fcf8f1] rounded-full flex items-center justify-center mb-3">
                <span className="font-inter font-bold text-[18px] text-black">3</span>
              </div>
              <h3 className="font-inter font-semibold text-[16px] text-black mb-2">
                Shipping
              </h3>
              <p className="font-inter font-normal text-[14px] text-[#7c7c7c]">
                Secure delivery with tracking information
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


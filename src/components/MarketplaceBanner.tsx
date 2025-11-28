"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

const MarketplaceBanner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(contentRef.current, {
        opacity: 0,
        y: 50
      });

      // Animate content in
      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power2.out",
        delay: 0.5
      });

    }, bannerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={bannerRef} className="relative w-full px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px]">
      <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[504px] rounded-[20px] sm:rounded-[24px] lg:rounded-[33px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/inventory-banner.png"
            alt="Marketplace banner"
            fill
            className="object-cover object-left sm:object-center"
            priority
          />
        </div>

        {/* Content Container */}
        <div 
          ref={contentRef}
          style={{ opacity: 0, transform: 'translateY(50px)' }}
          className="relative h-full flex items-start lg:items-center px-6 sm:px-12 lg:px-[66px] py-8 sm:py-12 lg:py-[66px]"
        >
          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-[36px] max-w-[776px] w-full">
            {/* Heading */}
            <h1 className="font-inter font-semibold text-[28px] sm:text-[48px] lg:text-[72px] leading-[1.03] text-white tracking-[-1.5px] lg:tracking-[-2.16px] [text-shadow:rgba(0,0,0,0.25)_0px_2px_9.1px]">
              <span className="text-[#ffc633]">Modern wealth</span> starts with timeless assets
            </h1>

            {/* Stats */}
            <div className="flex flex-row flex-wrap gap-4 sm:gap-8 lg:gap-[103px]">
              {/* Stat 1 */}
              <div className="flex flex-col gap-1 sm:gap-3">
                <div className="font-inter font-semibold text-[20px] sm:text-[32px] lg:text-[36px] text-white tracking-[-0.8px] lg:tracking-[-1.08px] leading-none">
                  100%
                </div>
                <div className="font-inter font-medium text-[11px] sm:text-[15px] lg:text-[17px] text-[rgba(255,255,255,0.72)] leading-[1.3]">
                  Satisfaction Guarantee
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col gap-1 sm:gap-3">
                <div className="font-inter font-semibold text-[20px] sm:text-[32px] lg:text-[36px] text-white tracking-[-0.8px] lg:tracking-[-1.08px] leading-none">
                  99.9%
                </div>
                <div className="font-inter font-medium text-[11px] sm:text-[15px] lg:text-[17px] text-[rgba(255,255,255,0.72)] leading-[1.3]">
                  Purity Metals
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col gap-1 sm:gap-3">
                <div className="font-inter font-semibold text-[20px] sm:text-[32px] lg:text-[36px] text-white tracking-[-0.8px] lg:tracking-[-1.08px] leading-none">
                  2700+
                </div>
                <div className="font-inter font-medium text-[11px] sm:text-[15px] lg:text-[17px] text-[rgba(255,255,255,0.72)] leading-[1.3]">
                  Products Available
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <button className="bg-gradient-to-br from-[#FFF0C1] from-[4.98%] to-[#FFB546] to-[95.02%] px-12 sm:px-16 lg:px-[70px] py-3 sm:py-4 lg:py-[17.5px] rounded-full font-inter font-medium text-[12px] sm:text-[13px] lg:text-[14px] uppercase text-black hover:shadow-lg transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceBanner;


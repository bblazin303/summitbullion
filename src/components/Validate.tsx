"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';

// Import why-buy images
import WhyBuyImage from '/public/images/why-buy-image.png';
import WhyBuyImageMobile from '/public/images/why-buy-image-mobile.png';

// Import checkmark icon
import CheckmarkIcon from '/public/images/icons/checkmark.svg';

const Validate: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const desktopContentRef = useRef<HTMLDivElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(cardRef.current, {
        backgroundPosition: 'center bottom',
        backgroundSize: 'cover'
      });

      gsap.set([desktopContentRef.current, mobileContentRef.current, featuresRef.current], {
        opacity: 0,
        y: 30
      });

      // Create intersection observer for scroll-triggered animation
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Animate background image sliding up
              gsap.to(cardRef.current, {
                backgroundPosition: 'center center',
                duration: 1.5,
                ease: "power2.out"
              });

              // Animate content elements
              gsap.to([desktopContentRef.current, mobileContentRef.current], {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                delay: 0.3
              });

              // Animate feature cards
              gsap.to(featuresRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                delay: 0.6
              });

              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => observer.disconnect();
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  const benefits = [
    "Competitive pricing",
    "Established reputation", 
    "World-class service",
    "Knowledgeable Traders",
    "Extensive inventory",
    "Secure & Confidential"
  ];

  const features = [
    "Portfolio Diversification",
    "Inflation Protection", 
    "Economic Stability"
  ];

  return (
    <div ref={sectionRef} className="bg-[#fcf8f1] relative w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px]">
      {/* Main Card */}
      <div 
        ref={cardRef}
        className="bg-white rounded-[24px] sm:rounded-[52px] max-w-7xl mx-auto relative overflow-hidden"
      >
        {/* Responsive Background Styles */}
        <style jsx>{`
          .responsive-bg {
            background-repeat: no-repeat;
          }
          
          @media (min-width: 1024px) {
            .responsive-bg {
              background-image: url(${WhyBuyImage.src}) !important;
              background-position: right center !important;
              background-size: auto 100% !important;
            }
          }
          
          @media (max-width: 1023px) {
            .responsive-bg {
              background-image: url(${WhyBuyImageMobile.src}) !important;
              background-position: center bottom !important;
              background-size: cover !important;
            }
          }
        `}</style>

        {/* Content Container */}
        <div className="responsive-bg relative w-full max-h-[800px]">
          {/* Desktop Layout */}
          <div ref={desktopContentRef} style={{ opacity: 0, transform: 'translateY(30px)' }} className="hidden lg:flex flex-row items-center gap-0 relative min-h-[374px]">
            {/* Left Content */}
            <div className="flex flex-col gap-8 flex-shrink-0 pl-16 pr-8 py-12 relative z-10">
              {/* Title */}
              <h2 className="font-inter font-semibold text-[42px] leading-[1.1] whitespace-nowrap">
                <span className="text-[#ffb546]">Why buy </span>
                <span className="text-black">from us?</span>
              </h2>

              {/* Benefits List */}
              <div className="flex gap-2">
                <ul className="space-y-3 flex-shrink-0">
                  {benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3 whitespace-nowrap bg-white/70 backdrop-blur-sm rounded-full px-4 py-2">
                      <div className="relative w-5 h-5 flex-shrink-0">
                        <Image
                          src={CheckmarkIcon}
                          alt="Checkmark"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-inter font-medium text-[20px] text-[#494949] leading-[1.4]">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-3 flex-shrink-0">
                  {benefits.slice(3, 6).map((benefit, index) => (
                    <li key={index + 3} className="flex items-center gap-3 whitespace-nowrap bg-white/70 backdrop-blur-sm rounded-full px-4 py-2">
                      <div className="relative w-5 h-5 flex-shrink-0">
                        <Image
                          src={CheckmarkIcon}
                          alt="Checkmark"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-inter font-medium text-[20px] text-[#494949] leading-[1.4]">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Read More Button */}
              <Link href="/docs" className="inline-flex px-7 py-[18px] justify-center items-center gap-[10px] rounded-[42px] bg-gradient-to-br from-[#FFF0C1] from-[4.98%] to-[#FFB546] to-[95.02%] font-inter font-medium text-[14.4px] uppercase tracking-wider text-black hover:shadow-lg transition-all duration-300 w-fit whitespace-nowrap cursor-pointer">
               Learn More
              </Link>
            </div>
          </div>

          {/* Mobile Layout */}
          <div ref={mobileContentRef} style={{ opacity: 0, transform: 'translateY(30px)' }} className="lg:hidden flex flex-col pt-8 px-8 sm:pt-12 sm:px-12">
            {/* Title */}
            <h2 className="font-inter font-semibold text-[32px] sm:text-[36px] leading-[1.1] mb-8">
              <span className="text-[#ffb546]">Why buy </span>
              <span className="text-black">from us?</span>
            </h2>

            {/* Benefits List - Single Column on Mobile */}
            <div className="flex flex-col gap-3 items-start">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
                  <div className="relative w-5 h-5 flex-shrink-0">
                    <Image
                      src={CheckmarkIcon}
                      alt="Checkmark"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-inter font-medium text-[20px] text-[#494949] leading-[1.4]">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Image Spacer - ensures full image is visible */}
          <div className="lg:hidden w-full" style={{ paddingBottom: '100%' }} />
        </div>
      </div>

      {/* Feature Cards */}
      <div ref={featuresRef} style={{ opacity: 0, transform: 'translateY(30px)' }} className="flex flex-col lg:flex-row gap-4 lg:gap-8 justify-center items-center mt-4 sm:mt-12 lg:mt-16 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-[14px] px-5 py-4 flex items-center justify-center gap-3 w-full lg:w-auto lg:min-w-[288px]">
            {/* Checkmark Icon */}
            <div className="relative w-6 h-6 flex-shrink-0">
              <Image
                src={CheckmarkIcon}
                alt="Checkmark"
                fill
                className="object-contain"
              />
            </div>
            
            {/* Feature Text */}
            <span className="font-inter font-medium text-[16px] sm:text-[18px] text-[#7c7c7c] leading-[1.4]">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Validate;

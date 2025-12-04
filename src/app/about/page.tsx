"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { gsap } from 'gsap';

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([heroRef.current, contentRef.current], {
        opacity: 0,
        y: 40
      });

      gsap.to(heroRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.3
      });

      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.5
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="bg-[#fcf8f1] min-h-screen">
      <NavBar />

      {/* Hero Section */}
      <div 
        ref={heroRef}
        style={{ opacity: 0, transform: 'translateY(40px)' }}
        className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px]"
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="font-inter font-semibold text-[40px] sm:text-[56px] lg:text-[72px] leading-[1.05] tracking-[-2px]">
            <span className="text-[#ffb546]">About</span>{" "}
            <span className="text-[#141722]">Summit Bullion</span>
          </h1>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        style={{ opacity: 0, transform: 'translateY(40px)' }}
        className="px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px] pb-24"
      >
        <div className="max-w-3xl mx-auto">
          {/* Intro */}
          <div className="mb-16">
            <p className="font-inter text-[18px] sm:text-[20px] text-[#141722] leading-[1.8]">
              Summit Bullion Inc. is a U.S.-based physical precious metals distributor, founded in 2023 to make buying gold and silver straightforward, transparent, and reliable.
            </p>
            <p className="font-inter text-[18px] sm:text-[20px] text-[#141722] leading-[1.8] mt-6">
              We work with established U.S. mints, refineries, and wholesale distributors to offer a curated selection of investment-grade coins and bars. Through our online platform, customers can easily browse products, compare options, and place orders with the modern e-commerce experience they expect, followed by the insured, direct shipment of their metal.
            </p>
          </div>

          {/* Divider */}
          <div className="w-24 h-[3px] bg-[#ffb546] mb-16"></div>

          {/* Modern Approach */}
          <div className="mb-16">
            <h2 className="font-inter font-semibold text-[28px] sm:text-[36px] text-[#141722] leading-[1.2] mb-8">
              A Modern Approach to a Timeless Asset
            </h2>
            <p className="font-inter font-medium text-[22px] sm:text-[28px] text-[#ffb546] leading-[1.4] mb-6">
              Our focus is simple: real metal, zero guesswork.
            </p>
            <p className="font-inter text-[17px] sm:text-[18px] text-[#7c7c7c] leading-[1.8]">
              We&apos;re building a modern platform around that core idea. Clear product information, intuitive ordering, responsive support, and processes designed for investors who want physical bullion as part of their long-term plan.
            </p>
          </div>

          {/* Trust Section */}
          <div className="mb-16">
            <h2 className="font-inter font-semibold text-[28px] sm:text-[36px] text-[#141722] leading-[1.2] mb-8">
              Trust and Reliability First
            </h2>
            <p className="font-inter text-[17px] sm:text-[18px] text-[#7c7c7c] leading-[1.8] mb-8">
              At Summit Bullion, trust and reliability are the foundation of everything we do:
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-[#ffb546] rounded-full mt-3 flex-shrink-0"></span>
                <span className="font-inter text-[17px] sm:text-[18px] text-[#141722] leading-[1.8]">
                  Transparent pricing and fees
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-[#ffb546] rounded-full mt-3 flex-shrink-0"></span>
                <span className="font-inter text-[17px] sm:text-[18px] text-[#141722] leading-[1.8]">
                  Consistent communication from order to delivery
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-[#ffb546] rounded-full mt-3 flex-shrink-0"></span>
                <span className="font-inter text-[17px] sm:text-[18px] text-[#141722] leading-[1.8]">
                  Relationships built for the long term, not one-time transactions
                </span>
              </li>
            </ul>

            <p className="font-inter text-[17px] sm:text-[18px] text-[#7c7c7c] leading-[1.8]">
              We believe the future of metals investing belongs to companies that respect what gold and silver have always been—tangible stores of value—and simply make it easier for investors to access them.
            </p>
          </div>

          {/* Divider */}
          <div className="w-24 h-[3px] bg-[#ffb546] mb-16"></div>

          {/* Tokenization */}
          <div className="mb-16">
            <h2 className="font-inter font-semibold text-[28px] sm:text-[36px] text-[#141722] leading-[1.2] mb-8">
              Our Tokenization Roadmap
            </h2>
            <p className="font-inter text-[17px] sm:text-[18px] text-[#7c7c7c] leading-[1.8] mb-6">
              In addition to our core physical business, Summit Bullion has released a roadmap for how we plan to tokenize select metals in our portfolio in the future.
            </p>
            <p className="font-inter text-[17px] sm:text-[18px] text-[#7c7c7c] leading-[1.8] mb-8">
              The vision is straightforward:
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-[#ffb546] rounded-full mt-3 flex-shrink-0"></span>
                <span className="font-inter text-[17px] sm:text-[18px] text-[#141722] leading-[1.8]">
                  This tokenized layer is designed to enhance access and liquidity for the digital ecosystem, not to outright replace the option of receiving direct physical delivery.
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-[#ffb546] rounded-full mt-3 flex-shrink-0"></span>
                <span className="font-inter text-[17px] sm:text-[18px] text-[#141722] leading-[1.8]">
                  Any tokenization initiative will be built around regulatory compliance, independent audits, and clear segregation of customer assets inside a bankruptcy proof structure.
                </span>
              </li>
            </ul>

            <p className="font-inter text-[17px] sm:text-[18px] text-[#7c7c7c] leading-[1.8]">
              Today, we are a physical precious metals company first and foremost. Our roadmap carries those same metals into the modern digital financial system without ever compromising on trust, custody, or ownership.
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[#141722]/10 mb-16"></div>

          {/* Sign-off */}
          <div className="text-center py-8">
            <p className="font-inter font-semibold text-[24px] sm:text-[32px] text-[#141722] leading-[1.3] mb-4">
              Precious Metals For The Next Generation
            </p>
            <p className="font-inter font-medium text-[16px] text-[#7c7c7c]">
              Summit Bullion Inc.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link 
              href="/marketplace" 
              className="inline-flex px-10 py-4 justify-center items-center rounded-[59px] bg-gradient-to-br from-[#FFF0C1] from-[4.98%] to-[#FFB546] to-[95.02%] font-inter font-medium text-[14px] uppercase tracking-wider text-black hover:shadow-lg transition-all duration-300"
            >
              Shop Inventory
            </Link>
            <Link 
              href="/docs" 
              className="inline-flex px-10 py-4 justify-center items-center rounded-[59px] bg-[#141722] text-[#efe9e0] font-inter font-medium text-[14px] uppercase tracking-wider hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:from-[4.98%] hover:to-[#FFB546] hover:to-[95.02%] hover:text-black transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


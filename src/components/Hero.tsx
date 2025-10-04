"use client";

import React from 'react';
import Image from 'next/image';
import NavBar from './NavBar';

// Import crypto logos
import BitLogo from '/public/images/icons/bit-logo.svg';
import EthLogo from '/public/images/icons/eth-logo.svg';
import SolLogo from '/public/images/icons/sol-logo.svg';
import LinkLogo from '/public/images/icons/link-logo.svg';

// Import press logos
import Rep1 from '/public/images/rep1.png'
import Rep2 from '/public/images/rep2.png'
import Rep3 from '/public/images/rep3.png'
import Rep4 from '/public/images/rep4.png'
import Rep5 from '/public/images/rep5.png'
import Rep6 from '/public/images/rep6.png'

const Hero: React.FC = () => {
  return (
    <div className="bg-[#fcf8f1] relative min-h-screen overflow-x-hidden">
      {/* Navigation Bar */}
      <NavBar />

      {/* Hero Content */}
      <div className="relative flex flex-col lg:flex-row items-center justify-between min-h-screen px-8 sm:px-16 lg:px-[120px] 2xl:px-[200px] pt-20 pb-0 sm:py-20 sm:pb-0 lg:py-0">
        {/* Left Content */}
        <div className="flex flex-col justify-center w-full lg:w-[50%] lg:max-w-[600px] 2xl:max-w-[664px] mb-12 lg:mb-0">
          {/* Main Heading */}
          <h1 className="font-inter font-semibold text-[clamp(2rem,5vw,4.5rem)] leading-[1.1] text-[#141722] tracking-[-0.5px] sm:tracking-[-1px] lg:tracking-[-2.16px]">
            <span className="text-[#ffb546]">Precious</span>
            <span> metals for the next generation.</span>
          </h1>

          {/* Description */}
          <p className="font-inter font-medium text-[18px] text-[#7c7c7c] leading-[28px] tracking-[0.3456px] mt-8 w-full sm:w-[70%]">
            Clear prices and fast fulfillment, with flexible payment options for every investor.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-[14px] mt-8">
            <button className="bg-[#141722] text-[#efe9e0] px-4 sm:px-6 lg:px-[28px] py-3 sm:py-4 lg:py-[17px] rounded-[1728px] font-inter font-medium text-xs sm:text-sm lg:text-[14.4px] uppercase tracking-wider hover:bg-[#ffb546] hover:text-[#141722] transition-all duration-300 whitespace-nowrap">
              see our product
            </button>
            <button className="inline-flex px-8 sm:px-12 lg:px-[61px] py-3 sm:py-4 lg:py-[18px] justify-center items-center gap-[10px] rounded-[59px] bg-gradient-to-br from-[#FFF0C1] from-[4.98%] to-[#FFB546] to-[95.02%] font-inter font-medium text-xs sm:text-sm lg:text-[14.4px] uppercase tracking-wider text-black hover:shadow-lg transition-all duration-300 whitespace-nowrap">
              Buy Now
            </button>
          </div>

          {/* Crypto Logos */}
          <div className="flex items-center gap-4 sm:gap-[28px] mt-8 flex-wrap">
            {[BitLogo, EthLogo, SolLogo, LinkLogo].map((logo, index) => (
              <div key={index} className="relative w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] flex-shrink-0">
                <Image
                  src={logo}
                  alt={`Crypto logo ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div className="flex-1 flex justify-center items-start relative w-full lg:w-[50%] lg:max-w-[580px] 2xl:max-w-[645px]">
          <div className="relative w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[580px] 2xl:max-w-[645px] h-fit lg:h-auto">
            <Image
              src="/images/hero-image.png"
              alt="Precious metals illustration"
              width={645}
              height={645}
              className="object-contain w-full h-auto"
              priority
              sizes="(max-width: 640px) 300px, (max-width: 768px) 350px, (max-width: 1024px) 400px, (max-width: 1280px) 580px, 645px"
            />
          </div>
        </div>
      </div>

      {/* Trust Indicators Section */}
      <div className="relative lg:absolute bottom-0 lg:bottom-[5%] left-0 right-0 px-4 sm:px-8 lg:px-[120px] 2xl:px-[200px] mt-4 lg:mt-0">
        <div className="flex justify-center sm:justify-between items-center opacity-40 gap-1 sm:gap-2 lg:gap-4 overflow-hidden">
          <div className="relative flex-shrink-0 h-12 sm:h-16 lg:h-20 w-auto">
            <Image
              src={Rep1}
              alt="Reputation Logo 1"
              width={120}
              height={48}
              className="object-contain h-full w-auto"
            />
          </div>
          <div className="relative flex-shrink-0 h-12 sm:h-16 lg:h-20 w-auto">
            <Image
              src={Rep2}
              alt="Reputation Logo 2"
              width={120}
              height={48}
              className="object-contain h-full w-auto"
            />
          </div>
          <div className="relative flex-shrink-0 h-12 sm:h-16 lg:h-20 w-auto">
            <Image
              src={Rep3}
              alt="Reputation Logo 3"
              width={120}
              height={48}
              className="object-contain h-full w-auto"
            />
          </div>
          <div className="relative flex-shrink-0 h-12 sm:h-16 lg:h-20 w-auto hidden sm:block">
            <Image
              src={Rep4}
              alt="Reputation Logo 4"
              width={120}
              height={48}
              className="object-contain h-full w-auto"
            />
          </div>
          <div className="relative flex-shrink-0 h-12 sm:h-16 lg:h-20 w-auto hidden lg:block">
            <Image
              src={Rep5}
              alt="Reputation Logo 5"
              width={120}
              height={48}
              className="object-contain h-full w-auto"
            />
          </div>
          <div className="relative flex-shrink-0 h-12 sm:h-16 lg:h-20 w-auto hidden lg:block">
            <Image
              src={Rep6}
              alt="Reputation Logo 6"
              width={120}
              height={48}
              className="object-contain h-full w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
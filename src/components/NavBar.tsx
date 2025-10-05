"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="absolute top-8 left-8 sm:left-16 lg:left-[120px] 2xl:left-[200px] right-8 sm:right-16 lg:right-[120px] 2xl:right-[200px] z-10">
        <div className="flex items-center justify-between w-full gap-2 sm:gap-4 md:gap-6 lg:gap-8 2xl:gap-12">
          {/* Left Column - Logo */}
          <div className="flex-shrink-0">
            {/* Desktop Logo */}
            <div className="hidden md:block">
              <Image
                src="/images/wordmark-logo.svg"
                alt="Summit Bullion"
                width={288}
                height={26}
                className="h-3 sm:h-4 md:h-5 lg:h-6 2xl:h-[26px] w-auto"
              />
            </div>

            {/* Mobile Logo */}
            <div className="md:hidden">
              <Image
                src="/images/mobile-hero-logo.svg"
                alt="Summit Bullion"
                width={40}
                height={40}
                className="h-6 sm:h-7 md:h-8 2xl:h-8 w-auto"
              />
            </div>
          </div>

          {/* Center Column - Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 2xl:gap-6">
            <a href="#home" className="font-inter font-medium text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs 2xl:text-[14.136px] text-[#141722] uppercase tracking-wider hover:text-[#ffb546] transition-colors whitespace-nowrap">
              Home
            </a>
            <a href="#products" className="font-inter font-medium text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs 2xl:text-[14.136px] text-[#141722] uppercase tracking-wider hover:text-[#ffb546] transition-colors whitespace-nowrap">
              Products
            </a>
            <a href="#docs" className="font-inter font-medium text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs 2xl:text-[14.136px] text-[#141722] uppercase tracking-wider hover:text-[#ffb546] transition-colors whitespace-nowrap">
              Docs
            </a>
            <a href="#about" className="font-inter font-medium text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs 2xl:text-[14.136px] text-[#141722] uppercase tracking-wider hover:text-[#ffb546] transition-colors whitespace-nowrap">
              About
            </a>
          </div>

          {/* Right Column - Connect Wallet Button / Mobile Menu */}
          <div className="flex-shrink-0">
            {/* Connect Wallet Button (Desktop) */}
            <button className="hidden md:block bg-[#141722] text-[#efe9e0] px-1.5 sm:px-2 md:px-3 lg:px-4 2xl:px-[28px] py-1 sm:py-1.5 md:py-2 lg:py-2.5 2xl:py-[17px] rounded-[42px] font-inter font-medium text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs 2xl:text-[14px] uppercase tracking-wider hover:bg-[#ffb546] hover:text-[#141722] transition-all duration-300">
              Connect wallet
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-[#141722] focus:outline-none p-1 sm:p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-in Menu Overlay */}
      <div 
        className={`fixed inset-0 z-50 md:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={closeMobileMenu}
      >
        {/* Slide-in Menu */}
        <div 
          className={`absolute right-0 top-0 h-full w-full bg-[#fcf8f1] transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full px-8 py-8 max-h-screen overflow-y-auto">
            {/* Header with Mobile Logo and Close Button */}
            <div className="flex items-center justify-between mb-8">
              {/* Mobile Logo - Same position as main screen */}
              <div className="flex-shrink-0">
                <Image
                  src="/images/mobile-hero-logo.svg"
                  alt="Summit Bullion"
                  width={40}
                  height={40}
                  className="h-6 sm:h-7 md:h-8 2xl:h-8 w-auto"
                />
              </div>
              
              {/* Close Button */}
              <button 
                onClick={closeMobileMenu}
                className="text-[#141722] focus:outline-none p-2 hover:bg-[#ffb546] hover:text-[#141722] rounded-full transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col space-y-6 mt-8">
              <a 
                href="#home" 
                onClick={closeMobileMenu}
                className="font-inter text-2xl text-[#141722] uppercase tracking-wider font-medium hover:text-[#ffb546] transition-colors text-left py-2"
              >
                Home
              </a>
              <a 
                href="#products" 
                onClick={closeMobileMenu}
                className="font-inter text-2xl text-[#141722] uppercase tracking-wider font-medium hover:text-[#ffb546] transition-colors text-left py-2"
              >
                Products
              </a>
              <a 
                href="#docs" 
                onClick={closeMobileMenu}
                className="font-inter text-2xl text-[#141722] uppercase tracking-wider font-medium hover:text-[#ffb546] transition-colors text-left py-2"
              >
                Docs
              </a>
              <a 
                href="#about" 
                onClick={closeMobileMenu}
                className="font-inter text-2xl text-[#141722] uppercase tracking-wider font-medium hover:text-[#ffb546] transition-colors text-left py-2"
              >
                About
              </a>
            </div>

            {/* Connect Wallet Button - Positioned at bottom */}
            <div className="mt-auto mb-8">
              <button className="w-full inline-flex px-8 py-4 justify-center items-center gap-[10px] rounded-[42px] bg-gradient-to-br from-[#FFF0C1] from-[4.98%] to-[#FFB546] to-[95.02%] font-inter font-medium text-lg uppercase tracking-wider text-black hover:shadow-lg transition-all duration-300">
                Connect wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
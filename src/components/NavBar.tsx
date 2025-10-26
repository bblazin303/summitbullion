"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { useCart } from '@/context/CartContext';
import { useAuthModal, useUser, useLogout, useSignerStatus } from '@account-kit/react';
import ShoppingCartIcon from '/public/images/icons/shoppingcart.svg';

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const desktopCartButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCartButtonRef = useRef<HTMLButtonElement>(null);
  const desktopCartDropdownRef = useRef<HTMLDivElement>(null);
  const mobileCartDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { cart, getCartCount, getCartTotal, removeFromCart, updateQuantity } = useCart();
  
  // Alchemy Authentication
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const { logout } = useLogout();
  const signerStatus = useSignerStatus();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideDesktopButton = desktopCartButtonRef.current?.contains(target);
      const clickedInsideMobileButton = mobileCartButtonRef.current?.contains(target);
      const clickedInsideDesktopDropdown = desktopCartDropdownRef.current?.contains(target);
      const clickedInsideMobileDropdown = mobileCartDropdownRef.current?.contains(target);
      const clickedInsideUserMenu = userMenuRef.current?.contains(target);
      
      if (!clickedInsideDesktopButton && !clickedInsideMobileButton && !clickedInsideDesktopDropdown && !clickedInsideMobileDropdown) {
        setIsCartOpen(false);
      }
      
      if (!clickedInsideUserMenu) {
        setIsUserMenuOpen(false);
      }
    };

    if (isCartOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen, isUserMenuOpen]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state - navbar is hidden by default CSS
      gsap.set(navRef.current, {
        opacity: 0,
        y: -30
      });

      // Animate navbar in
      gsap.to(navRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.2
      });

    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <nav ref={navRef} style={{ opacity: 0, transform: 'translateY(-30px)' }} className="absolute top-8 left-8 sm:left-16 lg:left-[120px] 2xl:left-[200px] right-8 sm:right-16 lg:right-[120px] 2xl:right-[200px] z-10">
        <div className="flex items-center justify-between w-full gap-2 sm:gap-4 md:gap-6 lg:gap-8 2xl:gap-12">
          {/* Left Column - Logo */}
          <Link href="/" className="flex-shrink-0">
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
          </Link>

          {/* Center Column - Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 2xl:gap-6">
            <Link 
              href="/" 
              className={`font-inter font-medium text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs 2xl:text-[14.136px] uppercase tracking-wider transition-colors whitespace-nowrap ${
                pathname === '/' ? 'text-[#ffb546]' : 'text-[#141722] hover:text-[#ffb546]'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/marketplace" 
              className={`font-inter font-medium text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs 2xl:text-[14.136px] uppercase tracking-wider transition-colors whitespace-nowrap ${
                pathname === '/marketplace' ? 'text-[#ffb546]' : 'text-[#141722] hover:text-[#ffb546]'
              }`}
            >
              Products
            </Link>
            <Link href="/docs" className="font-inter font-medium text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs 2xl:text-[14.136px] text-[#141722] uppercase tracking-wider hover:text-[#ffb546] transition-colors whitespace-nowrap">
              Docs
            </Link>
            <a href="#about" className="font-inter font-medium text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs 2xl:text-[14.136px] text-[#141722] uppercase tracking-wider hover:text-[#ffb546] transition-colors whitespace-nowrap">
              About
            </a>
          </div>

          {/* Right Column - Auth Button & Shopping Cart / Mobile Menu */}
          <div className="flex-shrink-0 flex items-center gap-2 md:gap-3">
            {/* Auth Button (Desktop) */}
            <div className="hidden md:block relative">
              {signerStatus.isInitializing ? (
                <button className="bg-[#141722] text-[#efe9e0] px-1.5 sm:px-2 md:px-3 lg:px-4 2xl:px-[28px] py-1 sm:py-1.5 md:py-2 lg:py-2.5 2xl:py-[17px] rounded-[42px] font-inter font-medium text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs 2xl:text-[14px] uppercase tracking-wider opacity-50 cursor-wait">
                  Loading...
                </button>
              ) : user ? (
                <>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="bg-[#141722] text-[#efe9e0] px-1.5 sm:px-2 md:px-3 lg:px-4 2xl:px-[28px] py-1 sm:py-1.5 md:py-2 lg:py-2.5 2xl:py-[17px] rounded-[42px] font-inter font-medium text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs 2xl:text-[14px] uppercase tracking-wider hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:from-[4.98%] hover:to-[#FFB546] hover:to-[95.02%] hover:text-black transition-all duration-300 cursor-pointer"
                  >
                    {user.email ? user.email.slice(0, 12) + (user.email.length > 12 ? '...' : '') : 'Account'}
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div 
                      ref={userMenuRef}
                      className="absolute right-0 mt-2 w-[240px] bg-white rounded-[18px] shadow-[0_8px_31.1px_-9px_rgba(0,0,0,0.25)] overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-[rgba(0,0,0,0.1)]">
                        <p className="font-inter font-semibold text-[14px] text-black truncate">
                          {user.email || 'Account'}
                        </p>
                        {user.address && (
                          <p className="font-inter font-normal text-[12px] text-[#7c7c7c] mt-1">
                            {user.address.slice(0, 6)}...{user.address.slice(-4)}
                          </p>
                        )}
                      </div>
                      <div className="p-2">
                        <Link
                          href="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block w-full text-left px-4 py-2 font-inter text-[14px] text-[#141722] hover:bg-[#fcf8f1] rounded-[12px] transition-colors"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 font-inter text-[14px] text-[#ff3333] hover:bg-[#fcf8f1] rounded-[12px] transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button 
                  onClick={openAuthModal}
                  className="bg-[#141722] text-[#efe9e0] px-1.5 sm:px-2 md:px-3 lg:px-4 2xl:px-[28px] py-1 sm:py-1.5 md:py-2 lg:py-2.5 2xl:py-[17px] rounded-[42px] font-inter font-medium text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs 2xl:text-[14px] uppercase tracking-wider hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:from-[4.98%] hover:to-[#FFB546] hover:to-[95.02%] hover:text-black transition-all duration-300 cursor-pointer"
                >
                  Sign in
                </button>
              )}
            </div>

            {/* Shopping Cart Button (Desktop) */}
            <div className="hidden md:block relative">
              <button
                ref={desktopCartButtonRef}
                onClick={() => {
                  console.log('Cart button clicked - current state:', isCartOpen);
                  console.log('Toggling to:', !isCartOpen);
                  setIsCartOpen(!isCartOpen);
                }}
                className="bg-[#141722] text-[#efe9e0] p-2 md:p-2.5 lg:p-3 2xl:p-[14px] rounded-full hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:from-[4.98%] hover:to-[#FFB546] hover:to-[95.02%] hover:text-black transition-all duration-300 cursor-pointer relative"
              >
                <div className="relative w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6">
                  <Image
                    src={ShoppingCartIcon}
                    alt="Shopping Cart"
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Cart Count Badge */}
                {getCartCount() > 0 && (
                  <div className="absolute -top-1 -right-1 bg-[#ff3333] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-inter font-bold">
                    {getCartCount()}
                  </div>
                )}
              </button>

              {/* Cart Dropdown */}
              {isCartOpen && (() => {
                console.log('Desktop cart dropdown rendering');
                console.log('Cart items:', cart);
                return (
                <div
                  ref={desktopCartDropdownRef}
                  className="hidden md:block absolute right-0 mt-2 w-[380px] bg-white rounded-[24px] shadow-[0_8px_31.1px_-9px_rgba(0,0,0,0.25)] overflow-hidden z-50"
                >
                  {/* Cart Header */}
                  <div className="p-6 border-b border-[rgba(0,0,0,0.1)]">
                    <h3 className="font-inter font-bold text-[20px] text-black">Shopping Cart</h3>
                    <p className="font-inter font-normal text-[14px] text-[#7c7c7c] mt-1">
                      {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  {/* Cart Items */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="font-inter font-normal text-[16px] text-[#7c7c7c]">
                          Your cart is empty
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex gap-4 bg-[#fcf8f1] rounded-[18px] p-4">
                            {/* Product Image */}
                            <div className="relative w-[80px] h-[80px] flex-shrink-0 bg-white rounded-[12px] overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-contain p-2"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <p className="font-inter font-medium text-[12px] text-[#7c7c7c] uppercase">
                                  {item.brand}
                                </p>
                                <h4 className="font-inter font-semibold text-[16px] text-black leading-tight mt-1">
                                  {item.name}
                                </h4>
                              </div>

                              <div className="flex items-center justify-between mt-2">
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 border border-[#dfdfdf]">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="text-black text-sm font-medium hover:text-[#ffb546] transition-colors"
                                  >
                                    −
                                  </button>
                                  <span className="font-inter text-[14px] text-black w-6 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="text-black text-sm font-medium hover:text-[#ffb546] transition-colors"
                                  >
                                    +
                                  </button>
                                </div>

                                {/* Price & Remove */}
                                <div className="flex items-center gap-3">
                                  <p className="font-inter font-bold text-[16px] text-black">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-[#ff3333] hover:text-[#cc0000] transition-colors"
                                  >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                      <path d="M4.5 4.5L13.5 13.5M4.5 13.5L13.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cart.length > 0 && (
                    <div className="p-6 border-t border-[rgba(0,0,0,0.1)] bg-[#fcf8f1]">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-inter font-semibold text-[18px] text-black">Total:</span>
                        <span className="font-inter font-bold text-[24px] text-black">
                          ${getCartTotal().toFixed(2)}
                        </span>
                      </div>
                      <Link
                        href="/checkout"
                        onClick={() => {
                          console.log('Desktop Checkout button clicked');
                          console.log('Current cart:', cart);
                          console.log('Closing cart dropdown...');
                          setIsCartOpen(false);
                        }}
                        className="block w-full bg-[#141722] text-[#efe9e0] font-inter font-medium text-[14px] uppercase py-[14px] rounded-full hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:from-[4.98%] hover:to-[#FFB546] hover:to-[95.02%] hover:text-black transition-all duration-300 cursor-pointer text-center"
                      >
                        Proceed to Checkout
                      </Link>
                    </div>
                  )}
                </div>
                );
              })()}
            </div>

            {/* Shopping Cart Button (Mobile) */}
            <div className="md:hidden relative">
              <button
                ref={mobileCartButtonRef}
                onClick={() => {
                  console.log('Mobile cart button clicked - current state:', isCartOpen);
                  console.log('Toggling to:', !isCartOpen);
                  setIsCartOpen(!isCartOpen);
                }}
                className="bg-[#141722] text-[#efe9e0] p-2 rounded-full hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:from-[4.98%] hover:to-[#FFB546] hover:to-[95.02%] hover:text-black transition-all duration-300 cursor-pointer relative"
              >
                <div className="relative w-5 h-5">
                  <Image
                    src={ShoppingCartIcon}
                    alt="Shopping Cart"
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Cart Count Badge */}
                {getCartCount() > 0 && (
                  <div className="absolute -top-1 -right-1 bg-[#ff3333] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-inter font-bold">
                    {getCartCount()}
                  </div>
                )}
              </button>

              {/* Cart Dropdown Mobile */}
              {isCartOpen && (() => {
                console.log('Mobile cart dropdown rendering');
                console.log('Cart items:', cart);
                return (
                <div
                  ref={mobileCartDropdownRef}
                  className="md:hidden fixed inset-x-4 top-20 bg-white rounded-[24px] shadow-[0_8px_31.1px_-9px_rgba(0,0,0,0.25)] overflow-hidden z-50 max-h-[80vh]"
                >
                  {/* Cart Header */}
                  <div className="p-4 border-b border-[rgba(0,0,0,0.1)]">
                    <h3 className="font-inter font-bold text-[18px] text-black">Shopping Cart</h3>
                    <p className="font-inter font-normal text-[12px] text-[#7c7c7c] mt-1">
                      {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  {/* Cart Items */}
                  <div className="max-h-[50vh] overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="font-inter font-normal text-[14px] text-[#7c7c7c]">
                          Your cart is empty
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 space-y-3">
                        {cart.map((item) => (
                          <div key={item.id} className="flex gap-3 bg-[#fcf8f1] rounded-[18px] p-3">
                            {/* Product Image */}
                            <div className="relative w-[60px] h-[60px] flex-shrink-0 bg-white rounded-[12px] overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-contain p-1"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <p className="font-inter font-medium text-[10px] text-[#7c7c7c] uppercase">
                                  {item.brand}
                                </p>
                                <h4 className="font-inter font-semibold text-[14px] text-black leading-tight mt-1 truncate">
                                  {item.name}
                                </h4>
                              </div>

                              <div className="flex items-center justify-between mt-2">
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 border border-[#dfdfdf]">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="text-black text-sm font-medium hover:text-[#ffb546] transition-colors"
                                  >
                                    −
                                  </button>
                                  <span className="font-inter text-[12px] text-black w-4 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="text-black text-sm font-medium hover:text-[#ffb546] transition-colors"
                                  >
                                    +
                                  </button>
                                </div>

                                {/* Price & Remove */}
                                <div className="flex items-center gap-2">
                                  <p className="font-inter font-bold text-[14px] text-black">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-[#ff3333] hover:text-[#cc0000] transition-colors"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                                      <path d="M4.5 4.5L13.5 13.5M4.5 13.5L13.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cart.length > 0 && (
                    <div className="p-4 border-t border-[rgba(0,0,0,0.1)] bg-[#fcf8f1]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-inter font-semibold text-[16px] text-black">Total:</span>
                        <span className="font-inter font-bold text-[20px] text-black">
                          ${getCartTotal().toFixed(2)}
                        </span>
                      </div>
                      <Link
                        href="/checkout"
                        onClick={() => {
                          console.log('Mobile Checkout button clicked');
                          console.log('Current cart:', cart);
                          console.log('Closing cart dropdown...');
                          setIsCartOpen(false);
                        }}
                        className="block w-full bg-[#141722] text-[#efe9e0] font-inter font-medium text-[12px] uppercase py-[12px] rounded-full hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:from-[4.98%] hover:to-[#FFB546] hover:to-[95.02%] hover:text-black transition-all duration-300 cursor-pointer text-center"
                      >
                        Proceed to Checkout
                      </Link>
                    </div>
                  )}
                </div>
                );
              })()}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-[#141722] focus:outline-none p-1 sm:p-2 cursor-pointer"
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
              <Link href="/" onClick={closeMobileMenu} className="flex-shrink-0">
                <Image
                  src="/images/mobile-hero-logo.svg"
                  alt="Summit Bullion"
                  width={40}
                  height={40}
                  className="h-6 sm:h-7 md:h-8 2xl:h-8 w-auto"
                />
              </Link>
              
              {/* Close Button */}
              <button 
                onClick={closeMobileMenu}
                className="text-[#141722] focus:outline-none p-2 hover:bg-[#ffb546] hover:text-[#141722] rounded-full transition-all duration-200 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col space-y-6 mt-8">
              <Link 
                href="/" 
                onClick={closeMobileMenu}
                className={`font-inter text-2xl uppercase tracking-wider font-medium transition-colors text-left py-2 ${
                  pathname === '/' ? 'text-[#ffb546]' : 'text-[#141722] hover:text-[#ffb546]'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/marketplace" 
                onClick={closeMobileMenu}
                className={`font-inter text-2xl uppercase tracking-wider font-medium transition-colors text-left py-2 ${
                  pathname === '/marketplace' ? 'text-[#ffb546]' : 'text-[#141722] hover:text-[#ffb546]'
                }`}
              >
                Products
              </Link>
              <Link 
                href="/docs" 
                onClick={closeMobileMenu}
                className="font-inter text-2xl text-[#141722] uppercase tracking-wider font-medium hover:text-[#ffb546] transition-colors text-left py-2"
              >
                Docs
              </Link>
              <a 
                href="#about" 
                onClick={closeMobileMenu}
                className="font-inter text-2xl text-[#141722] uppercase tracking-wider font-medium hover:text-[#ffb546] transition-colors text-left py-2"
              >
                About
              </a>
            </div>

            {/* Auth Section - Positioned at bottom */}
            <div className="mt-auto mb-8 space-y-4">
              {signerStatus.isInitializing ? (
                <button className="w-full inline-flex px-8 py-4 justify-center items-center gap-[10px] rounded-[42px] bg-[#141722] font-inter font-medium text-lg uppercase tracking-wider text-[#efe9e0] opacity-50 cursor-wait">
                  Loading...
                </button>
              ) : user ? (
                <>
                  <div className="bg-white rounded-[18px] p-4 mb-4 border border-[rgba(0,0,0,0.1)]">
                    <p className="font-inter font-semibold text-[14px] text-black truncate">
                      {user.email || 'Account'}
                    </p>
                    {user.address && (
                      <p className="font-inter font-normal text-[12px] text-[#7c7c7c] mt-1">
                        Wallet: {user.address.slice(0, 6)}...{user.address.slice(-4)}
                      </p>
                    )}
                  </div>
                  <Link
                    href="/orders"
                    onClick={closeMobileMenu}
                    className="w-full inline-flex px-8 py-4 justify-center items-center gap-[10px] rounded-[42px] bg-[#141722] font-inter font-medium text-lg uppercase tracking-wider text-[#efe9e0] hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:from-[4.98%] hover:to-[#FFB546] hover:to-[95.02%] hover:text-black transition-all duration-300"
                  >
                    My Orders
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-full inline-flex px-8 py-4 justify-center items-center gap-[10px] rounded-[42px] border-2 border-[#ff3333] font-inter font-medium text-lg uppercase tracking-wider text-[#ff3333] hover:bg-[#ff3333] hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    openAuthModal();
                    closeMobileMenu();
                  }}
                  className="w-full inline-flex px-8 py-4 justify-center items-center gap-[10px] rounded-[42px] bg-gradient-to-br from-[#FFF0C1] from-[4.98%] to-[#FFB546] to-[95.02%] font-inter font-medium text-lg uppercase tracking-wider text-black hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
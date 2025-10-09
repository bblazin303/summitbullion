"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';

// Import product images
import ProductImage1 from '/public/images/product-image1.png';
import ProductImage2 from '/public/images/product-image2.png';
import ProductImage3 from '/public/images/product-image3.png';
import ProductImage4 from '/public/images/product-image4.png';

// Import Sol logo for price indicator
import SolLogo from '/public/images/icons/sol-logo.svg';

// Import chevron right icon
import ChevronRight from '/public/images/icons/chevron-right.svg';

const ProductHome: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states for individual elements
      gsap.set([titleRef.current, productsRef.current, buttonRef.current], {
        opacity: 0,
        y: 60
      });

      // Create intersection observer for scroll-triggered animation
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Animate title first
              gsap.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.0,
                ease: "power2.out"
              });

              // Then animate products with stagger
              gsap.to(productsRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out",
                delay: 0.3
              });

              // Finally animate the floating button
              gsap.to(buttonRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.0,
                ease: "power2.out",
                delay: 0.6
              });

              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => observer.disconnect();
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  const products = [
    {
      id: 1,
      title: "1 g Fine Gold Grain",
      description: "From fractional gold to full ounces - find the perfect precious met",
      price: "$44272.12 USD",
      solAmount: "186.8862",
      image: ProductImage1,
      imageAlt: "1 gram fine gold grain",
      metal: "Gold"
    },
    {
      id: 2,
      title: "1 oz Gold Bar",
      description: "From fractional gold to full ounces - find the perfect precious met",
      price: "$44272.12 USD",
      solAmount: "186.8862",
      image: ProductImage2,
      imageAlt: "1 ounce gold bar",
      metal: "Gold"
    },
    {
      id: 3,
      title: "10 oz Gold Bar",
      description: "From fractional gold to full ounces - find the perfect precious met",
      price: "$44272.12 USD",
      solAmount: "186.8862",
      image: ProductImage3,
      imageAlt: "10 ounce gold bar",
      metal: "Gold"
    },
    {
      id: 4,
      title: "1 oz Silver Unity Bar",
      description: "From fractional gold to full ounces - find the perfect precious met",
      price: "$44272.12 USD",
      solAmount: "186.8862",
      image: ProductImage4,
      imageAlt: "1 ounce silver unity bar",
      metal: "Silver"
    }
  ];

  return (
    <div ref={sectionRef} className="bg-[#fcf8f1] relative w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px]">
      {/* Section Title */}
      <div ref={titleRef} style={{ opacity: 0, transform: 'translateY(60px)' }} className="text-center mb-8 sm:mb-12 lg:mb-16">
        {/* Coming Soon Label */}
        <div className="inline-flex w-[91px] h-[20px] px-[14.419px] py-[9.269px] justify-center items-center gap-[5.15px] rounded-[21.628px] border border-black/20 mb-3 sm:mb-4">
          <span className="text-xs font-inter text-black whitespace-nowrap">Coming Soon</span>
        </div>
        <h2 className="font-inter font-bold text-[28px] sm:text-[32px] md:text-[36px] lg:text-[42px] leading-[1.1] text-slate-900">
          <span className="text-[#ffb546]">Shop </span>Our Inventory
        </h2>
      </div>

      {/* Products Grid */}
      <div ref={productsRef} style={{ opacity: 0, transform: 'translateY(60px)' }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8 max-w-7xl mx-auto relative">
        {products.map((product) => (
          <Link key={product.id} href={`/marketplace/${product.id}`} className="bg-white rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
            {/* Product Image */}
            <div className="bg-white h-[160px] sm:h-[180px] lg:h-[219px] w-full rounded-lg overflow-hidden mb-4 sm:mb-6 flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-3 sm:gap-4 flex-1">
              {/* Title */}
              <h3 className="font-inter font-semibold text-[18px] sm:text-[20px] lg:text-[24px] leading-[1.1] text-black">
                {product.title}
              </h3>

              {/* Description */}
              <p className="font-inter font-medium text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.4] text-[#7c7c7c] flex-1">
                {product.description}
              </p>

              {/* Price Section */}
              <div className="flex flex-col gap-[4px] sm:gap-[6px] mb-4 sm:mb-6">
                {/* USD Price */}
                <div className="font-inter font-medium text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.2] text-black">
                  {product.price}
                </div>

                {/* SOL Price */}
                <div className="flex items-center gap-[4px] sm:gap-[6px]">
                  <div className="relative w-[16px] h-[16px] sm:w-[19px] sm:h-[19px]">
                    <Image
                      src={SolLogo}
                      alt="Solana logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-inter font-medium text-[14px] sm:text-[15px] lg:text-[16px] text-[#8a8a8a]">
                    {product.solAmount}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              {/* <button className="bg-[#141722] text-[#efe9e0] px-7 py-[18px] rounded-[42px] font-inter font-medium text-[14.4px] uppercase tracking-wider hover:bg-[#ffb546] hover:text-[#141722] transition-all duration-300">
                Add to cart
              </button> */}
            </div>
          </Link>
        ))}

        {/* Floating View More Button - Hidden on mobile */}
        <button ref={buttonRef} style={{ opacity: 0, transform: 'translateY(60px)' }} className="hidden xl:block absolute -right-16 top-1/2 -translate-y-1/2 bg-black p-[10px] rounded-[154px] hover:bg-[#ffb546] transition-all duration-300 z-10">
          <div className="relative w-6 h-6">
            <Image
              src={ChevronRight}
              alt="View more"
              fill
              className="object-contain"
            />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProductHome;

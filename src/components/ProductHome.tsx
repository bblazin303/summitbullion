"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import type { Inventory } from '@/types/platformGold';
import { fetchInventory, applyMarkup, getMetalDisplayName } from '@/lib/platformGoldApi';

// Import product images (fallback)
import ProductImage1 from '/public/images/product-image1.png';
import ProductImage2 from '/public/images/product-image2.png';
import ProductImage3 from '/public/images/product-image3.png';
import ProductImage4 from '/public/images/product-image4.png';

// Import chevron right icon
import ChevronRight from '/public/images/icons/chevron-right.svg';

const ProductHome: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const [products, setProducts] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get fallback image
  const getFallbackImage = (metalSymbol: string): StaticImageData => {
    const imageMap: { [key: string]: StaticImageData } = {
      'XAU': ProductImage2,
      'XAG': ProductImage4,
      'XPT': ProductImage3,
      'XPD': ProductImage3
    };
    return imageMap[metalSymbol] || ProductImage1;
  };

  // Fetch real products from Platform Gold API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetchInventory(4, 0); // Fetch first 4 products
        // fetchInventory returns an object with a 'records' property
        if (response && Array.isArray(response.records)) {
          setProducts(response.records);
        } else {
          console.error('fetchInventory did not return valid data:', response);
          setProducts([]);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Prefetch marketplace inventory data for faster navigation
  useEffect(() => {
    // Prefetch the marketplace route
    router.prefetch('/marketplace');
    
    // Prefetch the inventory API data in the background
    const prefetchInventory = async () => {
      try {
        console.log('🚀 Prefetching marketplace inventory...');
        // Fetch first batch of inventory
        await fetch('/api/platform-gold/inventory?limit=100&offset=0');
        // Prefetch metadata (counts)
        await fetch('/api/platform-gold/metadata');
        console.log('✅ Marketplace inventory prefetched successfully');
      } catch (error) {
        console.error('❌ Failed to prefetch inventory:', error);
      }
    };
    
    // Start prefetching after a short delay to not block initial page load
    const timeoutId = setTimeout(prefetchInventory, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [router]);

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

  return (
    <div ref={sectionRef} className="bg-[#fcf8f1] relative w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px]">
      {/* Section Title */}
      <div ref={titleRef} style={{ opacity: 0, transform: 'translateY(60px)' }} className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h2 className="font-inter font-bold text-[28px] sm:text-[32px] md:text-[36px] lg:text-[42px] leading-[1.1] text-slate-900">
          <span className="text-[#ffb546]">Shop </span>Our Inventory
        </h2>
      </div>

      {/* Products Grid */}
      <div ref={productsRef} style={{ opacity: 0, transform: 'translateY(60px)' }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8 max-w-7xl mx-auto relative">
        {isLoading || !products || products.length === 0 ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 flex flex-col animate-pulse">
              <div className="bg-gray-200 h-[160px] sm:h-[180px] lg:h-[219px] w-full rounded-lg mb-4 sm:mb-6"></div>
              <div className="flex flex-col gap-3 sm:gap-4 flex-1">
                <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
                <div className="bg-gray-200 h-4 w-full rounded"></div>
                <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
                <div className="bg-gray-200 h-6 w-1/2 rounded mt-auto"></div>
              </div>
            </div>
          ))
        ) : (
          products.map((product) => {
            const markedUpPrice = applyMarkup(product.askPrice, 2);
            const productImage = product.mainImage || getFallbackImage(product.metalSymbol);
            
            return (
              <Link 
                key={product.id} 
                href={`/marketplace/${product.id}`} 
                className="bg-white rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="bg-white h-[160px] sm:h-[180px] lg:h-[219px] w-full rounded-lg overflow-hidden mb-4 sm:mb-6 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {typeof productImage === 'string' ? (
                      <Image
                        src={productImage}
                        alt={product.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <Image
                        src={productImage}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-3 sm:gap-4 flex-1">
                  {/* Title */}
                  <h3 className="font-inter font-semibold text-[18px] sm:text-[20px] lg:text-[24px] leading-[1.1] text-black overflow-hidden text-ellipsis" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="font-inter font-medium text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.4] text-[#7c7c7c] flex-1 overflow-hidden text-ellipsis" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {product.purity} {getMetalDisplayName(product.metalSymbol)} - {product.metalOz} oz
                  </p>

                  {/* Price Section */}
                  <div className="flex flex-col gap-[4px] sm:gap-[6px]">
                    {/* USD Price */}
                    <div className="font-inter font-medium text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.2] text-black">
                      ${markedUpPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </div>
                  </div>

                  {/* View Product Button */}
                  <div className="w-full bg-[#141722] text-[#efe9e0] font-inter font-medium text-[14px] uppercase py-[17px] rounded-full text-center hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:to-[#FFB546] hover:text-black transition-all duration-300 mt-2">
                    View Product
                  </div>
                </div>
              </Link>
            );
          })
        )}

        {/* Floating View More Button - Hidden on mobile */}
          <Link
            href="/marketplace"
          style={{ opacity: 0, transform: 'translateY(60px)' }} 
          className="hidden xl:block absolute -right-16 top-1/2 -translate-y-1/2 bg-black p-[10px] rounded-[154px] hover:bg-[#ffb546] transition-all duration-300 z-10"
        >
          <div className="relative w-6 h-6">
            <Image
              src={ChevronRight}
              alt="View more"
              fill
              className="object-contain"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductHome;

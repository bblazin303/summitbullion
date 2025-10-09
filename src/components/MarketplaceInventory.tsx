"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';

// Import product images
import ProductImage1 from '/public/images/product-image1.png';
import ProductImage2 from '/public/images/product-image2.png';
import ProductImage3 from '/public/images/product-image3.png';
import ProductImage4 from '/public/images/product-image4.png';

// Import icons
import SolLogo from '/public/images/icons/sol-logo.svg';
import ChevronDown from '/public/images/icons/chevron-down.svg';
import FilterIcon from '/public/images/icons/filter.svg';

const MarketplaceInventory: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>('Default');
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [filterDropdownPosition, setFilterDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Sort options
  const sortOptions = [
    'Default',
    'Most Popular',
    'Price: Low to High',
    'Price: High to Low',
    'Year: Ascending',
    'Year: Descending',
    'Weight: Ascending',
    'Weight: Descending'
  ];

  // Filter options
  const filterOptions = [
    'All',
    'Gold',
    'Silver',
    'Platinum',
    'Palladium'
  ];

  // Set mounted state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update dropdown position when opened or on scroll/resize
  useEffect(() => {
    const updatePosition = () => {
      if (sortButtonRef.current) {
        const rect = sortButtonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX
        });
      }
    };

    if (isSortOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isSortOpen]);

  // Update filter dropdown position when opened or on scroll/resize
  useEffect(() => {
    const updatePosition = () => {
      if (filterButtonRef.current) {
        const rect = filterButtonRef.current.getBoundingClientRect();
        setFilterDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX
        });
      }
    };

    if (isFilterOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isFilterOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check sort dropdown
      const clickedInsideSortButton = sortButtonRef.current?.contains(target);
      const clickedInsideSortMenu = sortMenuRef.current?.contains(target);
      if (!clickedInsideSortButton && !clickedInsideSortMenu) {
        setIsSortOpen(false);
      }

      // Check filter dropdown
      const clickedInsideFilterButton = filterButtonRef.current?.contains(target);
      const clickedInsideFilterMenu = filterMenuRef.current?.contains(target);
      if (!clickedInsideFilterButton && !clickedInsideFilterMenu) {
        setIsFilterOpen(false);
      }
    };

    if (isSortOpen || isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSortOpen, isFilterOpen]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([headerRef.current, productsRef.current], {
        opacity: 0,
        y: 50
      });

      // Create intersection observer for scroll-triggered animation
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Animate header first
              gsap.to(headerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
              });

              // Then animate products
              gsap.to(productsRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.0,
                ease: "power2.out",
                delay: 0.2
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

  const handleSortSelect = (option: string) => {
    setSelectedSort(option);
    setIsSortOpen(false);
  };

  const handleFilterSelect = (option: string) => {
    setSelectedFilter(option);
    setIsFilterOpen(false);
  };

  // Generate 12 products with varied data
  const allProducts = [
    {
      id: 1,
      title: "1 g Fine Gold Grain",
      description: "From fractional gold to full ounces - find the perfect precious met",
      priceUSD: 82.50,
      solAmount: "186.8862",
      image: ProductImage1,
      imageAlt: "1 gram fine gold grain",
      badge: "BEST VALUE",
      metal: "Gold",
      weight: 1,
      year: 2024
    },
    {
      id: 2,
      title: "1 oz Gold Bar",
      description: "From fractional gold to full ounces - find the perfect precious met",
      priceUSD: 2650.00,
      solAmount: "186.8862",
      image: ProductImage2,
      imageAlt: "1 ounce gold bar",
      badge: null,
      metal: "Gold",
      weight: 31.1,
      year: 2023
    },
    {
      id: 3,
      title: "10 oz Gold Bar",
      description: "From fractional gold to full ounces - find the perfect precious met",
      priceUSD: 26250.00,
      solAmount: "186.8862",
      image: ProductImage3,
      imageAlt: "10 ounce gold bar",
      badge: null,
      metal: "Gold",
      weight: 311,
      year: 2024
    },
    {
      id: 4,
      title: "1 oz Silver Unity Bar",
      description: "From fractional gold to full ounces - find the perfect precious met",
      priceUSD: 32.50,
      solAmount: "186.8862",
      image: ProductImage4,
      imageAlt: "1 ounce silver unity bar",
      badge: null,
      metal: "Silver",
      weight: 31.1,
      year: 2024
    },
    {
      id: 5,
      title: "5 oz Silver Bar",
      description: "From fractional gold to full ounces - find the perfect precious met",
      priceUSD: 158.75,
      solAmount: "186.8862",
      image: ProductImage4,
      imageAlt: "5 ounce silver bar",
      badge: null,
      metal: "Silver",
      weight: 155.5,
      year: 2023
    },
    {
      id: 6,
      title: "1 oz Platinum Bar",
      description: "From fractional gold to full ounces - find the perfect precious met",
      priceUSD: 1050.00,
      solAmount: "186.8862",
      image: ProductImage3,
      imageAlt: "1 ounce platinum bar",
      badge: null,
      metal: "Platinum",
      weight: 31.1,
      year: 2024
    },
    {
      id: 7,
      title: "2.5 oz Gold Bar",
      description: "From fractional gold to full ounces - find the perfect precious met",
      priceUSD: 6625.00,
      solAmount: "186.8862",
      image: ProductImage2,
      imageAlt: "2.5 ounce gold bar",
      badge: null,
      metal: "Gold",
      weight: 77.75,
      year: 2022
    },
    {
      id: 8,
      title: "10 oz Silver Bar",
      description: "From fractional gold to full ounces - find the perfect precious met",
      priceUSD: 315.00,
      solAmount: "186.8862",
      image: ProductImage4,
      imageAlt: "10 ounce silver bar",
      badge: "BEST VALUE",
      metal: "Silver",
      weight: 311,
      year: 2024
    },
    {
      id: 9,
      title: "1 oz Palladium Bar",
      description: "From fractional gold to full ounces - find the perfect precious met",
      priceUSD: 980.00,
      solAmount: "186.8862",
      image: ProductImage3,
      imageAlt: "1 ounce palladium bar",
      badge: null,
      metal: "Palladium",
      weight: 31.1,
      year: 2023
    },
    {
      id: 10,
      title: "5 oz Gold Bar",
      description: "From fractional gold to full ounces - find the perfect precious met",
      priceUSD: 13150.00,
      solAmount: "186.8862",
      image: ProductImage2,
      imageAlt: "5 ounce gold bar",
      badge: null,
      metal: "Gold",
      weight: 155.5,
      year: 2024
    },
    {
      id: 11,
      title: "100 oz Silver Bar",
      description: "From fractional gold to full ounces - find the perfect precious met",
      priceUSD: 3100.00,
      solAmount: "186.8862",
      image: ProductImage4,
      imageAlt: "100 ounce silver bar",
      badge: null,
      metal: "Silver",
      weight: 3110,
      year: 2023
    },
    {
      id: 12,
      title: "10 oz Platinum Bar",
      description: "From fractional gold to full ounces - find the perfect precious met",
      priceUSD: 10450.00,
      solAmount: "186.8862",
      image: ProductImage3,
      imageAlt: "10 ounce platinum bar",
      badge: null,
      metal: "Platinum",
      weight: 311,
      year: 2024
    }
  ];

  // Filter products based on selected metal
  const filteredProducts = selectedFilter === 'All' 
    ? allProducts 
    : allProducts.filter(product => product.metal === selectedFilter);

  // Sort filtered products based on selected sort option
  const products = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case 'Price: Low to High':
        return a.priceUSD - b.priceUSD;
      case 'Price: High to Low':
        return b.priceUSD - a.priceUSD;
      case 'Year: Ascending':
        return a.year - b.year;
      case 'Year: Descending':
        return b.year - a.year;
      case 'Weight: Ascending':
        return a.weight - b.weight;
      case 'Weight: Descending':
        return b.weight - a.weight;
      case 'Most Popular':
        // For now, keep original order for "Most Popular"
        return 0;
      case 'Default':
      default:
        return 0;
    }
  });

  return (
    <div ref={sectionRef} className="bg-[#fcf8f1] relative w-full mt-[48px] py-12 sm:py-16 lg:py-0 px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px]">
      {/* Header with Title and Filters */}
      <div 
        ref={headerRef}
        style={{ opacity: 0, transform: 'translateY(50px)' }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16"
      >
        {/* Title */}
        <h2 className="font-inter font-bold text-[32px] sm:text-[36px] lg:text-[42px] leading-[1.1]">
          <span className="text-[#ffc633]">Shop </span>
          <span className="text-slate-900">Our Inventory</span>
        </h2>

        {/* Filters */}
        <div className="flex gap-[10px]">
          {/* Sort By Filter */}
          <div className="relative">
            <button 
              ref={sortButtonRef}
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`flex items-center justify-between gap-3 px-5 py-4 h-[48px] border rounded-[62px] transition-all focus:outline-none ${
                isSortOpen 
                  ? 'bg-black border-black' 
                  : 'bg-[#fcf8f1] border-[#7c7c7c] hover:border-black'
              }`}
            >
              <span className={`font-inter font-normal text-[16px] whitespace-nowrap ${
                isSortOpen ? 'text-white' : 'text-black'
              }`}>
                Sort by
              </span>
              <div className={`relative w-4 h-4 ${isSortOpen ? 'brightness-0 invert' : ''}`}>
                <Image
                  src={ChevronDown}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </button>
          </div>

          {/* Filter by Metals */}
          <div className="relative">
            <button 
              ref={filterButtonRef}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-between gap-3 px-5 py-4 h-[48px] border rounded-[62px] transition-all focus:outline-none ${
                isFilterOpen 
                  ? 'bg-black border-black' 
                  : 'bg-[#fcf8f1] border-[#7c7c7c] hover:border-black'
              }`}
            >
              <div className="flex items-center gap-[9px]">
                <div className={`relative w-6 h-6 ${isFilterOpen ? 'brightness-0 invert' : ''}`}>
                  <Image
                    src={FilterIcon}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <span className={`font-inter font-normal text-[16px] whitespace-nowrap ${
                  isFilterOpen ? 'text-white' : 'text-black'
                }`}>
                  Filter by Metals
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div 
        ref={productsRef}
        style={{ opacity: 0, transform: 'translateY(50px)' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-[14px] max-w-full"
      >
        {products.map((product) => (
          <Link 
            key={product.id}
            href={`/marketplace/${product.id}`}
            className="bg-white rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 flex flex-col relative min-h-[460px] sm:min-h-[500px] lg:min-h-[534px] hover:shadow-lg transition-shadow duration-300"
          >
            {/* Best Value Badge */}
            {product.badge && (
              <div className="absolute top-[42px] left-0 bg-[#ffc633] px-[10px] py-[7px] rounded-br-[4px] rounded-tr-[4px] z-10">
                <span className="font-inter font-semibold text-[10px] text-black uppercase tracking-[1.3px]">
                  {product.badge}
                </span>
              </div>
            )}

            {/* Product Image */}
            <div className="bg-white h-[160px] sm:h-[180px] lg:h-[200px] w-full rounded-lg mb-6 sm:mb-8 lg:mb-[43px] flex items-center justify-center">
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
              <h3 className="font-inter font-semibold text-[20px] sm:text-[22px] lg:text-[24px] leading-[1.14] text-black">
                {product.title}
              </h3>

              {/* Description */}
              <p className="font-inter font-medium text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.57] text-[#7c7c7c]">
                {product.description}
              </p>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Price Section */}
              <div className="flex flex-col gap-[6px] mb-6">
                {/* USD Price */}
                <div className="font-inter font-medium text-[18px] sm:text-[19px] lg:text-[20px] leading-[1.37] text-black">
                  ${product.priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </div>

                {/* SOL Price */}
                <div className="flex items-center gap-[6px]">
                  <div className="relative w-[19px] h-[19px]">
                    <Image
                      src={SolLogo}
                      alt="Solana logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-inter font-medium text-[15px] sm:text-[16px] text-[#8a8a8a] leading-normal">
                    {product.solAmount}
                  </span>
                </div>
              </div>

              {/* View Product Button */}
              <div className="bg-[#141722] text-[#efe9e0] px-7 py-[17px] rounded-[42px] font-inter font-medium text-[13px] sm:text-[14px] uppercase tracking-wider hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:from-[4.98%] hover:to-[#FFB546] hover:to-[95.02%] hover:text-black transition-all duration-300 w-full text-center">
                View Product
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Portal for Sort Dropdown Menu */}
      {mounted && isSortOpen && dropdownPosition && createPortal(
        <div 
          ref={sortMenuRef}
          className="bg-white rounded-[20px] shadow-[0_8px_31.1px_-9px_rgba(0,0,0,0.25)] overflow-hidden p-4 min-w-[280px]" 
          style={{
            position: 'absolute',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            zIndex: 10000
          }}
        >
          <div className="flex flex-col gap-[6px]">
            {sortOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleSortSelect(option)}
                className="w-full flex items-center gap-3 h-[32px] px-3 rounded-[8px] hover:bg-[#fff2da] transition-colors focus:outline-none"
              >
                {/* Radio Button */}
                <div className="relative w-6 h-6 flex-shrink-0">
                  <div className={`w-full h-full rounded-full border-2 flex items-center justify-center ${
                    selectedSort === option 
                      ? 'border-black' 
                      : 'border-gray-300'
                  }`}>
                    {selectedSort === option && (
                      <div className="w-3 h-3 rounded-full bg-black"></div>
                    )}
                  </div>
                </div>
                <span className={`font-inter font-medium text-[13.38px] text-[#1a1a1a] leading-[1.4]`}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}

      {/* Portal for Filter Dropdown Menu */}
      {mounted && isFilterOpen && filterDropdownPosition && createPortal(
        <div 
          ref={filterMenuRef}
          className="bg-white rounded-[20px] shadow-[0_8px_31.1px_-9px_rgba(0,0,0,0.25)] overflow-hidden p-4 min-w-[195px]" 
          style={{
            position: 'absolute',
            top: `${filterDropdownPosition.top}px`,
            left: `${filterDropdownPosition.left}px`,
            zIndex: 10000
          }}
        >
          <div className="flex flex-col gap-[6px]">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleFilterSelect(option)}
                className={`w-full flex items-center h-[32px] px-3 rounded-[8px] transition-colors focus:outline-none ${
                  selectedFilter === option 
                    ? 'bg-[#fff2da]' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className={`font-inter font-medium text-[13.38px] text-[#1a1a1a] leading-[1.4]`}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default MarketplaceInventory;


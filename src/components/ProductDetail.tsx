"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useCart } from '@/context/CartContext';

// Import product images
import ProductImage1 from '/public/images/product-image1.png';
import ProductImage2 from '/public/images/product-image2.png';
import ProductImage3 from '/public/images/product-image3.png';
import ProductImage4 from '/public/images/product-image4.png';

// Import icons
import SolLogo from '/public/images/icons/sol-logo.svg';
import FlameLogo from '/public/images/icons/flame.svg';
import LikeLogo from '/public/images/icons/like.svg';

interface ProductDetailProps {
  productId: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [selectedPricingTier, setSelectedPricingTier] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const relatedProductsRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  // Product database (in a real app, this would be fetched from an API)
  const productDatabase = {
    '1': {
      id: '1',
      brand: 'ELEMETAL',
      name: '1 g Fine Gold Grain',
      price: 82.50,
      originalPrice: 120,
      discount: 31,
      metal: 'Gold',
      images: [ProductImage1, ProductImage1, ProductImage1],
      recentSales: 15,
      volumePricing: [
        { quantity: '1-9', checkWire: 82.50, crypto: 84.50, ccPaypal: 85.00 },
        { quantity: '10-24', checkWire: 80.00, crypto: 82.00, ccPaypal: 82.50 },
        { quantity: '25+', checkWire: 78.00, crypto: 80.00, ccPaypal: 80.50 }
      ],
      description: '1g fine gold grain represents an accessible entry point into precious metal investment. Each grain is refined to the highest purity standards, making it perfect for those starting their journey into gold ownership or looking to add small increments to their portfolio.'
    },
    '2': {
      id: '2',
      brand: 'ELEMETAL',
      name: '1 oz Gold Bar',
      price: 260,
      originalPrice: 300,
      discount: 40,
      metal: 'Gold',
      images: [ProductImage2, ProductImage2, ProductImage2],
      recentSales: 10,
      volumePricing: [
        { quantity: '1-9', checkWire: 260.94, crypto: 264.94, ccPaypal: 262.94 },
        { quantity: '10-24', checkWire: 250.94, crypto: 256.94, ccPaypal: 256.64 },
        { quantity: '25+', checkWire: 225.94, crypto: 230.94, ccPaypal: 242.24 }
      ],
      description: '1oz gold bars, long-considered a premium bullion product - combine top-tier purity and security, making it a favored addition to any dealer or collector\'s holdings. These sealed bullion products represent an opportunity for many collectors looking to add to their bullion collection with the timeless allure of gold.'
    },
    '3': {
      id: '3',
      brand: 'ELEMETAL',
      name: '10 oz Gold Bar',
      price: 2625,
      originalPrice: 3000,
      discount: 13,
      metal: 'Gold',
      images: [ProductImage3, ProductImage3, ProductImage3],
      recentSales: 5,
      volumePricing: [
        { quantity: '1-9', checkWire: 2625.00, crypto: 2650.00, ccPaypal: 2680.00 },
        { quantity: '10-24', checkWire: 2600.00, crypto: 2625.00, ccPaypal: 2655.00 },
        { quantity: '25+', checkWire: 2575.00, crypto: 2600.00, ccPaypal: 2630.00 }
      ],
      description: '10oz gold bars offer serious investors a substantial holding in one of the world\'s most valued precious metals. Each bar is meticulously crafted and sealed for authenticity, representing a significant step in wealth preservation.'
    },
    '4': {
      id: '4',
      brand: 'UNITY MINT',
      name: '1 oz Silver Unity Bar',
      price: 32.50,
      originalPrice: 40,
      discount: 19,
      metal: 'Silver',
      images: [ProductImage4, ProductImage4, ProductImage4],
      recentSales: 25,
      volumePricing: [
        { quantity: '1-9', checkWire: 32.50, crypto: 33.50, ccPaypal: 34.00 },
        { quantity: '10-24', checkWire: 31.00, crypto: 32.00, ccPaypal: 32.50 },
        { quantity: '25+', checkWire: 30.00, crypto: 31.00, ccPaypal: 31.50 }
      ],
      description: '1oz Silver Unity Bars represent both beauty and value. Crafted with precision and sealed for protection, these bars offer an affordable entry into precious metal investment while maintaining the highest quality standards.'
    }
  };

  // Get product data based on productId, fallback to product 2 if not found
  const product = productDatabase[productId as keyof typeof productDatabase] || productDatabase['2'];

  const tabs = [
    'OVERVIEW',
    'PURITY & SPECS',
    'DESIGN & CRAFTSMANSHIP',
    'COLLECTABILITY',
    'LIQUIDITY'
  ];

  // Tab content
  const tabContent = {
    'OVERVIEW': '1oz gold bars, long-considered a premium bullion product – combine top-tier purity and security, making it a favored addition to any dealer or collector\'s holdings. These sealed bullion products represent an opportunity for many collectors looking to add to their bullion collection with the timeless allure of gold.',
    'PURITY & SPECS': 'Purity: Nearly all 1oz Gold Bars sold by Elemetal are crafted from .9999+ pure gold, ensuring a premium product that meets the highest industry standards.\n\nTangible Metal: Gold bars provide a physical bullion asset that can be held, stored, and passed down through generations. Collecting gold offers a sense of permanence associated with the bullion product that is often unmatched by other consumable items.',
    'DESIGN & CRAFTSMANSHIP': 'Design: 1oz gold bars, including those by Elemetal, often feature sleek, refined designs. Elemetal bars showcase aesthetics with clean lines, displaying the purity and weight prominently. Their design emphasizes the bar\'s weight and purity, appealing to both dealers and collectors seeking elegance and authenticity.',
    'COLLECTABILITY': 'Collectability: Gold bars are highly collectible due to their intrinsic value, historical significance, and aesthetic appeal. Gold often represents wealth, making them attractive to collectors. The rarity and craftsmanship of certain bars can also add to their allure, turning them into sought-after pieces for collections.',
    'LIQUIDITY': 'Universal Acceptance: Gold is recognized and accepted worldwide, making it a highly liquid asset. Sealed and Certified gold bars can easily be bought, sold, or traded, offering collectors flexibility and convenience in managing their metal holdings.'
  };

  // Related products
  const relatedProducts = [
    { id: 1, name: '1 g Fine Gold Grain', price: 44272.12, crypto: 186.8862, image: ProductImage1 },
    { id: 2, name: '1 oz Gold Bar', price: 44272.12, crypto: 186.8862, image: ProductImage2 },
    { id: 3, name: '10 oz Gold Bar', price: 44272.12, crypto: 186.8862, image: ProductImage3 },
    { id: 4, name: '1 ox Silver Unity Bar', price: 44272.12, crypto: 186.8862, image: ProductImage4 }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in product details
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.3
      });

      // Create intersection observer for related products
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.from(entry.target.children, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      if (relatedProductsRef.current) {
        observer.observe(relatedProductsRef.current);
      }

      return () => observer.disconnect();
    }, contentRef);

    return () => ctx.revert();
  }, []);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
    
    // Update selected pricing tier based on quantity
    if (newQuantity >= 25) {
      setSelectedPricingTier(2);
    } else if (newQuantity >= 10) {
      setSelectedPricingTier(1);
    } else {
      setSelectedPricingTier(0);
    }
  };

  const handlePricingTierClick = (tierIndex: number) => {
    setSelectedPricingTier(tierIndex);
    
    // Set quantity to the minimum of the selected tier
    if (tierIndex === 0) {
      setQuantity(1);
    } else if (tierIndex === 1) {
      setQuantity(10);
    } else if (tierIndex === 2) {
      setQuantity(25);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      brand: product.brand,
      quantity: quantity
    });
  };

  return (
    <div className="w-full">
      {/* Main Product Section */}
      <div ref={contentRef} className="bg-white px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px] pt-[120px] sm:pt-[140px] lg:pt-[160px] pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-[16px] text-[rgba(0,0,0,0.6)] hover:text-black transition-colors">
            Home
          </Link>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-[-90deg]">
            <path d="M12 6L8 10L4 6" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Link href="/marketplace" className="text-[16px] text-[rgba(0,0,0,0.6)] hover:text-black transition-colors">
            Shop
          </Link>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-[-90deg]">
            <path d="M12 6L8 10L4 6" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[16px] text-[rgba(0,0,0,0.6)]">{product.metal}</span>
        </div>

        {/* Product Content Grid */}
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Left: Image Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 sm:gap-6 lg:items-end">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-3 justify-start lg:justify-end">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-[55px] h-[96px] rounded-[7px] overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-[rgba(0,0,0,0.1)]' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Product view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative w-full lg:w-[342px] h-[300px] sm:h-[400px] lg:h-[597px] rounded-[24px] sm:rounded-[36px] lg:rounded-[72px] overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Product Info Card */}
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 h-fit">
            <div className="flex flex-col gap-[18px]">
              {/* Brand */}
              <div className="font-inter font-medium text-[12px] text-[#7c7c7c] uppercase tracking-wider">
                {product.brand}
              </div>

              {/* Product Name */}
              <h1 className="font-inter font-bold text-[24px] sm:text-[32px] lg:text-[40px] text-black leading-tight sm:leading-none">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="font-inter font-bold text-[24px] sm:text-[32px] text-black">${product.price}</span>
                  <span className="font-inter font-bold text-[24px] sm:text-[32px] text-[#7c7c7c] line-through">${product.originalPrice}</span>
                </div>
                <div className="bg-[rgba(51,146,255,0.1)] px-[12px] sm:px-[14px] py-[4px] sm:py-[6px] rounded-full">
                  <span className="font-inter font-medium text-[14px] sm:text-[16px] text-[#3392ff]">-{product.discount}%</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[rgba(0,0,0,0.1)]"></div>

              {/* Volume Discount Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <span className="font-inter font-medium text-[14px] sm:text-[16px] text-black whitespace-nowrap">Volume Discount Pricing</span>
                <div className="flex items-center gap-2">
                  <div className="relative w-[18px] h-[18px] flex-shrink-0">
                    <Image
                      src={FlameLogo}
                      alt="Hot"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-inter font-normal text-[13px] sm:text-[16px] text-[#ff3333]">{product.recentSales} sold in the last week</span>
                </div>
              </div>

              {/* Pricing Table */}
              <div className="space-y-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                {/* Header Row */}
                <div className="grid grid-cols-4 gap-2 sm:gap-4 font-inter font-medium text-[11px] sm:text-[14px] text-black text-center mb-2 min-w-[300px] sm:min-w-0">
                  <div>Quantity</div>
                  <div className="whitespace-nowrap">Check Wire</div>
                  <div>Crypto</div>
                  <div className="whitespace-nowrap">CC/Paypal</div>
                </div>

                {/* Pricing Rows */}
                {product.volumePricing.map((row, index) => (
                  <button
                    key={index}
                    onClick={() => handlePricingTierClick(index)}
                    className={`w-full grid grid-cols-4 gap-2 sm:gap-4 font-inter font-normal text-[11px] sm:text-[14px] text-black text-center py-2 sm:py-3 rounded-full transition-colors cursor-pointer min-w-[300px] sm:min-w-0 ${
                      selectedPricingTier === index ? 'bg-[#f7f7f7]' : 'hover:bg-[#fafafa]'
                    }`}
                  >
                    <div>{row.quantity}</div>
                    <div>${row.checkWire}</div>
                    <div>${row.crypto}</div>
                    <div>${row.ccPaypal}</div>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-[rgba(0,0,0,0.1)]"></div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  {/* Wishlist Button */}
                  <button className="flex items-center justify-center w-[52px] h-[52px] rounded-full border border-[#dfdfdf] hover:bg-[#f7f7f7] hover:border-[#dfdfdf] transition-colors cursor-pointer flex-shrink-0">
                    <div className="relative w-[26px] h-[26px]">
                      <Image
                        src={LikeLogo}
                        alt="Like"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </button>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between w-[150px] h-[52px] border border-[#dfdfdf] rounded-full px-3 flex-shrink-0">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="flex items-center justify-center w-[36px] h-[36px] rounded-full text-black text-xl font-medium hover:bg-[#f7f7f7] hover:text-[#ffb546] transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <span className="font-satoshi text-[16px] text-black">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="flex items-center justify-center w-[36px] h-[36px] rounded-full text-black text-xl font-medium hover:bg-[#f7f7f7] hover:text-[#ffb546] transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 bg-[#141722] text-[#efe9e0] font-inter font-medium text-[14px] uppercase h-[52px] rounded-full hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:from-[4.98%] hover:to-[#FFB546] hover:to-[95.02%] hover:text-black transition-all duration-300 cursor-pointer"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Product Details Tabs */}
        <div className="flex flex-col gap-8 sm:gap-12 max-w-[998px] mx-auto mb-12 sm:mb-16">
          {/* Section Title */}
          <h2 className="font-inter font-bold text-[24px] sm:text-[32px] lg:text-[42px] text-center leading-none">
            <span className="text-[#ffc633]">Product</span>
            <span className="text-black"> Details</span>
          </h2>

          {/* Tabs */}
          <div className="relative">
            {/* Tab Border Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[rgba(0,0,0,0.1)]"></div>

            {/* Tab Buttons - Scrollable on Mobile */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex items-center gap-1 sm:gap-2 lg:justify-between relative min-w-max sm:min-w-0">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2 sm:px-3 lg:px-5 py-2 sm:py-3 font-inter font-medium text-[10px] sm:text-[12px] lg:text-[16px] uppercase transition-all relative cursor-pointer whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-[#ffb546] text-black rounded-t-[9px] border-b-[3px] border-black'
                        : 'text-[#141722] hover:text-[#ffb546] border-b-[3px] border-transparent'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="font-inter font-normal text-[14px] sm:text-[16px] text-black leading-[25px] whitespace-pre-line min-h-[120px] sm:min-h-[150px]">
            {tabContent[activeTab as keyof typeof tabContent]}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="bg-[#fcf8f1] py-12 lg:py-20 px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px]">
        <div className="max-w-[1728px] mx-auto">
          {/* Section Title */}
          <h2 className="font-inter font-bold text-[32px] lg:text-[42px] text-center leading-none mb-12 lg:mb-16">
            <span className="text-[#ffc633]">Related</span>
            <span className="text-black"> Products</span>
          </h2>

          {/* Products Grid */}
          <div ref={relatedProductsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-white rounded-[36px] overflow-hidden flex flex-col">
                {/* Product Image */}
                <div className="relative w-full h-[200px] p-6">
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <h3 className="font-inter font-semibold text-[24px] text-black leading-[1.14]">
                    {relatedProduct.name}
                  </h3>
                  <p className="font-inter font-medium text-[16px] text-[#7c7c7c] leading-[1.57]">
                    From fractional gold to full ounces - find the perfect precious met
                  </p>

                  {/* Price */}
                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="font-inter font-medium text-[20px] text-black">
                      ${relatedProduct.price.toLocaleString()} USD
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative w-[19px] h-[19px]">
                        <Image
                          src={SolLogo}
                          alt="SOL"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-inter font-medium text-[16px] text-[#8a8a8a]">
                        {relatedProduct.crypto}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Link
                    href={`/marketplace/${relatedProduct.id}`}
                    className="w-full bg-[#141722] text-[#efe9e0] font-inter font-medium text-[14px] uppercase py-[17px] rounded-full text-center hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:from-[4.98%] hover:to-[#FFB546] hover:to-[95.02%] hover:text-black transition-all duration-300"
                  >
                    Add to cart
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrow */}
          <div className="flex justify-end mt-8">
            <button className="bg-black rounded-full p-3 hover:bg-[#ffb546] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="rotate-[-90deg]">
                <path d="M18 9L12 15L6 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


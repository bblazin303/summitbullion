"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useCart } from '@/context/CartContext';
import type { Inventory } from '@/types/platformGold';
import { fetchInventoryById, applyMarkup, getMetalDisplayName } from '@/lib/platformGoldApi';
import { useAuthenticatedAction } from '@/hooks/useAuthenticatedAction';

// Import product images (fallback)
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const relatedProductsRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { executeIfAuthenticated } = useAuthenticatedAction();
  const [productData, setProductData] = useState<Inventory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data from Platform Gold API
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchInventoryById(parseInt(productId));
        
        if (!data) {
          setError('Product not found');
        } else {
          setProductData(data);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

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

  // Transform API data to component format
  const getTransformedProduct = () => {
    if (!productData) return null;

    const markedUpPrice = applyMarkup(productData.askPrice, 2);
    const originalPrice = productData.askPrice * 1.15; // Show 15% higher as "original"
    const discount = Math.round(((originalPrice - markedUpPrice) / originalPrice) * 100);

    // Get images
    const images: (string | StaticImageData)[] = [
      productData.mainImage,
      productData.altImage1,
      productData.altImage2,
      productData.altImage3
    ].filter(Boolean) as string[];

    // Fallback to static images if no images
    if (images.length === 0) {
      const fallback = getFallbackImage(productData.metalSymbol);
      images.push(fallback, fallback, fallback);
    }

    // Generate volume pricing tiers
    const volumePricing = [
      {
        quantity: `1-${productData.minAskQty > 1 ? productData.minAskQty - 1 : 9}`,
        checkWire: markedUpPrice,
        crypto: markedUpPrice * 1.02,
        ccPaypal: markedUpPrice * 1.03
      },
      {
        quantity: `${productData.minAskQty > 1 ? productData.minAskQty : 10}-24`,
        checkWire: markedUpPrice * 0.98,
        crypto: markedUpPrice * 1.00,
        ccPaypal: markedUpPrice * 1.01
      },
      {
        quantity: '25+',
        checkWire: markedUpPrice * 0.96,
        crypto: markedUpPrice * 0.98,
        ccPaypal: markedUpPrice * 0.99
      }
    ];

    return {
      id: productData.id.toString(),
      brand: productData.manufacturer || 'Platform Gold',
      name: productData.name,
      price: markedUpPrice,
      originalPrice: originalPrice,
      discount: discount,
      metal: getMetalDisplayName(productData.metalSymbol),
      images: images,
      recentSales: Math.floor(productData.sellQuantity / 10) || 5,
      volumePricing: volumePricing,
      description: `${productData.name} - ${productData.purity} purity ${getMetalDisplayName(productData.metalSymbol)}. ${productData.metalOz} troy ounces of precious metal content. ${productData.iraEligible ? 'IRA Eligible. ' : ''}This product is available for immediate delivery with ${productData.sellQuantity} units in stock.`,
      metalOz: productData.metalOz,
      purity: productData.purity,
      sku: productData.sku,
      year: productData.year,
      sellQuantity: productData.sellQuantity
    };
  };

  const product = getTransformedProduct();

  const tabs = [
    'OVERVIEW',
    'PURITY & SPECS',
    'DESIGN & CRAFTSMANSHIP',
    'COLLECTABILITY',
    'LIQUIDITY'
  ];

  // Tab content - dynamic based on product data
  const getTabContent = () => {
    if (!product) return {};
    
    const metalName = product.metal;
    const purity = product.purity || '.999+ pure';
    
    return {
      'OVERVIEW': product.description,
      'PURITY & SPECS': `Purity: This ${metalName} product is crafted from ${purity} metal, ensuring a premium product that meets the highest industry standards.\n\nWeight: ${product.metalOz} troy ounces of precious ${metalName}.\n\nSKU: ${product.sku}\n\nTangible Metal: ${metalName} provides a physical bullion asset that can be held, stored, and passed down through generations.`,
      'DESIGN & CRAFTSMANSHIP': `Design: ${product.name} features refined design and craftsmanship. ${product.brand} products showcase aesthetics with clean lines, displaying the purity and weight prominently. The design emphasizes authenticity and quality, appealing to both dealers and collectors.`,
      'COLLECTABILITY': `Collectability: ${metalName} bullion is highly collectible due to its intrinsic value, historical significance, and aesthetic appeal. This product from ${product.brand} represents wealth and quality, making it attractive to collectors worldwide.${product.year ? ` Year: ${product.year}` : ''}`,
      'LIQUIDITY': `Universal Acceptance: ${metalName} is recognized and accepted worldwide, making it a highly liquid asset. This product can easily be bought, sold, or traded, offering flexibility and convenience in managing your precious metal holdings. Current availability: ${product.sellQuantity} units in stock.`
    };
  };

  const tabContent = getTabContent();

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isImageModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isImageModalOpen]);

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
    if (!product || !productData) return;
    
    // Calculate pricing breakdown
    const basePrice = productData.askPrice; // Platform Gold's original price
    const markedUpPrice = applyMarkup(basePrice, 2); // Your price with 2% markup
    const markupAmount = markedUpPrice - basePrice; // Dollar amount of markup
    
    // Require authentication before adding to cart
    executeIfAuthenticated(() => {
      addToCart({
        id: product.id,
        name: product.name,
        pricing: {
          basePrice: basePrice, // Platform Gold's cost
          markupPercentage: 2, // 2% markup
          markup: markupAmount, // Your profit per unit
          finalPrice: markedUpPrice, // Final price customer pays
        },
        image: product.images[0] as StaticImageData | string,
        brand: product.brand,
        quantity: quantity
      });
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#ffc633]"></div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
          <p className="text-red-700">{error || 'Product not found'}</p>
          <Link 
            href="/marketplace" 
            className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-[#ffc633] transition-colors"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Product Section */}
      <div ref={contentRef} className="bg-white px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px] pt-[120px] sm:pt-[140px] lg:pt-[160px] pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-[16px] text-[rgba(0,0,0,0.6)] hover:text-[#ffc633] transition-colors">
            Home
          </Link>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-[-90deg]">
            <path d="M12 6L8 10L4 6" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Link href="/marketplace" className="text-[16px] text-[rgba(0,0,0,0.6)] hover:text-[#ffc633] transition-colors">
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
                  className={`relative w-[55px] h-[96px] rounded-[7px] overflow-hidden border-2 transition-all bg-white ${
                    selectedImage === index ? 'border-black/30' : 'border-[rgba(0,0,0,0.1)]'
                  }`}
                >
                  {typeof image === 'string' ? (
                    <Image
                      src={image}
                      alt={`Product view ${index + 1}`}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  ) : (
                    <Image
                      src={image}
                      alt={`Product view ${index + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative w-full lg:w-[342px] h-[300px] sm:h-[400px] lg:h-[597px] rounded-[24px] sm:rounded-[36px] lg:rounded-[72px] overflow-hidden bg-white">
              {typeof product.images[selectedImage] === 'string' ? (
                <Image
                  src={product.images[selectedImage] as string}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  unoptimized
                />
              ) : (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                />
              )}
              
              {/* Maximize Button */}
              <button
                onClick={() => setIsImageModalOpen(true)}
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full transition-all duration-200 hover:scale-110 z-10 cursor-pointer"
                aria-label="Maximize image"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 3h3m0 0v3m0-3l-5 5M6 17H3m0 0v-3m0 3l5-5"/>
                  <path d="M3 3h3M17 17h-3M3 17v-3M17 3v3"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Product Info Card */}
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 h-fit">
            <div className="flex flex-col gap-[18px]">
              {/* Brand */}
              <div className="font-inter font-medium text-[12px] text-[#7c7c7c] uppercase tracking-wider truncate">
                {product.brand}
              </div>

              {/* Product Name */}
              <h1 className="font-inter font-bold text-[24px] sm:text-[32px] lg:text-[40px] text-black leading-tight overflow-hidden text-ellipsis" style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="font-inter font-bold text-[24px] sm:text-[32px] text-black">${product.price.toFixed(2)}</span>
                  <span className="font-inter font-bold text-[24px] sm:text-[32px] text-[#7c7c7c] line-through">${product.originalPrice.toFixed(2)}</span>
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
                    <div>${row.checkWire.toFixed(2)}</div>
                    <div>${row.crypto.toFixed(2)}</div>
                    <div>${row.ccPaypal.toFixed(2)}</div>
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
                  <h3 className="font-inter font-semibold text-[24px] text-black leading-[1.14] overflow-hidden text-ellipsis" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {relatedProduct.name}
                  </h3>
                  <p className="font-inter font-medium text-[16px] text-[#7c7c7c] leading-[1.57] overflow-hidden text-ellipsis" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
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

      {/* Image Modal Overlay */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsImageModalOpen(false)}
        >
          {/* Modal Content */}
          <div 
            className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-[#ffc633] transition-colors cursor-pointer z-10"
              aria-label="Close"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M24 8L8 24M8 8l16 16"/>
              </svg>
            </button>

            {/* Image Container */}
            <div className="relative w-full h-full bg-white rounded-[24px] overflow-hidden">
              {typeof product.images[selectedImage] === 'string' ? (
                <Image
                  src={product.images[selectedImage] as string}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  unoptimized
                />
              ) : (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                />
              )}
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="flex gap-3 justify-center mt-6 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-[80px] h-[80px] flex-shrink-0 rounded-[12px] overflow-hidden border-2 transition-all bg-white ${
                      selectedImage === index ? 'border-[#ffc633]' : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    {typeof image === 'string' ? (
                      <Image
                        src={image}
                        alt={`View ${index + 1}`}
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                    ) : (
                      <Image
                        src={image}
                        alt={`View ${index + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;


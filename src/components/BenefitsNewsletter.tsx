"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';

// Import benefit images
import Benefits1 from '/public/images/benefits1.png';
import Benefits2 from '/public/images/benefits2.png';
import Benefits3 from '/public/images/benefits3.png';
import Benefits4 from '/public/images/benefits4.png';

// Import newsletter image
import NewsletterImage from '/public/images/newsletter-image.png';

// Import chevron icon
import ChevronRight from '/public/images/icons/chevron-right.svg';

const BenefitsNewsletter: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);

  // Newsletter form state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          utm_source: 'website',
          utm_campaign: 'homepage_newsletter',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({ 
          type: 'success', 
          message: data.message || "You're in! Check your inbox." 
        });
        setEmail(''); // Clear the input on success
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: data.error || 'Something went wrong. Please try again.' 
        });
      }
    } catch {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, benefitsRef.current, newsletterRef.current], {
        opacity: 0,
        y: 50
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
                duration: 0.8,
                ease: "power2.out"
              });

              // Then animate benefits cards with stagger
              gsap.to(benefitsRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.0,
                ease: "power2.out",
                delay: 0.2
              });

              // Finally animate newsletter section
              gsap.to(newsletterRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.0,
                ease: "power2.out",
                delay: 0.4
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
  const benefits = [
    {
      image: Benefits1,
      title: "Physical Assets. Fast Shipping.",
      description: "From fractional gold to full ounces - find the perfect precious metals for your portfolio.",
      buttonText: "BROWSE PRODUCTS",
      link: "/marketplace",
      external: false,
      darkMode: false
    },
    {
      image: Benefits2,
      title: "Free Shipping on Eligible Orders",
      description: "Insured delivery at no extra cost when you meet the threshold.",
      buttonText: "VIEW DETAILS",
      link: "/docs#shipping",
      external: false,
      darkMode: false
    },
    {
      image: Benefits3,
      title: "Flexible Payment Options.",
      description: "Wire, ACH, card, and crypto. Payment options for traditional and modern investors.",
      buttonText: "VIEW OPTIONS",
      link: "/docs#buy-physical",
      external: false,
      darkMode: false
    },
    {
      image: Benefits4,
      title: "Join our active community",
      description: "Buy Zzzz Our Legacy Token And Become Part Of The Family.",
      buttonText: "BUY ZZZZ",
      link: "https://dexscreener.com/solana/dfrlbuzvptylja5js2pg7smuckjfzeav6jmcarfqhy29",
      external: true,
      darkMode: true
    }
  ];

  return (
    <div ref={sectionRef} className="bg-[#fcf8f1] relative w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px]">
      {/* Title */}
      <h2 ref={titleRef} style={{ opacity: 0, transform: 'translateY(50px)' }} className="font-inter font-semibold text-[32px] sm:text-[36px] lg:text-[42px] leading-[1.1] text-center mb-8 sm:mb-12 lg:mb-16">
        <span className="text-[#ffb546]">Our </span>
        <span className="text-black">Key Benefits</span>
      </h2>

      {/* Benefits Cards */}
      <div ref={benefitsRef} style={{ opacity: 0, transform: 'translateY(50px)' }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-[14px] max-w-7xl mx-auto mb-8 sm:mb-12 lg:mb-16">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className={`${
              benefit.darkMode ? 'bg-white sm:bg-[#141722]' : 'bg-white'
            } rounded-[24px] sm:rounded-[36px] p-6  flex flex-col justify-between min-h-[320px] sm:h-[382px]`}
          >
            {/* Top Content */}
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Icon */}
              <div className="relative w-[60px] sm:w-[77px] h-[42px] sm:h-[54px]">
                <Image
                  src={benefit.image}
                  alt={benefit.title}
                  fill
                  className="object-contain object-left"
                />
              </div>

              {/* Title */}
              <h3
                className={`font-inter font-semibold text-[20px] sm:text-[24px] leading-normal ${
                  benefit.darkMode ? 'text-black sm:text-stone-50' : 'text-black'
                }`}
              >
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="font-inter font-medium text-[14px] sm:text-[16px] leading-[22px] sm:leading-[25.085px] text-stone-400">
                {benefit.description}
              </p>
            </div>

            {/* Bottom Action */}
            {benefit.darkMode ? (
              <>
                {/* Mobile: Arrow Link with chevron in corner */}
                <Link 
                  href={benefit.link}
                  target={benefit.external ? "_blank" : undefined}
                  rel={benefit.external ? "noopener noreferrer" : undefined}
                  className="flex sm:hidden items-end justify-between w-full transition-all duration-300 mt-4"
                >
                  <span className="font-inter font-semibold text-[14px] text-neutral-800">
                    {benefit.buttonText}
                  </span>
                  <div className="relative w-[32px] h-[32px] flex-shrink-0">
                    <Image
                      src={ChevronRight}
                      alt="Arrow"
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
                {/* Desktop: Gradient Button */}
                <Link 
                  href={benefit.link}
                  target={benefit.external ? "_blank" : undefined}
                  rel={benefit.external ? "noopener noreferrer" : undefined}
                  className="hidden sm:block bg-gradient-to-br from-[#FFF0C1] from-[4.98%] to-[#FFB546] to-[95.02%] rounded-[42px] px-6 sm:px-7 py-4 sm:py-[18px] font-inter font-medium text-[13px] sm:text-[14.4px] uppercase text-black hover:shadow-lg transition-all duration-300 w-full mt-4 text-center"
                >
                  {benefit.buttonText}
                </Link>
              </>
            ) : (
              <Link 
                href={benefit.link}
                target={benefit.external ? "_blank" : undefined}
                rel={benefit.external ? "noopener noreferrer" : undefined}
                className="flex items-end justify-between w-full sm:w-auto sm:items-center sm:justify-start sm:gap-3 transition-all duration-300 mt-4 hover:gap-4"
              >
                <span className="font-inter font-semibold text-[14px] sm:text-[15.963px] text-neutral-800">
                  {benefit.buttonText}
                </span>
                <div className="relative w-[32px] h-[32px] sm:w-6 sm:h-6 flex-shrink-0">
                  <Image
                    src={ChevronRight}
                    alt="Arrow"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Newsletter Section */}
      <div ref={newsletterRef} style={{ opacity: 0, transform: 'translateY(50px)' }} className="bg-black rounded-[24px] sm:rounded-[36px] max-w-7xl mx-auto overflow-hidden relative">
        {/* Newsletter Image - Desktop Only (1100px+) */}
        <div className="hidden xl:block absolute left-0 top-0 bottom-0 w-[255px]">
          <div className="relative w-full h-full">
            <Image
              src={NewsletterImage}
              alt="Newsletter"
              fill
              className="object-cover object-left"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative flex flex-col md:flex-row items-stretch md:items-center gap-6 md:gap-8 py-8 sm:py-10 md:py-12 px-6 sm:px-8 xl:pl-[287px] xl:pr-[67px]">
          {/* Text Content */}
          <div className="flex flex-col gap-3 text-center md:text-left flex-1 min-w-0">
            <h2 className="font-inter font-semibold text-[clamp(24px,5vw,40px)] leading-[1.2] text-white tracking-[-1.2px]">
            Financial Freedom Starts with Clear Insight
            </h2>
            <p className="font-inter font-normal text-[clamp(14px,3vw,20px)] text-[#b7b7b7] tracking-[-0.6px]">
            Get our weekly Metals Brief news, policy moves, and practical tips on buying physical gold & silver (no hype, just what matters).
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3 w-full md:w-auto md:min-w-[300px] md:max-w-[374px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isSubmitting}
              className="bg-white rounded-[62px] px-6 py-4 font-inter font-normal text-[clamp(14px,2vw,16px)] text-black placeholder:text-[#7c7c7c] h-[52px] text-center md:text-left focus:outline-none focus:ring-2 focus:ring-[#FFB546] w-full disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-br from-[#FFF0C1] from-[4.98%] to-[#FFB546] to-[95.02%] rounded-[62px] px-4 py-3 font-inter font-medium text-[clamp(12px,2vw,14px)] uppercase text-black hover:shadow-lg transition-all duration-300 h-[52px] w-full whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing...' : 'Stay Informed'}
            </button>
            {/* Status Message */}
            {submitStatus.type && (
              <p className={`text-center text-sm font-inter ${
                submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {submitStatus.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BenefitsNewsletter;

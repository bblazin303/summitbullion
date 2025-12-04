"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

// Import newsletter image
import NewsletterImage from '/public/images/newsletter-image.png';

const Newsletter: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
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
          utm_campaign: 'marketplace_newsletter',
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
      // Set initial state
      gsap.set(newsletterRef.current, {
        opacity: 0,
        y: 50
      });

      // Create intersection observer for scroll-triggered animation
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Animate newsletter section
              gsap.to(newsletterRef.current, {
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

  return (
    <div ref={sectionRef} className="bg-[#fcf8f1] relative w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px]">
      {/* Newsletter Section */}
      <div ref={newsletterRef} style={{ opacity: 0, transform: 'translateY(50px)' }} className="bg-black rounded-[24px] sm:rounded-[36px] max-w-7xl mx-auto overflow-hidden relative">
        {/* Newsletter Image - Desktop Only (1100px+) */}
        <div className="hidden xl:block absolute left-0 top-0 bottom-0 w-[255px]">
          <div className="relative w-full h-full">
            <Image
              src={NewsletterImage}
              alt="Newsletter"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative flex flex-col md:flex-row items-stretch md:items-center gap-6 md:gap-8 py-8 sm:py-10 md:py-12 px-6 sm:px-8 xl:pl-[287px] xl:pr-[67px]">
          {/* Text Content */}
          <div className="flex flex-col gap-3 text-center md:text-left flex-1 min-w-0">
            <h2 className="font-inter font-semibold text-[clamp(24px,5vw,40px)] leading-[1.2] text-white tracking-[-1.2px]">
              Gain Financial Freedom
            </h2>
            <p className="font-inter font-normal text-[clamp(14px,3vw,20px)] text-[#b7b7b7] tracking-[-0.6px]">
              Stay up to date with the latest at Newsletter
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3 w-full md:w-auto md:min-w-[300px] md:max-w-[374px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={isSubmitting}
              className="bg-white rounded-[62px] px-6 py-4 font-inter font-normal text-[clamp(14px,2vw,16px)] text-black placeholder:text-[#7c7c7c] h-[52px] text-center md:text-left focus:outline-none focus:ring-2 focus:ring-[#FFB546] w-full disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-br from-[#FFF0C1] from-[4.98%] to-[#FFB546] to-[95.02%] rounded-[62px] px-4 py-3 font-inter font-medium text-[clamp(12px,2vw,14px)] uppercase text-black hover:shadow-lg transition-all duration-300 h-[52px] w-full whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
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

export default Newsletter;


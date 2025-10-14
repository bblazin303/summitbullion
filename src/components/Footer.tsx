import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-black lg:bg-[#fcf8f1] overflow-hidden min-h-[850px] lg:min-h-[611px]">
      {/* Background Image - Desktop */}
      <div className="hidden lg:block absolute inset-0 w-full h-full">
        <Image
          src="/images/footer-bg.png"
          alt=""
          fill
          className="object-cover object-top"
          priority={false}
        />
      </div>
      
      {/* Background Image - Mobile */}
      <div className="block lg:hidden absolute top-0 left-0 w-full h-[320px]">
        <Image
          src="/images/footer-bg-mobile.png"
          alt=""
          fill
          className="object-cover object-center"
          priority={false}
        />
      </div>

      {/* Footer Content */}
      <div className="relative w-full">
        {/* Mobile Layout - Matches Figma exactly */}
        <div className="lg:hidden px-[30px] pt-[160px] pb-[40px]">
          {/* Logo, Description, Social Icons - Top Section */}
          <div className="flex flex-col gap-[31px] mb-[41px]">
            {/* Logo and Description */}
            <div className="flex flex-col gap-[16px] max-w-[333px]">
              <div className="w-[330px] h-auto">
                <Image
                  src="/images/icons/summit-white.svg"
                  alt="Summit Bullion"
                  width={330}
                  height={29}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-[#b7b7b7] text-[12.295px] leading-[18.677px] font-normal">
                Your trusted source for precious metals in the digital age.
              </p>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex gap-[16.19px]">
              <Link 
                href="#" 
                className="border border-white/20 rounded-full p-2 w-[42px] h-[42px] flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                aria-label="X (Twitter)"
              >
                <Image src="/images/icons/x.svg" alt="" width={17} height={17} />
              </Link>
              <Link 
                href="#" 
                className="border border-white/20 rounded-full p-2 w-[42px] h-[42px] flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                aria-label="Telegram"
              >
                <Image src="/images/icons/tg.svg" alt="" width={17} height={17} />
              </Link>
              <Link 
                href="#" 
                className="border border-white/20 rounded-full p-2 w-[42px] h-[42px] flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                aria-label="Instagram"
              >
                <Image src="/images/icons/ig.svg" alt="" width={17} height={17} />
              </Link>
              <Link 
                href="#" 
                className="border border-white/20 rounded-full p-2 w-[42px] h-[42px] flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                aria-label="DexScreener"
              >
                <Image src="/images/icons/DexScreener.svg" alt="" width={19} height={19} />
              </Link>
              <Link 
                href="#" 
                className="border border-white/20 rounded-full p-2 w-[42px] h-[42px] flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                aria-label="DexTools"
              >
                <Image src="/images/icons/DexTools.svg" alt="" width={16} height={16} />
              </Link>
              <Link 
                href="#" 
                className="border border-white/20 rounded-full p-2 w-[42px] h-[42px] flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                aria-label="BirdEye"
              >
                <Image src="/images/icons/BirdEye.svg" alt="" width={19} height={19} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-[16px] mb-[32px]">
            <h3 className="text-white text-[16.645px] font-medium leading-[24.968px]">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-[16px]">
              <li>
                <Link href="/docs#privacy" className="text-[#b7b7b7] text-[16px] font-light leading-[20.806px] hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/docs#terms" className="text-[#b7b7b7] text-[16px] font-light leading-[20.806px] hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/docs#payment-info" className="text-[#b7b7b7] text-[16px] font-light leading-[20.806px] hover:text-white transition-colors">
                  Payment Information
                </Link>
              </li>
              <li>
                <Link href="/docs#shipping-info" className="text-[#b7b7b7] text-[16px] font-light leading-[20.806px] hover:text-white transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-[#b7b7b7] text-[16px] font-light leading-[20.806px] hover:text-white transition-colors">
                  Shop Inventory
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop Today */}
          <div className="flex flex-col gap-[16px] mb-[32px]">
            <h3 className="text-white text-[16.645px] font-medium leading-[24.968px]">
              Shop Today
            </h3>
            <ul className="flex flex-col gap-[16px]">
              <li>
                <Link href="#" className="text-[#b7b7b7] text-[16px] font-light leading-[20.806px] hover:text-white transition-colors">
                  Shop Gold
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#b7b7b7] text-[16px] font-light leading-[20.806px] hover:text-white transition-colors">
                  Shop Silver
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#b7b7b7] text-[16px] font-light leading-[20.806px] hover:text-white transition-colors">
                  Shop Palladium
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#b7b7b7] text-[16px] font-light leading-[20.806px] hover:text-white transition-colors">
                  Shop Platinum
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col gap-[15px] mb-[32px]">
            <h3 className="text-white text-[17.205px] font-medium leading-[25.808px]">
              Contact us
            </h3>
            <div className="flex flex-col gap-[16px] text-[#b7b7b7] text-[16px] font-light leading-[21.506px]">
              <p>1200 Riverplace Blvd</p>
              <p>Suite 105 1308</p>
              <p>1-904-305-7903</p>
              <p>Contact@SummitBullion.Io</p>
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-white/10 mb-[22px] max-w-[333px]" />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-[#b7b7b7] text-[10px] font-light leading-normal">
              ALL RIGHTS RESERVED © 2025 Summit Bullion Precious Metals
            </p>
          </div>
        </div>

        {/* Desktop Layout - Original */}
        <div className="hidden lg:block px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px] pt-12 sm:pt-16 lg:pt-24 xl:pt-32 2xl:pt-[201px] pb-8 sm:pb-12">
          {/* Main Footer Content */}
          <div className="flex flex-col lg:flex-row lg:flex-wrap xl:flex-nowrap justify-between gap-8 sm:gap-10 lg:gap-8 xl:gap-12 2xl:gap-16 mb-12 sm:mb-16 lg:mb-20 xl:mb-24 2xl:mb-[160px] max-w-full">
            {/* Left Side - Logo, Description, and Social Icons */}
            <div className="flex flex-col gap-6 sm:gap-8 lg:max-w-[400px] xl:max-w-[466px] shrink-0 flex-1 lg:basis-full xl:basis-auto">
              {/* Logo and Description */}
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="w-full max-w-[280px] sm:max-w-[350px] lg:max-w-[462px]">
                  <Image
                    src="/images/icons/summit-white.svg"
                    alt="Summit Bullion"
                    width={462}
                    height={40}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-[#b7b7b7] text-[14px] sm:text-[15px] lg:text-[17px] leading-[22px] sm:leading-[24px] lg:leading-[26px] font-normal max-w-[400px]">
                  Your trusted source for precious metals in the digital age.
                </p>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex gap-3 sm:gap-4 flex-wrap">
                <Link 
                  href="#" 
                  className="border border-white/20 rounded-full p-2 sm:p-2.5 w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                  aria-label="X (Twitter)"
                >
                  <Image src="/images/icons/x.svg" alt="" width={17} height={17} className="w-[14px] sm:w-[17px] h-auto" />
                </Link>
                <Link 
                  href="#" 
                  className="border border-white/20 rounded-full p-2 sm:p-2.5 w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                  aria-label="Telegram"
                >
                  <Image src="/images/icons/tg.svg" alt="" width={17} height={17} className="w-[14px] sm:w-[17px] h-auto" />
                </Link>
                <Link 
                  href="#" 
                  className="border border-white/20 rounded-full p-2 sm:p-2.5 w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                  aria-label="Instagram"
                >
                  <Image src="/images/icons/ig.svg" alt="" width={17} height={17} className="w-[14px] sm:w-[17px] h-auto" />
                </Link>
                <Link 
                  href="#" 
                  className="border border-white/20 rounded-full p-2 sm:p-2.5 w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                  aria-label="DexScreener"
                >
                  <Image src="/images/icons/DexScreener.svg" alt="" width={19} height={19} className="w-[15px] sm:w-[19px] h-auto" />
                </Link>
                <Link 
                  href="#" 
                  className="border border-white/20 rounded-full p-2 sm:p-2.5 w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                  aria-label="DexTools"
                >
                  <Image src="/images/icons/DexTools.svg" alt="" width={16} height={16} className="w-[13px] sm:w-[16px] h-auto" />
                </Link>
                <Link 
                  href="#" 
                  className="border border-white/20 rounded-full p-2 sm:p-2.5 w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                  aria-label="BirdEye"
                >
                  <Image src="/images/icons/BirdEye.svg" alt="" width={19} height={19} className="w-[15px] sm:w-[19px] h-auto" />
                </Link>
              </div>
            </div>

            {/* Right Side - Quick Links, Shop Today, and Contact Us */}
            <div className="flex flex-row flex-wrap xl:flex-nowrap gap-6 sm:gap-8 lg:gap-6 xl:gap-10 2xl:gap-12 lg:basis-full xl:basis-auto">
              {/* Quick Links */}
              <div className="flex flex-col gap-3 sm:gap-4 lg:min-w-[140px] xl:w-[156px] shrink-0">
                <h3 className="text-white text-[14px] sm:text-[15px] lg:text-[17px] font-medium leading-[20px] sm:leading-[22px] lg:leading-[25px]">
                  Quick Links
                </h3>
                <ul className="flex flex-col gap-2.5 sm:gap-3 lg:gap-4">
                  <li>
                    <Link href="/docs#privacy" className="text-[#b7b7b7] text-[12px] sm:text-[13px] lg:text-[16px] font-light leading-[18px] sm:leading-[19px] lg:leading-[21px] hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs#terms" className="text-[#b7b7b7] text-[12px] sm:text-[13px] lg:text-[16px] font-light leading-[18px] sm:leading-[19px] lg:leading-[21px] hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs#payment-info" className="text-[#b7b7b7] text-[12px] sm:text-[13px] lg:text-[16px] font-light leading-[18px] sm:leading-[19px] lg:leading-[21px] hover:text-white transition-colors">
                      Payment Information
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs#shipping-info" className="text-[#b7b7b7] text-[12px] sm:text-[13px] lg:text-[16px] font-light leading-[18px] sm:leading-[19px] lg:leading-[21px] hover:text-white transition-colors">
                      Shipping Information
                    </Link>
                  </li>
                  
                </ul>
              </div>

              {/* Shop Today */}
              <div className="flex flex-col gap-3 sm:gap-4 lg:min-w-[140px] xl:w-[156px] shrink-0">
                <h3 className="text-white text-[14px] sm:text-[15px] lg:text-[17px] font-medium leading-[20px] sm:leading-[22px] lg:leading-[25px]">
                  Shop Today
                </h3>
                <ul className="flex flex-col gap-2.5 sm:gap-3 lg:gap-4">
                  <li>
                    <Link href="#" className="text-[#b7b7b7] text-[12px] sm:text-[13px] lg:text-[16px] font-light leading-[18px] sm:leading-[19px] lg:leading-[21px] hover:text-white transition-colors">
                      Shop Gold
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-[#b7b7b7] text-[12px] sm:text-[13px] lg:text-[16px] font-light leading-[18px] sm:leading-[19px] lg:leading-[21px] hover:text-white transition-colors">
                      Shop Silver
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-[#b7b7b7] text-[12px] sm:text-[13px] lg:text-[16px] font-light leading-[18px] sm:leading-[19px] lg:leading-[21px] hover:text-white transition-colors">
                      Shop Palladium
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-[#b7b7b7] text-[12px] sm:text-[13px] lg:text-[16px] font-light leading-[18px] sm:leading-[19px] lg:leading-[21px] hover:text-white transition-colors">
                      Shop Platinum
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Us */}
              <div className="flex flex-col gap-3 sm:gap-4 lg:min-w-[200px] xl:w-[277px] shrink-0">
                <h3 className="text-white text-[14px] sm:text-[15px] lg:text-[17px] font-medium leading-[20px] sm:leading-[22px] lg:leading-[25px]">
                  Contact us
                </h3>
                <ul className="flex flex-col gap-2.5 sm:gap-3 lg:gap-4">
                  <li>
                    <span className="text-[#b7b7b7] text-[12px] sm:text-[13px] lg:text-[16px] font-light leading-[18px] sm:leading-[19px] lg:leading-[21px]">1200 Riverplace Blvd</span>
                  </li>
                  <li>
                    <span className="text-[#b7b7b7] text-[12px] sm:text-[13px] lg:text-[16px] font-light leading-[18px] sm:leading-[19px] lg:leading-[21px]">Suite 105 1308</span>
                  </li>
                  <li>
                    <span className="text-[#b7b7b7] text-[12px] sm:text-[13px] lg:text-[16px] font-light leading-[18px] sm:leading-[19px] lg:leading-[21px]">1-904-305-7903</span>
                  </li>
                  <li>
                    <span className="text-[#b7b7b7] text-[12px] sm:text-[13px] lg:text-[16px] font-light leading-[18px] sm:leading-[19px] lg:leading-[21px]">Contact@SummitBullion.Io</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-white/10 mb-4 sm:mb-6" />

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-[#b7b7b7] text-[9px] sm:text-[10px] font-light">
            <p className="text-center sm:text-left">
              ALL RIGHTS RESERVED © 2025 Summit Bullion Inc
            </p>
            <p className="text-center sm:text-right">
              2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

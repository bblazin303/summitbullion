'use client';

import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useCallback } from 'react';

// Add this type definition at the top
type SearchResult = {
  section: string;
  title: string;
  content: string;
  href: string;
};

export default function DocsPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Search through documentation content
    const results: SearchResult[] = [];
    const searchTerms = query.toLowerCase().split(' ');

    // Define searchable content
    const sections = [
      {
        section: 'Introduction',
        title: 'About Summit Bullion',
        content: 'Learn about Summit Bullion and how we bridge the gap between traditional finance and decentralized finance through tokenized precious metals.',
        href: '#introduction'
      },
      {
        section: 'Introduction',
        title: 'Our Mission',
        content: 'Bringing both TradFi and DeFi together with physical precious metals, tokenization, and yield opportunities.',
        href: '#introduction'
      },
      {
        section: 'Getting Started',
        title: 'How to Buy Physical Metals',
        content: 'Purchase physical gold and silver with crypto or fiat payments, shipped directly to your door.',
        href: '#getting-started'
      },
      {
        section: 'Getting Started',
        title: 'KYC Verification',
        content: 'Complete KYC verification to access minting, redemption, and liquidity provision features.',
        href: '#getting-started'
      },
      {
        section: 'SB-GOLD Token',
        title: 'What is SB-GOLD',
        content: 'SB-GOLD is a tokenized gold asset backed 1:1 by allocated physical gold in secure vaults.',
        href: '#sbgold-token'
      },
      {
        section: 'SB-GOLD Token',
        title: 'Minting SB-GOLD',
        content: 'Mint SB-GOLD tokens with USDC at spot price plus 1%. Gold is purchased and allocated to SPV vault.',
        href: '#sbgold-token'
      },
      {
        section: 'SB-GOLD Token',
        title: 'Redeeming SB-GOLD',
        content: 'Redeem SB-GOLD for physical gold delivery or instant USDC payout.',
        href: '#sbgold-token'
      },
      {
        section: 'Whitepaper',
        title: 'Company History',
        content: 'Learn about Advanced Financial Technologies LLC founding in 2023 and our journey to Summit Bullion.',
        href: '#whitepaper'
      },
      {
        section: 'Whitepaper',
        title: 'Tokenomics',
        content: 'Understanding fee structures, allocation mechanisms, and protocol economics.',
        href: '#whitepaper'
      },
      {
        section: 'Whitepaper',
        title: 'Legal Structure',
        content: 'SPV Trust formation, compliance guardrails, and bankruptcy-remote structure.',
        href: '#whitepaper'
      },
      {
        section: 'Roadmap',
        title: 'Current Progress',
        content: 'Rebrand completion, physical catalog expansion, and KYC onboarding pipeline.',
        href: '#roadmap'
      },
      {
        section: 'Roadmap',
        title: 'Future Development',
        content: 'Mobile app, secondary dealer intake with AI recognition, debit cards, and institutional access.',
        href: '#roadmap'
      },
      {
        section: 'Features',
        title: 'Liquidity Provision',
        content: 'Provide liquidity to SB-GOLD pools and earn yield while maintaining gold exposure.',
        href: '#features'
      },
      {
        section: 'Security',
        title: 'Vault Security',
        content: 'Allocated bar lists, serial number tracking, dual-control procedures, and independent attestations.',
        href: '#security'
      },
      {
        section: 'Payment Information',
        title: 'Payment Methods',
        content: 'Credit cards, debit cards, bank transfers, ACH, wire transfers, and cryptocurrency payments via Alchemy Pay.',
        href: '#payment-info'
      },
      {
        section: 'Shipping Information',
        title: 'Delivery & Shipping',
        content: 'U.S. domestic shipping, insured delivery, tracking information, and estimated delivery times.',
        href: '#shipping-info'
      },
      {
        section: 'Terms of Service',
        title: 'Legal Terms',
        content: 'User agreements, acceptable use policy, disclaimer of warranties, and limitation of liability.',
        href: '#terms'
      },
      {
        section: 'Privacy Policy',
        title: 'Data Privacy',
        content: 'How we collect, use, store, and protect your personal information and data.',
        href: '#privacy'
      }
    ];

    sections.forEach(section => {
      const matchesAllTerms = searchTerms.every(term => 
        section.section.toLowerCase().includes(term) ||
        section.title.toLowerCase().includes(term) ||
        section.content.toLowerCase().includes(term)
      );

      if (matchesAllTerms) {
        results.push(section);
      }
    });

    setSearchResults(results);
  }, []);

  // Function to highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <span key={i} className="bg-[#ffb546]/30 text-[#141722]">{part}</span> : 
        part
    );
  };

  return (
    <div className="min-h-screen bg-[#fcf8f1]">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-[250px] h-full bg-[#141722] border-r border-[#2a2a2a] hidden min-[900px]:block z-40">
        <div className="p-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/wordmark-logo.svg"
              alt="Summit Bullion"
              width={180}
              height={24}
              style={{ width: 'auto', height: '24px' }}
              className="brightness-0 invert"
            />
          </button>
          
          <nav className="mt-8">
            <h3 className="text-[#7c7c7c] text-sm font-inter font-medium mb-4 uppercase tracking-wide">Documentation</h3>
            <div className="flex flex-col gap-2">
              <a href="#introduction" className="text-[#efe9e0] hover:text-[#ffb546] text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-inter">
                Introduction
              </a>
              <a href="#getting-started" className="text-[#efe9e0] hover:text-[#ffb546] text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-inter">
                Getting Started
              </a>
              <a href="#sbgold-token" className="text-[#efe9e0] hover:text-[#ffb546] text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-inter">
                SB-GOLD Token
              </a>
              <a href="#features" className="text-[#efe9e0] hover:text-[#ffb546] text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-inter">
                Features
              </a>
              <a href="#whitepaper" className="text-[#efe9e0] hover:text-[#ffb546] text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-inter">
                Whitepaper
              </a>
              <a href="#roadmap" className="text-[#efe9e0] hover:text-[#ffb546] text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-inter">
                Roadmap
              </a>
              <a href="#security" className="text-[#efe9e0] hover:text-[#ffb546] text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-inter">
                Security & Custody
              </a>
              <a href="#support" className="text-[#efe9e0] hover:text-[#ffb546] text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-inter">
                Support
              </a>
              <a href="#payment-info" className="text-[#efe9e0] hover:text-[#ffb546] text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-inter">
                Payment Information
              </a>
              <a href="#shipping-info" className="text-[#efe9e0] hover:text-[#ffb546] text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-inter">
                Shipping Information
              </a>
              <a href="#terms" className="text-[#efe9e0] hover:text-[#ffb546] text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-inter">
                Terms of Service
              </a>
              <a href="#privacy" className="text-[#efe9e0] hover:text-[#ffb546] text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-inter">
                Privacy Policy
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-[900px]:ml-[250px]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#fcf8f1] border-b border-[#dfdfdf]">
          <div className="flex items-center justify-between h-[65px] px-[18px] min-[900px]:px-8 max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4 w-full">
              <button
                onClick={() => router.push('/')}
                className="min-[900px]:hidden"
              >
                <Image
                  src="/images/mobile-hero-logo.svg"
                  alt="Summit Bullion"
                  width={40}
                  height={40}
                  style={{ width: 'auto', height: '32px' }}
                />
              </button>
              
              <div className="hidden min-[900px]:block w-[400px] relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7c7c7c]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search documentation..."
                    className="w-full h-[38px] pl-10 pr-4 rounded-full bg-white border border-[#dfdfdf] text-[#141722] placeholder:text-[#7c7c7c] text-sm focus:outline-none focus:border-[#ffb546] font-inter"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7c7c7c] hover:text-[#141722] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && searchQuery && (
                  <div className="absolute mt-2 w-[400px] bg-white border border-[#dfdfdf] rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="max-h-[400px] overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <a
                          key={index}
                          href={result.href}
                          onClick={() => {
                            setSearchQuery('');
                            setSearchResults([]);
                          }}
                          className="block p-4 hover:bg-[#fcf8f1] border-b border-[#dfdfdf] last:border-0"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-[#141722] font-inter">
                              {highlightText(result.title, searchQuery)}
                            </span>
                            <span className="text-xs text-[#7c7c7c] font-inter">
                              {result.section}
                            </span>
                          </div>
                          <p className="text-sm text-[#7c7c7c] font-inter">
                            {highlightText(result.content, searchQuery)}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-[18px] min-[900px]:p-8 max-w-[1200px] mx-auto">
          {/* Mobile Search Bar */}
          <div className="mb-6 min-[900px]:hidden relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7c7c7c]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search documentation..."
                className="w-full h-[38px] pl-10 pr-4 rounded-full bg-white border border-[#dfdfdf] text-[#141722] placeholder:text-[#7c7c7c] text-sm focus:outline-none focus:border-[#ffb546] font-inter"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7c7c7c] hover:text-[#141722] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            
            {/* Mobile Search Results Dropdown */}
            {searchResults.length > 0 && searchQuery && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-[#dfdfdf] rounded-xl shadow-xl overflow-hidden z-50 max-w-full">
                <div className="max-h-[400px] overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <a
                      key={index}
                      href={result.href}
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="block p-4 hover:bg-[#fcf8f1] border-b border-[#dfdfdf] last:border-0"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[#141722] font-inter">
                          {highlightText(result.title, searchQuery)}
                        </span>
                        <span className="text-xs text-[#7c7c7c] font-inter">
                          {result.section}
                        </span>
                      </div>
                      <p className="text-sm text-[#7c7c7c] font-inter">
                        {highlightText(result.content, searchQuery)}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div>

          <div className="mb-12">
            <h1 className="text-3xl min-[900px]:text-4xl font-inter font-semibold text-[#141722] mb-4">
              Documentation
            </h1>
            <p className="text-[#7c7c7c] text-lg font-inter">
              Everything you need to know about Summit Bullion - bridging traditional precious metals with Web3 innovation.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 gap-4">
            <a href="#introduction" className="group p-6 bg-white rounded-xl border border-[#dfdfdf] hover:border-[#ffb546] hover:shadow-lg transition-all">
              <h3 className="text-[#141722] text-xl font-semibold mb-2 font-inter">Introduction</h3>
              <p className="text-[#7c7c7c] text-sm font-inter">Learn about Summit Bullion and our mission to revolutionize precious metals investing.</p>
            </a>
            
            <a href="#getting-started" className="group p-6 bg-white rounded-xl border border-[#dfdfdf] hover:border-[#ffb546] hover:shadow-lg transition-all">
              <h3 className="text-[#141722] text-xl font-semibold mb-2 font-inter">Getting Started</h3>
              <p className="text-[#7c7c7c] text-sm font-inter">Start buying physical metals or minting tokenized gold in minutes.</p>
            </a>
            
            <a href="#sbgold-token" className="group p-6 bg-white rounded-xl border border-[#dfdfdf] hover:border-[#ffb546] hover:shadow-lg transition-all">
              <h3 className="text-[#141722] text-xl font-semibold mb-2 font-inter">SB-GOLD Token</h3>
              <p className="text-[#7c7c7c] text-sm font-inter">Discover our 1:1 gold-backed digital asset with instant liquidity.</p>
            </a>
            
            <a href="#features" className="group p-6 bg-white rounded-xl border border-[#dfdfdf] hover:border-[#ffb546] hover:shadow-lg transition-all">
              <h3 className="text-[#141722] text-xl font-semibold mb-2 font-inter">Features</h3>
              <p className="text-[#7c7c7c] text-sm font-inter">Explore liquidity provision, yield opportunities, and more.</p>
            </a>
            
            <a href="#whitepaper" className="group p-6 bg-white rounded-xl border border-[#dfdfdf] hover:border-[#ffb546] hover:shadow-lg transition-all">
              <h3 className="text-[#141722] text-xl font-semibold mb-2 font-inter">Whitepaper</h3>
              <p className="text-[#7c7c7c] text-sm font-inter">Deep dive into tokenomics, legal structure, and financial models.</p>
            </a>
            
            <a href="#roadmap" className="group p-6 bg-white rounded-xl border border-[#dfdfdf] hover:border-[#ffb546] hover:shadow-lg transition-all">
              <h3 className="text-[#141722] text-xl font-semibold mb-2 font-inter">Roadmap</h3>
              <p className="text-[#7c7c7c] text-sm font-inter">See what we&apos;re building and where we&apos;re headed.</p>
            </a>
          </div>

          {/* Documentation Sections */}
          <div className="mt-16 space-y-16">
            {/* Introduction Section */}
            <section id="introduction" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-semibold text-[#141722] mb-6 font-inter">Introduction</h2>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Welcome to Summit Bullion, where traditional precious metals investing meets the innovation of Web3. 
                    We&apos;re bridging the gap between TradFi and DeFi by offering physical precious metals alongside 
                    tokenized gold assets with yield opportunities.
                  </p>
                  <p className="text-[#7c7c7c] leading-relaxed mt-4 font-inter">
                    Built by Advanced Financial Technologies LLC, Summit Bullion provides a seamless experience for both 
                    crypto-native users and traditional investors looking to explore the future of asset ownership.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">What Makes Summit Bullion Different</h3>
                  <ul className="mt-3 space-y-2 text-[#7c7c7c] font-inter">
                    <li className="flex items-start">
                      <span className="text-[#ffb546] mr-2">•</span>
                      <div>
                        <span className="font-medium text-[#141722]">Physical + Digital</span> - Buy physical metals or mint tokenized gold backed 1:1 by allocated reserves.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#ffb546] mr-2">•</span>
                      <div>
                        <span className="font-medium text-[#141722]">Flexible Payments</span> - Accept both fiat and cryptocurrency for maximum accessibility.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#ffb546] mr-2">•</span>
                      <div>
                        <span className="font-medium text-[#141722]">Yield Opportunities</span> - Earn returns through liquidity provision while maintaining gold exposure.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#ffb546] mr-2">•</span>
                      <div>
                        <span className="font-medium text-[#141722]">Transparent & Secure</span> - Allocated gold with independent attestations and on-chain proof of reserves.
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Platform Overview</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Summit Bullion offers multiple ways to invest in precious metals:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">1,400+ Product SKUs</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">Extensive catalog of gold and silver bars, coins, and collectibles.</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">SB-GOLD Token</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">Tokenized gold with instant liquidity and redemption options.</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Crypto & Fiat Payments</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">Pay with cards, bank transfers, or cryptocurrency via Alchemy Pay.</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">U.S. Shipping</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">Fast, insured delivery of physical metals to your door.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Getting Started Section */}
            <section id="getting-started" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-semibold text-[#141722] mb-6 font-inter">Getting Started</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Buying Physical Metals</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Start investing in physical gold and silver with just a few clicks.
                  </p>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#ffb546] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                      <div>
                        <h4 className="text-[#141722] font-semibold font-inter">Browse Our Catalog</h4>
                        <p className="text-[#7c7c7c] text-sm mt-1 font-inter">Explore over 1,400 SKUs of gold and silver products from trusted dealers.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#ffb546] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                      <div>
                        <h4 className="text-[#141722] font-semibold font-inter">Add to Cart</h4>
                        <p className="text-[#7c7c7c] text-sm mt-1 font-inter">Select your products and proceed to checkout.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#ffb546] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                      <div>
                        <h4 className="text-[#141722] font-semibold font-inter">Choose Payment Method</h4>
                        <p className="text-[#7c7c7c] text-sm mt-1 font-inter">Pay with credit card, bank transfer, or cryptocurrency via Alchemy Pay.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#ffb546] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                      <div>
                        <h4 className="text-[#141722] font-semibold font-inter">Receive Your Order</h4>
                        <p className="text-[#7c7c7c] text-sm mt-1 font-inter">Your metals will be shipped securely to your U.S. address with full insurance.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">KYC Verification</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Complete KYC verification to unlock advanced features like minting SB-GOLD tokens and providing liquidity.
                  </p>
                  
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <h4 className="text-[#141722] font-semibold mb-3 font-inter">KYC Benefits</h4>
                    <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">✓</span>
                        <span>Mint SB-GOLD tokens backed by physical gold</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">✓</span>
                        <span>Redeem tokens for physical gold delivery</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">✓</span>
                        <span>Provide liquidity and earn yield</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">✓</span>
                        <span>Access institutional features</span>
                      </li>
                    </ul>
                    <p className="text-[#7c7c7c] text-sm mt-3 font-inter">
                      <strong className="text-[#141722]">One-time fee:</strong> $25 per wallet
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SB-GOLD Token Section */}
            <section id="sbgold-token" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-semibold text-[#141722] mb-6 font-inter">SB-GOLD Token</h2>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    SB-GOLD is a tokenized gold asset backed 1:1 by allocated physical gold stored in secure vaults. 
                    Each token represents ownership of actual gold bars with serial number tracking and independent attestations.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">How to Mint SB-GOLD</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Minting converts your USDC into tokenized gold backed by physical reserves.
                  </p>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#ffb546] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                      <div>
                        <h4 className="text-[#141722] font-semibold font-inter">Complete KYC</h4>
                        <p className="text-[#7c7c7c] text-sm mt-1 font-inter">Verify your identity to access minting functionality.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#ffb546] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                      <div>
                        <h4 className="text-[#141722] font-semibold font-inter">Deposit USDC</h4>
                        <p className="text-[#7c7c7c] text-sm mt-1 font-inter">Transfer USDC to the minting contract at spot price + 1% fee.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#ffb546] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                      <div>
                        <h4 className="text-[#141722] font-semibold font-inter">Gold Allocation</h4>
                        <p className="text-[#7c7c7c] text-sm mt-1 font-inter">Physical gold is purchased and allocated to the SPV vault with your serial numbers recorded.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#ffb546] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                      <div>
                        <h4 className="text-[#141722] font-semibold font-inter">Receive SB-GOLD</h4>
                        <p className="text-[#7c7c7c] text-sm mt-1 font-inter">SB-GOLD tokens are minted to your wallet, fully backed by allocated gold.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Redemption Options</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Redeem your SB-GOLD tokens for physical gold delivery or instant USDC.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Physical Gold Delivery</h4>
                      <p className="text-[#7c7c7c] text-sm mb-3 font-inter">Burn SB-GOLD tokens to receive physical gold shipped to your address.</p>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• $25 flat shipping fee</li>
                        <li>• Weekly batch processing</li>
                        <li>• Fully insured delivery</li>
                        <li>• U.S. addresses only</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">USDC Redemption</h4>
                      <p className="text-[#7c7c7c] text-sm mb-3 font-inter">Burn SB-GOLD tokens for instant USDC payout at current spot price.</p>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• Instant processing</li>
                        <li>• No shipping fees</li>
                        <li>• Current spot price</li>
                        <li>• Available 24/7</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Trading on DEX</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Trade SB-GOLD on decentralized exchanges with a 1% token tax that supports the ecosystem.
                  </p>
                  
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <h4 className="text-[#141722] font-semibold mb-3 font-inter">Token Tax Allocation</h4>
                    <div className="space-y-2 text-sm font-inter">
                      <div className="flex justify-between">
                        <span className="text-[#7c7c7c]">Protocol Treasury (peg defense & growth)</span>
                        <span className="text-[#141722] font-semibold">35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7c7c7c]">SB-GOLD LP Rewards</span>
                        <span className="text-[#141722] font-semibold">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7c7c7c]">Team & Operations</span>
                        <span className="text-[#141722] font-semibold">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7c7c7c]">Zzzz Buyback + Burn (legacy token)</span>
                        <span className="text-[#141722] font-semibold">10%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7c7c7c]">SBX Buyback + Burn (future rewards token)</span>
                        <span className="text-[#141722] font-semibold">10%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7c7c7c]">Risk/Emergency Fund</span>
                        <span className="text-[#141722] font-semibold">5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-semibold text-[#141722] mb-6 font-inter">Features</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Liquidity Provision</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Provide liquidity to SB-GOLD pools and earn yield while maintaining exposure to gold price movements.
                  </p>
                  
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <h4 className="text-[#141722] font-semibold mb-3 font-inter">LP Requirements & Benefits</h4>
                    <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">KYC Required:</strong> Only verified wallets can provide liquidity</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Fresh Mint Policy:</strong> Pair freshly minted SB-GOLD with USDC</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Earn Fees:</strong> Receive 25% of token tax revenue distributed to LPs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Maintain Exposure:</strong> Keep underlying gold exposure while earning yield</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Payment Processing</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Flexible payment options powered by Alchemy Pay for seamless transactions.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Credit/Debit Cards</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">Major cards accepted with 1% processing fee</p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Bank Transfers</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">ACH and wire transfers for larger purchases</p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Cryptocurrency</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">Pay with Bitcoin, Ethereum, Solana, and more</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Zzzz Legacy Token</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Our original token continues as a &quot;founder&quot; or &quot;legacy&quot; coin with a new tokenomics model.
                  </p>
                  
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <h4 className="text-[#141722] font-semibold mb-3 font-inter">Zzzz Buyback Strategy</h4>
                    <p className="text-[#7c7c7c] text-sm mb-3 font-inter">
                      10% of protocol profits go to Zzzz buyback and burn, creating deflationary pressure and value for legacy holders.
                    </p>
                    <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                      <li>• Company owns ~60% of token supply</li>
                      <li>• Continuous buyback from protocol revenue</li>
                      <li>• Automatic burn mechanism</li>
                      <li>• Community rewards for loyalty</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Whitepaper Section */}
            <section id="whitepaper" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-semibold text-[#141722] mb-6 font-inter">Whitepaper</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Company History</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Advanced Financial Technologies LLC was founded in 2023 as a parent company for innovative financial products. 
                    Our journey from Forex trading bots to Web3 precious metals has been one of continuous evolution and learning.
                  </p>
                  
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">2023: Foundation</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Started with MT4 algo trading bots for Forex market. Transitioned focus to Web3 after seeing growing interest in Telegram trading bots.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">May 2024: Zzzz Token Launch</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Launched our SPL token &quot;Zzzz&quot; on Solana with presale managed by smart contract. Added liquidity to Raydium and burned LP tokens.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Pivot to Precious Metals</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Shifted focus from trading bots to onboarding the precious metals industry into Web3. Secured partnerships with Elemetal Refinery and Upstate Gold and Coin.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">2024-2025: Rebrand to Summit Bullion</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Partnered with DreamFlow Labs for complete rebrand. Attended Art Basel Miami, MtnDAO Salt Lake, and built strategic partnerships. Focus on tokenization and RWA markets.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Legal Structure & Fundraising</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Summit Bullion uses a bankruptcy-remote structure to protect user assets and enable institutional adoption.
                  </p>
                  
                  <div className="mt-4 p-6 bg-white rounded-lg border border-[#dfdfdf]">
                    <h4 className="text-[#141722] font-semibold mb-4 font-inter">Company Structure</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Summit Bullion, Inc. (Delaware C-Corp)</h5>
                        <p className="text-[#7c7c7c] text-sm font-inter">
                          Parent company where equity investors buy shares. Owns both the Trust/SPV and the operating LLC. 
                          Profit sharing from physical sales benefits investors.
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Advanced Financial Technologies, LLC (Florida) - &quot;OpCo&quot;</h5>
                        <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                          <li>• Runs physical metals storefront (supplier API, checkout, fulfillment)</li>
                          <li>• Revenue from product spread and shipping/storage add-ons</li>
                          <li>• Owns IP/software (KYC portal, mint/redeem code, dashboard)</li>
                          <li>• Licenses technology to SPV and acts as manager</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">SB-GOLD SPV / Trust (Bankruptcy-Remote)</h5>
                        <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                          <li>• Holds allocated/vaulted gold backing SB-GOLD tokens</li>
                          <li>• Issues and redeems SB-GOLD 1:1 via KYC-gated mint/redeem</li>
                          <li>• Regular attestations and on-chain transparency</li>
                          <li>• Operated/managed under contract by AFT LLC</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-[#fcf8f1] rounded-lg">
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        <strong className="text-[#141722]">Fundraising Goal:</strong> $500K equity sale of Delaware C-Corp to complete SPV/Trust formation, 
                        obtain necessary licensing (MTL), conduct security audits, and scale operations.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Token Mechanisms & Flow</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Understanding how SB-GOLD tokens work within the ecosystem.
                  </p>
                  
                  <div className="mt-4 space-y-3">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">1. Buy Physical (Site)</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Card/crypto via Alchemy Pay → ship to customer (U.S. only)
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">2. Mint Digital (SB-GOLD)</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        KYC badge + USDC → SB-GOLD at spot+1%; gold purchased/allocated to SPV vault
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">3. Trade SB-GOLD on DEX</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        1% token tax; peg-balancer arbitrages around NAV
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">4. Redeem for Physical Gold</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Burn SB-GOLD → $25 shipping, weekly batch delivery
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">5. Redeem for USDC</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Burn SB-GOLD → instant USDC payout
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">6. Add Liquidity (KYC Required)</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Only KYC wallets; pair freshly minted SB-GOLD + USDC; earn yield while owning underlying asset
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Fees & Economics</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Transparent fee structure across physical sales and digital token operations.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-3 font-inter">Physical Sales Fees</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                        <li>• Wholesale spread (variable) + 2% company margin</li>
                        <li>• +1% processing fee (Alchemy Pay) passed to customers</li>
                        <li>• 100% profits to Advanced Financial Technologies LLC</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-3 font-inter">Digital SB-GOLD Fees</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                        <li>• Mint: +1% over wholesale quote</li>
                        <li>• Redeem: $25 flat shipping for physical delivery</li>
                        <li>• Secondary Trading: 1% token tax</li>
                        <li>• KYC NFT Badge: $25 one-time per wallet</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Financial Projections</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Revenue scenarios based on DEX volume and minting activity.
                  </p>
                  
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-3 font-inter">Scenario A — $5M Monthly DEX Volume</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm font-inter">
                        <div>
                          <p className="text-[#7c7c7c]">Token tax @1%</p>
                          <p className="text-[#141722] font-semibold">$50,000</p>
                        </div>
                        <div>
                          <p className="text-[#7c7c7c]">Mint fee @1%</p>
                          <p className="text-[#141722] font-semibold">$50,000</p>
                        </div>
                        <div>
                          <p className="text-[#7c7c7c]">KYC revenue (300 badges)</p>
                          <p className="text-[#141722] font-semibold">$7,500</p>
                        </div>
                        <div>
                          <p className="text-[#7c7c7c] font-semibold">Total Monthly Revenue</p>
                          <p className="text-[#141722] font-bold text-base">$107,500</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-3 font-inter">Scenario Mid — $15M Monthly DEX Volume</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm font-inter">
                        <div>
                          <p className="text-[#7c7c7c]">Token tax @1%</p>
                          <p className="text-[#141722] font-semibold">$150,000</p>
                        </div>
                        <div>
                          <p className="text-[#7c7c7c]">Mint fee @1%</p>
                          <p className="text-[#141722] font-semibold">$150,000</p>
                        </div>
                        <div>
                          <p className="text-[#7c7c7c]">KYC revenue (900 badges)</p>
                          <p className="text-[#141722] font-semibold">$22,500</p>
                        </div>
                        <div>
                          <p className="text-[#7c7c7c] font-semibold">Total Monthly Revenue</p>
                          <p className="text-[#141722] font-bold text-base">$322,500</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-3 font-inter">Scenario B — $30M Monthly DEX Volume</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm font-inter">
                        <div>
                          <p className="text-[#7c7c7c]">Token tax @1%</p>
                          <p className="text-[#141722] font-semibold">$300,000</p>
                        </div>
                        <div>
                          <p className="text-[#7c7c7c]">Mint fee @1%</p>
                          <p className="text-[#141722] font-semibold">$300,000</p>
                        </div>
                        <div>
                          <p className="text-[#7c7c7c]">KYC revenue (1,800 badges)</p>
                          <p className="text-[#141722] font-semibold">$45,000</p>
                        </div>
                        <div>
                          <p className="text-[#7c7c7c] font-semibold">Total Monthly Revenue</p>
                          <p className="text-[#141722] font-bold text-base">$645,000</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Compliance Guardrails</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Summit Bullion operates within strict compliance frameworks to ensure regulatory adherence.
                  </p>
                  
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">✓</span>
                        <span><strong className="text-[#141722]">KYC/AML:</strong> Required at mint/redeem with OFAC list screening and suspicious activity reporting</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">✓</span>
                        <span><strong className="text-[#141722]">LP Gatekeeping:</strong> Provenance proofs ensure only fresh-mint tokens enter liquidity pools</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">✓</span>
                        <span><strong className="text-[#141722]">U.S. Shipping Only:</strong> Physical redemptions restricted to U.S. at launch</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">✓</span>
                        <span><strong className="text-[#141722]">Basel III Posture:</strong> Assets remain allocated and unencumbered; no gold leasing</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Roadmap Section */}
            <section id="roadmap" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-semibold text-[#141722] mb-6 font-inter">Roadmap</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">What We Have</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Current operational capabilities and infrastructure already in place.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Legal Foundation</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• AFT LLC (Florida) operational</li>
                        <li>• FinCEN AML/KYC program</li>
                        <li>• OFAC screening systems</li>
                        <li>• Tax registrations complete</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Operations</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• 1,400+ SKU product catalog</li>
                        <li>• Upstate Gold partnership active</li>
                        <li>• U.S. domestic shipping</li>
                        <li>• Consumer protection policies</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Next 2 Months</h3>
                  <div className="mt-4 space-y-3">
                    <div className="p-4 bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-lg border-l-4 border-[#ffb546]">
                      <h4 className="text-[#141722] font-semibold mb-1 font-inter">Complete Rebrand</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Finalize Summit Bullion rebrand with DreamFlow Labs; launch new website
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-lg border-l-4 border-[#ffb546]">
                      <h4 className="text-[#141722] font-semibold mb-1 font-inter">Expand Physical Catalog</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Optimize checkout experience with Alchemy Pay integration
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-lg border-l-4 border-[#ffb546]">
                      <h4 className="text-[#141722] font-semibold mb-1 font-inter">KYC Pipeline</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Finalize compliance playbooks (AML/SAR/OFAC) and onboarding flow
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Next 12 Months</h3>
                  <div className="mt-4 space-y-3">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Q1-Q2 2025</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• SDK integrations (Helio, WooCommerce, Shopify)</li>
                        <li>• SPV/Trust documentation and vendor selection</li>
                        <li>• Security audits for smart contracts</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Q2-Q3 2025</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• Establish SPV/Trust with custodian agreements</li>
                        <li>• Launch SB-GOLD minting on Solana</li>
                        <li>• First DEX liquidity pool goes live</li>
                        <li>• Monthly attestation program begins</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Q4 2025</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• Deploy peg-balancer mechanism</li>
                        <li>• Scale protocol-owned liquidity</li>
                        <li>• Introduce SBX rewards token</li>
                        <li>• Launch LP incentive programs</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Next 24 Months (2026)</h3>
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Growth Milestones</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                        <li className="flex items-start">
                          <span className="text-[#ffb546] mr-2">•</span>
                          <span>$100M tokenized gold outstanding across multiple venues</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#ffb546] mr-2">•</span>
                          <span>Basel III HQLA-ready posture for institutional adoption</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#ffb546] mr-2">•</span>
                          <span>Bank pilot programs initiated</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#ffb546] mr-2">•</span>
                          <span>Cross-chain bridges (XRPL, ETH, SUI)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#ffb546] mr-2">•</span>
                          <span>Top-3 global tokenized gold platform by transparency</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Future Innovations</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Long-term vision for platform evolution and new product offerings.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Mobile App</h4>
                      <p className="text-[#7c7c7c] text-sm mb-2 font-inter">
                        iOS/Android app with wallet, LP management, lending, P2P payments, and physical sales
                      </p>
                      <p className="text-[#7c7c7c] text-xs font-inter">Timeline: MVP 6-9 months</p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Secondary Dealer Program</h4>
                      <p className="text-[#7c7c7c] text-sm mb-2 font-inter">
                        AI-powered recognition to buy bullion from users; Google Lens-style photo identification
                      </p>
                      <p className="text-[#7c7c7c] text-xs font-inter">Timeline: Pilot 3-5 months</p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Physical/Digital Debit Cards</h4>
                      <p className="text-[#7c7c7c] text-sm mb-2 font-inter">
                        Spend SB-GOLD directly with auto-sell to fiat; virtual and physical cards available
                      </p>
                      <p className="text-[#7c7c7c] text-xs font-inter">Timeline: Beta 4-6 months</p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Institutional Platform</h4>
                      <p className="text-[#7c7c7c] text-sm mb-2 font-inter">
                        Programmatic mint/redeem API, treasury management, and reporting for banks/fintechs
                      </p>
                      <p className="text-[#7c7c7c] text-xs font-inter">Timeline: Console 3-4 months</p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Global Vault Network</h4>
                      <p className="text-[#7c7c7c] text-sm mb-2 font-inter">
                        Multi-jurisdiction vaults with real-time on-chain proof-of-reserves oracles
                      </p>
                      <p className="text-[#7c7c7c] text-xs font-inter">Timeline: TBD based on scale</p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Secured Lending</h4>
                      <p className="text-[#7c7c7c] text-sm mb-2 font-inter">
                        Borrow against SB-GOLD holdings instead of selling; LTV caps and liquidation buffers
                      </p>
                      <p className="text-[#7c7c7c] text-xs font-inter">Timeline: +6 months after mobile app</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Security & Custody Section */}
            <section id="security" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-semibold text-[#141722] mb-6 font-inter">Security & Custody</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Vault Security</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Your gold is stored in secure, allocated vaults with institutional-grade security measures.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">🔒 Physical Security</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• Allocated bar lists with serial numbers</li>
                        <li>• Dual-control procedures</li>
                        <li>• 24/7 monitoring and guards</li>
                        <li>• Full insurance coverage</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">📊 Transparency</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• Monthly CPA attestations</li>
                        <li>• On-chain supply proofs</li>
                        <li>• Public audit reports</li>
                        <li>• Real-time redemption tracking</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Smart Contract Security</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    All smart contracts undergo rigorous auditing and security reviews before deployment.
                  </p>
                  
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <h4 className="text-[#141722] font-semibold mb-3 font-inter">Security Measures</h4>
                    <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">✓</span>
                        <span><strong className="text-[#141722]">Formal Audits:</strong> Independent security audits by reputable firms</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">✓</span>
                        <span><strong className="text-[#141722]">Monitored Upgrades:</strong> Timelock and multi-sig for contract changes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">✓</span>
                        <span><strong className="text-[#141722]">Emergency Pause:</strong> Circuit breakers for critical incidents</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">✓</span>
                        <span><strong className="text-[#141722]">Bug Bounty:</strong> Rewards for responsible disclosure</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Treasury Security</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Protocol treasury and reserves are secured using institutional custody solutions.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">MPC Custody</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Multi-party computation for USDC, SOL, and SB-GOLD treasury holdings
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Qualified Custodian</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Partnership with institutional custodians like Coinbase Institutional
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Risk Management</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Comprehensive risk management framework to protect users and the protocol.
                  </p>
                  
                  <div className="mt-4 space-y-3">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Operational Risk</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Weekly batch operations, shipping SLAs, and comprehensive insurance coverage
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Market Risk</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Peg-band controls, treasury backstops, and transparent incident communications
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Regulatory Risk</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Outside counsel engagement, proactive filings, and geo-fencing capabilities
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Support Section */}
            <section id="support" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-semibold text-[#141722] mb-6 font-inter">Support</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Get Help</h3>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    We&apos;re here to help you with any questions about Summit Bullion, physical metals, or tokenized gold.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">📧 Email Support</h4>
                      <p className="text-[#7c7c7c] text-sm mb-2 font-inter">support@summitbullion.com</p>
                      <p className="text-[#7c7c7c] text-sm font-inter">Response time: 24-48 hours</p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">💬 Discord Community</h4>
                      <p className="text-[#7c7c7c] text-sm mb-2 font-inter">Join our Discord server</p>
                      <p className="text-[#7c7c7c] text-sm font-inter">Community support 24/7</p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">𝕏 Twitter/X</h4>
                      <p className="text-[#7c7c7c] text-sm mb-2 font-inter">Follow for updates</p>
                      <p className="text-[#7c7c7c] text-sm font-inter">@SummitBullion</p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">📱 Telegram</h4>
                      <p className="text-[#7c7c7c] text-sm mb-2 font-inter">Join our community</p>
                      <p className="text-[#7c7c7c] text-sm font-inter">Real-time updates and support</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Frequently Asked Questions</h3>
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">What is SB-GOLD backed by?</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        SB-GOLD is backed 1:1 by allocated physical gold stored in secure vaults with serial number tracking and monthly attestations.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">How do I buy physical gold?</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Browse our marketplace, add items to cart, and checkout with credit card, bank transfer, or cryptocurrency. We ship to U.S. addresses.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Do I need KYC to buy physical metals?</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        No, KYC is only required for minting SB-GOLD tokens, redeeming for physical delivery, and providing liquidity. Basic purchases don&apos;t require KYC.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">What are the fees for minting SB-GOLD?</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Minting costs spot price + 1% fee. KYC badge is a one-time $25 fee per wallet. Redemption for physical gold costs $25 flat shipping.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Can I redeem SB-GOLD for cash instead of gold?</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Yes! You can burn SB-GOLD tokens for instant USDC payout at current spot price, or redeem for physical gold delivery ($25 shipping).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Information Section */}
            <section id="payment-info" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-semibold text-[#141722] mb-6 font-inter">Payment Information</h2>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Summit Bullion accepts multiple payment methods to make purchasing precious metals convenient and accessible.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Accepted Payment Methods</h3>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">💳 Credit & Debit Cards</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• Visa</li>
                        <li>• Mastercard</li>
                        <li>• American Express</li>
                        <li>• Discover</li>
                        <li>• 1% processing fee applies</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">🏦 Bank Transfers</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• ACH transfers</li>
                        <li>• Wire transfers</li>
                        <li>• Lower fees for large orders</li>
                        <li>• 1-3 business day processing</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">₿ Cryptocurrency</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• Bitcoin (BTC)</li>
                        <li>• Ethereum (ETH)</li>
                        <li>• Solana (SOL)</li>
                        <li>• USDC & other stablecoins</li>
                        <li>• Powered by Alchemy Pay</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">📱 Digital Wallets</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• Apple Pay</li>
                        <li>• Google Pay</li>
                        <li>• PayPal (select orders)</li>
                        <li>• Fast checkout experience</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Payment Processing</h3>
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Security & Encryption</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        All payments are processed through secure, PCI-DSS compliant payment processors. Your financial information is encrypted using industry-standard SSL/TLS protocols and never stored on our servers.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Order Confirmation</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Once your payment is processed successfully, you&apos;ll receive an email confirmation with your order details, tracking information, and estimated delivery date.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Pricing & Spot Updates</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Precious metal prices are updated in real-time based on current spot prices. Your order price is locked in at checkout and will not change regardless of market fluctuations after purchase.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Refunds & Cancellations</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Order Cancellation:</strong> Orders can be cancelled within 1 hour of placement for a full refund</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Returns:</strong> Physical metals can be returned within 7 days of delivery in original unopened packaging</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Refund Processing:</strong> Refunds are processed within 3-5 business days to original payment method</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Damaged Items:</strong> Damaged or defective items receive priority replacement or full refund</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Information Section */}
            <section id="shipping-info" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-semibold text-[#141722] mb-6 font-inter">Shipping Information</h2>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    We take shipping security seriously. All precious metals orders are shipped with full insurance and signature confirmation.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Shipping Methods</h3>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">🚚 Standard Shipping</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• 5-7 business days</li>
                        <li>• USPS or UPS Ground</li>
                        <li>• Fully insured</li>
                        <li>• Signature required</li>
                        <li>• Free on orders over $500</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">⚡ Express Shipping</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• 2-3 business days</li>
                        <li>• FedEx or UPS Express</li>
                        <li>• Fully insured</li>
                        <li>• Signature required</li>
                        <li>• Additional fee applies</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">🎯 Registered Mail</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• USPS Registered Mail</li>
                        <li>• 7-10 business days</li>
                        <li>• Maximum security</li>
                        <li>• Chain of custody tracking</li>
                        <li>• Best for high-value orders</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">🏪 Local Pickup</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• Available at select locations</li>
                        <li>• No shipping fees</li>
                        <li>• ID verification required</li>
                        <li>• Contact support to arrange</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Shipping Policies</h3>
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">📍 Delivery Addresses</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                        <li>• Currently shipping to U.S. addresses only</li>
                        <li>• P.O. Boxes not accepted for large orders</li>
                        <li>• Address verification required for all orders</li>
                        <li>• International shipping coming soon</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">📦 Packaging & Discretion</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                        <li>• Discreet, unmarked packaging</li>
                        <li>• No external labeling indicating precious metals</li>
                        <li>• Tamper-evident seals on all packages</li>
                        <li>• Double-boxed for high-value shipments</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">🔒 Insurance & Tracking</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                        <li>• All shipments fully insured at no extra cost</li>
                        <li>• Real-time tracking provided via email and SMS</li>
                        <li>• Adult signature required upon delivery</li>
                        <li>• File claims for lost or damaged shipments within 30 days</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Processing Times</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-[#141722] font-semibold text-sm mb-1 font-inter">In-Stock Items</h4>
                        <p className="text-[#7c7c7c] text-sm font-inter">Orders placed before 2 PM EST ship same business day. Orders after 2 PM ship next business day.</p>
                      </div>
                      <div>
                        <h4 className="text-[#141722] font-semibold text-sm mb-1 font-inter">Pre-Order Items</h4>
                        <p className="text-[#7c7c7c] text-sm font-inter">Items on pre-order ship within estimated timeframe shown on product page.</p>
                      </div>
                      <div>
                        <h4 className="text-[#141722] font-semibold text-sm mb-1 font-inter">SB-GOLD Redemptions</h4>
                        <p className="text-[#7c7c7c] text-sm font-inter">Physical gold redemptions processed weekly on Fridays. $25 flat shipping fee applies.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Terms of Service Section */}
            <section id="terms" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-semibold text-[#141722] mb-6 font-inter">Terms of Service</h2>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Last Updated: December 2024
                  </p>
                  <p className="text-[#7c7c7c] leading-relaxed mt-4 font-inter">
                    These Terms of Service govern your use of Summit Bullion&apos;s website, platform, and services. By accessing or using our services, you agree to be bound by these terms.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">1. Acceptance of Terms</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <p className="text-[#7c7c7c] text-sm font-inter">
                      By creating an account, making a purchase, or using any Summit Bullion services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please discontinue use of our services immediately.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">2. Eligibility & Account Requirements</h3>
                  <div className="mt-4 space-y-3">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Age Requirement</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        You must be at least 18 years old to use Summit Bullion services. By using our platform, you represent and warrant that you meet this age requirement.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Account Security</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        You are responsible for maintaining the confidentiality of your account credentials. Any activity conducted through your account is your responsibility. Notify us immediately of any unauthorized access or security breaches.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">KYC Compliance</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Certain features require Know Your Customer (KYC) verification. You agree to provide accurate, current, and complete information during the verification process. False or misleading information may result in account termination.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">3. Product Information & Pricing</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span>Precious metal prices fluctuate based on market conditions. Prices are locked at checkout.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span>We strive for accuracy in product descriptions, but errors may occur. We reserve the right to correct pricing or description errors.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span>Product availability is subject to change. We reserve the right to limit quantities or refuse orders.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span>All prices are in U.S. Dollars (USD) unless otherwise specified.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">4. SB-GOLD Token Terms</h3>
                  <div className="mt-4 space-y-3">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Token Nature</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        SB-GOLD tokens represent ownership of allocated physical gold stored in secure vaults. Each token is backed 1:1 by physical gold reserves with serial number tracking and monthly attestations.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Minting & Redemption</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        Minting and redemption of SB-GOLD tokens require completed KYC verification. Redemptions for physical gold are processed weekly. Instant USDC redemptions are available 24/7 subject to liquidity.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Token Tax & Fees</h4>
                      <p className="text-[#7c7c7c] text-sm font-inter">
                        A 1% token tax applies to secondary market trades on decentralized exchanges. This fee supports protocol operations, liquidity rewards, and token buybacks as outlined in our tokenomics.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">5. Prohibited Activities</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <p className="text-[#7c7c7c] text-sm mb-3 font-inter">You agree not to:</p>
                    <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span>Use our services for any illegal purpose or in violation of any applicable laws</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span>Engage in fraudulent activities, money laundering, or financing of terrorism</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span>Attempt to gain unauthorized access to our systems or other users&apos; accounts</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span>Manipulate market prices or engage in wash trading</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span>Use automated systems or bots without express written permission</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">6. Limitation of Liability</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <p className="text-[#7c7c7c] text-sm font-inter">
                      Summit Bullion and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. This includes, but is not limited to, loss of profits, data, or other intangible losses, even if we have been advised of the possibility of such damages.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">7. Disclaimer of Warranties</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <p className="text-[#7c7c7c] text-sm font-inter">
                      Our services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free. Investment in precious metals carries risk, and past performance does not guarantee future results.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">8. Modifications to Terms</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <p className="text-[#7c7c7c] text-sm font-inter">
                      We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of our services after changes are posted constitutes acceptance of the modified terms. We encourage you to review these terms periodically.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">9. Contact Information</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <p className="text-[#7c7c7c] text-sm mb-2 font-inter">
                      For questions regarding these Terms of Service, please contact us at:
                    </p>
                    <p className="text-[#7c7c7c] text-sm font-inter">
                      <strong className="text-[#141722]">Email:</strong> legal@summitbullion.com<br/>
                      <strong className="text-[#141722]">Address:</strong> Advanced Financial Technologies LLC, Florida, USA
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy Policy Section */}
            <section id="privacy" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-semibold text-[#141722] mb-6 font-inter">Privacy Policy</h2>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[#7c7c7c] leading-relaxed font-inter">
                    Last Updated: December 2024
                  </p>
                  <p className="text-[#7c7c7c] leading-relaxed mt-4 font-inter">
                    Summit Bullion respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">1. Information We Collect</h3>
                  <div className="mt-4 space-y-3">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Personal Information</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• Name, email address, phone number</li>
                        <li>• Shipping and billing addresses</li>
                        <li>• Government-issued ID for KYC verification</li>
                        <li>• Payment information (processed securely by third parties)</li>
                        <li>• Cryptocurrency wallet addresses</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Usage Information</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• IP address, browser type, device information</li>
                        <li>• Pages visited, time spent, click patterns</li>
                        <li>• Transaction history and account activity</li>
                        <li>• Cookies and tracking technologies</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">Communication Data</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• Support tickets and customer service interactions</li>
                        <li>• Email and SMS correspondence</li>
                        <li>• Feedback and survey responses</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">2. How We Use Your Information</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Service Delivery:</strong> Process orders, ship products, and provide customer support</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Compliance:</strong> Verify identity (KYC), prevent fraud, and comply with legal obligations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Communications:</strong> Send order updates, marketing messages (with consent), and service notifications</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Improvement:</strong> Analyze usage patterns to improve our services and user experience</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Security:</strong> Detect and prevent security threats, fraud, and abuse</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">3. Information Sharing & Disclosure</h3>
                  <div className="mt-4 space-y-3">
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">We May Share Information With:</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                        <li>• <strong className="text-[#141722]">Service Providers:</strong> Payment processors, shipping carriers, KYC vendors, and hosting providers</li>
                        <li>• <strong className="text-[#141722]">Legal Authorities:</strong> When required by law, subpoena, or to protect our rights</li>
                        <li>• <strong className="text-[#141722]">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                        <li>• <strong className="text-[#141722]">With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#dfdfdf]">
                      <h4 className="text-[#141722] font-semibold mb-2 font-inter">We Do NOT:</h4>
                      <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                        <li>• Sell your personal information to third parties</li>
                        <li>• Share your data for marketing purposes without consent</li>
                        <li>• Disclose your trading activity publicly</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">4. Data Security</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <p className="text-[#7c7c7c] text-sm mb-3 font-inter">
                      We implement industry-standard security measures to protect your information:
                    </p>
                    <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                      <li>• SSL/TLS encryption for data transmission</li>
                      <li>• Encrypted storage of sensitive data</li>
                      <li>• Regular security audits and penetration testing</li>
                      <li>• Access controls and authentication requirements</li>
                      <li>• Employee training on data protection best practices</li>
                    </ul>
                    <p className="text-[#7c7c7c] text-sm mt-3 font-inter">
                      While we use reasonable security measures, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your information.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">5. Your Privacy Rights</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <p className="text-[#7c7c7c] text-sm mb-3 font-inter">Depending on your jurisdiction, you may have the right to:</p>
                    <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Access:</strong> Request a copy of the personal information we hold about you</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Correction:</strong> Request correction of inaccurate or incomplete data</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Opt-Out:</strong> Unsubscribe from marketing communications at any time</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ffb546] mr-2">•</span>
                        <span><strong className="text-[#141722]">Portability:</strong> Request transfer of your data to another service provider</span>
                      </li>
                    </ul>
                    <p className="text-[#7c7c7c] text-sm mt-3 font-inter">
                      To exercise these rights, contact us at privacy@summitbullion.com
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">6. Cookies & Tracking</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <p className="text-[#7c7c7c] text-sm mb-3 font-inter">
                      We use cookies and similar technologies to enhance your experience:
                    </p>
                    <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                      <li>• <strong className="text-[#141722]">Essential Cookies:</strong> Required for site functionality</li>
                      <li>• <strong className="text-[#141722]">Analytics Cookies:</strong> Help us understand usage patterns</li>
                      <li>• <strong className="text-[#141722]">Marketing Cookies:</strong> Enable personalized advertising (with consent)</li>
                    </ul>
                    <p className="text-[#7c7c7c] text-sm mt-3 font-inter">
                      You can control cookie preferences through your browser settings.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">7. Data Retention</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <p className="text-[#7c7c7c] text-sm font-inter">
                      We retain your personal information for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements. KYC data is retained for regulatory compliance periods (typically 5-7 years). You may request deletion of your data subject to legal and operational requirements.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">8. Children&apos;s Privacy</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <p className="text-[#7c7c7c] text-sm font-inter">
                      Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a minor, please contact us immediately.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">9. Changes to Privacy Policy</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <p className="text-[#7c7c7c] text-sm font-inter">
                      We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last Updated&quot; date. We encourage you to review this policy periodically. Continued use of our services after changes constitutes acceptance of the updated policy.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">10. Contact Us</h3>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-[#dfdfdf]">
                    <p className="text-[#7c7c7c] text-sm mb-3 font-inter">
                      For privacy-related questions or concerns, contact us at:
                    </p>
                    <p className="text-[#7c7c7c] text-sm font-inter">
                      <strong className="text-[#141722]">Email:</strong> privacy@summitbullion.com<br/>
                      <strong className="text-[#141722]">Address:</strong> Advanced Financial Technologies LLC<br/>
                      Florida, USA
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

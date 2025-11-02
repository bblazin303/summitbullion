'use client';

import { Search, X, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';

type SearchResult = {
  section: string;
  subsection: string;
  title: string;
  content: string;
  sectionId: string;
  subsectionId?: string;
};

// Navigation structure - defined outside component to avoid re-renders
const navigation = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    subsections: [
      { id: 'welcome', title: 'Welcome' },
      { id: 'buy-physical', title: 'Buying Physical Metals' },
      { id: 'pricing', title: 'Pricing & Price Locks' },
      { id: 'refinement', title: 'Refinement & Purity' },
      { id: 'shipping', title: 'Shipping & Insurance' },
    ]
  },
  {
    id: 'tokenized-assets',
    title: 'Tokenized Assets',
    subsections: [
      { id: 'what-are', title: 'What Are Tokenized Assets' },
      { id: 'backing', title: 'Asset Backing & Redemption' },
      { id: 'markets', title: 'Secondary Markets & Liquidity' },
      { id: 'rewards', title: 'Rewards & Transparency' },
      { id: 'compliance', title: 'Compliance & Risk' },
    ]
  },
  {
    id: 'tokens',
    title: 'Tokens',
    subsections: [
      { id: 'sbgold', title: 'SBGOLD Token' },
      { id: 'zzzz', title: 'Legacy Token (Zzzz)' },
      { id: 'sbx', title: 'SBX Rewards Token' },
    ]
  },
  {
    id: 'whitepaper',
    title: 'Whitepaper',
    subsections: [
      { id: 'history', title: 'Company History' },
      { id: 'legal-structure', title: 'Legal Structure' },
      { id: 'mechanisms', title: 'Token Mechanisms' },
    ]
  },
  {
    id: 'support',
    title: 'Support',
    subsections: [
      { id: 'get-help', title: 'Get Help' },
      { id: 'faq', title: 'FAQ' },
    ]
  },
  {
    id: 'legal',
    title: 'Legal',
    subsections: [
      { id: 'compliance', title: 'Compliance' },
      { id: 'terms', title: 'Terms of Service' },
      { id: 'privacy', title: 'Privacy Policy' },
    ]
  },
];

export default function DocsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeSection, setActiveSection] = useState('getting-started');
  const [activeSubsection, setActiveSubsection] = useState('welcome');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const handleNavigate = (sectionId: string, subsectionId?: string) => {
    setActiveSection(sectionId);
    setActiveSubsection(subsectionId || '');
    
    // Auto-expand the section when navigating to it
    const section = navigation.find(s => s.id === sectionId);
    if (section && section.subsections.length > 0) {
      setExpandedSections(prev => {
        const newSet = new Set(prev);
        newSet.add(sectionId);
        return newSet;
      });
    }
  };

  const toggleSection = (sectionId: string) => {
    const section = navigation.find(s => s.id === sectionId);
    if (!section || section.subsections.length === 0) return;

    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
        // Navigate to first subsection when opening
        const firstSubsection = section.subsections[0];
        if (firstSubsection) {
          handleNavigate(sectionId, firstSubsection.id);
        }
      }
      return newSet;
    });
  };

  // Auto-expand the initial active section on mount
  useEffect(() => {
    const section = navigation.find(s => s.id === activeSection);
    if (section && section.subsections.length > 0) {
      setExpandedSections(prev => {
        const newSet = new Set(prev);
        newSet.add(activeSection);
        return newSet;
      });
    }
  }, []); // Only run on mount

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Search functionality - Enhanced for robust content searching
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

    // Define searchable content for each section
    const searchableContent: Record<string, { description: string; keywords: string[] }> = {
      'getting-started-welcome': { 
        description: 'Welcome to Summit Bullion! Explore our platform and access all major sections of the Help Center.',
        keywords: ['welcome', 'introduction', 'start', 'begin', 'overview', 'getting started', 'help center']
      },
      'getting-started-buy-physical': { 
        description: 'Real metals, zero guesswork. Browse catalog, add to cart, choose payment method with card, bank transfer, or crypto.',
        keywords: ['buy', 'purchase', 'physical', 'gold', 'silver', 'metals', 'invest', 'catalog', 'cart', 'checkout', 'coinbase commerce']
      },
      'getting-started-pricing': { 
        description: 'Know exactly what you will pay with 10-minute price locks. Premiums shown up front with transparent pricing.',
        keywords: ['pricing', 'premiums', 'price lock', 'spot price', 'checkout', 'cost', 'market', 'fees']
      },
      'getting-started-refinement': { 
        description: 'Premium purity and proven integrity. Investment-grade bullion sourced from vetted U.S. distributors and refiners.',
        keywords: ['refinement', 'purity', 'quality', 'fineness', 'assay', 'verification', 'authenticated', 'ira-eligible']
      },
      'getting-started-shipping': { 
        description: 'Discreet, fully insured shipping to U.S. addresses. Free shipping on qualifying orders with signature requirements.',
        keywords: ['shipping', 'delivery', 'insurance', 'tracking', 'discreet', 'fedex', 'usps', 'signature']
      },
      'tokenized-assets-what-are': { 
        description: 'Tokenized assets are digital representations of real-world assets with 24/7 transferability and redemption-first design.',
        keywords: ['tokenized', 'digital assets', 'blockchain', 'real-world assets', 'rwa', 'redemption', 'transparency']
      },
      'tokenized-assets-backing': { 
        description: 'Each token maps 1:1 to allocated off-chain inventory with clear redemption paths and proof-of-reserves.',
        keywords: ['backing', 'custody', 'allocated', 'reserves', 'redemption', 'vault', 'attestation', 'proof']
      },
      'tokenized-assets-markets': { 
        description: 'Trade on DEX venues with transparent fees, liquidity provision opportunities, and peg stability mechanisms.',
        keywords: ['dex', 'trading', 'liquidity', 'lp', 'amm', 'swap', 'market', 'pool', 'fees']
      },
      'tokenized-assets-rewards': { 
        description: 'LP rewards from program swap fees with full transparency on distributions and on-chain receipts.',
        keywords: ['rewards', 'lp rewards', 'swap fee', 'distribution', 'apr', 'yield', 'treasury', 'transparency']
      },
      'tokenized-assets-compliance': { 
        description: 'KYC/AML requirements, risk disclosures, and compliance guardrails for tokenized asset participation.',
        keywords: ['compliance', 'kyc', 'aml', 'ofac', 'risk', 'disclosure', 'regulatory', 'jurisdictions']
      },
      'tokens-sbgold': { 
        description: 'SBGOLD is a planned gold-backed commodity token with 1:1 redemption backed by allocated gold in U.S. vaults.',
        keywords: ['sbgold', 'gold token', 'backed', 'mint', 'redeem', 'allocated', 'spv', 'trust']
      },
      'tokens-zzzz': { 
        description: 'Zzzz is our legacy community token with policy-driven buyback and burn mechanism for early supporters.',
        keywords: ['zzzz', 'legacy', 'community', 'buyback', 'burn', 'sleeperbot', 'founder token']
      },
      'tokens-sbx': { 
        description: 'SBX is a planned rewards token for compensating liquidity providers in designated pools.',
        keywords: ['sbx', 'rewards token', 'lp incentives', 'emissions', 'claim', 'accrual']
      },
      'whitepaper-history': { 
        description: 'AFT founded in 2023, evolved from Forex to Web3, launching Zzzz and building Summit Bullion precious metals platform.',
        keywords: ['history', 'company', 'aft', 'founded', 'mission', 'vision', 'about', 'background', 'journey']
      },
      'whitepaper-legal-structure': { 
        description: 'U.S.-based multi-entity structure with Delaware C-Corp parent, Florida LLC operator, and bankruptcy-remote SPV/Trust.',
        keywords: ['legal', 'structure', 'delaware', 'c-corp', 'llc', 'spv', 'trust', 'bankruptcy-remote', 'compliance']
      },
      'whitepaper-mechanisms': { 
        description: 'Token mechanisms covering physical purchases, minting, DEX trading, redemption, and liquidity provision.',
        keywords: ['mechanisms', 'tokenomics', 'mint', 'burn', 'swap', 'redeem', 'flow', 'lifecycle']
      },
      'support-get-help': { 
        description: 'Contact support team via email, Discord, Twitter, or Telegram for assistance with orders and questions.',
        keywords: ['support', 'help', 'contact', 'email', 'discord', 'telegram', 'twitter', 'assistance', 'customer service']
      },
      'support-faq': { 
        description: 'Frequently asked questions about backing, purchasing, KYC, fees, redemption, and liquidity providing.',
        keywords: ['faq', 'questions', 'answers', 'help', 'common', 'frequently asked', 'basics']
      },
      'legal-compliance': { 
        description: 'Compliance roadmap, security measures, custody procedures, and operational safeguards for U.S.-based operations.',
        keywords: ['compliance', 'security', 'custody', 'risk', 'audit', 'regulatory', 'legal', 'controls']
      },
      'legal-terms': { 
        description: 'Terms of Service governing access to Summit Bullion services including retail and proposed tokenized assets.',
        keywords: ['terms', 'service', 'agreement', 'legal', 'conditions', 'tos', 'contract']
      },
      'legal-privacy': { 
        description: 'Privacy Policy explaining data collection, usage, security, KYC information, and user rights.',
        keywords: ['privacy', 'policy', 'data', 'protection', 'security', 'information', 'kyc', 'gdpr']
      }
    };

    // Search through all sections and subsections with content matching
    navigation.forEach(section => {
      if (section.subsections.length === 0) {
        // Standalone section
        const contentKey = section.id;
        const searchData = searchableContent[contentKey];
        const searchableText = `${section.title} ${searchData?.description || ''} ${searchData?.keywords?.join(' ') || ''}`.toLowerCase();
        
        const matchScore = searchTerms.reduce((score, term) => {
          if (searchableText.includes(term)) {
            // Higher score for title matches
            if (section.title.toLowerCase().includes(term)) return score + 10;
            return score + 1;
          }
          return score;
        }, 0);

        if (matchScore > 0) {
          results.push({
            section: section.title,
            subsection: '',
            title: section.title,
            content: searchData?.description || `View ${section.title} documentation`,
            sectionId: section.id,
          });
        }
      } else {
        // Section with subsections
        section.subsections.forEach(subsection => {
          const contentKey = `${section.id}-${subsection.id}`;
          const searchData = searchableContent[contentKey];
          const searchableText = `${section.title} ${subsection.title} ${searchData?.description || ''} ${searchData?.keywords?.join(' ') || ''}`.toLowerCase();
          
          const matchScore = searchTerms.reduce((score, term) => {
            if (searchableText.includes(term)) {
              // Higher score for title matches
              if (subsection.title.toLowerCase().includes(term) || section.title.toLowerCase().includes(term)) {
                return score + 10;
              }
              return score + 1;
            }
            return score;
          }, 0);

          if (matchScore > 0) {
            results.push({
              section: section.title,
              subsection: subsection.title,
              title: subsection.title,
              content: searchData?.description || `${section.title} - ${subsection.title}`,
              sectionId: section.id,
              subsectionId: subsection.id,
            });
          }
        });
      }
    });

    // Sort by relevance (higher scores first)
    setSearchResults(results);
  }, []);

  // Get current section and subsection info
  const currentSection = navigation.find(s => s.id === activeSection);
  const currentSubsection = currentSection?.subsections.find(ss => ss.id === activeSubsection);

  // Numbered step component
  const NumberedStep = ({ number, title, children, isLast = false }: { number: number; title: string; children: React.ReactNode; isLast?: boolean }): React.ReactElement => (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFF0C1] to-[#FFB546] flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-[#141722]">{number}</span>
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-[#e5ddd0] mt-2"></div>}
      </div>
      <div className={`flex-1 ${!isLast ? 'pb-8' : ''}`}>
        <h4 className="text-[#141722] font-semibold text-base mb-2 font-inter">{title}</h4>
        <div className="text-[#7c7c7c] text-sm font-inter leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );

  // Content for each subsection
  const getContent = () => {
    const key = `${activeSection}-${activeSubsection}`;
    
    const contentMap: Record<string, React.ReactElement> = {
      'getting-started-welcome': (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] leading-relaxed font-inter">
              Welcome to Summit Bullion! Use the cards below to explore our platform, learn about our services, and quickly access all major sections of the Help Center.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Getting Started Card */}
            <button
              onClick={() => handleNavigate('getting-started', 'buy-physical')}
              className="bg-white rounded-2xl border border-[#e5ddd0] p-6 hover:shadow-lg hover:border-[#ffb546] transition-all duration-200 text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ffb546] to-[#ffd000] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-[#7c7c7c] group-hover:text-[#ffb546] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-[#141722] font-semibold text-lg mb-2 font-inter">Buying Physical Metals</h3>
              <p className="text-[#7c7c7c] text-sm font-inter">
                Start investing in physical gold and silver with just a few clicks.
              </p>
            </button>

            {/* Tokenized Assets Card */}
            <button
              onClick={() => handleNavigate('tokenized-assets', 'what-are')}
              className="bg-white rounded-2xl border border-[#e5ddd0] p-6 hover:shadow-lg hover:border-[#ffb546] transition-all duration-200 text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ffb546] to-[#ffd000] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-[#7c7c7c] group-hover:text-[#ffb546] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-[#141722] font-semibold text-lg mb-2 font-inter">Tokenized Assets</h3>
              <p className="text-[#7c7c7c] text-sm font-inter">
                Learn about digital representations of real-world assets with redemption-first design.
              </p>
            </button>

            {/* Tokens Card */}
            <button
              onClick={() => handleNavigate('tokens', 'sbgold')}
              className="bg-white rounded-2xl border border-[#e5ddd0] p-6 hover:shadow-lg hover:border-[#ffb546] transition-all duration-200 text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ffb546] to-[#ffd000] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-[#7c7c7c] group-hover:text-[#ffb546] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-[#141722] font-semibold text-lg mb-2 font-inter">Our Tokens</h3>
              <p className="text-[#7c7c7c] text-sm font-inter">
                Explore SBGOLD, Zzzz legacy token, and SBX rewards token.
              </p>
            </button>

            {/* Whitepaper Card */}
            <button
              onClick={() => handleNavigate('whitepaper', 'history')}
              className="bg-white rounded-2xl border border-[#e5ddd0] p-6 hover:shadow-lg hover:border-[#ffb546] transition-all duration-200 text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ffb546] to-[#ffd000] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-[#7c7c7c] group-hover:text-[#ffb546] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-[#141722] font-semibold text-lg mb-2 font-inter">Company History</h3>
              <p className="text-[#7c7c7c] text-sm font-inter">
                Learn about Summit Bullion&apos;s journey from AFT to tokenized precious metals.
              </p>
            </button>

            {/* Support Card */}
            <button
              onClick={() => handleNavigate('support', 'faq')}
              className="bg-white rounded-2xl border border-[#e5ddd0] p-6 hover:shadow-lg hover:border-[#ffb546] transition-all duration-200 text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ffb546] to-[#ffd000] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-[#7c7c7c] group-hover:text-[#ffb546] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-[#141722] font-semibold text-lg mb-2 font-inter">FAQ</h3>
              <p className="text-[#7c7c7c] text-sm font-inter">
                Find answers to frequently asked questions.
              </p>
            </button>
          </div>
        </div>
      ),

      'getting-started-buy-physical': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Real Metals, Zero Guesswork. We deliver live pricing, straightforward checkout, card/bank/crypto payment options, and discreet, insured shipping—precious metals without the friction.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <NumberedStep number={1} title="Browse our catalog">
              <p>Filter by metal (gold/silver), weight, format (coin/bar), and premium tier. Product pages show live pricing, detailed specs, and images.</p>
            </NumberedStep>
            
            <NumberedStep number={2} title="Add to cart">
              <p>Your cart displays itemized premiums, applicable state sales tax, and insured shipping.</p>
            </NumberedStep>
            
            <NumberedStep number={3} title="Choose a payment method">
              <p>Card (Visa/Mastercard/AmEx/Discover) — fast authorization<br/>
                Bank transfer (ACH / wire) — best for larger orders; we begin processing when funds post.<br/>
                Crypto (via Coinbase Commerce) — major networks supported; orders release upon on-chain confirmation.</p>
            </NumberedStep>
            
            <NumberedStep number={4} title="Receive your order" isLast>
              <p>We ship discreetly with full insurance to your verified U.S. address. A signature may be required based on order value. Tracking appears in your account as soon as a label is created.</p>
            </NumberedStep>
          </div>
        </div>
      ),

      'getting-started-pricing': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Know exactly what you&apos;ll pay—before you pay. Start checkout to launch a 10-minute price lock (card/crypto finalize within the window; ACH/wire finalizes when funds land). Premiums are shown up front and reflect product type and market supply, so there are no surprises at checkout.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Price lock — how it works</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Cart does not lock price:</strong> Browsing or adding to cart won&apos;t reserve inventory or pricing.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Lock begins when you start checkout:</strong> Clicking Checkout opens a 10-minute lock window shown by an on-screen countdown.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Card / Crypto:</strong> Your price is final once payment is authorized (card) or confirmed on-chain (crypto) within the lock window.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">ACH / Wire:</strong> Your price is final when funds are received. If the 10-minute window lapses before payment is complete, the order requotes at the then-current price.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">If a lock expires, simply restart checkout to obtain a fresh quote.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Premiums</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Premiums vary by format, weight, brand, and market supply (e.g., sovereign coins typically carry higher premiums than generic bars).
            </p>
          </div>
        </div>
      ),

      'getting-started-refinement': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            At Summit Bullion, &quot;premium&quot; isn&apos;t a buzzword—it&apos;s the standard. Every product we list is investment-grade bullion sourced through a tightly vetted network of U.S. distributors, refiners, and sovereign-mint partners. We curate for purity, consistency, and authenticity first, then negotiate for price—so you don&apos;t have to.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Premium Purity, Proven Integrity</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Gold:</strong> Typically .9999 fine investment-grade coins and bars, with carded/assayed options that include serialized certificates and tamper-evident packaging.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Silver:</strong> Predominantly .999 fine coins and bars across popular weights, with clean surfaces and uniform finish suitable for stackers and long-term holders.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Quality you can verify:</strong> Where applicable, items carry assay cards, serial numbers, or sealed packaging that document weight and purity.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">A Partner Network Built for Quality—and Price</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              We source daily from a multi-venue network of authorized distributors, top-tier refiners, and mint partners. This breadth lets us:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Secure the exact format you want (sovereign coins, 1 oz / 10 oz / kilo bars, and more)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Keep premiums competitive by comparing multiple wholesale books in real time</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Maintain continuity of supply during high-volatility windows when single-source dealers run dry</span>
              </li>
            </ul>
            <p className="text-[#7c7c7c] text-sm font-inter mt-3">
              We don&apos;t list every supplier or stamp on our site; instead, we guarantee that items come from recognized, reputable producers that meet rigorous industry standards for purity and responsible sourcing.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">From IRA-Eligible to Industrial Grain</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              Whether you&apos;re building a retirement allocation or supporting a workshop, we carry the full spectrum:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">IRA-eligible bullion</strong> clearly labeled on product pages (consult your custodian for plan-specific rules)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Carded/assayed bars</strong> for investors who prefer serialized packaging and instant visual verification</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Uncarded bars and coins</strong> for stackers who want the lowest premium at a given weight</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Industrial grain</strong> for jewelers and manufacturers who need clean, consistent feedstock at scale</span>
              </li>
            </ul>
            <p className="text-[#7c7c7c] text-sm font-inter mt-3">
              Every category is held to the same authenticity—the differences are brand, packaging, format, and premium.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Verification & Handling You Can Trust</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              Before an item is made available for sale, it passes a multi-point intake:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Visual & dimensional checks (finish, diameter/length, thickness)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Weight verification on calibrated scales within tight tolerances</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Packaging integrity review for sealed/card-assayed products</span>
              </li>
            </ul>
            <p className="text-[#7c7c7c] text-sm font-inter mt-3">
              Once cleared, inventory is stored in a controlled, insured environment and prepared using discreet, secure packaging. We ship with full insurance to your verified U.S. address; signatures may be required based on order value.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Premiums That Make Sense</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Premiums are transparent and reflect format, weight, and market supply—for example, sovereign coins often command higher premiums than generic bars due to mint reputation and collectability. We display the live product price (spot + premium) and lock it during checkout, so you always know what you&apos;re paying before you commit.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Our Promise</h4>
            <ul className="space-y-2">
              <li className="text-[#7c7c7c] text-sm font-inter">• Authenticity guaranteed — We stand behind every item we ship.</li>
                  <li className="text-[#7c7c7c] text-sm font-inter">• No back-order bait — &quot;In-Stock&quot; means physically on the shelf, ready to go.</li>
              <li className="text-[#7c7c7c] text-sm font-inter">• Consistently competitive — Our partner network lets us hunt for value without compromising quality.</li>
            </ul>
          </div>
        </div>
      ),

      'getting-started-shipping': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            At Summit Bullion, every order is shipped discreetly and fully insured. We select the fastest, most cost-effective method after your order is submitted and keep you updated from label creation to delivery. We go the extra mile to make sure your products are received quickly and secure.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Shipping Cost</h4>
            
            <div className="space-y-4">
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Silver</h5>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">300+ oz Silver or $500 Face Value (90% Silver): Free Shipping — FedEx / UPS Ground / USPS Priority Mail</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">$1,000 Face Value (90% Silver): Free Shipping — FedEx Ground / USPS Priority Mail</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">Smaller orders: $24 Shipping & Handling — FedEx Ground or USPS Priority Mail (our choice)</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Gold</h5>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">10 oz to 20 oz Gold: Free Shipping — FedEx / UPS Ground</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">20+ oz Gold: Free Shipping — FedEx Standard Overnight</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">Smaller orders: $24 Shipping & Handling — FedEx Ground or USPS Priority Mail (our choice)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Other</h5>
                <p className="text-[#7c7c7c] text-sm font-inter">HI, AK, & U.S. Territories: Some exclusions and exceptions apply.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Methods of Shipping</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              To keep prices competitive, we determine the fastest and most cost-effective carrier and service once your order is placed. Most orders ship via FedEx Ground, USPS Priority Mail, or FedEx Overnight.
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter">
              <strong className="text-[#141722]">Note:</strong> FedEx and UPS cannot deliver to P.O. Boxes.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Tracking & Delivery</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">You&apos;ll receive a tracking number as soon as your order ships</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Please allow 2–7 business days for delivery (some products take longer to ship than others)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Depending on your items, orders may be held until products with longer ship times are ready—your order may ship in one or more packages, and packages may not all ship the same day</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">If you haven&apos;t received your order, log in to check status and tracking updates</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Discreet Packaging</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              We ship in plain, inconspicuous packaging. Labels and boxes never reference Summit Bullion or use terms like gold, silver, bullion, etc.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Shipping Insurance</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              All shipments—regardless of size—are covered by our insurance policy. In the rare event your shipment is lost or damaged, we will refund your money or re-ship your items at our discretion.
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              If your item is lost in transit or arrives damaged, contact us immediately. For damaged packages, you must notify us within three (3) business days after delivery.
            </p>
            <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-lg border border-[#ffb546]/20 p-4">
              <p className="text-[#7c7c7c] text-sm font-inter mb-2">
                <strong className="text-[#141722]">Coverage limitations:</strong> We cannot be responsible for packages when customers leave carrier instructions to leave unattended (porch, lobby, doorman), to leave with a neighbor, or to have a package signed for by a third party (e.g., an employee at a rented mailbox such as a UPS Store). Such requests void our insurance. If you are using our drop-shipping service to your client, please communicate this policy to them.
              </p>
            </div>
            <p className="text-[#7c7c7c] text-sm font-inter mt-3">
              If we determine a package is lost or damaged during transit, Summit Bullion will file the insurance claim with our carrier/insurer.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Signature Requirement</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              A signature is required on all packages over $250.
            </p>
          </div>
        </div>
      ),

      'tokenized-assets-what-are': (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] leading-relaxed font-inter">
              <strong className="text-[#141722]">Proposed Architecture:</strong> The materials in this section describe our proposed tokenized-asset design and may evolve with regulatory guidance, security reviews, and market feedback.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">What are tokenized assets?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-4">
              Tokenized assets are digital representations of real-world assets issued on secure blockchains. They keep the economics and integrity of the underlying asset, while adding speed, portability, and programmability.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Real asset, digital wrapper:</strong> Each unit corresponds to a defined claim on an off-chain asset held under custody.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">24/7 transferability:</strong> Move and settle value outside traditional banking windows.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Programmable use:</strong> Connect to wallets, payment tools, and on-chain finance (within policy and jurisdiction).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Why they matter now</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Transparency you can verify:</strong> Public on-chain supply paired with attestations/Proof-of-Reserves for the backing asset.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Lower friction:</strong> Faster settlement and simpler ownership transfers than legacy rails.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Fractional access:</strong> Acquire precise amounts without compromising quality standards.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Portability & composability:</strong> Move value between approved wallets/apps with clear, enforced rules.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Global rails, local compliance:</strong> Modern infrastructure aligned with KYC/AML and sanctions controls.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Our stance: Redemption-first, always</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-4">
              We build from the premise that digital only works if physical ownership is unquestionable.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">1:1 design intent:</strong> Each unit is designed to map to allocated, segregated backing—not a pooled IOU.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Clear redemption path:</strong> Users can redeem to the underlying asset subject to eligibility (KYC, permitted jurisdictions) and stated fees/SLAs.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Two prices, one anchor:</strong> We present Redemption Value (what the asset redeems for) alongside Market Price (what it trades for), so value and liquidity are visible at a glance.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Auditable backing:</strong> Bar-lists/holding reports and periodic third-party attestations.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Built on centuries of value—now in a modern format</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Precious metals and other hard commodities have served as stores of value for centuries. Tokenization doesn&apos;t change that—it extends it, allowing ownership to be portable, verifiable, and redeemable in a digital economy while preserving the integrity of the underlying asset.
            </p>
          </div>
        </div>
      ),

      'tokenized-assets-backing': (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] leading-relaxed font-inter">
              <strong className="text-[#141722]">Proposed Architecture:</strong> The materials below reflect our proposed design and may evolve with legal, security, and market feedback.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">What a tokenized commodity represents</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Digital unit, real backing:</strong> Each token maps 1:1 to allocated off-chain inventory held under professional custody.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Mint/Burn parity:</strong> Tokens are minted only when metal is allocated and burned on redemption so on-chain supply tracks reserves.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Not pooled IOUs:</strong> Reserves are allocated and segregated, not commingled.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Clarity:</strong> We show Redemption Value (what it redeems for, net posted fees) alongside Market Price (price of minting new).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Custody standards</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Allocated & tagged:</strong> Inventory tracked at lot/serial (where applicable); location recorded.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Specs & form factors:</strong> Fineness and formats meet market standards; exact specs can vary by mint/series and are disclosed on the bar-list.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Insurance & controls:</strong> Vault insurance in force; dual-control access and audit trails.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Change management:</strong> Any vault/procedure change is logged and published.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Proof-of-Reserves & transparency</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Bar-list / holdings:</strong> Periodic report (serial, form, fineness, weights, location).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Supply parity check:</strong> Reconcile on-chain supply to off-chain inventory on a set cadence.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Independent attestations:</strong> Third-party confirmations of existence and program control.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Public program addresses:</strong> View mint/burn activity in real time.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Redemption model</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Eligibility:</strong> KYC/AML-gated; permitted jurisdictions; allow-listed wallets as applicable.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Minimums & formats:</strong> Published minimums and available bars/coins with lead times per format.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Fees & logistics:</strong> 25$ Flat rate covers handling, insured shipping.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">SLAs:</strong> Target timelines for allocation, packing, label creation, tracking.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Burn on redemption:</strong> Tokens are burned before shipment so supply reflects outflow.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Redemption at a glance</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ffb546] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">1</div>
                <span className="text-[#7c7c7c] text-sm font-inter">Request (view Redemption Value, fees, formats, ETA)</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ffb546] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">2</div>
                <span className="text-[#7c7c7c] text-sm font-inter">Compliance checks & inventory allocation</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ffb546] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">3</div>
                <span className="text-[#7c7c7c] text-sm font-inter">Confirm; tokens queued and burned</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ffb546] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">4</div>
                <span className="text-[#7c7c7c] text-sm font-inter">Pick/pack, insure, discreet-ship with tracking & signature as required</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Controls & responsibilities</h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-[#141722] font-medium mb-2 text-sm font-inter">Program controls:</h5>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  Role-based access, multi-sig admin, separation of duties, pause/circuit breakers for emergencies, public change logs, incident-response playbooks.
                </p>
              </div>
              <div>
                <h5 className="text-[#141722] font-medium mb-2 text-sm font-inter">User responsibilities:</h5>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  Keep wallets secure; provide accurate addresses; follow local laws; consult a tax advisor; review fees/SLAs/eligibility/risk disclosures before use.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] text-sm font-inter">
              <strong className="text-[#141722]">Bottom line:</strong> Tokenized commodities only work if backing and redemption are unquestionable. Our model keeps redemption at the center and pairs on-chain transparency with off-chain attestations—so the digital unit faithfully represents the metal behind it.
            </p>
          </div>
        </div>
      ),

      'tokenized-assets-markets': (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] leading-relaxed font-inter">
              <strong className="text-[#141722]">Important:</strong> Tokenized assets from different issuers may follow different trading, fee, and stabilization procedures. The framework below reflects how we propose to operate and may evolve with legal, security, and market feedback.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Where trading happens</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">On-chain venues:</strong> Tokens typically trade on AMM/DEX pools (and, where available, approved CEX venues).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Canonical pools:</strong> We will publish official pool addresses/pairs so users can verify they&apos;re trading the intended market.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Routing:</strong> Aggregators may split routes across multiple pools; users should review slippage before confirming.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Fees on secondary trades</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Venue fee (DEX):</strong> The exchange may charge its own fee (commonly ~0.30–0.50%) paid to LPs; this is not program/corporate revenue except for the liquidity provided by the company.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Program-level swap fee (&quot;token tax&quot;):</strong> Proposed: 1.00% on secondary swaps to fund ecosystem health. Distributions are published on a policy page and may change via governance.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Providing & removing liquidity (LP)</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Who can LP:</strong> Generally permissionless within allowed jurisdictions; venue-level KYC or geo-rules apply.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Only freshly minted tokens can be added to the LP. No rehypothecation.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">How it works:</strong> Deposit both sides of a pair to receive LP tokens; withdraw anytime unless a venue imposes cooldowns.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Rewards & claims:</strong> LPs earn venue fees (and, when enabled, program rewards) pro-rata; claims are on-chain and transparent.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Impermanent loss:</strong> LPs bear price divergence risk between the two assets; review venue docs and risk disclosures before providing liquidity.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Peg & price health</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Redemption anchor:</strong> The principal anchor is redemption into the underlying asset; arbitrage between Mint Price and Redemption Value helps keep price aligned.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Treasury bands:</strong> Program treasury may buy below a band and sell above a band to support orderly markets (transactions disclosed).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Risk Fund:</strong> A designated reserve may be used during disorderly markets or liquidity shocks per published policy.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Market makers:</strong> Where appropriate, independent market-makers may quote around fair value to tighten spreads.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Circuit breakers:</strong> Program may pause rewards or adjust parameters during incidents; changes are logged and announced.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Transparency & metrics</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Public addresses:</strong> Official treasury/program addresses, LP pools, and reward contracts are published.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Dashboards:</strong> Depth, spreads, TVL, volume, swap-fee inflows (&quot;token tax&quot;), buyback/burn history, and Risk Fund balance are reported on a set cadence.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Change log:</strong> Any parameter update (fees, bands, rewards) is timestamped, reasoned, and archived.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Risks to understand</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Smart-contract & venue risk:</strong> AMMs, bridges, and reward contracts carry non-zero risk.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <div className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Liquidity & slippage:</strong> Thin pools can cause outsized price impact on larger trades. We strive to keep slippage to a minimum but is dependent on liquidity depth.
                  <p className="mt-2 text-xs">Around $4M TVL in the canonical pool (≈ $2M per side) to keep ≤0.5% average slippage on a $10k swap in a v2/constant-product AMM (e.g., Raydium CPMM) when both sides are value-balanced.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">LP risk:</strong> Impermanent loss and changing reward rates can impact returns.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Jurisdictional limits:</strong> Access may be restricted by geography, wallet screening, or venue policy.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] text-sm font-inter">
              <strong className="text-[#141722]">Bottom line:</strong> Secondary markets work when incentives, depth, and redemption pull in the same direction. Our proposed design pairs a clear redemption anchor with transparent fees, LP incentives, and published stabilization rules—so markets stay usable and trustworthy.
            </p>
          </div>
        </div>
      ),

      'tokenized-assets-rewards': (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] leading-relaxed font-inter">
              <strong className="text-[#141722]">Important:</strong> Tokenized assets from different issuers can follow different reward and reporting models. The framework below reflects how we propose to operate and may evolve with legal, security, and market feedback.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">What counts as &quot;rewards&quot; (and what doesn&apos;t)</h4>
            
            <div className="space-y-4">
              <div>
                <h5 className="text-[#141722] font-medium mb-2 text-sm font-inter">Rewards sources:</h5>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  Program-level swap fee (&quot;token tax&quot;) on secondary trades: 1.00% charged on swaps in designated pools to fund ecosystem health.
                </p>
              </div>
              
              <div>
                <h5 className="text-[#141722] font-medium mb-2 text-sm font-inter">Not rewards / not corporate revenue:</h5>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">DEX venue fee (e.g., ~0.50%) is set by the exchange and paid to LPs, not to the program or the company except company owned LP treated the same as user supplied liquidity.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">Primary mint/redeem fees are separate and belong to the issuing vehicle; they do not flow through the secondary-market rewards.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Distribution policy (Two Phase Approach)</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-4">
              To keep liquidity deep early and sustainable long term, we outline two clear phases. Percentages apply to the 1.00% swap fee only.
            </p>
            
            <div className="space-y-4">
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Phase A — Bootstrap</h5>
                <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                  <li>• 50% → LP Rewards (paid pro-rata to liquidity providers in the canonical pools)</li>
                  <li>• 27.5% → Protocol Treasury (market operations, peg health, growth)</li>
                  <li>• 10% → Team & Operations (infrastructure, audits, maintenance)</li>
                  <li>• 5% → Future Rewards Reserve (earmarked for a future incentives program)</li>
                  <li>• 5% → Legacy Support Reserve (buyback/burn or support as applicable)</li>
                  <li>• 2.5% → Risk/Emergency Fund</li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Phase B — Long-Term</h5>
                <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                  <li>• 35% → Protocol Treasury</li>
                  <li>• 25% → LP Rewards (if rewards are enabled)</li>
                  <li>• 15% → Team & Operations</li>
                  <li>• 10% → Legacy Support Reserve (buyback/burn as applicable)</li>
                  <li>• 10% → Future Incentives Reserve (e.g., programmatic buybacks or rewards)</li>
                  <li>• 5% → Risk/Emergency Fund</li>
                </ul>
              </div>

              <p className="text-[#7c7c7c] text-xs font-inter italic mt-4">
                We&apos;ll publish when a phase transition occurs (e.g., after a TVL or liquidity-depth milestone) and make historical policies viewable for auditability.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">How participants earn & claim</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">LPs (liquidity providers):</strong> Earn DEX venue fees automatically and may receive program rewards (from the policy above) pro-rata to their share of pool liquidity.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Claiming:</strong> Rewards accrue on-chain to eligible wallets; claims are self-serve through a verified UI or directly via contract calls.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Eligibility:</strong> Subject to geo-/KYC restrictions where required by venue or policy.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Transparency we commit to</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-4">
              We treat transparency as product, not PR. The following data will be public and machine-readable:
            </p>
            
            <div className="space-y-4">
              <div>
                <h5 className="text-[#141722] font-medium mb-2 text-sm font-inter">1) Addresses & contracts</h5>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  Canonical pool addresses, treasury/program addresses, reward contracts, and any auxiliary vault/policy contracts.
                </p>
              </div>

              <div>
                <h5 className="text-[#141722] font-medium mb-2 text-sm font-inter">2) Real-time & periodic metrics</h5>
                <p className="text-[#7c7c7c] text-sm font-inter mb-2">
                  <strong className="text-[#141722]">Real-time:</strong> Pool depth (TVL), spreads, 24h/7d volume, current reward APR (if enabled), vault/program balances by address.
                </p>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Periodic (e.g., weekly/monthly):</strong>
                </p>
                <ul className="text-[#7c7c7c] text-xs space-y-1 mt-2 ml-4 font-inter">
                  <li>• Swap-fee inflows by bucket (LP, Treasury, Team/Ops, Future/Legacy reserves, Risk)</li>
                  <li>• Buyback/burn executions (amount, tx hash, timestamp)</li>
                  <li>• Risk Fund changes (inflows/outflows, reason, tx hash)</li>
                  <li>• Any treasury market operations within published bands (size, direction, timestamp)</li>
                </ul>
              </div>

              <div>
                <h5 className="text-[#141722] font-medium mb-2 text-sm font-inter">3) Receipts & ledgers</h5>
                <ul className="space-y-1">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">CSV/JSON downloads of bucket-level inflows/outflows by period.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">Human-readable &quot;receipts&quot; for major actions (e.g., buybacks, rewards distributions) with tx hashes.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="text-[#141722] font-medium mb-2 text-sm font-inter">4) Change log (no governance mechanics described):</h5>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  A timestamped log of parameter updates (fees, bands, reward toggles), the effective time, and a plain-English rationale.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Disclosures & caveats</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Rewards are variable:</strong> APR depends on market volume, depth, and policy toggles. Past rates don&apos;t guarantee future rates.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Venue risk:</strong> DEXs and reward contracts carry smart-contract risk.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Eligibility & withholding:</strong> Rewards may be limited or withheld based on jurisdiction, sanctions screening, or compliance status.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Not corporate dividends:</strong> Rewards are program-level distributions; they are not equity dividends and do not represent corporate profit.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] text-sm font-inter">
              <strong className="text-[#141722]">Bottom line:</strong> Rewards should be predictable to read and easy to verify. We&apos;ll publish clear buckets, on-chain receipts, and a public change log—so anyone can understand where every unit of the swap fee went and why.
            </p>
          </div>
        </div>
      ),

      'tokenized-assets-compliance': (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] leading-relaxed font-inter">
              <strong className="text-[#141722]">Important:</strong> Tokenized assets from different issuers may follow different policies and procedures. The framework below reflects how we propose to operate and may evolve with legal guidance, security reviews, and market feedback. Nothing here is tax, legal, or investment advice.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Token framing (proposed intent)</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Commodity/payment‐style design:</strong> A digital unit that maps to allocated, off-chain inventory; built for payments, transfers, and redemption—not for profit promises.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Redemption-first:</strong> Clear path to redeem for the underlying asset under posted eligibility, fees, and service levels.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Segregation of backing:</strong> Custodied reserves are intended to be segregated from corporate assets (see Asset, Backing & Redemption).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Transparency:</strong> On-chain supply alongside periodic reserve attestations (see Rewards & Transparency).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Access & eligibility</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">KYC/AML/OFAC:</strong> Mint/redeem (and where required, program access) are gated by identity verification and sanctions screening.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Jurisdictions:</strong> Availability may be limited by geography or venue policy; some regions are blocked.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Wallet screening:</strong> We may allow-list or block wallets based on risk signals and compliance rules.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Controls & safeguards</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Operational controls:</strong> Role-based access, multi-party approvals, separation of duties for mint/burn/treasury actions.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Circuit breakers:</strong> Ability to pause mints, redemptions, rewards, or specific venues in emergencies or during audits.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Change logging:</strong> Parameter changes (fees, limits, pauses) are timestamped with a plain-English rationale in a public change log.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Incident response:</strong> Documented investigation, user notifications, and remediation steps for custody or smart-contract incidents.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">User responsibilities</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Know your tools:</strong> Use supported wallets, safeguard keys, and verify addresses before transacting.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Follow local law:</strong> You are responsible for compliance with your jurisdiction&apos;s rules and any required tax reporting.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Read the docs:</strong> Review fee schedules, SLAs, eligibility rules, and risk disclosures before minting, trading, or redeeming.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Key risks</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Smart-contract risk:</strong> Bugs or exploits in venue or token contracts can cause loss.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Custody & operational risk:</strong> Vault, logistics, or insurer failures could delay redemption or require remediation.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Market/peg risk:</strong> Market Price may deviate from Redemption Value; spreads and slippage can widen in stress.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Liquidity risk:</strong> Thin pools increase price impact; large orders should consider OTC/RFQ routes.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Regulatory risk:</strong> Laws and interpretations can change, affecting access, features, or disclosures.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Jurisdictional limits:</strong> Access may be disabled for certain locations, entities, or wallets.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Tax treatment:</strong> Varies by jurisdiction and transaction type; consult a tax advisor.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Force majeure:</strong> Extraordinary events (e.g., carrier/vault closures, natural disasters) may temporarily affect operations.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">No deposit insurance:</strong> Tokenized assets are not bank deposits and are not FDIC- or SIPC-insured.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Fees & economics</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Primary actions:</strong> Mint/redeem fees and logistics charges are posted in the fee schedule; these are separate from any trading-venue fees.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Secondary trading:</strong> AMMs/CEXs may charge their own venue fee; any program-level swap fee (if enabled) and its distribution policy are published and change-logged.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Transparency & reporting (what we&apos;ll publish)</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Addresses & contracts:</strong> Canonical pool(s), treasury/program wallets, and reward contracts.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Metrics:</strong> TVL, depth, spreads, volume, fee inflows by bucket, buyback/burn activity, and Risk Fund balance—machine-readable where possible.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Attestations:</strong> Reserve/holding reports and third-party attestations on a recurring cadence.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Status & notices:</strong> A public status page for incidents, pauses, and parameter changes.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Disclosures & contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">No promises:</strong> Tokenized assets are experimental financial infrastructure; outcomes are not guaranteed.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Conflicts & affiliates:</strong> Any material conflicts (e.g., market-making or affiliated venues) will be disclosed.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Questions & reports:</strong> Contact compliance@summitbullion.io for eligibility questions, or security@summitbullion.io to confidentially report a vulnerability.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] text-sm font-inter">
              <strong className="text-[#141722]">Bottom line:</strong> Tokenized assets only work at scale if redemption, transparency, and controls are real—not marketing. Our proposed model centers redemption, discloses risks in plain English, and publishes the data and change logs users need to make informed decisions.
            </p>
          </div>
        </div>
      ),

      'tokens-sbgold': (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] leading-relaxed font-inter">
              <strong className="text-[#141722]">Proposed Architecture:</strong> Details below reflect our proposed design and may evolve with legal, security, and market feedback. SBGOLD is not live yet.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Snapshot</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Type:</strong> Redemption-first, 1:1 gold-backed digital unit</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Status:</strong> Planned (not live)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Backed by:</strong> Allocated gold held in a segregated SPV/Trust (separate from corporate assets)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Primary actions:</strong> Mint against allocated metal; Redeem to deliverable metal under posted terms</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Not:</strong> Equity, debt, or a promise of returns</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">What SBGOLD represents</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">1:1 claim design:</strong> Each unit is intended to map to specific, allocated gold held under professional custody.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Mint/Burn parity:</strong> Tokens mint only when metal is allocated and burn on redemption so on-chain supply tracks reserves.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Two prices shown:</strong> Redemption Value (what the unit redeems for, net posted fees) and Market Price (Price to Mint).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Backing, custody & transparency (proposed)</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Allocated & segregated:</strong> Inventory tagged to the program; tracked at lot/serial where applicable.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Vaulting & insurance:</strong> U.S. vault partners, dual-control procedures, insured while in custody.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Proof-of-Reserves:</strong> Periodic bar-lists/holding reports, supply parity checks, and third-party attestations.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Public addresses:</strong> Program/treasury addresses and mint/burn activity visible on-chain.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Mint & Redeem (primary flow)</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Eligibility:</strong> KYC/AML-gated; permitted jurisdictions; wallet screening as applicable.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Fees (proposed):</strong> 1.0% mint and 1.0% redeem (belong to the SPV/Trust), plus posted logistics/shipping fees for redemption.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Formats & minimums:</strong> Published bar/coin formats, minimum redemption amounts, and lead times.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Process:</strong> Request → compliance & allocation → confirm (burn before ship) → insured, discreet delivery with tracking/signature rules.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Secondary markets (trading flow)</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Canonical pools:</strong> SBGOLD/approved pairs listed with official addresses.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Venue fee (DEX):</strong> ~0.50% set by the exchange, paid to LPs (not program revenue).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Program swap fee (&quot;token tax&quot;):</strong> 1.00% on secondary swaps, distributed per the published policy (see Rewards & Transparency).</span>
              </li>
            </ul>

            <div className="mt-4 space-y-3">
              <div className="bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-lg p-4">
                <h5 className="text-[#141722] font-medium text-sm mb-2 font-inter">Phase A (bootstrap):</h5>
                <p className="text-[#7c7c7c] text-xs font-inter">
                  50% LP Rewards, 27.5% Protocol Treasury, 10% Team/Ops, 5% Future Rewards Reserve, 5% Legacy Support Reserve, 2.5% Risk Fund.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-lg p-4">
                <h5 className="text-[#141722] font-medium text-sm mb-2 font-inter">Phase B (long-term):</h5>
                <p className="text-[#7c7c7c] text-xs font-inter">
                  35% Treasury, 25% LP Rewards (if enabled), 15% Team/Ops, 10% Legacy Support Reserve, 10% Future Incentives Reserve, 5% Risk Fund.
                </p>
              </div>
            </div>

            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Peg health:</strong> Redemption serves as the economic anchor; treasury/risk controls and market-maker relationships may be used to maintain orderly markets (see Markets & Liquidity Mechanics).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">What SBGOLD is not</h4>
            <ul className="space-y-2">
              <li className="text-[#7c7c7c] text-sm font-inter">• Not equity or debt of Summit Bullion Inc. or any affiliate.</li>
              <li className="text-[#7c7c7c] text-sm font-inter">• No dividends or profit share.</li>
              <li className="text-[#7c7c7c] text-sm font-inter">• No claim on corporate assets; backing sits in a segregated vehicle.</li>
              <li className="text-[#7c7c7c] text-sm font-inter">• No investment advice implied.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Key risks (summary)</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Smart-contract/venue risk:</strong> AMMs and token contracts carry non-zero risk.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Market/peg risk:</strong> Market Price can deviate from Redemption Value; spreads and slippage vary with liquidity.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Custody/logistics risk:</strong> Vault or carrier disruptions can delay redemptions.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Regulatory/tax:</strong> Access and treatment vary by jurisdiction; users should consult advisors.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] text-sm font-inter">
              <strong className="text-[#141722]">Bottom line:</strong> SBGOLD is designed to bring gold to modern rails without compromising redemption—clear backing, visible reserves, and a straightforward path from digital unit to deliverable metal.
            </p>
          </div>
        </div>
      ),

      'tokens-zzzz': (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Zzzz — Legacy Token (Live)</h4>
            <p className="text-[#7c7c7c] text-sm mb-3 font-inter">
              <strong className="text-[#141722]">Contract Address:</strong> <a href="https://dexscreener.com/solana/5mXL4MPYzSgbKe74Ufpw3xgxtzPmch54wSdYUR4dxZSi" className="text-[#ffb546] hover:underline" target="_blank" rel="noopener noreferrer">5mXL4MPYzSgbKe74Ufpw3xgxtzPmch54wSdYUR4dxZSi</a>
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter">
              <strong className="text-[#141722]">Positioning:</strong> Zzzz is our legacy community token. It recognizes early supporters and provides a bridge into the broader Summit Bullion ecosystem. It is not equity, not a claim on company profits, and carries no promise of returns.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Snapshot</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Type:</strong> Legacy utility/alignment token</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Status:</strong> Live</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Primary role:</strong> Legacy alignment, ecosystem support via policy-driven buyback/burn when enabled via corporate flywheel.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Does not provide:</strong> Equity, dividends, or ownership in any Summit Bullion entity</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Background & Why It Exists</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Continuity:</strong> Zzzz predates our new architecture and serves as a recognition layer for early community members. An original token paying homage to our founder&apos;s X handle Sleeperbot. Carrying over our original founder token to our new architecture shows our commitment to our holders and community.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Alignment:</strong> Where policy permits, we direct a small, transparent share of secondary-market program flows to buyback and burn Zzzz, reinforcing long-term alignment without creating profit expectations.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">How It Fits the Ecosystem (Proposed Policy)</h4>
            <p className="text-[#7c7c7c] text-sm mb-4 font-inter">
              <strong className="text-[#141722]">Source of support:</strong> A portion of the program-level swap fee (1.00% on designated secondary-market swaps) may be allocated to Zzzz buyback/burn according to the published fee-split policy.
            </p>
            
            <div className="space-y-3 mb-4">
              <p className="text-[#7c7c7c] text-sm font-inter font-semibold">Two phases for clarity (applies to swap-fee only; venue fees are separate):</p>
              <div className="bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-lg p-4">
                <p className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Phase A (Bootstrap):</strong> 5% of the 1.00% swap-fee to Zzzz (support bucket).</p>
              </div>
              <div className="bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-lg p-4">
                <p className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Phase B (Long-term):</strong> 10% of the 1.00% swap-fee to Zzzz Buyback + Burn.</p>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Venue fees:</strong> Exchange/DEX venue fees (e.g., ~0.50%) are paid to LPs by the venue and do not fund Zzzz. LP tokens have been burned from existence highlighting our commitment to carry on the legacy.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Primary fees separate:</strong> Mint/Redeem fees from Tokenized Assets belong to the issuing vehicle and do not fund Zzzz.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Intended Use & Utility (Plain English)</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Legacy alignment:</strong> Periodic buyback/burn (when policy is active) supports token scarcity and acknowledges early participants.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Access surface:</strong> From time to time, Zzzz may be recognized in allowlists, promos, or legacy-holder perks. Any such uses are announced in advance and are not guaranteed.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">No requirement:</strong> Holding Zzzz is not required to purchase metals or to interact with tokenized commodities.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Transparency We Commit To</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Public addresses:</strong> Canonical Zzzz contract and any buyback addresses listed on the Token Registry page.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Receipts:</strong> Tx hashes for buyback/burn events, with timestamps and amounts.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Metrics:</strong> Periodic summaries of swap-fee inflows by bucket and Zzzz burns (if active).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Change log:</strong> Any update to percentages, pauses, or sunsets is timestamped with a plain-English rationale.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">What Zzzz Is Not</h4>
            <ul className="space-y-2">
              <li className="text-[#7c7c7c] text-sm font-inter">• Not equity or debt of Summit Bullion Inc. or any affiliate.</li>
              <li className="text-[#7c7c7c] text-sm font-inter">• No profit share or dividend.</li>
              <li className="text-[#7c7c7c] text-sm font-inter">• No redemption right into metals or cash.</li>
              <li className="text-[#7c7c7c] text-sm font-inter">• No governance rights (separate from any future program features).</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Risks & Disclosures (Read This)</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Market risk:</strong> Price can be volatile and may go to zero.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Policy risk:</strong> Buyback/burn allocations can change, pause, or end; past activity does not imply future activity.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Smart-contract & venue risk:</strong> On-chain contracts and DEX venues carry exploit and operational risks.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Eligibility:</strong> Access to any perks may be limited by jurisdiction, compliance review, or wallet status.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] text-sm font-inter">
              <strong className="text-[#141722]">TL;DR:</strong> Zzzz is our live legacy token—a community alignment layer supported (when active) by a small, transparent share of secondary-market program flows via buyback and burn. It&apos;s not equity and carries no promises, but it keeps early supporters connected as we scale the ecosystem.
            </p>
          </div>
        </div>
      ),

      'tokens-sbx': (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] leading-relaxed font-inter">
              <strong className="text-[#141722]">Positioning:</strong> SBX is a rewards token intended to compensate liquidity providers (LPs) in our designated pools. It is not equity, not a claim on company profits, and carries no promise of returns. Launch timing and details remain proposed and subject to legal/security review.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Snapshot</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Type:</strong> Rewards token for LP incentives</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Status:</strong> Planned (not live)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Primary role:</strong> Distribute LP incentives funded from the program-level 1.00% swap fee (see fee policy)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Does not provide:</strong> Equity, dividends, or redemption rights into metals or cash</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Where rewards come from (proposed)</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Source:</strong> The 1.00% program swap fee on secondary-market trades.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Buckets (for context):</strong> A published policy allocates that 1.00% across LP Rewards, Treasury, Team/Ops, Risk, and other reserves.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">LP Rewards bucket:</strong> When SBX is live, LP incentives are paid primarily in SBX out of the LP Rewards portion.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Pre-launch accrual:</strong> Before SBX launches, a small reserve within the fee policy may accrue to fund initial liquidity and SBX rewards at TGE (timing/percentages published on the policy page).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">How LPs earn SBX (proposed)</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Provide liquidity in the canonical pools (within eligible jurisdictions).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Earn pro-rata:</strong> Rewards accrue based on your share of pool liquidity and time provided.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Claim on-chain:</strong> SBX rewards are claimable via a verified UI or directly from reward contracts.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Venue fees are separate:</strong> DEX venue fees (e.g., ~0.50%) are paid by the venue to LPs in addition to SBX incentives and are not program/corporate revenue except for the corporate owned LP fees received pro-rata.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Distribution mechanics (proposed)</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Emissions cadence:</strong> Rewards accrue and become claimable on a published schedule (e.g., block-by-block or daily).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Adjustable rates:</strong> Reward rates can be increased/decreased (and even paused) based on liquidity depth and market conditions; changes are announced and change-logged.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Optional vesting/boosts:</strong> The program may use light vesting or duration boosts to encourage longer-term liquidity (details published prior to activation).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Transparency we commit to</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Public addresses:</strong> SBX contract, reward contracts, and canonical pool addresses published on the Token Registry page.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Real-time metrics:</strong> Current reward APR (if enabled), pool TVL/depth, and 24h/7d volume.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Periodic reports:</strong> Swap-fee inflows by bucket; SBX distributed (period totals); any buyback/burn events with tx hashes.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Change log:</strong> Timestamped updates to reward rates, toggles, or reserves with plain-English rationale.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Eligibility & access</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Compliance:</strong> Participation in LP provision requires KYC/AML checks and is restricted in certain jurisdictions or to certain wallets.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">No requirement:</strong> You do not need to hold SBX to buy metals or use tokenized assets; SBX is strictly a rewards instrument.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">What SBX is not</h4>
            <ul className="space-y-2">
              <li className="text-[#7c7c7c] text-sm font-inter">• Not equity or debt of Summit Bullion Inc. or any affiliate.</li>
              <li className="text-[#7c7c7c] text-sm font-inter">• No profit share or dividend.</li>
              <li className="text-[#7c7c7c] text-sm font-inter">• No redemption right into metals or cash.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Risks & disclosures (read this)</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Variable rewards:</strong> Emissions depend on market volume, depth, and policy; past rates don&apos;t guarantee future rates.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Smart-contract & venue risk:</strong> AMMs and reward contracts carry non-zero risk.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Market risk:</strong> SBX&apos;s market price may be volatile and could go to zero.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Policy changes:</strong> Reward rates, buckets, or accrual reserves can change, pause, or end—updates will be published.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <p className="text-[#7c7c7c] text-sm font-inter">
              <strong className="text-[#141722]">TL;DR:</strong> SBX is our planned LP rewards token, funded from the 1.00% swap-fee distribution allocation and paid pro-rata to liquidity providers. It&apos;s not equity and carries no promises—just transparent, on-chain incentives to deepen and stabilize liquidity.
            </p>
          </div>
        </div>
      ),

      'whitepaper-history': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Advanced Financial Technologies LLC (AFT) was formed in 2023 as the operating hub for projects we would incubate and scale. The through-line from day one has been simple: build useful financial products, learn fast, and graduate only what we can deliver with integrity. That arc took us from Forex automation to early Web3 experiments, and ultimately to a physical-first precious-metals business laying the foundation for redemption-first digital commodities.
          </p>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">2023 — Formation and the first build</h4>
              <p className="text-[#7c7c7c] text-sm font-inter mb-3">
                We began with MetaTrader-focused Forex algo tools. The early launch confirmed demand, but it also exposed a gap: our core engineer was world-class in FX and MT4, not crypto. As Telegram trading bots caught fire, we explored a pivot to Web3.
              </p>
              <p className="text-[#7c7c7c] text-sm font-inter">
                A contractor we engaged to bridge that gap took months of payments and then admitted the work was beyond their ability, leaving us with sunk costs and no production code. It was a hard lesson in vendor diligence, milestone-based payouts, and never concentrating execution risk in a single contributor.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">May 2024 — Zzzz goes live</h4>
              <p className="text-[#7c7c7c] text-sm font-inter mb-3">
                We kept the community engaged through Spaces and shipped what we controlled. In May 2024 we launched Zzzz, an SPL community token on Solana. We wrote our own presale contract, added liquidity to Raydium, and burned the LP tokens to demonstrate commitment.
              </p>
              <p className="text-[#7c7c7c] text-sm font-inter">
                The immediate concept was a Telegram off-ramp that could convert token balances into physical gold shipped to a customer&apos;s door—an early expression of the &quot;digital meets deliverable&quot; idea that still guides us.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">Pivot to physical—on purpose</h4>
              <p className="text-[#7c7c7c] text-sm font-inter mb-3">
                Real traction emerged not from trading bots, but from wholesale metals relationships. We secured our first refinery/distributor agreement and stood up a v1 storefront with live inventory. Early excitement briefly pushed the community token to ~$400k market cap, but a subsequent sell-off by a developer with allocated tokens cratered the price and left us with a half-working site and &quot;rugged&quot; optics.
              </p>
              <p className="text-[#7c7c7c] text-sm font-inter">
                That episode cemented several principles we still hold: separate personnel incentives from market liquidity, remove manual bottlenecks from checkout and fulfillment, and make sure the physical operation can stand on its own.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">Rebuild and network</h4>
              <p className="text-[#7c7c7c] text-sm font-inter mb-3">
                As real-world assets (RWA) gained momentum across crypto, our vision sharpened. We went back to the ecosystem—Art Basel (Solana Week), MtnDAO in Salt Lake City, time in a hacker house—presented our roadmap, and soaked up feedback.
              </p>
              <p className="text-[#7c7c7c] text-sm font-inter">
                Operationally, we upgraded our wholesale pipeline to a partner with modern APIs for pricing and order orchestration, eliminating the manual processing that had driven delays and higher margins in v1.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">2024–2025 — Summit Bullion takes shape</h4>
              <p className="text-[#7c7c7c] text-sm font-inter mb-3">
                From three development firms referred through MtnDAO, we selected DreamFlow Labs after diligence. In parallel, we rebranded the consumer-facing business as Summit Bullion, reflecting a clear identity: a modern, U.S.-operated precious-metals shop with in-stock discipline, insured delivery, and a 10-minute price-lock at checkout—our physical-first foundation.
              </p>
              <p className="text-[#7c7c7c] text-sm font-inter mb-3">
                With counsel, we drafted tokenomics, disclosures, and process flows for a redemption-first digital rail built on segregated custody, mint/burn parity, and Proof-of-Reserves.
              </p>
              <p className="text-[#7c7c7c] text-sm font-inter">
                We also clarified carrying over and the role of Zzzz as our Legacy Token—a community alignment layer rather than equity or a profit claim. Consistent with our published fee policy, any support for Zzzz takes the form of policy-based buyback/burn funded from a limited share of the 1.00% program-level swap fee on secondary trades (when enabled and disclosed). Exchange venue fees (e.g., ~0.50%) remain with LPs, and primary mint/redeem fees accrue to the segregated issuing vehicle—not to legacy-token flows. That separation keeps corporate, SPV/Trust, and market-level economics clean.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">Where we are now</h4>
              <p className="text-[#7c7c7c] text-sm font-inter mb-3">
                Today, AFT runs the physical metals operation; Zzzz remains live as a legacy token with transparent, policy-driven support mechanics. Summit Bullion Inc. owns roughly 53% of all tokens as a corporate reserve asset. Summit Bullion Inc. is the consumer brand we&apos;re taking to market with a focus on real inventory, clear pricing, and insured delivery.
              </p>
              <p className="text-[#7c7c7c] text-sm font-inter">
                On the digital side, our tokenized-asset design is documented as proposed architecture—redemption-first, 1:1 design intent, and full transparency—ready to advance in lockstep with legal, security, and market readiness.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">What carries forward</h4>
              <p className="text-[#7c7c7c] text-sm font-inter">
                From this point on, our standards don&apos;t change: if it&apos;s listed In-Stock, it&apos;s on the shelf. Digital units must map cleanly to deliverable metal with visible Redemption Value vs Market Price. Fees and flows are documented and change-logged; reserves and actions produce public receipts. And above all, we only ship what we can stand behind—because reputation is the asset that backs everything else.
              </p>
            </div>
          </div>
        </div>
      ),

      'whitepaper-legal-structure': (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Overview (U.S. jurisdiction & compliance posture)</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              Summit Bullion is a U.S.–based organization. Our metals are vaulted and insured in the United States, and reserves are subject to independent U.S.–domiciled attestations on a recurring cadence. We design and operate the program to comply with applicable U.S. laws and regulations—including KYC/AML/OFAC screening for gated actions—while keeping customer assets segregated from corporate balance sheets through a bankruptcy-remote structure.
            </p>
            <p className="text-[#7c7c7c] text-xs font-inter italic">
              This summary is informational and may evolve with counsel and accounting guidance. Tokenized assets are not bank deposits and are not FDIC/SIPC insured.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Parent Company — Summit Bullion, Inc. (Delaware C-Corp)</h4>
            <p className="text-[#7c7c7c] text-sm mb-3 font-inter">
              <strong className="text-[#141722]">Investors enter here:</strong> U.S. holding company and commercial manager.
            </p>
            <ul className="space-y-3 text-[#7c7c7c] text-sm font-inter">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span><strong className="text-[#141722]">Role:</strong> U.S. holding company and commercial manager.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span><strong className="text-[#141722]">Ownership:</strong> Owns 100% of Advanced Financial Technologies LLC (AFT).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span><strong className="text-[#141722]">Manager to SPV/Trust:</strong> Enters a Manager Agreement with the SPV/Trust to operate the tokenized-commodity program under board-approved policies.</span>
              </li>
            </ul>
            
            <div className="mt-4 bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-lg p-4">
              <h5 className="text-[#141722] font-medium text-sm mb-2 font-inter">Corporate revenue to Parent:</h5>
              <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Cash sweeps (distributions) from AFT&apos;s net profits (physical e-commerce).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Manager Fee from the SPV/Trust for program operations (basis/rate per Manager Agreement).</span>
                </li>
              </ul>
            </div>

            <p className="text-[#7c7c7c] text-sm font-inter mt-4">
              <strong className="text-[#141722]">Jurisdiction & compliance:</strong> U.S. corporation governed by Delaware law; books, contracts, and change logs maintained for auditability. Corporate creditors do not have recourse to metal held by the SPV/Trust.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Operating Subsidiary — Advanced Financial Technologies, LLC (Florida) (&quot;AFT&quot;)</h4>
            <ul className="space-y-3 text-[#7c7c7c] text-sm font-inter">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span><strong className="text-[#141722]">Role:</strong> U.S. physical metals e-commerce operator.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span><strong className="text-[#141722]">What it does:</strong> Supplier APIs, catalog/pricing, checkout, payments, fulfillment, shipping insurance, and customer support—all U.S.–operated.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span><strong className="text-[#141722]">Revenue model:</strong> Product spread (coins/bars), physical secondary-dealer intake fees (e.g., ~2%), and disclosed pass-throughs (shipping/insurance).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span><strong className="text-[#141722]">Contracts:</strong> U.S. supplier/distributor agreements, logistics/carriers, payment processors.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span><strong className="text-[#141722]">Intercompany:</strong> Periodic distributions to the Parent; shared services billed cost-plus via an Intercompany Services Agreement.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span><strong className="text-[#141722]">IP:</strong> Storefront, ops/pricing automation, and KYC portal owned within the group and licensed intra-company per an IP schedule.</span>
              </li>
            </ul>

            <p className="text-[#7c7c7c] text-sm font-inter mt-4">
              <strong className="text-[#141722]">Regulatory stance:</strong> AFT&apos;s retail operations are designed to comply with applicable U.S. consumer, payments, sanctions, and tax rules (e.g., sales-tax collection where required). AFT is not a custodian of SPV metal.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Bankruptcy-Remote Vehicle — Gold-Backed SPV/Trust (U.S.-based; name TBD)</h4>
            <p className="text-[#7c7c7c] text-sm mb-3 font-inter">
              <strong className="text-[#141722]">Purpose:</strong> Hold allocated, segregated metal that backs tokenized units on a 1:1, redemption-first basis.
            </p>
            <p className="text-[#7c7c7c] text-sm mb-4 font-inter">
              <strong className="text-[#141722]">Core documents:</strong> U.S. trust/indenture, U.S. custodian & vault agreements, Manager Agreement, and public disclosures.
            </p>

            <div className="bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-lg p-4 mb-4">
              <h5 className="text-[#141722] font-medium text-sm mb-3 font-inter">Operations (U.S.-anchored):</h5>
              <ul className="space-y-3 text-[#7c7c7c] text-sm font-inter">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Mint/Redeem (KYC/AML-gated):</strong> Mint only against metal allocated to the program; burn on redemption before shipment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Rebalancing oracle:</strong> Protocol treasury uses reserves to allocate SBGOLD and USDC to the rebalancer program. This oracle is based off the Mint Price vs Secondary Market price. The rebalancer sells SBGOLD when Secondary market price is above mint, and buys SBGOLD when secondary market price is below mint.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Vaulting & insurance:</strong> Metal stored with U.S. vault partners under dual-control procedures; insured while in custody.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Transparency:</strong> Periodic bar-lists/holding reports, supply-parity checks, third-party attestations by U.S.–domiciled firms, and published on-chain addresses.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-lg p-4">
              <h5 className="text-[#141722] font-medium text-sm mb-2 font-inter">SPV revenues (not corporate by default):</h5>
              <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Mint/Redeem fees (e.g., 1.0% each, per fee schedule) and posted logistics/handling for redemption.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Rebalancer profits</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Clarifying economics (for users)</h4>
            <ul className="space-y-3 text-[#7c7c7c] text-sm font-inter">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span>DEX venue fees (e.g., ~0.50%) are set by the exchange and paid to LPs—not corporate or SPV profit.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span>Any program-level swap fee on secondary trades (if enabled) is distributed per a published policy and is not a corporate dividend.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span>Primary mint/redeem fees belong to the SPV/Trust; the Parent earns only its Manager Fee.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Controls, Compliance & Records (U.S.-aligned)</h4>
            <ul className="space-y-3 text-[#7c7c7c] text-sm font-inter">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span><strong className="text-[#141722]">Books & records:</strong> Separate ledgers for Parent, AFT, and SPV/Trust; custody tracked at lot/serial where applicable.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span><strong className="text-[#141722]">Compliance:</strong> KYC/AML/OFAC screening for gated actions; geographic and wallet-risk controls as disclosed.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span><strong className="text-[#141722]">Operational controls:</strong> Role-based access, multi-party approvals, separation of duties (mint/burn/treasury), change logs, incident response.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span><strong className="text-[#141722]">Insurance:</strong> U.S. vault insurance while in custody; shipping insurance and signature tiers per posted policy.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span><strong className="text-[#141722]">Attestations:</strong> Periodic independent attestations of reserves and program control, alongside public on-chain supply addresses.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Market Context</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-4">
              Many tokenized-gold programs use trust/SPV structures. Our edge is U.S. domicile and operations, U.S. vaulting and insurance, and U.S.–based attestations, paired with a retail-grade, in-stock physical storefront. The combination is designed to make institutional diligence and adoption simpler without compromising consumer clarity.
            </p>

            <div className="border-t border-[#ffb546]/20 pt-4 mt-4">
              <h5 className="text-[#141722] font-medium text-sm mb-3 font-inter">Bottom line:</h5>
              <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong className="text-[#141722]">Parent (DE C-Corp):</strong> U.S. holding/manager; earns Manager Fee + AFT distributions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong className="text-[#141722]">AFT (FL LLC):</strong> U.S. e-commerce operator; profits flow up to the Parent.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong className="text-[#141722]">SPV/Trust (U.S.-based):</strong> Holds backing metal in U.S. vaults, publishes attestations, collects mint/redeem fees, and remains bankruptcy-remote.</span>
                </li>
              </ul>
              <p className="text-[#7c7c7c] text-sm font-inter mt-3">
                All operations are designed to comply with applicable U.S. laws and regulations—setting us apart with a U.S.–based, audited/attested, vault-in-the-U.S. approach.
              </p>
            </div>
          </div>
        </div>
      ),

      'whitepaper-mechanisms': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            A quick look at how the physical store, tokenized units, and secondary markets fit together—from checkout to redemption.
          </p>

          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-4">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">1. Buy Physical (Site)</h4>
              <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Pay:</strong> Card / bank (ACH or wire) / crypto via Coinbase Commerce.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Fulfillment:</strong> In-stock items ship discreetly and insured to U.S. addresses (signature by value tier).</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Note:</strong> Adding to cart does not lock price; starting checkout opens a 10-minute price-lock window.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-4">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">2. Mint Digital (Tokenized Gold)</h4>
              <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Access:</strong> KYC/AML-gated; eligible jurisdictions only.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Flow:</strong> Pay USDC → mint at Redemption Value + posted 1.0% mint fee.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Backing:</strong> Metal is purchased/allocated to the U.S. SPV/Trust (segregated, audited/attested); on-chain supply mints only against allocated metal.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-4">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">3. Trade on DEX (Secondary Markets)</h4>
              <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Where:</strong> Canonical pools published (e.g., TOKEN/USDC); aggregators may route across pools.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Fees:</strong> Venue fee (typically ~0.50%) → LPs; program swap fee (&quot;token tax&quot;) 1.00% → distributed per published policy.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Anchor:</strong> Redemption Value is the economic anchor; arbitrage and treasury tools help keep market price aligned.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-4">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">4. Redeem to Physical Metal</h4>
              <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Process:</strong> Burn tokens → metal pulled, verified, packed, and insured; tracking posted.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Terms:</strong> Posted redemption fees, minimums, formats, and SLAs apply; fulfillment may batch into set windows.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Scope:</strong> U.S. shipping only at launch.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-4">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">5. Exit to USDC (Non-Physical)</h4>
              <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Flow:</strong> Swap tokens for USDC on DEX</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Note:</strong> &quot;Redemption&quot; refers to delivery of metal; non-physical exits are handled as secondary-market swaps. Physical redemptions only for &quot;Newly Minted&quot; tokens with KYC&apos;d clients.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-4">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">6. Provide Liquidity (Optional)</h4>
              <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Who:</strong> Eligible, KYC/allow-listed wallets (as policy/venue requires).</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">How:</strong> Deposit TOKEN + USDC to canonical pools; receive LP tokens.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Earnings:</strong> DEX venue fees plus program rewards (from the 1.00% swap-fee bucket) if/when enabled.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Risk:</strong> Impermanent loss; rewards and parameters can change.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span><strong className="text-[#141722]">Provenance:</strong> LP addition limited to only freshly minted tokens (no rehypothecation)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6 mt-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Compliance Guardrails (At a Glance)</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">KYC/AML/OFAC:</strong> Required for mint/redeem; wallet screening and geo-controls enforced.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">LP gating:</strong> LP eligibility and rewards require KYC/allow-listing and provenance checks.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Jurisdiction:</strong> U.S. shipping only for physical redemptions at launch; venue access may vary by location.</span>
              </li>
            </ul>
          </div>
        </div>
      ),

      'legal-compliance': (
        <div className="space-y-6">
          <h3 className="text-xl text-[#141722] mb-4 font-inter font-semibold">What We Have (in place)</h3>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Summit Bullion, Inc. (Delaware C-Corp)</strong> — parent/manager entity formed. Fundraising investors enter here.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Advanced Financial Technologies, LLC (Florida)</strong> — operating company for the physical e-commerce storefront.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <div className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Compliance program (retail & platform):</strong>
                  <ul className="mt-2 ml-4 space-y-2">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Written AML/KYC policy, OFAC screening procedures.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>U.S. domestic shipping only at launch; consumer policies (pricing, returns, disclosures) documented.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Sales-tax collection where required; basic records & retention controls. Registered sales and use tax license with the Department Of Revenue.</span>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Payments:</strong> Card/ACH/wire and crypto via Coinbase Commerce for retail checkout (no custody of customer crypto).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Operational safeguards:</strong> Discreet, insured shipments; signature thresholds by value tier; price-lock at checkout.
                </span>
              </li>
            </ul>
          </div>

          <h3 className="text-xl text-[#141722] mb-4 mt-8 font-inter font-semibold">What We&apos;re Building (and will formalize)</h3>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">SPV/Trust (U.S.)</strong> to custody allocated, segregated gold for the tokenized program; Manager Agreement with the parent; bankruptcy-remote documentation.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Attestations & Proof-of-Reserves cadence:</strong> Bar-lists/holding reports and independent attestations.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Licensing posture:</strong> MTL strategy for mint/redeem flows (partner coverage and/or phased state licensing, subject to counsel&apos;s determination).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Smart-contract/security audits:</strong> Third-party audits, timelocks where appropriate, emergency-pause runbook, and public change-log.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">DEX policy controls:</strong> Eligibility gates (KYC/allow-listing where required)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Security & privacy hardening:</strong> Key management standards (MPC/qualified custodian for program treasuries), vendor risk reviews, privacy policy & data-retention schedules.
                </span>
              </li>
            </ul>
          </div>

          <h3 className="text-xl text-[#141722] mb-4 mt-8 font-inter font-semibold">Security, Custody & Risk (high-level controls)</h3>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Custody (metal).</strong> Allocated bar-lists at U.S. depositories; lot/serial tracking (where applicable); dual-control access; vault insurance while in custody.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Program treasuries (digital).</strong> MPC or qualified custodian accounts for USDC/L1 assets; role-based access, approvals, and audit trails.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Smart contracts.</strong> Independent audits prior to launch; monitored upgrade keys; timelocks where feasible; circuit breakers (pause) for incidents; public change-log.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Operational risk.</strong> Published SLAs (allocation, packing, label creation); discreet, insured shipping; incident-response playbooks; status page for outages/pauses.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Market risk.</strong> Redemption-first design; visible Redemption Value vs. Market Price; transparent fee policy; treasury tools and Risk Fund parameters published.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Regulatory risk.</strong> External counsel engagement; proactive filings; geo-fencing and wallet screening where required; continuous monitoring for rule changes.
                </span>
              </li>
            </ul>
          </div>

          <h3 className="text-xl text-[#141722] mb-4 mt-8 font-inter font-semibold">Basel III / Institutional Orientation (clarification)</h3>

          <div className="bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-2xl border border-[#e5ddd0] p-6">
            <p className="text-[#7c7c7c] text-sm font-inter leading-relaxed">
              We do not represent tokenized gold as High-Quality Liquid Assets (HQLA) under current Basel III LCR rules. Institutions must consult their regulators and internal policies. Our design—allocated, unencumbered, segregated metal with clear redemption mechanics and transparent attestations—aims to align with high-quality custody principles should policy evolve or national discretion frameworks expand. Until then, tokenized units are treated as program instruments, not bank deposits and not FDIC/SIPC insured.
            </p>
          </div>

          <h3 className="text-xl text-[#141722] mb-4 mt-8 font-inter font-semibold">Disclosures (plain English)</h3>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Not deposits; no guarantees.</strong> Tokenized assets are not bank deposits, not FDIC/SIPC insured, and carry market/operational risk.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Segregation.</strong> Corporate creditors should not have recourse to SPV/Trust metal under the bankruptcy-remote structure (see program documents).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Eligibility.</strong> Token mint/redeem requires KYC/AML/OFAC checks and may be restricted by jurisdiction or wallet status.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Fees.</strong> Primary mint/redeem fees belong to the SPV/Trust; DEX venue fees are paid to LPs; any program-level swap fee is distributed per the published policy and is not a corporate dividend.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">
                  <strong className="text-[#141722]">Taxes.</strong> We collect sales tax where required on retail shipments; users should seek tax advice for reporting obligations.
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),

      'roadmap': (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">What We Have</h3>
            <p className="text-[#7c7c7c] leading-relaxed font-inter mb-4">
              Current operational capabilities and infrastructure already in place.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
                <h4 className="text-[#141722] font-semibold mb-2 font-inter">Legal Foundation</h4>
                <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                  <li>• AFT LLC (Florida) operational</li>
                  <li>• FinCEN AML/KYC program</li>
                  <li>• OFAC screening systems</li>
                  <li>• Tax registrations complete</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
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
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border-l-4 border-[#ffb546] p-6">
                <h4 className="text-[#141722] font-semibold mb-1 font-inter">Complete Rebrand</h4>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  Finalize Summit Bullion rebrand with DreamFlow Labs; launch new website
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border-l-4 border-[#ffb546] p-6">
                <h4 className="text-[#141722] font-semibold mb-1 font-inter">Expand Physical Catalog</h4>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  Optimize checkout experience with Alchemy Pay integration
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border-l-4 border-[#ffb546] p-6">
                <h4 className="text-[#141722] font-semibold mb-1 font-inter">KYC Pipeline</h4>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  Finalize compliance playbooks (AML/SAR/OFAC) and onboarding flow
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Next 12 Months</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
                <h4 className="text-[#141722] font-semibold mb-2 font-inter">Q1-Q2 2025</h4>
                <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                  <li>• SDK integrations (Helio, WooCommerce, Shopify)</li>
                  <li>• SPV/Trust documentation and vendor selection</li>
                  <li>• Security audits for smart contracts</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
                <h4 className="text-[#141722] font-semibold mb-2 font-inter">Q2-Q3 2025</h4>
                <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                  <li>• Establish SPV/Trust with custodian agreements</li>
                  <li>• Launch SB-GOLD minting on Solana</li>
                  <li>• First DEX liquidity pool goes live</li>
                  <li>• Monthly attestation program begins</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
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
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">Growth Milestones</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span className="text-[#7c7c7c] text-sm font-inter">$100M tokenized gold outstanding across multiple venues</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span className="text-[#7c7c7c] text-sm font-inter">Basel III HQLA-ready posture for institutional adoption</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span className="text-[#7c7c7c] text-sm font-inter">Bank pilot programs initiated</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span className="text-[#7c7c7c] text-sm font-inter">Cross-chain bridges (XRPL, ETH, SUI)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                  <span className="text-[#7c7c7c] text-sm font-inter">Top-3 global tokenized gold platform by transparency</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl text-[#141722] mb-3 font-inter font-semibold">Future Developments</h3>
            <p className="text-[#7c7c7c] leading-relaxed font-inter mb-6">
              Long-term vision for platform evolution, product offerings, and ecosystem expansion across multiple innovation tracks.
            </p>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-[#141722] font-semibold font-inter">Track 1 — Mobile App</h4>
                  <span className="text-xs text-[#7c7c7c] bg-[#fcf8f1] px-2 py-1 rounded font-inter">MVP: 6-9 months</span>
                </div>
                <p className="text-[#7c7c7c] text-sm mb-3 font-inter">
                  iOS/Android app tied to each user&apos;s KYC account: on-chain SB-GOLD wallet, LP range/position tools, optional perps venue integration, 
                  secured lending against SB-GOLD, in-app physical metals checkout, Cash App–style P2P, and virtual payment cards.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-[#141722] text-sm font-semibold mb-2 font-inter">User Value</h5>
                    <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                      <li>• One screen to hold SB-GOLD, LP, buy physicals, and P2P pay</li>
                      <li>• Borrow against SB-GOLD instead of redeeming</li>
                      <li>• See Redemption Value vs. Market Price in real-time</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-[#141722] text-sm font-semibold mb-2 font-inter">Dependencies</h5>
                    <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                      <li>• SPV live, monthly attestations</li>
                      <li>• Token-2022 transfer fees wired</li>
                      <li>• Custody & liquidation playbooks</li>
                      <li>• Card issuer/BIN sponsor partnerships</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-[#141722] font-semibold font-inter">Track 2 — Secondary Dealer (Buy-Side Intake)</h4>
                  <span className="text-xs text-[#7c7c7c] bg-[#fcf8f1] px-2 py-1 rounded font-inter">Pilot: 3-5 months</span>
                </div>
                <p className="text-[#7c7c7c] text-sm mb-3 font-inter">
                  Let users sell bullion/coins to us. Mobile &quot;Google-Lens style&quot; AI recognizes bars/coins, prompts for photos/weights/assay, 
                  generates quotes, books shipping or in-store drop-off.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-[#141722] text-sm font-semibold mb-2 font-inter">Protocol Value</h5>
                    <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                      <li>• Inventory sourcing pipeline + 2% intake fee target</li>
                      <li>• Uplift on resale creates additional revenue</li>
                      <li>• More supply for marketplace expansion</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-[#141722] text-sm font-semibold mb-2 font-inter">Risk Mitigation</h5>
                    <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                      <li>• Staged payouts (escrow on receipt/assay)</li>
                      <li>• Photo/weight heuristics for fraud detection</li>
                      <li>• Blacklist patterns and compliance checks</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-[#141722] font-semibold font-inter">Track 3 — Physical/Digital Debit Cards</h4>
                  <span className="text-xs text-[#7c7c7c] bg-[#fcf8f1] px-2 py-1 rounded font-inter">Beta: 4-6 months</span>
                </div>
                <p className="text-[#7c7c7c] text-sm mb-3 font-inter">
                  Virtual/physical cards linked to user&apos;s SB-GOLD balance. At spend, auto-sell a sliver of SB-GOLD to fiat for authorization. 
                  Enables everyday spending without manual redeem/sell steps.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-[#141722] text-sm font-semibold mb-2 font-inter">Revenue Streams</h5>
                    <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                      <li>• Interchange rev-share from card transactions</li>
                      <li>• Spread on micro-sells of SB-GOLD</li>
                      <li>• Higher stickiness/MAU (monthly active users)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-[#141722] text-sm font-semibold mb-2 font-inter">Compliance</h5>
                    <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                      <li>• Card limits, KYC tiers, spend throttles</li>
                      <li>• Merchant coding rules and geo-restrictions</li>
                      <li>• Clear SoV positioning (avoid &quot;payments&quot; marketing)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-[#141722] font-semibold font-inter">Track 4 — Institutional Mint/Redeem Platform</h4>
                  <span className="text-xs text-[#7c7c7c] bg-[#fcf8f1] px-2 py-1 rounded font-inter">Console: 3-4 months</span>
                </div>
                <p className="text-[#7c7c7c] text-sm mb-3 font-inter">
                  Institutional logins, role-based access, programmatic mint/redeem, statements and audit trails designed for 
                  banks/lenders/fincos managing liquidity coverage.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-[#141722] text-sm font-semibold mb-2 font-inter">Institution Value</h5>
                    <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                      <li>• 1:1 gold exposure with redemption queue</li>
                      <li>• Monthly attestations and audit trails</li>
                      <li>• Operational rails for treasury management</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-[#141722] text-sm font-semibold mb-2 font-inter">Protocol Benefits</h5>
                    <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                      <li>• Larger ticket sizes from institutions</li>
                      <li>• Predictable mint/redeem fee flow</li>
                      <li>• Enhanced institutional credibility</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-2xl border border-[#ffb546]/20 p-6">
                <h4 className="text-[#141722] font-semibold mb-3 font-inter">Additional Ideas</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-[#ffb546] text-sm font-semibold mb-2 font-inter">Global Vault Network + Real-Time Proof-of-Reserves</h5>
                    <p className="text-[#7c7c7c] text-sm font-inter">
                      Multi-depository, multi-jurisdiction vaults with on-chain PoR oracles that stream holdings/serials & variance checks to the dashboard. 
                      De-risk single-custodian scenarios and turn transparency into a competitive moat.
                    </p>
                  </div>
                  <div>
                    <h5 className="text-[#ffb546] text-sm font-semibold mb-2 font-inter">Treasury API & Corporate Accounts</h5>
                    <p className="text-[#7c7c7c] text-sm font-inter">
                      Programmatic mint/redeem endpoints, webhooks, role-based corporate accounts, and export-grade reporting (CSV/GL mappings) for controllers. 
                      Unlocks B2B flows—miners, dealers, OTC desks, treasury teams—without manual operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),

      'support-get-help': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            We&apos;re here to help you with any questions about Summit Bullion, physical metals, or tokenized gold.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-2 font-inter">Email Support</h4>
              <p className="text-[#7c7c7c] text-sm mb-2 font-inter">support@summitbullion.com</p>
              <p className="text-[#7c7c7c] text-sm font-inter">Response time: 24-48 hours</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-2 font-inter">Discord Community</h4>
              <p className="text-[#7c7c7c] text-sm mb-2 font-inter">Join our Discord server</p>
              <p className="text-[#7c7c7c] text-sm font-inter">Community support 24/7</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-2 font-inter">Twitter/X</h4>
              <p className="text-[#7c7c7c] text-sm mb-2 font-inter">Follow for updates</p>
              <p className="text-[#7c7c7c] text-sm font-inter">@SummitBullion</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-2 font-inter">Telegram</h4>
              <p className="text-[#7c7c7c] text-sm mb-2 font-inter">Join our community</p>
              <p className="text-[#7c7c7c] text-sm font-inter">Real-time updates and support</p>
            </div>
          </div>
        </div>
      ),

      'support-faq': (
        <div className="space-y-4">
          <h3 className="text-xl text-[#141722] mb-4 font-inter font-semibold">Backing & Basics (Tokenized Assets — Proposed)</h3>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">What is a tokenized commodity backed by?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              A tokenized commodity is designed to be backed 1:1 by allocated, segregated metal held in U.S. vaults under professional custody. We publish bar-lists/holding reports and periodic third-party attestations, alongside on-chain supply addresses. We strive for Basel III alignment with all our procedures.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Is your tokenized gold live today?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Not yet. The tokenized rail is proposed architecture. We&apos;ll launch only once legal, security, and operational requirements are satisfied.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Is a tokenized commodity a stablecoin or a security?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Our design intent is a commodity/payment-style instrument with a redemption-first model—not an investment contract or deposit product. Final treatment depends on law and venue; nothing here is legal, tax, or investment advice.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">What&apos;s the difference between Market Price and Redemption Value?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              <strong className="text-[#141722]">Redemption Value:</strong> What a unit redeems for in metal under posted fees
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              <strong className="text-[#141722]">Market Price:</strong> What it trades for on exchanges.
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Arbitrage around Redemption Value helps keep markets aligned, but short-term gaps can occur.
            </p>
          </div>

          <h3 className="text-xl text-[#141722] mb-4 mt-8 font-inter font-semibold">Buying Physical Metals (Web Store)</h3>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">How do I buy physical gold or silver?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Browse the catalog, add to cart, and checkout with card, bank transfer (ACH/wire), or crypto via Coinbase Commerce. We ship to U.S. addresses with discreet, insured delivery.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Do I need KYC to buy physical metals?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Yes. Standard retail checkout require different levels of KYC for spending levels of purchases.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">How does price-lock work at checkout?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              Adding to cart does not lock price. Starting Checkout opens a 10-minute price-lock window (countdown shown).
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter mb-2">
              <strong className="text-[#141722]">Card/Crypto:</strong> Price is final once payment is authorized/confirmed within the window.
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter">
              <strong className="text-[#141722]">ACH/Wire:</strong> Price is final when funds land; if the lock expires before payment completes, you&apos;ll get a fresh quote by restarting checkout.
            </p>
          </div>

          <h3 className="text-xl text-[#141722] mb-4 mt-8 font-inter font-semibold">Shipping & Insurance</h3>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Where do you ship?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              U.S. only at launch. (International options may be added later.)
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">How fast is delivery and is it insured?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Most orders arrive in 2–7 business days. All shipments are fully insured until the carrier&apos;s delivery scan. Signature rules apply by value tier. Packaging is discreet; labels never reference bullion.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">What if a package is lost or damaged?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
                Contact us immediately (damage within 3 business days). We&apos;ll handle the claim with our insurer; if we deem it lost/damaged in transit, we will refund or re-ship at our discretion. Insurance is void if you instruct the carrier to leave it unattended or with a third party.
            </p>
          </div>

          <h3 className="text-xl text-[#141722] mb-4 mt-8 font-inter font-semibold">Token Actions (Proposed: Mint, Redeem, Trade)</h3>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Do I need KYC for tokenized assets?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Yes, for mint and redeem (and, if policy/venue requires, for LP incentives). KYC includes AML/OFAC screening.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">What are the mint/redeem fees?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Proposed: 1.0% mint and 1.0% redeem (belong to the SPV/Trust), plus posted logistics/shipping on physical redemption. A KYC badge is proposed at $25 per wallet (one-time; subject to renewal if required by policy).
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Can I redeem for cash (USDC) instead of metal?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              We treat &quot;redemption&quot; as delivery of metal. To exit to USDC, you sell on the exchange (DEX/OTC) at the market price. (For larger sizes, we may offer approved OTC/RFQ.)
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">How do trading fees work on DEX?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              Two layers:
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter mb-2">
              • Venue fee (typically ~0.50%) set by the DEX and paid to LPs.
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              • Program swap fee (&quot;token tax&quot;) proposed at 1.00%, distributed per a published policy (e.g., LP rewards, treasury, team/ops, risk).
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Neither is a corporate dividend.
            </p>
          </div>

          <h3 className="text-xl text-[#141722] mb-4 mt-8 font-inter font-semibold">Liquidity Providing (LP) — Optional</h3>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Who can provide liquidity?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Eligible participants in allowed jurisdictions. KYC/allow-listing for providing liquidity and for rewards.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">What do LPs earn?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              LPs receive venue fees (set by the DEX) and may receive program rewards (from the 1.00% swap-fee bucket) when enabled—both pro-rata to provided liquidity.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">What are the risks for LPs?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Impermanent loss, changing reward rates, and smart-contract/venue risk. Review venue docs, our fee policy, and the risk disclosures before providing liquidity.
            </p>
          </div>

          <h3 className="text-xl text-[#141722] mb-4 mt-8 font-inter font-semibold">Compliance, Jurisdiction & Safety</h3>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Where are you based and where is metal stored?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              We are U.S.–based. Metal is vaulted and insured in the United States, with periodic U.S.–domiciled attestations.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Are tokenized assets FDIC/SIPC insured?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              No. Tokenized assets are not bank deposits and not FDIC/SIPC insured.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">What happens if the company goes bankrupt?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              The tokenized program is designed to be held in a bankruptcy-remote SPV/Trust. Backing metal is intended to be segregated from corporate assets; creditor claims against corporate entities should not reach SPV metal. See program documents for details.
            </p>
          </div>

          <h3 className="text-xl text-[#141722] mb-4 mt-8 font-inter font-semibold">Taxes & Records</h3>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Do you collect sales tax on physical metals?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              We collect sales tax where required by state law. Exemptions vary by state and product; checkout will display what&apos;s due based on your ship-to address.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Do you give tax advice?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              No. Please consult a tax professional. You can download receipts and order history from your account for record-keeping.
            </p>
          </div>

          <h3 className="text-xl text-[#141722] mb-4 mt-8 font-inter font-semibold">Odds & Ends</h3>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Which chains/wallets are supported?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Supported chain(s) and wallets will be announced at launch and listed on the Token Registry page.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Do you offer storage for customers?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              At launch we ship to you. Long-term storage may be considered later.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Is there international shipping or redemption?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Not at launch. We&apos;ll update docs if/when that changes.
            </p>
          </div>
        </div>
      ),

      'legal-terms': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] text-sm leading-relaxed font-inter italic mb-6">
            Last updated: Nov 1, 2025
          </p>
          
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of websites, apps, and services operated by Summit Bullion, Inc. (&quot;Summit Bullion,&quot; &quot;we,&quot; &quot;us,&quot; &quot;our&quot;). By accessing or using our services, you agree to these Terms. If you do not agree, do not use the services.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Who we are</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              Summit Bullion is a U.S.–based precious-metals retailer (through its operating subsidiary) and developer of a proposed tokenized-asset program. Metal is vaulted and insured in the United States. We operate subject to applicable U.S. laws and regulations, including KYC/AML/OFAC where required.
            </p>
            <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
              <li><strong className="text-[#141722]">Parent:</strong> Summit Bullion, Inc. (Delaware C-Corp)</li>
              <li><strong className="text-[#141722]">Operator (retail):</strong> Advanced Financial Technologies, LLC (Florida)</li>
              <li><strong className="text-[#141722]">Contact:</strong> support@summitbullion.io | compliance@summitbullion.io | legal@summitbullion.io</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Services (current vs. proposed)</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              <strong className="text-[#141722]">Live now (retail):</strong> Sale and fulfillment of physical precious metals to U.S. addresses; checkout by card, bank transfer (ACH/wire), or crypto via Coinbase Commerce.
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              <strong className="text-[#141722]">Proposed (tokenized assets):</strong> A redemption-first, 1:1 backed commodity token program operated via a U.S. bankruptcy-remote SPV/Trust. Token features, eligibility, and fees are subject to separate, program-specific disclosures and may launch later.
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter">
              We may update, suspend, or discontinue any part of the services at any time.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Eligibility & accounts</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              You must be 18+ and capable of forming a binding contract. Where identity verification is required (e.g., for token mint/redeem or LP participation), you agree to provide accurate information and to screening consistent with AML/KYC/OFAC. You are responsible for your account, credentials, wallet security, and for restricting access to your devices.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Pricing, premiums & price-lock (retail)</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-2">
              Prices update with spot markets and product-specific premiums.
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              <strong className="text-[#141722]">Cart is not a lock.</strong> Starting Checkout opens a 10-minute price-lock window (countdown shown).
            </p>
            <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter mb-3">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Card/Crypto:</strong> Price is final once payment is authorized/confirmed within the window.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">ACH/Wire:</strong> Price is final when funds post. If funds arrive after the lock expires, the order will re-quote at the then-current price.</span>
              </li>
            </ul>
            <p className="text-[#7c7c7c] text-sm font-inter">
              We may cancel any order for suspected fraud, payment failure, pricing or inventory errors, or policy violations.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Payments</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              <strong className="text-[#141722]">Cards/Bank:</strong> You authorize us (and our processors) to debit your account for order totals, taxes, and shipping. Chargebacks for fulfilled, insured shipments may be contested.
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter">
              <strong className="text-[#141722]">Crypto:</strong> Payments are processed via Coinbase Commerce; you are responsible for sending to the correct address, chain, and asset. On-chain payments are final. We do not custody your crypto.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Shipping, risk & insurance (retail)</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              We ship to U.S. addresses only at launch. All shipments are discreet and fully insured until the carrier&apos;s delivery scan; a signature may be required by value tier.
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              If a package is lost or arrives damaged, contact us immediately (damage must be reported within 3 business days). Insurance is void if you instruct carriers to leave packages unattended or with third parties (e.g., doorman, neighbor, mailbox store).
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Title and risk of loss pass upon carrier delivery scan.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Returns & refunds (retail)</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Unless otherwise required by law, unopened products in original packaging may be returned within 7 days of delivery with an RMA. We do not accept returns due to market price changes. Refunds exclude original shipping and may require inspection; we reserve the right to refuse returns that fail authenticity, tamper, or condition checks.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Taxes</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              We collect sales/use tax where required by law. You are responsible for any other tax reporting and liabilities arising from your purchases or token transactions.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Tokenized assets (program terms—summary)</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              The tokenized program is proposed and may launch under separate, program-specific terms. Key principles (for orientation only):
            </p>
            <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Redemption-first:</strong> Tokens intend to map 1:1 to allocated, segregated metal held by a U.S. SPV/Trust; tokens mint only against allocated reserves and burn on redemption.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">KYC-gated actions:</strong> Mint and redeem will require KYC/AML/OFAC and may be limited by jurisdiction.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Secondary trading:</strong> DEXs may charge a venue fee (e.g., ~0.50%) paid to LPs; the program may assess a 1.00% swap fee on designated pools and distribute it per published policy.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">No cash redemptions:</strong> To exit to USDC, users would sell on secondary markets (DEX/OTC). &quot;Redemption&quot; refers to delivery of metal under posted fees/SLAs.</span>
              </li>
            </ul>
            <p className="text-[#7c7c7c] text-sm font-inter mt-3">
              Final program terms, disclosures, fees, and eligibility will control at launch.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Prohibited uses</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-2">
              You agree not to:
            </p>
            <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>violate laws/sanctions</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>engage in fraud, market manipulation, wash trading, or abuse of promotions</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>interfere with security or operations</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>use bots or scrapers without consent</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>reship internationally to restricted locations</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>use the services for unlawful purposes</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Intellectual property & feedback</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              All site content, marks, and software are owned by Summit Bullion or its licensors. You grant us a royalty-free license to use feedback for any purpose.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Disclaimers</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Services and content are provided &quot;as is&quot; and &quot;as available.&quot; We make no warranties of merchantability, fitness, non-infringement, or error-free operation. Tokenized assets are not bank deposits and are not FDIC or SIPC insured. We do not provide investment, legal, or tax advice.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Limitation of liability</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              To the maximum extent permitted by law, Summit Bullion and its affiliates will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits/revenue/data, arising from or related to the services, even if advised of the possibility.
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Our aggregate liability will not exceed the amount you paid to us for the services giving rise to the claim in the 12 months prior. Some jurisdictions do not allow certain limitations; those limits apply to the extent permitted.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Indemnification</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              You agree to indemnify and hold harmless Summit Bullion, its affiliates, officers, employees, and agents from claims, damages, losses, and expenses (including reasonable attorneys&apos; fees) arising from your use of the services, violation of these Terms, or violation of any law or rights of a third party.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Force majeure</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              We are not responsible for delays or failures caused by events beyond our reasonable control (e.g., carrier disruptions, natural disasters, power/network failures, acts of war, regulatory actions).
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Modifications; termination</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              We may update these Terms at any time; changes take effect when posted. Continued use after changes means you accept them. We may suspend or terminate access for any violation of these Terms, suspected fraud, or legal/compliance reasons.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Dispute resolution; governing law</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              These Terms are governed by the laws of the State of Delaware, without regard to conflicts of laws principles. Binding arbitration and class-action waiver may apply and will be specified in the final, counsel-approved version. For now, any permitted court action must be brought in state or federal courts located in Delaware, and you consent to jurisdiction and venue there.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Miscellaneous</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              These Terms are the entire agreement between you and us regarding the services and supersede prior agreements. If any provision is unenforceable, the remainder remains in effect. You may not assign your rights without our consent. Our failure to enforce a provision is not a waiver.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Contact</h4>
            <div className="space-y-1 text-[#7c7c7c] text-sm font-inter">
              <p><strong className="text-[#141722]">Support:</strong> support@summitbullion.io</p>
              <p><strong className="text-[#141722]">Compliance:</strong> compliance@summitbullion.io</p>
              <p><strong className="text-[#141722]">Legal:</strong> legal@summitbullion.io</p>
            </div>
          </div>
        </div>
      ),

      'legal-privacy': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] text-sm leading-relaxed font-inter italic mb-6">
            Last updated: October 2025
          </p>
          
          <p className="text-[#7c7c7c] leading-relaxed font-inter mb-4">
            Summit Bullion, Inc. (&quot;Summit Bullion,&quot; &quot;we,&quot; &quot;us,&quot; &quot;our&quot;) is committed to protecting your privacy. This policy explains what we collect, how we use it, who we share it with, and the choices you have. It applies to our websites, apps, and services (collectively, the &quot;Services&quot;).
          </p>

          <p className="text-[#7c7c7c] text-sm leading-relaxed font-inter bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-xl border border-[#e5ddd0] p-4">
            <strong className="text-[#141722]">U.S. posture:</strong> We are U.S.–based. Metal is vaulted and insured in the United States. We design our program to comply with applicable U.S. laws and regulations, including KYC/AML/OFAC screening for gated actions.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Information we collect</h4>
            <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Account & contact</strong> – name, email, phone, billing/ship-to address.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Order details</strong> – items purchased, prices, taxes, shipping and tracking info.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">KYC / identity</strong> (tokenized program; required for mint/redeem & LP) – government ID, proof of address, date of birth, and biometric checks (e.g., liveness/face match) processed by our third-party KYC provider. We do not store biometric templates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                  <span><strong className="text-[#141722]">Payments</strong> – we receive payment confirmations and limited details from processors (card last4/brand, Coinbase Commerce payment status, ACH/wire references). We do not store full card numbers or crypto private keys.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Wallet & blockchain</strong> – public wallet addresses you provide, transaction hashes, allow-list status, and on-chain interactions with our published contracts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Device & usage</strong> – IP address, device/browser type, pages viewed, referral URLs, session and error logs; approximate location derived from IP.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Cookies/SDKs</strong> – necessary cookies for login/checkout; optional analytics and marketing cookies (see §10).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">How we use information</h4>
            <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Provide & fulfill retail orders</strong> (catalog, checkout, payments, shipping, support).</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Compliance & risk</strong> – KYC/AML/OFAC screening, fraud prevention, sanctions and geofence checks, incident response.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Operate the tokenized program</strong> (if/when launched) – eligibility checks, mint/redeem processing, LP eligibility and rewards.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Communications</strong> – order confirmations, shipping updates, service notices, and (if you opt in) marketing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Improve & secure the Services</strong> – debugging, analytics, load balancing, access controls.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Legal obligations</strong> – recordkeeping, tax collection/remittance, responding to lawful requests.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Legal bases (where required)</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              We process data to perform a contract (fulfilling orders, providing Services), comply with law (KYC/AML/tax), protect legitimate interests (fraud/security), and with your consent (e.g., marketing cookies, certain KYC checks where consent is required).
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">How we share information</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              We do not sell your personal information. We share only as needed to operate the Services:
            </p>
            <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Service providers</strong> – payments (card/ACH/wire processors; Coinbase Commerce for crypto), KYC/identity vendors, shipping/insurance carriers, cloud hosting, analytics, email/SMS providers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Professional advisors</strong> – lawyers, auditors, accountants under confidentiality.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Compliance & law</strong> – to comply with laws, lawful requests, and to protect rights, security, and property.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Corporate transactions</strong> – in mergers, financings, or acquisitions, subject to appropriate safeguards.</span>
              </li>
            </ul>
            <p className="text-[#7c7c7c] text-sm font-inter mt-3">
              We do not permit providers to use your data for their own marketing.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">On-chain transparency & privacy</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Blockchain transactions are public and permanent. When you link a wallet to your account or interact with our contracts, third parties may infer your activity. Do not reuse addresses you consider sensitive. We cannot alter or delete public blockchain records.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Data security</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              We use administrative, technical, and physical safeguards including TLS encryption in transit, encryption at rest where appropriate, role-based access, multi-party approvals for sensitive actions, logging/monitoring, vulnerability testing, and incident-response playbooks.
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter">
              No system is 100% secure. You are responsible for device hygiene, strong passwords, and custody of any wallet keys.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Data retention</h4>
            <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Retail orders & accounting:</strong> generally retained for the period required by tax/records laws.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">KYC/AML:</strong> retained for the legally required period (often 5+ years) after the relationship or last transaction, then deleted or archived as required.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Support and logs:</strong> kept only as long as needed for operations, security, or legal obligations.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Your choices & rights</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              Subject to applicable law, you may request to access, correct, or delete personal information; opt out of marketing; and request a copy of your data. U.S. state laws (e.g., CA/CO/CT/VA) may also provide rights to limit sensitive data, appeal a decision, or opt out of &quot;sale&quot;/&quot;sharing&quot; for targeted ads (we do not sell; any cookie-based &quot;sharing&quot; can be controlled via our Cookie Banner).
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Make requests at <strong className="text-[#141722]">privacy@summitbullion.io</strong>. We may verify your identity before responding. You may use an authorized agent where the law allows.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Children</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Our Services are not for children under 13 (or under 16 where applicable). We do not knowingly collect personal information from children. If you believe a child provided data, contact us to delete it.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Cookies & analytics</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-2">
              We use:
            </p>
            <ul className="space-y-2 text-[#7c7c7c] text-sm font-inter">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Strictly necessary cookies</strong> (auth, checkout, security).</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Analytics</strong> (e.g., page performance, error diagnostics).</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong className="text-[#141722]">Marketing cookies</strong> (optional; used only with your consent).</span>
              </li>
            </ul>
            <p className="text-[#7c7c7c] text-sm font-inter mt-3">
              Manage preferences through our Cookie Banner or your browser settings.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">International data transfers</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              We and our providers may process data in the United States and other countries with different laws. We use appropriate safeguards (e.g., DPAs, standard contractual clauses) for cross-border transfers where required.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Third-party links</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Our Services may link to third-party sites/apps. Their privacy practices are their own; review their policies.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Changes to this policy</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              We may update this policy from time to time. The &quot;Last updated&quot; date reflects the latest version. Material changes will be highlighted on the site or via email where appropriate. Your continued use of the Services after changes means you accept the updated policy.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Contact us</h4>
            <div className="space-y-2 text-[#7c7c7c] text-sm font-inter">
              <p><strong className="text-[#141722]">Privacy requests & questions:</strong> privacy@summitbullion.io</p>
              <p><strong className="text-[#141722]">Security/vulnerability reporting:</strong> security@summitbullion.io</p>
              <p className="mt-3"><strong className="text-[#141722]">Postal:</strong> Summit Bullion, Inc., 1200 Riverplace Blvd, Suite 105-1308, Jacksonville, FL 32207 USA</p>
            </div>
          </div>
        </div>
      ),
    };

    return contentMap[key] || (
      <div className="space-y-6">
        <p className="text-[#7c7c7c] leading-relaxed font-inter">
          Content for this section is coming soon.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#fcf8f1]">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-[280px] h-full bg-white border-r border-[#e5ddd0] hidden min-[900px]:block z-40 shadow-sm">
        <div className="p-6 h-full overflow-y-auto scrollbar-thin">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 hover:opacity-70 transition-all duration-200 mb-6 group"
          >
            <Image
              src="/images/wordmark-logo.svg"
              alt="Summit Bullion"
              width={200}
              height={24}
              style={{ width: 'auto', height: '24px' }}
              className="group-hover:scale-[1.02] transition-transform duration-200"
            />
          </button>

          {/* Search in Sidebar - Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="mb-6 w-full h-[38px] pl-9 pr-3 rounded-lg bg-[#fcf8f1] border border-[#e5ddd0] text-[#7c7c7c] text-sm text-left hover:border-[#ffb546] transition-all font-inter flex items-center relative"
          >
            <Search className="absolute left-3 h-4 w-4 text-[#7c7c7c]" />
            <span>Search...</span>
            <kbd className="ml-auto text-xs bg-white px-2 py-0.5 rounded border border-[#e5ddd0]">⌘K</kbd>
          </button>
          
          <nav>
            <h3 className="text-[#7c7c7c] text-xs font-inter font-bold mb-5 uppercase tracking-wider px-2">Documentation</h3>
            <div className="flex flex-col gap-2">
              {navigation.map((section, index) => {
                const isExpanded = expandedSections.has(section.id);
                const hasSubsections = section.subsections.length > 0;
                
                return (
                  <div key={section.id} className={index > 0 ? 'mt-2' : ''}>
                    <button
                      onClick={() => {
                        if (hasSubsections) {
                          toggleSection(section.id);
                        } else {
                          handleNavigate(section.id);
                        }
                      }}
                      className={`w-full text-left text-sm py-2.5 px-3 rounded-xl font-inter font-semibold transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        (!hasSubsections && activeSection === section.id) || (hasSubsections && activeSection === section.id && !isExpanded)
                          ? 'bg-[#fcf8f1] text-[#141722]'
                          : 'text-[#141722] hover:bg-[#fcf8f1]'
                      }`}
                    >
                      <span>{section.title}</span>
                      {hasSubsections && (
                        <ChevronDown 
                          className={`h-4 w-4 text-[#7c7c7c] transition-transform duration-300 ${
                            isExpanded ? 'transform rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>
                    {hasSubsections && (
                      <div 
                        className={`ml-3 border-l-2 border-[#e5ddd0] pl-3 transition-all duration-300 ease-in-out overflow-hidden ${
                          isExpanded ? 'mt-1.5 max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="space-y-0.5 py-1">
                          {section.subsections.map((subsection) => (
                            <button
                              key={subsection.id}
                              onClick={() => handleNavigate(section.id, subsection.id)}
                              className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-200 font-inter cursor-pointer ${
                                activeSection === section.id && activeSubsection === subsection.id
                                  ? 'bg-[#fcf8f1] text-[#000000] font-medium'
                                  : 'text-[#7c7c7c] hover:text-[#141722] hover:bg-[#fcf8f1] hover:translate-x-0.5'
                              }`}
                            >
                              {subsection.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-[900px]:ml-[280px]">
        {/* Content */}
        <main className="p-[18px] min-[900px]:p-10 max-w-[1000px] mx-auto pt-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 pt-2">
            <span className="text-[#7c7c7c] text-xs font-inter font-semibold uppercase tracking-wider">{currentSection?.title}</span>
            {currentSubsection && (
              <>
                <span className="text-[#e5ddd0] font-bold">/</span>
                <span className="text-[#ffb546] text-xs font-inter font-semibold uppercase tracking-wider">{currentSubsection.title}</span>
              </>
            )}
          </div>

          {/* Page Title */}
          <h1 className="text-3xl min-[900px]:text-4xl font-inter font-bold text-[#141722] mb-10 leading-tight">
            {currentSubsection?.title || currentSection?.title}
      </h1>

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            {getContent()}
          </div>
        </main>
      </div>

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 bg-[#141722]/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-[10vh]"
          onClick={() => {
            setIsSearchOpen(false);
            setSearchQuery('');
            setSearchResults([]);
          }}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 border border-[#e5ddd0]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="relative border-b border-[#e5ddd0]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7c7c7c]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
                autoFocus
                className="w-full h-[60px] pl-12 pr-12 bg-transparent text-[#141722] placeholder:text-[#7c7c7c] text-base focus:outline-none font-inter"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7c7c7c] hover:text-[#141722] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Recent Searches / Initial State */}
            {!searchQuery && (
              <div className="p-6">
                <h3 className="text-[#7c7c7c] text-xs font-semibold uppercase tracking-wider mb-4 font-inter">
                  Recent searches
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      handleNavigate('getting-started', 'buy-physical');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#fcf8f1] transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fff0c1] to-[#ffb546]/20 flex items-center justify-center flex-shrink-0 group-hover:from-[#ffb546] group-hover:to-[#ffd000] transition-all duration-200">
                        <span className="text-[#ffb546] group-hover:text-white font-bold text-sm transition-colors">#</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-[#141722] text-sm font-medium mb-1 group-hover:text-[#ffb546] transition-colors">Buying Physical Metals</div>
                        <div className="text-[#7c7c7c] text-xs">Getting Started • Start investing in physical gold and silver</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      handleNavigate('tokenized-assets', 'what-are');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-lg hover:bg-[#fcf8f1] transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fff0c1] to-[#ffb546]/20 flex items-center justify-center flex-shrink-0 group-hover:from-[#ffb546] group-hover:to-[#ffd000] transition-all duration-200">
                        <span className="text-[#ffb546] group-hover:text-white font-bold text-sm transition-colors">#</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-[#141722] text-sm font-medium mb-1 group-hover:text-[#ffb546] transition-colors">What Are Tokenized Assets</div>
                        <div className="text-[#7c7c7c] text-xs">Tokenized Assets • Learn about digital asset representations</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchQuery && searchResults.length > 0 && (
              <div className="max-h-[500px] overflow-y-auto">
                <div className="px-6 py-3 border-b border-[#e5ddd0] bg-[#fcf8f1]/50">
                  <p className="text-xs text-[#7c7c7c] font-semibold uppercase tracking-wider">
                    {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'}
                  </p>
                </div>
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleNavigate(result.sectionId, result.subsectionId);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="w-full text-left px-6 py-4 hover:bg-[#fcf8f1] transition-all duration-200 border-b border-[#e5ddd0] last:border-0 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fff0c1] to-[#ffb546]/20 flex items-center justify-center flex-shrink-0 group-hover:from-[#ffb546] group-hover:to-[#ffd000] transition-all duration-200">
                        <span className="text-[#ffb546] group-hover:text-white font-bold text-sm transition-colors">#</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[#141722] text-sm font-semibold group-hover:text-[#ffb546] transition-colors">{result.title}</h4>
                          <svg className="w-4 h-4 text-[#7c7c7c] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-[#ffb546] font-medium">{result.section}</span>
                          {result.subsection && (
                            <>
                              <span className="text-[#e5ddd0]">•</span>
                              <span className="text-xs text-[#7c7c7c]">{result.subsection}</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-[#7c7c7c] leading-relaxed line-clamp-2">{result.content}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {searchQuery && searchResults.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-[#7c7c7c] text-sm">No results found for &quot;{searchQuery}&quot;</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

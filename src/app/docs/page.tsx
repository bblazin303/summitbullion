'use client';

import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useCallback } from 'react';

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
      { id: 'buy-physical', title: 'Buying Physical Metals' },
      { id: 'kyc-verification', title: 'KYC Verification' },
    ]
  },
  {
    id: 'sbgold-token',
    title: 'SB-GOLD Token',
    subsections: [
      { id: 'what-is-sbgold', title: 'What is SB-GOLD' },
      { id: 'minting', title: 'How to Mint' },
      { id: 'redemption', title: 'Redemption Options' },
      { id: 'trading', title: 'Trading on DEX' },
    ]
  },
  {
    id: 'features',
    title: 'Features',
    subsections: [
      { id: 'liquidity', title: 'Liquidity Provision' },
      { id: 'payments', title: 'Payment Processing' },
      { id: 'legacy-token', title: 'Zzzz Legacy Token' },
    ]
  },
  {
    id: 'whitepaper',
    title: 'Whitepaper',
    subsections: [
      { id: 'history', title: 'Company History' },
      { id: 'legal-structure', title: 'Legal Structure' },
      { id: 'tokenomics', title: 'Token Mechanisms' },
      { id: 'fees', title: 'Fees & Economics' },
      { id: 'projections', title: 'Financial Projections' },
      { id: 'compliance', title: 'Compliance' },
    ]
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    subsections: []
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
      { id: 'payment-info', title: 'Payment Information' },
      { id: 'shipping-info', title: 'Shipping Information' },
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
  const [activeSubsection, setActiveSubsection] = useState('buy-physical');

  const handleNavigate = (sectionId: string, subsectionId?: string) => {
    setActiveSection(sectionId);
    setActiveSubsection(subsectionId || '');
  };

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];
    const searchTerms = query.toLowerCase().split(' ');

    // Search through all sections and subsections
    navigation.forEach(section => {
      if (section.subsections.length === 0) {
        // Standalone section like Roadmap
        const matchesAllTerms = searchTerms.every(term => 
          section.title.toLowerCase().includes(term)
        );
        if (matchesAllTerms) {
          results.push({
            section: section.title,
            subsection: '',
            title: section.title,
            content: `View ${section.title} documentation`,
            sectionId: section.id,
          });
        }
      } else {
        // Section with subsections
        section.subsections.forEach(subsection => {
          const matchesAllTerms = searchTerms.every(term => 
            section.title.toLowerCase().includes(term) ||
            subsection.title.toLowerCase().includes(term)
          );
          if (matchesAllTerms) {
            results.push({
              section: section.title,
              subsection: subsection.title,
              title: subsection.title,
              content: `${section.title} - ${subsection.title}`,
              sectionId: section.id,
              subsectionId: subsection.id,
            });
          }
        });
      }
    });

    setSearchResults(results);
  }, []);

  // Get current section and subsection info
  const currentSection = navigation.find(s => s.id === activeSection);
  const currentSubsection = currentSection?.subsections.find(ss => ss.id === activeSubsection);

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
      'getting-started-buy-physical': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Start investing in physical gold and silver with just a few clicks. Our streamlined process makes it easy to purchase precious metals securely.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <NumberedStep number={1} title="Browse Our Catalog">
              <p>Explore over 1,400 SKUs of gold and silver products from trusted dealers.</p>
            </NumberedStep>
            
            <NumberedStep number={2} title="Add to Cart">
              <p>Select your products and proceed to checkout.</p>
            </NumberedStep>
            
            <NumberedStep number={3} title="Choose Payment Method">
              <p>Pay with credit card, bank transfer, or cryptocurrency via Alchemy Pay.</p>
            </NumberedStep>
            
            <NumberedStep number={4} title="Receive Your Order" isLast>
              <p>Your metals will be shipped securely to your U.S. address with full insurance.</p>
            </NumberedStep>
          </div>
        </div>
      ),

      'getting-started-kyc-verification': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Complete KYC verification to unlock advanced features like minting SB-GOLD tokens and providing liquidity.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">KYC Benefits</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Mint SB-GOLD tokens backed by physical gold</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Redeem tokens for physical gold delivery</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Provide liquidity and earn yield</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Access institutional features</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-[#e5ddd0]">
              <p className="text-[#7c7c7c] text-sm font-inter">
                <strong className="text-[#141722]">One-time fee:</strong> $25 per wallet
              </p>
            </div>
          </div>
        </div>
      ),

      'sbgold-token-what-is-sbgold': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            SB-GOLD is a tokenized gold asset backed 1:1 by allocated physical gold stored in secure vaults. 
            Each token represents ownership of actual gold bars with serial number tracking and independent attestations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">Key Features</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#ffb546]">•</span>
                  <span className="text-[#7c7c7c] text-sm font-inter">1:1 backing by physical gold</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffb546]">•</span>
                  <span className="text-[#7c7c7c] text-sm font-inter">Serial number tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffb546]">•</span>
                  <span className="text-[#7c7c7c] text-sm font-inter">Monthly attestations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffb546]">•</span>
                  <span className="text-[#7c7c7c] text-sm font-inter">Instant liquidity</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">Use Cases</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#ffb546]">•</span>
                  <span className="text-[#7c7c7c] text-sm font-inter">Store value in gold</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffb546]">•</span>
                  <span className="text-[#7c7c7c] text-sm font-inter">Trade on DEX</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffb546]">•</span>
                  <span className="text-[#7c7c7c] text-sm font-inter">Provide liquidity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffb546]">•</span>
                  <span className="text-[#7c7c7c] text-sm font-inter">Redeem for physical</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),

      'sbgold-token-minting': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Minting converts your USDC into tokenized gold backed by physical reserves.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <NumberedStep number={1} title="Complete KYC">
              <p>Verify your identity to access minting functionality.</p>
            </NumberedStep>
            
            <NumberedStep number={2} title="Deposit USDC">
              <p>Transfer USDC to the minting contract at spot price + 1% fee.</p>
            </NumberedStep>
            
            <NumberedStep number={3} title="Gold Allocation">
              <p>Physical gold is purchased and allocated to the SPV vault with your serial numbers recorded.</p>
            </NumberedStep>
            
            <NumberedStep number={4} title="Receive SB-GOLD" isLast>
              <p>SB-GOLD tokens are minted to your wallet, fully backed by allocated gold.</p>
            </NumberedStep>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Fee Structure</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              <strong className="text-[#141722]">Minting Fee:</strong> +1% over wholesale quote<br/>
              <strong className="text-[#141722]">KYC Badge:</strong> $25 one-time per wallet
            </p>
          </div>
        </div>
      ),

      'sbgold-token-redemption': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Redeem your SB-GOLD tokens for physical gold delivery or instant USDC.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">Physical Gold Delivery</h4>
              <p className="text-[#7c7c7c] text-sm mb-4 font-inter">
                Burn SB-GOLD tokens to receive physical gold shipped to your address.
              </p>
              <ul className="space-y-2">
                <li className="text-[#7c7c7c] text-sm font-inter">• $25 flat shipping fee</li>
                <li className="text-[#7c7c7c] text-sm font-inter">• Weekly batch processing</li>
                <li className="text-[#7c7c7c] text-sm font-inter">• Fully insured delivery</li>
                <li className="text-[#7c7c7c] text-sm font-inter">• U.S. addresses only</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">USDC Redemption</h4>
              <p className="text-[#7c7c7c] text-sm mb-4 font-inter">
                Burn SB-GOLD tokens for instant USDC payout at current spot price.
              </p>
              <ul className="space-y-2">
                <li className="text-[#7c7c7c] text-sm font-inter">• Instant processing</li>
                <li className="text-[#7c7c7c] text-sm font-inter">• No shipping fees</li>
                <li className="text-[#7c7c7c] text-sm font-inter">• Current spot price</li>
                <li className="text-[#7c7c7c] text-sm font-inter">• Available 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      ),

      'sbgold-token-trading': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Trade SB-GOLD on decentralized exchanges with a 1% token tax that supports the ecosystem.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Token Tax Allocation</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#7c7c7c] text-sm font-inter">Protocol Treasury (peg defense & growth)</span>
                <span className="text-[#141722] font-semibold text-sm">35%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7c7c7c] text-sm font-inter">SB-GOLD LP Rewards</span>
                <span className="text-[#141722] font-semibold text-sm">25%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7c7c7c] text-sm font-inter">Team & Operations</span>
                <span className="text-[#141722] font-semibold text-sm">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7c7c7c] text-sm font-inter">Zzzz Buyback + Burn</span>
                <span className="text-[#141722] font-semibold text-sm">10%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7c7c7c] text-sm font-inter">SBX Buyback + Burn</span>
                <span className="text-[#141722] font-semibold text-sm">10%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7c7c7c] text-sm font-inter">Risk/Emergency Fund</span>
                <span className="text-[#141722] font-semibold text-sm">5%</span>
              </div>
            </div>
          </div>
        </div>
      ),

      'features-liquidity': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Provide liquidity to SB-GOLD pools and earn yield while maintaining exposure to gold price movements.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">LP Requirements & Benefits</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">KYC Required:</strong> Only verified wallets can provide liquidity</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Fresh Mint Policy:</strong> Pair freshly minted SB-GOLD with USDC</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Earn Fees:</strong> Receive 25% of token tax revenue distributed to LPs</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Maintain Exposure:</strong> Keep underlying gold exposure while earning yield</span>
              </li>
            </ul>
          </div>
        </div>
      ),

      'features-payments': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Flexible payment options powered by Alchemy Pay for seamless transactions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-2 font-inter">Credit/Debit Cards</h4>
              <p className="text-[#7c7c7c] text-sm font-inter">Major cards accepted with 1% processing fee</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-2 font-inter">Bank Transfers</h4>
              <p className="text-[#7c7c7c] text-sm font-inter">ACH and wire transfers for larger purchases</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-2 font-inter">Cryptocurrency</h4>
              <p className="text-[#7c7c7c] text-sm font-inter">Pay with Bitcoin, Ethereum, Solana, and more</p>
            </div>
          </div>
        </div>
      ),

      'features-legacy-token': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Our original token continues as a &quot;founder&quot; or &quot;legacy&quot; coin with a new tokenomics model.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Zzzz Buyback Strategy</h4>
            <p className="text-[#7c7c7c] text-sm mb-3 font-inter">
              10% of protocol profits go to Zzzz buyback and burn, creating deflationary pressure and value for legacy holders.
            </p>
            <ul className="space-y-2">
              <li className="text-[#7c7c7c] text-sm font-inter">• Company owns ~60% of token supply</li>
              <li className="text-[#7c7c7c] text-sm font-inter">• Continuous buyback from protocol revenue</li>
              <li className="text-[#7c7c7c] text-sm font-inter">• Automatic burn mechanism</li>
              <li className="text-[#7c7c7c] text-sm font-inter">• Community rewards for loyalty</li>
            </ul>
          </div>
        </div>
      ),

      'whitepaper-history': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Advanced Financial Technologies LLC was founded in 2023 as a parent company for projects built under its management. 
            Our journey from Forex trading bots to tokenized precious metals represents continuous evolution, hard-earned lessons, and unwavering commitment to our vision.
          </p>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">2023: The Beginning</h4>
              <p className="text-[#7c7c7c] text-sm font-inter mb-3">
                We started focused on Algo Trading Bots for the Forex market, mainly MT4 platforms. After a quick launch of our initial product, 
                our focus turned to the Web3 market as we saw growing interest in Telegram trading bots circulating at the time.
              </p>
              <p className="text-[#7c7c7c] text-sm font-inter">
                Our MT4 developer Frank didn&apos;t know crypto, so we sought new talent. Our first hire took payments over months, 
                but eventually revealed the project was beyond their skill level—they took the money and ran, leaving us with nothing.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">May 2024: Zzzz Token Launch</h4>
              <p className="text-[#7c7c7c] text-sm font-inter mb-3">
                Despite setbacks, we continued marketing and community building through Spaces sessions. We hired a new developer, 
                fully onboarded to the team with token allocation. In May 2024, we launched our SPL token &quot;Zzzz&quot; on Solana.
              </p>
              <p className="text-[#7c7c7c] text-sm font-inter">
                We handled our own presale by building a smart contract to manage funds. After presale, we added liquidity to Raydium 
                and burned our LP tokens. Work progressed as our focus shifted toward a TG Bot where users could off-ramp directly into physical gold shipped to their door.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">Pivot to Precious Metals</h4>
              <p className="text-[#7c7c7c] text-sm font-inter mb-3">
                Wholesale contacts and distributor accounts proved most fruitful. With new TG bots launching daily, we felt our time had passed for trading bots. 
                Our focus shifted directly to onboarding the precious metals industry into Web3. We secured our first wholesale agreement with Elemetal Refinery.
              </p>
              <p className="text-[#7c7c7c] text-sm font-inter">
                Shortly after launching store.sleeperbot.io with Elemetal product offerings, initial hype grew our token to around $400k market cap. 
                It was an exciting time, followed by a quick downfall when our developer started dumping their allocated tokens, crashing the price. 
                We were left with a &quot;rugged&quot; token and half-working website.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">Rebuilding & Networking</h4>
              <p className="text-[#7c7c7c] text-sm font-inter mb-3">
                These were hard times, but RWAs were entering the spotlight and tokenization was becoming popular. We had a vision of what we could build 
                for our Web3 community. We sold all company shares to markets, allowing a fair launch for starting over.
              </p>
              <p className="text-[#7c7c7c] text-sm font-inter mb-3">
                We sought opinions on our goals and searched for a new development team. We visited Art Basel in Miami for Solana Week, 
                went to MtnDAO in Salt Lake, and lived in the hacker house trying to find the right fit. We presented at MtnDAO headquarters and received amazing feedback.
              </p>
              <p className="text-[#7c7c7c] text-sm font-inter">
                Around this time, we secured another partnership through Upstate Gold and Coin. Their modern API usage and order processing platform 
                solved many pricing and checkout issues from our initial Elemetal partnership, which required manual processing and led to high margins.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">2024-2025: Summit Bullion is Born</h4>
              <p className="text-[#7c7c7c] text-sm font-inter mb-3">
                We spoke with three development companies from MtnDAO referrals. After months of discussion, we chose DreamFlow Labs. 
                Political backing started flowing into crypto with the new administration—ETFs, protocols, strategic reserves all coming to market. 
                The SEC opened up to Web3 markets, and times looked ripe.
              </p>
              <p className="text-[#7c7c7c] text-sm font-inter mb-3">
                We focused on rebranding, as our initial name didn&apos;t fit our new purpose. DreamFlow Labs helped us develop our vision, 
                and Summit Bullion was born. We dug deep into tokenomics, regulation, and process flow for our new mission.
              </p>
              <p className="text-[#7c7c7c] text-sm font-inter">
                After deliberation with our legal team and top Zzzz holders, we decided to keep the token as a &quot;founder&quot; or &quot;legacy&quot; coin. 
                We began a buyback strategy to bring company-owned token reserve to around 60% internal ownership, changing the token flywheel 
                to a 10% buyback and burn from protocol profits derived from mint/redeem, price stabilization, and secondary market transaction fees.
              </p>
            </div>
          </div>
        </div>
      ),

      'whitepaper-legal-structure': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Summit Bullion uses a multi-entity bankruptcy-remote structure to protect user assets, enable institutional adoption, 
            and separate operational risk from gold custody. Our legal team is working on getting all filings up to date, with our CPA handling 
            company and personal taxes to give us a fresh start with a compliance roadmap moving forward.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Fundraising Structure</h4>
            
            <div className="space-y-4">
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Summit Bullion, Inc. (Delaware C-Corp)</h5>
                <p className="text-[#7c7c7c] text-sm font-inter mb-2">
                  <strong className="text-[#141722]">Equity investors buy here</strong>
                </p>
                <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                  <li>• Owns both the Trust/SPV and the operating LLC</li>
                  <li>• Profit sharing from physical sales benefits added profits for investors</li>
                  <li>• Parent entity structure for institutional fundraising</li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Advanced Financial Technologies, LLC (Florida) — &quot;OpCo&quot;</h5>
                <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                  <li>• Runs physical metals storefront (supplier API, checkout, fulfillment)</li>
                  <li>• Revenue: product spread, shipping/storage add-ons</li>
                  <li>• Contracts: suppliers, logistics, payment processors</li>
                  <li>• Owns IP/software (KYC portal, mint/redeem code, dashboard)</li>
                  <li>• Licenses technology to Summit Bullion SPV and acts as the SPV manager</li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">SB-GOLD SPV / Trust (Bankruptcy-Remote)</h5>
                <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                  <li>• Holds allocated/vaulted gold backing; custodian/trustee agreements</li>
                  <li>• Issues/redeems SB-GOLD 1:1 via <strong>KYC-gated</strong> mint/redeem</li>
                  <li>• Attestations cadence + on-chain transparency</li>
                  <li>• Operated/managed under contract by AFT LLC</li>
                  <li>• Bankruptcy-remote structure protects user gold holdings</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-lg border border-[#ffb546]/20">
              <p className="text-[#7c7c7c] text-sm font-inter">
                <strong className="text-[#141722]">Fundraising Goal:</strong> $500K equity sale of Delaware C-Corp to complete SPV/Trust formation, 
                obtain necessary licensing (MTL), conduct security audits, and scale operations. We are forming the Delaware C-Corporation to allow 
                the sale of future equity of the company in exchange for investment.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Competitive Landscape</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              Prominent examples of tokenized gold projects include PaxGold, Matrixdock, VNX, and Comtech. After studying how they align themselves 
              with regulations, we formulated our plan—carving our own niche by being retail-friendly while offering physical precious metals sales.
            </p>
            <p className="text-[#7c7c7c] text-sm font-inter">
              All these competitors have formed a Trust or SPV to own the protocol, with minting/redeeming and rebalancing handled by the Trust, 
              creating a bankruptcy-proof legal structure. Capital needs for this are above our current budget, which is why we&apos;re pursuing 
              a fundraising round to bring in new investors on the project.
            </p>
          </div>
        </div>
      ),

      'whitepaper-tokenomics': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Understanding the complete flow of how SB-GOLD tokens work within the ecosystem, from minting to trading and redemption.
          </p>

          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-4">
              <h4 className="text-[#141722] font-semibold mb-2 font-inter">1. Buy Physical (Site)</h4>
              <p className="text-[#7c7c7c] text-sm font-inter">
                Card/crypto via Alchemy Pay → ship to customer (U.S. only)
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-4">
              <h4 className="text-[#141722] font-semibold mb-2 font-inter">2. Mint Digital (SB-GOLD)</h4>
              <p className="text-[#7c7c7c] text-sm font-inter">
                KYC badge + USDC → SB-GOLD at spot+1%; gold is purchased/allocated to SPV vault
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-4">
              <h4 className="text-[#141722] font-semibold mb-2 font-inter">3. Trade SB-GOLD on DEX</h4>
              <p className="text-[#7c7c7c] text-sm font-inter">
                1% token tax; peg-balancer arbitrages around NAV
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-4">
              <h4 className="text-[#141722] font-semibold mb-2 font-inter">4. Redeem for Physical Gold</h4>
              <p className="text-[#7c7c7c] text-sm font-inter">
                Burn SB-GOLD → $25 shipping, weekly batch delivery
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-4">
              <h4 className="text-[#141722] font-semibold mb-2 font-inter">5. Redeem for USDC</h4>
              <p className="text-[#7c7c7c] text-sm font-inter">
                Burn SB-GOLD → instant USDC payout for non-physical delivery
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-4">
              <h4 className="text-[#141722] font-semibold mb-2 font-inter">6. Add Liquidity (KYC Required)</h4>
              <p className="text-[#7c7c7c] text-sm font-inter">
                Only KYC wallets; LPs must pair freshly minted SB-GOLD + USDC per policy. LP providing allows users to own the underlying asset and still receive yield in addition.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6 mt-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Compliance Guardrails</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">KYC/AML:</strong> Required at mint/redeem; OFAC list screening; suspicious activity reporting</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">LP Gatekeeping:</strong> Provenance proofs ensure only &quot;fresh mint&quot; tokens allowed into LP</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">U.S. Shipping Only:</strong> No international redemptions at launch for physical gold</span>
              </li>
            </ul>
          </div>
        </div>
      ),

      'whitepaper-fees': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Transparent fee structure across physical sales and digital token operations, designed to sustain the ecosystem while maintaining competitive pricing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">Physical Sales</h4>
              <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                <li>• Upstate wholesale spread (variable) + 2% company margin</li>
                <li>• +1% processing fee (Alchemy Pay) passed to customers</li>
                <li>• 100% profits to Advanced Financial Technologies LLC</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">Digital (SB-GOLD)</h4>
              <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
                <li>• Mint: +1% over wholesale quote</li>
                <li>• Redeem: $25 flat shipping for physical delivery (weekly)</li>
                <li>• Secondary Market Trading: Target 1% token tax</li>
                <li>• KYC NFT Badge: $25 one-time per wallet</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Fee Allocation — Digital SB-GOLD</h4>
            <p className="text-[#7c7c7c] text-sm mb-4 font-inter">
              Revenue from Mint/Redeem, KYC NFT Badge, and Transaction Fees is allocated as follows:
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-[#e5ddd0]">
                <span className="text-[#7c7c7c] text-sm font-inter">Protocol Treasury (peg defense, growth)</span>
                <span className="text-[#141722] font-semibold text-sm">35%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#e5ddd0]">
                <span className="text-[#7c7c7c] text-sm font-inter">SB-GOLD LP Rewards (if enabled)</span>
                <span className="text-[#141722] font-semibold text-sm">25%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#e5ddd0]">
                <span className="text-[#7c7c7c] text-sm font-inter">Team & Operations</span>
                <span className="text-[#141722] font-semibold text-sm">15%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#e5ddd0]">
                <span className="text-[#7c7c7c] text-sm font-inter">Zzzz Buyback + Burn (legacy token)</span>
                <span className="text-[#141722] font-semibold text-sm">10%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#e5ddd0]">
                <span className="text-[#7c7c7c] text-sm font-inter">SBX Buyback + Burn (future token)</span>
                <span className="text-[#141722] font-semibold text-sm">10%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7c7c7c] text-sm font-inter">Risk/Emergency Fund</span>
                <span className="text-[#141722] font-semibold text-sm">5%</span>
              </div>
            </div>
            <p className="text-[#7c7c7c] text-sm mt-4 font-inter">
              This structure strengthens reserves while keeping community alignment through LP rewards and buybacks—without compromising allocated status.
            </p>
          </div>
        </div>
      ),

      'whitepaper-projections': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Revenue scenarios based on DEX volume and minting activity, demonstrating the protocol&apos;s economic sustainability at different scales.
          </p>

          <div className="bg-gradient-to-br from-[#ffb546]/5 to-[#fff0c1]/5 rounded-2xl border border-[#ffb546]/20 p-6 mb-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Model Assumptions</h4>
            <ul className="text-[#7c7c7c] text-sm space-y-2 font-inter">
              <li>• <strong className="text-[#141722]">Token tax:</strong> 1.00% on all secondary SB-GOLD trades (protocol revenue)</li>
              <li>• <strong className="text-[#141722]">Raydium pool fee:</strong> 0.50% (paid by traders; assumed 100% to LPs, $0 to protocol)</li>
              <li>• <strong className="text-[#141722]">Mint fee:</strong> 1.00% of mint flow</li>
              <li>• <strong className="text-[#141722]">KYC badges:</strong> $25 each</li>
              <li>• <strong className="text-[#141722]">Redemptions:</strong> $25 + shipping (set to $0 in these scenarios)</li>
            </ul>
            <p className="text-[#7c7c7c] text-sm mt-3 font-inter italic">
              Note: Effective trader cost on swaps becomes 1.50% (1.00% token tax + 0.50% pool fee to LPs)
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">Scenario A — $5M Monthly DEX Volume</h4>
              <div className="grid grid-cols-2 gap-3 text-sm font-inter">
                <div>
                  <p className="text-[#7c7c7c]">Token tax @1%</p>
                  <p className="text-[#141722] font-semibold">$50,000</p>
                </div>
                <div>
                  <p className="text-[#7c7c7c]">Mint fee @1% ($5M flow)</p>
                  <p className="text-[#141722] font-semibold">$50,000</p>
                </div>
                <div>
                  <p className="text-[#7c7c7c]">KYC revenue (300 badges)</p>
                  <p className="text-[#141722] font-semibold">$7,500</p>
                </div>
                <div>
                  <p className="text-[#7c7c7c]">Pool fee to LPs @0.50%</p>
                  <p className="text-[#141722] font-semibold">$25,000</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-[#e5ddd0]">
                  <p className="text-[#7c7c7c] font-semibold">Total Monthly Protocol Revenue</p>
                  <p className="text-[#141722] font-bold text-lg">$107,500</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">Scenario Mid — $15M Monthly DEX Volume</h4>
              <div className="grid grid-cols-2 gap-3 text-sm font-inter">
                <div>
                  <p className="text-[#7c7c7c]">Token tax @1%</p>
                  <p className="text-[#141722] font-semibold">$150,000</p>
                </div>
                <div>
                  <p className="text-[#7c7c7c]">Mint fee @1% ($15M flow)</p>
                  <p className="text-[#141722] font-semibold">$150,000</p>
                </div>
                <div>
                  <p className="text-[#7c7c7c]">KYC revenue (900 badges)</p>
                  <p className="text-[#141722] font-semibold">$22,500</p>
                </div>
                <div>
                  <p className="text-[#7c7c7c]">Pool fee to LPs @0.50%</p>
                  <p className="text-[#141722] font-semibold">$75,000</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-[#e5ddd0]">
                  <p className="text-[#7c7c7c] font-semibold">Total Monthly Protocol Revenue</p>
                  <p className="text-[#141722] font-bold text-lg">$322,500</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
              <h4 className="text-[#141722] font-semibold mb-3 font-inter">Scenario B — $30M Monthly DEX Volume</h4>
              <div className="grid grid-cols-2 gap-3 text-sm font-inter">
                <div>
                  <p className="text-[#7c7c7c]">Token tax @1%</p>
                  <p className="text-[#141722] font-semibold">$300,000</p>
                </div>
                <div>
                  <p className="text-[#7c7c7c]">Mint fee @1% ($30M flow)</p>
                  <p className="text-[#141722] font-semibold">$300,000</p>
                </div>
                <div>
                  <p className="text-[#7c7c7c]">KYC revenue (1,800 badges)</p>
                  <p className="text-[#141722] font-semibold">$45,000</p>
                </div>
                <div>
                  <p className="text-[#7c7c7c]">Pool fee to LPs @0.50%</p>
                  <p className="text-[#141722] font-semibold">$150,000</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-[#e5ddd0]">
                  <p className="text-[#7c7c7c] font-semibold">Total Monthly Protocol Revenue</p>
                  <p className="text-[#141722] font-bold text-lg">$645,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),

      'whitepaper-compliance': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Summit Bullion operates within strict compliance frameworks, with comprehensive security measures, custody procedures, and risk management protocols.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Legal & Compliance Roadmap</h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">What We Have</h5>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">AFT LLC (Florida) operational</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">FinCEN AML/KYC program; OFAC screening; tax registrations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">U.S. domestic shipping only; consumer protection policies (returns, disclosures)</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">What We Need (and are planning)</h5>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">SPV/Trust to custody allocated gold for SB-GOLD; independent board/administrator; audited financials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">MTL coverage for mint/redeem flows (partner with provider or pursue phased licensing)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">Smart-contract + security audits</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">Proof-of-Reserves reporting cadence (monthly CPA attest + on-chain supply proofs)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                    <span className="text-[#7c7c7c] text-sm font-inter">DEX policy controls (LP whitelisting, fresh-mint enforcement)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Security, Custody & Risk</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Custody:</strong> Allocated bar lists at depository; serial-number tracking; dual-control procedures</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Treasury:</strong> MPC custody or qualified custodian (e.g., Coinbase Institutional) for USDC/SOL/SB-GOLD treasury</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Smart Contracts:</strong> Formal audits; monitored upgrade keys; timelocks; emergency pause</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Operational Risk:</strong> Weekly batch ops; shipping SLAs; insurance</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Market Risk:</strong> Peg-band controls; treasury backstops; transparent incident comms</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Regulatory Risk:</strong> Outside counsel engagement; proactive filings; geo-fencing if required</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Basel III Posture</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Assets remain allocated and unencumbered at all times. No gold leasing. Clear redemption mechanics and segregation of reserves 
              bolster HQLA (High-Quality Liquid Assets) compatibility in the long term, positioning SB-GOLD for institutional adoption.
            </p>
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
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">What is SB-GOLD backed by?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              SB-GOLD is backed 1:1 by allocated physical gold stored in secure vaults with serial number tracking and monthly attestations.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">How do I buy physical gold?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Browse our marketplace, add items to cart, and checkout with credit card, bank transfer, or cryptocurrency. We ship to U.S. addresses.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Do I need KYC to buy physical metals?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              No, KYC is only required for minting SB-GOLD tokens, redeeming for physical delivery, and providing liquidity. Basic purchases don&apos;t require KYC.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">What are the fees for minting SB-GOLD?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Minting costs spot price + 1% fee. KYC badge is a one-time $25 fee per wallet. Redemption for physical gold costs $25 flat shipping.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-2 font-inter">Can I redeem SB-GOLD for cash instead of gold?</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Yes! You can burn SB-GOLD tokens for instant USDC payout at current spot price, or redeem for physical gold delivery ($25 shipping).
            </p>
          </div>
        </div>
      ),

      'legal-payment-info': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Summit Bullion accepts multiple payment methods to make purchasing precious metals convenient and accessible.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Accepted Payment Methods</h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Credit & Debit Cards</h5>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  We accept Visa, Mastercard, American Express, and Discover. A 1% processing fee is applied to all card transactions 
                  to cover payment processing costs via Alchemy Pay.
                </p>
              </div>
              
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Bank Transfers</h5>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  ACH and wire transfers are available for larger purchases. Processing times vary: ACH transfers typically take 3-5 business days, 
                  while wire transfers are processed within 1 business day.
                </p>
              </div>
              
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Cryptocurrency</h5>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  Pay with Bitcoin, Ethereum, Solana, USDC, and other popular cryptocurrencies via Alchemy Pay. 
                  Crypto payments are processed instantly upon blockchain confirmation.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Payment Security</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              All payments are processed through secure, encrypted channels. We never store your complete payment information on our servers. 
              Our payment processor, Alchemy Pay, is PCI DSS compliant and uses industry-standard security measures.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">256-bit SSL encryption for all transactions</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">PCI DSS Level 1 compliance</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Fraud detection and prevention systems</span>
              </li>
            </ul>
          </div>
        </div>
      ),

      'legal-shipping-info': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            We offer secure, insured shipping for all physical precious metals orders within the United States.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Shipping Details</h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Shipping Regions</h5>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  We currently ship to all U.S. addresses. International shipping will be available in future updates. 
                  P.O. boxes and APO/FPO addresses are accepted for orders under a certain weight and value threshold.
                </p>
              </div>
              
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Shipping Costs</h5>
                <p className="text-[#7c7c7c] text-sm font-inter mb-2">
                  Standard shipping costs are calculated based on order value and weight:
                </p>
                <ul className="text-[#7c7c7c] text-sm space-y-1 font-inter">
                  <li>• Orders under $1,000: $25 flat rate</li>
                  <li>• Orders $1,000-$5,000: $35 flat rate</li>
                  <li>• Orders over $5,000: Free insured shipping</li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">Processing Time</h5>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  Orders are typically processed within 1-2 business days. During high-volume periods, processing may take up to 3-5 business days. 
                  You will receive tracking information via email once your order ships.
                </p>
              </div>
              
              <div>
                <h5 className="text-[#ffb546] font-semibold text-sm mb-2 font-inter">SB-GOLD Token Redemptions</h5>
                <p className="text-[#7c7c7c] text-sm font-inter">
                  Physical gold redemptions from SB-GOLD tokens are processed in weekly batches. Shipping cost is a flat $25 fee, 
                  fully insured for the declared value of your gold.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Insurance & Security</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              All shipments are fully insured for their declared value. We use discreet packaging with no external markings indicating precious metals contents.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Full insurance coverage on all shipments</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Signature required for delivery</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Discreet, tamper-evident packaging</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Real-time tracking information</span>
              </li>
            </ul>
          </div>
        </div>
      ),

      'legal-terms': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            By using Summit Bullion&apos;s services, you agree to the following terms and conditions. Please read them carefully.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">1. Acceptance of Terms</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              By accessing and using Summit Bullion&apos;s platform, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">2. Services Provided</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              Summit Bullion provides the following services:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Sale of physical precious metals (gold, silver, and other metals)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Minting and redemption of SB-GOLD tokens backed by physical gold</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">KYC verification services for qualified users</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Access to decentralized exchange liquidity pools</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">3. User Responsibilities</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              Users are responsible for:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Maintaining the security of their account credentials and wallet private keys</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Providing accurate KYC information when required</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Complying with all applicable laws and regulations</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Understanding the risks associated with precious metals investments and cryptocurrency</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">4. Pricing & Fees</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              All prices are subject to change based on market conditions. Spot prices for precious metals fluctuate continuously. 
              Fees for services are clearly disclosed at the time of transaction. Summit Bullion reserves the right to modify fee structures 
              with reasonable notice to users.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">5. Returns & Refunds</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Physical metals may be returned within 7 days of delivery in original, unopened packaging for a full refund minus shipping costs. 
              SB-GOLD token minting is final, but tokens can be redeemed for physical gold or USDC at any time according to the redemption process 
              outlined in our documentation. Consumer protection policies apply to all physical sales.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">6. Limitation of Liability</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              Summit Bullion is not liable for losses resulting from market volatility, user error, unauthorized access to user accounts, 
              or force majeure events. Users acknowledge that precious metals and cryptocurrency investments carry inherent risks.
            </p>
          </div>

          <p className="text-[#7c7c7c] text-sm font-inter italic">
            For complete terms and conditions, please contact our legal team at legal@summitbullion.com
          </p>
        </div>
      ),

      'legal-privacy': (
        <div className="space-y-6">
          <p className="text-[#7c7c7c] leading-relaxed font-inter">
            Summit Bullion is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, 
            use, and safeguard your data.
          </p>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Information We Collect</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              We collect the following types of information:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Personal Information:</strong> Name, email address, shipping address, phone number</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">KYC Information:</strong> Government-issued ID, proof of address, biometric data (for verification)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Financial Information:</strong> Payment method details (processed securely by our payment processor)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Wallet Information:</strong> Public blockchain addresses (no private keys stored)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter"><strong className="text-[#141722]">Usage Data:</strong> IP address, browser type, device information, pages visited</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">How We Use Your Information</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              Your information is used for:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Processing orders and transactions</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">KYC/AML compliance and fraud prevention</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Customer support and communication</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Improving our services and user experience</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Legal and regulatory compliance</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Data Security</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">256-bit SSL encryption for data transmission</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Encrypted storage of sensitive information</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Regular security audits and penetration testing</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Access controls and authentication protocols</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">OFAC screening and suspicious activity monitoring</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Data Sharing</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Service providers (payment processors, shipping partners, KYC verification services)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Law enforcement or regulatory bodies when required by law</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Professional advisors (lawyers, auditors, accountants) under confidentiality agreements</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6">
            <h4 className="text-[#141722] font-semibold mb-4 font-inter">Your Rights</h4>
            <p className="text-[#7c7c7c] text-sm font-inter mb-3">
              You have the right to:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Access and review your personal information</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Request corrections to inaccurate data</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Request deletion of your data (subject to legal retention requirements)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb546] mt-2 flex-shrink-0"></div>
                <span className="text-[#7c7c7c] text-sm font-inter">Opt-out of marketing communications</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#ffb546]/10 to-[#fff0c1]/10 rounded-2xl border border-[#ffb546]/20 p-6">
            <h4 className="text-[#141722] font-semibold mb-3 font-inter">Contact Us</h4>
            <p className="text-[#7c7c7c] text-sm font-inter">
              For privacy-related questions or to exercise your rights, contact us at privacy@summitbullion.com. 
              This Privacy Policy may be updated periodically. Continued use of our services constitutes acceptance of any changes.
            </p>
          </div>

          <p className="text-[#7c7c7c] text-sm font-inter italic">
            Last updated: January 2025
          </p>
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
      <div className="fixed top-0 left-0 w-[280px] h-full bg-[#f8f0e1] border-r border-[#e5ddd0] hidden min-[900px]:block z-40">
        <div className="p-6 h-full overflow-y-auto">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity mb-8"
          >
            <Image
              src="/images/wordmark-logo.svg"
              alt="Summit Bullion"
              width={200}
              height={24}
              style={{ width: 'auto', height: '24px' }}
            />
          </button>
          
          <nav>
            <h3 className="text-[#141722] text-xs font-inter font-semibold mb-4 uppercase tracking-wider">Documentation</h3>
            <div className="flex flex-col gap-1">
              {navigation.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => {
                      if (section.subsections.length === 0) {
                        handleNavigate(section.id);
                      }
                    }}
                    className={`w-full text-left text-[#141722] text-sm py-2.5 px-4 rounded-lg font-inter font-medium ${
                      section.subsections.length === 0 && activeSection === section.id
                        ? 'bg-[#fcf8f1] text-[#ffb546]'
                        : ''
                    }`}
                  >
                    <span>{section.title}</span>
                  </button>
                  {section.subsections.length > 0 && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#e5ddd0] pl-2">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => handleNavigate(section.id, subsection.id)}
                          className={`w-full text-left text-sm py-2 px-4 rounded-lg transition-all font-inter ${
                            activeSection === section.id && activeSubsection === subsection.id
                              ? 'bg-[#fcf8f1] text-[#ffb546] font-medium'
                              : 'text-[#7c7c7c] hover:text-[#141722] hover:bg-[#fcf8f1]'
                          }`}
                        >
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-[900px]:ml-[280px]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#fcf8f1] border-b border-[#e5ddd0]">
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
                    className="w-full h-[38px] pl-10 pr-4 rounded-full bg-white border border-[#e5ddd0] text-[#141722] placeholder:text-[#7c7c7c] text-sm focus:outline-none focus:border-[#ffb546] focus:ring-2 focus:ring-[#ffb546]/20 transition-all font-inter shadow-sm"
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
                    <div className="absolute mt-2 w-[400px] bg-white border border-[#e5ddd0] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden z-50">
                      <div className="max-h-[400px] overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              handleNavigate(result.sectionId, result.subsectionId);
                              setSearchQuery('');
                              setSearchResults([]);
                            }}
                            className="block w-full text-left p-4 hover:bg-[#fcf8f1] border-b border-[#e5ddd0] last:border-0 transition-colors"
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
                          </button>
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
        <main className="p-[18px] min-[900px]:p-8 max-w-[1000px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[#7c7c7c] text-xs font-inter uppercase tracking-wide">{currentSection?.title}</span>
            {currentSubsection && (
              <>
                <span className="text-[#7c7c7c]">/</span>
                <span className="text-[#141722] text-xs font-inter font-medium uppercase tracking-wide">{currentSubsection.title}</span>
              </>
            )}
          </div>

          {/* Page Title */}
          <h1 className="text-3xl min-[900px]:text-4xl font-inter font-semibold text-[#141722] mb-8">
            {currentSubsection?.title || currentSection?.title}
      </h1>

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            {getContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

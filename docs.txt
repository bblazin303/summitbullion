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
        section: 'Getting Started',
        title: 'Introduction',
        content: 'Learn about Dexari and how to get started with decentralized trading.',
        href: '#introduction'
      },
      {
        section: 'Getting Started',
        title: 'Account Setup',
        content: 'Set up your Dexari account and connect your wallet for trading.',
        href: '#getting-started'
      },
      {
        section: 'Features',
        title: 'Trading Interface',
        content: 'Explore Dexari\'s advanced trading features and tools.',
        href: '#features'
      },
      {
        section: 'Features',
        title: 'Portfolio Management',
        content: 'Manage your crypto portfolio with Dexari\'s comprehensive tools.',
        href: '#features'
      },
      {
        section: 'Security',
        title: 'Wallet Integration',
        content: 'Learn about secure wallet connections and transaction signing.',
        href: '#security'
      },
      {
        section: 'API',
        title: 'API Documentation',
        content: 'Integration guides and API references for developers.',
        href: '#api'
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
        <span key={i} className="bg-[#e5dbb7]/20 text-[#e5dbb7]">{part}</span> : 
        part
    );
  };

  return (
    <div className="min-h-screen bg-[#202022]">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-[250px] h-full bg-[#181818] border-r border-zinc-700 hidden min-[900px]:block">
        <div className="p-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/dexari-logo.svg"
              alt="Dexari Logo"
              width={120}
              height={30}
              style={{ width: 'auto', height: '30px' }}
            />
          </button>
          
          <nav className="mt-8">
            <h3 className="text-zinc-400 text-sm font-['Avenir_Next'] font-medium mb-4 uppercase tracking-wide">Documentation</h3>
            <div className="flex flex-col gap-2">
              <a href="#introduction" className="text-zinc-400 hover:text-white text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-['Avenir_Next']">
                Introduction
              </a>
              <a href="#getting-started" className="text-zinc-400 hover:text-white text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-['Avenir_Next']">
                Getting Started
              </a>
              <a href="#features" className="text-zinc-400 hover:text-white text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-['Avenir_Next']">
                Features
              </a>
              <a href="#security" className="text-zinc-400 hover:text-white text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-['Avenir_Next']">
                Security
              </a>
              <a href="#api" className="text-zinc-400 hover:text-white text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-['Avenir_Next']">
                API Reference
              </a>
              <a href="#support" className="text-zinc-400 hover:text-white text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-['Avenir_Next']">
                Support
              </a>
              <a href="#terms" className="text-zinc-400 hover:text-white text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-['Avenir_Next']">
                Terms of Service
              </a>
              <a href="#privacy" className="text-zinc-400 hover:text-white text-sm py-2 px-3 rounded-md hover:bg-white/5 transition-colors font-['Avenir_Next']">
                Privacy Policy
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-[900px]:ml-[250px]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#202022] border-b border-zinc-700">
          <div className="flex items-center justify-between h-[65px] px-[18px] min-[900px]:px-8 max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="min-[900px]:hidden"
              >
                <Image
                  src="/dexari-logo.svg"
                  alt="Dexari Logo"
                  width={100}
                  height={25}
                  style={{ width: 'auto', height: '25px' }}
                />
              </button>
              
              <div className="hidden min-[900px]:block w-[400px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search documentation..."
                    className="w-full h-[38px] pl-10 pr-4 rounded-full bg-[#2a2a2c] border border-zinc-700 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-[#e5dbb7] font-['Avenir_Next']"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && searchQuery && (
                  <div className="absolute mt-2 w-full bg-[#2a2a2c] border border-zinc-700 rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="max-h-[400px] overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <a
                          key={index}
                          href={result.href}
                          onClick={() => {
                            setSearchQuery('');
                            setSearchResults([]);
                          }}
                          className="block p-4 hover:bg-white/5 border-b border-zinc-700 last:border-0"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-white">
                              {highlightText(result.title, searchQuery)}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {result.section}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-400">
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
        </header>

        {/* Content */}
        <main className="p-[18px] min-[900px]:p-8 max-w-[1200px] mx-auto">
          {/* Mobile Search Bar */}
          <div className="mb-6 min-[900px]:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search documentation..."
                className="w-full h-[38px] pl-10 pr-4 rounded-full bg-[#2a2a2c] border border-zinc-700 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-[#e5dbb7] font-['Avenir_Next']"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mobile Search Results Dropdown */}
            {searchResults.length > 0 && searchQuery && (
              <div className="absolute left-[18px] right-[18px] mt-2 bg-[#2a2a2c] border border-zinc-700 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="max-h-[400px] overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <a
                      key={index}
                      href={result.href}
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="block p-4 hover:bg-white/5 border-b border-zinc-700 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">
                          {highlightText(result.title, searchQuery)}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {result.section}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400">
                        {highlightText(result.content, searchQuery)}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mb-12">
            <h1 className="text-3xl min-[900px]:text-4xl font-['Avenir_Next'] font-medium text-white mb-4">
              Documentation
            </h1>
            <p className="text-zinc-400 text-lg font-['Avenir_Next']">
              Everything you need to know about using Dexari for decentralized trading.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 gap-4">
            <a href="#introduction" className="group p-6 bg-[#2a2a2c] rounded-xl border border-zinc-700 hover:border-[#e5dbb7]/50 transition-colors">
              <h3 className="text-white text-xl font-medium mb-2">Introduction</h3>
              <p className="text-zinc-400 text-sm">Learn about Dexari and the future of decentralized trading.</p>
            </a>
            
            <a href="#getting-started" className="group p-6 bg-[#2a2a2c] rounded-xl border border-zinc-700 hover:border-[#e5dbb7]/50 transition-colors">
              <h3 className="text-white text-xl font-medium mb-2">Getting Started</h3>
              <p className="text-zinc-400 text-sm">Set up your account and start trading on Dexari.</p>
            </a>
            
            <a href="#features" className="group p-6 bg-[#2a2a2c] rounded-xl border border-zinc-700 hover:border-[#e5dbb7]/50 transition-colors">
              <h3 className="text-white text-xl font-medium mb-2">Features</h3>
              <p className="text-zinc-400 text-sm">Explore Dexari&apos;s powerful trading features and tools.</p>
            </a>
            
            <a href="#security" className="group p-6 bg-[#2a2a2c] rounded-xl border border-zinc-700 hover:border-[#e5dbb7]/50 transition-colors">
              <h3 className="text-white text-xl font-medium mb-2">Security</h3>
              <p className="text-zinc-400 text-sm">Learn about our security measures and best practices.</p>
            </a>
            
            <a href="#api" className="group p-6 bg-[#2a2a2c] rounded-xl border border-zinc-700 hover:border-[#e5dbb7]/50 transition-colors">
              <h3 className="text-white text-xl font-medium mb-2">API Reference</h3>
              <p className="text-zinc-400 text-sm">Integration guides and API documentation for developers.</p>
            </a>
            
            <a href="#support" className="group p-6 bg-[#2a2a2c] rounded-xl border border-zinc-700 hover:border-[#e5dbb7]/50 transition-colors">
              <h3 className="text-white text-xl font-medium mb-2">Support</h3>
              <p className="text-zinc-400 text-sm">Get help and find answers to common questions.</p>
            </a>
          </div>

          {/* Documentation Sections */}
          <div className="mt-16 space-y-16">
            {/* Introduction Section */}
            <section id="introduction" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-medium text-white mb-6">Introduction</h2>
              
              <div className="space-y-8">
                <div>
                  <p className="text-zinc-400 leading-relaxed">
                    Welcome to Dexari, the next generation of decentralized trading platforms. Our mission is to provide 
                    a seamless, secure, and powerful trading experience that puts you in complete control of your assets.
                  </p>
                  <p className="text-zinc-400 leading-relaxed mt-4">
                    Built on cutting-edge blockchain technology, Dexari offers institutional-grade features with 
                    the transparency and security that only decentralized finance can provide.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">What Makes Dexari Different</h3>
                  <ul className="mt-3 space-y-2 text-zinc-400">
                    <li className="flex items-start">
                      <span className="text-[#e5dbb7] mr-2">•</span>
                      <div>
                        <span className="font-medium text-white">Non-custodial Trading</span> - Your keys, your crypto. Trade directly from your wallet.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#e5dbb7] mr-2">•</span>
                      <div>
                        <span className="font-medium text-white">Advanced Features</span> - Professional trading tools with institutional-grade capabilities.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#e5dbb7] mr-2">•</span>
                      <div>
                        <span className="font-medium text-white">Transparent & Secure</span> - All transactions on-chain with complete transparency.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#e5dbb7] mr-2">•</span>
                      <div>
                        <span className="font-medium text-white">Community Driven</span> - Built by traders, for traders.
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">Platform Overview</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Dexari combines the best of centralized and decentralized trading:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">200+ Trading Pairs</h4>
                      <p className="text-zinc-400 text-sm">Access major cryptocurrencies and emerging tokens with deep liquidity.</p>
                    </div>
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Up to 40x Leverage</h4>
                      <p className="text-zinc-400 text-sm">Amplify your trading power with responsible leverage options.</p>
                    </div>
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Sub-300ms Execution</h4>
                      <p className="text-zinc-400 text-sm">Lightning-fast order execution powered by Hyperliquid.</p>
                    </div>
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Advanced Analytics</h4>
                      <p className="text-zinc-400 text-sm">Professional-grade charts and trading tools by TradingView.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Getting Started Section */}
            <section id="getting-started" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-medium text-white mb-6">Getting Started</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-white mb-3">Setting Up Your Account</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Getting started with Dexari is simple and secure. Follow these steps to begin your decentralized trading journey.
                  </p>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                      <div>
                        <h4 className="text-white font-medium">Download the Dexari App</h4>
                        <p className="text-zinc-400 text-sm mt-1">Available on iOS and Android. Download from the App Store or Google Play.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                      <div>
                        <h4 className="text-white font-medium">Create Your Account</h4>
                        <p className="text-zinc-400 text-sm mt-1">Sign up with email or phone number. Enable 2FA for enhanced security.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                      <div>
                        <h4 className="text-white font-medium">Connect Your Wallet</h4>
                        <p className="text-zinc-400 text-sm mt-1">Link your existing wallet or create a new one with our secure key management.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                      <div>
                        <h4 className="text-white font-medium">Fund Your Account</h4>
                        <p className="text-zinc-400 text-sm mt-1">Deposit funds via bank transfer, card payment, or crypto transfer.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">Connecting Your Wallet</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Dexari supports multiple wallet connection methods to ensure maximum compatibility and security.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Supported Wallets</h4>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• MetaMask</li>
                        <li>• WalletConnect</li>
                        <li>• Coinbase Wallet</li>
                        <li>• Trust Wallet</li>
                        <li>• Ledger Hardware Wallets</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Security Features</h4>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Multi-factor authentication</li>
                        <li>• Biometric verification</li>
                        <li>• Transaction signing</li>
                        <li>• Secure key storage</li>
                        <li>• Account recovery options</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">Account Recovery</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Protect your account with multiple recovery options. Never lose access to your funds.
                  </p>
                  
                  <div className="mt-4 p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                    <h4 className="text-white font-medium mb-3">Recovery Methods</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-[#e5dbb7] font-medium text-sm">Seed Phrase Recovery</h5>
                        <p className="text-zinc-400 text-sm">Use your 12 or 24-word seed phrase to restore wallet access on any device.</p>
                  </div>
                      <div>
                        <h5 className="text-[#e5dbb7] font-medium text-sm">Social Recovery</h5>
                        <p className="text-zinc-400 text-sm">Set up trusted contacts who can help you recover your account if needed.</p>
                      </div>
                      <div>
                        <h5 className="text-[#e5dbb7] font-medium text-sm">Email Recovery</h5>
                        <p className="text-zinc-400 text-sm">Reset access using your verified email address and 2FA backup codes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-medium text-white mb-6">Features</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-white mb-3 font-['Avenir_Next'] font-medium">How to Make Your First Trade</h3>
                  <p className="text-zinc-400 leading-relaxed font-['Avenir_Next']">
                    Learn how to execute your first trade on Dexari with our step-by-step guide.
                  </p>
                  
                  {/* Trading Interface Mockup */}
                  <div className="mt-6 p-6 bg-gradient-to-br from-[#2a2a2c] to-[#1f1f21] rounded-xl border border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-['Avenir_Next'] font-medium">Trading Interface Preview</h4>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Trading Pair Selector */}
                      <div className="p-4 bg-[#1a1a1a] rounded-lg border border-zinc-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#e5dbb7] text-sm font-['Avenir_Next'] font-medium">BTC/USDT</span>
                          <span className="text-green-400 text-sm font-['Avenir_Next']">+2.34%</span>
                        </div>
                        <div className="text-white text-lg font-['Avenir_Next'] font-semibold">$45,234.56</div>
                        <div className="text-zinc-400 text-xs font-['Avenir_Next']">24h Change: +$1,028.34</div>
                      </div>
                      
                      {/* Order Form */}
                      <div className="p-4 bg-[#1a1a1a] rounded-lg border border-zinc-600">
                        <div className="flex space-x-2 mb-3">
                          <button className="px-3 py-1 bg-green-600 text-white text-xs rounded font-['Avenir_Next']">BUY</button>
                          <button className="px-3 py-1 bg-zinc-600 text-zinc-400 text-xs rounded font-['Avenir_Next']">SELL</button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-['Avenir_Next']">
                            <span className="text-zinc-400">Amount</span>
                            <span className="text-white">0.001 BTC</span>
                          </div>
                          <div className="flex justify-between text-xs font-['Avenir_Next']">
                            <span className="text-zinc-400">Price</span>
                            <span className="text-white">$45,234.56</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-700 rounded-full mt-2">
                            <div className="w-1/3 h-1 bg-[#e5dbb7] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-['Avenir_Next'] font-bold flex-shrink-0 mt-0.5">1</div>
                      <div>
                        <h4 className="text-white font-['Avenir_Next'] font-medium">Select Trading Pair</h4>
                        <p className="text-zinc-400 text-sm mt-1 font-['Avenir_Next']">Choose from 200+ available trading pairs (e.g., BTC/USDT, ETH/USDT).</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-['Avenir_Next'] font-bold flex-shrink-0 mt-0.5">2</div>
                      <div>
                        <h4 className="text-white font-['Avenir_Next'] font-medium">Choose Order Type</h4>
                        <p className="text-zinc-400 text-sm mt-1 font-['Avenir_Next']">Select Market (instant) or Limit (set price) order.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-['Avenir_Next'] font-bold flex-shrink-0 mt-0.5">3</div>
                      <div>
                        <h4 className="text-white font-['Avenir_Next'] font-medium">Set Amount & Price</h4>
                        <p className="text-zinc-400 text-sm mt-1 font-['Avenir_Next']">Enter the quantity and price (for limit orders).</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-['Avenir_Next'] font-bold flex-shrink-0 mt-0.5">4</div>
                      <div>
                        <h4 className="text-white font-['Avenir_Next'] font-medium">Review & Execute</h4>
                        <p className="text-zinc-400 text-sm mt-1 font-['Avenir_Next']">Confirm trade details and tap &quot;Buy&quot; or &quot;Sell&quot; to execute.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3 font-['Avenir_Next'] font-medium">Leverage Trading</h3>
                  <p className="text-zinc-400 leading-relaxed font-['Avenir_Next']">
                    Amplify your trading power with up to 40x leverage on supported pairs.
                  </p>
                  
                  <div className="mt-6 space-y-6">
                    {/* How to Use Leverage */}
                    <div>
                      <h4 className="text-white font-['Avenir_Next'] font-medium mb-3">How to Use Leverage</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-['Avenir_Next'] font-bold flex-shrink-0 mt-0.5">1</div>
                          <div>
                            <h5 className="text-white font-['Avenir_Next'] font-medium">Select Leverage Level</h5>
                            <p className="text-zinc-400 text-sm mt-1 font-['Avenir_Next']">Choose from 2x to 40x leverage based on your risk tolerance.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-['Avenir_Next'] font-bold flex-shrink-0 mt-0.5">2</div>
                          <div>
                            <h5 className="text-white font-['Avenir_Next'] font-medium">Set Position Size</h5>
                            <p className="text-zinc-400 text-sm mt-1 font-['Avenir_Next']">Determine how much you want to trade with your leveraged position.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-['Avenir_Next'] font-bold flex-shrink-0 mt-0.5">3</div>
                          <div>
                            <h5 className="text-white font-['Avenir_Next'] font-medium">Configure Stop Loss</h5>
                            <p className="text-zinc-400 text-sm mt-1 font-['Avenir_Next']">Always set a stop-loss to protect against significant losses.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-['Avenir_Next'] font-bold flex-shrink-0 mt-0.5">4</div>
                          <div>
                            <h5 className="text-white font-['Avenir_Next'] font-medium">Monitor Position</h5>
                            <p className="text-zinc-400 text-sm mt-1 font-['Avenir_Next']">Keep track of your margin usage and liquidation price.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-['Avenir_Next'] font-medium mb-2">Leverage Levels</h4>
                      <ul className="text-zinc-400 text-sm space-y-1 font-['Avenir_Next']">
                        <li>• 2x - 5x: Conservative trading</li>
                        <li>• 5x - 10x: Moderate risk</li>
                        <li>• 10x - 20x: Higher risk</li>
                        <li>• 20x - 40x: Maximum leverage</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-['Avenir_Next'] font-medium mb-2">Risk Management</h4>
                      <ul className="text-zinc-400 text-sm space-y-1 font-['Avenir_Next']">
                        <li>• Stop-loss orders</li>
                        <li>• Take-profit levels</li>
                        <li>• Position sizing calculator</li>
                        <li>• Liquidation warnings</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                    <h4 className="text-white font-['Avenir_Next'] font-medium mb-2">⚠️ Important Notes</h4>
                    <ul className="text-zinc-400 text-sm space-y-1 font-['Avenir_Next']">
                      <li>• Leverage amplifies both profits and losses</li>
                      <li>• Always use stop-loss orders to limit risk</li>
                      <li>• Start with lower leverage until you&apos;re experienced</li>
                      <li>• Monitor your positions actively</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">Options Trading</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Trade cryptocurrency options with puts and calls for advanced strategies.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Call Options</h4>
                      <p className="text-zinc-400 text-sm mb-2">Profit when asset price goes up</p>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Buy calls: Bullish strategy</li>
                        <li>• Sell calls: Generate income</li>
                        <li>• Exercise rights at expiry</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Put Options</h4>
                      <p className="text-zinc-400 text-sm mb-2">Profit when asset price goes down</p>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Buy puts: Bearish strategy</li>
                        <li>• Sell puts: Generate income</li>
                        <li>• Hedge existing positions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3 font-['Avenir_Next'] font-medium">Advanced Trading Tools</h3>
                  <p className="text-zinc-400 leading-relaxed font-['Avenir_Next']">
                    Professional-grade tools powered by TradingView integration.
                  </p>
                  
                  {/* Chart Visualization */}
                  <div className="mt-6 p-6 bg-gradient-to-br from-[#2a2a2c] to-[#1f1f21] rounded-xl border border-zinc-700">
                    <h4 className="text-white font-['Avenir_Next'] font-medium mb-4">Interactive Chart Example</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Price Chart */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="p-4 bg-[#1a1a1a] rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                              <span className="text-[#e5dbb7] font-['Avenir_Next'] font-medium">BTC/USDT</span>
                              <span className="text-green-400 text-sm font-['Avenir_Next']">1H</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white text-lg font-['Avenir_Next'] font-semibold">$45,234.56</div>
                              <div className="text-green-400 text-xs font-['Avenir_Next']">+2.34% (+$1,028)</div>
                  </div>
                </div>

                          {/* Simplified Candlestick Chart */}
                          <div className="relative h-32 bg-[#0f0f0f] rounded p-2">
                            <div className="flex items-end justify-between h-full space-x-1">
                              {/* Candlesticks */}
                              <div className="w-2 bg-red-500 h-16 rounded-sm"></div>
                              <div className="w-2 bg-green-500 h-20 rounded-sm"></div>
                              <div className="w-2 bg-green-500 h-24 rounded-sm"></div>
                              <div className="w-2 bg-red-500 h-18 rounded-sm"></div>
                              <div className="w-2 bg-green-500 h-28 rounded-sm"></div>
                              <div className="w-2 bg-green-500 h-32 rounded-sm"></div>
                              <div className="w-2 bg-red-500 h-26 rounded-sm"></div>
                              <div className="w-2 bg-green-500 h-30 rounded-sm"></div>
                              <div className="w-2 bg-green-500 h-32 rounded-sm"></div>
                              <div className="w-2 bg-red-500 h-28 rounded-sm"></div>
                              <div className="w-2 bg-green-500 h-30 rounded-sm"></div>
                              <div className="w-2 bg-green-500 h-32 rounded-sm"></div>
                            </div>
                            {/* Moving Average Line */}
                            <div className="absolute inset-0 flex items-center">
                              <svg className="w-full h-8" viewBox="0 0 100 20">
                                <path d="M 0 15 Q 25 10 50 12 T 100 8" stroke="#e5dbb7" strokeWidth="1" fill="none" opacity="0.8"/>
                              </svg>
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-xs text-zinc-400 mt-2 font-['Avenir_Next']">
                            <span>9:00</span>
                            <span>12:00</span>
                            <span>15:00</span>
                            <span>18:00</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Technical Indicators Panel */}
                      <div className="space-y-4">
                        <div className="p-3 bg-[#1a1a1a] rounded-lg">
                          <h5 className="text-white text-sm font-['Avenir_Next'] font-medium mb-2">Technical Indicators</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-['Avenir_Next']">
                              <span className="text-zinc-400">RSI (14)</span>
                              <span className="text-yellow-400">65.2</span>
                            </div>
                            <div className="flex justify-between text-xs font-['Avenir_Next']">
                              <span className="text-zinc-400">MACD</span>
                              <span className="text-green-400">+142.5</span>
                            </div>
                            <div className="flex justify-between text-xs font-['Avenir_Next']">
                              <span className="text-zinc-400">SMA (50)</span>
                              <span className="text-[#e5dbb7]">$44,890</span>
                            </div>
                            <div className="flex justify-between text-xs font-['Avenir_Next']">
                              <span className="text-zinc-400">Volume</span>
                              <span className="text-white">1.2M</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-[#1a1a1a] rounded-lg">
                          <h5 className="text-white text-sm font-['Avenir_Next'] font-medium mb-2">Order Book</h5>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-['Avenir_Next']">
                              <span className="text-red-400">45,250</span>
                              <span className="text-zinc-400">0.5</span>
                            </div>
                            <div className="flex justify-between text-xs font-['Avenir_Next']">
                              <span className="text-red-400">45,240</span>
                              <span className="text-zinc-400">1.2</span>
                            </div>
                            <div className="w-full h-px bg-zinc-600 my-1"></div>
                            <div className="flex justify-between text-xs font-['Avenir_Next']">
                              <span className="text-green-400">45,230</span>
                              <span className="text-zinc-400">0.8</span>
                            </div>
                            <div className="flex justify-between text-xs font-['Avenir_Next']">
                              <span className="text-green-400">45,220</span>
                              <span className="text-zinc-400">2.1</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-['Avenir_Next'] font-medium mb-2">Chart Analysis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                          <h5 className="text-[#e5dbb7] font-['Avenir_Next'] font-medium text-sm mb-1">Technical Indicators</h5>
                          <ul className="text-zinc-400 text-sm space-y-1 font-['Avenir_Next']">
                            <li>• Moving Averages (SMA, EMA)</li>
                            <li>• RSI & MACD</li>
                            <li>• Bollinger Bands</li>
                            <li>• Fibonacci Retracements</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-[#e5dbb7] font-['Avenir_Next'] font-medium text-sm mb-1">Chart Types</h5>
                          <ul className="text-zinc-400 text-sm space-y-1 font-['Avenir_Next']">
                            <li>• Candlestick charts</li>
                            <li>• Line charts</li>
                            <li>• Volume analysis</li>
                            <li>• Multiple timeframes</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Order Types</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <ul className="text-zinc-400 text-sm space-y-1">
                            <li>• <span className="text-white">Market Orders:</span> Instant execution</li>
                            <li>• <span className="text-white">Limit Orders:</span> Set specific price</li>
                            <li>• <span className="text-white">Stop-Loss:</span> Risk management</li>
                            <li>• <span className="text-white">Take-Profit:</span> Lock in gains</li>
                          </ul>
                        </div>
                        <div>
                          <ul className="text-zinc-400 text-sm space-y-1">
                            <li>• <span className="text-white">TWAP Orders:</span> Time-weighted average</li>
                            <li>• <span className="text-white">Scale Orders:</span> Multiple levels</li>
                            <li>• <span className="text-white">OCO Orders:</span> One-cancels-other</li>
                            <li>• <span className="text-white">Trailing Stop:</span> Dynamic stop-loss</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">Portfolio & Position Management</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Track and manage your trading positions with comprehensive portfolio tools.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Portfolio Overview</h4>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Total portfolio value</li>
                        <li>• Asset allocation</li>
                        <li>• P&L tracking</li>
                        <li>• Performance analytics</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Open Positions</h4>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Real-time P&L</li>
                        <li>• Margin usage</li>
                        <li>• Position size</li>
                        <li>• Entry/exit prices</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Trade History</h4>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Complete trade log</li>
                        <li>• Export capabilities</li>
                        <li>• Tax reporting</li>
                        <li>• Performance metrics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">Assets & Market Data</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Access comprehensive market data and asset information for informed trading decisions.
                  </p>
                  
                  <div className="mt-4 p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                    <h4 className="text-white font-medium mb-3">Available Assets</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-[#e5dbb7] font-medium text-sm mb-2">Major Cryptocurrencies</h5>
                        <ul className="text-zinc-400 text-sm space-y-1">
                          <li>• Bitcoin (BTC)</li>
                          <li>• Ethereum (ETH)</li>
                          <li>• Solana (SOL)</li>
                          <li>• Cardano (ADA)</li>
                          <li>• Polygon (MATIC)</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-[#e5dbb7] font-medium text-sm mb-2">DeFi Tokens</h5>
                        <ul className="text-zinc-400 text-sm space-y-1">
                          <li>• Uniswap (UNI)</li>
                          <li>• Aave (AAVE)</li>
                          <li>• Compound (COMP)</li>
                          <li>• Chainlink (LINK)</li>
                          <li>• And 180+ more...</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section id="security" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-medium text-white mb-6">Security</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-white mb-3">Security Best Practices</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Your security is our top priority. Follow these best practices to keep your assets safe.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">🔐 Account Security</h4>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Enable 2FA authentication</li>
                        <li>• Use strong, unique passwords</li>
                        <li>• Enable biometric verification</li>
                        <li>• Regular security checkups</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">🔑 Wallet Security</h4>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Secure seed phrase storage</li>
                        <li>• Hardware wallet integration</li>
                        <li>• Transaction verification</li>
                        <li>• Regular backup procedures</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">Multi-Factor Authentication (2FA)</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Add an extra layer of security to your account with 2FA.
                  </p>
                  
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                      <div>
                        <h4 className="text-white font-medium">Install Authenticator App</h4>
                        <p className="text-zinc-400 text-sm mt-1">Download Google Authenticator, Authy, or similar app.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                      <div>
                        <h4 className="text-white font-medium">Scan QR Code</h4>
                        <p className="text-zinc-400 text-sm mt-1">In Dexari settings, scan the QR code with your authenticator app.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                      <div>
                        <h4 className="text-white font-medium">Enter Verification Code</h4>
                        <p className="text-zinc-400 text-sm mt-1">Input the 6-digit code to complete 2FA setup.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#e5dbb7] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                      <div>
                        <h4 className="text-white font-medium">Save Backup Codes</h4>
                        <p className="text-zinc-400 text-sm mt-1">Store backup codes in a safe place for account recovery.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">Wallet Integration Security</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Understand how Dexari securely integrates with your wallet.
                  </p>
                  
                  <div className="mt-4 p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                    <h4 className="text-white font-medium mb-3">🛡️ Security Features</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-[#e5dbb7] font-medium text-sm">Non-Custodial Architecture</h5>
                        <p className="text-zinc-400 text-sm">Your private keys never leave your device. Dexari cannot access your funds.</p>
                      </div>
                      <div>
                        <h5 className="text-[#e5dbb7] font-medium text-sm">Transaction Signing</h5>
                        <p className="text-zinc-400 text-sm">All transactions require your explicit approval and wallet signature.</p>
                      </div>
                      <div>
                        <h5 className="text-[#e5dbb7] font-medium text-sm">Secure Communication</h5>
                        <p className="text-zinc-400 text-sm">End-to-end encryption for all data transmission and storage.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">Phishing Protection</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Learn to identify and avoid phishing attempts targeting crypto users.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">⚠️ Red Flags</h4>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Urgent action required emails</li>
                        <li>• Suspicious links or domains</li>
                        <li>• Requests for private keys</li>
                        <li>• Fake support contacts</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">✅ Safe Practices</h4>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Always verify URLs</li>
                        <li>• Use official app stores</li>
                        <li>• Contact support directly</li>
                        <li>• Never share private keys</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* API Section */}
            <section id="api" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-medium text-white mb-6">API Reference</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-white mb-3">Developer Documentation</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Build powerful trading applications with Dexari&apos;s comprehensive API.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">REST API</h4>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Market data endpoints</li>
                        <li>• Account information</li>
                        <li>• Order management</li>
                        <li>• Trade history</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">WebSocket API</h4>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Real-time price feeds</li>
                        <li>• Order book updates</li>
                        <li>• Trade executions</li>
                        <li>• Account notifications</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">Authentication</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Secure API access using industry-standard authentication methods.
                  </p>
                  
                  <div className="mt-4 p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                    <h4 className="text-white font-medium mb-3">API Key Setup</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-[#e5dbb7] font-medium text-sm">Generate API Keys</h5>
                        <p className="text-zinc-400 text-sm">Create API keys in your account settings with specific permissions.</p>
                  </div>
                      <div>
                        <h5 className="text-[#e5dbb7] font-medium text-sm">Request Signing</h5>
                        <p className="text-zinc-400 text-sm">All requests must be signed using HMAC-SHA256 with your secret key.</p>
                      </div>
                      <div>
                        <h5 className="text-[#e5dbb7] font-medium text-sm">Rate Limiting</h5>
                        <p className="text-zinc-400 text-sm">API calls are limited to ensure fair usage and system stability.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">Code Examples</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Sample code snippets to get you started quickly.
                  </p>
                  
                  <div className="mt-4 p-4 bg-[#1a1a1a] rounded-lg border border-zinc-700">
                    <h4 className="text-white font-medium mb-2">Get Market Data</h4>
                    <pre className="text-[#e5dbb7] text-sm overflow-x-auto">
{`curl -X GET "https://api.dexari.com/v1/ticker/BTCUSDT" \\
  -H "X-API-Key: your_api_key" \\
  -H "Content-Type: application/json"`}
                    </pre>
                  </div>
                  
                  <div className="mt-4 p-4 bg-[#1a1a1a] rounded-lg border border-zinc-700">
                    <h4 className="text-white font-medium mb-2">Place Order</h4>
                    <pre className="text-[#e5dbb7] text-sm overflow-x-auto">
{`curl -X POST "https://api.dexari.com/v1/orders" \\
  -H "X-API-Key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "symbol": "BTCUSDT",
    "side": "buy",
    "type": "limit",
    "quantity": "0.001",
    "price": "45000"
  }'`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Support Section */}
            <section id="support" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-medium text-white mb-6">Support</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-white mb-3">Getting Help</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Multiple ways to get support when you need assistance with Dexari.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">📧 Email Support</h4>
                      <p className="text-zinc-400 text-sm mb-2">support@dexari.com</p>
                      <p className="text-zinc-400 text-sm">Response time: 24-48 hours</p>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">💬 Live Chat</h4>
                      <p className="text-zinc-400 text-sm mb-2">Available in the app</p>
                      <p className="text-zinc-400 text-sm">Mon-Fri: 9 AM - 6 PM UTC</p>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">🎮 Discord Community</h4>
                      <p className="text-zinc-400 text-sm mb-2">Join our Discord server</p>
                      <p className="text-zinc-400 text-sm">Community support 24/7</p>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">📚 Knowledge Base</h4>
                      <p className="text-zinc-400 text-sm mb-2">Self-service articles</p>
                      <p className="text-zinc-400 text-sm">Instant answers to common questions</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">Frequently Asked Questions</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Quick answers to the most common questions about Dexari.
                  </p>
                  
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">How do I fund my account?</h4>
                      <p className="text-zinc-400 text-sm">You can fund your account via bank transfer, credit/debit card, or by transferring cryptocurrency from another wallet.</p>
                  </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">What are the trading fees?</h4>
                      <p className="text-zinc-400 text-sm">Trading fees start at 0.1% for makers and 0.15% for takers, with discounts available based on trading volume.</p>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Is my crypto safe on Dexari?</h4>
                      <p className="text-zinc-400 text-sm">Yes, Dexari is non-custodial, meaning you maintain control of your private keys and funds at all times.</p>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Can I use Dexari on multiple devices?</h4>
                      <p className="text-zinc-400 text-sm">Yes, you can access your account from multiple devices. Just ensure you have proper security measures in place.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-white mb-3">Troubleshooting</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Common issues and their solutions.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Connection Issues</h4>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Check internet connection</li>
                        <li>• Restart the app</li>
                        <li>• Clear app cache</li>
                        <li>• Update to latest version</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#2a2a2c] rounded-lg border border-zinc-700">
                      <h4 className="text-white font-medium mb-2">Transaction Problems</h4>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Verify wallet connection</li>
                        <li>• Check gas fees</li>
                        <li>• Confirm network status</li>
                        <li>• Review transaction details</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Terms Section */}
            <section id="terms" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-medium text-white mb-6">Terms of Service</h2>
              
              <div className="space-y-8">
                <div>
                  <p className="text-zinc-400 leading-relaxed">
                    Our terms of service outline the rules and guidelines for using Dexari.
                  </p>
                  <div className="mt-4 p-4 bg-[#2a2a2c] rounded-lg">
                    <p className="text-zinc-300 text-sm italic">
                      Content coming soon - Terms of service will be added here.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy Section */}
            <section id="privacy" className="scroll-mt-20">
              <h2 className="text-2xl min-[900px]:text-3xl font-medium text-white mb-6">Privacy Policy</h2>
              
              <div className="space-y-8">
                <div>
                  <p className="text-zinc-400 leading-relaxed">
                    Learn about how we handle and protect your data and privacy.
                  </p>
                  <div className="mt-4 p-4 bg-[#2a2a2c] rounded-lg">
                    <p className="text-zinc-300 text-sm italic">
                      Content coming soon - Privacy policy will be added here.
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
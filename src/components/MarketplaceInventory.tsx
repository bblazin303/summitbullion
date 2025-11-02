"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import type { Inventory, SearchResult } from '@/types/platformGold';
import { fetchInventory, applyMarkup, getMetalDisplayName, isAvailableForPurchase } from '@/lib/platformGoldApi';

// Import product images (fallback)
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
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedProducts, setDisplayedProducts] = useState<number>(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [hasMoreFromAPI, setHasMoreFromAPI] = useState<boolean>(true);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  // Use known counts as default (from Platform Gold API analysis)
  // "All" shows total products in database (impressive number)
  // Specific metals show actual available counts (accurate filtering)
  const [metalCounts, setMetalCounts] = useState<{ [key: string]: number }>({
    All: 2737, // Total products in Platform Gold database
    Gold: 556,
    Silver: 638,
    Platinum: 27,
    Palladium: 8
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchDropdownResults, setSearchDropdownResults] = useState<SearchResult[]>([]);
  const [searchOffset, setSearchOffset] = useState<number>(0);
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState<boolean>(false);
  const [isLoadingMoreSearch, setIsLoadingMoreSearch] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isFilterLoading, setIsFilterLoading] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const searchLoadMoreRef = useRef<HTMLDivElement>(null);
  const filterAbortControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();

  // Sort options
  const sortOptions = [
    'Default',
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

  // Fetch metal counts on mount
  useEffect(() => {
    const loadMetalCounts = async () => {
      try {
        const response = await fetch('/api/platform-gold/metadata');
        const counts = await response.json();
        setMetalCounts(counts);
        console.log('📊 Metal counts loaded:', counts);
      } catch (err) {
        console.error('Failed to load metal counts:', err);
      }
    };
    loadMetalCounts();
  }, []);

  // Fetch inventory from Platform Gold API
  useEffect(() => {
    const loadInventory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch first 100 products
        const response = await fetchInventory(100, 0);
        
        // Filter to only available items
        const availableItems = response.records.filter(isAvailableForPurchase);
        console.log(`✅ Loaded ${availableItems.length} available products from ${response.records.length} fetched`);
        console.log(`📦 Total products in Platform Gold: ${response.totalCount}`);
        
        // Log pricing example
        if (availableItems.length > 0) {
          const sample = availableItems[0];
          const markedUpPrice = applyMarkup(sample.askPrice, 2);
          console.log(`📊 Pricing Example: "${sample.name}"`);
          console.log(`   Platform Gold price: $${sample.askPrice.toFixed(2)}`);
          console.log(`   Your price (2% markup): $${markedUpPrice.toFixed(2)}`);
          console.log(`   Markup amount: $${(markedUpPrice - sample.askPrice).toFixed(2)}`);
        }
        
        setInventory(availableItems);
        setCurrentOffset(100);
        setHasMoreFromAPI(response.nextPage !== null);
      } catch (err) {
        console.error('Failed to load inventory:', err);
        setError(err instanceof Error ? err.message : 'Failed to load inventory. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInventory();
  }, []);

  // Debounced autocomplete search (initial search)
  useEffect(() => {
    const performSearch = async () => {
      const query = searchQuery.trim();
      
      if (!query) {
        setSearchDropdownResults([]);
        setSearchOffset(0);
        setHasMoreSearchResults(false);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setSearchOffset(0); // Reset offset for new search
      setHasSearched(false); // Reset for new search

      try {
        console.log(`🔍 Searching for: "${query}"`);
        const response = await fetch(`/api/platform-gold/search?q=${encodeURIComponent(query)}&offset=0`);
        const data = await response.json();
        
        setSearchDropdownResults(data.results || []);
        setHasMoreSearchResults(data.hasMore || false);
        setHasSearched(true); // Mark that search has completed
        console.log(`✅ Found ${data.results?.length || 0} matching products (hasMore: ${data.hasMore})`);
      } catch (err) {
        console.error('Search failed:', err);
        setSearchDropdownResults([]);
        setHasMoreSearchResults(false);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search - wait 300ms after user stops typing
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Infinite scroll for search dropdown
  useEffect(() => {
    const currentRef = searchLoadMoreRef.current;
    if (!currentRef || !hasMoreSearchResults) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && !isLoadingMoreSearch) {
          setIsLoadingMoreSearch(true);
          
          const newOffset = searchOffset + 20;
          
          try {
            console.log(`🔄 Loading more search results (offset: ${newOffset})...`);
            const response = await fetch(
              `/api/platform-gold/search?q=${encodeURIComponent(searchQuery)}&offset=${newOffset}`
            );
            const data = await response.json();
            
            setSearchDropdownResults(prev => [...prev, ...(data.results || [])]);
            setSearchOffset(newOffset);
            setHasMoreSearchResults(data.hasMore || false);
            console.log(`✅ Loaded ${data.results?.length || 0} more results`);
          } catch (err) {
            console.error('Failed to load more search results:', err);
          } finally {
            setIsLoadingMoreSearch(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMoreSearchResults, isLoadingMoreSearch, searchOffset, searchQuery]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Infinite scroll - load more products
  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef || isLoading) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          
          // Check if we need to fetch more from API (works with or without filter)
          const needsMoreFromAPI = displayedProducts + 20 > inventory.length && hasMoreFromAPI;
          
          if (needsMoreFromAPI) {
            try {
              console.log(`🔄 Fetching more products from API (offset: ${currentOffset}, filter: ${selectedFilter})...`);
              
              // For filtered views, we might need to fetch multiple batches to get enough items
              let newItems: Inventory[] = [];
              let tempOffset = currentOffset;
              let stillHasMore = true;
              const maxAttempts = 5; // Try up to 5 batches to find filtered items
              let attempts = 0;
              
              while (newItems.length < 20 && stillHasMore && attempts < maxAttempts) {
                const response = await fetchInventory(100, tempOffset, undefined, selectedFilter);
                const newAvailable = response.records.filter(isAvailableForPurchase);
                
                newItems = [...newItems, ...newAvailable];
                tempOffset += 100;
                stillHasMore = response.nextPage !== null;
                attempts++;
                
                console.log(`📦 Attempt ${attempts}: Found ${newAvailable.length} items (${newItems.length} total new items)`);
                
                // If we got nothing and there's no more to fetch, stop
                if (newAvailable.length === 0 && !stillHasMore) break;
              }
              
              setInventory(prev => [...prev, ...newItems]);
              setCurrentOffset(tempOffset);
              setHasMoreFromAPI(stillHasMore && inventory.length + newItems.length < (metalCounts[selectedFilter] || 10000));
              
              console.log(`✅ Loaded ${newItems.length} more ${selectedFilter} products (total: ${inventory.length + newItems.length})`);
            } catch (err) {
              console.error('Failed to load more products:', err);
            }
          }
          
          // Show 20 more products
          setTimeout(() => {
            setDisplayedProducts(prev => prev + 20);
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isLoading, isLoadingMore, displayedProducts, inventory.length, hasMoreFromAPI, currentOffset, selectedFilter, metalCounts]);

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

  // Animate products when they load
  useEffect(() => {
    if (!isLoading && !error && productsRef.current && inventory.length > 0) {
    const ctx = gsap.context(() => {
        gsap.fromTo(
          productsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
      }, productsRef);

    return () => ctx.revert();
    }
  }, [isLoading, error, inventory.length]);

  const handleSortSelect = (option: string) => {
    setSelectedSort(option);
    setIsSortOpen(false);
  };

  const handleFilterSelect = async (option: string) => {
    // Abort any ongoing filter search immediately
    if (filterAbortControllerRef.current) {
      console.log('🛑 Aborting previous filter search');
      try {
        filterAbortControllerRef.current.abort();
      } catch {
        // Silently ignore abort errors - this is expected behavior
      }
      filterAbortControllerRef.current = null;
    }
    
    // Create new abort controller for this search
    const abortController = new AbortController();
    filterAbortControllerRef.current = abortController;
    
    setSelectedFilter(option);
    setIsFilterOpen(false);
    setIsLoading(true);
    
    // Reset state for fresh filter view
    setInventory([]);
    setDisplayedProducts(0);
    setCurrentOffset(0);
    setHasMoreFromAPI(true);
    
    // Get the known count for this filter to determine how many to fetch
    const targetCount = metalCounts[option] || 20;
    const isRareMetal = targetCount <= 50; // Platinum (27), Palladium (8)
    
    // Only show spinner for rare metals that require deep searching
    if (isRareMetal) {
      setIsFilterLoading(true);
    }
    
    // Scroll to top of inventory section (keeping sticky header visible)
    if (sectionRef.current) {
      // Use offsetTop to get the actual position in the document, not relative to viewport
      const sectionTop = sectionRef.current.offsetTop;
      // Scroll to section top with small offset for breathing room
      window.scrollTo({ top: sectionTop - 40, behavior: 'smooth' });
    }
    
    try {
      console.log(`🔍 Filtering by: ${option}`);
      console.log(`📊 Target: ${targetCount} ${option} products${isRareMetal ? ' (rare metal - deep search)' : ''}`);
      
      let allItems: Inventory[] = [];
      let offset = 0;
      let hasMore = true;
      let batchesFetched = 0;
      let consecutiveEmptyBatches = 0;
      
      // For rare metals (Platinum, Palladium): Do deep search and load ALL items
      // For common metals (All, Gold, Silver): Load first batch only and use infinite scroll
      if (isRareMetal) {
        // RARE METAL DEEP SEARCH - Load all items upfront
        const maxBatchesToFetch = 30; // Fetch up to 30 batches (3000 products)
        const maxConsecutiveEmpty = 15; // Allow more empty batches for rare metals
        
        console.log('🔍 Deep search mode: Loading all items...');
        
        while (allItems.length < targetCount && hasMore && batchesFetched < maxBatchesToFetch) {
          const response = await fetchInventory(100, offset, undefined, option, abortController.signal);
          const availableItems = response.records.filter(isAvailableForPurchase);
          
          allItems = [...allItems, ...availableItems];
          offset += 100;
          hasMore = response.nextPage !== null;
          batchesFetched++;
          
          console.log(`📦 Batch ${batchesFetched}: Found ${availableItems.length} ${option} items (${allItems.length}/${targetCount} total)`);
          
          // Update UI progressively as items come in
          if (availableItems.length > 0) {
            setInventory([...allItems]); // Show what we have so far
            setDisplayedProducts(allItems.length); // Display all found items
            // Turn off loading after first batch with items so users can see products
            if (batchesFetched === 1 || (batchesFetched === 2 && allItems.length > 0)) {
              setIsLoading(false);
            }
            consecutiveEmptyBatches = 0; // Reset counter when we find items
          } else {
            consecutiveEmptyBatches++;
            
            // For rare metals, be more patient - search deeper
            if (consecutiveEmptyBatches >= maxConsecutiveEmpty) {
              console.log(`⚠️ Stopping after ${consecutiveEmptyBatches} consecutive empty batches`);
              break;
            }
          }
          
          // Stop if we reached the end of inventory
          if (!hasMore) {
            console.log('📭 Reached end of inventory');
            break;
          }
        }
        
        // Final update for rare metals
        setInventory(allItems);
        setCurrentOffset(offset);
        setHasMoreFromAPI(hasMore && allItems.length < targetCount);
        setDisplayedProducts(allItems.length);
      } else {
        // COMMON METAL QUICK LOAD - Load first batch only, use infinite scroll for more
        console.log('⚡ Quick load mode: Loading first batch...');
        
        const response = await fetchInventory(100, offset, undefined, option, abortController.signal);
        const availableItems = response.records.filter(isAvailableForPurchase);
        
        allItems = availableItems;
        offset += 100;
        hasMore = response.nextPage !== null;
        
        console.log(`📦 Loaded ${allItems.length} ${option} items from first batch`);
        
        // Set state for quick display
        setInventory(allItems);
        setCurrentOffset(offset);
        setHasMoreFromAPI(hasMore);
        setDisplayedProducts(20); // Show only 20 initially, infinite scroll will load more
      }
      
      // Log results
      if (isRareMetal) {
        if (allItems.length < targetCount) {
          console.log(`⚠️ Found ${allItems.length} of ${targetCount} expected ${option} products`);
        } else {
          console.log(`✅ Loaded all ${allItems.length} ${option} products`);
        }
      } else {
        console.log(`✅ Showing ${Math.min(20, allItems.length)} of ${allItems.length} ${option} products (more will load on scroll)`);
      }
      
      // Clear the abort controller ref if this is the current one
      if (filterAbortControllerRef.current === abortController) {
        filterAbortControllerRef.current = null;
      }
    } catch (err) {
      // If the request was aborted, it's because the user selected a different filter
      // Don't show an error or log it - this is expected behavior
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('✋ Filter search cancelled by user');
        return; // Exit early, don't update state
      }
      // Some browsers throw DOMException for abort errors
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.log('✋ Filter search cancelled by user');
        return; // Exit early, don't update state
      }
      console.error('Failed to filter inventory:', err);
    } finally {
      // Only clear loading states if this is still the active controller
      // (i.e., hasn't been aborted and replaced)
      if (filterAbortControllerRef.current === abortController || filterAbortControllerRef.current === null) {
        setIsLoading(false);
        setIsFilterLoading(false); // Hide spinner in filter button
      }
    }
  };

  // Helper function to get fallback image based on metal type
  const getFallbackImage = (metalSymbol: string): StaticImageData => {
    const imageMap: { [key: string]: StaticImageData } = {
      'XAU': ProductImage2, // Gold
      'XAG': ProductImage4, // Silver
      'XPT': ProductImage3, // Platinum
      'XPD': ProductImage3  // Palladium
    };
    return imageMap[metalSymbol] || ProductImage1;
  };

  // Always use regular inventory for the grid (search is now autocomplete only)
  const inventoryToDisplay = inventory;

  // Transform Platform Gold inventory to our product format (without badge initially)
  const allProductsWithoutBadges = inventoryToDisplay.map((item) => {
    // Apply 2% markup to the ask price
    const markedUpPrice = applyMarkup(item.askPrice, 2);
    
    // Calculate SOL amount (placeholder - would need current SOL price)
    const solAmount = (markedUpPrice / 180).toFixed(4); // Assuming ~$180 per SOL
    
    return {
      id: item.id,
      title: item.name,
      description: `${item.manufacturer ? item.manufacturer + ' - ' : ''}${item.metalOz} oz ${getMetalDisplayName(item.metalSymbol)} - ${item.purity} purity`,
      priceUSD: markedUpPrice,
      pricePerOz: item.metalOz > 0 ? markedUpPrice / item.metalOz : 0, // Calculate price per ounce
      solAmount: solAmount,
      image: item.mainImage || getFallbackImage(item.metalSymbol),
      imageAlt: item.name.toLowerCase(),
      badge: null as string | null, // Will be calculated below
      metal: getMetalDisplayName(item.metalSymbol),
      metalSymbol: item.metalSymbol,
      weight: item.metalOz,
      year: item.year ? parseInt(item.year) : new Date().getFullYear(),
      sku: item.sku,
      stockStatus: item.stockStatus,
      sellQuantity: item.sellQuantity
    };
  });

  // Calculate "BEST VALUE" badges based on price per ounce within each metal type
  // Group products by metal type
  const productsByMetal = allProductsWithoutBadges.reduce((acc, product) => {
    if (!acc[product.metalSymbol]) {
      acc[product.metalSymbol] = [];
    }
    acc[product.metalSymbol].push(product);
    return acc;
  }, {} as Record<string, typeof allProductsWithoutBadges>);

  // For each metal type, find the best values (bottom 20% of price per oz with good stock)
  Object.values(productsByMetal).forEach((metalProducts) => {
    // Only consider items with good availability (>50 in stock)
    const availableProducts = metalProducts.filter(p => p.sellQuantity > 50 && p.pricePerOz > 0);
    
    if (availableProducts.length > 0) {
      // Sort by price per ounce (lowest first)
      const sortedByValue = [...availableProducts].sort((a, b) => a.pricePerOz - b.pricePerOz);
      
      // Award "BEST VALUE" to top 15% of best deals (minimum 1, maximum 3 per metal type)
      const badgeCount = Math.min(3, Math.max(1, Math.ceil(sortedByValue.length * 0.15)));
      
      for (let i = 0; i < badgeCount; i++) {
        sortedByValue[i].badge = "BEST VALUE";
      }
    }
  });

  const allProducts = allProductsWithoutBadges;

  // No client-side filtering needed - already filtered on server
  // The inventory state already contains the correct filtered products from the API
  const filteredProducts = allProducts;

  // Sort filtered products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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
      case 'Default':
      default:
        return 0;
    }
  });

  // Limit displayed products for performance (lazy loading)
  const products = sortedProducts.slice(0, displayedProducts);
  const hasMoreProducts = displayedProducts < sortedProducts.length;
  const totalProducts = sortedProducts.length;

  return (
    <div ref={sectionRef} className="bg-[#fcf8f1] relative w-full mt-[48px] py-12 sm:py-16 lg:py-0 px-4 sm:px-8 md:px-16 lg:px-[120px] 2xl:px-[200px]">
      {/* Header with Title and Filters - Sticky */}
      <div 
        ref={headerRef}
        className="sticky top-0 z-40 bg-[#fcf8f1] pb-6 sm:pb-8 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-6"
      >
        {/* Title */}
        <div className="flex flex-col gap-2">
        <h2 className="font-inter font-bold text-[32px] sm:text-[36px] lg:text-[42px] leading-[1.1]">
          <span className="text-[#ffc633]">Shop </span>
          <span className="text-slate-900">Our Inventory</span>
        </h2>
          {!isLoading && !error && products.length > 0 && (
            <p className="font-inter text-[14px] sm:text-[16px] text-[#7c7c7c]">
              {selectedFilter !== 'All' ? (
                <>
                  Showing {products.length} of {metalCounts[selectedFilter] || 0} {selectedFilter} products in inventory
                </>
              ) : (
                <>
                  Showing {Math.min(displayedProducts, products.length)} of {metalCounts.All || 0} products in inventory
                </>
              )}
            </p>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-[10px] w-full sm:w-auto">
          {/* Search Input with Autocomplete Dropdown */}
          <div className="relative w-full sm:w-[280px]">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-[48px] px-5 pr-12 py-4 border border-[#7c7c7c] rounded-[62px] font-inter font-normal text-[16px] text-black placeholder:text-[#7c7c7c] focus:outline-none focus:border-black transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7c7c7c] hover:text-black transition-colors z-10"
                aria-label="Clear search"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
            {!searchQuery && !isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="#7c7c7c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#ffc633]"></div>
              </div>
            )}

            {/* Autocomplete Dropdown */}
            {searchQuery.trim() && (
              <div
                ref={searchDropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#d4af37]/20 rounded-[20px] shadow-[0_8px_31.1px_-9px_rgba(0,0,0,0.25)] z-50 max-h-[320px] overflow-y-auto"
              >
                {/* Show skeleton while waiting for results */}
                {searchDropdownResults.length === 0 && !hasSearched && (
                  <>
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={`skeleton-${index}`}
                        className={`w-full p-3 flex items-center gap-3 border-b border-gray-100 ${
                          index === 0 ? 'rounded-t-[20px]' : ''
                        } ${index === 4 ? 'border-b-0 rounded-b-[20px]' : ''}`}
                      >
                        {/* Skeleton Thumbnail */}
                        <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded-lg animate-pulse"></div>
                        
                        {/* Skeleton Product Info */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="bg-gray-200 h-4 w-3/4 rounded animate-pulse"></div>
                          <div className="bg-gray-200 h-3 w-1/2 rounded animate-pulse"></div>
                        </div>
                        
                        {/* Skeleton Price */}
                        <div className="flex-shrink-0">
                          <div className="bg-gray-200 h-4 w-16 rounded animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* No Results State - only show after search completes */}
                {searchDropdownResults.length === 0 && hasSearched && (
                  <div className="p-4 text-center text-[#7c7c7c] font-inter text-[14px]">
                    No products found
                  </div>
                )}

                {/* Actual Results */}
                {searchDropdownResults.length > 0 && searchDropdownResults.map((result, index) => {
                  const priceWithMarkup = applyMarkup(result.askPrice, 2);
                  const isLast = index === searchDropdownResults.length - 1;
                  return (
                    <button
                      key={`${result.id}-${index}`}
                      onClick={() => {
                        router.push(`/marketplace/${result.id}`);
                        setSearchQuery('');
                      }}
                      className={`w-full p-3 flex items-center gap-3 hover:bg-[#fff2da] transition-colors border-b border-gray-100 text-left cursor-pointer ${
                        index === 0 ? 'rounded-t-[20px]' : ''
                      } ${isLast && !hasMoreSearchResults ? 'border-b-0 rounded-b-[20px]' : ''}`}
                    >
                      {/* Thumbnail */}
                      <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                        {result.mainImage ? (
                          <Image
                            src={result.mainImage}
                            alt={result.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-inter font-medium text-[14px] text-black truncate">
                          {result.name}
                        </p>
                        <p className="font-inter text-[12px] text-[#7c7c7c] truncate">
                          {result.manufacturer} • SKU: {result.sku}
                        </p>
                      </div>
                      
                      {/* Price */}
                      <div className="flex-shrink-0 text-right">
                        <p className="font-inter font-semibold text-[14px] text-[#ffc633]">
                          ${priceWithMarkup.toFixed(2)}
                        </p>
                      </div>
                    </button>
                  );
                })}
                
                {/* Load More Trigger */}
                {hasMoreSearchResults && (
                  <div 
                    ref={searchLoadMoreRef}
                    className="p-3 flex items-center justify-center border-t border-gray-100"
                  >
                    {isLoadingMoreSearch ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ffc633]"></div>
                        <span className="font-inter text-[12px] text-[#7c7c7c]">Loading more...</span>
                      </div>
                    ) : (
                      <span className="font-inter text-[12px] text-[#7c7c7c]">Scroll for more results</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filters Container */}
        <div className="flex gap-[10px]">
          {/* Sort By Filter */}
          <div className="relative">
            <button 
              ref={sortButtonRef}
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`flex items-center justify-between gap-3 px-5 py-4 h-[48px] border rounded-[62px] transition-all focus:outline-none cursor-pointer ${
                isSortOpen || selectedSort !== 'Default'
                  ? 'bg-black border-black' 
                  : 'bg-[#fcf8f1] border-[#7c7c7c] hover:border-black'
              }`}
            >
              <span className={`font-inter font-normal text-[16px] whitespace-nowrap ${
                isSortOpen || selectedSort !== 'Default' ? 'text-white' : 'text-black'
              }`}>
                {selectedSort !== 'Default' ? `Sort by: ${selectedSort}` : 'Sort by'}
              </span>
              <div className={`relative w-4 h-4 ${isSortOpen || selectedSort !== 'Default' ? 'brightness-0 invert' : ''}`}>
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
              className={`flex items-center justify-between gap-3 px-5 py-4 h-[48px] border rounded-[62px] transition-all focus:outline-none cursor-pointer ${
                isFilterOpen || selectedFilter !== 'All'
                  ? 'bg-black border-black' 
                  : 'bg-[#fcf8f1] border-[#7c7c7c] hover:border-black'
              }`}
            >
              <div className="flex items-center gap-[9px]">
                <div className="relative w-6 h-6 flex items-center justify-center">
                  {isFilterLoading ? (
                    <div className="w-5 h-5 border-2 rounded-full animate-spin"
                      style={{
                        borderLeftColor: isFilterOpen || selectedFilter !== 'All' ? 'white' : 'black',
                        borderRightColor: isFilterOpen || selectedFilter !== 'All' ? 'white' : 'black',
                        borderBottomColor: isFilterOpen || selectedFilter !== 'All' ? 'white' : 'black',
                        borderTopColor: 'transparent'
                      }}
                    />
                  ) : (
                    <div className={`relative w-6 h-6 ${isFilterOpen || selectedFilter !== 'All' ? 'brightness-0 invert' : ''}`}>
                  <Image
                    src={FilterIcon}
                    alt=""
                    fill
                    className="object-contain"
                  />
                    </div>
                  )}
                </div>
                <span className={`font-inter font-normal text-[16px] whitespace-nowrap ${
                  isFilterOpen || selectedFilter !== 'All' ? 'text-white' : 'text-black'
                }`}>
                  {selectedFilter !== 'All' ? `Filter by Metals: ${selectedFilter}` : 'Filter by Metals'}
                </span>
              </div>
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Loading State - Skeleton Cards */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-[14px] max-w-full">
          {[...Array((metalCounts[selectedFilter] || 20) <= 50 ? (metalCounts[selectedFilter] || 20) : 20)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 flex flex-col min-h-[460px] sm:min-h-[500px] lg:min-h-[534px] animate-pulse"
            >
              {/* Skeleton Image */}
              <div className="bg-gray-200 h-[160px] sm:h-[180px] lg:h-[200px] w-full rounded-lg mb-6 sm:mb-8 lg:mb-[43px]"></div>

              {/* Skeleton Content */}
              <div className="flex flex-col gap-3 sm:gap-4 flex-1">
                {/* Skeleton Title */}
                <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
                
                {/* Skeleton Description */}
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                  <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Skeleton Price */}
                <div className="space-y-2">
                  <div className="bg-gray-200 h-6 w-2/3 rounded"></div>
                </div>

                {/* Skeleton Button */}
                <div className="bg-gray-200 h-[50px] w-full rounded-[42px] mt-6"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && (
      <div 
        ref={productsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-[14px] max-w-full"
      >
          {products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-[#7c7c7c] text-lg">No products available at this time.</p>
            </div>
          ) : (
            products.map((product) => (
          <div 
            key={product.id}
            onClick={() => {
              setLoadingProductId(product.id.toString());
              router.push(`/marketplace/${product.id}`);
            }}
            className="bg-white rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 flex flex-col relative min-h-[460px] sm:min-h-[500px] lg:min-h-[534px] hover:shadow-lg transition-shadow duration-300 cursor-pointer"
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
                {typeof product.image === 'string' ? (
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  className="object-contain"
                    unoptimized
                  />
                ) : (
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  className="object-contain"
                />
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-3 sm:gap-4 flex-1">
              {/* Title */}
              <h3 className="font-inter font-semibold text-[20px] sm:text-[22px] lg:text-[24px] leading-[1.14] text-black overflow-hidden text-ellipsis" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {product.title}
              </h3>

              {/* Description */}
              <p className="font-inter font-medium text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.57] text-[#7c7c7c] overflow-hidden text-ellipsis" style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                {product.description}
              </p>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Price Section */}
              <div className="flex flex-col gap-[6px]">
                {/* USD Price */}
                <div className="font-inter font-medium text-[18px] sm:text-[19px] lg:text-[20px] leading-[1.37] text-black">
                  ${product.priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD*
                </div>
                <div className="font-inter text-[10px] text-[#7c7c7c] leading-tight">
                  *Est. price, final at checkout
                </div>

                {/* SOL Price - Commented out */}
                {/* <div className="flex items-center gap-[6px]">
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
                </div> */}
              </div>

              {/* View Product Button */}
              <div className="bg-[#141722] text-[#efe9e0] px-7 py-[17px] rounded-[42px] font-inter font-medium text-[13px] sm:text-[14px] uppercase tracking-wider hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:from-[4.98%] hover:to-[#FFB546] hover:to-[95.02%] hover:text-black transition-all duration-300 w-full text-center flex items-center justify-center gap-2 mt-6">
                {loadingProductId === product.id.toString() && (
                  <div className="w-4 h-4 border-2 rounded-full animate-spin border-current border-t-transparent" />
                )}
                <span>View Product</span>
              </div>
            </div>
          </div>
            ))
          )}
        </div>
      )}

      {/* Load More Trigger */}
      {!isLoading && !error && hasMoreProducts && (
        <>
          <div ref={loadMoreRef} className="h-4" />
          {isLoadingMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-[14px] max-w-full mt-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={`loading-skeleton-${index}`}
                  className="bg-white rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 flex flex-col min-h-[460px] sm:min-h-[500px] lg:min-h-[534px] animate-pulse"
                >
                  {/* Skeleton Image */}
                  <div className="bg-gray-200 h-[160px] sm:h-[180px] lg:h-[200px] w-full rounded-lg mb-6 sm:mb-8 lg:mb-[43px]"></div>

                  {/* Skeleton Content */}
                  <div className="flex flex-col gap-3 sm:gap-4 flex-1">
                    {/* Skeleton Title */}
                    <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
                    
                    {/* Skeleton Description */}
                    <div className="space-y-2">
                      <div className="bg-gray-200 h-4 w-full rounded"></div>
                      <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Skeleton Price */}
                    <div className="space-y-2">
                      <div className="bg-gray-200 h-6 w-2/3 rounded"></div>
                    </div>

                    {/* Skeleton Button */}
                    <div className="bg-gray-200 h-[50px] w-full rounded-[42px] mt-6"></div>
                  </div>
                </div>
        ))}
      </div>
          )}
        </>
      )}

      {/* End of Products Message */}
      {!isLoading && !error && !hasMoreProducts && totalProducts > 20 && (
        <div className="w-full py-8 text-center">
          <p className="font-inter text-[16px] text-[#7c7c7c]">
            You&apos;ve viewed all {totalProducts} products
          </p>
        </div>
      )}

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
                className="w-full flex items-center gap-3 h-[32px] px-3 rounded-[8px] hover:bg-[#fff2da] transition-colors focus:outline-none cursor-pointer"
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
                className={`w-full flex items-center h-[32px] px-3 rounded-[8px] transition-colors focus:outline-none cursor-pointer ${
                  selectedFilter === option 
                    ? 'bg-[#fff2da]' 
                    : 'hover:bg-[#fff2da]'
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


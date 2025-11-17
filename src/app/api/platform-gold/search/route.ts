import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.platform.gold/public/v2';

// Simple in-memory token cache
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getAuthToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const email = process.env.PLATFORM_GOLD_EMAIL;
  const password = process.env.PLATFORM_GOLD_PASSWORD;

  if (!email || !password) {
    throw new Error('Platform Gold credentials not configured');
  }

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Failed to authenticate: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = data.token;
  // Cache token for 23 hours (tokens typically last 24 hours)
  tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
  
  if (!cachedToken) {
    throw new Error('No token received from Platform Gold');
  }
  
  return cachedToken;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = 20; // Return 20 results per page
    
    if (!query.trim()) {
      return NextResponse.json({ results: [], hasMore: false });
    }

    const token = await getAuthToken();
    
    // Fetch more items from the API to search through
    // We'll fetch 100 at a time and filter them
    const batchSize = 100;
    const apiBatchOffset = Math.floor(offset / batchSize) * batchSize;
    
    interface SearchMatch {
      id: number;
      sku: string;
      name: string;
      manufacturer: string;
      askPrice: number;
      mainImage: string;
      metalSymbol: string;
    }
    
    let allMatches: SearchMatch[] = [];
    let currentApiOffset = apiBatchOffset;
    let hasMoreFromApi = true;
    
    // Keep fetching until we have enough results or run out
    while (allMatches.length < offset + limit && hasMoreFromApi) {
      const response = await fetch(
        `${API_BASE_URL}/inventory?limit=${batchSize}&offset=${currentApiOffset}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to search inventory: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !Array.isArray(data.records)) {
        break;
      }

      // Filter and search through available products
      interface ApiItem {
        sellQuantity: number;
        stockStatus?: string;
        name?: string;
        sku?: string;
        manufacturer?: string;
        id: number;
        askPrice: number;
        mainImage: string;
        metalSymbol: string;
      }
      
      const searchLower = query.toLowerCase();
      const matches = data.records
        .filter((item: ApiItem) => {
          // Only include available items
          const isAvailable = item.sellQuantity > 0 && 
                            item.stockStatus !== 'Out of Stock';
          if (!isAvailable) return false;

          // Search in name, sku, and manufacturer
          const matchesSearch = 
            item.name?.toLowerCase().includes(searchLower) ||
            item.sku?.toLowerCase().includes(searchLower) ||
            item.manufacturer?.toLowerCase().includes(searchLower);
          
          return matchesSearch;
        })
        .map((item: ApiItem) => ({
          id: item.id,
          sku: item.sku,
          name: item.name,
          manufacturer: item.manufacturer,
          askPrice: item.askPrice,
          mainImage: item.mainImage,
          metalSymbol: item.metalSymbol,
        }));

      allMatches = [...allMatches, ...matches];
      
      // Check if there are more pages
      hasMoreFromApi = data.nextPage !== null;
      currentApiOffset += batchSize;
      
      // Stop if we've searched through 500 products (5 batches) - performance limit
      if (currentApiOffset >= 500) {
        break;
      }
    }

    // Paginate the results
    const paginatedResults = allMatches.slice(offset, offset + limit);
    const hasMore = allMatches.length > offset + limit || hasMoreFromApi;

    return NextResponse.json({ 
      results: paginatedResults,
      hasMore: hasMore
    });
  } catch (error) {
    console.error('Error searching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to search inventory', results: [], hasMore: false },
      { status: 500 }
    );
  }
}


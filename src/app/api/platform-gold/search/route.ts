import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/lib/authTokenManager';

const API_BASE_URL = 'https://api.platform.gold/public/v2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = 20; // Return 20 results per page
    
    if (!query.trim()) {
      return NextResponse.json({ results: [], hasMore: false });
    }

    // Split query into individual search terms for better matching
    // "2010-W 4-coin" becomes ["2010-w", "4-coin"] or ["2010", "w", "4", "coin"]
    const searchTerms = query.toLowerCase().split(/[\s-]+/).filter(term => term.length > 0);
    
    interface SearchMatch {
      id: number;
      sku: string;
      name: string;
      manufacturer: string;
      askPrice: number;
      mainImage: string;
      metalSymbol: string;
      matchScore: number;
    }
    
    let allMatches: SearchMatch[] = [];
    let currentApiOffset = 0;
    let hasMoreFromApi = true;
    const batchSize = 100;
    
    // Search through ALL products (approximately 2700-3000 in inventory)
    // Keep fetching until we've searched everything or API stops returning data
    while (hasMoreFromApi) {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/inventory?limit=${batchSize}&offset=${currentApiOffset}`
      );

      if (!response.ok) {
        // If API fails, return what we have so far
        console.error(`Search API error at offset ${currentApiOffset}: ${response.status}`);
        break;
      }

      const data = await response.json();
      
      if (!data || !Array.isArray(data.records) || data.records.length === 0) {
        break;
      }

      // Filter and search through available products
      interface ApiItem {
        sellQuantity: number;
        askPrice: number;
        stockStatus?: string;
        name?: string;
        sku?: string;
        manufacturer?: string;
        id: number;
        mainImage: string;
        metalSymbol: string;
      }
      
      const matches = data.records
        .filter((item: ApiItem) => {
          // Only include available items with price
          if (item.sellQuantity <= 0 || item.askPrice <= 0) return false;
          if (item.stockStatus === 'Out of Stock') return false;

          const itemText = `${item.name || ''} ${item.sku || ''} ${item.manufacturer || ''}`.toLowerCase();
          
          // Check if ALL search terms are found in the item
          return searchTerms.every(term => itemText.includes(term));
        })
        .map((item: ApiItem) => {
          const itemText = `${item.name || ''} ${item.sku || ''} ${item.manufacturer || ''}`.toLowerCase();
          // Calculate match score - items with more term matches ranked higher
          const matchScore = searchTerms.reduce((score, term) => {
            const matches = (itemText.match(new RegExp(term, 'g')) || []).length;
            return score + matches;
          }, 0);
          
          return {
            id: item.id,
            sku: item.sku,
            name: item.name,
            manufacturer: item.manufacturer,
            askPrice: item.askPrice,
            mainImage: item.mainImage,
            metalSymbol: item.metalSymbol,
            matchScore
          };
        });

      allMatches = [...allMatches, ...matches];
      
      // Check if there are more pages from API
      hasMoreFromApi = data.nextPage !== null;
      currentApiOffset += batchSize;
    }
    
    console.log(`📊 Searched ${currentApiOffset} products total`);

    // Sort by match score (best matches first) and remove score from output
    allMatches.sort((a, b) => b.matchScore - a.matchScore);
    
    // Paginate results based on offset
    const paginatedMatches = allMatches.slice(offset, offset + limit);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const results = paginatedMatches.map(({ matchScore, ...item }) => item);
    const hasMore = offset + limit < allMatches.length;

    console.log(`🔍 Search "${query}": Found ${allMatches.length} total, returning ${results.length} (offset: ${offset}, hasMore: ${hasMore})`);

    return NextResponse.json({ 
      results,
      hasMore,
      totalFound: allMatches.length
    });
  } catch (error) {
    console.error('Error searching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to search inventory', results: [], hasMore: false },
      { status: 500 }
    );
  }
}


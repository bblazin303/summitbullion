// Server-side API route to fetch inventory from Platform Gold
// This avoids CORS issues by making the request from the server

import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/lib/authTokenManager';
import { Inventory } from '@/types/platformGold';

const API_BASE_URL = 'https://api.platform.gold/public/v2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';
    const metalFilter = searchParams.get('metal') || '';
    
    // If there's a search query, fetch progressively until we have enough results
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      const matchedRecords: Inventory[] = [];
      let currentOffset = 0;
      const batchSize = 100;
      const maxResults = 200; // Stop after finding 200 matches
      const maxPages = 10; // Don't search more than 1000 products
      let pagesSearched = 0;
      
      console.log(`🔍 Searching for: "${search}"`);
      
      while (matchedRecords.length < maxResults && pagesSearched < maxPages) {
        const response = await fetchWithAuth(`${API_BASE_URL}/inventory?limit=${batchSize}&offset=${currentOffset}`);

        if (!response.ok) break;

        const data = await response.json();
        
        if (!data || !Array.isArray(data.records) || data.records.length === 0) {
          break;
        }

        // Filter records that match search
        const matches = data.records.filter((record: Inventory) => {
          const nameMatch = record.name?.toLowerCase().includes(searchLower);
          const skuMatch = record.sku?.toLowerCase().includes(searchLower);
          const manufacturerMatch = record.manufacturer?.toLowerCase().includes(searchLower);
          return nameMatch || skuMatch || manufacturerMatch;
        });

        matchedRecords.push(...matches);
        currentOffset += batchSize;
        pagesSearched++;
        
        console.log(`📦 Searched ${currentOffset} products, found ${matchedRecords.length} matches`);
        
        // If no more pages, stop
        if (data.nextPage === null) break;
      }
      
      console.log(`✅ Search complete: ${matchedRecords.length} results for "${search}"`);
      
      return NextResponse.json({
        records: matchedRecords,
        count: matchedRecords.length,
        page: 1,
        nextPage: null,
        totalCount: matchedRecords.length,
        searchQuery: search
      });
    }
    
    // Regular pagination (no search)
    const response = await fetchWithAuth(`${API_BASE_URL}/inventory?limit=${limit}&offset=${offset}`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Platform Gold API error:', response.status, errorText);
      throw new Error(`Failed to fetch inventory: ${response.status}`);
    }

    const data = await response.json();
    
    // API returns { count, page, nextPage, records: [...] }
    // Apply metal filter if provided
    if (data && Array.isArray(data.records)) {
      let filteredRecords = data.records;
      
      // Apply server-side metal filter
      if (metalFilter && metalFilter !== 'All') {
        const metalSymbolMap: { [key: string]: string } = {
          'Gold': 'XAU',
          'Silver': 'XAG',
          'Platinum': 'XPT',
          'Palladium': 'XPD'
        };
        const targetSymbol = metalSymbolMap[metalFilter];
        
        if (targetSymbol) {
          filteredRecords = data.records.filter((item: Inventory) => item.metalSymbol === targetSymbol);
        }
      }
      
      return NextResponse.json({
        records: filteredRecords,
        count: filteredRecords.length,
        page: data.page,
        nextPage: data.nextPage,
        totalCount: data.count
      });
    }
    
    console.error('Invalid inventory data structure:', data);
    return NextResponse.json(
      { error: 'Invalid inventory data format' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


// Platform Gold API Service - Client-side wrapper
// Makes requests to our Next.js API routes which proxy to Platform Gold

import type { Inventory, InventoryResponse } from '@/types/platformGold';

/**
 * Fetch inventory from Platform Gold via our API route with pagination
 */
export async function fetchInventory(
  limit: number = 100, 
  offset: number = 0, 
  search?: string,
  metalFilter?: string,
  signal?: AbortSignal
): Promise<InventoryResponse> {
  try {
    let url = `/api/platform-gold/inventory?limit=${limit}&offset=${offset}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (metalFilter && metalFilter !== 'All') {
      url += `&metal=${encodeURIComponent(metalFilter)}`;
    }
      
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Don't cache search results or filtered results
      cache: (search || metalFilter) ? 'no-store' : 'default',
      next: (search || metalFilter) ? undefined : { revalidate: 300 },
      signal // Add abort signal support
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch inventory: ${response.status}`);
    }

    const data: InventoryResponse = await response.json();
    return data;
  } catch (error) {
    // If the request was aborted, re-throw without logging (expected behavior)
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    // Only log actual errors, not aborted requests
    console.error('Error fetching inventory:', error);
    throw error;
  }
}

/**
 * Fetch a single inventory item by ID via our API route
 */
export async function fetchInventoryById(id: number, forceRefresh: boolean = false): Promise<Inventory | null> {
  try {
    const url = `/api/platform-gold/inventory/${id}${forceRefresh ? '?refresh=true' : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Force no-cache when refreshing to get live availability
      cache: forceRefresh ? 'no-store' : 'default',
      next: forceRefresh ? undefined : { revalidate: 300 }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch inventory item: ${response.status}`);
    }

    const item: Inventory = await response.json();
    return item;
  } catch (error) {
    console.error(`Error fetching inventory item ${id}:`, error);
    throw error;
  }
}

/**
 * Apply 2% markup to a price
 */
export function applyMarkup(price: number, markupPercent: number = 2): number {
  return price * (1 + markupPercent / 100);
}

/**
 * Get metal type display name from symbol
 */
export function getMetalDisplayName(metalSymbol: string): string {
  const metalMap: { [key: string]: string } = {
    'XAU': 'Gold',
    'XAG': 'Silver',
    'XPT': 'Platinum',
    'XPD': 'Palladium'
  };
  return metalMap[metalSymbol] || metalSymbol;
}

/**
 * Check if an inventory item is available for purchase
 * @param item - The inventory item to check
 * @param maxMinQuantity - Optional max minimum quantity threshold (items requiring more than this are filtered out)
 */
export function isAvailableForPurchase(item: Inventory, maxMinQuantity?: number): boolean {
  const basicAvailable = item.sellQuantity > 0 && item.askPrice > 0;
  
  // If no max min quantity specified, just check basic availability
  if (maxMinQuantity === undefined) {
    return basicAvailable;
  }
  
  // Also check that minimum order quantity is reasonable
  const minQty = item.minAskQty || 1;
  return basicAvailable && minQty <= maxMinQuantity;
}


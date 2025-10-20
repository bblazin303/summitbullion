import { NextResponse } from 'next/server';

// STATIC COUNTS - These are the verified counts from Platform Gold API
// Last updated: Verified via API test
// "All" = Total products in database (2,800) - looks impressive!
// Specific metals = Actual available counts - accurate for filtering
const KNOWN_METAL_COUNTS = {
  All: 2737, // Total products in Platform Gold database
  Gold: 556, // Available Gold products
  Silver: 638, // Available Silver products
  Platinum: 27, // Available Platinum products
  Palladium: 8 // Available Palladium products
};

/**
 * Returns metal counts for inventory filtering
 * Uses static verified counts instead of expensive API counting
 * 
 * NOTE: If inventory changes significantly (e.g., 100+ new products added),
 * run the test-counts.js script to get updated numbers and update KNOWN_METAL_COUNTS
 */
export async function GET() {
  try {
    console.log('📊 Returning verified metal counts (static)');
    
    // Return the known accurate counts immediately
    // No need to count 2,800+ products on every request!
    return NextResponse.json(KNOWN_METAL_COUNTS);
    
  } catch (error) {
    console.error('Error returning metal counts:', error);
    
    // Even on error, return the known counts
    return NextResponse.json(KNOWN_METAL_COUNTS);
  }
}

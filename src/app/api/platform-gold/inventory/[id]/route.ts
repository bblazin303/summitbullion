// Server-side API route to fetch a single inventory item from Platform Gold

import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/lib/authTokenManager';

const API_BASE_URL = 'https://api.platform.gold/public/v2';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const response = await fetchWithAuth(`${API_BASE_URL}/inventory/${id}`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const product = await response.json();
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}


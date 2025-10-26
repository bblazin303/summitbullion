// Cart-related TypeScript types

export interface CartItemPricing {
  basePrice: number; // Platform Gold's cost
  markupPercentage: number; // Your markup % (e.g., 2 for 2%)
  markup: number; // Markup amount in dollars
  finalPrice: number; // Total price customer pays (with markup)
}

export interface CartItem {
  id: string; // Inventory ID as string for cart operations
  inventoryId: number; // Platform Gold inventory ID (number)
  sku: string;
  name: string;
  pricing: CartItemPricing; // Nested pricing breakdown
  quantity: number;
  image: string;
  metalSymbol: string; // XAU, XAG, etc.
  metalOz: number;
  manufacturer: string;
  addedAt: Date;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  updatedAt: Date;
}

export interface AddToCartRequest {
  inventoryId: number;
  quantity?: number;
}


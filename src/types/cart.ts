// Cart-related TypeScript types

export interface CartItem {
  id: string; // Inventory ID as string for cart operations
  inventoryId: number; // Platform Gold inventory ID (number)
  sku: string;
  name: string;
  price: number;
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


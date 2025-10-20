// Platform Gold API Types

export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Category {
  name: string;
  primary: boolean;
  children?: Category[];
}

export interface MetalContent {
  [key: string]: number;
}

export interface Inventory {
  id: number;
  sku: string;
  name: string;
  metalOz: number;
  bidPriceFormat: 'PER_UNIT' | 'PER_OZ' | 'SPOT_PLUS';
  bidPremium: number;
  askPriceFormat: 'PER_UNIT' | 'PER_OZ' | 'SPOT_PLUS';
  askPremium: number;
  disablePerOzCalc: boolean;
  metalSymbol: 'XAU' | 'XAG' | 'XPT' | 'XPD';
  metalType: string;
  metalContent?: MetalContent;
  manufacturer: string;
  purity: string;
  buyQuantity: number;
  sellQuantity: number;
  minQuantity: number;
  minBidQty: number;
  minAskQty: number;
  year?: string;
  grade?: string;
  gradingService?: string;
  mintMark?: string;
  iraEligible: boolean;
  askPrice: number;
  bidPrice: number;
  metalAsk: number;
  metalBid: number;
  mainImage?: string;
  altImage1?: string;
  altImage2?: string;
  altImage3?: string;
  stockStatus?: string;
  categories?: Category[];
}

export interface SpotPrice {
  symbol: 'XAU' | 'XAG' | 'XPT' | 'XPD';
  currency: string;
  currencyMultiplier: number;
  open: number;
  ask: number;
  bid: number;
  timestamp: string;
}

export interface PaymentMethod {
  id: number;
  title: string;
  description: string;
  scope: string;
  fee: number;
  feeWaived: number;
}

export interface ShippingInstruction {
  id: number;
  name: string;
}

export interface InventoryResponse {
  records: Inventory[];
  count: number;
  page: number;
  nextPage: number | null;
  totalCount: number;
}

// Search result item (lighter than full Inventory)
export interface SearchResult {
  id: number;
  sku: string;
  name: string;
  manufacturer: string;
  askPrice: number;
  mainImage: string;
  metalSymbol: string;
}


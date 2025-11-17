/**
 * Platform Gold API Helper Functions
 * Handles order creation, status tracking, and quote management
 */

import { fetchWithAuth } from './authTokenManager';

// ============================================================================
// HELPERS
// ============================================================================

const API_BASE_URL = 'https://api.platform.gold/public/v2';

/**
 * Helper to make GET requests to Platform Gold API
 */
async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API GET ${endpoint} failed:`, response.status, errorText);
    throw new Error(`Platform Gold API request failed: ${response.status}`);
  }
  
  return await response.json();
}

/**
 * Helper to make POST requests to Platform Gold API
 */
async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API POST ${endpoint} failed:`, response.status, errorText);
    throw new Error(`Platform Gold API request failed: ${response.status}`);
  }
  
  return await response.json();
}

// ============================================================================
// TYPES
// ============================================================================

export interface PlatformGoldAddress {
  addressee: string;
  attention?: string;
  addr1: string;
  addr2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

export interface PlatformGoldOrderItem {
  id: number; // Platform Gold inventory ID
  quantity: number;
}

export interface PlatformGoldPaymentMethod {
  id: number;
  title: string;
  description: string;
  scope: string;
  fee: number;
  feeWaived: number;
}

export interface PlatformGoldShippingInstruction {
  id: number;
  name: string;
}

export interface PlatformGoldQuoteRequest {
  asynchronous?: boolean;
  confirmationNumber?: string;
  items: PlatformGoldOrderItem[];
  shippingAddress: PlatformGoldAddress;
  email: string;
  paymentMethodId: number;
  shippingInstructionId: number;
  customerReferenceNumber?: string;
  notes?: string;
}

export interface PlatformGoldQuoteResponse {
  handle: string;
  recordType: 'quote' | 'pendingOrder';
  quoteExpiration: string;
  lineItems: Array<{
    id: number;
    name: string;
    quantity: number;
    rate: number;
  }>;
  handlingFee: number;
  amount: number;
  transactionDate: string;
  customerReferenceNumber?: string;
}

export interface PlatformGoldOrderResponse {
  id: number;
  confirmationNumber: string;
  recordType: 'salesOrder';
  shippingInstruction: PlatformGoldShippingInstruction;
  paymentMethod: PlatformGoldPaymentMethod;
  shippingAddress: PlatformGoldAddress;
  itemFulfillments: Array<{
    shipDate: string;
    shipMethod: string;
    items: PlatformGoldOrderItem[];
    trackingNumbers: string[];
  }>;
  status: string;
  trackingNumbers: string[];
  lineItems: Array<{
    id: number;
    name: string;
    quantity: number;
    rate: number;
  }>;
  amount: number;
  transactionDate: string;
  customerReferenceNumber?: string;
  transactionId: string;
}

export interface PlatformGoldPollResponse {
  id?: number;
  handle: string;
  transactionId?: string;
  confirmationNumber?: string;
  syncError?: string;
  syncAttempts: number;
  syncAttemptsRemaining: number;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Toggle between quote mode (testing) and real order mode (production)
 * Set to false when you have sandbox/production access
 */
export const USE_QUOTE_MODE = false;

/**
 * Default payment method and shipping instruction IDs
 * These should be fetched dynamically in production
 */
export const DEFAULT_PAYMENT_METHOD_ID = 1; // Update after fetching from API
export const DEFAULT_SHIPPING_INSTRUCTION_ID = 1; // Update after fetching from API

// ============================================================================
// SYSTEM ENDPOINTS
// ============================================================================

/**
 * Fetch available payment methods from Platform Gold
 */
export async function fetchPaymentMethods(): Promise<PlatformGoldPaymentMethod[]> {
  try {
    return await apiGet<PlatformGoldPaymentMethod[]>('/payment-methods');
  } catch (error) {
    console.error('❌ Error fetching payment methods:', error);
    throw new Error('Failed to fetch payment methods from Platform Gold');
  }
}

/**
 * Fetch available shipping instructions from Platform Gold
 */
export async function fetchShippingInstructions(): Promise<PlatformGoldShippingInstruction[]> {
  try {
    return await apiGet<PlatformGoldShippingInstruction[]>('/shipping-instructions');
  } catch (error) {
    console.error('❌ Error fetching shipping instructions:', error);
    throw new Error('Failed to fetch shipping instructions from Platform Gold');
  }
}

// ============================================================================
// QUOTE ENDPOINTS (SAFE TESTING)
// ============================================================================

/**
 * Create a sales order quote (doesn't create real order)
 * Use this for testing without actual fulfillment
 */
export async function createSalesOrderQuote(
  request: PlatformGoldQuoteRequest
): Promise<PlatformGoldQuoteResponse> {
  try {
    console.log('📝 Creating Platform Gold quote...');
    
    const quotes = await apiPost<PlatformGoldQuoteResponse[]>('/sales-order/quote/create', [request]);
    const quote = quotes[0]; // API returns array
    
    console.log('✅ Quote created:', {
      handle: quote.handle,
      amount: quote.amount,
      expiration: quote.quoteExpiration,
    });
    
    return quote;
  } catch (error: unknown) {
    console.error('❌ Error creating quote:', error);
    throw new Error('Failed to create Platform Gold quote');
  }
}

/**
 * Execute a quote to convert it into a real order
 * Only use when ready to fulfill
 */
export async function executeSalesOrderQuote(
  handle: string
): Promise<PlatformGoldOrderResponse | PlatformGoldQuoteResponse> {
  try {
    console.log('🚀 Executing Platform Gold quote:', handle);
    
    const results = await apiPost<(PlatformGoldOrderResponse | PlatformGoldQuoteResponse)[]>('/sales-order/quote/execute', [{ handle }]);
    const result = results[0];
    
    console.log('✅ Quote executed:', result);
    
    return result;
  } catch (error: unknown) {
    console.error('❌ Error executing quote:', error);
    throw new Error('Failed to execute Platform Gold quote');
  }
}

// ============================================================================
// ORDER ENDPOINTS (PRODUCTION)
// ============================================================================

/**
 * Create a real sales order (creates actual order for fulfillment)
 * ⚠️ WARNING: This creates a REAL order unless in sandbox!
 */
export async function createSalesOrder(
  request: PlatformGoldQuoteRequest
): Promise<PlatformGoldOrderResponse | PlatformGoldQuoteResponse> {
  try {
    console.log('🛒 Creating Platform Gold sales order...');
    
    const orders = await apiPost<(PlatformGoldOrderResponse | PlatformGoldQuoteResponse)[]>('/sales-order', [request]);
    const order = orders[0];
    
    console.log('✅ Sales order created:', {
      id: 'id' in order ? order.id : undefined,
      handle: 'handle' in order ? order.handle : undefined,
      status: 'status' in order ? order.status : undefined,
      transactionId: 'transactionId' in order ? order.transactionId : undefined,
    });
    
    return order;
  } catch (error: unknown) {
    console.error('❌ Error creating sales order:', error);
    throw new Error('Failed to create Platform Gold sales order');
  }
}

/**
 * Poll async order status by handle
 */
export async function pollOrderStatus(handle: string): Promise<PlatformGoldPollResponse> {
  try {
    const results = await apiPost<PlatformGoldPollResponse[]>('/sales-order/poll', [{ handle }]);
    return results[0];
  } catch (error: unknown) {
    console.error('❌ Error polling order status:', error);
    throw new Error('Failed to poll Platform Gold order status');
  }
}

/**
 * Fetch sales order status by ID
 */
export async function fetchSalesOrderStatus(orderId: number): Promise<PlatformGoldOrderResponse> {
  try {
    const results = await apiPost<PlatformGoldOrderResponse[]>('/sales-order/status', [{ id: orderId }]);
    return results[0];
  } catch (error: unknown) {
    console.error('❌ Error fetching order status:', error);
    throw new Error('Failed to fetch Platform Gold order status');
  }
}

/**
 * Search for sales orders by criteria
 */
export async function searchSalesOrders(criteria: {
  transactionId?: string;
  customerReferenceNumber?: string;
  transactionDate?: {
    from: string;
    to: string;
  };
}): Promise<PlatformGoldOrderResponse[]> {
  try {
    return await apiPost<PlatformGoldOrderResponse[]>('/sales-order/search', criteria);
  } catch (error: unknown) {
    console.error('❌ Error searching orders:', error);
    throw new Error('Failed to search Platform Gold orders');
  }
}

// ============================================================================
// UNIFIED ORDER CREATION (SMART MODE SWITCHING)
// ============================================================================

/**
 * Create order using quote or real order based on USE_QUOTE_MODE
 * This is the main function to use in your webhook
 */
export async function createPlatformGoldOrder(
  request: PlatformGoldQuoteRequest
): Promise<{
  success: boolean;
  mode: 'quote' | 'order';
  handle?: string;
  orderId?: number;
  transactionId?: string;
  status?: string;
  amount: number;
  data?: PlatformGoldQuoteResponse | PlatformGoldOrderResponse;
  error?: string;
}> {
  try {
    if (USE_QUOTE_MODE) {
      // QUOTE MODE - Safe for testing
      console.log('🧪 Using QUOTE mode (safe testing)');
      const quote = await createSalesOrderQuote(request);
      
      return {
        success: true,
        mode: 'quote',
        handle: quote.handle,
        amount: quote.amount,
        data: quote,
      };
    } else {
      // ORDER MODE - Real fulfillment
      console.log('🚀 Using ORDER mode (real fulfillment)');
      const order = await createSalesOrder(request);
      
      if ('id' in order) {
        // Synchronous order
        return {
          success: true,
          mode: 'order',
          orderId: order.id,
          transactionId: order.transactionId,
          status: order.status,
          amount: order.amount,
          data: order,
        };
      } else {
        // Asynchronous order (returned as quote, need to poll)
        return {
          success: true,
          mode: 'order',
          handle: order.handle,
          amount: order.amount,
          data: order,
        };
      }
    }
  } catch (error: unknown) {
    console.error('❌ Error creating Platform Gold order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      mode: USE_QUOTE_MODE ? 'quote' : 'order',
      amount: 0,
      error: errorMessage,
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert Firebase shipping address to Platform Gold format
 */
export function convertToPlatformGoldAddress(address: Partial<PlatformGoldAddress> & { fullName?: string; streetAddress?: string; aptSuite?: string; zipCode?: string }): PlatformGoldAddress {
  return {
    addressee: address.fullName || '',
    attention: address.attention || '',
    addr1: address.streetAddress || '',
    addr2: address.aptSuite || '',
    city: address.city || '',
    state: address.state || '',
    zip: address.zipCode || '',
    country: address.country || 'US',
  };
}

/**
 * Format order items for Platform Gold API
 */
export function formatOrderItems(items: Array<{ id: string | number; quantity: number }>): PlatformGoldOrderItem[] {
  return items.map((item) => ({
    id: typeof item.id === 'string' ? parseInt(item.id) : item.id || 0,
    quantity: item.quantity || 1,
  }));
}

/**
 * Get human-readable status message
 */
export function getOrderStatusMessage(status: string): string {
  const statusMap: Record<string, string> = {
    'Awaiting Payment': 'Payment pending',
    'Awaiting Shipping Instructions': 'Awaiting shipping details',
    'Pending Fulfillment': 'Order being prepared',
    'Partially Fulfilled': 'Partially shipped',
    'Fulfillment Complete': 'Order shipped',
    'Cancelled': 'Order cancelled',
    'On Hold - Contact Desk': 'On hold - contact support',
  };
  
  return statusMap[status] || status;
}


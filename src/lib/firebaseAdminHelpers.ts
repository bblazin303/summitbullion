// Firebase Admin Helper Functions
// Server-side operations with full admin privileges

import { adminDb } from './firebase-admin';
import { User, KYCStatus, ShippingAddress } from '@/types/user';
import { Cart, CartItem } from '@/types/cart';
import { Order } from '@/types/order';

// =============================================================================
// USER OPERATIONS
// =============================================================================

/**
 * Create a new user profile in Firestore
 * Uses Alchemy user data
 */
export async function createUserProfile(
  uid: string,
  email: string,
  walletAddress: string,
  alchemyOrgId: string,
  accountType: 'sca' | 'eoa' = 'sca',
  solanaAddress?: string
): Promise<User> {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized');
  }

  const userRef = adminDb.collection('users').doc(uid);
  
  const userData: User = {
    uid,
    email,
    walletAddress,
    solanaAddress,
    alchemyOrgId,
    accountType,
    kycStatus: 'none',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  await userRef.set({
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  return userData;
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<User | null> {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized');
  }

  const userRef = adminDb.collection('users').doc(uid);
  const userSnap = await userRef.get();
  
  if (!userSnap.exists) {
    return null;
  }
  
  const data = userSnap.data();
  if (!data) return null;

  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    kycCompletedAt: data.kycCompletedAt?.toDate?.() || data.kycCompletedAt,
  } as User;
}

/**
 * Update user profile in Firestore
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<Omit<User, 'uid' | 'createdAt'>>
): Promise<void> {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized');
  }

  const userRef = adminDb.collection('users').doc(uid);
  
  await userRef.update({
    ...updates,
    updatedAt: new Date(),
  });
}

/**
 * Update user's KYC status
 */
export async function updateUserKYC(
  uid: string,
  updates: {
    kycStatus?: KYCStatus;
    kycVerificationId?: string;
    kycCompletedAt?: Date;
  }
): Promise<void> {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized');
  }

  const userRef = adminDb.collection('users').doc(uid);
  
  await userRef.update({
    ...updates,
    updatedAt: new Date(),
  });
}

/**
 * Add a saved shipping address to user profile
 */
export async function addSavedAddress(
  uid: string,
  address: ShippingAddress
): Promise<void> {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized');
  }

  const userRef = adminDb.collection('users').doc(uid);
  const userSnap = await userRef.get();
  
  if (!userSnap.exists) {
    throw new Error('User not found');
  }
  
  const userData = userSnap.data();
  const savedAddresses = userData?.savedAddresses || [];
  
  await userRef.update({
    savedAddresses: [...savedAddresses, address],
    updatedAt: new Date(),
  });
}

// =============================================================================
// CART OPERATIONS
// =============================================================================

/**
 * Get user's cart from Firestore
 */
export async function getCart(uid: string): Promise<Cart | null> {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized');
  }

  const cartRef = adminDb.collection('users').doc(uid).collection('cart').doc('current');
  const cartSnap = await cartRef.get();
  
  if (!cartSnap.exists) {
    return null;
  }
  
  const data = cartSnap.data();
  if (!data) return null;

  return {
    ...data,
    items: (data.items || []).map((item: any) => ({
      ...item,
      addedAt: item.addedAt?.toDate?.() || item.addedAt,
    })),
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
  } as Cart;
}

/**
 * Add item to cart
 */
export async function addToCart(
  uid: string,
  item: CartItem
): Promise<void> {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized');
  }

  const cartRef = adminDb.collection('users').doc(uid).collection('cart').doc('current');
  const cartSnap = await cartRef.get();
  
  let items: CartItem[] = [];
  
  if (cartSnap.exists) {
    const existingCart = cartSnap.data();
    items = existingCart?.items || [];
    
    // Check if item already in cart
    const existingItemIndex = items.findIndex(i => i.id === item.id);
    if (existingItemIndex !== -1) {
      // Update quantity
      items[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      items.push(item);
    }
  } else {
    items = [item];
  }
  
  const subtotal = items.reduce((sum, i) => sum + (i.pricing.finalPrice * i.quantity), 0);
  const itemCount = items.reduce((count, i) => count + i.quantity, 0);
  
  await cartRef.set({
    userId: uid,
    items: items.map(i => ({
      // Product identifiers
      id: i.id,
      inventoryId: i.inventoryId,
      sku: i.sku,
      name: i.name,
      
      // Nested pricing breakdown - grouped together in Firebase Console
      pricing: {
        basePrice: i.pricing.basePrice,
        markupPercentage: i.pricing.markupPercentage,
        markup: i.pricing.markup,
        finalPrice: i.pricing.finalPrice,
      },
      
      // Product details
      quantity: i.quantity,
      image: i.image,
      manufacturer: i.manufacturer,
      metalSymbol: i.metalSymbol,
      metalOz: i.metalOz,
      
      // Timestamp
      addedAt: i.addedAt instanceof Date ? i.addedAt : new Date(),
    })),
    subtotal,
    itemCount,
    updatedAt: new Date(),
  });
}

/**
 * Update item quantity in cart
 */
export async function updateCartItemQuantity(
  uid: string,
  itemId: string,
  quantity: number
): Promise<void> {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized');
  }

  const cartRef = adminDb.collection('users').doc(uid).collection('cart').doc('current');
  const cartSnap = await cartRef.get();
  
  if (!cartSnap.exists) {
    throw new Error('Cart not found');
  }
  
  const cart = cartSnap.data();
  let items: CartItem[] = cart?.items || [];
  
  if (quantity <= 0) {
    // Remove item
    items = items.filter(i => i.id !== itemId);
  } else {
    // Update quantity
    const itemIndex = items.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
      items[itemIndex].quantity = quantity;
    }
  }
  
  const subtotal = items.reduce((sum, i) => sum + (i.pricing.finalPrice * i.quantity), 0);
  const itemCount = items.reduce((count, i) => count + i.quantity, 0);
  
  await cartRef.update({
    items,
    subtotal,
    itemCount,
    updatedAt: new Date(),
  });
}

/**
 * Remove item from cart
 */
export async function removeFromCart(
  uid: string,
  itemId: string
): Promise<void> {
  await updateCartItemQuantity(uid, itemId, 0);
}

/**
 * Clear entire cart
 */
export async function clearCart(uid: string): Promise<void> {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized');
  }

  const cartRef = adminDb.collection('users').doc(uid).collection('cart').doc('current');
  await cartRef.delete();
}

// =============================================================================
// ORDER OPERATIONS
// =============================================================================

/**
 * Create a new order in Firestore
 */
export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized');
  }

  const ordersRef = adminDb.collection('orders');
  const orderRef = ordersRef.doc();
  
  await orderRef.set({
    ...order,
    id: orderRef.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentCompletedAt: order.paymentCompletedAt || null,
  });
  
  return orderRef.id;
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized');
  }

  const orderRef = adminDb.collection('orders').doc(orderId);
  const orderSnap = await orderRef.get();
  
  if (!orderSnap.exists) {
    return null;
  }
  
  const data = orderSnap.data();
  if (!data) return null;

  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    paymentCompletedAt: data.paymentCompletedAt?.toDate?.() || data.paymentCompletedAt,
  } as Order;
}

/**
 * Get all orders for a user
 */
export async function getUserOrders(uid: string): Promise<Order[]> {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized');
  }

  const ordersRef = adminDb.collection('orders');
  const querySnapshot = await ordersRef.where('userId', '==', uid).get();
  
  const orders: Order[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    orders.push({
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      paymentCompletedAt: data.paymentCompletedAt?.toDate?.() || data.paymentCompletedAt,
    } as Order);
  });
  
  // Sort by creation date (newest first)
  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  updates: Partial<Order>
): Promise<void> {
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized');
  }

  const orderRef = adminDb.collection('orders').doc(orderId);
  
  await orderRef.update({
    ...updates,
    updatedAt: new Date(),
  });
}


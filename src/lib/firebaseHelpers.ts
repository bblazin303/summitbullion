// Firebase Helper Functions
// Common operations for users, carts, and orders

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
  deleteDoc,
  DocumentData
} from 'firebase/firestore';
import { firestore } from './firebase';
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
  const userRef = doc(firestore, 'users', uid);
  
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
  
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return userData;
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<User | null> {
  const userRef = doc(firestore, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    return null;
  }
  
  const data = userSnap.data();
  return {
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    kycCompletedAt: data.kycCompletedAt?.toDate(),
  } as User;
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
  const userRef = doc(firestore, 'users', uid);
  
  await updateDoc(userRef, {
    ...updates,
    ...(updates.kycCompletedAt && { kycCompletedAt: Timestamp.fromDate(updates.kycCompletedAt) }),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Add a saved shipping address to user profile
 */
export async function addSavedAddress(
  uid: string,
  address: ShippingAddress
): Promise<void> {
  const userRef = doc(firestore, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    throw new Error('User not found');
  }
  
  const userData = userSnap.data();
  const savedAddresses = userData.savedAddresses || [];
  
  await updateDoc(userRef, {
    savedAddresses: [...savedAddresses, address],
    updatedAt: serverTimestamp(),
  });
}

// =============================================================================
// CART OPERATIONS
// =============================================================================

/**
 * Get user's cart from Firestore
 */
export async function getCart(uid: string): Promise<Cart | null> {
  const cartRef = doc(firestore, 'users', uid, 'cart', 'current');
  const cartSnap = await getDoc(cartRef);
  
  if (!cartSnap.exists()) {
    return null;
  }
  
  const data = cartSnap.data();
  return {
    ...data,
    items: data.items.map((item: DocumentData) => ({
      ...item,
      addedAt: item.addedAt?.toDate(),
    })),
    updatedAt: data.updatedAt?.toDate(),
  } as Cart;
}

/**
 * Add item to cart
 */
export async function addToCart(
  uid: string,
  item: CartItem
): Promise<void> {
  const cartRef = doc(firestore, 'users', uid, 'cart', 'current');
  const cartSnap = await getDoc(cartRef);
  
  let items: CartItem[] = [];
  
  if (cartSnap.exists()) {
    const existingCart = cartSnap.data();
    items = existingCart.items || [];
    
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
  
  const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const itemCount = items.reduce((count, i) => count + i.quantity, 0);
  
  await setDoc(cartRef, {
    userId: uid,
    items: items.map(i => ({
      ...i,
      addedAt: i.addedAt instanceof Date ? Timestamp.fromDate(i.addedAt) : i.addedAt,
    })),
    subtotal,
    itemCount,
    updatedAt: serverTimestamp(),
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
  const cartRef = doc(firestore, 'users', uid, 'cart', 'current');
  const cartSnap = await getDoc(cartRef);
  
  if (!cartSnap.exists()) {
    throw new Error('Cart not found');
  }
  
  const cart = cartSnap.data();
  let items: CartItem[] = cart.items || [];
  
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
  
  const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const itemCount = items.reduce((count, i) => count + i.quantity, 0);
  
  await updateDoc(cartRef, {
    items,
    subtotal,
    itemCount,
    updatedAt: serverTimestamp(),
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
  const cartRef = doc(firestore, 'users', uid, 'cart', 'current');
  await deleteDoc(cartRef);
}

// =============================================================================
// ORDER OPERATIONS
// =============================================================================

/**
 * Create a new order in Firestore
 */
export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ordersRef = collection(firestore, 'orders');
  const orderRef = doc(ordersRef);
  
  await setDoc(orderRef, {
    ...order,
    id: orderRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    shippingAddress: order.shippingAddress,
    paymentCompletedAt: order.paymentCompletedAt ? Timestamp.fromDate(order.paymentCompletedAt) : null,
  });
  
  return orderRef.id;
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  const orderRef = doc(firestore, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);
  
  if (!orderSnap.exists()) {
    return null;
  }
  
  const data = orderSnap.data();
  return {
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    paymentCompletedAt: data.paymentCompletedAt?.toDate(),
  } as Order;
}

/**
 * Get all orders for a user
 */
export async function getUserOrders(uid: string): Promise<Order[]> {
  const ordersRef = collection(firestore, 'orders');
  const q = query(ordersRef, where('userId', '==', uid));
  const querySnapshot = await getDocs(q);
  
  const orders: Order[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    orders.push({
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      paymentCompletedAt: data.paymentCompletedAt?.toDate(),
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
  const orderRef = doc(firestore, 'orders', orderId);
  
  await updateDoc(orderRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}


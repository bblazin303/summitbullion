"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StaticImageData } from 'next/image';
import { useUser } from '@account-kit/react';
import { useConsistentUserId } from '@/hooks/useConsistentUserId';

export interface CartItemPricing {
  basePrice: number;
  markupPercentage: number;
  markup: number;
  finalPrice: number;
}

export interface CartItem {
  id: string;
  name: string;
  pricing: CartItemPricing;
  quantity: number;
  image: StaticImageData | string;
  brand: string;
  metalOz?: number; // Weight in troy ounces
  metalSymbol?: string; // XAU, XAG, XPT, XPD
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isLoading: boolean;
  reloadCart: () => Promise<void>; // Force reload cart from Firebase
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start as true until we know if there's a user
  const [cartLoaded, setCartLoaded] = useState(false);
  const [lastUserId, setLastUserId] = useState<string | null>(null);
  const user = useUser();
  const { userId: consistentUserId, email, isEmailAuth } = useConsistentUserId();

  // Load cart from API when user logs in
  useEffect(() => {
    const loadCart = async () => {
      // Wait for user to be determined (user is null when loading, undefined when logged out)
      if (user === null) {
        // Still loading user, don't do anything yet
        return;
      }
      
      if (!consistentUserId) {
        // User is definitely logged out - clear local cart
        setCart([]);
        setCartLoaded(false);
        setLastUserId(null);
        setIsLoading(false);
        return;
      }

      // If user changed, reset everything and reload
      if (lastUserId && lastUserId !== consistentUserId) {
        setCart([]);
        setCartLoaded(false);
        setLastUserId(consistentUserId);
        // Will reload on next effect run
        return;
      }

      // Set lastUserId if not set
      if (!lastUserId) {
        setLastUserId(consistentUserId);
      }

      // Skip if cart already loaded for this user
      if (cartLoaded) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const headers: Record<string, string> = {};
        
        if (!isEmailAuth && user.idToken) {
          headers['Authorization'] = `Bearer ${user.idToken}`;
        }
        
        // For email auth, send email in query params (will be converted to consistent userId on backend)
        const queryParams = isEmailAuth
          ? `?email=${encodeURIComponent(email!)}&authType=email`
          : '';
        
        // Call API route to get cart
        const response = await fetch(`/api/cart${queryParams}`, {
          headers,
        });
        
        if (!response.ok) {
          throw new Error('Failed to load cart');
        }
        
        const data = await response.json();
        
        if (data.success && data.cart && data.cart.items) {
          // Convert API cart items to local CartItem format (with backward compatibility)
          const localCartItems: CartItem[] = data.cart.items.map((item: { 
            id: string; 
            name: string; 
            pricing?: CartItemPricing;
            price?: number;
            basePrice?: number;
            markup?: number;
            markupPercentage?: number;
            quantity: number; 
            image: string; 
            manufacturer: string;
            metalOz?: number;
            metalSymbol?: string;
          }) => {
            return {
              id: item.id,
              name: item.name,
              // Handle both nested pricing (new) and flat pricing (old)
              pricing: item.pricing ? {
                basePrice: item.pricing.basePrice,
                markupPercentage: item.pricing.markupPercentage,
                markup: item.pricing.markup,
                finalPrice: item.pricing.finalPrice,
              } : {
                // Backward compatibility for old flat structure
                basePrice: item.basePrice || item.price || 0,
                markupPercentage: item.markupPercentage || 0,
                markup: item.markup || 0,
                finalPrice: item.price || 0,
              },
              quantity: item.quantity,
              image: item.image,
              brand: item.manufacturer,
              metalOz: item.metalOz,
              metalSymbol: item.metalSymbol,
            };
          });
          setCart(localCartItems);
          setCartLoaded(true); // Mark cart as loaded
        }
      } catch {
        // Silent fail - cart will be empty
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consistentUserId, user?.idToken, email, isEmailAuth]); // Don't include cartLoaded, lastUserId, user in deps to avoid infinite loop

  const addToCart = async (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const newItem = { ...item, quantity: item.quantity || 1 };
    
    // Update local state immediately (optimistic update)
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      
      if (existingItem) {
        // If item exists, update quantity
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + newItem.quantity }
            : cartItem
        );
      } else {
        // Add new item
        return [...prevCart, newItem];
      }
    });

    // Sync to API if user is logged in
    if (consistentUserId) {
      try {
        // Convert to API CartItem format with nested pricing
        const apiItem = {
          id: newItem.id,
          inventoryId: parseInt(newItem.id), // Assuming id is inventory ID
          sku: newItem.id,
          name: newItem.name,
          pricing: {
            basePrice: newItem.pricing.basePrice,
            markupPercentage: newItem.pricing.markupPercentage,
            markup: newItem.pricing.markup,
            finalPrice: newItem.pricing.finalPrice,
          },
          quantity: newItem.quantity,
          image: typeof newItem.image === 'string' ? newItem.image : '',
          metalSymbol: newItem.metalSymbol || '',
          metalOz: newItem.metalOz || 0,
          manufacturer: newItem.brand,
        };
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (!isEmailAuth && user?.idToken) {
          headers['Authorization'] = `Bearer ${user.idToken}`;
      }
        
        const response = await fetch('/api/cart/add', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            item: apiItem,
            authType: isEmailAuth ? 'email' : 'google',
            userId: consistentUserId,
            email: email, // Send email for consistent userId generation
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add item to cart');
        }
      } catch {
        // Rollback on error
        setCart((prevCart) => prevCart.filter((item) => item.id !== newItem.id));
      }
    }
  };

  const removeFromCart = async (id: string) => {
    // Save previous cart state for rollback
    const previousCart = [...cart];
    
    // Update local state immediately (optimistic update)
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));

    // Sync to API if user is logged in
    if (consistentUserId) {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (!isEmailAuth && user?.idToken) {
          headers['Authorization'] = `Bearer ${user.idToken}`;
        }
        
        const response = await fetch('/api/cart/remove', {
          method: 'DELETE',
          headers,
          body: JSON.stringify({
            itemId: id,
            authType: isEmailAuth ? 'email' : 'google',
            userId: consistentUserId,
            email: email, // Send email for consistent userId generation
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to remove item from cart');
        }
      } catch {
        // Rollback to previous state on error
        setCart(previousCart);
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }
    
    // Update local state immediately
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );

    // Sync to API if user is logged in
    if (consistentUserId) {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (!isEmailAuth && user?.idToken) {
          headers['Authorization'] = `Bearer ${user.idToken}`;
        }
        
        const response = await fetch('/api/cart/update', {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            itemId: id,
            quantity,
            authType: isEmailAuth ? 'email' : 'google',
            userId: consistentUserId,
            email: email, // Send email for consistent userId generation
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update cart');
        }
      } catch {
        // Silent fail - local state already updated
      }
    }
  };

  const clearCart = async () => {
    // Update local state immediately
    setCart([]);

    // Sync to API if user is logged in
    if (consistentUserId) {
      try {
        const queryParams = isEmailAuth
          ? `?authType=email&email=${encodeURIComponent(email!)}`
          : '';
        
        const headers: Record<string, string> = {};
        
        if (!isEmailAuth && user?.idToken) {
          headers['Authorization'] = `Bearer ${user.idToken}`;
        }
        
        const response = await fetch(`/api/cart/clear${queryParams}`, {
          method: 'DELETE',
          headers,
        });
        
        if (!response.ok) {
          throw new Error('Failed to clear cart');
        }
      } catch {
        // Silent fail - local state already cleared
      }
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.pricing.finalPrice * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Force reload cart from Firebase (useful for fixing sync issues)
  const reloadCart = async () => {
    if (!consistentUserId) {
      setCart([]);
      return;
    }

    try {
      setIsLoading(true);
      
      const headers: Record<string, string> = {};
      
      if (!isEmailAuth && user?.idToken) {
        headers['Authorization'] = `Bearer ${user.idToken}`;
      }
      
      const queryParams = isEmailAuth
        ? `?email=${encodeURIComponent(email!)}&authType=email`
        : '';
      
      const response = await fetch(`/api/cart${queryParams}`, {
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to reload cart');
      }
      
      const data = await response.json();
      
      if (data.success && data.cart && data.cart.items) {
        const localCartItems: CartItem[] = data.cart.items.map((item: { 
          id: string; 
          name: string; 
          pricing?: CartItemPricing;
          price?: number;
          basePrice?: number;
          markup?: number;
          markupPercentage?: number;
          quantity: number; 
          image: string; 
          manufacturer: string;
          metalOz?: number;
          metalSymbol?: string;
        }) => ({
          id: item.id,
          name: item.name,
          pricing: item.pricing ? {
            basePrice: item.pricing.basePrice,
            markupPercentage: item.pricing.markupPercentage,
            markup: item.pricing.markup,
            finalPrice: item.pricing.finalPrice,
          } : {
            basePrice: item.basePrice || item.price || 0,
            markupPercentage: item.markupPercentage || 0,
            markup: item.markup || 0,
            finalPrice: item.price || 0,
          },
          quantity: item.quantity,
          image: item.image,
          brand: item.manufacturer,
          metalOz: item.metalOz,
          metalSymbol: item.metalSymbol,
        }));
        setCart(localCartItems);
      } else {
        setCart([]);
      }
    } catch {
      // Silent fail
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isLoading,
        reloadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};


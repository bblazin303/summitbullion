// Order-related TypeScript types

import { ShippingAddress } from './user';

export type OrderStatus = 
  | 'pending_payment'
  | 'payment_processing'
  | 'payment_completed'
  | 'submitted_to_platform_gold'
  | 'awaiting_fulfillment'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'stripe' | 'coinbase';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
  id: number; // Platform Gold inventory ID
  sku: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  image?: string;
}

export interface Order {
  id: string; // Our internal order ID
  userId: string;
  userEmail: string;
  
  // Order details
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  
  // Payment info
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string; // Stripe payment intent ID or Coinbase charge ID
  paymentCompletedAt?: Date;
  
  // Shipping info
  shippingAddress: ShippingAddress;
  
  // Platform Gold integration
  platformGoldOrderId?: number; // Platform Gold's sales order ID
  platformGoldStatus?: string; // Their status string
  platformGoldConfirmationNumber?: string;
  trackingNumbers?: string[];
  
  // Order status
  status: OrderStatus;
  requiredKYC: boolean; // Was KYC required for this order?
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Optional fields
  customerNotes?: string;
  internalNotes?: string;
}

export interface CreateOrderRequest {
  userId: string;
  userEmail: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentId: string;
  customerNotes?: string;
}


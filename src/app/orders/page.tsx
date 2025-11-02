"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@account-kit/react';
import Image from 'next/image';
import Link from 'next/link';
import { ShippingAddress } from '@/types/user';

interface OrderItem {
  id: number;
  sku: string;
  name: string;
  quantity: number;
  pricing: {
    basePrice: number;
    markupPercentage: number;
    markup: number;
    finalPrice: number;
  };
  totalPrice: number;
  image?: string;
}

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  platformGoldCost?: number;
  totalMarkup?: number;
  shippingAddress?: ShippingAddress;
  paymentMethod: 'stripe' | 'coinbase';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
  status: 'pending_fulfillment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  platformGoldOrderId?: number | null;
  platformGoldTransactionId?: string | null;
  platformGoldHandle?: string | null;
  platformGoldStatus?: string | null;
  platformGoldMode?: 'quote' | 'order';
  platformGoldError?: string | null;
  platformGoldTrackingNumbers?: string[];
  requiredKYC: boolean;
  kycStatus?: string | null;
  trackingNumbers?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const user = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncingOrderId, setSyncingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.userId) {
      setIsLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const isEmailAuth = !user.idToken;
        const headers: Record<string, string> = {};

        if (!isEmailAuth && user.idToken) {
          headers['Authorization'] = `Bearer ${user.idToken}`;
        }

        // Build query params for email auth
        const queryParams = new URLSearchParams();
        if (isEmailAuth) {
          queryParams.append('authType', 'email');
          queryParams.append('userId', user.userId);
        }

        const url = `/api/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        const response = await fetch(url, {
          headers,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          throw new Error(data.error || 'Failed to load orders');
        }
      } catch (err) {
        console.error('❌ Error fetching orders:', err);
        setError('Failed to load your orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.userId, user?.idToken]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending_fulfillment':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending_fulfillment':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const syncOrderStatus = async (orderId: string) => {
    setSyncingOrderId(orderId);
    try {
      const response = await fetch('/api/orders/sync-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync order status');
      }

      const data = await response.json();

      if (data.success) {
        // Refresh orders list
        const isEmailAuth = !user?.idToken;
        const headers: Record<string, string> = {};

        if (!isEmailAuth && user?.idToken) {
          headers['Authorization'] = `Bearer ${user.idToken}`;
        }

        const queryParams = new URLSearchParams();
        if (isEmailAuth && user?.userId) {
          queryParams.append('authType', 'email');
          queryParams.append('userId', user.userId);
        }

        const url = `/api/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        const ordersResponse = await fetch(url, { headers });
        const ordersData = await ordersResponse.json();

        if (ordersData.success) {
          setOrders(ordersData.orders);
        }
      }
    } catch (err) {
      console.error('❌ Error syncing order status:', err);
    } finally {
      setSyncingOrderId(null);
    }
  };

  const getPlatformGoldStatusColor = (status?: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case 'quote_created':
        return 'bg-blue-100 text-blue-800';
      case 'Awaiting Payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending Fulfillment':
      case 'Awaiting Shipping Instructions':
        return 'bg-orange-100 text-orange-800';
      case 'Partially Fulfilled':
        return 'bg-purple-100 text-purple-800';
      case 'Fulfillment Complete':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'error':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformGoldStatusLabel = (status?: string | null, mode?: 'quote' | 'order') => {
    if (!status) return 'Not submitted';
    if (status === 'quote_created') return mode === 'quote' ? 'Quote Created (Test)' : 'Quote Created';
    if (status === 'error' || status === 'failed') return 'Submission Failed';
    return status;
  };

  if (!user?.userId) {
    return (
      <div className="min-h-screen bg-[#fcf8f1] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="font-inter font-bold text-[32px] text-black mb-4">Please Sign In</h2>
          <p className="font-inter text-[16px] text-[#7c7c7c] mb-8">
            You need to be signed in to view your orders.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-[#141722] text-[#efe9e0] font-inter font-medium text-[14px] uppercase rounded-full hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:to-[#FFB546] hover:text-black transition-all duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcf8f1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#141722] mx-auto mb-4"></div>
          <p className="font-inter text-[16px] text-[#7c7c7c]">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fcf8f1] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="font-inter font-bold text-[32px] text-black mb-4">Oops!</h2>
          <p className="font-inter text-[16px] text-[#7c7c7c] mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-[#141722] text-[#efe9e0] font-inter font-medium text-[14px] uppercase rounded-full hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:to-[#FFB546] hover:text-black transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf8f1] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-inter font-bold text-[32px] md:text-[42px] text-black mb-2">
            My Orders
          </h1>
          <p className="font-inter text-[16px] text-[#7c7c7c]">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-[24px] shadow-[0_8px_31.1px_-9px_rgba(0,0,0,0.25)] p-12 text-center">
            <h2 className="font-inter font-bold text-[24px] text-black mb-4">
              No orders yet
            </h2>
            <p className="font-inter text-[16px] text-[#7c7c7c] mb-8">
              Start shopping for precious metals!
            </p>
            <Link
              href="/marketplace"
              className="inline-block px-8 py-4 bg-[#141722] text-[#efe9e0] font-inter font-medium text-[14px] uppercase rounded-full hover:bg-gradient-to-br hover:from-[#FFF0C1] hover:to-[#FFB546] hover:text-black transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-[24px] shadow-[0_8px_31.1px_-9px_rgba(0,0,0,0.25)] overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-[rgba(0,0,0,0.1)]">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-inter font-bold text-[18px] text-black">
                          Order #{order.id.slice(-8)}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full font-inter font-medium text-[12px] ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="font-inter text-[14px] text-[#7c7c7c]">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-inter font-bold text-[24px] text-black">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="font-inter text-[12px] text-[#7c7c7c] uppercase">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        {/* Item Image */}
                        {item.image && (
                          <div className="relative w-20 h-20 bg-white rounded-[12px] overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                        )}

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-inter font-semibold text-[16px] text-black mb-1 truncate">
                            {item.name}
                          </h4>
                          <p className="font-inter text-[14px] text-[#7c7c7c] mb-2">
                            SKU: {item.sku}
                          </p>
                          <div className="flex items-center gap-4 text-[14px]">
                            <span className="font-inter text-[#7c7c7c]">
                              Qty: {item.quantity}
                            </span>
                            <span className="font-inter text-[#7c7c7c]">×</span>
                            <span className="font-inter font-semibold text-black">
                              ${item.pricing.finalPrice.toFixed(2)}
                            </span>
                            <span className="font-inter text-[#7c7c7c]">=</span>
                            <span className="font-inter font-bold text-black">
                              ${item.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-[rgba(0,0,0,0.1)]">
                    <div className="space-y-2">
                      <div className="flex justify-between font-inter text-[14px]">
                        <span className="text-[#7c7c7c]">Subtotal</span>
                        <span className="text-black">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-inter text-[14px]">
                        <span className="text-[#7c7c7c]">Delivery Fee</span>
                        <span className="text-black">${order.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-inter text-[16px] font-bold pt-2 border-t border-[rgba(0,0,0,0.1)]">
                        <span className="text-black">Total</span>
                        <span className="text-black">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-6 pt-6 border-t border-[rgba(0,0,0,0.1)]">
                      <h4 className="font-inter font-semibold text-[14px] text-black mb-2">
                        Shipping Address:
                      </h4>
                      <div className="font-inter text-[14px] text-[#7c7c7c] space-y-1">
                        <p className="text-black font-medium">{order.shippingAddress.addressee}</p>
                        {order.shippingAddress.attention && (
                          <p>Attn: {order.shippingAddress.attention}</p>
                        )}
                        <p>{order.shippingAddress.addr1}</p>
                        {order.shippingAddress.addr2 && <p>{order.shippingAddress.addr2}</p>}
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                          {order.shippingAddress.zip}
                        </p>
                        {order.shippingAddress.country && order.shippingAddress.country !== 'US' && (
                          <p>{order.shippingAddress.country}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Platform Gold Status */}
                  <div className="mt-6 pt-6 border-t border-[rgba(0,0,0,0.1)]">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-inter font-semibold text-[14px] text-black">
                        Fulfillment Status:
                      </h4>
                      {(order.platformGoldOrderId || order.platformGoldHandle) && (
                        <button
                          onClick={() => syncOrderStatus(order.id)}
                          disabled={syncingOrderId === order.id}
                          className="flex items-center gap-2 px-3 py-1 text-[12px] font-inter font-medium text-[#141722] bg-white border border-[rgba(0,0,0,0.2)] rounded-full hover:bg-[#f5f5f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {syncingOrderId === order.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-[#141722]"></div>
                              Syncing...
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Refresh Status
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full font-inter font-medium text-[12px] ${getPlatformGoldStatusColor(
                            order.platformGoldStatus
                          )}`}
                        >
                          {getPlatformGoldStatusLabel(order.platformGoldStatus, order.platformGoldMode)}
                        </span>
                        {order.platformGoldMode === 'quote' && (
                          <span className="text-[12px] font-inter text-[#7c7c7c] italic">
                            (Test Mode)
                          </span>
                        )}
                      </div>

                      {order.platformGoldTransactionId && (
                        <p className="font-inter text-[12px] text-[#7c7c7c]">
                          Transaction ID: <span className="font-mono">{order.platformGoldTransactionId}</span>
                        </p>
                      )}

                      {order.platformGoldOrderId && (
                        <p className="font-inter text-[12px] text-[#7c7c7c]">
                          Platform Gold Order: <span className="font-mono">#{order.platformGoldOrderId}</span>
                        </p>
                      )}

                      {order.platformGoldHandle && !order.platformGoldOrderId && (
                        <p className="font-inter text-[12px] text-[#7c7c7c]">
                          Processing... <span className="font-mono">{order.platformGoldHandle.slice(0, 8)}...</span>
                        </p>
                      )}

                      {order.platformGoldError && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="font-inter text-[12px] text-red-800">
                            <strong>Error:</strong> {order.platformGoldError}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tracking Info */}
                  {((order.platformGoldTrackingNumbers && order.platformGoldTrackingNumbers.length > 0) ||
                    (order.trackingNumbers && order.trackingNumbers.length > 0)) && (
                    <div className="mt-6 pt-6 border-t border-[rgba(0,0,0,0.1)]">
                      <h4 className="font-inter font-semibold text-[14px] text-black mb-2">
                        Tracking Numbers:
                      </h4>
                      <div className="space-y-1">
                        {order.platformGoldTrackingNumbers?.map((tracking, index) => (
                          <p key={`pg-${index}`} className="font-mono text-[14px] text-[#7c7c7c]">
                            {tracking}
                          </p>
                        ))}
                        {order.trackingNumbers?.map((tracking, index) => (
                          <p key={`track-${index}`} className="font-mono text-[14px] text-[#7c7c7c]">
                            {tracking}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/marketplace"
            className="inline-block px-8 py-4 bg-white border-2 border-[#141722] text-[#141722] font-inter font-medium text-[14px] uppercase rounded-full hover:bg-[#141722] hover:text-[#efe9e0] transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}


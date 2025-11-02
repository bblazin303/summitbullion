import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { fetchSalesOrderStatus, pollOrderStatus } from '@/lib/platformGoldHelpers';

/**
 * POST /api/orders/sync-status
 * Sync Platform Gold order status with Firebase
 * Can be called manually or via cron job
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID required' },
        { status: 400 }
      );
    }
    
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }
    
    // Get order from Firebase
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    const orderData = orderDoc.data();
    
    // Check if order has Platform Gold reference
    const platformGoldOrderId = orderData?.platformGoldOrderId;
    const platformGoldHandle = orderData?.platformGoldHandle;
    const platformGoldMode = orderData?.platformGoldMode;
    
    if (!platformGoldOrderId && !platformGoldHandle) {
      return NextResponse.json(
        { 
          error: 'No Platform Gold reference found',
          message: 'Order has not been submitted to Platform Gold yet'
        },
        { status: 400 }
      );
    }
    
    let platformGoldStatus;
    
    try {
      // If we have an order ID, fetch full status
      if (platformGoldOrderId) {
        console.log('🔍 Fetching Platform Gold order status:', platformGoldOrderId);
        platformGoldStatus = await fetchSalesOrderStatus(platformGoldOrderId);
        
        // Update Firebase with latest status
        await orderRef.update({
          platformGoldStatus: platformGoldStatus.status,
          platformGoldTransactionId: platformGoldStatus.transactionId,
          platformGoldTrackingNumbers: platformGoldStatus.trackingNumbers || [],
          platformGoldItemFulfillments: platformGoldStatus.itemFulfillments || [],
          platformGoldLastSynced: new Date(),
          updatedAt: new Date(),
        });
        
        console.log('✅ Order status synced:', platformGoldStatus.status);
        
        return NextResponse.json({
          success: true,
          orderId,
          platformGoldOrderId,
          status: platformGoldStatus.status,
          trackingNumbers: platformGoldStatus.trackingNumbers,
          transactionId: platformGoldStatus.transactionId,
        });
      }
      
      // If we only have a handle (async order), poll for status
      if (platformGoldHandle) {
        console.log('🔍 Polling Platform Gold order status:', platformGoldHandle);
        const pollResult = await pollOrderStatus(platformGoldHandle);
        
        // Update Firebase with poll result
        const updateData: any = {
          platformGoldLastSynced: new Date(),
          updatedAt: new Date(),
        };
        
        // If order is now complete, store the order ID
        if (pollResult.id) {
          updateData.platformGoldOrderId = pollResult.id;
          updateData.platformGoldTransactionId = pollResult.transactionId;
          updateData.platformGoldStatus = 'order_created';
        }
        
        // If there's an error, store it
        if (pollResult.syncError) {
          updateData.platformGoldError = pollResult.syncError;
          updateData.platformGoldStatus = 'sync_error';
        }
        
        await orderRef.update(updateData);
        
        console.log('✅ Poll result synced');
        
        return NextResponse.json({
          success: true,
          orderId,
          platformGoldHandle,
          pollResult,
          message: pollResult.id 
            ? 'Order created successfully' 
            : `Sync in progress (${pollResult.syncAttemptsRemaining} attempts remaining)`,
        });
      }
      
    } catch (platformGoldError: any) {
      console.error('❌ Error fetching Platform Gold status:', platformGoldError);
      
      // Update Firebase with error
      await orderRef.update({
        platformGoldError: platformGoldError.message || 'Failed to fetch status',
        platformGoldLastSynced: new Date(),
        updatedAt: new Date(),
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to sync with Platform Gold',
          details: platformGoldError.message 
        },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('❌ Error in sync-status route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders/sync-status
 * Sync all pending orders (can be called by cron job)
 */
export async function GET(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }
    
    // Find all orders that need syncing
    // (orders with Platform Gold references but no recent sync)
    const ordersSnapshot = await adminDb
      .collection('orders')
      .where('platformGoldStatus', 'in', ['quote_created', 'order_created', 'Awaiting Payment', 'Pending Fulfillment', 'Partially Fulfilled'])
      .limit(50)
      .get();
    
    if (ordersSnapshot.empty) {
      return NextResponse.json({
        success: true,
        message: 'No orders need syncing',
        syncedCount: 0,
      });
    }
    
    const syncResults = [];
    
    for (const doc of ordersSnapshot.docs) {
      const orderData = doc.data();
      const orderId = doc.id;
      
      try {
        // Skip if synced in last 5 minutes
        const lastSynced = orderData.platformGoldLastSynced?.toDate();
        if (lastSynced && (Date.now() - lastSynced.getTime()) < 5 * 60 * 1000) {
          continue;
        }
        
        // Sync this order
        if (orderData.platformGoldOrderId) {
          const status = await fetchSalesOrderStatus(orderData.platformGoldOrderId);
          
          await doc.ref.update({
            platformGoldStatus: status.status,
            platformGoldTrackingNumbers: status.trackingNumbers || [],
            platformGoldLastSynced: new Date(),
            updatedAt: new Date(),
          });
          
          syncResults.push({
            orderId,
            status: status.status,
            synced: true,
          });
        } else if (orderData.platformGoldHandle) {
          const pollResult = await pollOrderStatus(orderData.platformGoldHandle);
          
          const updateData: any = {
            platformGoldLastSynced: new Date(),
            updatedAt: new Date(),
          };
          
          if (pollResult.id) {
            updateData.platformGoldOrderId = pollResult.id;
            updateData.platformGoldTransactionId = pollResult.transactionId;
            updateData.platformGoldStatus = 'order_created';
          }
          
          await doc.ref.update(updateData);
          
          syncResults.push({
            orderId,
            handle: orderData.platformGoldHandle,
            synced: true,
            orderId: pollResult.id || null,
          });
        }
      } catch (error: any) {
        console.error(`❌ Error syncing order ${orderId}:`, error);
        syncResults.push({
          orderId,
          synced: false,
          error: error.message,
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Synced ${syncResults.length} orders`,
      syncedCount: syncResults.filter(r => r.synced).length,
      results: syncResults,
    });
    
  } catch (error: any) {
    console.error('❌ Error in bulk sync:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


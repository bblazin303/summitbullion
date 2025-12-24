/**
 * Check Order Status Script
 * 
 * Fetches real-time order status from Platform Gold API
 * 
 * Run with: npx tsx scripts/check-order-status.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { fetchSalesOrderStatus } from '../src/lib/platformGoldHelpers';

// Initialize Firebase Admin
function initFirebase() {
  if (getApps().length > 0) {
    return getFirestore();
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!process.env.FIREBASE_ADMIN_PROJECT_ID ||
      !process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
      !privateKey) {
    console.error('❌ Firebase Admin credentials not configured');
    process.exit(1);
  }

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });

  console.log('✅ Firebase Admin initialized\n');
  return getFirestore();
}

async function checkOrderStatuses() {
  console.log('🔍 Check Order Status from Platform Gold');
  console.log('========================================\n');

  const db = initFirebase();

  // Get recent orders
  console.log('📋 Fetching orders from Firebase...\n');

  // Simpler query - just get recent orders and filter in code
  const ordersSnapshot = await db.collection('orders')
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();

  // Filter to only orders with Platform Gold IDs
  const ordersWithPGIds = ordersSnapshot.docs.filter(doc => {
    const data = doc.data();
    return data.platformGoldOrderId != null;
  });

  if (ordersWithPGIds.length === 0) {
    console.log('No orders found with Platform Gold IDs');
    return;
  }

  console.log(`Found ${ordersWithPGIds.length} order(s) to check:\n`);

  for (const doc of ordersWithPGIds) {
    const order = doc.data();
    const orderId = doc.id;
    const platformGoldOrderId = order.platformGoldOrderId;

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📦 Order: ${orderId}`);
    console.log(`   Platform Gold ID: ${platformGoldOrderId}`);
    console.log(`   Customer: ${order.userEmail}`);
    console.log(`   Firebase Status: ${order.platformGoldStatus || 'N/A'}`);
    console.log('');

    try {
      // Call Platform Gold API for real-time status
      console.log('   🔄 Fetching from Platform Gold API...');
      const pgStatus = await fetchSalesOrderStatus(platformGoldOrderId);

      console.log('');
      console.log('   📊 REAL-TIME STATUS FROM PLATFORM GOLD:');
      console.log(`   ┌─────────────────────────────────────────────────`);
      console.log(`   │ Status:          ${pgStatus.status}`);
      console.log(`   │ Transaction ID:  ${pgStatus.transactionId}`);
      console.log(`   │ Amount:          $${pgStatus.amount?.toFixed(2) || 'N/A'}`);
      console.log(`   │ Date:            ${pgStatus.transactionDate}`);
      
      if (pgStatus.trackingNumbers && pgStatus.trackingNumbers.length > 0) {
        console.log(`   │ Tracking #s:     ${pgStatus.trackingNumbers.join(', ')}`);
      } else {
        console.log(`   │ Tracking #s:     (none yet)`);
      }

      if (pgStatus.shippingAddress) {
        console.log(`   │ Ship To:         ${pgStatus.shippingAddress.addressee}`);
        console.log(`   │                  ${pgStatus.shippingAddress.addr1}`);
        if (pgStatus.shippingAddress.addr2) {
          console.log(`   │                  ${pgStatus.shippingAddress.addr2}`);
        }
        console.log(`   │                  ${pgStatus.shippingAddress.city}, ${pgStatus.shippingAddress.state} ${pgStatus.shippingAddress.zip}`);
      }

      if (pgStatus.shippingInstruction) {
        console.log(`   │ Shipping Type:   ${pgStatus.shippingInstruction.name}`);
      }

      if (pgStatus.paymentMethod) {
        console.log(`   │ Payment Method:  ${pgStatus.paymentMethod.title}`);
      }

      if (pgStatus.itemFulfillments && pgStatus.itemFulfillments.length > 0) {
        console.log(`   │`);
        console.log(`   │ Fulfillments:`);
        for (const fulfillment of pgStatus.itemFulfillments) {
          console.log(`   │   - Ship Date: ${fulfillment.shipDate}`);
          console.log(`   │     Method: ${fulfillment.shipMethod}`);
          if (fulfillment.trackingNumbers && fulfillment.trackingNumbers.length > 0) {
            console.log(`   │     Tracking: ${fulfillment.trackingNumbers.join(', ')}`);
          }
        }
      }

      console.log(`   └─────────────────────────────────────────────────`);

      // Update Firebase with the latest status
      await doc.ref.update({
        platformGoldStatus: pgStatus.status,
        platformGoldTrackingNumbers: pgStatus.trackingNumbers || [],
        platformGoldLastSynced: new Date(),
        updatedAt: new Date(),
      });
      console.log('   ✅ Firebase updated with latest status');

    } catch (error: any) {
      console.log(`   ❌ Error fetching from Platform Gold: ${error.message}`);
    }

    console.log('');

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Status check complete!');
}

checkOrderStatuses().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});


/**
 * Fix On-Hold Orders Script
 * 
 * This script fixes orders that are "On Hold - Contact Desk" on Platform Gold
 * due to missing shipping address information.
 * 
 * Run with: npx tsx scripts/fix-onhold-orders.ts
 * 
 * What it does:
 * 1. Fetches all orders from Firebase with platformGoldStatus = "On Hold - Contact Desk"
 * 2. For each order, updates Platform Gold with the correct shipping address
 * 3. Updates the order status in Firebase
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
  updateSalesOrder,
  fetchSalesOrderStatus,
  fetchShippingInstructions,
  getCorrectShippingInstruction,
  convertToPlatformGoldAddress,
  REQUIRED_SHIPPING_INSTRUCTION_NAME,
} from '../src/lib/platformGoldHelpers';

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
    console.error('Please ensure these are set in .env.local:');
    console.error('  - FIREBASE_ADMIN_PROJECT_ID');
    console.error('  - FIREBASE_ADMIN_CLIENT_EMAIL');
    console.error('  - FIREBASE_ADMIN_PRIVATE_KEY');
    process.exit(1);
  }

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });

  console.log('✅ Firebase Admin initialized');
  return getFirestore();
}

interface FirebaseOrder {
  id: string;
  platformGoldOrderId: number;
  platformGoldStatus: string;
  platformGoldTransactionId: string;
  shippingAddress: {
    addressee?: string;
    attention?: string;
    addr1?: string;
    addr2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  userEmail: string;
  userId: string;
}

async function fixOnHoldOrders() {
  console.log('🔧 Fix On-Hold Orders Script');
  console.log('============================\n');

  const db = initFirebase();

  // Step 1: Fetch all orders with "On Hold - Contact Desk" status
  console.log('📋 Fetching orders with "On Hold - Contact Desk" status...\n');

  const ordersSnapshot = await db.collection('orders')
    .where('platformGoldStatus', '==', 'On Hold - Contact Desk')
    .get();

  if (ordersSnapshot.empty) {
    console.log('✅ No orders found with "On Hold - Contact Desk" status.');
    console.log('   All orders are in good shape!');
    return;
  }

  const orders: FirebaseOrder[] = [];
  ordersSnapshot.forEach((doc) => {
    const data = doc.data();
    orders.push({
      id: doc.id,
      platformGoldOrderId: data.platformGoldOrderId,
      platformGoldStatus: data.platformGoldStatus,
      platformGoldTransactionId: data.platformGoldTransactionId,
      shippingAddress: data.shippingAddress || {},
      userEmail: data.userEmail,
      userId: data.userId,
    });
  });

  console.log(`📦 Found ${orders.length} order(s) to fix:\n`);

  orders.forEach((order, index) => {
    console.log(`   ${index + 1}. Order ID: ${order.id}`);
    console.log(`      Platform Gold ID: ${order.platformGoldOrderId}`);
    console.log(`      Transaction ID: ${order.platformGoldTransactionId}`);
    console.log(`      Customer: ${order.userEmail}`);
    console.log(`      Address: ${order.shippingAddress.addr1 || '(missing)'}, ${order.shippingAddress.city || '(missing)'}, ${order.shippingAddress.state || '(missing)'} ${order.shippingAddress.zip || '(missing)'}`);
    console.log('');
  });

  // Step 2: Get the correct shipping instruction
  console.log('📮 Fetching correct shipping instruction...');
  const shippingInstructions = await fetchShippingInstructions();
  const correctShippingInstruction = getCorrectShippingInstruction(shippingInstructions);
  console.log(`   Using: "${correctShippingInstruction.name}" (ID: ${correctShippingInstruction.id})`);
  console.log(`   Required: "${REQUIRED_SHIPPING_INSTRUCTION_NAME}"`);
  console.log('');

  // Confirm before proceeding
  console.log('⚠️  This will update these orders on Platform Gold.');
  console.log('   - Fix shipping addresses');
  console.log('   - Change shipping instruction to "Confidential Drop Ship to Customer"');
  console.log('   Waiting 5 seconds before proceeding...');
  console.log('   Press Ctrl+C to cancel.\n');

  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Step 3: Process each order
  let successCount = 0;
  let failCount = 0;

  for (const order of orders) {
    console.log(`\n🔄 Processing order ${order.id}...`);
    console.log(`   Platform Gold Order ID: ${order.platformGoldOrderId}`);

    // Validate shipping address
    if (!order.shippingAddress.addr1 || !order.shippingAddress.city ||
        !order.shippingAddress.state || !order.shippingAddress.zip) {
      console.log('   ❌ Shipping address is incomplete in Firebase:');
      console.log(`      addr1: ${order.shippingAddress.addr1 || '(missing)'}`);
      console.log(`      city: ${order.shippingAddress.city || '(missing)'}`);
      console.log(`      state: ${order.shippingAddress.state || '(missing)'}`);
      console.log(`      zip: ${order.shippingAddress.zip || '(missing)'}`);
      console.log('   ⚠️  Skipping this order - please fix the address manually in Firebase first.');
      failCount++;
      continue;
    }

    try {
      // Convert to Platform Gold format
      const platformGoldAddress = convertToPlatformGoldAddress(order.shippingAddress);

      console.log('   📮 Sending address to Platform Gold:');
      console.log(`      Addressee: ${platformGoldAddress.addressee}`);
      console.log(`      Address: ${platformGoldAddress.addr1}`);
      if (platformGoldAddress.addr2) {
        console.log(`               ${platformGoldAddress.addr2}`);
      }
      console.log(`               ${platformGoldAddress.city}, ${platformGoldAddress.state} ${platformGoldAddress.zip}`);
      console.log(`               ${platformGoldAddress.country}`);

      // Update the order on Platform Gold
      // - Fix the shipping address
      // - Change shipping instruction to "Confidential Drop Ship to Customer"
      const updatedOrder = await updateSalesOrder(order.platformGoldOrderId, {
        shippingAddress: platformGoldAddress,
        shippingInstructionId: correctShippingInstruction.id,
        orderNotes: `Fixed via recovery script on ${new Date().toISOString()}: Updated shipping address and instruction to "${correctShippingInstruction.name}"`,
      });

      console.log(`   ✅ Platform Gold order updated!`);
      if (updatedOrder.status) {
        console.log(`      New status: ${updatedOrder.status}`);
      }

      // Update Firebase with new status (handle undefined values gracefully)
      const firebaseUpdate: Record<string, unknown> = {
        platformGoldAddressFixed: true,
        platformGoldAddressFixedAt: new Date(),
        platformGoldShippingInstructionFixed: true,
        updatedAt: new Date(),
      };
      
      // Only set status if we got one back from Platform Gold
      if (updatedOrder.status) {
        firebaseUpdate.platformGoldStatus = updatedOrder.status;
      } else {
        // Mark as fixed but status needs verification
        firebaseUpdate.platformGoldStatus = 'Address Fixed - Verify Status';
      }

      await db.collection('orders').doc(order.id).update(firebaseUpdate);

      console.log('   ✅ Firebase order updated!');
      successCount++;

    } catch (error: any) {
      console.log(`   ❌ Failed to update order: ${error.message}`);
      
      // Check if the order is locked
      if (error.message.includes('lock') || error.message.includes('403')) {
        console.log('   ⚠️  This order may be locked on Platform Gold.');
        console.log('   💡 Contact Platform Gold support to unlock it.');
      }

      // Log the error to Firebase for tracking
      try {
        await db.collection('orders').doc(order.id).update({
          platformGoldFixAttemptError: error.message,
          platformGoldFixAttemptAt: new Date(),
          updatedAt: new Date(),
        });
      } catch {
        // Ignore Firebase update errors
      }

      failCount++;
    }

    // Small delay between requests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('\n============================');
  console.log('📊 Summary');
  console.log('============================');
  console.log(`   Total orders processed: ${orders.length}`);
  console.log(`   ✅ Successfully fixed: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);

  if (failCount > 0) {
    console.log('\n⚠️  Some orders could not be fixed automatically.');
    console.log('   Please check the logs above and contact Platform Gold support if needed.');
  }

  if (successCount > 0) {
    console.log('\n🎉 Orders fixed! You may want to verify the status on Platform Gold.');
  }
}

// Also add a function to check current status of an order
async function checkOrderStatus(platformGoldOrderId: number) {
  console.log(`\n🔍 Checking status of Platform Gold order ${platformGoldOrderId}...`);
  
  try {
    const status = await fetchSalesOrderStatus(platformGoldOrderId);
    console.log('   Status:', status.status);
    console.log('   Transaction ID:', status.transactionId);
    console.log('   Amount:', status.amount);
    console.log('   Address:');
    console.log(`      ${status.shippingAddress?.addressee || '(no name)'}`);
    console.log(`      ${status.shippingAddress?.addr1 || '(no address)'}`);
    if (status.shippingAddress?.addr2) {
      console.log(`      ${status.shippingAddress.addr2}`);
    }
    console.log(`      ${status.shippingAddress?.city || ''}, ${status.shippingAddress?.state || ''} ${status.shippingAddress?.zip || ''}`);
    return status;
  } catch (error: any) {
    console.log(`   ❌ Error: ${error.message}`);
    return null;
  }
}

// Run the script
fixOnHoldOrders().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});

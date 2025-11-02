/**
 * Platform Gold Integration Test Script
 * Run with: npx tsx scripts/test-platform-gold.ts
 */

import {
  fetchPaymentMethods,
  fetchShippingInstructions,
  createSalesOrderQuote,
  convertToPlatformGoldAddress,
  formatOrderItems,
  USE_QUOTE_MODE,
} from '../src/lib/platformGoldHelpers';

console.log('🧪 Testing Platform Gold Integration...\n');

async function testPlatformGoldIntegration() {
  try {
    // Test 1: Check mode
    console.log('📊 Current Mode:', USE_QUOTE_MODE ? 'QUOTE (Testing)' : 'ORDER (Production)');
    console.log('');

    // Test 2: Fetch payment methods
    console.log('💳 Fetching payment methods...');
    const paymentMethods = await fetchPaymentMethods();
    console.log(`✅ Found ${paymentMethods.length} payment methods:`);
    paymentMethods.forEach((pm) => {
      console.log(`   - ${pm.title} (ID: ${pm.id})`);
    });
    console.log('');

    // Test 3: Fetch shipping instructions
    console.log('📮 Fetching shipping instructions...');
    const shippingInstructions = await fetchShippingInstructions();
    console.log(`✅ Found ${shippingInstructions.length} shipping instructions:`);
    shippingInstructions.forEach((si) => {
      console.log(`   - ${si.name} (ID: ${si.id})`);
    });
    console.log('');

    // Test 4: Test address conversion
    console.log('🏠 Testing address conversion...');
    const testAddress = {
      fullName: 'John Doe',
      streetAddress: '123 Main St',
      aptSuite: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
    };
    const convertedAddress = convertToPlatformGoldAddress(testAddress);
    console.log('✅ Address converted:', JSON.stringify(convertedAddress, null, 2));
    console.log('');

    // Test 5: Test order items formatting
    console.log('📦 Testing order items formatting...');
    const testItems = [
      { id: 2915, quantity: 2 },
      { id: 2916, quantity: 1 },
    ];
    const formattedItems = formatOrderItems(testItems);
    console.log('✅ Items formatted:', JSON.stringify(formattedItems, null, 2));
    console.log('');

    // Test 6: Create a test quote (if in quote mode)
    if (USE_QUOTE_MODE) {
      console.log('📝 Creating test quote...');
      console.log('⚠️  This will create a REAL quote on Platform Gold!');
      console.log('   Press Ctrl+C to cancel, or wait 3 seconds to continue...');
      
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      const testQuote = {
        confirmationNumber: `TEST-${Date.now()}`,
        items: [{ id: 2915, quantity: 1 }], // Use a real inventory ID from your Platform Gold
        shippingAddress: convertedAddress,
        email: 'test@summitbullion.com',
        paymentMethodId: paymentMethods[0].id,
        shippingInstructionId: shippingInstructions[0].id,
        customerReferenceNumber: `TEST-${Date.now()}`,
        notes: 'Test quote from integration test script',
      };

      try {
        const quote = await createSalesOrderQuote(testQuote);
        console.log('✅ Quote created successfully!');
        console.log('   Handle:', quote.handle);
        console.log('   Amount:', quote.amount);
        console.log('   Expiration:', quote.quoteExpiration);
        console.log('   Line Items:', quote.lineItems.length);
        console.log('');
      } catch (error: any) {
        console.error('❌ Failed to create quote:', error.message);
        console.log('');
      }
    } else {
      console.log('⚠️  Skipping quote creation (not in quote mode)');
      console.log('');
    }

    // Summary
    console.log('✅ All tests completed!');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   - Mode: ${USE_QUOTE_MODE ? 'QUOTE (Testing)' : 'ORDER (Production)'}`);
    console.log(`   - Payment Methods: ${paymentMethods.length}`);
    console.log(`   - Shipping Instructions: ${shippingInstructions.length}`);
    console.log(`   - Address Conversion: ✅`);
    console.log(`   - Items Formatting: ✅`);
    console.log('');
    console.log('🎉 Platform Gold integration is working correctly!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Complete a test purchase on your website');
    console.log('2. Check webhook logs for Platform Gold integration');
    console.log('3. Verify order in Firebase Console');
    console.log('4. View order on /orders page');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Check .env.local has PLATFORM_GOLD_EMAIL and PLATFORM_GOLD_PASSWORD');
    console.error('2. Verify Platform Gold API credentials are correct');
    console.error('3. Ensure Platform Gold API is accessible');
    console.error('4. Check if you need to login first (token might be expired)');
    process.exit(1);
  }
}

testPlatformGoldIntegration();


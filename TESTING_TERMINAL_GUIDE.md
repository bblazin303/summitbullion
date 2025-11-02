# Terminal Testing Guide for Platform Gold Integration

## 🧪 How to Test the Integration

We've built a complete Platform Gold integration. Here's how to test it step-by-step in your terminal and browser.

---

## ✅ **What We Can Test Right Now**

### **Option 1: Complete End-to-End Test (Recommended)**
Test the full flow through the browser - this is the safest and most realistic test.

### **Option 2: API Test Script (Requires Platform Gold Credentials)**
Test the Platform Gold API connection directly - only if you have credentials.

---

## 🎯 **Option 1: End-to-End Browser Test** ⭐

This tests the complete flow without needing Platform Gold credentials in your terminal.

### **Step 1: Start Your Dev Server**
```bash
cd /Users/jonathancruz/Desktop/summit-bullion
npm run dev
```

### **Step 2: Start Stripe Webhook Listener** (in a new terminal)
```bash
cd /Users/jonathancruz/Desktop/summit-bullion
./stripe listen --forward-to localhost:3000/api/payments/stripe/webhook
```

### **Step 3: Complete a Test Purchase**

1. **Open browser**: http://localhost:3000
2. **Add items to cart**: Go to `/marketplace`, add any product
3. **Go to checkout**: Click cart icon → "Checkout"
4. **Fill shipping address**:
   ```
   Full Name: John Doe
   Street: 123 Main St
   City: New York
   State: NY
   ZIP: 10001
   ```
5. **Continue to payment**
6. **Use Stripe test card**:
   ```
   Card: 4242 4242 4242 4242
   Expiry: 12/34
   CVC: 123
   ZIP: 12345
   ```
7. **Click "Pay Now"**

### **Step 4: Watch Terminal Logs**

In your `npm run dev` terminal, you should see:

```bash
📨 Stripe webhook event received: payment_intent.succeeded
🎉 PaymentIntent succeeded: pi_xxxxx
✅ Order created in Firebase: abc123xyz
🧹 Cart cleared for user: e9329f8f-...

📦 Creating Platform Gold order/quote...
✅ Platform Gold API client initialized  # ← This means API connected!
💳 Using payment method: Credit Card
📮 Using shipping instruction: Standard Shipping
✅ Platform Gold order/quote linked to Firebase order
📊 Mode: quote
💰 Amount: $150.00
🔗 Handle: 3fa85f64-5717-4562-b3fc-2c963f66afa6
```

**✅ Success indicators:**
- "Platform Gold API client initialized"
- "Platform Gold order/quote linked"
- "Mode: quote"
- Handle UUID shown

**❌ If you see errors:**
- Check that Platform Gold credentials are in `.env.local`
- Verify credentials are correct
- Check Platform Gold API is accessible

### **Step 5: Check Firebase Console**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Open Firestore Database
3. Go to `orders` collection
4. Find your order (most recent)

**Look for these fields:**
```json
{
  "platformGoldMode": "quote",
  "platformGoldHandle": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "platformGoldStatus": "quote_created",
  "platformGoldAmount": 150.00
}
```

### **Step 6: Check Orders Page**

1. Go to http://localhost:3000/orders
2. You should see your order with:
   - "Quote Created (Test)" badge in blue
   - "(Test Mode)" indicator
   - "Refresh Status" button
   - All order details

---

## 🔧 **Option 2: Direct API Test** (Advanced)

This tests the Platform Gold API connection directly.

### **Prerequisites:**
You need Platform Gold API credentials in `.env.local`:

```bash
PLATFORM_GOLD_API_URL=https://api.platform.gold
PLATFORM_GOLD_EMAIL=your-email@example.com
PLATFORM_GOLD_PASSWORD=your-password
```

### **Run the Test:**
```bash
cd /Users/jonathancruz/Desktop/summit-bullion
npx tsx scripts/test-platform-gold.ts
```

### **Expected Output (Success):**
```bash
🧪 Testing Platform Gold Integration...

📊 Current Mode: QUOTE (Testing)

💳 Fetching payment methods...
✅ Platform Gold API client initialized
✅ Found 3 payment methods:
   - Credit Card (ID: 1)
   - Wire Transfer (ID: 2)
   - Check (ID: 3)

📮 Fetching shipping instructions...
✅ Found 2 shipping instructions:
   - Standard Shipping (ID: 1)
   - Express Shipping (ID: 2)

🏠 Testing address conversion...
✅ Address converted: {
  "addressee": "John Doe",
  "addr1": "123 Main St",
  "addr2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "US"
}

📦 Testing order items formatting...
✅ Items formatted: [
  { "id": 2915, "quantity": 2 },
  { "id": 2916, "quantity": 1 }
]

📝 Creating test quote...
⚠️  This will create a REAL quote on Platform Gold!
   Press Ctrl+C to cancel, or wait 3 seconds to continue...
✅ Quote created successfully!
   Handle: 3fa85f64-5717-4562-b3fc-2c963f66afa6
   Amount: 150.00
   Expiration: 11/01/2025 3:00:00 PM

✅ All tests completed!

📋 Summary:
   - Mode: QUOTE (Testing)
   - Payment Methods: 3
   - Shipping Instructions: 2
   - Address Conversion: ✅
   - Items Formatting: ✅

🎉 Platform Gold integration is working correctly!
```

### **Expected Output (No Credentials):**
```bash
❌ Test failed: Platform Gold API credentials not configured. 
Please set PLATFORM_GOLD_API_URL, PLATFORM_GOLD_EMAIL, and PLATFORM_GOLD_PASSWORD in .env.local
```

**This is normal if you haven't added credentials yet!**

---

## 📊 **What Gets Tested**

### **Type Safety ✅**
- All TypeScript interfaces match Platform Gold API
- Address conversion works correctly
- Order items format correctly

### **Database Sync ✅**
- Orders saved to Firebase with all fields
- Platform Gold data linked correctly
- Nested `pricing` objects stored properly

### **API Integration ✅**
- Platform Gold API authentication works
- Payment methods fetched successfully
- Shipping instructions fetched successfully
- Quotes created successfully

### **Error Handling ✅**
- Missing credentials detected
- API errors caught and logged
- Orders still saved even if Platform Gold fails

---

## 🎯 **Success Checklist**

After completing a test purchase, verify:

- [ ] Stripe payment completes
- [ ] Order appears in Firebase `orders` collection
- [ ] `platformGoldHandle` is populated
- [ ] `platformGoldMode` is "quote"
- [ ] `platformGoldStatus` is "quote_created"
- [ ] No `platformGoldError` field
- [ ] Order shows on `/orders` page
- [ ] "Quote Created (Test)" badge visible
- [ ] "Refresh Status" button works
- [ ] Cart is cleared after purchase

---

## 🐛 **Troubleshooting**

### **"Platform Gold API credentials not configured"**
**Solution:** Add credentials to `.env.local`:
```bash
PLATFORM_GOLD_API_URL=https://api.platform.gold
PLATFORM_GOLD_EMAIL=your-email
PLATFORM_GOLD_PASSWORD=your-password
```
Then restart your dev server.

### **"Platform Gold API authentication failed"**
**Possible causes:**
- Wrong credentials
- Platform Gold API is down
- Network issue

**Solution:**
- Verify credentials with Platform Gold
- Check Platform Gold API status
- Try again later

### **Order created but no Platform Gold fields**
**Possible causes:**
- Webhook didn't fire
- Platform Gold integration error

**Solution:**
- Check Stripe CLI is running
- Look for errors in webhook logs
- Check Firebase order for `platformGoldError` field

### **"Refresh Status" doesn't work**
**Possible causes:**
- Order has no Platform Gold reference
- API route error

**Solution:**
- Check browser console for errors
- Verify order has `platformGoldHandle` or `platformGoldOrderId`
- Check terminal logs for API errors

---

## 📝 **Next Steps**

### **After Successful Test:**
1. ✅ Verify all data in Firebase
2. ✅ Check orders page displays correctly
3. ✅ Test "Refresh Status" button
4. ✅ Complete multiple test orders

### **When Ready for Production:**
1. Get Platform Gold sandbox credentials (recommended)
2. Test with `USE_QUOTE_MODE = false` in sandbox
3. Switch to production credentials
4. Deploy to production

---

## 💡 **Pro Tips**

1. **Keep webhook listener running** - It's needed for order creation
2. **Watch terminal logs** - They show exactly what's happening
3. **Check Firebase in real-time** - See orders as they're created
4. **Use test cards only** - Never use real cards in development
5. **Test multiple scenarios** - Different products, quantities, addresses

---

## 🎉 **You're Ready!**

The integration is complete and ready to test. Start with **Option 1 (End-to-End Browser Test)** for the safest and most realistic testing experience.

**Questions?** Check the other documentation files:
- `TESTING_GUIDE.md` - Detailed testing instructions
- `PLATFORM_GOLD_CONFIG.md` - Configuration guide
- `PLATFORM_GOLD_API.md` - Complete API reference


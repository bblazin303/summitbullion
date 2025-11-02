# Summit Bullion - Testing Guide

## 🧪 Phase 7 Complete: Platform Gold Integration

Your e-commerce platform now integrates with Platform Gold for order fulfillment! Here's how to test it.

---

## ✅ What's Been Implemented

### 1. **Platform Gold Helper Functions** (`src/lib/platformGoldHelpers.ts`)
- Quote creation (safe testing)
- Real order creation (production)
- Order status fetching
- Order polling for async orders
- Smart mode switching (quote vs. order)

### 2. **Webhook Integration** (`src/app/api/payments/stripe/webhook/route.ts`)
- Automatically creates Platform Gold quote/order after Stripe payment
- Fetches payment methods and shipping instructions
- Links Platform Gold order to Firebase order
- Handles errors gracefully

### 3. **Order Status Sync API** (`src/app/api/orders/sync-status/route.ts`)
- Manual sync: `POST /api/orders/sync-status` with `{ orderId }`
- Bulk sync: `GET /api/orders/sync-status` (for cron jobs)
- Updates Firebase with latest Platform Gold status
- Handles both quotes and real orders

### 4. **Enhanced Orders Page** (`src/app/orders/page.tsx`)
- Displays Platform Gold fulfillment status
- Shows quote/order mode indicator
- "Refresh Status" button for manual sync
- Tracking numbers from Platform Gold
- Error messages if integration fails

---

## 🎯 Testing Steps

### **Step 1: Complete a Test Purchase**

1. **Add items to cart**
   - Go to `/marketplace`
   - Add any product to cart
   - Click "Checkout"

2. **Fill shipping address**
   - Enter a valid US address
   - Click "Continue to Payment"

3. **Complete payment with Stripe test card**
   ```
   Card Number: 4242 4242 4242 4242
   Expiry: 12/34 (any future date)
   CVC: 123 (any 3 digits)
   ZIP: 12345 (any 5 digits)
   ```

4. **Click "Pay Now"**
   - Payment will process
   - You'll be redirected to success page

---

### **Step 2: Check Webhook Logs**

In your terminal where `npm run dev` is running, you should see:

```bash
📨 Stripe webhook event received: payment_intent.succeeded
🎉 PaymentIntent succeeded: pi_xxxxx
💰 Amount: 150.00
✅ Order created in Firebase: abc123xyz
🧹 Cart cleared for user: e9329f8f-...

📦 Creating Platform Gold order/quote...
💳 Using payment method: Credit Card
📮 Using shipping instruction: Standard Shipping
✅ Platform Gold order/quote linked to Firebase order
📊 Mode: quote
💰 Amount: $150.00
🔗 Handle: 3fa85f64-5717-4562-b3fc-2c963f66afa6
```

**✅ Success indicators:**
- "Order created in Firebase"
- "Platform Gold order/quote linked"
- "Mode: quote" (test mode)
- Handle UUID received

**❌ Error indicators:**
- "Failed to create Platform Gold order/quote"
- "Platform Gold integration error"
- Check the error message for details

---

### **Step 3: Check Firebase Console**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Firestore Database
4. Open `orders` collection
5. Find your order (most recent)

**Check for these new fields:**
```json
{
  "platformGoldMode": "quote",
  "platformGoldHandle": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "platformGoldStatus": "quote_created",
  "platformGoldAmount": 150.00,
  "platformGoldOrderId": null,  // Will be populated when quote is executed
  "platformGoldTransactionId": null,
  "platformGoldError": null  // Should be null if successful
}
```

---

### **Step 4: View Order on Orders Page**

1. Go to `/orders` in your browser
2. You should see your new order

**What to look for:**

✅ **Fulfillment Status Section:**
- Status badge: "Quote Created (Test)" in blue
- "(Test Mode)" indicator
- "Refresh Status" button visible
- Processing handle shown

✅ **Order Details:**
- All items displayed correctly
- Pricing breakdown accurate
- Shipping address shown
- Total matches Stripe payment

---

### **Step 5: Test Status Sync**

1. On the orders page, click **"Refresh Status"** button
2. Button shows "Syncing..." with spinner
3. After a moment, status updates

**Expected behavior:**
- In quote mode: Status stays "Quote Created (Test)"
- In production mode: Status updates from Platform Gold API
- If there's an error, it's displayed in red box

---

## 🔍 What to Check

### ✅ **Success Checklist**

- [ ] Stripe payment completes successfully
- [ ] Order appears in Firebase `orders` collection
- [ ] `platformGoldHandle` is populated
- [ ] `platformGoldMode` is "quote"
- [ ] `platformGoldStatus` is "quote_created"
- [ ] No `platformGoldError` field (or it's null)
- [ ] Order appears on `/orders` page
- [ ] "Quote Created (Test)" badge is visible
- [ ] "Refresh Status" button works
- [ ] Cart is cleared after purchase

---

### ❌ **Common Issues**

#### **Issue: "Platform Gold integration error" in logs**

**Possible causes:**
1. Platform Gold API credentials missing/incorrect
2. Platform Gold API is down
3. Network connectivity issue

**Check:**
- `.env.local` has `PLATFORM_GOLD_EMAIL` and `PLATFORM_GOLD_PASSWORD`
- Credentials are correct
- Platform Gold API is accessible

**Fix:**
- Verify credentials with Platform Gold
- Check Platform Gold API status
- Restart dev server after updating `.env.local`

---

#### **Issue: Order created but no Platform Gold fields**

**Possible causes:**
1. Webhook didn't fire
2. Platform Gold integration threw an error
3. Firebase update failed

**Check:**
- Stripe webhook logs in terminal
- Firebase order document for `platformGoldError` field
- Browser console for errors

**Fix:**
- Ensure Stripe CLI is running (`./stripe listen --forward-to...`)
- Check webhook logs for specific error
- Verify Firebase Admin SDK is initialized

---

#### **Issue: "Refresh Status" button doesn't work**

**Possible causes:**
1. Order has no Platform Gold reference
2. API route error
3. Network issue

**Check:**
- Browser console for errors
- Order has `platformGoldHandle` or `platformGoldOrderId`
- `/api/orders/sync-status` endpoint is accessible

**Fix:**
- Check browser console for specific error
- Verify order was submitted to Platform Gold
- Test API endpoint directly

---

## 🚀 Next Steps

### **When Ready for Production:**

1. **Get Sandbox Credentials** (recommended)
   - Contact Platform Gold
   - Request sandbox API credentials
   - Test with `USE_QUOTE_MODE = false` in sandbox

2. **Switch to Production Mode**
   - Open `src/lib/platformGoldHelpers.ts`
   - Change `USE_QUOTE_MODE = true` to `false`
   - Update `.env.local` with production credentials
   - Restart dev server

3. **Test Small Order**
   - Complete a purchase with smallest/cheapest item
   - Verify real order is created on Platform Gold
   - Confirm fulfillment begins
   - Test tracking number sync

4. **Set Up Automated Sync** (optional)
   - Create cron job to call `GET /api/orders/sync-status`
   - Run every 5-15 minutes
   - Keeps order statuses up to date automatically

---

## 📊 Monitoring

### **Webhook Logs**
Monitor your terminal for real-time webhook activity:
```bash
npm run dev
```

### **Stripe CLI Logs**
Monitor Stripe webhook events:
```bash
./stripe listen --forward-to localhost:3000/api/payments/stripe/webhook
```

### **Firebase Console**
Monitor orders in real-time:
- Go to Firestore → `orders` collection
- Watch for new orders and status updates

### **Orders Page**
Customer-facing view:
- Go to `/orders`
- See all orders with Platform Gold status
- Use "Refresh Status" to manually sync

---

## 📝 API Documentation

### **Create Platform Gold Order (Automatic)**
Triggered by Stripe webhook after successful payment.

**Endpoint:** `POST /api/payments/stripe/webhook`  
**Trigger:** Stripe `payment_intent.succeeded` event  
**Result:** Creates quote/order on Platform Gold

---

### **Sync Order Status (Manual)**
Fetch latest status from Platform Gold.

**Endpoint:** `POST /api/orders/sync-status`  
**Body:**
```json
{
  "orderId": "firebase-order-id"
}
```
**Response:**
```json
{
  "success": true,
  "orderId": "abc123",
  "platformGoldOrderId": 12345,
  "status": "Pending Fulfillment",
  "trackingNumbers": []
}
```

---

### **Bulk Sync (Cron Job)**
Sync all pending orders.

**Endpoint:** `GET /api/orders/sync-status`  
**Response:**
```json
{
  "success": true,
  "message": "Synced 5 orders",
  "syncedCount": 5,
  "results": [...]
}
```

---

## 🎉 You're Ready to Test!

Follow the steps above to complete a test purchase and verify the Platform Gold integration is working correctly.

**Questions?** Check:
- `PLATFORM_GOLD_API.md` - Full API documentation
- `PLATFORM_GOLD_CONFIG.md` - Configuration guide
- Webhook logs in terminal
- Firebase Console for order details


# Platform Gold Integration Configuration

## Current Mode: **QUOTE MODE (Testing)**

The integration is currently set to **QUOTE MODE**, which means:
- ✅ All orders create **quotes** instead of real orders
- ✅ Safe for testing without actual fulfillment
- ✅ No real charges or shipments
- ✅ Can test the full integration flow

---

## Switching to Production Mode

When you're ready to create **real orders** with actual fulfillment:

### Step 1: Update Configuration
Open `src/lib/platformGoldHelpers.ts` and change:

```typescript
// Line 111
export const USE_QUOTE_MODE = true;  // ← Change this to false
```

To:

```typescript
export const USE_QUOTE_MODE = false;  // ← Production mode
```

### Step 2: Verify Credentials
Make sure your `.env.local` has production Platform Gold credentials:

```bash
PLATFORM_GOLD_API_URL=https://api.platform.gold
PLATFORM_GOLD_EMAIL=your-production-email@example.com
PLATFORM_GOLD_PASSWORD=your-production-password
```

### Step 3: Test in Sandbox (if available)
If Platform Gold provides sandbox credentials:
1. Use sandbox credentials in `.env.local`
2. Set `USE_QUOTE_MODE = false`
3. Test full order flow
4. Verify orders appear in Platform Gold dashboard

### Step 4: Go Live
1. Switch to production credentials
2. Set `USE_QUOTE_MODE = false`
3. Test with a small order
4. Monitor webhook logs and Firebase orders collection

---

## How It Works

### Quote Mode (Current)
```
Stripe Payment → Firebase Order → Platform Gold Quote → Quote Handle Stored
```

**What happens:**
- Payment is processed by Stripe (real money)
- Order is saved in Firebase
- Quote is created on Platform Gold (no fulfillment)
- You can see the quote details in the orders page

### Production Mode (When Ready)
```
Stripe Payment → Firebase Order → Platform Gold Sales Order → Real Fulfillment
```

**What happens:**
- Payment is processed by Stripe (real money)
- Order is saved in Firebase
- **Real sales order** is created on Platform Gold
- Order is fulfilled and shipped to customer
- Tracking numbers are synced back to Firebase

---

## Testing Checklist

### ✅ Quote Mode Testing (Safe)
- [x] Create Platform Gold helper functions
- [x] Update webhook to create quotes
- [x] Create order status sync API
- [x] Update orders page to show status
- [ ] Complete a test Stripe payment
- [ ] Verify quote is created on Platform Gold
- [ ] Check Firebase for Platform Gold fields
- [ ] Test status sync button on orders page

### 🚀 Production Mode Testing (When Ready)
- [ ] Switch to production credentials
- [ ] Set `USE_QUOTE_MODE = false`
- [ ] Complete a small test order
- [ ] Verify real order is created
- [ ] Confirm fulfillment begins
- [ ] Test tracking number sync
- [ ] Monitor for any errors

---

## Monitoring & Debugging

### View Webhook Logs
```bash
# Terminal where Stripe CLI is running
# You'll see logs like:
📦 Creating Platform Gold order/quote...
💳 Using payment method: Credit Card
📮 Using shipping instruction: Standard Shipping
✅ Platform Gold order/quote linked to Firebase order
📊 Mode: quote
💰 Amount: $150.00
🔗 Handle: 3fa85f64-5717-4562-b3fc-2c963f66afa6
```

### Check Firebase Orders
1. Go to Firebase Console → Firestore
2. Open `orders` collection
3. Look for these new fields:
   - `platformGoldMode`: "quote" or "order"
   - `platformGoldHandle`: UUID for async orders
   - `platformGoldOrderId`: Platform Gold order ID (when complete)
   - `platformGoldStatus`: Current status
   - `platformGoldAmount`: Amount from Platform Gold

### Sync Order Status
1. Go to `/orders` page
2. Click "Refresh Status" button on any order
3. Status will update from Platform Gold API

---

## API Endpoints

### Create/Sync Orders
- **Webhook**: `/api/payments/stripe/webhook` (automatic)
- **Sync Status**: `/api/orders/sync-status` (manual or cron)

### Sync All Pending Orders (Cron Job)
```bash
GET /api/orders/sync-status
```

This endpoint syncs all orders that need status updates. You can:
- Call it manually for testing
- Set up a cron job to run every 5-15 minutes
- Use Vercel Cron Jobs (when deployed)

---

## Troubleshooting

### Quote Not Created
**Check:**
1. Platform Gold API credentials in `.env.local`
2. Webhook logs for errors
3. Firebase order document for `platformGoldError` field

### Status Not Syncing
**Check:**
1. Order has `platformGoldHandle` or `platformGoldOrderId`
2. Platform Gold API is accessible
3. Browser console for sync errors

### Wrong Mode
**Check:**
1. `USE_QUOTE_MODE` in `src/lib/platformGoldHelpers.ts`
2. Restart Next.js dev server after changing

---

## Support

For Platform Gold API issues:
- Contact Platform Gold support
- Request sandbox credentials for testing
- Ask about webhook notifications (if available)

For integration issues:
- Check webhook logs
- Review Firebase order documents
- Test API endpoints directly


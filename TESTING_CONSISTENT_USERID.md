# Testing Consistent UserId Implementation

## What Changed

We've implemented a **consistent userId** system for email authentication users. Previously, Alchemy was generating a new `userId` each session for email users, causing cart items to be saved under different user IDs.

### The Fix

- **Email auth users**: `userId` = `emailToUserId(email)` (e.g., `jcruzfff@gmail.com` → `jcruzfff_gmail_com`)
- **Google OAuth users**: `userId` = Alchemy's JWT userId (unchanged)

### Files Modified

1. **`src/lib/userIdHelper.ts`** - New helper function to convert email to consistent userId
2. **`src/hooks/useConsistentUserId.ts`** - New React hook for frontend
3. **`src/context/CartContext.tsx`** - Uses `useConsistentUserId` hook
4. **`src/lib/auth/verifyAlchemyToken.ts`** - `requireFlexibleAuth` now returns email-based userId
5. **`src/app/api/user/sync/route.ts`** - Uses `emailToUserId` for email auth
6. **`src/app/api/cart/**/*.ts`** - All cart routes use `emailToUserId`

---

## Testing Plan

### Phase 1: Clean Slate Test (RECOMMENDED)

**Goal**: Verify that a brand new user gets consistent userId across all operations.

#### Steps:

1. **Clean Firebase**:
   ```bash
   # In Firebase Console, delete these users:
   # - 101838333071877152968
   # - jcruzfff_gmail_com
   ```

2. **Clear Browser Data**:
   - Open DevTools → Application → Clear site data
   - Or use Incognito/Private window

3. **Restart Dev Server**:
   ```bash
   # Kill current server
   npm run dev
   ```

4. **Test Flow**:
   ```
   a. Navigate to http://localhost:3000
   b. Click "Login" → Use email: jcruzfff@gmail.com
   c. Go to Marketplace
   d. Add 2-3 items to cart
   e. Check terminal logs - should see:
      ✅ "➕ Adding to cart for user: jcruzfff_gmail_com"
      ✅ "📧 Email auth cart add - converting email to userId: jcruzfff@gmail.com -> jcruzfff_gmail_com"
   
   f. Refresh the page (Cmd+R or Ctrl+R)
   g. Check terminal logs - should see:
      ✅ "🔄 Loading cart from API for user: jcruzfff_gmail_com"
      ✅ "📧 Email auth cart request - converting email to userId: jcruzfff@gmail.com -> jcruzfff_gmail_com"
      ✅ "✅ Cart loaded successfully: 3 items" (or however many you added)
   
   h. Verify cart UI shows all items
   ```

5. **Check Firebase**:
   ```
   Navigate to Firebase Console → Firestore Database
   
   ✅ Should see ONE user: "jcruzfff_gmail_com"
   ✅ Should see cart at: users/jcruzfff_gmail_com/cart/current
   ✅ Cart should have all items you added
   ```

---

### Phase 2: Checkout & Platform Gold Integration Test

**Goal**: Verify Platform Gold receives the correct userId and order is linked properly.

#### Steps:

1. **Continue from Phase 1** (with items in cart)

2. **Go to Checkout**:
   ```
   a. Click cart icon → "Checkout"
   b. Fill in shipping address
   c. Click "Continue to Payment"
   d. Check terminal logs - should see:
      ✅ "📊 Fetching Platform Gold quote for accurate pricing..."
      ✅ "📧 Email auth: Using email-based userId: jcruzfff@gmail.com -> jcruzfff_gmail_com"
      ✅ "✅ Platform Gold quote received:"
      ✅ "💰 Pricing breakdown:"
   ```

3. **Complete Payment** (use Stripe test card):
   ```
   Card: 4242 4242 4242 4242
   Expiry: Any future date (e.g., 12/25)
   CVC: Any 3 digits (e.g., 123)
   ZIP: Any 5 digits (e.g., 90210)
   
   Click "Pay Now"
   ```

4. **Check Terminal Logs**:
   ```
   ✅ "📨 Stripe webhook event received: payment_intent.succeeded"
   ✅ "💰 PaymentIntent succeeded: pi_..."
   ✅ "📧 Email auth: Using email-based userId: jcruzfff@gmail.com -> jcruzfff_gmail_com"
   ✅ "✅ Order created in Firebase: [orderId]"
   ✅ "📦 Creating Platform Gold order/quote..."
   ✅ "🧪 Using QUOTE mode (safe testing)"
   ✅ "✅ Quote created: { handle: '...', amount: ..., expiration: '...' }"
   ✅ "✅ Platform Gold order/quote created successfully"
   ✅ "🧹 Cart cleared for user: jcruzfff_gmail_com"
   ```

5. **Check Firebase**:
   ```
   Firebase Console → Firestore Database
   
   ✅ orders collection should have new order with:
      - userId: "jcruzfff_gmail_com"
      - userEmail: "jcruzfff@gmail.com"
      - platformGoldHandle: "[some-uuid]"
      - platformGoldMode: "quote"
      - status: "pending_fulfillment"
   
   ✅ users/jcruzfff_gmail_com/cart/current should be empty or deleted
   ```

6. **Check Orders Page**:
   ```
   a. Navigate to http://localhost:3000/orders
   b. Should see your order listed
   c. Status should show "Pending Fulfillment"
   d. Check terminal logs:
      ✅ "📧 Email auth: Using email-based userId: jcruzfff@gmail.com -> jcruzfff_gmail_com"
   ```

---

### Phase 3: Session Persistence Test

**Goal**: Verify userId remains consistent across browser sessions.

#### Steps:

1. **Close Browser Completely**

2. **Reopen Browser & Navigate to Site**:
   ```
   a. Go to http://localhost:3000
   b. Login with same email: jcruzfff@gmail.com
   c. Check terminal logs:
      ✅ "📧 Email auth - using email-based userId: jcruzfff_gmail_com"
   ```

3. **Add New Items to Cart**:
   ```
   a. Go to Marketplace
   b. Add 1-2 new items
   c. Check terminal logs:
      ✅ "➕ Adding to cart for user: jcruzfff_gmail_com"
   ```

4. **Check Firebase**:
   ```
   ✅ Still only ONE user: "jcruzfff_gmail_com"
   ✅ Cart at: users/jcruzfff_gmail_com/cart/current
   ✅ New items added to same cart
   ```

---

### Phase 4: Multiple Operations Test

**Goal**: Verify all cart operations use consistent userId.

#### Steps:

1. **Add Item**:
   ```
   Terminal should show: "➕ Adding to cart for user: jcruzfff_gmail_com"
   ```

2. **Update Quantity**:
   ```
   Click +/- buttons on cart item
   Terminal should show: "📧 Email auth cart update - converting email to userId: jcruzfff@gmail.com -> jcruzfff_gmail_com"
   ```

3. **Remove Item**:
   ```
   Click X button on cart item
   Terminal should show: "➖ Removing from cart for user: jcruzfff_gmail_com"
   ```

4. **Clear Cart**:
   ```
   (If you have a clear cart button)
   Terminal should show: "📧 Email auth cart clear - converting email to userId: jcruzfff@gmail.com -> jcruzfff_gmail_com"
   ```

---

## Expected Terminal Log Pattern

For **every** cart operation, you should see this pattern:

```bash
# Frontend (CartContext)
🔄 Loading cart from API for user: jcruzfff_gmail_com
# or
➕ Adding to cart for user: jcruzfff_gmail_com
# or
➖ Removing from cart for user: jcruzfff_gmail_com

# Backend (API Route)
📧 Email auth cart [operation] - converting email to userId: jcruzfff@gmail.com -> jcruzfff_gmail_com
```

---

## What to Look For (Success Criteria)

### ✅ SUCCESS:
- Only **ONE** user document in Firebase: `jcruzfff_gmail_com`
- Cart items persist across page refreshes
- All terminal logs show same userId: `jcruzfff_gmail_com`
- Orders are created with userId: `jcruzfff_gmail_com`
- Platform Gold integration uses consistent userId

### ❌ FAILURE:
- Multiple user documents in Firebase (e.g., `101838333071877152968` AND `jcruzfff_gmail_com`)
- Cart items disappear on refresh
- Terminal logs show different userIds
- Orders created with wrong userId

---

## Troubleshooting

### Issue: Cart still empty after refresh

**Check**:
1. Terminal logs - is the same userId being used for add and load?
2. Firebase - does `users/jcruzfff_gmail_com/cart/current` exist?
3. Browser console - any errors?

**Fix**:
- Clear browser cache and cookies
- Restart dev server
- Delete old user documents from Firebase

### Issue: Multiple users in Firebase

**Check**:
1. Are you using the old Alchemy app?
2. Did you clear browser data?

**Fix**:
- Delete ALL user documents from Firebase
- Clear browser completely
- Use Incognito/Private window
- Start fresh from Phase 1

### Issue: Platform Gold not receiving correct userId

**Check**:
1. Terminal logs during checkout
2. Firebase order document - check `userId` field
3. PaymentIntent metadata in Stripe Dashboard

**Fix**:
- Verify `requireFlexibleAuth` is returning email-based userId
- Check `create-payment-intent` route logs
- Check webhook logs

---

## Quick Verification Script

Run this in your browser console while logged in:

```javascript
// Check what userId the frontend is using
const user = window.localStorage.getItem('alchemy-user');
console.log('Alchemy user:', JSON.parse(user));

// Check cart
fetch('/api/cart?email=jcruzfff@gmail.com&authType=email')
  .then(r => r.json())
  .then(data => console.log('Cart:', data));
```

Expected output:
```
Alchemy user: { userId: "some-random-id", email: "jcruzfff@gmail.com", ... }
Cart: { success: true, cart: { userId: "jcruzfff_gmail_com", items: [...] } }
```

Note: The Alchemy `userId` will be random, but the cart's `userId` should be `jcruzfff_gmail_com`.

---

## Summary

The key insight is that **frontend and backend now use different userIds**:

- **Frontend (Alchemy)**: Random userId per session (e.g., `101838333071877152968`)
- **Backend (Firebase)**: Consistent email-based userId (e.g., `jcruzfff_gmail_com`)

The `useConsistentUserId` hook and `emailToUserId` function bridge this gap, ensuring all Firebase operations use the same userId regardless of what Alchemy provides.


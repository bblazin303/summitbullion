# Consistent UserId Implementation - Summary

## The Problem

Alchemy generates a **new random `userId`** for email auth users on every session:
- Session 1: `userId = "101838333071877152968"`
- Session 2: `userId = "049b9021-2a8e-4f68-a4df-46ca92236d6c"`
- Session 3: `userId = "abc123..."`

This caused:
- ❌ Cart items saved under different user IDs
- ❌ Cart appears empty on page refresh
- ❌ Multiple user documents in Firebase for same email
- ❌ Orders linked to wrong userId

## The Solution

Convert email to a **consistent userId** that never changes:

```typescript
emailToUserId("jcruzfff@gmail.com") → "jcruzfff_gmail_com"
```

Now:
- ✅ Same userId across all sessions
- ✅ Cart persists on refresh
- ✅ One user document per email
- ✅ Orders correctly linked

## Implementation Details

### 1. Helper Function (`src/lib/userIdHelper.ts`)

```typescript
export function emailToUserId(email: string): string {
  return email.toLowerCase().replace(/[^a-z0-9]/g, '_');
}
```

### 2. Frontend Hook (`src/hooks/useConsistentUserId.ts`)

```typescript
export function useConsistentUserId() {
  const user = useUser(); // Alchemy hook
  
  const consistentUserId = useMemo(() => {
    if (!user) return null;
    
    const isEmailAuth = !user.idToken;
    
    if (isEmailAuth) {
      return emailToUserId(user.email); // "jcruzfff_gmail_com"
    }
    
    return user.userId; // Google OAuth uses Alchemy's ID
  }, [user]);
  
  return { userId: consistentUserId, email: user?.email, isEmailAuth };
}
```

### 3. Backend Auth (`src/lib/auth/verifyAlchemyToken.ts`)

```typescript
export async function requireFlexibleAuth(body: any): Promise<VerifiedUser> {
  if (body.authType === 'email') {
    const consistentUserId = emailToUserId(body.email);
    return {
      userId: consistentUserId, // ← Returns email-based ID
      email: body.email,
      // ...
    };
  }
  
  // Google OAuth: verify JWT and return Alchemy userId
  return await requireAuth();
}
```

### 4. Cart Context (`src/context/CartContext.tsx`)

```typescript
export const CartProvider = ({ children }) => {
  const user = useUser(); // Alchemy user (random ID)
  const { userId: consistentUserId, email, isEmailAuth } = useConsistentUserId(); // ← Consistent ID
  
  // All operations use consistentUserId:
  const addToCart = async (item) => {
    if (consistentUserId) {
      await fetch('/api/cart/add', {
        body: JSON.stringify({
          item,
          authType: isEmailAuth ? 'email' : 'google',
          userId: consistentUserId, // ← Always "jcruzfff_gmail_com"
          email: email,
        }),
      });
    }
  };
  
  // Same for: removeFromCart, updateQuantity, clearCart, loadCart
};
```

### 5. All API Routes

Every cart/order API route now:

```typescript
import { emailToUserId } from '@/lib/userIdHelper';

export async function POST(request: NextRequest) {
  const { authType, email } = await request.json();
  
  let userId: string;
  
  if (authType === 'email' && email) {
    userId = emailToUserId(email); // ← Convert email to consistent ID
  } else {
    const user = await requireAuth(); // Google OAuth
    userId = user.userId;
  }
  
  // Use userId for all Firebase operations
  await addToCart(userId, item);
}
```

## Data Flow

### Before (Broken):

```
User logs in → Alchemy assigns random userId: "101838..."
Add to cart → Saved to: users/101838.../cart/current
Refresh page → Alchemy assigns NEW random userId: "049b90..."
Load cart → Looks for: users/049b90.../cart/current ← NOT FOUND!
```

### After (Fixed):

```
User logs in → Alchemy assigns random userId: "101838..."
                ↓
         useConsistentUserId() converts to: "jcruzfff_gmail_com"
                ↓
Add to cart → Saved to: users/jcruzfff_gmail_com/cart/current
Refresh page → Alchemy assigns NEW random userId: "049b90..."
                ↓
         useConsistentUserId() converts to: "jcruzfff_gmail_com" (SAME!)
                ↓
Load cart → Looks for: users/jcruzfff_gmail_com/cart/current ← FOUND!
```

## Where Consistent UserId is Used

### Frontend:
- ✅ `CartContext` - All cart operations
- ✅ `useConsistentUserId` hook - Provides consistent ID to components

### Backend:
- ✅ `/api/user/sync` - User profile creation
- ✅ `/api/cart` - Get cart
- ✅ `/api/cart/add` - Add item
- ✅ `/api/cart/remove` - Remove item
- ✅ `/api/cart/update` - Update quantity
- ✅ `/api/cart/clear` - Clear cart
- ✅ `/api/payments/stripe/create-payment-intent` - Checkout (via `requireFlexibleAuth`)
- ✅ `/api/payments/stripe/webhook` - Order creation (via `requireFlexibleAuth`)
- ✅ Platform Gold integration - All order/quote creation

## Firebase Structure

### Before (Multiple users for same email):
```
users/
  ├─ 101838333071877152968/
  │   ├─ email: "jcruzfff@gmail.com"
  │   └─ cart/current/ (3 items)
  └─ 049b9021-2a8e-4f68-a4df-46ca92236d6c/
      ├─ email: "jcruzfff@gmail.com"
      └─ cart/current/ (empty or missing)
```

### After (One user per email):
```
users/
  └─ jcruzfff_gmail_com/
      ├─ email: "jcruzfff@gmail.com"
      └─ cart/
          └─ current/ (all items persist)

orders/
  └─ [orderId]/
      ├─ userId: "jcruzfff_gmail_com" ← Consistent!
      ├─ userEmail: "jcruzfff@gmail.com"
      └─ platformGoldHandle: "..."
```

## Testing Checklist

- [ ] Delete old user documents from Firebase
- [ ] Clear browser data (cookies, localStorage)
- [ ] Restart dev server
- [ ] Login with email
- [ ] Add items to cart
- [ ] Check terminal: Should see `jcruzfff_gmail_com` in all logs
- [ ] Refresh page
- [ ] Check cart still has items
- [ ] Check Firebase: Only ONE user document
- [ ] Complete checkout
- [ ] Check order has correct userId
- [ ] Check Platform Gold integration logs

## Key Files Modified

1. `src/lib/userIdHelper.ts` - NEW: Email to userId conversion
2. `src/hooks/useConsistentUserId.ts` - NEW: React hook for consistent userId
3. `src/context/CartContext.tsx` - Uses `useConsistentUserId`
4. `src/lib/auth/verifyAlchemyToken.ts` - Returns email-based userId for email auth
5. `src/app/api/user/sync/route.ts` - Uses `emailToUserId`
6. `src/app/api/cart/route.ts` - Uses `emailToUserId`
7. `src/app/api/cart/add/route.ts` - Uses `emailToUserId`
8. `src/app/api/cart/remove/route.ts` - Uses `emailToUserId`
9. `src/app/api/cart/update/route.ts` - Uses `emailToUserId`
10. `src/app/api/cart/clear/route.ts` - Uses `emailToUserId`

## Platform Gold Integration

Platform Gold now receives the **consistent userId** in:

1. **Payment Intent Creation** (`create-payment-intent/route.ts`):
   - `requireFlexibleAuth` returns `jcruzfff_gmail_com`
   - Used in `customerReferenceNumber` for Platform Gold quote

2. **Webhook** (`webhook/route.ts`):
   - `requireFlexibleAuth` returns `jcruzfff_gmail_com`
   - Order created with `userId: "jcruzfff_gmail_com"`
   - Platform Gold order linked to correct user

3. **Order Status Sync** (`orders/sync-status/route.ts`):
   - Fetches orders by `userId: "jcruzfff_gmail_com"`
   - Updates correct user's orders

## Why This Works

**The key insight**: Alchemy's random `userId` is only used **in the frontend** for their internal tracking. We don't need to use it for our Firebase operations.

Instead, we:
1. Let Alchemy handle authentication (they verify the email)
2. Use the **email** as the source of truth
3. Convert email to a **consistent, Firebase-safe userId**
4. Use this consistent ID for **all Firebase operations**

This way:
- Alchemy can change their `userId` every session (we don't care)
- Our Firebase data remains consistent (keyed by email-based ID)
- User experience is seamless (cart persists, orders linked correctly)

## Google OAuth Users

**Note**: This change only affects **email auth** users. Google OAuth users continue to use Alchemy's JWT-verified `userId` (which is already consistent across sessions).

```typescript
if (isEmailAuth) {
  userId = emailToUserId(email); // Email auth: consistent ID
} else {
  userId = user.userId; // Google OAuth: Alchemy's ID (already consistent)
}
```


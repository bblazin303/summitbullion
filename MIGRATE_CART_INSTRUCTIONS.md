# Migrate Cart from Google OAuth to Email Auth

## Quick Fix in Firebase Console

1. **Go to Firebase Console** → Firestore Database

2. **Navigate to**: `users/101838333071877152968/cart/current`

3. **Copy the document**:
   - Click the three dots menu
   - Select "Copy document"

4. **Create new path**: `users/jcruzfff_gmail_com/cart/current`
   - Go to `users` collection
   - Click on `jcruzfff_gmail_com` document
   - Click "Start collection"
   - Collection ID: `cart`
   - Document ID: `current`
   - Paste the copied cart data

5. **Refresh your app** - cart should now appear!

---

## Or Use This Script

Run this in Firebase Console's Firestore Rules Playground or via Firebase Admin SDK:

```javascript
// Copy cart from Google OAuth user to email auth user
const oldUserId = '101838333071877152968';
const newUserId = 'jcruzfff_gmail_com';

const oldCartRef = db.collection('users').doc(oldUserId).collection('cart').doc('current');
const newCartRef = db.collection('users').doc(newUserId).collection('cart').doc('current');

const cartData = await oldCartRef.get();
if (cartData.exists) {
  await newCartRef.set(cartData.data());
  console.log('✅ Cart migrated successfully!');
}
```

---

## Long-term Solution

**Decide on one auth method**:

- **Google OAuth**: More reliable, consistent userId from Google
- **Email Auth**: More flexible, but Alchemy generates random IDs (we convert to email-based)

For production, I recommend **Google OAuth** for better user experience and fewer edge cases.


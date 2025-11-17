// Firebase Admin SDK Configuration
// This runs on the server-side (API routes, webhooks)

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: App | undefined;

// Initialize Firebase Admin (only once)
if (getApps().length === 0) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!process.env.FIREBASE_ADMIN_PROJECT_ID || 
      !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 
      !privateKey) {
    console.warn('⚠️ Firebase Admin credentials not configured. Server-side features will not work.');
    console.warn('Please add FIREBASE_ADMIN_* variables to your .env.local file');
    app = undefined;
  } else {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log('✅ Firebase Admin initialized');
  }
} else {
  app = getApps()[0];
}

// Export Admin services
export const adminAuth = app ? getAuth(app) : null;
export const adminDb = app ? getFirestore(app) : null;

// Helper functions for common operations
export async function verifyIdToken(token: string) {
  if (!adminAuth) {
    throw new Error('Firebase Admin not initialized');
  }
  return await adminAuth.verifyIdToken(token);
}

export async function getUserByEmail(email: string) {
  if (!adminAuth) {
    throw new Error('Firebase Admin not initialized');
  }
  return await adminAuth.getUserByEmail(email);
}

export async function createCustomToken(uid: string) {
  if (!adminAuth) {
    throw new Error('Firebase Admin not initialized');
  }
  return await adminAuth.createCustomToken(uid);
}


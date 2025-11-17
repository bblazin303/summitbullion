// Test Firebase Connection
// Visit: http://localhost:3000/api/test-firebase

import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: {} as Record<string, { status: string; message: string; details?: unknown }>,
  };

  // Test 1: Check environment variables
  results.tests.envVars = {
    status: 'checking',
    message: 'Checking environment variables...',
  };

  const requiredEnvVars = {
    // Client vars
    'NEXT_PUBLIC_FIREBASE_API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    // Admin vars
    'FIREBASE_ADMIN_PROJECT_ID': process.env.FIREBASE_ADMIN_PROJECT_ID,
    'FIREBASE_ADMIN_CLIENT_EMAIL': process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    'FIREBASE_ADMIN_PRIVATE_KEY': process.env.FIREBASE_ADMIN_PRIVATE_KEY ? '***SET***' : undefined,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    results.tests.envVars = {
      status: '❌ FAILED',
      message: `Missing ${missingVars.length} environment variable(s)`,
      details: missingVars,
    };
  } else {
    results.tests.envVars = {
      status: '✅ PASSED',
      message: 'All required environment variables are set',
      details: requiredEnvVars,
    };
  }

  // Test 2: Check Firebase Admin initialization
  results.tests.adminInit = {
    status: 'checking',
    message: 'Checking Firebase Admin initialization...',
  };

  if (!adminAuth || !adminDb) {
    results.tests.adminInit = {
      status: '❌ FAILED',
      message: 'Firebase Admin SDK failed to initialize',
      details: 'Check your FIREBASE_ADMIN_* environment variables',
    };
    return NextResponse.json(results, { status: 500 });
  }

  results.tests.adminInit = {
    status: '✅ PASSED',
    message: 'Firebase Admin SDK initialized successfully',
  };

  // Test 3: Test Firestore write/read
  results.tests.firestoreWrite = {
    status: 'checking',
    message: 'Testing Firestore write...',
  };

  try {
    const testRef = adminDb.collection('_test').doc('connection-test');
    const testData = {
      timestamp: new Date().toISOString(),
      message: 'Firebase connection test',
    };

    await testRef.set(testData);

    results.tests.firestoreWrite = {
      status: '✅ PASSED',
      message: 'Successfully wrote to Firestore',
      details: testData,
    };
  } catch (error) {
    results.tests.firestoreWrite = {
      status: '❌ FAILED',
      message: 'Failed to write to Firestore',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    return NextResponse.json(results, { status: 500 });
  }

  // Test 4: Test Firestore read
  results.tests.firestoreRead = {
    status: 'checking',
    message: 'Testing Firestore read...',
  };

  try {
    const testRef = adminDb.collection('_test').doc('connection-test');
    const snapshot = await testRef.get();

    if (snapshot.exists) {
      results.tests.firestoreRead = {
        status: '✅ PASSED',
        message: 'Successfully read from Firestore',
        details: snapshot.data(),
      };
    } else {
      results.tests.firestoreRead = {
        status: '⚠️ WARNING',
        message: 'Document exists but no data found',
      };
    }
  } catch (error) {
    results.tests.firestoreRead = {
      status: '❌ FAILED',
      message: 'Failed to read from Firestore',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    return NextResponse.json(results, { status: 500 });
  }

  // Test 5: Clean up test document
  results.tests.cleanup = {
    status: 'checking',
    message: 'Cleaning up test document...',
  };

  try {
    const testRef = adminDb.collection('_test').doc('connection-test');
    await testRef.delete();

    results.tests.cleanup = {
      status: '✅ PASSED',
      message: 'Test document deleted successfully',
    };
  } catch (error) {
    results.tests.cleanup = {
      status: '⚠️ WARNING',
      message: 'Failed to clean up test document (not critical)',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Summary
  const allTests = Object.values(results.tests);
  const passedTests = allTests.filter(t => t.status.includes('✅')).length;
  const totalTests = allTests.length;

  return NextResponse.json({
    ...results,
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: totalTests - passedTests,
      status: passedTests === totalTests ? '🎉 ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED',
    },
  });
}


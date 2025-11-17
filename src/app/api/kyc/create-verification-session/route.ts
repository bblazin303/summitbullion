import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { requireFlexibleAuth } from '@/lib/auth/verifyAlchemyToken';

/**
 * POST /api/kyc/create-verification-session
 * 
 * Creates a Stripe Identity VerificationSession for KYC
 * Required for orders over $3,000
 */
export async function POST(req: NextRequest) {
  try {
    console.log('📋 Creating Stripe Identity verification session...');

    // Authenticate user
    const body = await req.json();
    const user = await requireFlexibleAuth(body);

    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated:', user.email);

    // Create Stripe Identity VerificationSession
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      provided_details: {
        email: user.email,
      },
      metadata: {
        userId: user.userId,
        email: user.email,
        purpose: 'high_value_order_kyc',
      },
      // Optional: Customize the verification flow
      options: {
        document: {
          // Require ID number extraction
          require_id_number: true,
          // Require matching selfie
          require_matching_selfie: true,
        },
      },
    });

    console.log('✅ Verification session created:', verificationSession.id);

    // Return only the client secret (never expose full session details)
    return NextResponse.json({
      success: true,
      clientSecret: verificationSession.client_secret,
      verificationSessionId: verificationSession.id,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create verification session';
    console.error('❌ Error creating verification session:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: 500 }
    );
  }
}


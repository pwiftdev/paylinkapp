import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/referrals/verify?userId=user_id - Check if user is verified (has at least 1 paid link)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID parameter required' },
        { status: 400 }
      );
    }

    // Check if user has at least 1 paid link
    const { data: paidLinks, error } = await supabase
      .from('links')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'paid')
      .limit(1);

    if (error) {
      console.error('Error checking verification:', error);
      return NextResponse.json(
        { error: 'Failed to check verification' },
        { status: 500 }
      );
    }

    const isVerified = (paidLinks?.length || 0) > 0;

    return NextResponse.json({
      verified: isVerified,
      paidLinksCount: paidLinks?.length || 0,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


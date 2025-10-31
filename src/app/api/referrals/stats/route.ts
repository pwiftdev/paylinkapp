import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/referrals/stats?username=username - Get referral stats for a specific user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username parameter required' },
        { status: 400 }
      );
    }

    // Get the user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username')
      .eq('username', username.toLowerCase())
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all users referred by this user
    const { data: referrals, error: referralsError } = await supabase
      .from('users')
      .select('id, username, created_at')
      .eq('referrer_username', username.toLowerCase());

    if (referralsError) {
      console.error('Error fetching referrals:', referralsError);
      return NextResponse.json(
        { error: 'Failed to fetch referral stats' },
        { status: 500 }
      );
    }

    // Get all links to check which users are verified
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('user_id, status');

    if (linksError) {
      console.error('Error fetching links:', linksError);
      return NextResponse.json(
        { error: 'Failed to fetch referral stats' },
        { status: 500 }
      );
    }

    // Build user verification map
    const verifiedUsers = new Set<string>();
    links?.forEach(link => {
      if (link.status === 'paid') {
        verifiedUsers.add(link.user_id);
      }
    });

    // Count verified referrals (have at least 1 paid link)
    const verifiedReferrals = referrals?.filter(r => verifiedUsers.has(r.id)) || [];

    // Calculate points: 1 point per referral, +2 bonus for verified
    const totalReferrals = referrals?.length || 0;
    const verifiedCount = verifiedReferrals.length;
    const points = totalReferrals + (verifiedCount * 2);

    // Get leaderboard rank
    const { data: allReferrers } = await supabase
      .from('users')
      .select('id, username, referrer_username')
      .not('referrer_username', 'is', null);

    if (allReferrers) {
      const referrerPointsMap: Record<string, number> = {};
      
      allReferrers.forEach(ref => {
        if (!ref.referrer_username) return;
        const refUsername = ref.referrer_username.toLowerCase();
        
        if (!referrerPointsMap[refUsername]) {
          referrerPointsMap[refUsername] = 0;
        }
        
        referrerPointsMap[refUsername] += 1; // Base point
        
        if (verifiedUsers.has(ref.id)) {
          referrerPointsMap[refUsername] += 2; // Bonus points
        }
      });

      const sortedReferrers = Object.entries(referrerPointsMap)
        .sort(([, a], [, b]) => b - a);

      const rank = sortedReferrers.findIndex(([uname]) => uname === username.toLowerCase()) + 1;
      const totalReferrers = sortedReferrers.length;

      return NextResponse.json({
        username: user.username,
        totalReferrals,
        verifiedReferrals: verifiedCount,
        points,
        rank: rank > 0 ? rank : null,
        totalReferrers: totalReferrers,
        referrals: referrals?.map(r => ({
          username: r.username,
          verified: verifiedUsers.has(r.id),
          joinedAt: r.created_at,
        })) || [],
      });
    }

    return NextResponse.json({
      username: user.username,
      totalReferrals,
      verifiedReferrals: verifiedCount,
      points,
      rank: null,
      totalReferrers: 0,
      referrals: referrals?.map(r => ({
        username: r.username,
        verified: verifiedUsers.has(r.id),
        joinedAt: r.created_at,
      })) || [],
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


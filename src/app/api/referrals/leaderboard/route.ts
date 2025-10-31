import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/referrals/leaderboard - Get leaderboard with points calculation
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    // Get all users with their referrals
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id, username, created_at');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard' },
        { status: 500 }
      );
    }

    // Get all referrals (users with referrer_username)
    const { data: referrals, error: referralsError } = await supabase
      .from('users')
      .select('id, username, referrer_username')
      .not('referrer_username', 'is', null);

    if (referralsError) {
      console.error('Error fetching referrals:', referralsError);
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard' },
        { status: 500 }
      );
    }

    // Get all links to check which users are verified (have at least 1 paid link)
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('user_id, status');

    if (linksError) {
      console.error('Error fetching links:', linksError);
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard' },
        { status: 500 }
      );
    }

    // Build user verification map (user has at least 1 paid link)
    const verifiedUsers = new Set<string>();
    links?.forEach(link => {
      if (link.status === 'paid') {
        verifiedUsers.add(link.user_id);
      }
    });

    // Calculate points for each referrer
    const referrerPoints: Record<string, { username: string; totalReferrals: number; verifiedReferrals: number; points: number }> = {};

    referrals?.forEach(referral => {
      if (!referral.referrer_username) return;

      const referrerUsername = referral.referrer_username.toLowerCase();
      
      if (!referrerPoints[referrerUsername]) {
        // Find the referrer's data
        const referrer = allUsers?.find(u => u.username.toLowerCase() === referrerUsername);
        referrerPoints[referrerUsername] = {
          username: referrerUsername,
          totalReferrals: 0,
          verifiedReferrals: 0,
          points: 0,
        };
      }

      referrerPoints[referrerUsername].totalReferrals += 1;

      // Check if referred user is verified (has at least 1 paid link)
      if (verifiedUsers.has(referral.id)) {
        referrerPoints[referrerUsername].verifiedReferrals += 1;
      }
    });

    // Calculate points: 1 point per referral, +2 bonus for verified (active) referrals
    Object.values(referrerPoints).forEach(stats => {
      stats.points = stats.totalReferrals + (stats.verifiedReferrals * 2);
    });

    // Convert to array and sort by points (descending)
    const leaderboard = Object.values(referrerPoints)
      .sort((a, b) => b.points - a.points)
      .slice(0, limit)
      .map((stats, index) => ({
        rank: index + 1,
        username: stats.username,
        totalReferrals: stats.totalReferrals,
        verifiedReferrals: stats.verifiedReferrals,
        points: stats.points,
      }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


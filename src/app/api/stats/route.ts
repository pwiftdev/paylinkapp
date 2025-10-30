import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/stats - Returns aggregated PayLink statistics
export async function GET(_request: NextRequest) {
  try {
    // Total users
    const { count: usersCount, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) {
      console.error('Supabase users count error:', usersError);
      return NextResponse.json({ error: 'Failed to compute users count' }, { status: 500 });
    }

    // Total links
    const { count: linksCount, error: linksError } = await supabase
      .from('links')
      .select('*', { count: 'exact', head: true });

    if (linksError) {
      console.error('Supabase links count error:', linksError);
      return NextResponse.json({ error: 'Failed to compute links count' }, { status: 500 });
    }

    // Sum of requested SOL (sum of amount field)
    const { data: linkAmounts, error: amountsError } = await supabase
      .from('links')
      .select('amount');

    if (amountsError) {
      console.error('Supabase amounts fetch error:', amountsError);
      return NextResponse.json({ error: 'Failed to compute total requested SOL' }, { status: 500 });
    }

    const totalRequestedSol = (linkAmounts || []).reduce((acc: number, row: any) => {
      const val = typeof row.amount === 'number' ? row.amount : parseFloat(row.amount);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

    return NextResponse.json({
      users: usersCount ?? 0,
      links: linksCount ?? 0,
      totalRequestedSol,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



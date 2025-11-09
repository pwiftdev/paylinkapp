import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Query presale purchases directly
    const { data: purchases, error } = await supabase
      .from('presale_purchases')
      .select('token_amount, sol_amount, wallet_address')
      .eq('status', 'confirmed');

    if (error) {
      console.error('Error fetching presale stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch presale stats', details: error.message },
        { status: 500 }
      );
    }

    // Calculate stats from the data
    const totalSold = purchases?.reduce((sum, p) => sum + parseInt(p.token_amount || 0), 0) || 0;
    const totalParticipants = purchases?.length || 0;
    const totalSolRaised = purchases?.reduce((sum, p) => sum + parseFloat(p.sol_amount || 0), 0) || 0;

    console.log('Presale stats:', { totalSold, totalParticipants, totalSolRaised, purchaseCount: purchases?.length });

    return NextResponse.json({
      totalSold,
      totalParticipants,
      totalSolRaised,
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Error in presale stats API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


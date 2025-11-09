import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Check if wallet has already purchased
    const { data, error } = await supabase
      .from('presale_purchases')
      .select('*')
      .eq('wallet_address', wallet)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking wallet:', error);
      return NextResponse.json(
        { error: 'Failed to check wallet' },
        { status: 500 }
      );
    }

    if (data) {
      return NextResponse.json({
        hasPurchased: true,
        purchase: {
          allocationPercentage: parseFloat(data.allocation_percentage),
          tokenAmount: parseInt(data.token_amount),
          status: data.status,
          transactionHash: data.transaction_hash,
          createdAt: data.created_at,
        }
      });
    }

    return NextResponse.json({
      hasPurchased: false,
      purchase: null,
    });
  } catch (error) {
    console.error('Error in presale check API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



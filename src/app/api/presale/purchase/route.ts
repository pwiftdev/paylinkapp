import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, allocationPercentage, tokenAmount, transactionHash, solAmount } = body;

    // Validate required fields
    if (!walletAddress || !allocationPercentage || !tokenAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate allocation percentage (must be 0.25, 0.5, or 1)
    const validAllocations = [0.25, 0.5, 1];
    if (!validAllocations.includes(parseFloat(allocationPercentage))) {
      return NextResponse.json(
        { error: 'Invalid allocation percentage' },
        { status: 400 }
      );
    }

    // Check if wallet already purchased
    const { data: existingPurchase, error: checkError } = await supabase
      .from('presale_purchases')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'Wallet has already purchased tokens' },
        { status: 400 }
      );
    }

    // Insert the purchase
    const { data, error } = await supabase
      .from('presale_purchases')
      .insert({
        wallet_address: walletAddress,
        allocation_percentage: allocationPercentage,
        token_amount: tokenAmount,
        sol_amount: solAmount || null,
        transaction_hash: transactionHash || null,
        status: transactionHash ? 'confirmed' : 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording purchase:', error);
      return NextResponse.json(
        { error: 'Failed to record purchase' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      purchase: {
        id: data.id,
        allocationPercentage: parseFloat(data.allocation_percentage),
        tokenAmount: parseInt(data.token_amount),
        status: data.status,
        transactionHash: data.transaction_hash,
        createdAt: data.created_at,
      }
    });
  } catch (error) {
    console.error('Error in presale purchase API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



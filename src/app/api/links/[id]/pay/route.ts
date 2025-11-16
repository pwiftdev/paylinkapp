import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { transactionHash } = await request.json();
    const { id } = await params;

    if (!transactionHash) {
      return NextResponse.json(
        { error: 'Transaction hash is required' },
        { status: 400 }
      );
    }

    // Determine if it's a UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    // Update the link status to 'paid' and add transaction details
    // Use appropriate field based on whether it's UUID or slug
    const updateQuery = isUUID 
      ? supabase.from('links').update({
          status: 'paid',
          transaction_hash: transactionHash,
          paid_at: new Date().toISOString()
        }).eq('id', id)
      : supabase.from('links').update({
          status: 'paid',
          transaction_hash: transactionHash,
          paid_at: new Date().toISOString()
        }).eq('slug', id.toLowerCase());

    const { data, error } = await updateQuery.select().single();

    if (error) {
      console.error('Error updating link status:', error);
      return NextResponse.json(
        { error: 'Failed to update link status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in pay route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Fetching link with ID/slug:', id);

    // Try to find by slug first (if it's not a UUID format)
    // UUID format: 8-4-4-4-12 hex characters
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    let data, error;
    
    if (isUUID) {
      // Look up by UUID
      const result = await supabase
        .from('links')
        .select('*')
        .eq('id', id)
        .single();
      data = result.data;
      error = result.error;
    } else {
      // Look up by slug
      const result = await supabase
        .from('links')
        .select('*')
        .eq('slug', id.toLowerCase())
        .single();
      data = result.data;
      error = result.error;
      
      // If not found by slug, try UUID as fallback
      if (error && error.code === 'PGRST116') {
        const fallbackResult = await supabase
          .from('links')
          .select('*')
          .eq('id', id)
          .single();
        data = fallbackResult.data;
        error = fallbackResult.error;
      }
    }

    if (error) {
      console.error('Supabase error fetching link:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Link not found', details: error.message },
        { status: 404 }
      );
    }

    if (!data) {
      console.error('No data found for link ID/slug:', id);
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    console.log('Found link data:', data);

    return NextResponse.json({
      id: data.id,
      slug: data.slug,
      username: data.username,
      recipient: data.recipient,
      amount: data.amount,
      message: data.message,
      status: data.status,
      transaction_hash: data.transaction_hash,
      paid_at: data.paid_at,
      created_at: data.created_at,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

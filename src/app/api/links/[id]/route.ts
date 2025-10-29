import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Fetching link with ID:', id);

    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error fetching link:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Link not found', details: error.message },
        { status: 404 }
      );
    }

    if (!data) {
      console.error('No data found for link ID:', id);
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    console.log('Found link data:', data);

    return NextResponse.json({
      id: data.id,
      username: data.username,
      recipient: data.recipient,
      amount: data.amount,
      message: data.message,
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

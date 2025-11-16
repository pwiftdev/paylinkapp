import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// POST /api/links - Create a new pay link
export async function POST(request: NextRequest) {
  try {
    const { userId, username, recipient, amount, message, customSlug } = await request.json();

    // Validation
    if (!userId || !username || !recipient || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate custom slug if provided
    if (customSlug) {
      // Slug validation: alphanumeric, hyphens, underscores only, 3-50 chars
      const slugRegex = /^[a-zA-Z0-9_-]{3,50}$/;
      if (!slugRegex.test(customSlug)) {
        return NextResponse.json(
          { error: 'Custom URL must be 3-50 characters and contain only letters, numbers, hyphens, and underscores' },
          { status: 400 }
        );
      }

      // Check if slug already exists
      const { data: existingLink } = await supabase
        .from('links')
        .select('id')
        .eq('slug', customSlug.toLowerCase())
        .single();

      if (existingLink) {
        return NextResponse.json(
          { error: 'This custom URL is already taken. Please choose another.' },
          { status: 409 }
        );
      }
    }

    const id = uuidv4();

    const { data, error } = await supabase
      .from('links')
      .insert({
        id,
        user_id: userId,
        username,
        recipient,
        amount,
        message: message || null,
        slug: customSlug ? customSlug.toLowerCase() : null,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Handle unique constraint violation for slug
      if (error.code === '23505' && error.message.includes('slug')) {
        return NextResponse.json(
          { error: 'This custom URL is already taken. Please choose another.' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to create link', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id, slug: data.slug });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/links?userId=user_id
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

    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch links' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

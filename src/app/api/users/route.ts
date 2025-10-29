import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// POST /api/users - Create or get user account
export async function POST(request: NextRequest) {
  try {
    const { username, wallet } = await request.json();

    // Validation
    if (!username || !wallet) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate username format (alphanumeric, underscore, 3-20 chars)
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json(
        { error: 'Invalid username format. Use 3-20 alphanumeric characters or underscore' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('wallet', wallet)
      .single();

    if (existingUser) {
      return NextResponse.json({
        id: existingUser.id,
        username: existingUser.username,
        wallet: existingUser.wallet,
        isNew: false,
      });
    }

    // Check if username is taken
    const { data: usernameTaken } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (usernameTaken) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Create new user
    const id = uuidv4();
    const { data, error } = await supabase
      .from('users')
      .insert({
        id,
        username,
        wallet,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: data.id,
      username: data.username,
      wallet: data.wallet,
      isNew: true,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/users?wallet=wallet_address
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet parameter required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet', wallet)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

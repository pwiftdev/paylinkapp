import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch SOL price');
    }

    const data = await response.json();
    const solPrice = data.solana.usd;

    return NextResponse.json(
      { price: solPrice },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SOL price' },
      { status: 500 }
    );
  }
}



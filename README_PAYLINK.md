# PayLink 🧱

A minimal Solana dApp where users can generate payment links by burning native SOL tokens. No accounts, no dashboards—just burn tokens and get your link.

## Features

- 🔥 **Burn to Create**: Burn 0.001 SOL to create a payment link
- 🔗 **Share Instantly**: Send the link to anyone - no account required
- 💰 **Pre-filled Payments**: Recipient and amount are pre-filled for easy payment
- ⚡ **Solana Native**: Built on Solana for fast, low-cost transactions
- 🎨 **Minimal UI**: Clean, modern interface with Tailwind CSS

## Tech Stack

- **Next.js 14** (App Router)
- **Solana Web3.js** & **Wallet Adapter**
- **Supabase** (PostgreSQL database)
- **Tailwind CSS**

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `src/lib/db.sql` in the SQL Editor
3. Get your project URL and anon key from Settings → API

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── links/          # API routes for creating/fetching links
│   ├── components/          # Wallet provider and wallet components
│   ├── create/             # Create PayLink page
│   ├── link/[id]/          # Public payment link page
│   └── page.tsx            # Landing page
├── lib/
│   ├── config.ts           # Configuration constants
│   ├── db.sql              # Database schema
│   └── supabase.ts         # Supabase client
```

## API Routes

### POST /api/links
Create a new payment link

**Body:**
```json
{
  "creator": "wallet_address",
  "recipient": "wallet_address",
  "amount": "1.5",
  "message": "Optional message",
  "burnTx": "transaction_hash"
}
```

### GET /api/links?creator=wallet_address
Get all links created by a wallet

### GET /api/links/[id]
Get a specific link by ID

## Usage

1. **Create a PayLink**:
   - Go to `/create`
   - Connect your wallet
   - Fill in recipient, amount, and optional message
   - Click "Create & Burn" to burn 0.001 SOL
   - Get redirected to your payment link

2. **Pay via Link**:
   - Open the shared payment link
   - Connect your wallet
   - Click "Pay" to send the pre-filled transaction

## Customization

### Change Network
Edit `src/lib/config.ts`:
```typescript
export const SOLANA_NETWORK = 'mainnet-beta'; // or 'devnet'
```

### Change Burn Amount
Edit `src/lib/config.ts`:
```typescript
export const BURN_AMOUNT = 0.001; // Amount in SOL
```

## Notes

- Currently configured for **Solana Devnet**
- Burn transaction sends SOL to a burn wallet address
- No authentication system - wallet address = identity
- All links are public

## Production Deployment

1. Switch to mainnet in `src/lib/config.ts`
2. Update Supabase to production credentials
3. Deploy to Vercel or your preferred platform

## License

MIT

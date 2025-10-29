# PayLink Setup Instructions

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project at https://supabase.com
2. Click on **Settings** (gear icon in the left sidebar)
3. Click on **API** under the Project Settings section
4. You'll see:
   - **Project URL** - Copy this (looks like `https://xxxxx.supabase.co`)
   - **anon public** key - Copy this (long string starting with `eyJ...`)

## Step 2: Create Database Tables

1. In Supabase, click on **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste ALL the SQL from `src/lib/db.sql`
4. Click **Run** or press Cmd+Enter (Mac) / Ctrl+Enter (Windows)

## Step 3: Update Your Environment Variables

1. Open the `.env.local` file in the project root
2. Replace the placeholder values with your actual credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_ACTUAL_URL.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANT**: Replace the entire placeholder text with your actual values!

## Step 4: Restart the Server

The server should auto-reload. If not, restart it:
- Stop the server (Ctrl+C)
- Run `npm run dev` again

## You're Ready! 🎉

Now you can:
1. Go to http://localhost:3001
2. Click "Get Started"
3. Connect your wallet
4. Create your @username account
5. Start creating PayLinks!

## Troubleshooting

**Error: "Invalid supabaseUrl"**
- Make sure you replaced the placeholder values in `.env.local`
- Check that your URL starts with `https://`

**Error: "Table doesn't exist"**
- Run the SQL from `src/lib/db.sql` in Supabase SQL Editor

**Error: "Unexpected token"**
- This means your Supabase URL is still the placeholder value
- Make sure `.env.local` has your real credentials

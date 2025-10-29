import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

// Validate that we have actual credentials (not placeholders)
const url = SUPABASE_URL && !SUPABASE_URL.includes('your_supabase') ? SUPABASE_URL : null;
const key = SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('your_supabase') ? SUPABASE_ANON_KEY : null;

if (!url || !key) {
  console.error('❌ Missing Supabase credentials! Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
} else {
  console.log('✅ Supabase credentials loaded successfully');
}

export const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder-key');

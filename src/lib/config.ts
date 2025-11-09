// TEMPORARY: Hardcoded Supabase credentials for development
// ⚠️ REPLACE WITH ENV VARS BEFORE DEPLOYMENT
export const SUPABASE_URL = 'https://bsnmdvktzbvoaotvnoed.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzbm1kdmt0emJ2b2FvdHZub2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzE0MjEsImV4cCI6MjA3NzE0NzQyMX0.YrkWSB6GpDTxBKk7QyQBUexX0azSQtbzh121deaNkuk';

// Solana network configuration
// Using Tatum RPC for reliable mainnet access
export const SOLANA_NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta') as string;
export const SOLANA_RPC_ENDPOINT = (process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://solana-mainnet.gateway.tatum.io') as string;

// Feature flags
// Set to true to lock the app before TGE, false to unlock after TGE
export const LOCKED_BEFORE_TGE = true;

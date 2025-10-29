// TEMPORARY: Hardcoded Supabase credentials for development
// ⚠️ REPLACE WITH ENV VARS BEFORE DEPLOYMENT
export const SUPABASE_URL = 'https://bsnmdvktzbvoaotvnoed.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzbm1kdmt0emJ2b2FvdHZub2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzE0MjEsImV4cCI6MjA3NzE0NzQyMX0.YrkWSB6GpDTxBKk7QyQBUexX0azSQtbzh121deaNkuk';

// Solana network configuration
export const SOLANA_NETWORK = 'mainnet-beta'; // Production mainnet

// Optional: override RPC via env for paid providers (QuickNode/Helius/Triton, etc.)
export const SOLANA_RPC = (process.env.NEXT_PUBLIC_SOLANA_RPC || '').trim();

// RPC endpoints for better reliability
export const RPC_ENDPOINTS = {
  'mainnet-beta': [
    'https://api.mainnet-beta.solana.com', // Official Solana RPC ONLY
  ],
  'devnet': [
    'https://api.devnet.solana.com',
  ],
  'testnet': [
    'https://api.testnet.solana.com',
  ],
};

// Resolve the preferred RPC for a given network
export function getPreferredRpc(network: keyof typeof RPC_ENDPOINTS): string {
  // If an env override is present, prefer it (ensures dedicated paid endpoints work)
  if (SOLANA_RPC) return SOLANA_RPC;
  const endpoints = RPC_ENDPOINTS[network];
  // Pick the first endpoint in the list as default
  return endpoints[0];
}

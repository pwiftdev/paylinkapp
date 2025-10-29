'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
// BURN_AMOUNT removed - no longer needed

interface BurnButtonProps {
  onSuccess: (txHash: string) => void;
  disabled?: boolean;
}

export default function BurnButton({ onSuccess, disabled }: BurnButtonProps) {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBurn = async () => {
    if (!publicKey || !signTransaction) {
      setError('Wallet not connected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a burn transaction
      // Using a burn wallet address that effectively destroys SOL
      const { PublicKey } = await import('@solana/web3.js');
      const burnWallet = new PublicKey('11111111111111111111111111111112'); // System Program burn address
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: burnWallet,
          lamports: 0.001 * LAMPORTS_PER_SOL, // 0.001 SOL burn amount
        })
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign the transaction
      const signedTransaction = await signTransaction(transaction);

      // Send the transaction
      const txHash = await connection.sendRawTransaction(signedTransaction.serialize());

      // Wait for confirmation
      await connection.confirmTransaction(txHash, 'confirmed');

      onSuccess(txHash);
    } catch (err) {
      console.error('Burn error:', err);
      setError(err instanceof Error ? err.message : 'Failed to burn tokens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleBurn}
        disabled={loading || disabled || !publicKey}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Burning...' : 'Create & Burn'}
      </button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

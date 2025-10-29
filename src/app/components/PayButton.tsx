'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import { FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface PayButtonProps {
  recipient: string;
  amount: string;
}

export default function PayButton({ recipient, amount }: PayButtonProps) {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handlePay = async () => {
    if (!publicKey || !signTransaction) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Parse the amount (stored as string)
      const amountInSol = parseFloat(amount);
      const lamports = amountInSol * LAMPORTS_PER_SOL;

      // Create transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipient),
          lamports,
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

      setTxHash(txHash);
      setSuccess(true);
    } catch (err) {
      console.error('Payment error:', err);
      
      // Check for specific error types and provide helpful messages
      if (err instanceof Error) {
        if (err.message.includes('Attempt to debit an account but found no record of a prior credit')) {
          setError('Insufficient SOL balance. Please add SOL to your wallet and try again.');
        } else if (err.message.includes('Transaction simulation failed')) {
          setError('Transaction failed. Please check your wallet balance and try again.');
        } else if (err.message.includes('User rejected')) {
          setError('Payment was cancelled. Please try again if you want to proceed.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to send payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {success ? (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-600 text-3xl" />
          </div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h3>
          <p className="text-green-700 mb-4">Your payment of {amount} SOL has been sent successfully.</p>
          {txHash && (
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <p className="text-xs text-gray-500 mb-1">Transaction Hash:</p>
              <p className="text-sm font-mono text-gray-900 break-all">{txHash}</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <button
            onClick={handlePay}
            disabled={loading || !publicKey}
            className="w-full px-8 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-2xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-2xl" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <FaCheckCircle className="text-2xl" />
                <span>Pay {amount} SOL</span>
              </>
            )}
          </button>
          
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <FaExclamationTriangle className="text-red-600 text-lg" />
                </div>
                <div>
                  <p className="text-red-800 font-medium">Payment Failed</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Instructions */}
          {!loading && !error && publicKey && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Click the button above to send your payment
              </p>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">Need test SOL?</p>
                <p className="text-xs text-blue-600">
                  Visit <a href="https://faucet.solana.com/" target="_blank" rel="noopener noreferrer" className="underline">faucet.solana.com</a> to get free test SOL for development
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

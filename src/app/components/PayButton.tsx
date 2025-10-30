'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface PayButtonProps {
  recipient: string;
  amount: string;
  linkId?: string;
}

export default function PayButton({ recipient, amount, linkId }: PayButtonProps) {
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

      // Get recent blockhash (required before signing) with retry logic
      let blockhash;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          const result = await connection.getLatestBlockhash();
          blockhash = result.blockhash;
          break;
        } catch (rpcError) {
          retryCount++;
          console.error(`RPC Error getting blockhash (attempt ${retryCount}):`, rpcError);
          
          if (retryCount >= maxRetries) {
            throw new Error('Unable to connect to Solana network. Please try again or check your internet connection.');
          }
          
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
      
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Let the wallet handle signing (this will trigger the wallet popup)
      const signedTransaction = await signTransaction(transaction);

      // Send the transaction
      const txHash = await connection.sendRawTransaction(signedTransaction.serialize());

      // Add a 2-second delay to show processing state before success
      // This gives users a better sense that the transaction is being processed
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update link status to 'paid' if linkId is provided
      if (linkId) {
        try {
          await fetch(`/api/links/${linkId}/pay`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transactionHash: txHash,
            }),
          });
        } catch (updateError) {
          console.warn('Failed to update link status:', updateError);
          // Don't fail the payment if status update fails
        }
      }

      // Transaction is sent successfully - show success after delay
      setTxHash(txHash);
      setSuccess(true);
    } catch (err) {
      console.error('Payment error:', err);
      
      // Check for specific error types and provide helpful messages
      if (err instanceof Error) {
        if (err.message.includes('User rejected') || err.message.includes('User declined')) {
          setError('Payment was cancelled. Please try again if you want to proceed.');
        } else if (err.message.includes('Insufficient funds') || err.message.includes('insufficient')) {
          setError('Insufficient SOL balance. Please add SOL to your wallet and try again.');
        } else if (err.message.includes('Transaction simulation failed')) {
          setError('Transaction failed. Please check your wallet balance and try again.');
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
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-2 border-emerald-200 rounded-3xl p-8 text-center shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-200 rounded-full opacity-15 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-green-200 rounded-full opacity-10 animate-pulse delay-500"></div>
          </div>
          
          {/* Success icon with animation */}
          <div className="relative z-10 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
              <FaCheckCircle className="text-white text-4xl animate-pulse" />
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mx-auto animate-pulse"></div>
          </div>
          
          {/* Success content */}
          <div className="relative z-10">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent mb-3">
              Payment Successful! 🎉
            </h3>
            <p className="text-lg text-emerald-700 mb-6 font-medium">
              Your payment of <span className="font-bold text-emerald-800">{amount} SOL</span> has been sent successfully!
            </p>
            
            {txHash && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200 shadow-lg">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping mr-2"></div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Transaction Hash</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
                  <p className="text-sm font-mono text-gray-800 break-all leading-relaxed">{txHash}</p>
                </div>
                <a 
                  href={`https://explorer.solana.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on Solana Explorer
                </a>
              </div>
            )}
          </div>
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
                <span>Confirming Transaction...</span>
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
            </div>
          )}
        </>
      )}
    </div>
  );
}

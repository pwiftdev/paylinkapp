'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ConnectWallet from '../../components/ConnectWallet';
import PayButton from '../../components/PayButton';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { FaSpinner, FaExclamationTriangle, FaUser, FaWallet, FaDollarSign, FaComment, FaCalendarAlt, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';

interface LinkData {
  id: string;
  username: string;
  recipient: string;
  amount: string;
  message: string | null;
  status: 'pending' | 'paid' | 'cancelled';
  transaction_hash: string | null;
  paid_at: string | null;
  created_at: string;
}

export default function LinkPage() {
  const params = useParams();
  const { publicKey } = useWallet();
  const [link, setLink] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        console.log('Fetching link with ID:', params.id);
        const response = await fetch(`/api/links/${params.id}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error response:', errorData);
          throw new Error(errorData.error || 'Link not found');
        }
        
        const data = await response.json();
        console.log('Link data received:', data);
        setLink(data);
      } catch (err) {
        console.error('Fetch link error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load link');
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="inline-block animate-spin text-4xl text-purple-600 mb-4" />
          <p className="text-gray-600 font-medium text-lg">Loading PayLink...</p>
        </div>
      </main>
    );
  }

  if (error || !link) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-2xl text-red-600" />
            </div>
            <h1 className="text-2xl font-light text-gray-900 mb-3">Link Not Found</h1>
            <p className="text-gray-600 text-lg">{error || 'This PayLink does not exist'}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Hero Section Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-purple-600">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-transparent to-purple-900/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.2),transparent_50%)] animate-pulse"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Content with backdrop blur */}
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Image
              src="/paylinklogo.png"
              alt="PayLink Logo"
              width={80}
              height={80}
              className="mx-auto mb-6"
            />
            <h1 className="text-4xl font-light text-white mb-4">Payment Request</h1>
            <div className="flex items-center justify-center gap-2 text-gray-300 text-lg">
              <span>Requested by</span>
              <span className="font-medium bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">@{link.username}</span>
            </div>
          </div>

          {/* Main Payment Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-8 shadow-xl">
            {/* Amount Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl mb-6 backdrop-blur-sm">
                <FaDollarSign className="text-3xl text-purple-300" />
              </div>
              <p className="text-sm font-medium text-gray-300 mb-3 uppercase tracking-wide">Amount to Pay</p>
              <p className="text-5xl font-light text-white mb-2">
                {link.amount} SOL
              </p>
              <p className="text-sm text-gray-300">Solana</p>
            </div>

            {/* Payment Details */}
            <div className="space-y-6 mb-10">
              {/* Recipient */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mr-4">
                    <FaWallet className="text-blue-300 text-lg" />
                  </div>
                  <p className="text-sm font-medium text-gray-300">Send to</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-sm font-mono text-white break-all">{link.recipient}</p>
                </div>
              </div>

              {/* Message */}
              {link.message && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mr-4">
                      <FaComment className="text-purple-300 text-lg" />
                    </div>
                    <p className="text-sm font-medium text-gray-300">Payment Memo</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="text-white">{link.message}</p>
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center justify-center text-sm text-gray-400 bg-white/10 backdrop-blur-sm rounded-xl py-4 border border-white/20">
                <FaCalendarAlt className="mr-3 text-sm" />
                Created {new Date(link.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            {/* Payment Status */}
            {link.status === 'paid' ? (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-8 text-center backdrop-blur-sm">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaCheckCircle className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-green-300 mb-3">Payment Completed! 🎉</h3>
                <p className="text-green-200 mb-6 text-lg">
                  This payment request has already been fulfilled
                </p>

                {/* Payment Details */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30 shadow-lg">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping mr-2"></div>
                    <p className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Payment Details</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Amount Paid:</span>
                      <span className="font-semibold text-white">{link.amount} SOL</span>
                    </div>

                    {link.paid_at && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Paid on:</span>
                        <span className="font-semibold text-white">
                          {new Date(link.paid_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}

                    {link.transaction_hash && (
                      <div className="pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-300">Transaction:</span>
                          <a
                            href={`https://explorer.solana.com/tx/${link.transaction_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-blue-200 flex items-center gap-1"
                          >
                            <span className="font-mono text-xs">
                              {link.transaction_hash.slice(0, 8)}...{link.transaction_hash.slice(-8)}
                            </span>
                            <FaExternalLinkAlt className="text-xs" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Wallet Connection */}
                <div className="mb-8">
                  <ConnectWallet />
                </div>

                {/* Payment Button */}
                {!publicKey ? (
                  <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 rounded-xl p-6 text-center backdrop-blur-sm">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <FaWallet className="text-amber-300 text-2xl" />
                    </div>
                    <p className="text-amber-200 font-medium text-lg">
                      Connect your Solana wallet to send the payment
                    </p>
                  </div>
                ) : (
                  <PayButton recipient={link.recipient} amount={link.amount} linkId={link.id} />
                )}
              </>
            )}
          </div>

          {/* Security & Trust Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-8 shadow-xl">
            <div className="text-center">
              <h3 className="text-lg font-light text-white mb-6">Secure & Trustless</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="font-medium">Blockchain Verified</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="font-medium">No Middleman</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="font-medium">Instant Transfer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Image
                src="/paylinklogo.png"
                alt="PayLink Logo"
                width={28}
                height={28}
              />
              <span className="text-sm font-medium text-white">PayLink</span>
            </div>
            <p className="text-sm text-gray-300">
              Powered by Solana • Fast • Secure • Decentralized
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ConnectWallet from '../../components/ConnectWallet';
import PayButton from '../../components/PayButton';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { FaSpinner, FaExclamationTriangle, FaUser, FaWallet, FaDollarSign, FaComment, FaCalendarAlt } from 'react-icons/fa';

interface LinkData {
  id: string;
  username: string;
  recipient: string;
  amount: string;
  message: string | null;
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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="inline-block animate-spin text-4xl text-purple-600 mb-4" />
          <p className="text-gray-600">Loading PayLink...</p>
        </div>
      </main>
    );
  }

  if (error || !link) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <FaExclamationTriangle className="text-4xl text-red-500 mb-4 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h1>
            <p className="text-gray-600">{error || 'This PayLink does not exist'}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(147,51,234,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6">
              <Image
                src="/paylinklogo.png"
                alt="PayLink Logo"
                width={64}
                height={64}
                className="mx-auto"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Payment Request</h1>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <span>Requested by</span>
              <span className="font-semibold text-purple-600">@{link.username}</span>
            </div>
          </div>

          {/* Main Payment Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
            {/* Amount Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6 shadow-lg">
                <FaDollarSign className="text-4xl text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Amount to Pay</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {link.amount} SOL
              </p>
              <p className="text-sm text-gray-400">Solana</p>
            </div>

            {/* Payment Details */}
            <div className="space-y-6 mb-10">
              {/* Recipient */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <FaWallet className="text-blue-600 text-sm" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Send to</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-sm font-mono text-gray-900 break-all">{link.recipient}</p>
                </div>
              </div>

              {/* Message */}
              {link.message && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <FaComment className="text-purple-600 text-sm" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Payment Memo</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <p className="text-gray-900">{link.message}</p>
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center justify-center text-xs text-gray-400 bg-gray-50 rounded-lg py-3">
                <FaCalendarAlt className="mr-2" />
                Created {new Date(link.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            {/* Wallet Connection */}
            <div className="mb-8">
              <ConnectWallet />
            </div>

            {/* Payment Button */}
            {!publicKey ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaWallet className="text-yellow-600 text-xl" />
                </div>
                <p className="text-yellow-800 font-medium">
                  Connect your Solana wallet to send the payment
                </p>
              </div>
            ) : (
              <PayButton recipient={link.recipient} amount={link.amount} />
            )}
          </div>

          {/* Security & Trust Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Secure & Trustless</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Blockchain Verified</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>No Middleman</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Instant Transfer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Image
                src="/paylinklogo.png"
                alt="PayLink Logo"
                width={24}
                height={24}
              />
              <span className="text-sm font-semibold text-gray-700">PayLink</span>
            </div>
            <p className="text-xs text-gray-500">
              Powered by Solana • Fast • Secure • Decentralized
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

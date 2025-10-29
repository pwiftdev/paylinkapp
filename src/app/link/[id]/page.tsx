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
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100">
      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-6 bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
              <Image
                src="/paylinklogo.png"
                alt="PayLink Logo"
                width={80}
                height={80}
                className="mx-auto"
              />
            </div>
            <h1 className="text-4xl font-light text-gray-900 mb-4">Payment Request</h1>
            <div className="flex items-center justify-center gap-2 text-gray-600 text-lg">
              <span>Requested by</span>
              <span className="font-medium bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">@{link.username}</span>
            </div>
          </div>

          {/* Main Payment Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
            {/* Amount Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mb-6">
                <FaDollarSign className="text-3xl text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Amount to Pay</p>
              <p className="text-5xl font-light text-gray-900 mb-2">
                {link.amount} SOL
              </p>
              <p className="text-sm text-gray-500">Solana</p>
            </div>

            {/* Payment Details */}
            <div className="space-y-6 mb-10">
              {/* Recipient */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-4">
                    <FaWallet className="text-blue-600 text-lg" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Send to</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-mono text-gray-900 break-all">{link.recipient}</p>
                </div>
              </div>

              {/* Message */}
              {link.message && (
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mr-4">
                      <FaComment className="text-purple-600 text-lg" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Payment Memo</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <p className="text-gray-900">{link.message}</p>
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50 rounded-xl py-4">
                <FaCalendarAlt className="mr-3 text-sm" />
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
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaWallet className="text-amber-600 text-2xl" />
                </div>
                <p className="text-amber-800 font-medium text-lg">
                  Connect your Solana wallet to send the payment
                </p>
              </div>
            ) : (
              <PayButton recipient={link.recipient} amount={link.amount} />
            )}
          </div>

          {/* Security & Trust Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
            <div className="text-center">
              <h3 className="text-lg font-light text-gray-900 mb-6">Secure & Trustless</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Blockchain Verified</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">No Middleman</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
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
              <span className="text-sm font-medium text-gray-700">PayLink</span>
            </div>
            <p className="text-sm text-gray-500">
              Powered by Solana • Fast • Secure • Decentralized
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

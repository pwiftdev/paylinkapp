'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaUser, FaWallet, FaDollarSign, FaComment, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface UserData {
  id: string;
  username: string;
  wallet: string;
}

export default function CreateLinkPage() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [user, setUser] = useState<UserData | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!publicKey) {
        setUserLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users?wallet=${publicKey.toString()}`);
        if (!response.ok) {
          router.push('/register');
          return;
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/register');
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [publicKey, router]);

  const handleCreateLink = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          username: user.username,
          recipient,
          amount,
          message: message || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create link');
      }

      const { id } = await response.json();
      router.push(`/link/${id}`);
    } catch (err) {
      console.error('Create link error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const isValidRecipient = recipient.length > 0 && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(recipient);
  const isValidAmount = amount.length > 0 && parseFloat(amount) > 0;

  if (userLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="inline-block animate-spin text-4xl text-purple-600 mb-4" />
          <p className="text-gray-600 font-medium text-lg">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-8 transition-colors">
            <FaArrowLeft className="mr-2 text-sm" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <div className="text-center">
            <Image
              src="/paylinklogo.png"
              alt="PayLink Logo"
              width={80}
              height={80}
              className="mx-auto mb-6"
            />
            <h1 className="text-4xl font-light text-gray-900 mb-3">Create PayLink</h1>
            <p className="text-gray-600 text-lg">Generate a payment request link</p>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          {!user ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaExclamationTriangle className="text-2xl text-amber-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Account Required</h3>
              <p className="text-gray-600 mb-8 text-lg">
                You need to create an account first to create PayLinks
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <FaUser className="text-lg" />
                Create Account
              </Link>
            </div>
          ) : (
            <>
              {/* User Info */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mr-4">
                    <FaUser className="text-xl text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-900">Creating as</p>
                    <p className="text-xl font-medium text-purple-800">@{user.username}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Recipient Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                        <FaWallet className="text-purple-600 text-sm" />
                      </div>
                      <span>Destination Wallet Address</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter recipient's Solana wallet address"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg font-mono placeholder-gray-400 text-gray-900 transition-all"
                  />
                  {recipient && !isValidRecipient && (
                    <p className="mt-3 text-sm text-red-600 flex items-center">
                      <FaExclamationTriangle className="mr-2 text-sm" />
                      Invalid Solana address
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <FaDollarSign className="text-green-600 text-sm" />
                      </div>
                      <span>Amount (SOL)</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    step="0.000000001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg placeholder-gray-400 text-gray-900 transition-all"
                  />
                  {amount && !isValidAmount && (
                    <p className="mt-3 text-sm text-red-600 flex items-center">
                      <FaExclamationTriangle className="mr-2 text-sm" />
                      Amount must be greater than 0
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <FaComment className="text-blue-600 text-sm" />
                      </div>
                      <span>Payment Memo (Optional)</span>
                    </div>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a note about this payment..."
                    rows={4}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none placeholder-gray-400 text-gray-900 transition-all"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <FaExclamationTriangle className="text-red-600 mr-3 text-sm" />
                      <p className="text-red-800 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleCreateLink}
                  disabled={!isValidRecipient || !isValidAmount || loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin text-lg" />
                      Creating Link...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="text-lg" />
                      Create PayLink
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="inline-block animate-spin text-4xl text-purple-600 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <div className="text-center">
            <Image
              src="/paylinklogo.png"
              alt="PayLink Logo"
              width={64}
              height={64}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create PayLink</h1>
            <p className="text-gray-600">Generate a payment request link</p>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {!user ? (
            <div className="text-center py-8">
              <FaExclamationTriangle className="text-4xl text-yellow-500 mb-4 mx-auto" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Account Required</h3>
              <p className="text-gray-600 mb-6">
                You need to create an account first to create PayLinks
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <FaUser />
                Create Account
              </Link>
            </div>
          ) : (
            <>
              {/* User Info */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
                <div className="flex items-center">
                  <FaUser className="text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Creating as</p>
                    <p className="text-lg font-semibold text-purple-800">@{user.username}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Recipient Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <FaWallet className="inline mr-2" />
                    Destination Wallet Address
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter recipient's Solana wallet address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-mono placeholder-gray-500 text-gray-900"
                  />
                  {recipient && !isValidRecipient && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      Invalid Solana address
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <FaDollarSign className="inline mr-2" />
                    Amount (SOL)
                  </label>
                  <input
                    type="number"
                    step="0.000000001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg placeholder-gray-500 text-gray-900"
                  />
                  {amount && !isValidAmount && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      Amount must be greater than 0
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <FaComment className="inline mr-2" />
                    Payment Memo (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a note about this payment..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none placeholder-gray-500 text-gray-900"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <FaExclamationTriangle className="text-red-600 mr-2" />
                      <p className="text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleCreateLink}
                  disabled={!isValidRecipient || !isValidAmount || loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Creating Link...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
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

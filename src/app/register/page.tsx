'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import Image from 'next/image';
import { FaWallet, FaUser, FaArrowLeft, FaCheckCircle, FaSpinner } from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  useEffect(() => {
    const checkExistingUser = async () => {
      if (!publicKey) {
        setCheckingExisting(false);
        return;
      }

      try {
        const response = await fetch(`/api/users?wallet=${publicKey.toString()}`);
        if (response.ok) {
          // User already exists, redirect to dashboard
          router.push('/dashboard');
        } else {
          // User doesn't exist, show registration form
          setCheckingExisting(false);
        }
      } catch (error) {
        console.error('Failed to check existing user:', error);
        setCheckingExisting(false);
      }
    };

    checkExistingUser();
  }, [publicKey, router]);

  const handleCreateAccount = async () => {
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          wallet: publicKey.toString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create account');
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Create account error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const isValidUsername = username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);

  if (checkingExisting) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="inline-block animate-spin text-4xl text-purple-600 mb-4" />
          <p className="text-gray-600">Checking wallet...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <Image
            src="/paylinklogo.png"
            alt="PayLink Logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {publicKey ? 'Create Your Account' : 'Welcome to PayLink'}
          </h1>
          <p className="text-gray-600">
            {publicKey ? 'Choose your @username to get started' : 'Connect your Solana wallet to continue'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Wallet Connection */}
          <div className="mb-8">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FaWallet className="text-2xl text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Wallet Status</p>
                  <p className="text-sm text-gray-500">
                    {publicKey ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVisible(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
              >
                {publicKey ? 'Change' : 'Connect'}
              </button>
            </div>
            
            {publicKey && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
              </p>
            )}
          </div>

          {/* Username Form */}
          {publicKey && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <FaUser className="inline mr-2" />
                  Choose Your @Username
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2 text-lg">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    placeholder="yourusername"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg placeholder-gray-500 text-gray-900"
                    maxLength={20}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  3-20 characters, letters, numbers, and underscores only
                </p>
                {username && !isValidUsername && (
                  <p className="mt-1 text-sm text-red-600">Invalid username format</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleCreateAccount}
                disabled={!isValidUsername || loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Create Account
                  </>
                )}
              </button>
            </div>
          )}

          {!publicKey && (
            <div className="text-center py-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">
                  Please connect your Solana wallet above to create your PayLink account
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our terms of service
          </p>
        </div>
      </div>
    </main>
  );
}

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
      <main className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="inline-block animate-spin text-4xl text-purple-600 mb-4" />
          <p className="text-gray-600 font-medium text-lg">Checking wallet...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-8 transition-colors">
            <FaArrowLeft className="mr-2 text-sm" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <Image
            src="/paylinklogo.png"
            alt="PayLink Logo"
            width={80}
            height={80}
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl font-light text-gray-900 mb-3">
            {publicKey ? 'Create Your Account' : 'Welcome to PayLink'}
          </h1>
          <p className="text-gray-600 text-lg">
            {publicKey ? 'Choose your @username to get started' : 'Connect your Solana wallet to continue'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          {/* Wallet Connection */}
          <div className="mb-8">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mr-4">
                  <FaWallet className="text-xl text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Wallet Status</p>
                  <p className="text-sm text-gray-600">
                    {publicKey ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVisible(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium text-sm shadow-sm hover:shadow-md"
              >
                {publicKey ? 'Change' : 'Connect'}
              </button>
            </div>
            
            {publicKey && (
              <p className="text-xs text-gray-500 mt-3 text-center font-mono">
                {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
              </p>
            )}
          </div>

          {/* Username Form */}
          {publicKey && (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                      <FaUser className="text-purple-600 text-sm" />
                    </div>
                    <span>Choose Your @Username</span>
                  </div>
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-3 text-xl font-medium">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    placeholder="yourusername"
                    className="flex-1 px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg placeholder-gray-400 text-gray-900 transition-all"
                    maxLength={20}
                  />
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  3-20 characters, letters, numbers, and underscores only
                </p>
                {username && !isValidUsername && (
                  <p className="mt-2 text-sm text-red-600">Invalid username format</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-800 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={handleCreateAccount}
                disabled={!isValidUsername || loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-lg" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="text-lg" />
                    Create Account
                  </>
                )}
              </button>
            </div>
          )}

          {!publicKey && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaWallet className="text-2xl text-amber-600" />
                </div>
                <p className="text-amber-800 font-medium">
                  Please connect your Solana wallet above to create your PayLink account
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our terms of service
          </p>
        </div>
      </div>
    </main>
  );
}

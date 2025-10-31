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
  const [referrerUsername, setReferrerUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  useEffect(() => {
    // Check for referrer in URL
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    if (refParam) {
      setReferrerUsername(refParam.toLowerCase());
    }

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
          referrer_username: referrerUsername.trim() || null,
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
      <main className="min-h-screen relative overflow-hidden flex items-center justify-center">
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
        
        <div className="relative z-10 text-center">
          <FaSpinner className="inline-block animate-spin text-4xl text-purple-300 mb-4" />
          <p className="text-gray-300 font-medium text-lg">Checking wallet...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden py-12 px-4">
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
      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors">
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
          <h1 className="text-4xl font-light text-white mb-3">
            {publicKey ? 'Create Your Account' : 'Welcome to PayLink'}
          </h1>
          <p className="text-gray-300 text-lg">
            {publicKey ? 'Choose your @username to get started' : 'Connect your Solana wallet to continue'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-xl">
          {/* Wallet Connection */}
          <div className="mb-8">
            <div className="flex items-center justify-between p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mr-4">
                  <FaWallet className="text-xl text-purple-300" />
                </div>
                <div>
                  <p className="font-medium text-white">Wallet Status</p>
                  <p className="text-sm text-gray-300">
                    {publicKey ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVisible(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500/80 to-purple-600/80 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all font-medium text-sm shadow-sm hover:shadow-md backdrop-blur-sm"
              >
                {publicKey ? 'Change' : 'Connect'}
              </button>
            </div>
            
            {publicKey && (
              <p className="text-xs text-gray-400 mt-3 text-center font-mono">
                {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
              </p>
            )}
          </div>

          {/* Username Form */}
          {publicKey && (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                      <FaUser className="text-purple-300 text-sm" />
                    </div>
                    <span>Choose Your @Username</span>
                  </div>
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-3 text-xl font-medium">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    placeholder="yourusername"
                    className="flex-1 px-4 py-4 border border-white/30 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-lg placeholder-gray-400 text-white bg-white/10 backdrop-blur-sm transition-all"
                    maxLength={20}
                  />
                </div>
                <p className="mt-3 text-sm text-gray-400">
                  3-20 characters, letters, numbers, and underscores only
                </p>
                {username && !isValidUsername && (
                  <p className="mt-2 text-sm text-red-300">Invalid username format</p>
                )}
              </div>

              {/* Referrer Username Field */}
              {publicKey && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                        <FaUser className="text-blue-300 text-sm" />
                      </div>
                      <span>Referred By (Optional)</span>
                    </div>
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-3 text-xl font-medium">@</span>
                    <input
                      type="text"
                      value={referrerUsername}
                      onChange={(e) => setReferrerUsername(e.target.value.toLowerCase())}
                      placeholder="username"
                      className="flex-1 px-4 py-4 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg placeholder-gray-400 text-white bg-white/10 backdrop-blur-sm transition-all"
                      maxLength={20}
                    />
                  </div>
                  <p className="mt-3 text-sm text-gray-400">
                    Enter the username of the person who referred you
                  </p>
                  {referrerUsername && referrerUsername.toLowerCase() === username.toLowerCase() && (
                    <p className="mt-2 text-sm text-red-300">You cannot refer yourself</p>
                  )}
                </div>
              )}

              {error && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-red-200 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={handleCreateAccount}
                disabled={!isValidUsername || loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500/80 to-purple-600/80 text-white rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl backdrop-blur-sm"
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
              <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 rounded-xl p-8 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <FaWallet className="text-2xl text-amber-300" />
                </div>
                <p className="text-amber-200 font-medium">
                  Please connect your Solana wallet above to create your PayLink account
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-400">
            By creating an account, you agree to our terms of service
          </p>
        </div>
      </div>
    </main>
  );
}

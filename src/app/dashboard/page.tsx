'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaLink, FaSignOutAlt, FaSpinner, FaCopy, FaExternalLinkAlt, FaCalendarAlt, FaWallet, FaChartLine, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

interface UserData {
  id: string;
  username: string;
  wallet: string;
}

interface LinkData {
  id: string;
  username: string;
  recipient: string;
  amount: string;
  message: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { publicKey, disconnect } = useWallet();
  const [user, setUser] = useState<UserData | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!publicKey) {
        setLoading(false);
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

        const linksResponse = await fetch(`/api/links?userId=${data.id}`);
        if (linksResponse.ok) {
          const linksData = await linksResponse.json();
          setLinks(linksData);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [publicKey, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <FaSpinner className="inline-block animate-spin text-5xl text-purple-600 mb-4" />
            <div className="absolute inset-0 animate-ping opacity-20">
              <FaSpinner className="text-5xl text-purple-600 mb-4" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  if (!user || !publicKey) {
    return null;
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const totalAmount = links.reduce((sum, link) => sum + parseFloat(link.amount), 0);
  const completedPayments = links.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 pb-12">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <Image
                    src="/paylinklogo.png"
                    alt="PayLink Logo"
                    width={64}
                    height={64}
                    className="relative rounded-2xl hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Welcome back, @{user.username}!
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <FaWallet className="text-gray-400 text-sm" />
                    <p className="text-gray-500 text-sm font-mono">
                      {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                    </p>
                    <button
                      onClick={() => copyToClipboard(publicKey.toString())}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Copy address"
                    >
                      <FaCopy className="text-gray-400 hover:text-purple-600 text-xs" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  disconnect();
                  router.push('/register');
                }}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 font-medium group"
              >
                <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-delay">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 rounded-2xl p-3 group-hover:rotate-12 transition-transform">
                <FaLink className="text-2xl" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{completedPayments}</h3>
            <p className="text-purple-100">Active PayLinks</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 rounded-2xl p-3 group-hover:rotate-12 transition-transform">
                <FaChartLine className="text-2xl" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{totalAmount.toFixed(2)}</h3>
            <p className="text-blue-100">Total Requested (SOL)</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 rounded-2xl p-3 group-hover:rotate-12 transition-transform">
                <FaCheckCircle className="text-2xl" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{completedPayments}</h3>
            <p className="text-green-100">Completed</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 animate-fade-in-delay-2">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-4">Create a New PayLink</h2>
              <p className="text-white/90 mb-6 max-w-2xl">
                Generate a payment link with recipient, amount, and memo. Share it with anyone to receive SOL payments instantly.
              </p>
              <Link
                href="/create-link"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-all font-semibold shadow-lg hover:scale-105 group"
              >
                <FaPlus className="group-hover:rotate-90 transition-transform" />
                Create New PayLink
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="animate-fade-in-delay-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your PayLinks</h2>
                <p className="text-gray-500 mt-1">Manage and track all your payment requests</p>
              </div>
              <div className="px-4 py-2 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-purple-600 font-semibold">{links.length} total</span>
              </div>
            </div>
            
            {links.length === 0 ? (
              <div className="text-center py-16">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-8">
                    <FaLink className="text-6xl text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No PayLinks yet</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Create your first payment link to start receiving SOL payments instantly
                </p>
                <Link
                  href="/create-link"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:scale-105 group"
                >
                  <FaPlus className="group-hover:rotate-90 transition-transform" />
                  Create Your First Link
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {links.map((link, index) => (
                  <div
                    key={link.id}
                    className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-purple-300 transition-all duration-300 hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {link.amount} SOL
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <span className="font-medium">To:</span>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {link.recipient.slice(0, 8)}...{link.recipient.slice(-8)}
                          </span>
                        </div>
                        {link.message && (
                          <p className="text-sm text-gray-600 mb-3 bg-purple-50 px-3 py-2 rounded-lg border border-purple-100">
                            {link.message}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <FaCalendarAlt />
                          {new Date(link.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/link/${link.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all font-medium group"
                        title="Copy link"
                      >
                        {copied === `${window.location.origin}/link/${link.id}` ? (
                          <>
                            <FaCheckCircle className="text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <FaCopy className="group-hover:scale-110 transition-transform" />
                            Copy Link
                          </>
                        )}
                      </button>
                      <Link
                        href={`/link/${link.id}`}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-md hover:scale-105 group"
                      >
                        <span>View</span>
                        <FaExternalLinkAlt className="text-xs group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.1s both;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.2s both;
        }
        .animate-fade-in-delay-3 {
          animation: fade-in 0.6s ease-out 0.3s both;
        }
      `}</style>
    </main>
  );
}

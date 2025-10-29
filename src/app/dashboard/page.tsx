'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaLink, FaSignOutAlt, FaSpinner, FaCopy, FaExternalLinkAlt, FaCalendarAlt, FaWallet, FaChartLine, FaCheckCircle, FaArrowRight, FaEllipsisV } from 'react-icons/fa';

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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <FaSpinner className="inline-block animate-spin text-4xl text-gray-400 mb-4" />
          </div>
          <p className="text-gray-500 font-medium text-lg">Loading your dashboard...</p>
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
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-2">
                Welcome back, <span className="font-medium bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">@{user.username}</span>
              </h1>
              <div className="flex items-center gap-3 text-gray-500">
                <div className="flex items-center gap-2">
                  <FaWallet className="text-sm" />
                  <span className="font-mono text-sm">
                    {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(publicKey.toString())}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy address"
                >
                  <FaCopy className="text-xs" />
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                disconnect();
                router.push('/register');
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <FaSignOutAlt className="text-sm" />
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-purple-200 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-200">
                <FaLink className="text-purple-600 text-lg" />
              </div>
            </div>
            <div className="text-3xl font-light text-gray-900 mb-1">{completedPayments}</div>
            <div className="text-gray-500 text-sm font-medium">Active PayLinks</div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-200 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-200">
                <FaChartLine className="text-blue-600 text-lg" />
              </div>
            </div>
            <div className="text-3xl font-light text-gray-900 mb-1">{totalAmount.toFixed(2)}</div>
            <div className="text-gray-500 text-sm font-medium">Total Requested (SOL)</div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-green-200 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center group-hover:from-green-100 group-hover:to-green-200 transition-all duration-200">
                <FaCheckCircle className="text-green-600 text-lg" />
              </div>
            </div>
            <div className="text-3xl font-light text-gray-900 mb-1">{completedPayments}</div>
            <div className="text-gray-500 text-sm font-medium">Completed</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">Create a New PayLink</h2>
                <p className="text-gray-600 max-w-2xl">
                  Generate a payment link with recipient, amount, and memo. Share it with anyone to receive SOL payments instantly.
                </p>
              </div>
              <Link
                href="/create-link"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium group shadow-lg hover:shadow-xl"
              >
                <FaPlus className="text-sm" />
                Create PayLink
                <FaArrowRight className="text-sm group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-light text-gray-900">Your PayLinks</h2>
                  <p className="text-gray-500 mt-1">Manage and track all your payment requests</p>
                </div>
                <div className="px-3 py-1.5 bg-gray-100 rounded-lg">
                  <span className="text-gray-600 text-sm font-medium">{links.length} total</span>
                </div>
              </div>
            </div>
            <div className="p-8">
            
            {links.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaLink className="text-2xl text-purple-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No PayLinks yet</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Create your first payment link to start receiving SOL payments instantly
                </p>
                <Link
                  href="/create-link"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium group shadow-lg hover:shadow-xl"
                >
                  <FaPlus className="text-sm" />
                  Create Your First Link
                  <FaArrowRight className="text-sm group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {links.map((link, index) => (
                  <div
                    key={link.id}
                    className="group border border-gray-200 rounded-xl p-6 hover:border-purple-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl font-light text-gray-900">
                            {link.amount} SOL
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <span className="font-medium">To:</span>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                            {link.recipient.slice(0, 8)}...{link.recipient.slice(-8)}
                          </span>
                        </div>
                        {link.message && (
                          <p className="text-sm text-gray-600 mb-3 bg-gray-50 px-3 py-2 rounded-lg">
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
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <FaEllipsisV className="text-gray-400 text-sm" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/link/${link.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all font-medium"
                        title="Copy link"
                      >
                        {copied === `${window.location.origin}/link/${link.id}` ? (
                          <>
                            <FaCheckCircle className="text-green-500 text-sm" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <FaCopy className="text-sm" />
                            Copy Link
                          </>
                        )}
                      </button>
                      <Link
                        href={`/link/${link.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium shadow-sm hover:shadow-md"
                      >
                        <span className="text-sm">View</span>
                        <FaExternalLinkAlt className="text-xs" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

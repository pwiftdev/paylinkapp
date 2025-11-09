'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaLink, FaSignOutAlt, FaSpinner, FaCopy, FaExternalLinkAlt, FaCalendarAlt, FaWallet, FaChartLine, FaCheckCircle, FaArrowRight, FaEllipsisV, FaCoins, FaUsers, FaTrophy, FaMedal, FaShareAlt } from 'react-icons/fa';
import LockedOverlay from '../components/LockedOverlay';

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
  status: 'pending' | 'paid' | 'cancelled';
  transaction_hash: string | null;
  paid_at: string | null;
  created_at: string;
}

interface ReferralStats {
  username: string;
  totalReferrals: number;
  verifiedReferrals: number;
  points: number;
  rank: number | null;
  totalReferrers: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  totalReferrals: number;
  verifiedReferrals: number;
  points: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { publicKey, disconnect } = useWallet();
  const { connection } = useConnection();
  const [user, setUser] = useState<UserData | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connection) return;
    
    setBalanceLoading(true);
    try {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1e9); // Convert lamports to SOL
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setBalanceLoading(false);
    }
  }, [publicKey, connection]);

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

        // Fetch referral stats
        const statsResponse = await fetch(`/api/referrals/stats?username=${data.username}`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setReferralStats(statsData);
        }

        // Fetch leaderboard
        const leaderboardResponse = await fetch('/api/referrals/leaderboard?limit=10');
        if (leaderboardResponse.ok) {
          const leaderboardData = await leaderboardResponse.json();
          setLeaderboard(leaderboardData);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchBalance();
  }, [publicKey, router, connection, fetchBalance]);

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
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-white mb-2">
                Welcome back, <span className="font-medium bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">@{user.username}</span>
              </h1>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="flex items-center gap-2">
                  <FaWallet className="text-sm" />
                  <span className="font-mono text-sm">
                    {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(publicKey.toString())}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Copy address"
                >
                  <FaCopy className="text-xs text-white" />
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                disconnect();
                router.push('/register');
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
            >
              <FaSignOutAlt className="text-sm" />
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Wallet Balance Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-emerald-300/50 transition-all duration-200 group shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center group-hover:from-emerald-100 group-hover:to-emerald-200 transition-all duration-200">
                <FaCoins className="text-emerald-600 text-lg" />
              </div>
              <button
                onClick={fetchBalance}
                disabled={balanceLoading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh balance"
              >
                <FaSpinner className={`text-xs text-gray-400 ${balanceLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="text-3xl font-light text-white mb-1">
              {balanceLoading ? (
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin text-lg text-gray-300" />
                  <span className="text-gray-300">Loading...</span>
                </div>
              ) : balance !== null ? (
                `${balance.toFixed(4)} SOL`
              ) : (
                <span className="text-gray-300">--</span>
              )}
            </div>
            <div className="text-gray-300 text-sm font-medium">Wallet Balance</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-purple-300/50 transition-all duration-200 group shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-200">
                <FaLink className="text-purple-600 text-lg" />
              </div>
            </div>
            <div className="text-3xl font-light text-white mb-1">{completedPayments}</div>
            <div className="text-gray-300 text-sm font-medium">Active PayLinks</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-blue-300/50 transition-all duration-200 group shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-200">
                <FaChartLine className="text-blue-600 text-lg" />
              </div>
            </div>
            <div className="text-3xl font-light text-white mb-1">{totalAmount.toFixed(2)}</div>
            <div className="text-gray-300 text-sm font-medium">Total Requested (SOL)</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-green-300/50 transition-all duration-200 group shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center group-hover:from-green-100 group-hover:to-green-200 transition-all duration-200">
                <FaCheckCircle className="text-green-600 text-lg" />
              </div>
            </div>
            <div className="text-3xl font-light text-white mb-1">{completedPayments}</div>
            <div className="text-gray-300 text-sm font-medium">Completed</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-light text-white mb-2">Create a New PayLink</h2>
                <p className="text-gray-300 max-w-2xl">
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

        {/* Referral Stats Section */}
        {referralStats && (
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden">
              <div className="px-8 py-6 border-b border-white/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-light text-white mb-2 flex items-center gap-3">
                      <FaTrophy className="text-yellow-400" />
                      Referral Program
                    </h2>
                    <p className="text-gray-300">
                      Invite friends and earn rewards. Every verified referral = bonus points!
                    </p>
                  </div>
                  {referralStats.rank && (
                    <div className="text-center">
                      <div className="text-3xl font-light text-white mb-1">
                        #{referralStats.rank}
                      </div>
                      <div className="text-xs text-gray-400">
                        of {referralStats.totalReferrers} referrers
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <FaUsers className="text-blue-400 text-xl" />
                      <span className="text-gray-300 font-medium">Total Referrals</span>
                    </div>
                    <div className="text-3xl font-light text-white">{referralStats.totalReferrals}</div>
                    <div className="text-xs text-gray-400 mt-2">All users you referred</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <FaCheckCircle className="text-green-400 text-xl" />
                      <span className="text-gray-300 font-medium">Verified</span>
                    </div>
                    <div className="text-3xl font-light text-white">{referralStats.verifiedReferrals}</div>
                    <div className="text-xs text-gray-400 mt-2">Have made a paid transaction</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <FaMedal className="text-yellow-400 text-xl" />
                      <span className="text-gray-300 font-medium">Points</span>
                    </div>
                    <div className="text-3xl font-light text-white">{referralStats.points}</div>
                    <div className="text-xs text-gray-400 mt-2">1 per referral + 2 per verified</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                        <FaShareAlt className="text-sm" />
                        Share Your Referral Link
                      </h3>
                      <p className="text-gray-300 text-sm mb-3">
                        Share this link with friends: <code className="bg-white/20 px-2 py-1 rounded text-xs break-all">{typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${user.username}` : `/register?ref=${user.username}`}</code>
                      </p>
                      <p className="text-gray-400 text-xs">
                        Or tell them to enter <strong className="text-purple-300">@{user.username}</strong> when signing up
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/register?ref=${user.username}`)}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all font-medium text-white flex items-center gap-2"
                    >
                      {copied === `${window.location.origin}/register?ref=${user.username}` ? (
                        <>
                          <FaCheckCircle className="text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FaCopy />
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Links Section */}
        <div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
            <div className="px-8 py-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-light text-white">Your PayLinks</h2>
                  <p className="text-gray-300 mt-1">Manage and track all your payment requests</p>
                </div>
                <div className="px-3 py-1.5 bg-white/20 rounded-lg">
                  <span className="text-white text-sm font-medium">{links.length} total</span>
                </div>
              </div>
            </div>
            <div className="p-8">
            
            {links.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
                  <FaLink className="text-2xl text-purple-300" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No PayLinks yet</h3>
                <p className="text-gray-300 mb-8 max-w-md mx-auto">
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
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-300/50 hover:bg-white/10 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl font-light text-white">
                            {link.amount} SOL
                          </span>
                          {/* Payment Status Badge */}
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            link.status === 'paid' 
                              ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                              : link.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                          }`}>
                            {link.status === 'paid' ? 'Paid' : link.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                          <span className="font-medium">To:</span>
                          <span className="font-mono bg-white/10 px-2 py-1 rounded text-xs text-white">
                            {link.recipient.slice(0, 8)}...{link.recipient.slice(-8)}
                          </span>
                        </div>
                        {link.message && (
                          <p className="text-sm text-gray-300 mb-3 bg-white/10 px-3 py-2 rounded-lg">
                            {link.message}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                          <FaCalendarAlt />
                          {new Date(link.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        {link.status === 'paid' && link.paid_at && (
                          <div className="flex items-center gap-2 text-xs text-green-300 mb-2">
                            <FaCheckCircle />
                            Paid on {new Date(link.paid_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        )}
                        {link.status === 'paid' && link.transaction_hash && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="font-mono bg-white/10 px-2 py-1 rounded text-xs text-white">
                              {link.transaction_hash.slice(0, 8)}...{link.transaction_hash.slice(-8)}
                            </span>
                            <a
                              href={`https://explorer.solana.com/tx/${link.transaction_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-300 hover:text-blue-200"
                            >
                              <FaExternalLinkAlt className="text-xs" />
                            </a>
                          </div>
                        )}
                      </div>
                      <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <FaEllipsisV className="text-gray-400 text-sm" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/link/${link.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/20 rounded-lg transition-all font-medium"
                        title="Copy link"
                      >
                        {copied === `${window.location.origin}/link/${link.id}` ? (
                          <>
                            <FaCheckCircle className="text-green-400 text-sm" />
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
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/80 to-purple-600/80 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all font-medium shadow-sm hover:shadow-md backdrop-blur-sm"
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

        {/* Leaderboard Section */}
        {leaderboard.length > 0 && (
          <div className="mt-12 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
              <div className="px-8 py-6 border-b border-white/20">
                <h2 className="text-2xl font-light text-white mb-2 flex items-center gap-3">
                  <FaTrophy className="text-yellow-400" />
                  Top Referrers
                </h2>
                <p className="text-gray-300 text-sm">
                  Monthly leaderboard ranking based on referral points
                </p>
              </div>
              <div className="p-8">
                <div className="space-y-3">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.username}
                      className={`flex items-center gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all ${
                        entry.username.toLowerCase() === user.username.toLowerCase()
                          ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-400/50 shadow-lg'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        entry.rank === 1
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                          : entry.rank === 2
                          ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                          : entry.rank === 3
                          ? 'bg-gradient-to-br from-amber-600 to-amber-800'
                          : 'bg-gradient-to-br from-purple-500 to-purple-700'
                      }`}>
                        {entry.rank <= 3 ? (
                          entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'
                        ) : (
                          entry.rank
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">@{entry.username}</span>
                          {entry.username.toLowerCase() === user.username.toLowerCase() && (
                            <span className="text-xs bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded">You</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {entry.totalReferrals} referrals • {entry.verifiedReferrals} verified
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-light text-white">{entry.points}</div>
                        <div className="text-xs text-gray-400">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <LockedOverlay />
    </main>
  );
}

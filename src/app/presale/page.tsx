'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaWallet, FaCheckCircle, FaCoins, FaSpinner, FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';

interface PresaleStats {
  totalSold: number;
  totalParticipants: number;
  totalSolRaised: number;
}

interface UserPurchase {
  allocationPercentage: number;
  tokenAmount: number;
  status: string;
  transactionHash: string | null;
  createdAt: string;
}

export default function PresalePage() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const [selectedAllocation, setSelectedAllocation] = useState<number | null>(null);
  const [stats, setStats] = useState<PresaleStats | null>(null);
  const [userPurchase, setUserPurchase] = useState<UserPurchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);

  // Constants
  const totalSupply = 1000000000; // 1 billion tokens
  const presalePercentage = 15; // 15% for presale
  const totalPresaleTokens = (totalSupply * presalePercentage) / 100;
  const PRESALE_WALLET = '2mpM3z14xJXVLA5M6ESUitoDCmmKeYZqq532ELK9FHNR';
  const MARKET_CAP = 30000; // $30K market cap
  const TOKEN_PRICE = 0.00003; // $0.00003 per token

  // Allocation options (percentage of total supply)
  const allocationOptions = [
    { 
      percentage: 0.25, 
      tokens: (totalSupply * 0.25) / 100,
      usdValue: ((totalSupply * 0.25) / 100) * TOKEN_PRICE,
      getSolCost: () => solPrice ? (((totalSupply * 0.25) / 100) * TOKEN_PRICE) / solPrice : null
    },
    { 
      percentage: 0.5, 
      tokens: (totalSupply * 0.5) / 100,
      usdValue: ((totalSupply * 0.5) / 100) * TOKEN_PRICE,
      getSolCost: () => solPrice ? (((totalSupply * 0.5) / 100) * TOKEN_PRICE) / solPrice : null
    },
    { 
      percentage: 1, 
      tokens: (totalSupply * 1) / 100,
      usdValue: ((totalSupply * 1) / 100) * TOKEN_PRICE,
      getSolCost: () => solPrice ? (((totalSupply * 1) / 100) * TOKEN_PRICE) / solPrice : null
    },
  ];

  // Fetch SOL price from our API route
  const fetchSolPrice = async () => {
    try {
      const response = await fetch('/api/sol-price');
      if (response.ok) {
        const data = await response.json();
        setSolPrice(data.price);
      }
    } catch (error) {
      console.error('Error fetching SOL price:', error);
    }
  };

  // Fetch presale stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/presale/stats', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Stats received:', data);
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching presale stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchSolPrice();
    // Refresh stats every 10 seconds
    const statsInterval = setInterval(fetchStats, 10000);
    // Refresh SOL price every 60 seconds
    const priceInterval = setInterval(fetchSolPrice, 60000);
    return () => {
      clearInterval(statsInterval);
      clearInterval(priceInterval);
    };
  }, []);

  // Check if wallet has purchased
  useEffect(() => {
    const checkWalletPurchase = async () => {
      if (!publicKey) {
        setUserPurchase(null);
        return;
      }

      try {
        const response = await fetch(`/api/presale/check?wallet=${publicKey.toString()}`);
        if (response.ok) {
          const data = await response.json();
          if (data.hasPurchased) {
            setUserPurchase(data.purchase);
          } else {
            setUserPurchase(null);
          }
        }
      } catch (error) {
        console.error('Error checking wallet purchase:', error);
      }
    };

    checkWalletPurchase();
  }, [publicKey]);

  const handlePurchase = async () => {
    if (!publicKey || !selectedAllocation || !signTransaction) {
      setError('Please connect your wallet first');
      return;
    }

    if (!solPrice) {
      setError('Loading SOL price, please wait...');
      return;
    }

    setPurchasing(true);
    setError(null);
    setTxHash(null);

    try {
      const tokenAmount = (totalSupply * selectedAllocation) / 100;
      const usdValue = tokenAmount * TOKEN_PRICE;
      const solCost = usdValue / solPrice;
      const lamports = Math.floor(solCost * LAMPORTS_PER_SOL);

      // Create transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(PRESALE_WALLET),
          lamports,
        })
      );

      // Get recent blockhash with retry logic
      let blockhash;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          const result = await connection.getLatestBlockhash();
          blockhash = result.blockhash;
          break;
        } catch (rpcError) {
          retryCount++;
          console.error(`RPC Error getting blockhash (attempt ${retryCount}):`, rpcError);
          
          if (retryCount >= maxRetries) {
            throw new Error('Unable to connect to Solana network. Please try again or check your internet connection.');
          }
          
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
      
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Let the wallet handle signing (this will trigger the wallet popup)
      const signedTransaction = await signTransaction(transaction);

      // Send the transaction
      const transactionHash = await connection.sendRawTransaction(signedTransaction.serialize());

      // Wait for confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Record purchase in database
      const response = await fetch('/api/presale/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          allocationPercentage: selectedAllocation,
          tokenAmount: tokenAmount,
          transactionHash: transactionHash,
          solAmount: solCost,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserPurchase(data.purchase);
        setTxHash(transactionHash);
        setSelectedAllocation(null);
        
        // Refresh stats
        const statsResponse = await fetch('/api/presale/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record purchase');
      }
    } catch (err) {
      console.error('Payment error:', err);
      
      // Check for specific error types and provide helpful messages
      if (err instanceof Error) {
        if (err.message.includes('User rejected') || err.message.includes('User declined')) {
          setError('Payment was cancelled. Please try again if you want to proceed.');
        } else if (err.message.includes('Insufficient funds') || err.message.includes('insufficient')) {
          setError('Insufficient SOL balance. Please add SOL to your wallet and try again.');
        } else if (err.message.includes('Transaction simulation failed')) {
          setError('Transaction failed. Please check your wallet balance and try again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to send payment. Please try again.');
      }
    } finally {
      setPurchasing(false);
    }
  };

  const totalSold = stats?.totalSold || 0;
  const soldPercentage = (totalSold / totalPresaleTokens) * 100;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Hero Section Background - Same as homepage */}
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

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors">
            <FaArrowLeft className="mr-2 text-sm" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          
          <div className="text-center">
            <Image
              src="/paylinklogo.png"
              alt="PayLink Logo"
              width={80}
              height={80}
              className="mx-auto mb-6"
            />
            <h1 className="text-5xl font-bold text-white mb-4">Public Presale</h1>
            <p className="text-xl text-gray-300 mb-6">
              Secure your allocation of $LINK tokens before TGE
            </p>
            
            {/* Valuation Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 max-w-3xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Market Cap</div>
                  <div className="text-2xl font-bold text-white">${MARKET_CAP.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Token Price</div>
                  <div className="text-2xl font-bold text-white">${TOKEN_PRICE}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">SOL Price</div>
                  <div className="text-2xl font-bold text-white">
                    {solPrice ? `$${solPrice.toFixed(2)}` : '...'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total Supply</div>
                  <div className="text-2xl font-bold text-white">{totalSupply.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Presale Stats Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Presale Progress</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchStats}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Refresh stats"
              >
                <FaSyncAlt className="text-purple-300 hover:text-purple-200" />
              </button>
              <div className="flex items-center gap-2 text-purple-300">
                <FaCoins className="text-xl" />
                <span className="font-bold">{presalePercentage}% Allocation</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Total Sold: {totalSold.toLocaleString()} tokens</span>
              <span>{soldPercentage.toFixed(2)}% filled</span>
            </div>
            <div className="h-6 bg-gray-700/50 rounded-full overflow-hidden border border-white/20">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${soldPercentage}%` }}
              />
            </div>
            <div className="text-sm text-gray-400 mt-2 text-right">
              {totalPresaleTokens.toLocaleString()} tokens available
            </div>
          </div>

          {/* User Purchase Info */}
          {publicKey && userPurchase && (
            <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <FaCheckCircle className="text-green-400" />
                <span className="text-white font-semibold">Your Purchase</span>
              </div>
              <p className="text-green-200 mb-2">
                You have purchased {userPurchase.tokenAmount.toLocaleString()} $LINK tokens
              </p>
              <p className="text-green-300 text-sm">
                Allocation: {userPurchase.allocationPercentage}% | Status: {userPurchase.status}
              </p>
            </div>
          )}
        </div>

        {/* Wallet Connection */}
        {!publicKey ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-xl text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaWallet className="text-4xl text-purple-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Connect Your Wallet</h3>
            <p className="text-gray-300 mb-8">
              Connect your Solana wallet to participate in the presale
            </p>
            <button
              onClick={() => setVisible(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Connect Wallet
            </button>
          </div>
        ) : userPurchase ? (
          /* Already Purchased */
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-xl text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-4xl text-green-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Purchase Complete!</h3>
            <p className="text-gray-300 mb-6">
              You have already purchased your allocation of $LINK tokens.
            </p>
            <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-6">
              <div className="text-3xl font-bold text-white mb-2">
                {userPurchase.tokenAmount.toLocaleString()}
              </div>
              <div className="text-purple-200 mb-4">
                $LINK Tokens ({userPurchase.allocationPercentage}% of total supply)
              </div>
              <div className="text-sm text-gray-300">
                Status: <span className="text-green-400 font-semibold capitalize">{userPurchase.status}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Allocation Selection */
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-xl">
            <h3 className="text-2xl font-semibold text-white mb-6">Select Your Allocation</h3>
            <p className="text-gray-300 mb-6">
              Choose your allocation size. One entry per wallet.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {allocationOptions.map((option) => (
                <button
                  key={option.percentage}
                  onClick={() => setSelectedAllocation(option.percentage)}
                  disabled={purchasing}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedAllocation === option.percentage
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:border-purple-400 hover:bg-white/10'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {option.percentage}%
                    </div>
                    <div className="text-sm text-gray-300 mb-2">
                      {option.tokens.toLocaleString()} tokens
                    </div>
                    <div className="text-sm text-green-300 font-semibold mb-1">
                      ${option.usdValue.toLocaleString()}
                    </div>
                    <div className="text-lg text-purple-300 font-bold">
                      {option.getSolCost() ? `${option.getSolCost()!.toFixed(4)} SOL` : 'Loading...'}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedAllocation && (
              <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-6 mb-6">
                <h4 className="text-white font-semibold mb-2">Selected Allocation</h4>
                <p className="text-purple-200 mb-2">
                  {selectedAllocation}% of total supply = {((totalSupply * selectedAllocation) / 100).toLocaleString()} $LINK tokens
                </p>
                <p className="text-green-300 font-semibold text-lg mb-1">
                  Value: ${(((totalSupply * selectedAllocation) / 100) * TOKEN_PRICE).toLocaleString()}
                </p>
                <p className="text-purple-300 font-bold text-xl">
                  Cost: {solPrice ? `${((((totalSupply * selectedAllocation) / 100) * TOKEN_PRICE) / solPrice).toFixed(4)} SOL` : 'Loading...'}
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle className="text-red-400" />
                  <div>
                    <p className="text-red-200 font-medium">Payment Failed</p>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {txHash && (
              <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-green-400" />
                  <span className="text-white font-semibold">Payment Successful!</span>
                </div>
                <p className="text-green-200 text-sm mb-2">Transaction Hash:</p>
                <a
                  href={`https://explorer.solana.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 text-sm font-mono break-all underline"
                >
                  {txHash}
                </a>
              </div>
            )}

            <button
              onClick={handlePurchase}
              disabled={!selectedAllocation || purchasing || !solPrice}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {purchasing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing Payment...
                </>
              ) : !solPrice ? (
                'Loading prices...'
              ) : selectedAllocation ? (
                `Pay ${((((totalSupply * selectedAllocation) / 100) * TOKEN_PRICE) / solPrice).toFixed(4)} SOL & Confirm Purchase`
              ) : (
                'Select an allocation to continue'
              )}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}


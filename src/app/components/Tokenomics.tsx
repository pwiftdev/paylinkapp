'use client'

import { FaCoins } from 'react-icons/fa'
import DotGrid from '@/components/DotGrid'

const Tokenomics = () => {
  const tokenomics = {
    supply: '1,000,000,000',
    symbol: '$LINK'
  }

  return (
    <section className="px-4 relative overflow-hidden pt-12 pb-8 md:py-16 bg-[#3a3f4f]">
      {/* Background interactive dot grid (top portion) */}
      <div className="absolute inset-x-0 top-0 h-[600px] z-0 pointer-events-none" style={{ backgroundColor: '#3a3f4f' }}>
        <DotGrid
          dotSize={5}
          gap={15}
          baseColor="#5227FF"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-200 rounded-full mb-4 hover:scale-105 transition-transform duration-300 cursor-default">
            <FaCoins className="text-purple-600 animate-pulse" />
            <span className="text-purple-700 font-medium">Tokenomics</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            {tokenomics.symbol} Token
          </h2>
          <p className="text-lg text-gray-200 mb-6">
            Powering the PayLink ecosystem on Solana
          </p>
          <p className="text-2xl font-bold text-purple-400 animate-pulse">
            100% Fair Launch via PumpFun
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md mx-auto hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up-delay">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Token Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 group">
              <span className="text-gray-600 group-hover:text-purple-600 transition-colors">Total Supply</span>
              <span className="font-bold text-gray-900 group-hover:scale-110 transition-transform inline-block">{tokenomics.supply}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 group">
              <span className="text-gray-600 group-hover:text-purple-600 transition-colors">Network</span>
              <span className="font-bold text-gray-900 group-hover:scale-110 transition-transform inline-block">Solana</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-gray-600 group-hover:text-purple-600 transition-colors">Launch Platform</span>
              <span className="font-bold text-gray-900 group-hover:scale-110 transition-transform inline-block">PumpFun</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-fade-in-up-delay {
          animation: fade-in-up 0.8s ease-out 0.3s both;
        }
      `}</style>
    </section>
  )
}

export default Tokenomics

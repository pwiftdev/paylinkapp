'use client'

import { FaCoins, FaLock, FaUsers, FaRocket, FaFire } from 'react-icons/fa'
import Aurora from '@/components/Aurora'
import { useState, useEffect } from 'react'

const Tokenomics = () => {
  const [animatedPercentages, setAnimatedPercentages] = useState<number[]>([0, 0, 0, 0]);
  
  const tokenomics = {
    supply: '1,000,000,000',
    symbol: '$LINK'
  }

  const distribution = [
    { 
      label: 'Open Market on Pump.Fun', 
      percentage: 70, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      icon: FaFire
    },
    { 
      label: 'PayLink Utility (Locked)', 
      percentage: 20, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      icon: FaLock
    },
    { 
      label: 'Marketing and Partnerships (Vested)', 
      percentage: 7.5, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      icon: FaUsers
    },
    { 
      label: 'Development Team (Vested)', 
      percentage: 2.5, 
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-700',
      icon: FaRocket
    },
  ]

  useEffect(() => {
    // Animate percentages on mount
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      setAnimatedPercentages(
        distribution.map(item => item.percentage * easeOut)
      );

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedPercentages(distribution.map(item => item.percentage));
      }
    }, interval);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="px-4 relative overflow-hidden pt-12 pb-8 md:py-16 bg-black">
      {/* Aurora Background - Top */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Aurora 
          colorStops={['#5227FF', '#9333ea', '#5227FF']}
          amplitude={1.0}
          blend={0.5}
        />
      </div>
      {/* Aurora Background - Bottom (Different Animation Style) */}
      <div className="absolute inset-0 z-0 w-full h-full" style={{ transform: 'scaleY(-1)' }}>
        <Aurora 
          colorStops={['#9333ea', '#5227FF', '#9333ea']}
          amplitude={1.3}
          blend={0.6}
          speed={1.5}
        />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-200 rounded-full mb-4 hover:scale-105 transition-transform duration-300 cursor-default">
            <FaCoins className="text-purple-600 animate-pulse" />
            <span className="text-purple-700 font-medium">Tokenomics</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            {tokenomics.symbol} Token
          </h2>
          <p className="text-lg text-gray-200">
            Powering the PayLink ecosystem on Solana
          </p>
        </div>

        <div className="flex flex-col gap-8 mb-8 max-w-3xl mx-auto">
          {/* Token Details */}
          <div className="relative rounded-3xl p-8 backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-fade-in-up-delay overflow-hidden group">
            {/* Liquid glass gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center drop-shadow-lg">Token Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/20 pb-3 hover:border-purple-400/30 transition-colors">
                  <span className="text-gray-200 hover:text-purple-300 transition-colors">Total Supply</span>
                  <span className="font-bold text-white hover:scale-110 transition-transform inline-block drop-shadow-md">{tokenomics.supply}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/20 pb-3 hover:border-purple-400/30 transition-colors">
                  <span className="text-gray-200 hover:text-purple-300 transition-colors">Network</span>
                  <span className="font-bold text-white hover:scale-110 transition-transform inline-block drop-shadow-md">Solana</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-200 hover:text-purple-300 transition-colors">Launch Platform</span>
                  <span className="font-bold text-white hover:scale-110 transition-transform inline-block drop-shadow-md">PumpFun</span>
                </div>
              </div>
            </div>
          </div>

          {/* Token Distribution */}
          <div className="relative rounded-3xl p-8 backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 animate-fade-in-up-delay-2 overflow-hidden group">
            {/* Liquid glass gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center drop-shadow-lg">Token Distribution</h3>
              
              {/* Compact Progress Bars */}
              <div className="space-y-4">
                {distribution.map((item, index) => {
                  const Icon = item.icon;
                  const colors = [
                    { bg: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600', text: 'text-purple-300' },
                    { bg: 'bg-green-500', gradient: 'from-green-500 to-green-600', text: 'text-green-300' },
                    { bg: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600', text: 'text-blue-300' },
                    { bg: 'bg-amber-500', gradient: 'from-amber-500 to-amber-600', text: 'text-amber-300' },
                  ];
                  const color = colors[index];
                  const animatedWidth = animatedPercentages[index] || 0;
                  
                  return (
                    <div key={index} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="text-white text-sm" />
                          </div>
                          <div>
                            <span className="text-white font-semibold text-sm block">{item.label}</span>
                            <span className={`${color.text} text-xs font-medium`}>{item.percentage}%</span>
                          </div>
                        </div>
                        <span className="text-white font-bold text-lg drop-shadow-md">{item.percentage}%</span>
                      </div>
                      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                        <div
                          className={`h-full bg-gradient-to-r ${color.gradient} rounded-full shadow-lg transition-all duration-300 ease-out relative overflow-hidden`}
                          style={{ width: `${animatedWidth}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default Tokenomics

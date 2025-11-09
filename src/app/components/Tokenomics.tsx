'use client'

import { FaCoins, FaLock, FaUsers, FaRocket, FaFire } from 'react-icons/fa'
import DotGrid from '@/components/DotGrid'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const Tokenomics = () => {
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
      label: 'Public Presale', 
      percentage: 15, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      icon: FaUsers
    },
    { 
      label: 'PayLink Utility (Locked)', 
      percentage: 12.5, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      icon: FaLock
    },
    { 
      label: 'Development Team', 
      percentage: 2.5, 
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-700',
      icon: FaRocket
    },
  ]

  return (
    <section className="px-4 relative overflow-hidden pt-12 pb-8 md:py-16 bg-[#3a3f4f]">
      {/* Background interactive dot grid (full section) */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: '#3a3f4f' }}>
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
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up-delay">
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

          {/* Token Distribution */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in-up-delay-2">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Token Distribution</h3>
            
            {/* Chart.js Pie Chart */}
            <div className="flex flex-col items-center gap-8">
              <div className="w-full max-w-md mx-auto">
                <Pie
                  data={{
                    labels: distribution.map(d => d.label),
                    datasets: [{
                      data: distribution.map(d => d.percentage),
                      backgroundColor: [
                        '#9333ea', // purple
                        '#3b82f6', // blue
                        '#22c55e', // green
                        '#f59e0b', // amber
                      ],
                      borderColor: '#ffffff',
                      borderWidth: 2,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
              
              {/* Legend Below */}
              <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                {distribution.map((item, index) => {
                  const Icon = item.icon;
                  const colors = ['bg-purple-600', 'bg-blue-600', 'bg-green-600', 'bg-amber-600'];
                  
                  return (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className={`w-4 h-4 rounded ${colors[index]}`} />
                      <Icon className="text-gray-600 text-sm" />
                      <span className="text-gray-700 font-medium text-sm flex-1">{item.label}</span>
                      <span className="font-bold text-gray-900">{item.percentage}%</span>
                    </div>
                  );
                })}
              </div>
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
        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 0.8s ease-out 0.5s both;
        }
      `}</style>
    </section>
  )
}

export default Tokenomics

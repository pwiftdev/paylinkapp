'use client'

import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaLink, FaBolt, FaShieldAlt, FaGlobe, FaMobile, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import Tokenomics from './components/Tokenomics';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-purple-600 flex items-center justify-center px-4 relative overflow-hidden"
      >
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
        
        <div className={`text-center max-w-4xl mx-auto relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8 animate-bounce-slow">
            <Image
              src="/paylinklogo.png"
              alt="PayLink Logo"
              width={120}
              height={120}
              className="mx-auto mb-6 drop-shadow-2xl hover:scale-110 transition-transform duration-500"
            />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            PayLink
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fade-in-delay">
            Create personalized payment links with your @username. Request SOL payments with ease on Solana.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-delay-2">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all font-semibold text-lg shadow-xl flex items-center gap-2 hover:scale-105 hover:shadow-2xl group"
            >
              Get Started
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all font-semibold text-lg hover:scale-105 hover:border-purple-300"
            >
              Learn More
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: FaUser, title: 'Your @Username', desc: 'Create your unique PayLink account with a custom username' },
              { icon: FaLink, title: 'Create Links', desc: 'Generate payment links with recipient, amount, and memo' },
              { icon: FaBolt, title: 'Solana Native', desc: 'Built on Solana for fast, low-cost transactions' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <Icon className="text-4xl mb-4 mx-auto group-hover:scale-125 transition-transform duration-300" />
                  <h3 className="font-semibold mb-2 text-lg">{item.title}</h3>
                  <p className="text-sm text-white/80 group-hover:text-white transition-colors">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PayLink?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The simplest way to request and receive SOL payments with personalized links
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FaShieldAlt, color: 'purple', title: 'Secure & Trustless', desc: 'Built on Solana blockchain with no central authority. Your funds are always in your control.' },
              { icon: FaGlobe, color: 'blue', title: 'Global & Instant', desc: 'Send and receive payments anywhere in the world in seconds with minimal fees.' },
              { icon: FaMobile, color: 'green', title: 'Mobile First', desc: 'Optimized for mobile devices. Perfect for on-the-go payments and requests.' },
              { icon: FaUser, color: 'pink', title: 'Personal Branding', desc: 'Create your unique @username and build your payment identity on Solana.' },
              { icon: FaLink, color: 'indigo', title: 'Easy Sharing', desc: 'Generate shareable links with pre-filled payment details for seamless transactions.' },
              { icon: FaBolt, color: 'yellow', title: 'Lightning Fast', desc: "Solana's high throughput ensures instant confirmations and low transaction costs." },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <Icon className={`text-3xl text-${feature.color}-600 mb-4 group-hover:scale-125 transition-transform duration-300`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '1', color: 'purple', title: 'Create Account', desc: 'Connect your Solana wallet and choose your unique @username' },
              { num: '2', color: 'blue', title: 'Create PayLink', desc: 'Generate a payment link with recipient address, amount, and optional memo' },
              { num: '3', color: 'green', title: 'Share & Get Paid', desc: 'Share your link and receive payments directly to your wallet' },
            ].map((step, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className={`bg-${step.color}-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-125 transition-transform duration-300 group-hover:shadow-lg`}>
                  <span className={`text-2xl font-bold text-${step.color}-600`}>{step.num}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">{step.title}</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <Tokenomics />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-transparent to-purple-900/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(147,51,234,0.2),transparent_50%)]"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-delay">
            Join the future of payments on Solana. Create your PayLink account today.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all font-semibold text-lg shadow-xl hover:scale-105 hover:shadow-2xl group animate-fade-in-delay-2"
          >
            <FaCheckCircle className="group-hover:scale-110 transition-transform" />
            Start Creating Links
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <Image
              src="/paylinklogo.png"
              alt="PayLink Logo"
              width={40}
              height={40}
              className="mr-3"
            />
            <span className="text-2xl font-bold">PayLink</span>
          </div>
          <p className="text-gray-400 mb-4">
            The simplest way to request SOL payments on Solana
          </p>
          <p className="text-sm text-gray-500">
            © 2025 PayLink. Built on Solana.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.2s both;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.4s both;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}

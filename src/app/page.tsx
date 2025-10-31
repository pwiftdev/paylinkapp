'use client'

import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaLink, FaBolt, FaShieldAlt, FaGlobe, FaMobile, FaArrowRight, FaCheckCircle, FaUsers, FaTrophy, FaMedal, FaShareAlt, FaGift, FaBars, FaTimes } from 'react-icons/fa';
import Tokenomics from './components/Tokenomics';
import { useEffect, useState } from 'react';
import CountUp from '@/components/CountUp';
import Ballpit from '@/components/Ballpit';
import InfiniteScroll from '@/components/InfiniteScroll';
import GlassSurface from '@/components/GlassSurface';

export default function Home() {
  const [stats, setStats] = useState<{ users: number; links: number; totalRequestedSol: number } | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isOverDarkBackground, setIsOverDarkBackground] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        if (isMounted) setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    };
    fetchStats();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Hero section is typically ~100vh, so check if we're in the first screen
      const heroHeight = window.innerHeight;
      const scrolled = window.scrollY;
      // If we're in the first screen (hero section with dark background), use white text
      setIsOverDarkBackground(scrolled < heroHeight * 0.8);
    };
    
    // Check initial state
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center">
        <GlassSurface
          width="70vw"
          height={80}
          borderRadius={16}
          backgroundOpacity={0.25}
          opacity={0.8}
          blur={20}
          displace={15}
          brightness={60}
          saturation={1.8}
          distortionScale={-150}
          redOffset={5}
          greenOffset={15}
          blueOffset={25}
          className="relative"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}
        >
          <div className="w-full h-full flex items-center justify-between px-6 md:px-8 relative z-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 transition-all duration-300">
                <Image
                  src="/paylinklogo.png"
                  alt="PayLink"
                  width={32}
                  height={32}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className={`font-bold text-xl transition-colors ${
                isOverDarkBackground 
                  ? 'text-white group-hover:text-purple-300' 
                  : 'text-gray-900 group-hover:text-purple-600'
              }`}>
                PayLink
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <div className="bg-white/90 rounded-lg px-4 py-2">
                <button
                  onClick={() => scrollToSection('features')}
                  className="font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
                >
                  Features
                </button>
              </div>
              <div className="bg-white/90 rounded-lg px-4 py-2">
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
                >
                  How It Works
                </button>
              </div>
              <div className="bg-white/90 rounded-lg">
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 block"
                >
                  Get Started
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isOverDarkBackground 
                  ? 'text-white/90 hover:bg-white/10' 
                  : 'text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              <FaBars className="text-xl" />
            </button>
          </div>
        </GlassSurface>

        {/* Mobile Menu - Full Screen */}
        <div 
          className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-purple-600 transition-transform duration-300 ${
              mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
            }`}
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

            <div className="relative h-full w-full flex flex-col z-10">
              {/* Close Button */}
              <div className="flex justify-end p-6">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/30 transition-all shadow-lg ${
                    mobileMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                  style={{ transitionDelay: mobileMenuOpen ? '0.2s' : '0s' }}
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Menu Content */}
              <nav className={`flex-1 flex flex-col items-center justify-center gap-6 px-8 transition-all duration-300 ${
                mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{ transitionDelay: mobileMenuOpen ? '0.1s' : '0s' }}>
                <button
                  onClick={() => scrollToSection('features')}
                  className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-xl px-8 py-4 text-white font-semibold text-lg hover:bg-white/20 hover:shadow-lg transition-all border border-white/20"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-xl px-8 py-4 text-white font-semibold text-lg hover:bg-white/20 hover:shadow-lg transition-all border border-white/20"
                >
                  How It Works
                </button>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full max-w-sm bg-white text-purple-600 rounded-xl px-8 py-4 font-semibold text-lg hover:bg-gray-100 hover:shadow-lg transition-all text-center"
                >
                  Get Started
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section 
        className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-purple-600 flex items-center justify-center px-4 relative overflow-hidden pt-32 pb-24 md:pt-24 md:pb-0"
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
        
        <div className="text-center max-w-4xl mx-auto relative z-10 transition-all duration-1000 opacity-100 translate-y-0">
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
      <section id="features" className="py-20 px-4 bg-gray-50 relative overflow-hidden min-h-[500px] scroll-mt-20">
        {/* Ballpit Background */}
        <div className="absolute inset-0">
          <Ballpit
            count={50}
            gravity={1}
            friction={0.99}
            wallBounce={0.95}
            followCursor={true}
            colors={[0x5b21b6, 0x7c3aed, 0xa855f7, 0xc084fc]}
          />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PayLink?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The simplest way to request and receive SOL payments with personalized links
            </p>
          </div>

          {/* Infinite Scroll stack replacing grid */}
          <div className="relative flex justify-center" style={{ height: '500px' }}>
            {(() => {
              const colorClassMap: Record<string, string> = {
                purple: 'text-purple-600',
                blue: 'text-blue-600',
                green: 'text-green-600',
                pink: 'text-pink-600',
                indigo: 'text-indigo-600',
                yellow: 'text-yellow-600',
              };
              const data = [
                { icon: FaShieldAlt, color: 'purple', title: 'Secure & Trustless', desc: 'Built on Solana blockchain with no central authority. Your funds are always in your control.' },
                { icon: FaGlobe, color: 'blue', title: 'Global & Instant', desc: 'Send and receive payments anywhere in the world in seconds with minimal fees.' },
                { icon: FaMobile, color: 'green', title: 'Mobile First', desc: 'Optimized for mobile devices. Perfect for on-the-go payments and requests.' },
                { icon: FaUser, color: 'pink', title: 'Personal Branding', desc: 'Create your unique @username and build your payment identity on Solana.' },
                { icon: FaLink, color: 'indigo', title: 'Easy Sharing', desc: 'Generate shareable links with pre-filled payment details for seamless transactions.' },
                { icon: FaBolt, color: 'yellow', title: 'Lightning Fast', desc: "Solana's high throughput ensures instant confirmations and low transaction costs." },
              ];
              const items = data.map(({ icon: Icon, color, title, desc }) => ({
                content: (
                  <div className="bg-white/90 backdrop-blur rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                    <Icon className={`text-3xl ${colorClassMap[color]} mb-3 md:mb-4`} />
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">{title}</h3>
                    <p className="text-sm md:text-base text-gray-600">{desc}</p>
                  </div>
                )
              }));
              return (
                <InfiniteScroll
                  items={items}
                  isTilted={true}
                  tiltDirection="left"
                  autoplay={true}
                  autoplaySpeed={0.2}
                  autoplayDirection="down"
                  pauseOnHover={true}
                  width="28rem"
                  maxHeight="100%"
                  negativeMargin="-0.75em"
                  itemMinHeight={140}
                />
              );
            })()}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white scroll-mt-20">
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
      <section className="px-4 bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 relative overflow-hidden pt-10 pb-16 md:py-20">
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

      {/* Referral System Section */}
      <section className="py-20 px-4 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Referral Program</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Invite others to join PayLink and earn points based on your referrals and their verified activity.
            </p>
          </div>

          {/* How It Works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { 
                icon: FaShareAlt, 
                title: 'Share Your Referral', 
                desc: 'Distribute your unique referral link or username to potential users',
                color: 'purple'
              },
              { 
                icon: FaUsers, 
                title: 'Accumulate Points', 
                desc: 'Receive 1 point per referral, plus 2 additional points when they complete a paid transaction',
                color: 'blue'
              },
              { 
                icon: FaTrophy, 
                title: 'Leaderboard Ranking', 
                desc: 'Compete for monthly rewards based on your total referral points',
                color: 'purple'
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-8 border border-gray-200 hover:border-purple-300 transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${
                    item.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Icon className="text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Points System */}
          <div className="bg-gray-50 rounded-xl p-8 md:p-12 border border-gray-200 mb-12">
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Point Allocation System</h3>
              <p className="text-gray-600 max-w-3xl">
                Points are calculated based on referral activity. Verified referrals who complete a paid transaction contribute additional points to your total.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FaUsers className="text-blue-600 text-lg" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-bold text-gray-900 mb-1">Base Points</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">Per Referral</div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Each user you refer generates 1 point upon account creation and registration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <FaCheckCircle className="text-green-600 text-lg" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-bold text-gray-900 mb-1">Bonus Points</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">For Verified Activity</div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      When a referred user completes a paid transaction, you receive an additional 2 bonus points.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Information */}
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <FaTrophy className="text-purple-600 text-xl" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">Monthly Leaderboard</h4>
                <p className="text-sm text-gray-500">Rankings updated in real-time</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-l-4 border-purple-600 pl-4">
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Top Rankings</div>
                <div className="text-gray-900 font-semibold">Top 10 referrers</div>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Reward Structure</div>
                <div className="text-gray-900 font-semibold">Monthly distribution</div>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Tracking</div>
                <div className="text-gray-900 font-semibold">Real-time updates</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg shadow-sm hover:shadow-md"
            >
              Get Started
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section (Last) */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">PayLink by the Numbers</h2>
            <p className="text-gray-600">Live stats from our community</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl border border-gray-200 p-6 text-center bg-gray-50">
              <div className="text-sm uppercase tracking-wide text-gray-500 mb-2">Users</div>
              <CountUp
                end={loadingStats ? 0 : stats?.users ?? 0}
                className="text-4xl font-extrabold text-gray-900"
              />
            </div>
            <div className="rounded-xl border border-gray-200 p-6 text-center bg-gray-50">
              <div className="text-sm uppercase tracking-wide text-gray-500 mb-2">Links Created</div>
              <CountUp
                end={loadingStats ? 0 : stats?.links ?? 0}
                className="text-4xl font-extrabold text-gray-900"
              />
            </div>
            <div className="rounded-xl border border-gray-200 p-6 text-center bg-gray-50">
              <div className="text-sm uppercase tracking-wide text-gray-500 mb-2">Total SOL Requested</div>
              <CountUp
                end={loadingStats ? 0 : stats?.totalRequestedSol ?? 0}
                decimals={2}
                suffix=" SOL"
                className="text-4xl font-extrabold text-gray-900"
              />
            </div>
          </div>
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

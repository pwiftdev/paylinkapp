'use client';

import Image from 'next/image';
import { LOCKED_BEFORE_TGE } from '@/lib/config';

export default function LockedOverlay() {
  // If the app is unlocked, don't render the overlay
  if (!LOCKED_BEFORE_TGE) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
      {/* Glass overlay with blur effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/paylinklogo.png"
            alt="PayLink Logo"
            width={150}
            height={150}
            className="drop-shadow-2xl"
            priority
          />
        </div>
        
        {/* Main message */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
          PayLink is bringing payment requests via customizable links on Solana!
        </h1>
        
        {/* TGE message */}
        <p className="text-xl md:text-2xl text-white/90 font-medium drop-shadow-md">
          Utility will be unlocked on TGE day.
        </p>
        
        {/* Optional decorative element */}
        <div className="mt-10 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-1500"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-3000"></div>
        </div>
      </div>
    </div>
  );
}


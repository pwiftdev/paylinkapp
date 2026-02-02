"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaXTwitter } from "react-icons/fa6";

export default function XStickyButton() {
  const pathname = usePathname();
  
  // Hide on dashboard page
  if (pathname === '/dashboard') {
    return null;
  }

  return (
    <div className="fixed left-4 bottom-4 z-50">
      <Link
        href="https://x.com/Join_PayLink"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 w-12 h-12 hover:scale-110"
        aria-label="Visit us on X"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <FaXTwitter className="w-6 h-6 relative z-10" />
      </Link>
    </div>
  );
}

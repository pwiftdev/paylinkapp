"use client";

import Link from 'next/link';
import { FaChartLine } from "react-icons/fa";

export default function DashboardButton() {
  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Link
        href="/dashboard"
        className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 w-14 h-14 hover:scale-110"
        aria-label="Go to Dashboard"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <FaChartLine className="w-6 h-6 relative z-10" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
      </Link>
    </div>
  );
}


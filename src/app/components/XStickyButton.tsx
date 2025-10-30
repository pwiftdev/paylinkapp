"use client";

import Link from 'next/link';
import { FaXTwitter } from "react-icons/fa6";

export default function XStickyButton() {
  return (
    <div className="fixed left-4 bottom-4 z-50">
      <Link
        href="https://x.com/Join_PayLink"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-black text-white shadow-lg hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors w-12 h-12"
        aria-label="Visit us on X"
      >
        <FaXTwitter className="w-6 h-6" />
      </Link>
    </div>
  );
}



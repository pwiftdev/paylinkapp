import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-purple-600 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <Image
          src="/paylinklogo.png"
          alt="PayLink Logo"
          width={80}
          height={80}
          className="mx-auto mb-6"
        />
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-white/80 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all font-semibold shadow-xl hover:scale-105"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

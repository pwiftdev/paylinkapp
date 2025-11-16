import "./globals.css";
import { CustomWalletProvider } from './components/WalletProvider';
import Image from 'next/image';
import XStickyButton from './components/XStickyButton';
import DashboardButton from './components/DashboardButton';

export const metadata = {
  title: 'PayLink - Solana Payment Links',
  description: 'Create personalized payment links with your @username. Request SOL payments with ease on Solana.',
  keywords: 'Solana, payments, crypto, blockchain, payment links, SOL',
  authors: [{ name: 'PayLink Team' }],
  icons: {
    icon: '/paylinklogo.png',
    shortcut: '/paylinklogo.png',
    apple: '/paylinklogo.png',
  },
  openGraph: {
    title: 'PayLink - Solana Payment Links',
    description: 'Create personalized payment links with your @username. Request SOL payments with ease on Solana.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/paylinklogo.png?v=2" />
        <link rel="apple-touch-icon" href="/paylinklogo.png?v=2" />
        <meta name="theme-color" content="#5227FF" />
      </head>
      <body className="antialiased">
        <CustomWalletProvider>
          {children}
        </CustomWalletProvider>
        <XStickyButton />
        <DashboardButton />
      </body>
    </html>
  );
}

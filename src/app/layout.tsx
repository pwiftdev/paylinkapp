import "./globals.css";
import { CustomWalletProvider } from './components/WalletProvider';
import Image from 'next/image';
import XStickyButton from './components/XStickyButton';

export const metadata = {
  title: 'PayLink - Solana Payment Links',
  description: 'Create personalized payment links with your @username. Request SOL payments with ease on Solana.',
  keywords: 'Solana, payments, crypto, blockchain, payment links, SOL',
  authors: [{ name: 'PayLink Team' }],
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
        <link rel="icon" href="/paylinklogo.png" />
      </head>
      <body className="antialiased">
        <CustomWalletProvider>
          {children}
        </CustomWalletProvider>
        <XStickyButton />
      </body>
    </html>
  );
}

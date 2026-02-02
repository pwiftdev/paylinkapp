'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function ConnectWallet() {
  return (
    <div className="w-full flex justify-center">
      <WalletMultiButton 
        style={{
          width: '100%',
          background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(219, 39, 119), rgb(99, 102, 241))',
          borderRadius: '1rem',
          fontSize: '1.25rem',
          fontWeight: '700',
          padding: '1.5rem 2rem',
          transition: 'all 0.3s',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          minHeight: '4rem',
        }}
      />
    </div>
  );
}

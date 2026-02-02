'use client';

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { SOLANA_NETWORK, SOLANA_RPC_ENDPOINT } from '@/lib/config';

require('@solana/wallet-adapter-react-ui/styles.css');

export const CustomWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const network = SOLANA_NETWORK as WalletAdapterNetwork;
  
  const endpoint = useMemo(() => {
    if (SOLANA_RPC_ENDPOINT && SOLANA_RPC_ENDPOINT.trim().length > 0) {
      return SOLANA_RPC_ENDPOINT;
    }
    return clusterApiUrl(network);
  }, [network]);

  // Only Phantom and Solflare - the most common Solana wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

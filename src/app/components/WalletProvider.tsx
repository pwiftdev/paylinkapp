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
import { SOLANA_NETWORK, RPC_ENDPOINTS, getPreferredRpc } from '@/lib/config';

require('@solana/wallet-adapter-react-ui/styles.css');

export const CustomWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const network = SOLANA_NETWORK as WalletAdapterNetwork;
  const endpoint = useMemo(() => {
    try {
      const rpcEndpoint = getPreferredRpc(network as keyof typeof RPC_ENDPOINTS);
      console.log('Using RPC endpoint:', rpcEndpoint);
      return rpcEndpoint;
    } catch {
      const fallbackEndpoint = clusterApiUrl(network);
      console.log('Using fallback RPC endpoint:', fallbackEndpoint);
      return fallbackEndpoint;
    }
  }, [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

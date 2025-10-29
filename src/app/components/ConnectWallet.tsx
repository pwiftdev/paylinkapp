'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { FaWallet, FaSignOutAlt } from 'react-icons/fa';

export default function ConnectWallet() {
  const { wallet, disconnect, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (wallet) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-2xl hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 transition-all font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {wallet ? (
        <>
          <FaSignOutAlt className="text-xl" />
          <span>Disconnect {wallet.adapter.name}</span>
        </>
      ) : (
        <>
          <FaWallet className="text-xl" />
          <span>Connect Solana Wallet</span>
        </>
      )}
    </button>
  );
}

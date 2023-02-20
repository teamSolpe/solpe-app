import {WalletContext} from '@context/walletContext';
import {useContext} from 'react';

export const useWallet = () => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('Please wrap the root component with WalletProvider');
  }

  return context;
};

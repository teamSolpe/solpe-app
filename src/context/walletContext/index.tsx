import {useStorage} from '@hooks/useStorage';
import {LOGIN_STATUS} from '@shared/const';
import {Keypair} from '@solana/web3.js';
import React, {useEffect, useMemo, useState} from 'react';

type Status = 'connected' | 'disconnected' | 'connecting' | 'fresh';
interface Context {
  walletStatus: Status;
  account: Keypair | null;
  createAccount: () => void;
}
export const WalletContext = React.createContext<Context | null>(null);

export const WalletProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {getBoolean} = useStorage();
  const [account, setAccount] = useState<Keypair | null>(null);
  const [walletStatus, setWalletStatus] = useState<Status>('connecting');

  useEffect(() => {
    const seedPhrase = getBoolean(LOGIN_STATUS);

    if (!seedPhrase) {
      setAccount(null);
      setWalletStatus('fresh');
      return;
    }
    setWalletStatus('connected');
  }, [getBoolean]);

  const createAccount = () => {
    const keyPair = Keypair.generate();

    const x = Keypair.fromSecretKey(keyPair.secretKey);
    console.log(x, 'keypair', x.secretKey);
  };

  const value: Context = useMemo(
    () => ({account, walletStatus, createAccount}),
    [account, walletStatus],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

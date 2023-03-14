import {useStorage} from '@hooks/useStorage';
import {LOGIN_STATUS, PRIVATE_KEY} from '@shared/const';
import {clusterApiUrl, Connection, Keypair} from '@solana/web3.js';
import React, {useEffect, useMemo, useState} from 'react';
import {decode} from 'bs58';

type Status = 'connected' | 'disconnected' | 'connecting' | 'fresh';

interface Context {
  walletStatus: Status;
  account: Keypair | null;
  web3: Connection;
  setAccount: (account: Keypair) => void;
}

export const WalletContext = React.createContext<Context | null>(null);

export const WalletProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {getBoolean, getString} = useStorage();
  const [account, setAccount] = useState<Keypair | null>(null);
  const [walletStatus, setWalletStatus] = useState<Status>('connecting');

  const web3 = useMemo(() => {
    return new Connection(clusterApiUrl('testnet'));
  }, []);

  useEffect(() => {
    const isLoggedIn = getBoolean(LOGIN_STATUS);

    if (!isLoggedIn) {
      setAccount(null);
      setWalletStatus('fresh');
      return;
    }

    const privateKey = getString(PRIVATE_KEY);

    const bufferPrivateKey = decode(privateKey ?? '');
    const keyPair = Keypair.fromSecretKey(bufferPrivateKey);

    setAccount(keyPair);

    setWalletStatus('connected');
  }, [getBoolean, getString]);

  const value: Context = useMemo(
    () => ({account, walletStatus, web3, setAccount}),
    [account, walletStatus, web3, setAccount],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

import {LAMPORTS_PER_SOL, PublicKey} from '@solana/web3.js';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {useWallet} from './useWallet';

interface QueryParams {
  address: string;
  params?: Omit<
    UseQueryOptions<string | 0, null, string | 0, string[]>,
    'queryKey' | 'queryFn'
  >;
}

export const useBalanceUSDT = ({address, params}: QueryParams) => {
  const {web3} = useWallet();
  return useQuery(
    ['balance', address, 'usdt'],
    async () => {
      const publicKey = new PublicKey(address);
      const balance = await web3.getBalance(publicKey);

      if (balance === 0) {
        return balance;
      }

      return Number(balance / LAMPORTS_PER_SOL).toFixed(2);
    },
    params,
  );
};

import {useQuery} from '@tanstack/react-query';
import {useWallet} from '@hooks/useWallet';
import {Transaction} from '@solana/web3.js';

export const useEsitmateGasFee = (
  enabled: boolean,
  transaction?: Transaction | null,
) => {
  const {web3} = useWallet();
  return useQuery<number | null>(
    ['blockhash'],
    async () => {
      if (!transaction) {
        return null;
      }
      const res = await web3.getLatestBlockhash('finalized');
      transaction.recentBlockhash = res.blockhash;
      const fee = await transaction.getEstimatedFee(web3);
      return fee;
    },
    {
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
      enabled: !!transaction && !!web3 && enabled,
    },
  );
};

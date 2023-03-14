import {useQuery} from '@tanstack/react-query';
import {useWallet} from './useWallet';

export const useTransactions = () => {
  const {web3, account} = useWallet();

  return useQuery(
    ['txs', account?.publicKey.toBase58()],
    async () => {
      if (!account) {
        return [];
      }
      const signatures = await web3.getSignaturesForAddress(
        account?.publicKey,
        {limit: 10},
      );

      const signaturesList = signatures.map(_signature => _signature.signature);
      const transactions = await web3.getParsedTransactions(
        signaturesList,
        'finalized',
      );
      return transactions;
    },
    {enabled: !!account},
  );
};

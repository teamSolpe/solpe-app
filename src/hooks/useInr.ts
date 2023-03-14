import {axios} from '@shared/axios';
import {useQuery} from '@tanstack/react-query';

export const useOracleInr = ({enabled}: {enabled: boolean}) => {
  return useQuery<{value: string}>(
    ['query', 'inr'],
    async () => {
      try {
        const res = await axios.get('/feed', {params: {pair: 'inr'}});
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    {enabled, refetchInterval: 10000},
  );
};

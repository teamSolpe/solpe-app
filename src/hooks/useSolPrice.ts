import {axios} from '@shared/axios';
import {useQuery} from '@tanstack/react-query';

export const useOracleSol = ({enabled}: {enabled: boolean}) => {
  return useQuery<{value: string}>(
    ['query', 'sol'],
    async () => {
      try {
        const res = await axios.get('/feed', {params: {pair: 'sol'}});
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    {enabled, refetchInterval: 10000},
  );
};

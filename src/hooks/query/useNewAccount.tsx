import {axios} from '@shared/axios';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export const useNewAccount = ({options}: {options?: UseQueryOptions<any>}) => {
  return useQuery<any, any, {seed: string; mnemonic: string}>(
    ['new', 'account'],
    async () => {
      try {
        const req = await axios.get('/new');
        return req.data;
      } catch (e: any) {
        console.log(e.message, 'error');
        throw new Error(e);
      }
    },
    {...options, staleTime: 50000},
  );
};

import {useMutation, useQuery} from '@tanstack/react-query';
import {axios} from '@shared/axios';

interface Params {
  from: string;
  to: string;
  amount: string | number;
}

export const usePayment = () => {
  return useMutation(
    ['payment', 'status'],
    async ({amount, from, to}: Params): Promise<{payment_id: string}> => {
      try {
        const req = await axios.post('/payment/init', {
          from: from,
          to: to,
          amount: amount,
        });

        return req.data;
      } catch (error) {
        throw error;
      }
    },
  );
};

export const useUpdatePaymentStatus = () => {
  return useMutation(
    ['payment', 'status'],
    async ({
      paymentId,
      status,
      txHash,
    }: {
      paymentId: string;
      status: string;
      txHash?: string;
    }): Promise<{payment_id: string}> => {
      try {
        const req = await axios.patch('/payment/status', {
          payment_id: paymentId,
          status: status,
          txHash: txHash,
        });

        return req.data;
      } catch (error) {
        console.log('error', paymentId, status);
        throw error;
      }
    },
  );
};

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  transaction_at: Date;
  status: string;
}

interface Props {
  enabled: boolean;
  payment_id: string;
}

export const usePaymentStatus = ({enabled, payment_id}: Props) => {
  return useQuery<Transaction>(
    ['/payment-status'],
    async () => {
      try {
        const res = await axios.get('/payment/status', {params: {payment_id}});
        return res.data;
      } catch (e) {
        console.log(e, e?.response, 'error');
        throw e;
      }
    },
    {
      enabled: enabled,
      refetchInterval: 1500,
      refetchIntervalInBackground: true,
    },
  );
};

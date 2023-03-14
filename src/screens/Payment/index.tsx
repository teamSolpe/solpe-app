import AnimatedLottieView from 'lottie-react-native';
import {MotiView, View} from 'moti';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, ToastAndroid} from 'react-native';
import {PaymentScreenProps} from 'src/types/navigation';
import {
  usePayment,
  usePaymentStatus,
  useUpdatePaymentStatus,
} from '@hooks/usePaymentStatus';
import {useWallet} from '@hooks/useWallet';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {DetailView} from '@components/DetailView';
import Icon from 'react-native-vector-icons/Feather';
import {ActivityIndicator, Button, MD3Colors} from 'react-native-paper';
import {trimHash} from '@shared/trimHash';
import {H1} from '@components/Heading';
import {useEsitmateGasFee} from '@hooks/useEsitmateGasFee';

enum STATUS {
  INIT = 'init',
  PROCESS = 'process',
  CRYPTO_DONE = 'crypto_done',
  FAIT_INIT = 'fait_init',
  FAIT_COMPLETE = 'fait_complete',
  COMPLETED = 'completed',
}

const getTxStatus = (step?: STATUS) => {
  switch (step) {
    case STATUS.INIT:
      return 'Initiating Transaction';
    case STATUS.PROCESS:
      return 'Processing';
    case STATUS.CRYPTO_DONE:
      return 'Received Crypto';
    case STATUS.FAIT_INIT:
      return 'Started Converting into Fait(INR)';
    case STATUS.FAIT_COMPLETE:
      return 'Currency Conversion is done';
    case STATUS.COMPLETED:
      return 'Transaction Completed';
    default:
      return 'Transaction in-progress';
  }
};

const TO = '8xsHGBvvV4EyBQf8VBbc2UuQcK4ziS4Z95345DGJwNew';
export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  route,
  navigation,
}) => {
  const params = route?.params;
  const {account, web3} = useWallet();

  const [step, setStep] = useState<STATUS>();
  const [paymentId, setPaymentId] = useState<string>('');
  const [txHash, setTxHash] = useState<string | null>();

  const sheetRef = useRef<BottomSheetModal | null>(null);
  const [solTransaction, setSolTransaction] = useState<Transaction | null>(
    null,
  );
  const [txLoading, setTxLoading] = useState(false);

  const {mutateAsync} = usePayment();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allowedStatus = useMemo(() => [STATUS.INIT, STATUS.PROCESS], []);
  const {data} = usePaymentStatus({
    enabled: !!step && step !== STATUS.INIT && !!paymentId,
    payment_id: paymentId,
  });

  const {mutateAsync: updatePaymentStatus} = useUpdatePaymentStatus();

  const {data: feeData} = useEsitmateGasFee(
    step === STATUS.PROCESS,
    solTransaction,
  );

  useEffect(() => {
    console.log(data, paymentId, 'hook');
    if (data) {
      console.log('inside');
      if (data.status === STATUS.COMPLETED) {
        console.log('completed');
        setTimeout(() => {
          navigation.replace('Home');
        }, 2000);
      }
      // if (!allowedStatus.includes(data.status as STATUS)) {
      //   console.log('not allowed state...');
      //   return;
      // }
      setStep(data.status as STATUS);
    }
  }, [allowedStatus, data, navigation, paymentId]);

  useEffect(() => {
    if (!params.amount || !account) {
      return;
    }

    if (step) {
      return;
    }
    mutateAsync({
      amount: params?.amount,
      from: account?.publicKey.toBase58(),
      to: TO,
    })
      .then(res => {
        setPaymentId(res.payment_id);
        setStep(STATUS.INIT);
      })
      .catch(e => console.log(e, 'mutate'));
  }, [params, mutateAsync, account, step]);

  useEffect(() => {
    if (!txHash) return;

    let interval: NodeJS.Timer;
    const getStatus = async () => {
      const status = await web3.getSignatureStatus(txHash);
      if (status.value?.confirmationStatus === 'finalized') {
        setStep(STATUS.CRYPTO_DONE);
        updatePaymentStatus({
          paymentId: paymentId,
          status: STATUS.CRYPTO_DONE as string,
        });
        setTxLoading(false);
        clearInterval(interval);
      }
    };

    getStatus();
    interval = setInterval(getStatus, 1000);
  }, [paymentId, txHash, updatePaymentStatus, web3]);

  useEffect(() => {
    if (!account || !params?.solAmount || !params?.sol || !params?.inr) {
      return;
    }
    if (step === STATUS.INIT) {
      const _transaction = new Transaction({feePayer: account?.publicKey});
      try {
        _transaction.add(
          SystemProgram.transfer({
            fromPubkey: account?.publicKey,
            toPubkey: new PublicKey(TO),
            lamports: Math.ceil(params?.solAmount * LAMPORTS_PER_SOL),
          }),
        );
      } catch (e) {
        ToastAndroid.show('Error', ToastAndroid.LONG);
        navigation.pop(1);
        return;
      }
      setSolTransaction(_transaction);
      setStep(STATUS.PROCESS);
      sheetRef.current?.present();
    }
    if (step === STATUS.CRYPTO_DONE) {
      sheetRef.current?.close();
    }
  }, [step, account, params, web3, navigation, feeData]);

  const fee = useMemo(() => {
    if (!feeData) return;
    const solFee = feeData / LAMPORTS_PER_SOL;
    const solUSD = solFee * Number.parseFloat(params?.sol ?? '1');
    return solUSD / Number.parseFloat(params?.inr ?? '1');
  }, [feeData, params?.inr, params?.sol]);

  const onPressConfirm = useCallback(() => {
    if (!account) {
      ToastAndroid.show(
        'No Account found, please clear cache',
        ToastAndroid.LONG,
      );
      navigation.pop(1);
      return;
    }
    if (!solTransaction) {
      ToastAndroid.show(
        'Error with the app, try after sometime',
        ToastAndroid.LONG,
      );
      navigation.pop(1);
      return;
    }

    setTxLoading(true);

    try {
      sendAndConfirmTransaction(web3, solTransaction, [account]).then(
        _txHash => {
          console.log(_txHash, 'hash');
          updatePaymentStatus({
            paymentId: paymentId,
            status: STATUS.PROCESS,
            txHash: _txHash,
          });
          setTxHash(_txHash);
        },
      );
    } catch (e) {
      // alert('Transaction failed, try again');
      ToastAndroid.show(
        'Transaction failed, please try again.',
        ToastAndroid.LONG,
      );
      setTxLoading(false);
      setTxHash(null);
    }
  }, [
    account,
    navigation,
    paymentId,
    solTransaction,
    updatePaymentStatus,
    web3,
  ]);

  const onPressCancel = useCallback(() => {
    sheetRef.current?.close();
    navigation.pop(2);
  }, [navigation]);

  return (
    <MotiView style={styles.container}>
      <AnimatedLottieView
        style={styles.loader}
        source={require('../../assets/loader.json')}
        autoPlay
        loop
      />

      <H1 style={{textAlign: 'center', marginTop: 20}}>{getTxStatus(step)}</H1>
      <BottomSheetModal ref={sheetRef} index={1} snapPoints={['25%', '50%']}>
        <View style={styles.detailsContainer}>
          <Icon name={'credit-card'} size={80} color={MD3Colors.primary0} />
          <DetailView
            label={'Estimated Transaction Fee(INR)'}
            value={fee?.toPrecision(4).toString() ?? <ActivityIndicator />}
          />
          <DetailView
            label={'Account'}
            value={trimHash(account?.publicKey.toBase58() ?? '')}
          />
          <DetailView
            label={'Amount(SOL)'}
            value={params?.solAmount?.toString() ?? ''}
          />
        </View>
        <View style={styles.actionContainer}>
          <Button
            onPress={onPressConfirm}
            style={styles.action}
            loading={txLoading}
            disabled={txLoading}
            mode={'contained'}>
            Confirm
          </Button>
          <Button
            onPress={onPressCancel}
            style={styles.action}
            disabled={txLoading}
            mode={'elevated'}>
            Cancel
          </Button>
        </View>
      </BottomSheetModal>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {height: '100%', paddingHorizontal: 20},
  loader: {
    height: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 40,
  },
  detailsContainer: {
    display: 'flex',
    padding: 20,
    borderWidth: 2,
    margin: 10,
    borderRadius: 14,
    height: '75%',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  action: {
    width: '48%',
    borderRadius: 10,
    // marginLeft: 5,
  },
});

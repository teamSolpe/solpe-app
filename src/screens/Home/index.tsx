import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HomeScreenProps} from 'src/types/navigation';
import {useWallet} from '@hooks/useWallet';
import {ActivityIndicator, Button} from 'react-native-paper';
import {Alert, AppState, StyleSheet, View} from 'react-native';
import {Word} from '@components/Word';
import Clipboard from '@react-native-clipboard/clipboard';
import {useStorage} from '@hooks/useStorage';
import {useNewAccount} from '@hooks/query/useNewAccount';

enum STEPS {
  CREATE = 'create',
  IMPORT = 'import',
  CHOOSE = 'choose',
  COMPLETE = 'complete',
}

export const Home: React.FC<HomeScreenProps> = () => {
  const {createAccount, walletStatus} = useWallet();
  const {insert, storage} = useStorage();
  const [step, setStep] = useState<STEPS>(STEPS.CHOOSE);
  // const [mnemonic, setMnemonic] = useState('');
  // const [seed, setSeed] = useState('');

  const {data, isLoading, isError, error} = useNewAccount({
    options: {
      enabled: AppState.currentState === 'active' && step === STEPS.CREATE,
    },
  });

  const onCopy = () => {
    Clipboard.setString(data?.mnemonic ?? '');
    Alert.alert('Info', 'Seed pharase is copied to clipboard');
  };

  useEffect(() => {
    console.log('hello', isError, error);
  }, [isError, error]);

  const onComplete = () => {
    Alert.prompt(
      'Warning',
      "Have you copied the seed phrase somewhere safe? Type 'Yes' if you do",
      text => {
        if (text.toLowerCase() === 'yes') {
          setStep(STEPS.COMPLETE);
        }
      },
    );
  };

  return (
    <SafeAreaView>
      {walletStatus === 'connecting' && <ActivityIndicator />}
      {walletStatus === 'fresh' && (
        <>
          {step === STEPS.CHOOSE && (
            <View style={styles.container}>
              <Button
                style={styles.create}
                mode="contained-tonal"
                onPress={() => setStep(STEPS.CREATE)}>
                Create Wallet
              </Button>
              <Button
                mode="contained"
                onPress={() => console.log('Importing account!')}>
                Import Wallet
              </Button>
            </View>
          )}
          {step === STEPS.CREATE && (
            <View style={styles.container}>
              <View style={styles.mnemonic}>
                {data?.mnemonic ? (
                  data?.mnemonic?.split(' ').map(word => {
                    return <Word key={word} word={word} />;
                  })
                ) : (
                  <ActivityIndicator />
                )}

                <Button
                  mode="contained"
                  dark={true}
                  uppercase
                  onPress={onCopy}
                  style={styles.copy}>
                  Copy
                </Button>
              </View>
              <Button onPress={onComplete} mode="outlined">
                Complete
              </Button>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    justifyContent: 'center',
    height: '100%',
  },
  create: {
    marginBottom: 10,
  },
  mnemonic: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: 50,
  },
  copy: {
    marginTop: 20,
    width: 200,
  },
});

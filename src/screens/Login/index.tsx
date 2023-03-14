import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LoginScreenProps} from 'src/types/navigation';
import {useWallet} from '@hooks/useWallet';
import {ActivityIndicator, Button, Text, TextInput} from 'react-native-paper';
import {Alert, AppState, Platform, StyleSheet, View} from 'react-native';
import {Word} from '@components/Word';
import Clipboard from '@react-native-clipboard/clipboard';
import {useStorage} from '@hooks/useStorage';
import {useNewAccount} from '@hooks/query/useNewAccount';
import {Keypair} from '@solana/web3.js';
import {Buffer} from 'buffer';
import {LOGIN_STATUS, PRIVATE_KEY, SEED_PHARASE} from '@shared/const';
import {encode, decode} from 'bs58';

enum STEPS {
  CREATE = 'create',
  IMPORT = 'import',
  CHOOSE = 'choose',
  COMPLETE = 'complete',
}

export const Login: React.FC<LoginScreenProps> = ({navigation}) => {
  const {web3, walletStatus, account, setAccount} = useWallet();
  const {insert} = useStorage();
  const [step, setStep] = useState<STEPS>(STEPS.CHOOSE);
  const [secretKey, setSecretKey] = useState<string>('');

  const {data, isLoading} = useNewAccount({
    options: {
      enabled: AppState.currentState === 'active' && step === STEPS.CREATE,
    },
  });

  useEffect(() => {
    if (step === STEPS.COMPLETE && !!data) {
      const {seed, mnemonic} = data;
      const seedBuffer = Uint8Array.from(Buffer.from(seed, 'hex'));
      const _keypair = Keypair.fromSeed(seedBuffer.subarray(0, 32));

      const private_key = encode(_keypair.secretKey);
      insert(SEED_PHARASE, mnemonic);
      insert(LOGIN_STATUS, true);
      insert(PRIVATE_KEY, private_key);

      setAccount(_keypair);
      navigation.replace('Home');
    }

    if (step === STEPS.COMPLETE && secretKey) {
      const secretBuffer = decode(secretKey);
      const _keypair = Keypair.fromSecretKey(secretBuffer);

      insert(PRIVATE_KEY, secretKey);
      insert(LOGIN_STATUS, true);

      setAccount(_keypair);
      navigation.replace('Home');
    }

    if (account) {
      navigation.replace('Home');
    }
  }, [step, data, web3, insert, account, setAccount, navigation, secretKey]);

  const onCopy = () => {
    Clipboard.setString(data?.mnemonic ?? '');
    Alert.alert('Info', 'Seed pharase is copied to clipboard');
  };

  const onComplete = () => {
    Platform.OS === 'ios'
      ? Alert.prompt(
          'Warning',
          "Have you copied the seed phrase somewhere safe? Type 'Yes' if you do",
          text => {
            if (text.toLowerCase() === 'yes') {
              setStep(STEPS.COMPLETE);
            }
          },
        )
      : Alert.alert(
          'Copied?',
          "Have you copied the seed phrase somewhere safe? Tap 'Yes' if you do",
          [
            {
              text: 'Yes',
              isPreferred: true,
              onPress() {
                setStep(STEPS.COMPLETE);
              },
            },
          ],
          {cancelable: false},
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
              <Button mode="contained" onPress={() => setStep(STEPS.IMPORT)}>
                Import Wallet
              </Button>
            </View>
          )}
          {step === STEPS.CREATE && (
            <View style={styles.container}>
              <View style={styles.mnemonic}>
                {isLoading && <ActivityIndicator />}
                {!isLoading &&
                  data?.mnemonic &&
                  data?.mnemonic?.split(' ').map(word => {
                    return <Word key={word} word={word} />;
                  })}

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
          {step === STEPS.IMPORT && (
            <View style={styles.container}>
              <TextInput
                numberOfLines={3}
                multiline={true}
                placeholder="Enter Private Key"
                onChangeText={e => setSecretKey(e)}
              />

              <Button
                onPress={() => setStep(STEPS.COMPLETE)}
                style={{marginTop: 20}}
                mode="contained-tonal">
                Import
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

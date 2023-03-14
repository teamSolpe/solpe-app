import React, {useEffect, useState} from 'react';
// import {H3} from '@components/Heading';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, View} from 'react-native';
import {H3} from '@components/Heading';
import {ActivityIndicator} from 'react-native-paper';
import {SplashScreenProps} from 'src/types/navigation';
import {useWallet} from '@hooks/useWallet';

export const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const [show, setShow] = useState(true);

  const {account} = useWallet();
  useEffect(() => {
    const hideSplash = () => {
      setShow(false);
      if (account) {
        navigation.replace('Home');
      }
      navigation.replace('Login');
    };

    setTimeout(() => {
      hideSplash();
    }, 2000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.splashCenter}>
        <H3>Hello</H3>
        {show && <ActivityIndicator style={{...styles.loader}} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  splashCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  loader: {
    marginTop: 10,
  },
});

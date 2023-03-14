import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Keypair} from '@solana/web3.js';

type MainStackNavigatorProps = {
  Home: undefined;
  SplashScreen: undefined;
  Login: undefined;
  Payment: PaymentProps;
};

interface PaymentProps {
  account?: Keypair | null;
  amount?: string | null;
  solAmount?: number | null;
  usdAmount?: number | null;
  upiParams: Record<string, any> | null;
  inr?: string;
  sol?: string;
}

type BottomNavigatorProps = {
  Scan: undefined;
  Main: undefined;
  Main1: undefined;
  Payment: PaymentProps;
};

declare type SplashScreenProps = NativeStackScreenProps<
  MainStackNavigatorProps,
  'SplashScreen'
>;

declare type HomeScreenProps = NativeStackScreenProps<
  MainStackNavigatorProps,
  'Home'
>;

declare type QRScreenProps = BottomTabScreenProps<BottomNavigatorProps, 'Scan'>;
declare type PaymentScreenProps = NativeStackScreenProps<
  MainStackNavigatorProps,
  'Payment'
>;

declare type LoginScreenProps = NativeStackScreenProps<
  MainStackNavigatorProps,
  'Login'
>;

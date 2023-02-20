import {NativeStackScreenProps} from '@react-navigation/native-stack';

type MainStackNavigatorProps = {Home: undefined; SplashScreen: undefined};

declare type SplashScreenProps = NativeStackScreenProps<
  MainStackNavigatorProps,
  'SplashScreen'
>;

declare type HomeScreenProps = NativeStackScreenProps<
  MainStackNavigatorProps,
  'Home'
>;

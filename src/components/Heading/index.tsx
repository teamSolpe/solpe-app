import Clipboard from '@react-native-clipboard/clipboard';
import React, {PropsWithChildren} from 'react';
import {Text, TextProps} from 'react-native-paper';
import {Platform, ToastAndroid} from 'react-native';

interface HeadingProps extends PropsWithChildren {
  copy?: boolean;
  style?: TextProps['style'];
}

const H1: React.FC<HeadingProps> = ({children, copy, style}) => {
  const onCopy = async () => {
    if (typeof children === 'string' && copy) {
      Clipboard.setString(children);
      Platform.OS === 'android' &&
        ToastAndroid.show('Copied to clipboard', ToastAndroid.LONG);
    }
  };
  return (
    <Text onPress={onCopy} style={style} variant="headlineLarge">
      {children}
    </Text>
  );
};

const H2: React.FC<HeadingProps> = ({children, copy, style}) => {
  const onCopy = async () => {
    if (typeof children === 'string' && copy) {
      Clipboard.setString(children);
      Platform.OS === 'android' &&
        ToastAndroid.show('Copied to clipboard', ToastAndroid.LONG);
    }
  };
  return (
    <Text onPress={onCopy} style={style} variant="headlineMedium">
      {children}
    </Text>
  );
};

const H3: React.FC<HeadingProps> = ({children, copy, style}) => {
  const onCopy = async () => {
    if (typeof children === 'string' && copy) {
      Clipboard.setString(children);
      Platform.OS === 'android' &&
        ToastAndroid.show('Copied to clipboard', ToastAndroid.LONG);
    }
  };
  return (
    <Text onPress={onCopy} style={style} variant="headlineSmall">
      {children}
    </Text>
  );
};

export {H1, H2, H3};

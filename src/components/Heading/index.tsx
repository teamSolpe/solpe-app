import React, {PropsWithChildren} from 'react';
import {Text} from 'react-native-paper';

const H1: React.FC<PropsWithChildren> = ({children}) => {
  return <Text variant="displayLarge">{children}</Text>;
};

const H2: React.FC<PropsWithChildren> = ({children}) => {
  return <Text variant="displayMedium">{children}</Text>;
};

const H3: React.FC<PropsWithChildren> = ({children}) => {
  return <Text variant="displaySmall">{children}</Text>;
};

export {H1, H2, H3};

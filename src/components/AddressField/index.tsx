/* eslint-disable react/no-unstable-nested-components */
import {useBalance} from '@hooks/useBalance';
import React from 'react';
import {Button, MD3Colors, Text} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Clipboard from '@react-native-clipboard/clipboard';
import {MotiPressable} from 'moti/interactions';

interface Props {
  address: string;
  showBalance?: boolean;
}

export const AddressField = ({address, showBalance = true}: Props) => {
  const addressToShow =
    address?.slice(0, 4) +
    '...' +
    address?.substring(address?.length - 4, address?.length);

  const {data: balance} = useBalance({
    address,
    params: {enabled: !!address && showBalance},
    precision: 5,
  });

  const onPress = () => {
    Clipboard.setString(address);
  };
  return (
    <MotiPressable
      animate={({pressed}) => {
        'worklet';
        return {
          scale: pressed ? 1.05 : 1,
        };
      }}
      onPress={onPress}
      style={styles.container}>
      <Button icon={() => <Icon name="clipboard" size={16} />}>
        <Text style={styles.address}>{addressToShow}</Text>
      </Button>
      {showBalance && <Text style={styles.address}>{balance} SOL</Text>}
    </MotiPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: MD3Colors.primary80,
    color: 'white',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingVertical: 5,
    marginTop: 12,
  },
  address: {
    color: MD3Colors.primary0,
    fontSize: 18,
  },
});

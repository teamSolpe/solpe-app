import React from 'react';
import {View} from 'moti';
import {Text} from 'react-native-paper';
import {StyleSheet} from 'react-native';

interface Props {
  from: string;
  to: string;
  amount: string;
  fee: string;
}

const Row = ({label, value}: {label: string; value: string}) => {
  return (
    <View style={styles.row}>
      <Text style={styles.font}>{label}</Text>
      <Text style={styles.font}>{value}</Text>
    </View>
  );
};

export const TransactionBox = ({from, to, amount, fee}: Props) => {
  return (
    <View style={styles.container}>
      <Row label={'From: '} value={from} />
      <Row label={'To: '} value={to} />
      <Row label={'Gas Spent: '} value={fee} />
      <Row label={'Transaction Amount:'} value={amount} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    width: 250,
  },
  font: {
    fontSize: 22,
  },
  container: {borderWidth: 2, padding: 25, marginRight: 12, borderRadius: 12},
});

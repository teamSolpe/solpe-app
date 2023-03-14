import {H3} from '@components/Heading';
import {trimHash} from '@shared/trimHash';
import {motify, View} from 'moti';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

// const MotiText = motify(Text);

export const PayCard = ({
  label,
  value,
  trim = false,
}: {
  label: string;
  value: string;
  trim?: boolean;
}) => {
  return (
    <View style={styles.card}>
      <H3>{label}</H3>
      <Text>{trim ? trimHash(value) : value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: 8,
  },
});

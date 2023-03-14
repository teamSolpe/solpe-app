import React from 'react';
import {View} from 'moti';
import {H3} from '@components/Heading';
import {Text} from 'react-native-paper';
import {StyleSheet} from 'react-native';

interface Props {
  label: string;
  value: React.ReactNode;
}

export const DetailView = ({label, value}: Props) => {
  return (
    <View style={styles.container}>
      <H3>{label}</H3>
      <Text style={styles.font}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 2,
    width: '100%',
  },
  font: {
    fontSize: 18,
  },
});

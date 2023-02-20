import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Text} from 'react-native-paper';

interface Props {
  word: string;
}

const wordWidth = Number(Dimensions.get('screen').width / 4.5);

export const Word = ({word}: Props) => {
  return (
    <View style={styles.wordContainer}>
      <Text style={styles.word}>{word}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wordContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    width: wordWidth,
    marginBottom: 5,
    marginRight: 5,
  },
  word: {
    fontWeight: '700',
    textAlign: 'center',
  },
});

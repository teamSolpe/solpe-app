import {AddressField} from '@components/AddressField';
import {H3} from '@components/Heading';
import {useWallet} from '@hooks/useWallet';
import {MotiView} from 'moti';
import React, {useCallback, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {ActivityIndicator, IconButton, MD3Colors} from 'react-native-paper';
import {FlatList} from 'react-native-gesture-handler';
import {useTransactions} from '@hooks/useTransactions';
import {TransactionBox} from '@components/Transaction';
import {LAMPORTS_PER_SOL} from '@solana/web3.js';
import {trimHash} from '@shared/trimHash';

export const Home = () => {
  const {account} = useWallet();
  const {data: transactions, isLoading} = useTransactions();
  const scrollRef = useRef<FlatList | null>(null);
  const initialIndex = useRef(0);

  const onPressIcon = useCallback(
    (type: 'inc' | 'dec') => {
      if (initialIndex.current + 1 >= 5 && type === 'inc') return;

      if (initialIndex.current - 1 < 0 && type === 'dec') return;

      if (type === 'inc') {
        initialIndex.current += 1;
      } else {
        initialIndex.current -= 1;
      }
      scrollRef.current?.scrollToIndex({index: initialIndex.current});
    },
    [scrollRef, initialIndex],
  );

  return (
    <MotiView>
      <AddressField address={account?.publicKey?.toBase58() ?? ''} />
      <MotiView style={styles.transactionContainer}>
        <View id="Transactions" style={styles.transactionNavigation}>
          <H3>Recent Transactions</H3>
          <View style={styles.navigationButtons}>
            <IconButton
              style={styles.icon}
              animated
              onPress={() => onPressIcon('dec')}
              icon={() => (
                <Icon
                  color={MD3Colors.primary0}
                  name="chevron-left"
                  size={25}
                />
              )}
            />
            <IconButton
              style={styles.icon}
              animated
              onPress={() => onPressIcon('inc')}
              icon={() => (
                <Icon
                  color={MD3Colors.primary0}
                  name="chevron-right"
                  size={25}
                />
              )}
            />
          </View>
        </View>
        {isLoading && <ActivityIndicator />}
        {!isLoading && transactions && (
          <FlatList
            data={transactions}
            scrollEnabled
            horizontal={true}
            persistentScrollbar
            ref={scrollRef}
            // onScroll={e => console.log(e)}
            // contentContainerStyle={{width: '100%'}}
            renderItem={({item, index}) => {
              if (index >= 5) return null;
              const [from, to] = item?.transaction.message.accountKeys ?? [];
              const amount =
                ((item?.meta?.postBalances[0] ?? 0) -
                  (item?.meta?.preBalances[0] ?? 0)) /
                LAMPORTS_PER_SOL;
              const fee = (item?.meta?.fee ?? 0) / LAMPORTS_PER_SOL;

              if (!from || !from.writable || !to || !to.writable) {
                return null;
              }

              return (
                <TransactionBox
                  from={trimHash(from.pubkey.toBase58() ?? '')}
                  to={trimHash(to.pubkey.toBase58() ?? '')}
                  amount={Math.abs(amount).toString()}
                  fee={fee.toString()}
                />
              );
            }}
          />
        )}
      </MotiView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  transactionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  transactionNavigation: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  navigationButtons: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  icon: {
    padding: 1,
    borderRadius: 2,
    borderColor: 'black',
    borderWidth: 2,
  },
});

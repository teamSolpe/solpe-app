import {useWallet} from '@hooks/useWallet';
import {encode} from 'bs58';
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {AddressField} from '@components/AddressField';
import {H1, H2} from '@components/Heading';

export const Settings = () => {
  const {account} = useWallet();
  const privateKey = encode(account?.secretKey ?? []);

  return (
    <View>
      <H1 style={{textAlign: 'center', marginVertical: 12}}>You're Home</H1>
      <AddressField address={account?.publicKey.toBase58() ?? ''} />
      <View style={styles.menu}>
        <Pressable style={styles.menuItem}>
          <H2>Export Privatekey</H2>
        </Pressable>
        <Pressable style={styles.menuItem}>
          <H2>My Transactions</H2>
        </Pressable>
        <Pressable style={styles.menuItem}>
          <H2>Logout & Clear</H2>
        </Pressable>
        <Pressable style={styles.menuItem}>
          <H2>Terms & Conditions</H2>
        </Pressable>
        <Pressable style={styles.menuItem}>
          <H2>Contact US</H2>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    padding: 18,
    // borderWidth: 2,
    borderRadius: 8,
    margin: 15,
    marginTop: 20,
    // borderColor: MD3Colors.primary70,
  },
  menuItem: {
    marginVertical: 10,
    borderBottomWidth: 2,
    padding: 5,
  },
});

import React from 'react';
import {MMKV} from 'react-native-mmkv';

interface StorageContext {
  storage: MMKV;
  has: (key: string) => boolean;
  insert: (key: string, value: string | number | boolean) => void;
  getString: (key: string) => string | undefined;
  getBoolean: (key: string) => boolean | undefined;
  getNumber: (key: string) => number | undefined;
}

export const storageContext = React.createContext<StorageContext | null>(null);

const storage = new MMKV();

export const StorageProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const has = (key: string) => {
    return storage.contains(key);
  };

  const insert = (key: string, value: string | number | boolean) => {
    storage.set(key, value);
  };

  const getString = (key: string) => {
    return storage.getString(key);
  };

  const getBoolean = (key: string) => {
    return storage.getBoolean(key);
  };

  const getNumber = (key: string) => {
    return storage.getNumber(key);
  };

  const value = {has, insert, getString, getBoolean, getNumber, storage};
  return (
    <storageContext.Provider value={value}>{children}</storageContext.Provider>
  );
};

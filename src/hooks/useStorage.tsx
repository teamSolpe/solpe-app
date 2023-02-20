import {storageContext} from '@context/storage';
import {useContext} from 'react';

export const useStorage = () => {
  const context = useContext(storageContext);

  if (!context) {
    throw new Error('Please wrap the context with StorageProvider');
  }
  return context;
};

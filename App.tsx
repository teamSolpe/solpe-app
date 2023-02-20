/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {StorageProvider} from '@context/storage';
import {WalletProvider} from '@context/walletContext';
import {MainNavigator} from '@navigation/index';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React from 'react';
import {Provider as PaperProvider, configureFonts} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Platform.select({default: "'Ubuntu', sans-serif;"});
const client = new QueryClient();
function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={client}>
        <StorageProvider>
          <WalletProvider>
            <PaperProvider
              theme={{fonts: configureFonts({config: {fontFamily: 'Ubuntu'}})}}>
              <MainNavigator />
            </PaperProvider>
          </WalletProvider>
        </StorageProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;

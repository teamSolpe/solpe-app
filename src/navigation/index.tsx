import React from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SplashScreen } from '@screens/Splash';
import { Login } from '@screens/Login';
import { MainStackNavigatorProps } from 'src/types/navigation';
import { TabNavigator } from './tab';
import { PaymentScreen } from '@screens/Payment';

const Stack = createNativeStackNavigator<MainStackNavigatorProps>();

export const MainNavigator = () => {
  const { dark } = useTheme();
  return (
    <NavigationContainer>
      <StatusBar barStyle={dark ? 'dark-content' : 'light-content'} />
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          options={{ headerShown: false }}
          component={SplashScreen}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

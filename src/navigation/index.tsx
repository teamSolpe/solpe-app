import React from 'react';
import {StatusBar} from 'react-native';
import {useTheme} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {SplashScreen} from '@screens/Splash';
import {Home} from '@screens/Home';
import {MainStackNavigatorProps} from 'src/types/navigation';

const Stack = createNativeStackNavigator<MainStackNavigatorProps>();

export const MainNavigator = () => {
  const {dark} = useTheme();
  return (
    <NavigationContainer>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          options={{headerShown: false}}
          component={SplashScreen}
        />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

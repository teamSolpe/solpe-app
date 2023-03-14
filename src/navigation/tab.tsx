import {Home} from '@screens/Home';
import React from 'react';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {MD3Colors, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Pressable, StyleSheet, View} from 'react-native';
import {QRScanner} from '@screens/QRScanner';
import {Settings} from '@screens/Settings';
import {BottomNavigatorProps} from 'src/types/navigation';

const tabs = createBottomTabNavigator<BottomNavigatorProps>();

const IconNames: {[key: string]: string} = {
  Main: 'home',
  Main1: 'settings',
  Scan: 'line-scan',
};

const TabBar = (props: BottomTabBarProps) => {
  return (
    <View style={styles.tabBar}>
      {props.state.routes.map((route, index) => {
        return (
          <Pressable
            onPress={() => {
              props.navigation.navigate(route.name);
            }}
            style={styles.tab}
            key={route.key}>
            {/* <MotiText style={{flexDirection: 'column', display: 'flex'}}> */}
            <Icon
              color={
                props.state.index === index
                  ? MD3Colors.error20
                  : MD3Colors.primary10
              }
              size={30}
              name={IconNames[route.name]}
            />
            <Text style={{fontSize: 14}}>{route.name}</Text>
            {/* </MotiText> */}
          </Pressable>
        );
      })}
    </View>
  );
};
export const TabNavigator = () => {
  return (
    <tabs.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Main"
      tabBar={TabBar}>
      <tabs.Screen name="Main" component={Home} />
      <tabs.Screen name="Scan" component={QRScanner} />
      <tabs.Screen name="Main1" component={Settings} />
    </tabs.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    minHeight: 60,
    padding: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: -2},
    elevation: 2,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  tab: {
    alignItems: 'center',
  },
});

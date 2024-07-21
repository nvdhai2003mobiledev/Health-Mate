import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import PracticeScreen from '../screens/PracticeScreen';
import SpiritScreen from '../screens/SpiritScreen';
import {
  Home2,
  LocationDiscover,
  Lovely,
  Profile2User,
  ProfileCircle
} from 'iconsax-react-native';
import ProfileScreen from '../screens/ProfileScreen';
import Color from '../style/Color';
import FriendScreen from '../screens/FriendScreen';

const Tabs = createBottomTabNavigator();
const BottomNavigation = () => {
  return (
    <Tabs.Navigator
    initialRouteName='Home'
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let IconComponent;
          let color = focused ? Color.primaryColor : '#ADADAF';
          let variant = 'Bold';

          if (route.name === 'Home') {
            IconComponent = Home2;
          } else if (route.name === 'Practice') {
            IconComponent = LocationDiscover;
          } else if (route.name == 'Friend') {
            IconComponent = Profile2User;
          } else if (route.name == 'Spirit') {
            IconComponent = Lovely;
          } else if (route.name == 'Profile') {
            IconComponent = ProfileCircle;
          }

          return <IconComponent variant={variant} size={28} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          border: 'none',
        },
        headerShown: false,
      })}>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Practice" component={PracticeScreen} />
      <Tabs.Screen name="Friend" component={FriendScreen} />
      <Tabs.Screen name="Spirit" component={SpiritScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
};

export default BottomNavigation;

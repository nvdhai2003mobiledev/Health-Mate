import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CustomStatusBar from '../components/CustomStatusBar';
import BottomNavigation from './BottomNavigation';
import AddSpiritScreen from '../screens/AddSpiritScreen';
import {Provider} from 'react-redux';

import EditSpiritScreen from '../screens/EditSpiritScreen';
import UpdateProfile from '../screens/UpdateProfile';
import ProfileScreen from '../screens/ProfileScreen';
import store from '../redux/store/store';

const MainStack = createNativeStackNavigator();

const MainNavigation = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <CustomStatusBar barStyle="dark-content" />
        <MainStack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{headerShown: false}}>
          <MainStack.Screen name="SplashScreen" component={SplashScreen} />
          <MainStack.Screen name="LoginScreen" component={LoginScreen} />
          <MainStack.Screen name="RegisterScreen" component={RegisterScreen} />
          <MainStack.Screen name="BottomTab" component={BottomNavigation} />
          <MainStack.Screen
            name="AddSpiritScreen"
            component={AddSpiritScreen}
            options={{
              animation: 'fade_from_bottom',
            }}
          />
          <MainStack.Screen
            name="EditSpiritScreen"
            component={EditSpiritScreen}
            options={{
              animation: 'fade_from_bottom',
            }}
          />
          <MainStack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
              animation: 'fade_from_bottom',
            }}
          />
          <MainStack.Screen
            name="UpdateProfile"
            component={UpdateProfile}
            options={{
              animation: 'fade_from_bottom',
            }}
          />
        </MainStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default MainNavigation;

import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CustomStatusBar from '../components/CustomStatusBar';

const MainStack = createNativeStackNavigator();

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <CustomStatusBar barStyle='dark-content' />
      <MainStack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown: false}}>
        <MainStack.Screen name="SplashScreen" component={SplashScreen} />
        <MainStack.Screen name="LoginScreen" component={LoginScreen} />
        <MainStack.Screen name="RegisterScreen" component={RegisterScreen} />
        <MainStack.Screen name="HomeScreen" component={HomeScreen} />
      </MainStack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigation
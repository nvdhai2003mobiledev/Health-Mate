import {
  Image,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect } from 'react';


const SplashScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('LoginScreen');
    }, 2000);
  }, []);
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

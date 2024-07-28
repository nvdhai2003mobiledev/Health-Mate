// File path: src/screens/LoginScreen.js

import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Color from '../style/Color';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const auth = FIREBASE_AUTH;

  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    return '';
  };

  const handleEmailChange = (email) => {
    setEmail(email);
    const emailError = validateEmail(email);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: emailError,
    }));
  };

  const handlePasswordChange = (password) => {
    setPassword(password);
    const passwordError = validatePassword(password);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: passwordError,
    }));
  };

  const signIn = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      Alert.alert('Please correct the highlighted errors');
      return;
    }

    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Login successful');
      navigation.navigate('BottomTab', { user });
    } catch (error) {
      console.log(error);
      Alert.alert('Email or password is incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ marginTop: 85, marginHorizontal: 30 }}>
        <Text style={styles.title}>Welcome to Health Mate</Text>
        <Text style={[styles.hint, { marginTop: -8 }]}>
          Hello there, sign in to {'\n'}
          continue!
        </Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Enter your email"
          placeholderTextColor={Color.hintColor}
          value={email}
          autoCapitalize="none"
          onChangeText={handleEmailChange}
          keyboardType="email-address"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Enter your password"
          placeholderTextColor={Color.hintColor}
          value={password}
          autoCapitalize="none"
          onChangeText={handlePasswordChange}
          secureTextEntry={true}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {loading && (
          <ActivityIndicator size="large" color="#000" style={styles.loading} />
        )}
        <Pressable style={styles.button} onPress={signIn}>
          <Text style={styles.textButton}>Login</Text>
        </Pressable>
      </View>
      <Text
        style={[
          styles.hint,
          {
            fontSize: 17,
            textAlign: 'center',
            color: Color.textColor,
            fontFamily: 'SF-Pro-Rounded-Medium',
          },
        ]}>
        Or Continue With
      </Text>
      <View
        style={[
          styles.button,
          {
            flexDirection: 'row',
            backgroundColor: Color.inputBG,
            borderColor: Color.textColor,
            borderWidth: 1,
            marginHorizontal: 30,
          },
        ]}>
        <Image
          source={require('../assets/images/google.png')}
          style={styles.img}
        />
        <Text
          style={[
            styles.textButton,
            { fontFamily: 'SF-Pro-Rounded-Semibold', color: 'black' },
          ]}>
          Continue With Google
        </Text>
      </View>
      <View style={{ marginTop: 50 }}>
        <Text
          style={[
            styles.hint,
            {
              color: Color.textColor,
              textAlign: 'center',
              fontFamily: 'SF-Pro-Rounded-Medium',
              fontSize: 17,
            },
          ]}>
          Don't have an account?{' '}
          <Text
            style={{
              color: Color.primaryColor,
              fontFamily: 'SF-Pro-Rounded-Semibold',
            }}
            onPress={() => navigation.navigate('RegisterScreen')}>
            Sign Up
          </Text>
        </Text>
      </View>
      <Text
        style={[
          styles.hint,
          {
            fontSize: 17,
            textAlign: 'center',
            color: Color.primaryColor,
            fontFamily: 'SF-Pro-Rounded-Semibold',
            marginTop: 10,
          },
        ]}>
        Forgot Password?
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  loading: {
    marginTop: 20,
  },
  title: {
    fontFamily: 'SF-Pro-Rounded-Bold',
    fontSize: 26,
    color: Color.textColor,
  },
  hint: {
    fontFamily: 'SF-Pro-Rounded-Regular',
    fontSize: 18,
    color: Color.hintColor,
  },
  form: {
    marginHorizontal: 30,
    marginTop: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: Color.textColor,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'SF-Pro-Rounded-Regular',
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: Color.inputBG,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: -5,
  },
  button: {
    backgroundColor: Color.primaryColor,
    borderRadius: 10,
    marginVertical: 30,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    color: 'white',
    fontFamily: 'SF-Pro-Rounded-Semibold',
    fontSize: 17,
  },
  img: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginEnd: 16,
    marginStart: -16,
  },
});

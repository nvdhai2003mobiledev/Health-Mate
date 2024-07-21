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
import React, {useState} from 'react';
import Color from '../style/Color';
import {ArrowLeft} from 'iconsax-react-native';
import {FIREBASE_AUTH, FIREBASE_DB} from '../../FirebaseConfig';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


const RegisterScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const validateForm = () => {
    if (!email.trim() ||!password.trim() ||!name.trim()) {
      Alert.alert('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Password must be at least 8 characters long');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Invalid email address');
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    } else if (!/[a-z]/.test(password)) {
      Alert.alert("Error", "Password must contain at least one lowercase letter");
      return;
    } else if (!/[A-Z]/.test(password)) {
      Alert.alert("Error", "Password must contain at least one uppercase letter");
      return;
    } else if (!/\d/.test(password)) {
      Alert.alert("Error", "Password must contain at least one number");
      return;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      Alert.alert("Error", "Password must contain at least one special character");
      return;
    }
    return true;
  }
  const signUp = async () => {
    setLoading(true);
    try {
      if (!validateForm()) return;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
      });
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ArrowLeft
        color="black"
        size={28}
        variant="Linear"
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      />
      <View style={{marginTop: 30, marginHorizontal: 30}}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={[styles.hint, {marginTop: -8}]}>
          Please enter your credentials to {'\n'}
          proceed
        </Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={Color.hintColor}
          value={email}
          autoCapitalize="none"
          onChangeText={text => setEmail(text)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor={Color.hintColor}
          value={name}
          autoCapitalize="none"
          onChangeText={text => setName(text)}
          keyboardType="default"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor={Color.hintColor}
          value={password}
          autoCapitalize="none"
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
        />
        {loading && (
          <ActivityIndicator size="large" color="#000" style={styles.loading} />
        )}
        <Pressable style={styles.button} onPress={signUp}>
          <Text style={styles.textButton}>Create Account</Text>
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
            {fontFamily: 'SF-Pro-Rounded-Semibold', color: 'black'},
          ]}>
          Continue With Google
        </Text>
      </View>
      <View style={{marginTop: 25}}>
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
          Already have an account?{' '}
          <Text
            style={{
              color: Color.primaryColor,
              fontFamily: 'SF-Pro-Rounded-Semibold',
            }}
            onPress={() => navigation.goBack()}
            >
            Login!
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  loading: {
    marginTop: 20,
  },
  backIcon: {
    marginHorizontal: 24,
    marginTop: 50,
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

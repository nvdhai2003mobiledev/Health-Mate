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

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      return 'Password is required';
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be more than 6 characters and contain uppercase letters, lowercase letters, numbers, and special characters';
    }
    return '';
  };

  const validateName = (name) => {
    if (!name.trim()) {
      return 'Name is required';
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

  const handleNameChange = (name) => {
    setName(name);
    const nameError = validateName(name);
    setErrors((prevErrors) => ({
      ...prevErrors,
      name: nameError,
    }));
  };

  const signUp = async () => {
    setLoading(true);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nameError = validateName(name);

    setErrors({
      email: emailError,
      password: passwordError,
      name: nameError,
    });
    try {
      if (emailError && passwordError && nameError) return;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
      });
      Alert.alert('Success', 'Registration successful');
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
          placeholder='Enter your email'
          style={[styles.input, errors.email && styles.inputError]}
          placeholderTextColor={Color.hintColor}
          value={email}
          autoCapitalize="none"
          onChangeText={handleEmailChange}
          keyboardType="email-address"
        />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Enter your name"
          placeholderTextColor={Color.hintColor}
          value={name}
          autoCapitalize="none"
          onChangeText={handleNameChange}
          keyboardType="default"
        />
         {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
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
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: -5,
    fontFamily: 'SF-Pro-Rounded-Medium',
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

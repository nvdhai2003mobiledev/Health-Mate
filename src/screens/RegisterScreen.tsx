import {
  ActivityIndicator,
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
import {FIREBASE_AUTH} from '../../FirebaseConfig';
import {createUserWithEmailAndPassword} from 'firebase/auth';

const RegisterScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
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
            {fontFamily: 'SF-Pro-Rounded-SemiBold', paddingVertical: 4},
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
              fontFamily: 'SF-Pro-Rounded-Bold',
            }}>
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
    borderRadius: 4,
    marginVertical: 8,
    backgroundColor: Color.inputBG,
  },
  button: {
    backgroundColor: Color.primaryColor,
    borderRadius: 4,
    marginVertical: 30,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    color: 'black',
    fontFamily: 'SF-Pro-Rounded-Bold',
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

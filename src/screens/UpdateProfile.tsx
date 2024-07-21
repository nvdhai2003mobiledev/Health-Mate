import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeft } from 'iconsax-react-native';
import Color from '../style/Color';
import { useFocusEffect } from '@react-navigation/native';

const UpdateProfile = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const userId = FIREBASE_AUTH.currentUser?.uid;

  const fetchUserData = async () => {
    if (userId) {
      try {
        const userDoc = doc(FIREBASE_DB, 'users', userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setWeight(data.weight?.toString() || '');
          setHeight(data.height?.toString() || '');
          setDob(data.dob || '');
          setGender(data.gender || 'Male');
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [userId])
  );

  const validateForm = () => {
    if (!name.trim() ||!weight.trim() ||!height.trim() ||!dob.trim()) {
      Alert.alert('Please fill in all fields');
      return false;
    }
    if (isNaN(Number(weight)) || isNaN(Number(height))) {
      Alert.alert('Weight and height must be numbers');
      return false;
    }
    if (new Date(dob) > new Date()) {
      Alert.alert('Invalid date of birth');
      return false;
    }
    if (gender!== 'Male' && gender!== 'Female') {
      Alert.alert('Invalid gender');
      return false;
    }
    if (Number(weight) <= 0 || Number(weight) > 250) {
        Alert.alert('Weight must be between 1 and 250 kg');
        return;
    }
    if (Number(height) <= 40 || Number(height) > 250) {
        Alert.alert('Height must be between 40 and 250 cm');
        return;
    }
    return true;
  }

  const handleUpdate = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!validateForm()) return;
      if (!user) {
        Alert.alert('User not logged in');
        return;
      }

      const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
      await updateDoc(userDocRef, {
        name,
        weight,
        height,
        dob,
        gender,
      });

      Alert.alert('Profile updated successfully');
      navigation.goBack({ updated: true }); // Điều hướng về màn hình Profile với dữ liệu cập nhật
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error updating profile');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <ArrowLeft size={32} color='black' onPress={() => navigation.goBack()}/>
        <Text style={styles.textToolbar}>Update Profile</Text>
      </View>
      <View style = {{alignItems: 'center'}}>
        <Image source={require('../assets/images/user.png')} style = {styles.img}/>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth"
        value={dob}
        onChangeText={setDob}
      />
      <View style={styles.genderContainer}>
        <Pressable onPress={() => setGender('Male')} style={[styles.genderButton, gender === 'Male' && styles.activeGender]}>
          <Text style={styles.genderText}>Male</Text>
        </Pressable>
        <Pressable onPress={() => setGender('Female')} style={[styles.genderButton, gender === 'Female' && styles.activeGender]}>
          <Text style={styles.genderText}>Female</Text>
        </Pressable>
      </View>
      <Pressable onPress={handleUpdate} style={styles.button}>
        <Text style={styles.textButton}>Update</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  toolbar: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 5,
 
  },
  textToolbar: {
    fontFamily: 'SF-Pro-Rounded-Semibold',
    fontSize: 26,
    color: 'black',
    marginLeft: 15
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderRadius: 15,
    marginTop: 10
  },
  genderButton: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#000',
  },
  activeGender: {
    backgroundColor: Color.primaryColor,
  },
  genderText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SF-Pro-Rounded-Semibold',
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
    width: 100,
     height: 100,
     marginBottom: 40
  }
});

export default UpdateProfile;

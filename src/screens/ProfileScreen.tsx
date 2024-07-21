import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Color from '../style/Color';
import { ArrowRight2 } from 'iconsax-react-native';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = FIREBASE_AUTH.currentUser?.uid;

  const fetchUserData = async () => {
    if (userId) {
      try {
        const userDoc = doc(FIREBASE_DB, 'users', userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log('No such document!');
          setUserData(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData();
    });

    return unsubscribe;
  }, [navigation, userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  const handleLogout = () => {
    FIREBASE_AUTH.signOut()
      .then(() => {
        navigation.replace('LoginScreen'); // Assuming 'Login' is your login screen route name
      })
      .catch((error) => {
        console.error('Error signing out:', error);
        Alert.alert('Error', 'Failed to sign out. Please try again.');
      });
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No user data available</Text>
      </View>
    );
  }

  const confirmSignOut = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: handleLogout },
      ],
      { cancelable: true },
    );
  };

  // Calculate BMI
  const heightInMeters = (userData.height || 0) / 100;
  const bmi =
    userData.weight && heightInMeters
      ? userData.weight / (heightInMeters * heightInMeters)
      : 0;

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.textToolbar}>My Profile</Text>
      </View>
      <Pressable onPress={() => navigation.navigate('UpdateProfile')}>
        <View
          style={{
            marginHorizontal: 30,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/images/user.png')}
            style={styles.profileImg}
          />
          <View style={{ marginLeft: 20 }}>
            <Text style={styles.profileText}>{userData?.name || 'N/A'}</Text>
            <Text style={styles.emailText}>{userData?.email || 'N/A'}</Text>
          </View>
        </View>
        <View style={{ marginHorizontal: 30, marginTop: 40 }}>
          <View style={styles.item}>
            <Text style={styles.text}>Gender </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.textT}>{userData?.gender || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.item}>
            <Text style={styles.text}>Date of Birth</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.textT}> {userData?.dob || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.item}>
            <Text style={styles.text}>Height</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.textT}>
                {' '}
                {userData?.height ? `${userData.height} cm` : 'N/A'}
              </Text>
            </View>
          </View>
          <View style={styles.item}>
            <Text style={styles.text}>Weight</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.textT}>
                {' '}
                {userData?.weight ? `${userData.weight} kg` : 'N/A'}
              </Text>
            </View>
          </View>
          <View style={styles.item}>
            <Text style={styles.text}>BMI </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.textT}> {bmi ? bmi.toFixed(1) : 'N/A'}</Text>
            </View>
          </View>
        </View>
      </Pressable>
      <Pressable style={styles.button} onPress={confirmSignOut}>
        <Text style={styles.textButton}>Sign out</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginTop: 15,
  },
  textToolbar: {
    fontFamily: 'SF-Pro-Rounded-Semibold',
    fontSize: 28,
    color: 'black',
  },
  profileImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'contain',
  },
  profileText: {
    fontFamily: 'SF-Pro-Rounded-Semibold',
    fontSize: 18,
    color: 'black',
  },
  emailText: {
    fontFamily: 'SF-Pro-Rounded-Regular',
    fontSize: 14,
    color: '#7B6F72',
    marginTop: -4,
  },
  infoText: {
    fontFamily: 'SF-Pro-Rounded-Regular',
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  noDataText: {
    fontFamily: 'SF-Pro-Rounded-Regular',
    fontSize: 18,
    color: '#7B6F72',
    textAlign: 'center',
    marginTop: 20,
  },
  text: {
    fontFamily: 'SF-Pro-Rounded-Medium',
    fontSize: 18,
    color: 'black',
  },
  item: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#EDEFF7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  textT: {
    fontFamily: 'SF-Pro-Rounded-Regular',
    fontSize: 16,
    color: '#7B6F72',
  },
  button: {
    backgroundColor: Color.primaryColor,
    borderRadius: 10,
    marginVertical: 30,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    marginTop: 50,
  },
  textButton: {
    color: 'white',
    fontFamily: 'SF-Pro-Rounded-Semibold',
    fontSize: 17,
  },
});

export default ProfileScreen;

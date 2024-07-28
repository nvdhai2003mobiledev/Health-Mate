import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Color from '../style/Color';
import { ArrowRight2, LogoutCurve } from 'iconsax-react-native';

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
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
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

  const dietarySuggestions = getDietarySuggestions(bmi);

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.textToolbar}>My Profile</Text>
        <LogoutCurve size={28} color='#000' variant='Linear' onPress={confirmSignOut} />
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
        <View style={{ marginHorizontal: 30, marginTop: 30 }}>
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
          <View style={[styles.item, { flexDirection: 'column', alignItems: 'flex-start' }]}>
            <Text style={styles.text}>Dietary Suggestions </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.textT}> {dietarySuggestions}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const getDietarySuggestions = (bmi) => {
  if (bmi < 18.5) {
    return 'Your BMI indicates that you are underweight. Consider incorporating more nutrient-dense foods into your diet, such as lean meats, dairy, nuts, and healthy fats. Eating more frequent, balanced meals can also help.';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    return 'Your BMI is in the normal range. Continue eating a balanced diet that includes a variety of fruits, vegetables, lean proteins, and whole grains. Regular physical activity is also important for maintaining your health.';
  } else if (bmi >= 25 && bmi < 29.9) {
    return 'Your BMI indicates that you are overweight. Consider reducing your intake of high-calorie foods and increasing your physical activity. Focus on eating more fruits, vegetables, lean proteins, and whole grains.';
  } else {
    return 'Your BMI indicates that you are obese. It is important to consult with a healthcare provider for personalized advice. Generally, a diet rich in fruits, vegetables, lean proteins, and whole grains, combined with regular physical activity, can help you achieve a healthier weight.';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    width: '100%',
    height: 80,
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
    fontSize: 14,
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ProfileScreen;

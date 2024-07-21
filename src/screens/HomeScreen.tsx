import React, { useState, useCallback, useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Color from '../style/Color';

const HomeScreen = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = FIREBASE_AUTH.currentUser?.uid;

  const fetchUserData = useCallback(async () => {
    if (userId) {
      try {
        const userDoc = doc(FIREBASE_DB, 'users', userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchUserData();
    }, [fetchUserData])
  );

  useEffect(() => {
    const date = new Date();
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const monthName = months[date.getMonth()];

    const formattedDate = `${dayName} ${day} ${monthName}`;
    setCurrentDate(formattedDate);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 50,
          marginHorizontal: 30,
        }}>
        <View>
          <Text style={styles.title}>Hi, {userData?.name || 'Guest'}</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
        <Image source={require('../assets/images/user.png')} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 36,
          gap: 20,
        }}>
        <View style={styles.heartBg}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 12,
            }}>
            <Text style={styles.heartText}>Heart</Text>
            <Image source={require('../assets/images/Duotone.png')} />
          </View>
          <Image
            source={require('../assets/images/Graph.png')}
            style={{ marginTop: 40 }}
            width={166}
            height={74}
          />
          <Text
            style={[
              styles.heartText,
              {
                fontFamily: 'SF-Pro-Rounded-Semibold',
                fontSize: 14,
                marginHorizontal: 12,
              },
            ]}>
            105 <Text style={{ fontFamily: 'SF-Pro-Rounded-Regular' }}>bmp</Text>
          </Text>
        </View>
        <View
          style={[
            styles.heartBg,
            {
              backgroundColor: '#fff',
              borderWidth: 3,
              borderColor: '#EDEFF7',
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 12,
            }}>
            <Text style={[styles.heartText, { color: '#53668E' }]}>Water</Text>
            <Image source={require('../assets/images/Water.png')} />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../assets/images/Water-iluss-Photoroom.png')}
              style={{ marginTop: 10 }}
              width={56}
              height={78}
            />
          </View>

          <Text
            style={[
              styles.heartText,
              {
                fontFamily: 'SF-Pro-Rounded-Semibold',
                fontSize: 14,
                marginHorizontal: 12,
                marginTop: 18,
                color: '#5142AB',
              },
            ]}>
            1.0{' '}
            <Text style={{ fontFamily: 'SF-Pro-Rounded-Regular' }}>liters</Text>
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 20,
          gap: 20,
        }}>
        <View>
          <View>
            <View
              style={[
                styles.heartBg,
                {
                  height: 148,
                  backgroundColor: '#fff',
                  borderWidth: 3,
                  borderColor: '#EDEFF7',
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 12,
                }}>
                <Text style={[styles.heartText, { color: '#53668E' }]}>Walk</Text>
                <Image source={require('../assets/images/Walk.png')} />
              </View>
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={require('../assets/images/Process.png')}
                  style={{ marginTop: -10 }}
                  width={82}
                  height={82}
                />
              </View>
            </View>
          </View>
          <View>
            <View
              style={[
                styles.heartBg,
                {
                  height: 101,
                  backgroundColor: '#fff',
                  borderWidth: 3,
                  borderColor: '#EDEFF7',
                  marginTop: 20,
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 12,
                }}>
                <Text style={[styles.heartText, { color: '#53668E' }]}>
                  Sleep
                </Text>
                <Image source={require('../assets/images/Bed.png')} />
              </View>
              <Text
                style={[
                  styles.heartText,
                  {
                    fontFamily: 'SF-Pro-Rounded-Semibold',
                    fontSize: 14,
                    marginHorizontal: 12,
                    marginTop: 7,
                    color: '#5142AB',
                  },
                ]}>
                06:32{' '}
                <Text style={{ fontFamily: 'SF-Pro-Rounded-Regular' }}>
                  hours
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.heartBg,
            {
              height: 267,
              backgroundColor: '#FBFCFD',
              borderWidth: 3,
              borderColor: '#EDEFF7',
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 12,
            }}>
            <Text style={[styles.heartText, { color: '#53668E' }]}>Calories</Text>
            <Image source={require('../assets/images/Calories.png')} />
          </View>
          <Image
            source={require('../assets/images/Line.png')}
            style={{ marginTop: 50 }}
            width={166}
            height={74}
          />
          <View
            style={{ justifyContent: 'flex-end', flex: 1, paddingBottom: 12 }}>
            <Text
              style={[
                styles.heartText,
                {
                  fontFamily: 'SF-Pro-Rounded-Semibold',
                  fontSize: 14,
                  marginHorizontal: 12,
                  color: '#5142AB',
                },
              ]}>
              540{' '}
              <Text style={{ fontFamily: 'SF-Pro-Rounded-Regular' }}>kcal</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'SF-Pro-Rounded-Bold',
    fontSize: 26,
    color: Color.textColor,
  },
  date: {
    fontFamily: 'SF-Pro-Rounded-Medium',
    fontSize: 16,
    color: Color.primaryColor,
    marginTop: -5,
  },
  profileImg: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  heartBg: {
    height: 209,
    width: 154,
    borderRadius: 20,
    backgroundColor: Color.primaryColor,
  },
  heartText: {
    color: '#fff',
    fontFamily: 'SF-Pro-Rounded-Bold',
    fontSize: 16,
  },
});

export default HomeScreen;

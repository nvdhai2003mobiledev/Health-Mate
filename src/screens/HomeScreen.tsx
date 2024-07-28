import React, { useState, useCallback, useEffect } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Color from '../style/Color';
import { accelerometer } from 'react-native-sensors';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

const HomeScreen = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = FIREBASE_AUTH.currentUser?.uid;

  const [steps, setSteps] = useState(0);
  const [lastStepTime, setLastStepTime] = useState(0);
  const [filteredMagnitude, setFilteredMagnitude] = useState(0);
  const [subscription, setSubscription] = useState(null);

  // Thêm state để lưu trữ thời gian ngủ
  const [sleepHours, setSleepHours] = useState(0);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const result = await request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);
        if (result !== RESULTS.GRANTED) {
          console.log('Permission denied');
          return;
        }
      } else if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.MOTION);
        if (result !== RESULTS.GRANTED) {
          console.log('Permission denied');
          return;
        }
      }

      await loadInitialData(); // Tải số bước chân và giờ ngủ từ Firestore
      startStepCounter(); // Bắt đầu đếm bước chân
    };

    requestPermission();

    return () => {
      stopStepCounter(); // Hủy đăng ký cảm biến khi thành phần bị hủy
    };
  }, []);

  const loadInitialData = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        console.log('No user is logged in');
        return;
      }

      const userId = user.uid;
      const docRef = doc(FIREBASE_DB, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.steps !== undefined) {
          setSteps(userData.steps); // Khôi phục số bước chân từ Firestore
        } else {
          setSteps(0); // Đặt số bước chân về 0 nếu không có dữ liệu
        }
        if (userData.sleepHours !== undefined) {
          setSleepHours(userData.sleepHours); // Khôi phục số giờ ngủ từ Firestore
        } else {
          setSleepHours(0); // Đặt số giờ ngủ về 0 nếu không có dữ liệu
        }
      } else {
        console.log('No such document!');
        setSteps(0); // Đặt số bước chân về 0 nếu không tìm thấy tài liệu
        setSleepHours(0); // Đặt số giờ ngủ về 0 nếu không tìm thấy tài liệu
      }
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };

  const updateFirestore = async (newStepCount, newSleepHours) => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        console.log('No user is logged in');
        return;
      }

      const userId = user.uid;
      const docRef = doc(FIREBASE_DB, 'users', userId);
      await updateDoc(docRef, { steps: newStepCount, sleepHours: newSleepHours });
      console.log('Steps and Sleep Hours updated in Firestore');
    } catch (error) {
      console.error('Error updating steps and sleep hours in Firestore:', error);
    }
  };

  const startStepCounter = useCallback(() => {
    let initialSteps = steps; // Khởi tạo từ số bước chân hiện tại
    const threshold = 1.2;
    const minTimeBetweenSteps = 300;
    const smoothingFactor = 0.1;
    let lastMagnitudeFiltered = 0;

    const sub = accelerometer.subscribe(
      ({ x, y, z }) => {
        const magnitude = Math.sqrt(x * x + y * y + z * z);

        const smoothedMagnitude = smoothingFactor * magnitude + (1 - smoothingFactor) * lastMagnitudeFiltered;
        setFilteredMagnitude(smoothedMagnitude);

        const currentTime = Date.now();
        if (
          smoothedMagnitude > threshold &&
          Math.abs(smoothedMagnitude - lastMagnitudeFiltered) > 0.5 &&
          (currentTime - lastStepTime) > minTimeBetweenSteps
        ) {
          initialSteps++;
          setSteps(initialSteps);
          updateFirestore(initialSteps, sleepHours);
          setLastStepTime(currentTime);
        }

        lastMagnitudeFiltered = smoothedMagnitude;
      },
      (error) => console.log('The sensor is not available'),
      { sensorDelay: 'game' }
    );

    setSubscription(sub);

    return () => {
      sub.unsubscribe();
    };
  }, [lastStepTime, steps, sleepHours]);

  const stopStepCounter = useCallback(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  }, [subscription]);

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
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
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
                  height: 101,
                  backgroundColor: '#fff',
                  borderWidth: 3,
                  borderColor: '#EDEFF7',
                },
              ]}>
              <Pressable onPress={() => navigation.navigate('StepsDetail')}>
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
                  {steps}{' '}
                  <Text style={{ fontFamily: 'SF-Pro-Rounded-Regular' }}>
                    steps
                  </Text>
                </Text>
              </Pressable>
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
              <Pressable onPress={() => navigation.navigate('SleepDetail')}>
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
                  {sleepHours.toFixed(2)}{' '}
                  <Text style={{ fontFamily: 'SF-Pro-Rounded-Regular' }}>
                    hours
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.heartBg,
            {
              height: 225,
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default HomeScreen;

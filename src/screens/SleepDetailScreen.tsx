import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Dimensions } from 'react-native';
import Color from '../style/Color';
import { ArrowLeft } from 'iconsax-react-native';

const screenWidth = Dimensions.get('window').width;

const SleepDetailScreen = ({ navigation }: { navigation: any }) => {
  const [sleepData, setSleepData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [goal, setGoal] = useState(8);
  const [newGoal, setNewGoal] = useState('');
  const [currentDate, setCurrentDate] = useState('');

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

  useEffect(() => {
    loadSleepData();
  }, []);

  const loadSleepData = async () => {
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
        if (userData.sleepData) {
          setSleepData(userData.sleepData);
        }
        if (userData.sleepGoal) {
          setGoal(userData.sleepGoal);
        }
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching sleep data from Firestore:', error);
    }
  };

  const saveGoal = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        console.log('No user is logged in');
        return;
      }

      const userId = user.uid;
      const docRef = doc(FIREBASE_DB, 'users', userId);
      await updateDoc(docRef, { sleepGoal: parseInt(newGoal) });
      setGoal(parseInt(newGoal));
      setNewGoal('');
      console.log('Sleep goal updated in Firestore');
    } catch (error) {
      console.error('Error updating sleep goal in Firestore:', error);
    }
  };

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: sleepData,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <ArrowLeft size={28} color='#000' variant='Linear' style={{ marginHorizontal: 30 }} onPress={() => navigation.goBack()} />
      <View style={{ marginHorizontal: 30, marginTop: 10, marginBottom: 10 }}>
        <Text style={[styles.title, { fontSize: 26 }]}>Sleep Tracking</Text>
        <Text style={styles.date}>{currentDate}</Text>
      </View>
      <BarChart
        data={data}
        width={screenWidth - 16}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForLabels: {
            fontFamily: 'SF-Pro-Rounded-Regular'
          }
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      <View style={{
        marginHorizontal: 30, marginTop: 20, backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20
      }}>
        <Text style={[styles.title, { textAlign: 'center' }]}>Goal: {goal} hours/day</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new goal"
          keyboardType="numeric"
          value={newGoal}
          onChangeText={setNewGoal}
        />
        <Pressable onPress={saveGoal} style={styles.button}>
          <Text style={styles.textButton}>Save Goal</Text>
        </Pressable>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'SF-Pro-Rounded-Bold'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'SF-Pro-Rounded-Regular',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Color.textColor,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: '#F7F7F8',
    alignItems: 'center',
    marginBottom: 30,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontFamily: 'SF-Pro-Rounded-Medium',
    fontSize: 14,
    color: Color.hintColor,
    marginTop: -5,
  },
  button: {
    backgroundColor: Color.primaryColor,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -5,
    marginBottom: 15
  },
  textButton: {
    color: 'white',
    fontFamily: 'SF-Pro-Rounded-Semibold',
    fontSize: 17,
  },
});

export default SleepDetailScreen;

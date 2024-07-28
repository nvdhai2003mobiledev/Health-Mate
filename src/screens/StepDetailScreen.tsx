// File: StepDetailScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { ArrowLeft } from 'iconsax-react-native';
import dayjs from 'dayjs';
import Color from '../style/Color';

const screenWidth = Dimensions.get('window').width;

const StepDetailScreen = ({ navigation }: { navigation: any }) => {
  const [steps, setSteps] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [stepGoal, setStepGoal] = useState(10000);
  const [weeklySteps, setWeeklySteps] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = FIREBASE_AUTH.currentUser?.uid;
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
    const fetchStepDetails = async () => {
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
          const data = docSnap.data();
          console.log('Fetched user data:', data);
          setSteps(data.steps || 0);
          setSpeed(data.speed || 0);
          setStepGoal(data.stepGoal || 10000);
          setWeeklySteps(data.weeklySteps || [0, 0, 0, 0, 0, 0, 0]); // Initialize with zeros if no data
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching step details from Firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStepDetails();
  }, []);

  const updateStepGoal = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        console.log('No user is logged in');
        return;
      }

      const userId = user.uid;
      const docRef = doc(FIREBASE_DB, 'users', userId);
      await updateDoc(docRef, { stepGoal });
      console.log('Step goal updated in Firestore');
    } catch (error) {
      console.error('Error updating step goal in Firestore:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <ArrowLeft size={28} color='#000' variant='Linear' style={{ marginHorizontal: 30 }} onPress={() => navigation.goBack()} />
        <View style={{ marginHorizontal: 30, marginTop: 10, marginBottom: 10 }}>
          <Text style={[styles.title, { fontSize: 26 }]}>Weekly Steps</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>

        <BarChart
          data={{
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [
              {
                data: weeklySteps,
              },
            ],
          }}
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
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          marginHorizontal: 30,
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 20
        }}>
        <View>
          <Text style={styles.title}>Step Goal</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={stepGoal.toString()}
            onChangeText={(text) => setStepGoal(Number(text))}
          />
          <Pressable onPress={updateStepGoal} style={styles.button}>
            <Text style={styles.textButton}>Update Step Goal</Text>
          </Pressable>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 80,
          marginBottom: 10
        }}>
          <View>
            <Text style={styles.title}>{steps}<Text style={{
              fontSize: 14
            }}> steps</Text></Text>
            <Text style={{ fontFamily: 'SF-Pro-Rounded-Regular', marginTop: -8, fontSize: 13 }}>Steps</Text>
          </View>
          <View>
            <Text style={styles.title}>{speed.toFixed(2)} <Text style={{
              fontSize: 14
            }}>m/s</Text> </Text>
            <Text style={{ fontFamily: 'SF-Pro-Rounded-Regular', marginTop: -8, fontSize: 13 }}>Distance</Text>
          </View>

        </View>


      </KeyboardAvoidingView>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40
  },
  section: {
    marginBottom: 24,
  },
  title: {
    color: '#000',
    fontSize: 20,
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

export default StepDetailScreen;

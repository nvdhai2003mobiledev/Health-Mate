import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, TextInput, Pressable, StyleSheet, Text, Alert } from 'react-native';
import { addTodo } from '../redux/reducer/todosSlice';
import { v4 as uuidv4 } from 'uuid';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, BrushBig, ExportSquare, SaveAdd } from 'iconsax-react-native';
import Color from '../style/Color';

const AddSpiritScreen = ({navigation}: {navigation: any}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const dispatch = useDispatch();
  const dayCount = useSelector(state => state.todos.dayCount);

  useEffect(() => {
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
    }).format(now);
    setCurrentDate(formattedDate);
  }, []);

  const validateForm = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Please fill in all fields');
      return false;
    }
    return true;
  };

  const handleAddTodo = () => {
    if (!validateForm()) return;
    const newTodo = {
      id: uuidv4(), // UUID cho mỗi todo mới
      day: `Spirit ${dayCount + 1}`,
      title,
      content,
      date: currentDate,
    };
    dispatch(addTodo(newTodo));
    setTitle('');
    setContent('');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ArrowLeft size={24} color="black" onPress={() => navigation.goBack()} />
        <View style={styles.icons}>
          <ExportSquare size={24} color="black" />
          <BrushBig size={24} color="black" />
          <SaveAdd size={24} color="black" />
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.textSp}>Spirit {dayCount + 1}</Text>
        <Text style={styles.date}>{currentDate}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { textAlignVertical: 'top', color: '#7B6F72' }]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={4}
      />
      <Pressable onPress={handleAddTodo} style={styles.button}>
        <Text style={styles.textButton}>Add</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  icons: {
    flexDirection: 'row',
    gap: 20,
  },
  info: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  textSp: {
    fontFamily: 'SF-Pro-Rounded-Bold',
    color: '#53668E',
    fontSize: 20,
  },
  date: {
    fontFamily: 'SF-Pro-Rounded-Regular',
    fontSize: 16,
    color: '#828282',
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
});

export default AddSpiritScreen;

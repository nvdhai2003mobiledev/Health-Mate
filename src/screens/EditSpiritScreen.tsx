import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, TextInput, Pressable, StyleSheet, Text, Alert } from 'react-native';
import { editTodo } from '../redux/reducer/todosSlice';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, BrushBig, ExportSquare, SaveAdd } from 'iconsax-react-native';
import Color from '../style/Color';

const EditSpiritScreen = ({ route }) => {
  const { todoId } = route.params;
  const todo = useSelector(state => state.todos.items.find(t => t.id === todoId));
  const [title, setTitle] = useState(todo.title);
  const [content, setContent] = useState(todo.content);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleEditTodo = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Please fill in all fields');
      return;
    }
    dispatch(editTodo({
      ...todo,
      title,
      content,
    }));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <ArrowLeft size={24} color="black" onPress={() => navigation.goBack()} />
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <ExportSquare size={24} color="black" />
          <BrushBig size={24} color="black" />
          <SaveAdd size={24} color="black" />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 30,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Text style={styles.textSp}>Spirit {todo.day.split(' ')[1]}</Text>
        <Text style={styles.date}>{todo.date}</Text>
      </View>
      <TextInput
        style={[styles.input, { fontFamily: 'SF-Pro-Rounded-Semibold' }]}
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
      <Pressable onPress={handleEditTodo} style={styles.button}>
        <Text style={styles.textButton}>Save Changes</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
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

export default EditSpiritScreen;

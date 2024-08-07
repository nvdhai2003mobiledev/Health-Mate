import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, deleteTodo, fetchTodos } from '../redux/reducer/todosSlice';
import { useNavigation } from '@react-navigation/native';
import Color from '../style/Color';
import { AddCircle, SearchNormal1 } from 'iconsax-react-native';

// Hàm tạo màu nền sáng và nhẹ nhàng
const getLightColor = () => {
  const colors = ['#FFDDC1', '#FFABAB', '#FFC3A0', '#B9FBC0', '#C4E5E8', '#E4C1F9'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const SpiritScreen = () => {
  const { items, searchQuery } = useSelector(state => state.todos);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).map(item => ({
    ...item,
    backgroundColor: getLightColor(),
  }));

  const confirmDelete = id => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this spirit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => dispatch(deleteTodo(id)),
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.textToolbar}>Spirit</Text>
      </View>
      <View style={styles.input}>
        <TextInput
          placeholder="Enter your title"
          style={{ fontSize: 16, fontFamily: 'SF-Pro-Rounded-Regular' }}
          placeholderTextColor="#7B6F72"
          autoCapitalize="none"
          value={searchQuery}
          onChangeText={text => dispatch(setSearchQuery(text))}
        />
        <SearchNormal1 color="black" size={20} variant="Linear" />
      </View>
      {searchQuery && filteredItems.length === 0 ? (
        <Text style={styles.noResults}>No results found</Text>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EditSpiritScreen', { todoId: item.id })
              }
              onLongPress={() => confirmDelete(item.id)}>
              <View style={[styles.item, { backgroundColor: item.backgroundColor }]}>
                <View>
                  <Text style={styles.spiritText}>{item.day}</Text>
                  <Text style={styles.todoTitle}>{item.title}</Text>
                  <Text
                    style={[
                      styles.todoTitle,
                      {
                        fontFamily: 'SF-Pro-Rounded-Regular',
                        color: '#7B6F72',
                      },
                    ]}>
                    {item.content}
                  </Text>
                </View>
                <View style={{ paddingTop: 6, alignItems: 'center' }}>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <AddCircle
        size={55}
        color={Color.primaryColor}
        variant="Bold"
        style={styles.addButton}
        onPress={() => navigation.navigate('AddSpiritScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addButton: {
    position: 'absolute',
    bottom: 90,
    right: 30,
  },
  date: {
    fontFamily: 'SF-Pro-Rounded-Regular',
    fontSize: 12,
    color: '#828282',
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
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Color.textColor,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: '#F7F7F8',
    marginHorizontal: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  item: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#EDEFF7',
    marginHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  noResults: {
    fontFamily: 'SF-Pro-Rounded-Regular',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  todoTitle: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Rounded-Semibold',
    color: '#000',
  },
  spiritText: {
    fontSize: 20,
    fontFamily: 'SF-Pro-Rounded-Bold',
    color: '#53668E',
  },
});

export default SpiritScreen;

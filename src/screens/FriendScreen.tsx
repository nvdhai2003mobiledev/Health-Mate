import { View, Text, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import Color from '../style/Color'
import { SearchNormal1 } from 'iconsax-react-native'

const FriendScreen = () => {
  return (
    <View style = {styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.textToolbar}>Friends</Text>
      </View>
      <View style={styles.input}>
        <TextInput
          placeholder="Enter your title"
          style={{ fontSize: 16, fontFamily: 'SF-Pro-Rounded-Regular' }}
          placeholderTextColor="#7B6F72"
          autoCapitalize="none"
        />
        <SearchNormal1 color="black" size={20} variant="Linear" />
      </View>
    </View>
  )
}

export default FriendScreen

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
})
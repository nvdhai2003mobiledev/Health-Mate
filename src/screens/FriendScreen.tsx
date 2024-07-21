import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const FriendScreen = () => {
  return (
    <View style = {styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.textToolbar}>Friends</Text>
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
})
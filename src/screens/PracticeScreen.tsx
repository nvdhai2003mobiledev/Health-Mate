import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TabNavigation from '../navigation/TabNavigation'

const PracticeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.textToolbar}>Practice</Text>
      </View>
      <TabNavigation />
    </View>
  )
}

export default PracticeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    width: '100%',
    height: 70,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginTop: 15,
    backgroundColor: '#fff',
  },
  textToolbar: {
    fontFamily: 'SF-Pro-Rounded-Semibold',
    fontSize: 28,
    color: 'black',
  },
})
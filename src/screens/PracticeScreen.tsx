import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PracticeScreen = () => {
  return (
    <View style = {styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.textToolbar}>Practice</Text>
      </View>
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
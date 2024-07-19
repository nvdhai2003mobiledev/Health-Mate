// src/components/CustomStatusBar.js

import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const CustomStatusBar = ({ barStyle = 'light-content' }) => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={barStyle}
        translucent
        backgroundColor="transparent"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: getStatusBarHeight(),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

export default CustomStatusBar;

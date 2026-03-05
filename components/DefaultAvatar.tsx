import React from 'react';
import { View, StyleSheet } from 'react-native';

const DefaultAvatar = ({ size = 80 }) => {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.head, { width: size * 0.3, height: size * 0.3, borderRadius: (size * 0.3) / 2 }]} />
      <View style={[styles.body, { width: size * 0.5, height: size * 0.4, borderRadius: size * 0.25 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  head: {
    backgroundColor: '#D0D0D0',
    position: 'absolute',
    top: '25%',
  },
  body: {
    backgroundColor: '#D0D0D0',
    position: 'absolute',
    bottom: '15%',
  },
});

export default DefaultAvatar;

import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          display: 'none', // Oculta completamente el tab bar
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontFamily: 'WorkSans-Medium',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ChatRoomQR',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

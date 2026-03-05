import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
          fontFamily: 'WorkSans-Medium',
        },
        tabBarIconStyle: {
          marginBottom: 2,
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
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.tabIconFocused : styles.tabIcon}>
              <Ionicons name="person-outline" size={24} color={focused ? '#ffffff' : color} />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chat-general/index"
        options={{
          title: 'Chat General',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.tabIconFocused : styles.tabIcon}>
              <Ionicons name="people" size={24} color={focused ? '#ffffff' : color} />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chats-privados/index"
        options={{
          title: 'Chats Privados',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.tabIconFocused : styles.tabIcon}>
              <Ionicons name="chatbubbles" size={24} color={focused ? '#ffffff' : color} />
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabIconFocused: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});

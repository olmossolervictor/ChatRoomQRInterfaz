import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { StorageHelper } from '../utils/storage';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const currentUser = await StorageHelper.getCurrentUser();
      setHasSession(!!currentUser);
    } catch (error) {
      console.error('Error checking session:', error);
      setHasSession(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#f5f5f5' 
      }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#666', fontFamily: 'WorkSans-Medium' }}>
          Cargando...
        </Text>
      </View>
    );
  }

  return hasSession ? <Redirect href="/(tabs)/chat-general" /> : <Redirect href="/auth/login" />;
}

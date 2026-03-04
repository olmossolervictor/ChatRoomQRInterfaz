import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatsPrivadosScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats Privados</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Sin conversaciones</Text>
          <Text style={styles.emptySubtitle}>
            Tus chats privados aparecerán aquí cuando inicies conversaciones en una establecimiento
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'WorkSans-Black',
    marginTop:20
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
    fontFamily: 'WorkSans-Medium',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'WorkSans-Light',
  },
});

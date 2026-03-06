import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatsPrivadosScreen() {
  // Función para buscar usuarios en el establecimiento
  const handleSearchUsers = async () => {
    try {
      // TODO: Implementar lógica para obtener usuarios cercanos
      Alert.alert('Buscar Usuarios', 'Buscando usuarios disponibles en el establecimiento...');
      // Aquí iría la lógica para mostrar una lista de usuarios disponibles
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      Alert.alert('Error', 'No se pudo buscar usuarios');
    }
  };

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
            Tus chats privados aparecerán aquí cuando inicies conversaciones en un establecimiento
          </Text>
          
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchUsers}>
            <View style={styles.buttonContent}>
              <Ionicons name="search" size={20} color="white" />
              <Text style={styles.buttonText}>Buscar Usuarios</Text>
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: 0,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 0,
    marginTop: 0,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'WorkSans-Black',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 30,
    marginLeft: 25,
    marginRight: 25,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    fontFamily: 'WorkSans-Medium',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
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
  searchButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 24,
  },
  buttonContent: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'WorkSans-Medium',
  },
});

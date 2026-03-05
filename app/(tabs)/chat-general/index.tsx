import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ChatGeneralScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat General</Text>
        <View style={styles.headerBadge}>
          <Ionicons name="people" size={16} color="white" />
          <Text style={styles.badgeText}>Conectados</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <View style={styles.iconBg}>
                <Ionicons name="qr-code" size={40} color="white" />
              </View>
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Escanea para Conectar</Text>
              <Text style={styles.cardSubtitle}>
                Únete al chat del establecimiento
              </Text>
            </View>
          </View>
          
          <Text style={styles.cardDescription}>
            Para acceder al chat general del establecimiento, escanea el código QR disponible en el local y comienza a conversar con otros usuarios.
          </Text>
          
          <TouchableOpacity style={styles.scanButton}>
            <View style={styles.buttonContent}>
              <Ionicons name="camera" size={20} color="white" />
              <Text style={styles.buttonText}>Escanear QR</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.featuresContainer}>
          
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'WorkSans-Black',
    marginTop:30
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop:30
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconBg: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    fontFamily: 'WorkSans-Medium',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'WorkSans-Light',
  },
  cardDescription: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: 'WorkSans-Light',
  },
  scanButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    backgroundColor: '#007AFF',
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
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    fontFamily: 'WorkSans-Medium',
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'WorkSans-Light',
  },
});

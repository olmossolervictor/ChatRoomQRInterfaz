import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, TextInput, KeyboardAvoidingView, Platform, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  senderName?: string;
}

export default function ChatGeneralScreen() {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Bienvenido al chat general de la discoteca! 🎉',
      sender: 'other',
      timestamp: new Date(Date.now() - 3600000),
      senderName: 'Sistema',
    },
    {
      id: '2',
      text: 'Qué buena música esta noche!',
      sender: 'other',
      timestamp: new Date(Date.now() - 1800000),
      senderName: 'Usuario1',
    },
    {
      id: '3',
      text: 'Alguien más va a pedir algo en la barra?',
      sender: 'other',
      timestamp: new Date(Date.now() - 900000),
      senderName: 'Usuario2',
    },
  ]);

  // Función para enviar mensaje
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'me',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');
      
      // Auto-scroll al último mensaje
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  // Función para escanear QR (comentada por ahora)
  /*
  const handleScanQR = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tu cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        // Aquí iría la lógica para procesar el QR escaneado
        Alert.alert('QR Escaneado', 'Código QR detectado. Conectando al chat del establecimiento...');
        // TODO: Implementar lógica de conexión al chat general
        // Después de verificar el QR, mostrar el chat
        setShowChat(true);
      }
    } catch (error) {
      console.error('Error al escanear QR:', error);
      Alert.alert('Error', 'No se pudo escanear el código QR');
    }
  };
  */

  // Función temporal para simular escaneo y mostrar chat
  const handleAccessChat = () => {
    // Simulación de verificación de QR
    setShowChat(true);
  };

  // Componente de la tarjeta de QR
  const QRCard = () => (
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
        
        <TouchableOpacity style={styles.scanButton} onPress={handleAccessChat}>
          <View style={styles.buttonContent}>
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.buttonText}>Escanear QR</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.featuresContainer}>
        
      </View>
    </View>
  );

  // Componente del chat funcional
  const ChatComponent = () => (
    <View style={styles.chatContainer}>
      <View style={styles.chatHeader}>
        <View style={styles.chatHeaderContent}>
          <Text style={styles.chatTitle}>Chat General</Text>
          <Text style={styles.chatSubtitle}>Discoteca Central</Text>
        </View>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatMessages}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((item) => (
          <View key={item.id} style={[
            styles.messageContainer,
            item.sender === 'me' ? styles.myMessage : styles.otherMessage
          ]}>
            {item.sender === 'other' && item.senderName && (
              <Text style={styles.senderName}>{item.senderName}</Text>
            )}
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {item.timestamp.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.chatInput}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            autoFocus={false}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Mostrar QR Card o Chat Component según el estado */}
      {showChat ? <ChatComponent /> : <QRCard />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    height: '100%',
    width: '100%',
    
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
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal:0,
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

  // Estilos para el chat
  chatContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    marginBottom: 0, // Asegurar que llegue hasta el fondo
  },
  chatHeader: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Espacio para status bar
    marginTop: Platform.OS === 'ios' ? 0 : 0,
  },
  chatHeaderContent: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 8 : 0, // Bajar un poco las letras
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'WorkSans-Black',
  },
  chatSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'WorkSans-Medium',
  },
  infoButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  welcomeMessage: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'WorkSans-Black',
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'WorkSans-Light',
  },
  sampleMessages: {
    gap: 12,
  },
  sampleMessage: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  sampleSender: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
    fontFamily: 'WorkSans-Medium',
  },
  sampleText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'WorkSans-Regular',
  },
  chatInput: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 8 : 16, // Pequeño espacio del tab bar
    left: 16,
    right: 16,
    backgroundColor: 'transparent', // Sin fondo visible
    padding: 0, // Sin padding
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  inputPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#999',
    fontFamily: 'WorkSans-Regular',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  // Estilos para mensajes funcionales
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
    fontFamily: 'WorkSans-Medium',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'WorkSans-Regular',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontFamily: 'WorkSans-Light',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 80, // Espacio para el input flotante
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    fontFamily: 'WorkSans-Regular',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

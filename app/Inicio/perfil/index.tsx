import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StorageHelper, User } from '@/utils/storage';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import DefaultAvatar from '../../../components/DefaultAvatar';

export default function ModificarPerfilScreen() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    username: '',
    descripcion: '',
    avatar: 'default'
  });

  // Cargar datos del usuario actual al montar el componente
  useEffect(() => {
    loadUserData();
  }, []);

  // Manejar eventos del teclado
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height); // Guardar altura del teclado
      // Hacer scroll automático para mostrar la descripción completamente sobre el teclado
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 350, animated: true });
      }, 100);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0); // Volver a posición original
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const loadUserData = async () => {
    try {
      const user = await StorageHelper.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setFormData({
          nombre: user.nombre,
          apellidos: user.apellidos,
          username: user.username,
          descripcion: user.descripcion || '',
          avatar: user.avatar || 'default'
        });
      } else {
        Alert.alert('Error', 'No hay sesión activa');
        router.replace('/(tabs)/chat-general' as any);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
      router.replace('/(tabs)/chat-general' as any);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'No hay usuario activo');
      return;
    }

    // Validación básica (solo nombre, apellidos y username)
    if (!formData.nombre.trim() || !formData.apellidos.trim() || !formData.username.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    setIsLoading(true);
    
    try {
      // Actualizar usuario usando StorageHelper
      const updatedUser = await StorageHelper.updateUser(currentUser.id, {
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        username: formData.username.trim(),
        descripcion: formData.descripcion.trim(),
        avatar: formData.avatar
      });

      if (updatedUser) {
        setCurrentUser(updatedUser);
        setIsLoading(false);
        Alert.alert(
          '✅ Perfil Actualizado', 
          'Tu perfil ha sido actualizado correctamente.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)' as any)
            }
          ]
        );
      }
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
    }
  };

  // Función para solicitar permisos y abrir la cámara
  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tu cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error al abrir la cámara:', error);
      Alert.alert('Error', 'No se pudo acceder a la cámara');
    }
  };

  // Función para solicitar permisos y abrir la galería
  const openGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tu galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error al abrir la galería:', error);
      Alert.alert('Error', 'No se pudo acceder a la galería');
    }
  };

  const handleChangeAvatar = () => {
    const hasCustomAvatar = formData.avatar !== 'default';
    
    const options: any[] = [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cámara', onPress: openCamera },
      { text: 'Galería', onPress: openGallery }
    ];

    // Añadir opción de quitar imagen si no es la imagen por defecto
    if (hasCustomAvatar) {
      options.splice(1, 0, { 
        text: 'Quitar imagen', 
        style: 'destructive',
        onPress: () => {
          setFormData(prev => ({ ...prev, avatar: 'default' }));
          Alert.alert('Imagen eliminada', 'Tu imagen de perfil ha sido eliminada');
        }
      });
    }

    Alert.alert(
      'Cambiar Avatar',
      '¿Cómo quieres cambiar tu avatar?',
      options
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)' as any)}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modificar Perfil</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {formData.avatar && formData.avatar !== 'default' ? (
              <Image source={{ uri: formData.avatar }} style={styles.avatar} />
            ) : (
              <DefaultAvatar size={120} />
            )}
            <TouchableOpacity style={styles.editAvatarButton} onPress={handleChangeAvatar}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarText}>Toca para cambiar tu avatar</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Información Básica</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
              placeholder="Tu nombre"
              editable={false}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellidos</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={formData.apellidos}
              onChangeText={(value) => handleInputChange('apellidos', value)}
              placeholder="Tus apellidos"
              editable={false}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              placeholder="Tu username"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={[styles.formSection, styles.descriptionContainer, { transform: [{ translateY: 0 }] }]}>
          <Text style={styles.sectionTitle}>Información Adicional</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.descripcion}
              onChangeText={(value) => handleInputChange('descripcion', value)}
              placeholder="Cuéntanos sobre ti..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Espacio dinámico para el teclado */}
        {keyboardHeight > 0 && (
          <View style={[styles.keyboardSpacer, { height: keyboardHeight + 20 }]} />
        )}

        <View style={styles.buttonContainer}>
          <Pressable style={styles.cancelButton} onPress={() => router.replace('/(tabs)' as any)}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
          <Pressable style={[styles.saveButton, isLoading && styles.buttonDisabled]} onPress={handleSave} disabled={isLoading}>
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'WorkSans-Black',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 0,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000000',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  avatarText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'WorkSans-Medium',
  },
  formSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    fontFamily: 'WorkSans-Black',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'WorkSans-Medium',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'WorkSans-Medium',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  keyboardSpacer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingVertical: 30,
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'WorkSans-Medium',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'WorkSans-Medium',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  readOnlyInput: {
    backgroundColor: '#f8f8f8',
    borderColor: '#e0e0e0',
    color: '#999',
  },
});

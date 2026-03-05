import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StorageHelper, User } from '../../utils/storage';
import DefaultAvatar from '../../components/DefaultAvatar';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await StorageHelper.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
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

      if (!result.canceled && result.assets[0] && currentUser) {
        const updatedUser = { ...currentUser, avatar: result.assets[0].uri };
        await StorageHelper.updateUser(currentUser.id, { avatar: result.assets[0].uri });
        await StorageHelper.setCurrentUser(updatedUser);
        setCurrentUser(updatedUser);
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

      if (!result.canceled && result.assets[0] && currentUser) {
        const updatedUser = { ...currentUser, avatar: result.assets[0].uri };
        await StorageHelper.updateUser(currentUser.id, { avatar: result.assets[0].uri });
        await StorageHelper.setCurrentUser(updatedUser);
        setCurrentUser(updatedUser);
      }
    } catch (error) {
      console.error('Error al abrir la galería:', error);
      Alert.alert('Error', 'No se pudo acceder a la galería');
    }
  };

  const handleChangeAvatar = () => {
    const hasCustomAvatar = currentUser?.avatar && currentUser.avatar !== 'default';
    
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
        onPress: async () => {
          if (currentUser) {
            const updatedUser = { ...currentUser, avatar: 'default' };
            await StorageHelper.updateUser(currentUser.id, { avatar: 'default' });
            await StorageHelper.setCurrentUser(updatedUser);
            setCurrentUser(updatedUser);
            Alert.alert('Imagen eliminada', 'Tu imagen de perfil ha sido eliminada');
          }
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {currentUser?.avatar && currentUser.avatar !== 'default' ? (
              <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
            ) : (
              <DefaultAvatar size={90} />
            )}
            <TouchableOpacity style={styles.editAvatarButton} onPress={handleChangeAvatar}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>   
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{currentUser?.username || 'Usuario'}</Text>
            <Text style={styles.userStatus}>Activo</Text>
            {currentUser?.descripcion && (
              <Text style={styles.userDescription}>{currentUser.descripcion}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Chats</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Amigos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Visitas</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>MI CUENTA</Text>
          
          <Pressable style={styles.menuItem} onPress={() => router.push('Inicio/perfil' as any)}>
            <View style={styles.menuIcon}>
              <Ionicons name="person" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Modificar Perfil</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="information-circle" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Datos Adicionales</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push('Inicio/ajustes' as any)}>
            <View style={styles.menuIcon}>
              <Ionicons name="settings" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Ajustes</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </Pressable>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>SOCIAL</Text>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="people" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Amigos</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="notifications" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Notificaciones</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </Pressable>
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: '#ffffff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000000',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  avatarText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'WorkSans-Medium',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    fontFamily: 'WorkSans-Black',
  },
  userStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'WorkSans-Medium',
  },
  userDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'WorkSans-Light',
    fontStyle: 'italic',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    fontFamily: 'WorkSans-Black',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'WorkSans-Medium',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 15,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 15,
    marginLeft: 5,
    fontFamily: 'WorkSans-Medium',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'WorkSans-Medium',
  },
});

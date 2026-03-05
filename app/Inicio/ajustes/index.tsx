import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Switch,
  Linking,
  AppState
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StorageHelper } from '@/utils/storage';
import * as ImagePicker from 'expo-image-picker';

export default function AjustesScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  // Verificar el estado actual de los permisos al cargar la pantalla y al volver de ajustes
  useEffect(() => {
    checkCameraPermission();
    checkNotificationPermission();
    checkLocationPermission();
    
    // Escuchar cuando la aplicación vuelve a primer plano (compatible con iOS y Android)
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        // Cuando volvemos a la app, verificar si los permisos cambiaron
        setTimeout(() => {
          checkCameraPermission();
          checkNotificationPermission();
          checkLocationPermission();
        }, 500); // Pequeño delay para asegurar que los permisos se actualicen
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription?.remove();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.getCameraPermissionsAsync();
      // Establecer el estado real del permiso
      setCameraPermission(status === 'granted');
    } catch (error) {
      console.error('Error al verificar permiso de cámara:', error);
      setCameraPermission(false);
    }
  };

  const checkLocationPermission = async () => {
    try {
      // Por ahora la geolocalización no está implementada
      setLocationPermission(false);
    } catch (error) {
      console.error('Error al verificar permiso de ubicación:', error);
      setLocationPermission(false);
    }
  };

  const checkNotificationPermission = async () => {
    try {
      // Como expo-notifications no funciona en SDK 54+, usamos un sistema simulado
      // que imita el comportamiento del sistema operativo
      const savedPermission = await AsyncStorage.getItem('notificationPermission');
      setNotificationPermission(savedPermission === 'true');
    } catch (error) {
      console.error('Error al verificar permiso de notificaciones:', error);
      setNotificationPermission(false);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      // Como expo-notifications no funciona en SDK 54+, simulamos el diálogo del sistema
      // que imita el comportamiento de iOS y Android
      
      Alert.alert(
        'Permitir Notificaciones',
        'ChatRoomQR quiere enviarte notificaciones. ¿Permites que ChatRoomQR te envíe notificaciones?',
        [
          {
            text: 'No permitir',
            style: 'cancel',
            onPress: async () => {
              setNotificationPermission(false);
              await AsyncStorage.setItem('notificationPermission', 'false');
            }
          },
          {
            text: 'Permitir',
            onPress: async () => {
              setNotificationPermission(true);
              await AsyncStorage.setItem('notificationPermission', 'true');
              Alert.alert(
                'Notificaciones Activadas',
                'Ahora recibirás notificaciones de ChatRoomQR. Puedes desactivarlas en cualquier momento desde los ajustes de tu teléfono.',
                [{ text: 'OK' }]
              );
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error al solicitar permiso de notificaciones:', error);
      Alert.alert(
        'Error',
        'No se pudo solicitar el permiso de notificaciones. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleNotificationPermissionToggle = async (newValue: boolean) => {
    if (newValue) {
      // Siempre solicitar permiso directamente (compatible con iOS y Android)
      await requestNotificationPermission();
    } else {
      // Si se desactiva, enviar a ajustes del teléfono
      Alert.alert(
        'Desactivar Permiso de Notificaciones',
        'Para desactivar el permiso de notificaciones, serás redirigido a los ajustes del sistema. Busca ChatRoomQR > Permisos y desactiva Notificaciones manualmente.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => {
              // Mantener el switch activado si cancela
              setNotificationPermission(true);
            }
          },
          {
            text: 'Ir a Ajustes',
            onPress: async () => {
              try {
                // Abrir ajustes de la aplicación (compatible con iOS y Android)
                await Linking.openSettings();
                // Marcar como desactivado inmediatamente y guardar en storage
                setNotificationPermission(false);
                await AsyncStorage.setItem('notificationPermission', 'false');
              } catch (error) {
                Alert.alert(
                  'Error',
                  'No se pudo abrir los ajustes. Por favor, ve manualmente a Ajustes > Aplicaciones > ChatRoomQR > Permisos.',
                  [{ text: 'OK' }]
                );
                setNotificationPermission(true);
              }
            }
          }
        ]
      );
    }
  };

  const handleLocationPermissionToggle = async (newValue: boolean) => {
    if (newValue) {
      // Por ahora solo mostrar mensaje de que no está implementado
      Alert.alert(
        'Próximamente',
        'La funcionalidad de geolocalización estará disponible en futuras actualizaciones.',
        [{ text: 'OK' }]
      );
      // Mantener el switch desactivado
      setLocationPermission(false);
    } else {
      // Si se desactiva, enviar a ajustes del teléfono
      Alert.alert(
        'Desactivar Permiso de Ubicación',
        'Para desactivar el permiso de ubicación, serás redirigido a los ajustes del sistema. Busca ChatRoomQR > Permisos y desactiva Ubicación manualmente.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => {
              // Mantener el switch activado si cancela
              setLocationPermission(true);
            }
          },
          {
            text: 'Ir a Ajustes',
            onPress: async () => {
              try {
                // Abrir ajustes de la aplicación
                await Linking.openSettings();
                setLocationPermission(false);
              } catch (error) {
                Alert.alert(
                  'Error',
                  'No se pudo abrir los ajustes. Por favor, ve manualmente a Ajustes > Aplicaciones > ChatRoomQR > Permisos.',
                  [{ text: 'OK' }]
                );
                setLocationPermission(true);
              }
            }
          }
        ]
      );
    }
  };

  const requestCameraPermission = async () => {
    try {
      // Siempre solicitar permiso directamente (sin verificar primero)
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status === 'granted') {
        setCameraPermission(true);
        Alert.alert(
          'Permiso Concedido',
          'Ahora puedes usar la cámara para escanear códigos QR.',
          [{ text: 'OK' }]
        );
      } else {
        setCameraPermission(false);
        // No mostrar mensaje de permiso denegado, simplemente mantener el switch desactivado
        // El usuario puede intentar activarlo de nuevo si cambia de opinión
      }
    } catch (error) {
      console.error('Error al solicitar permiso de cámara:', error);
      Alert.alert(
        'Error',
        'No se pudo solicitar el permiso de la cámara. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCameraPermissionToggle = async (newValue: boolean) => {
    if (newValue) {
      // Siempre solicitar permiso directamente (compatible con iOS y Android)
      await requestCameraPermission();
    } else {
      // Si se desactiva, enviar a ajustes del teléfono
      Alert.alert(
        'Desactivar Permiso de Cámara',
        'Para desactivar el permiso de la cámara, serás redirigido a los ajustes del sistema. Busca ChatRoomQR > Permisos y desactiva Cámara manualmente.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => {
              // Mantener el switch activado si cancela
              setCameraPermission(true);
            }
          },
          {
            text: 'Ir a Ajustes',
            onPress: async () => {
              try {
                // Abrir ajustes de la aplicación (compatible con iOS y Android)
                await Linking.openSettings();
                // Marcar como desactivado inmediatamente
                setCameraPermission(false);
              } catch (error) {
                Alert.alert(
                  'Error',
                  'No se pudo abrir los ajustes. Por favor, ve manualmente a Ajustes > Aplicaciones > ChatRoomQR > Permisos.',
                  [{ text: 'OK' }]
                );
                setCameraPermission(true);
              }
            }
          }
        ]
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión? Tendrás que iniciar sesión de nuevo.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await StorageHelper.logout();
              Alert.alert(
                'Sesión Cerrada',
                'Has cerrado sesión correctamente.',
                [
                  {
                    text: 'OK',
                    onPress: () => router.replace('/auth/login' as any)
                  }
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y se perderán todos tus datos.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirmación Requerida',
              'Para eliminar tu cuenta, por favor contacta con soporte@chatroomqr.com',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => {
          router.push('/(tabs)' as any);
          setTimeout(() => router.replace('/(tabs)' as any), 50);
        }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Ajustes</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCIAS</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="notifications" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Notificaciones</Text>
            <Switch 
              value={notificationPermission} 
              onValueChange={handleNotificationPermissionToggle} 
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="camera" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Permisos de la Cámara</Text>
            <Switch 
              value={cameraPermission} 
              onValueChange={handleCameraPermissionToggle} 
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="location" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Localización</Text>
            <Switch 
              value={locationPermission} 
              onValueChange={handleLocationPermissionToggle} 
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="moon" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Modo Oscuro</Text>
            <Switch value={false} onValueChange={() => {}} />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="language" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Idioma</Text>
            <Text style={styles.menuValue}>Español</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRIVACIDAD Y SEGURIDAD</Text>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="lock-closed" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Cambiar Contraseña</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="shield-checkmark" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Privacidad</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOPORTE</Text>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="help-circle" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Ayuda</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="document-text" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Términos y Condiciones</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="shield" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuText}>Política de Privacidad</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCIONES</Text>
          
          <Pressable style={[styles.menuItem, styles.dangerItem]} onPress={handleLogout}>
            <View style={[styles.menuIcon, styles.dangerIcon]}>
              <Ionicons name="log-out" size={20} color="#FF3B30" />
            </View>
            <Text style={[styles.menuText, styles.dangerText]}>Cerrar Sesión</Text>
            <Ionicons name="chevron-forward" size={16} color="#FF3B30" />
          </Pressable>

          <Pressable style={[styles.menuItem, styles.dangerItem]} onPress={handleDeleteAccount}>
            <View style={[styles.menuIcon, styles.dangerIcon]}>
              <Ionicons name="trash" size={20} color="#FF3B30" />
            </View>
            <Text style={[styles.menuText, styles.dangerText]}>Eliminar Cuenta</Text>
            <Ionicons name="chevron-forward" size={16} color="#FF3B30" />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>ChatRoomQR v0.1.0</Text>
          <Text style={styles.copyrightText}>© 2026 ChatRoomQR</Text>
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
    paddingTop: 20,
  },
  section: {
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
  menuValue: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'WorkSans-Medium',
  },
  dangerItem: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#ffe5e5',
  },
  dangerIcon: {
    backgroundColor: '#ffe5e5',
  },
  dangerText: {
    color: '#FF3B30',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'WorkSans-Medium',
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'WorkSans-Medium',
  },
});

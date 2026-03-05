import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StorageHelper } from '@/utils/storage';

export default function AjustesScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
        <Pressable style={styles.backButton} onPress={() => router.replace('/(tabs)/chat-general' as any)}>
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
            <Switch value={true} onValueChange={() => {}} />
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

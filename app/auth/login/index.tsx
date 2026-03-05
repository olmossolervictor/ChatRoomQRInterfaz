import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { StorageHelper } from '../../../utils/storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    // Cerrar teclado antes de procesar
    Keyboard.dismiss();
    
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    
    try {
      // Validar credenciales con StorageHelper
      const user = await StorageHelper.validateLogin(username.trim(), password.trim());
      
      if (user) {
        // Guardar sesión actual
        await StorageHelper.setCurrentUser(user);
        
        setIsLoading(false);
        Alert.alert(
          '✅ Bienvenido', 
          `¡Hola ${user.nombre}! Has iniciado sesión correctamente.`,
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)/chat-general' as any)
            }
          ]
        );
      } else {
        setIsLoading(false);
        Alert.alert(
          'Error de Inicio de Sesión',
          'El usuario o contraseña son incorrectos. Por favor, verifica tus datos e intenta de nuevo.',
          [{ text: 'OK' }]
        );
      }
      
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'No se pudo iniciar sesión. Intenta de nuevo más tarde.');
    }
  };

  const goToRegister = () => {
    router.push('/auth/register');
  };

  // Función de diagnóstico para desarrollo
  const diagnoseStorage = async () => {
    try {
      const diagnosis = await StorageHelper.diagnoseStorage();
      console.log('Diagnóstico Storage:', diagnosis);
      Alert.alert(
        'Diagnóstico de Almacenamiento',
        `Disponible: ${diagnosis.available ? 'Sí' : 'No'}\nUsuarios: ${diagnosis.usersCount}\nSesión activa: ${diagnosis.hasCurrentUser ? 'Sí' : 'No'}\n${diagnosis.error || ''}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error en diagnóstico:', error);
      Alert.alert('Error', 'No se pudo realizar el diagnóstico');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>ChatRoomQR</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Usuario</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Ingresa tu usuario"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                textContentType="username"
                importantForAutofill="yes"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  // Mover foco al siguiente campo
                  // passwordInputRef.current?.focus();
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Ingresa tu contraseña"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                importantForAutofill="yes"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta?</Text>
            <TouchableOpacity onPress={goToRegister}>
              <Text style={styles.link}>Regístrate</Text>
            </TouchableOpacity>
          </View>

          {/* Botón de diagnóstico para desarrollo */}
          <TouchableOpacity style={styles.diagnosticButton} onPress={diagnoseStorage}>
            <Text style={styles.diagnosticButtonText}>🔧 Diagnóstico</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
    fontFamily: 'WorkSans-Black',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
    fontFamily: 'WorkSans-Light',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    fontFamily: 'WorkSans-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    fontFamily: 'WorkSans-Medium',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'WorkSans-Medium',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
    fontFamily: 'WorkSans-Medium',
  },
  link: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    fontFamily: 'WorkSans-Medium',
  },
  diagnosticButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  diagnosticButtonText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'WorkSans-Medium',
  },
});

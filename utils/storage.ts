import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  nombre: string;
  apellidos: string;
  username: string;
  correo: string;
  contraseña: string;
  fechaNacimiento: string;
  descripcion?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const STORAGE_KEYS = {
  USERS: '@chatroom_users',
  CURRENT_USER: '@chatroom_current_user',
} as const;

export class StorageHelper {
  // Verificar si AsyncStorage está disponible
  private static async isAsyncStorageAvailable(): Promise<boolean> {
    try {
      await AsyncStorage.getItem('test_key');
      return true;
    } catch (error) {
      console.warn('AsyncStorage no disponible:', error);
      return false;
    }
  }

  // Guardar un nuevo usuario
  static async saveUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      // Verificar disponibilidad de AsyncStorage
      if (!(await this.isAsyncStorageAvailable())) {
        throw new Error('El almacenamiento no está disponible en este dispositivo');
      }

      const users = await this.getUsers();
      
      // Verificar si el username o correo ya existen
      const existingUser = users.find(
        u => u.username === user.username || u.correo === user.correo
      );
      
      if (existingUser) {
        throw new Error('El username o correo ya están registrados');
      }

      const newUser: User = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      return newUser;
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      throw error;
    }
  }

  // Obtener todos los usuarios
  static async getUsers(): Promise<User[]> {
    try {
      if (!(await this.isAsyncStorageAvailable())) {
        console.warn('AsyncStorage no disponible, retornando array vacío');
        return [];
      }

      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      if (!usersJson) return [];
      
      try {
        const parsed = JSON.parse(usersJson);
        return Array.isArray(parsed) ? parsed : [];
      } catch (parseError) {
        console.error('Error al parsear usuarios:', parseError);
        return [];
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }

  // Validar login
  static async validateLogin(username: string, contraseña: string): Promise<User | null> {
    try {
      if (!(await this.isAsyncStorageAvailable())) {
        throw new Error('El almacenamiento no está disponible');
      }

      const users = await this.getUsers();
      const user = users.find(
        u => (u.username === username || u.correo === username) && u.contraseña === contraseña
      );
      return user || null;
    } catch (error) {
      console.error('Error al validar login:', error);
      return null;
    }
  }

  // Guardar usuario actual (sesión)
  static async setCurrentUser(user: User): Promise<void> {
    try {
      if (!(await this.isAsyncStorageAvailable())) {
        throw new Error('El almacenamiento no está disponible');
      }

      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error al guardar usuario actual:', error);
      throw error;
    }
  }

  // Obtener usuario actual
  static async getCurrentUser(): Promise<User | null> {
    try {
      if (!(await this.isAsyncStorageAvailable())) {
        console.warn('AsyncStorage no disponible, retornando null');
        return null;
      }

      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!userJson) return null;
      
      try {
        return JSON.parse(userJson);
      } catch (parseError) {
        console.error('Error al parsear usuario actual:', parseError);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }

  // Cerrar sesión
  static async logout(): Promise<void> {
    try {
      if (!(await this.isAsyncStorageAvailable())) {
        throw new Error('El almacenamiento no está disponible');
      }

      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Actualizar datos de usuario
  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      if (!(await this.isAsyncStorageAvailable())) {
        throw new Error('El almacenamiento no está disponible');
      }

      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('Usuario no encontrado');
      }

      users[userIndex] = { ...users[userIndex], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // Actualizar también el usuario actual si es el mismo
      const currentUser = await this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        await this.setCurrentUser(users[userIndex]);
      }

      return users[userIndex];
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  // Limpiar todos los datos (para desarrollo)
  static async clearAllData(): Promise<void> {
    try {
      if (!(await this.isAsyncStorageAvailable())) {
        throw new Error('El almacenamiento no está disponible');
      }

      await AsyncStorage.removeItem(STORAGE_KEYS.USERS);
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (error) {
      console.error('Error al limpiar datos:', error);
      throw error;
    }
  }

  // Método de diagnóstico
  static async diagnoseStorage(): Promise<{available: boolean; usersCount: number; hasCurrentUser: boolean; error?: string}> {
    try {
      const available = await this.isAsyncStorageAvailable();
      if (!available) {
        return { available: false, usersCount: 0, hasCurrentUser: false, error: 'AsyncStorage no disponible' };
      }

      const users = await this.getUsers();
      const currentUser = await this.getCurrentUser();
      
      return {
        available: true,
        usersCount: users.length,
        hasCurrentUser: !!currentUser
      };
    } catch (error) {
      return {
        available: false,
        usersCount: 0,
        hasCurrentUser: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TouchableOpacity, Alert, Dimensions, useWindowDimensions, Animated as RNAnimated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { StorageHelper, User } from '../../utils/storage';
import DefaultAvatar from '../../components/DefaultAvatar';
import HomeScreenScroll from '../../components/HomeScreenScroll';
import * as ImagePicker from 'expo-image-picker';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatGeneralScreen from './chat-general';
import ChatsPrivadosScreen from './chats-privados';

const { width } = Dimensions.get('window');

// Constants para las páginas
const PAGE = {
  PERFIL: 0,
  CHAT_GENERAL: 1,
  CHATS_PRIVADOS: 2,
};

const PAGE_HPAD = 0;

export default function HomeScreen() {
  const router = useRouter();
  const params = useGlobalSearchParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(PAGE.CHAT_GENERAL); // Iniciar directamente en Chat General
  
  const { width: screenWidth } = useWindowDimensions();
  type AnimatedScrollViewRef = React.ComponentRef<typeof Animated.ScrollView>;
  const scrollRef = useRef<AnimatedScrollViewRef>(null);
  const isInitialized = useRef(false);
  
  const progress = useSharedValue<number>(PAGE.CHAT_GENERAL);
  const insets = useSafeAreaInsets();

  // Animaciones para los tabs
  const perfilOpacity = useRef(new RNAnimated.Value(currentPage === PAGE.PERFIL ? 1 : 0.5)).current;
  const chatOpacity = useRef(new RNAnimated.Value(currentPage === PAGE.CHAT_GENERAL ? 1 : 0.5)).current;
  const privadosOpacity = useRef(new RNAnimated.Value(currentPage === PAGE.CHATS_PRIVADOS ? 1 : 0.5)).current;

  // Animar opacidad de los tabs cuando cambia la página (rápido pero visible)
  useEffect(() => {
    RNAnimated.timing(perfilOpacity, {
      toValue: currentPage === PAGE.PERFIL ? 1 : 0.5,
      duration: 150,
      useNativeDriver: true,
    }).start();

    RNAnimated.timing(chatOpacity, {
      toValue: currentPage === PAGE.CHAT_GENERAL ? 1 : 0.5,
      duration: 150,
      useNativeDriver: true,
    }).start();

    RNAnimated.timing(privadosOpacity, {
      toValue: currentPage === PAGE.CHATS_PRIVADOS ? 1 : 0.5,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [currentPage]);

  const BOTTOM_BAR_HEIGHT = 80;
  const BOTTOM_BAR_BOTTOM = insets.bottom;
  const CONTENT_BOTTOM_PAD = BOTTOM_BAR_BOTTOM + BOTTOM_BAR_HEIGHT + 16;

  const onScroll = useAnimatedScrollHandler({ 
    onScroll: (e) => {
      const currentX = e.contentOffset.x;
      progress.value = currentX / screenWidth;
    }
  }, [screenWidth]);

  const goTo = (next: number) => {
    setCurrentPage(next);
    scrollRef.current?.scrollTo({ 
      x: next * screenWidth, 
      animated: true
    });
  };

  const onMomentumEnd = (e: any) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    const velocity = e.nativeEvent.velocity?.x || 0;
    console.log('onMomentumEnd - page:', page, 'currentPage:', currentPage, 'velocity:', velocity);
    
    // Solo permitir páginas válidas y cambios de una página
    if (page >= 0 && page <= 2) {
      const pageDiff = Math.abs(page - currentPage);
      
      // Permitir cambio si es a una página adyacente
      if (pageDiff === 1) {
        setCurrentPage(page);
      } else if (pageDiff > 1) {
        // Si intenta saltar más de una página, ir a la más cercana
        const targetPage = page > currentPage ? currentPage + 1 : currentPage - 1;
        if (targetPage >= 0 && targetPage <= 2) {
          setCurrentPage(targetPage);
          scrollRef.current?.scrollTo({ 
            x: targetPage * screenWidth, 
            animated: true 
          });
        }
      }
      // Si pageDiff === 0, no hacer nada (se quedó en la misma página)
    }
  };

  // Inicialización en Chat General solo al montar
  useEffect(() => {
    if (!isInitialized.current) {
      // Iniciar directamente en Chat General sin animación (solo la primera vez)
      setCurrentPage(PAGE.CHAT_GENERAL);
      progress.value = PAGE.CHAT_GENERAL;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: PAGE.CHAT_GENERAL * screenWidth, animated: false });
        isInitialized.current = true;
      }, 50);
    }
  }, []); // Solo se ejecuta al montar

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
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Contenido principal */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate={0.95}
        snapToInterval={screenWidth}
        contentContainerStyle={{ backgroundColor: '#f5f5f5', width: screenWidth * 3 }}
        overScrollMode="never"
      >
        {/* PAGE 1: PERFIL */}
        <HomeScreenScroll
          width={screenWidth}
          backgroundColor="#f5f5f5"
          contentBottomPad={CONTENT_BOTTOM_PAD}
          pageHpad={PAGE_HPAD}
          
        >
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
              
              <Pressable style={styles.menuItem} onPress={() => router.push('/Inicio/perfil' as any)}>
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

              <Pressable style={styles.menuItem} onPress={() => router.push('/Inicio/ajustes' as any)}>
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
        </HomeScreenScroll>

        {/* PAGE 2: CHAT GENERAL */}
        <HomeScreenScroll
          width={screenWidth}
          backgroundColor="#f8f9fa"
          contentBottomPad={CONTENT_BOTTOM_PAD}
          pageHpad={PAGE_HPAD}
        >
          <ChatGeneralScreen />
        </HomeScreenScroll>

        {/* PAGE 3: CHATS PRIVADOS */}
        <HomeScreenScroll
          width={screenWidth}
          backgroundColor="#f5f5f5"
          contentBottomPad={CONTENT_BOTTOM_PAD}
          pageHpad={PAGE_HPAD}
        >
          <ChatsPrivadosScreen />
        </HomeScreenScroll>
      </Animated.ScrollView>

      {/* Bottom Tab Bar */}
      <View style={[styles.bottomTabBar, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity 
          style={[styles.tabItem, currentPage === PAGE.PERFIL && styles.activeTabItem]}
          onPress={() => goTo(PAGE.PERFIL)}
        >
          <RNAnimated.View style={{ opacity: perfilOpacity }}>
            <Ionicons 
              name="person" 
              size={24} 
              color={currentPage === PAGE.PERFIL ? '#007AFF' : '#8E8E93'} 
            />
          </RNAnimated.View>
          <RNAnimated.View style={{ opacity: perfilOpacity }}>
            <Text style={[styles.tabLabel, currentPage === PAGE.PERFIL && styles.activeTabLabel]}>
              Perfil
            </Text>
          </RNAnimated.View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabItem, currentPage === PAGE.CHAT_GENERAL && styles.activeTabItem]}
          onPress={() => goTo(PAGE.CHAT_GENERAL)}
        >
          <RNAnimated.View style={{ opacity: chatOpacity }}>
            <Ionicons 
              name="people" 
              size={24} 
              color={currentPage === PAGE.CHAT_GENERAL ? '#007AFF' : '#8E8E93'} 
            />
          </RNAnimated.View>
          <RNAnimated.View style={{ opacity: chatOpacity }}>
            <Text style={[styles.tabLabel, currentPage === PAGE.CHAT_GENERAL && styles.activeTabLabel]}>
              Chat General
            </Text>
          </RNAnimated.View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabItem, currentPage === PAGE.CHATS_PRIVADOS && styles.activeTabItem]}
          onPress={() => goTo(PAGE.CHATS_PRIVADOS)}
        >
          <RNAnimated.View style={{ opacity: privadosOpacity }}>
            <Ionicons 
              name="chatbubbles" 
              size={24} 
              color={currentPage === PAGE.CHATS_PRIVADOS ? '#007AFF' : '#8E8E93'} 
            />
          </RNAnimated.View>
          <RNAnimated.View style={{ opacity: privadosOpacity }}>
            <Text style={[styles.tabLabel, currentPage === PAGE.CHATS_PRIVADOS && styles.activeTabLabel]}>
              Chats Privados
            </Text>
          </RNAnimated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingTop: 12,
  },
  activeTabItem: {
    // El estilo activo se maneja con el color del icono y texto
  },
  tabLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 4,
    fontFamily: 'WorkSans-Medium',
  },
  activeTabLabel: {
    color: '#007AFF',
    fontFamily: 'WorkSans-SemiBold',
  },
  page: {
    width: width,
    flex: 1,
  },
  pagePerfil: {
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

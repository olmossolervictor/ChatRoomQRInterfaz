import { Slot, SplashScreen, Stack } from "expo-router"
import "../global.css"
import {useFonts} from 'expo-font'
import React, { useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const RootLayout = () => {
    const [fontsLoaded, error] =useFonts({
    'WorkSans-Black':require('../assets/fonts/WorkSans-Black.ttf'),
    'WorkSans-Light':require('../assets/fonts/WorkSans-Light.ttf'), 
    'WorkSans-Medium':require('../assets/fonts/WorkSans-Medium.ttf')  
  });

  useEffect(()=>{
    if ( error )throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error])
   
  if (!fontsLoaded && !error) return null;
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <Stack 
        screenOptions={{
          headerShown: false,
          // Configuración de transición para mejor fluidez
          animation: 'slide_from_right',
          animationDuration: 300,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen name="/(tabs)" />
        <Stack.Screen 
          name="auth/login" 
          options={{
            animation: 'slide_from_right',
            animationDuration: 350,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen 
          name="auth/register" 
          options={{
            animation: 'slide_from_right',
            animationDuration: 350,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen 
          name="perfil" 
          options={{
            animation: 'slide_from_right',
            animationDuration: 400,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <Stack.Screen 
          name="ajustes" 
          options={{
            animation: 'slide_from_right',
            animationDuration: 400,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <Stack.Screen 
          name="chat-room" 
          options={{
            animation: 'slide_from_right',
            animationDuration: 400,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );   
};
export default RootLayout


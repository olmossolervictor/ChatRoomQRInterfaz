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
      <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="/(tabs)" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="perfil/modificar-perfil" />
        <Stack.Screen name="ajustes" />
      </Stack>
    </GestureHandlerRootView>
  );   
};
export default RootLayout


import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login/index" 
        options={{ 
          headerShown: false,
          title: 'Login'
        }} 
      />
      <Stack.Screen 
        name="register/index" 
        options={{ 
          headerShown: false,
          title: 'Registro'
        }} 
      />
    </Stack>
  );
}

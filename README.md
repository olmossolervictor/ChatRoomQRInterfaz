# ChatRoomQR 🎉

Aplicación móvil de chat social para discotecas que permite a los usuarios conectar y comunicarse dentro del mismo local mediante escaneo de códigos QR.

## 📱 Funcionalidades Principales

- **Registro y Login**: Sistema de autenticación con validación de edad (mayores de 18)
- **Menú Principal**: Gestión de perfil, datos adicionales y ajustes
- **Chat General**: Acceso mediante escaneo QR en la discoteca, requiere geolocalización
- **Chats Privados**: Conversaciones 1-a-1 que se eliminan automáticamente al salir del local
- **Sistema de Seguridad**: Logs temporales para cumplimiento legal y política de retención de 15 días

## 🏗️ Arquitectura Tecnológica

### Frontend
- **React Native**: Framework principal para la aplicación móvil
- **Expo Router**: Sistema de navegación basado en archivos
- **TypeScript**: Tipado estático para mayor robustez
- **Expo**: Plataforma de desarrollo y despliegue

### Backend
- **Spring Boot**: Framework Java para servidor REST API
- **Base de Datos**: Neon (PostgreSQL en la nube)
- **Sistema de Logs**: Auditoría y retención automatizada

## 🔄 Flujo de la Aplicación

1. **Inicio**: Login/Register con validación de datos
2. **Interfaz Principal**: Navegación por tabs (Inicio, Chat General, Chats Privados)
3. **En Discoteca**: Escanear QR → Acceso a chats → Geolocalización activa
4. **Salida**: Limpieza automática de chats privados

## 🔐 Características de Seguridad

- Sistema de auditoría para acceso autorizado
- Logs temporales con política de retención de 15 días
- Conversaciones eliminadas automáticamente
- Cumplimiento normativo para acceso policial

## 🚀 Comenzar

1. Instalar dependencias
   ```bash
   npm install
   ```

2. Iniciar aplicación
   ```bash
   npx expo start
   ```

## 📋 Requisitos del Sistema

- React Native 6.x+
- Expo 49+
- Node.js 18+
- Spring Boot 3.x+ (Backend)
- PostgreSQL (Neon)

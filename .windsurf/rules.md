---
description: Contexto y reglas para la aplicación ChatRoom QR
---

# ChatRoom QR - Contexto de la Aplicación

## Descripción del Proyecto
ChatRoom QR es una aplicación móvil React Native con Expo que permite escanear códigos QR para acceder a salas de chat en nightclubs. La aplicación verifica la ubicación del usuario para garantizar que se encuentre dentro del área del nightclub antes de permitir el acceso a las salas de chat.

## Arquitectura Principal

### Stack Tecnológico
- **Framework**: React Native con Expo SDK 54
- **Navegación**: Expo Router con Stack y Tab Navigator
- **Almacenamiento**: AsyncStorage con StorageHelper centralizado
- **Estilos**: StyleSheet nativo de React Native
- **TypeScript**: Tipado estricto con interfaces definidas
- **Estado Actual**: Sistema completo de autenticación y gestión de perfiles

### Estructura de Archivos Actual
```
app/
├── _layout.tsx                    # Layout principal (verifica sesión)
├── index.tsx                      # Redirect automático según sesión
├── auth/                          # Autenticación
│   ├── _layout.tsx               # Stack Navigator para auth
│   ├── login/
│   │   └── index.tsx             # Login con validación y AsyncStorage
│   └── register/
│       └── index.tsx             # Registro con validación completa
├── (tabs)/                        # Navegación con tabs principales
│   ├── _layout.tsx               # Tab Navigator con 3 tabs
│   ├── index.tsx                 # Tab Inicio (menú principal)
│   ├── chat-general/
│   │   └── index.tsx             # Chat general del nightclub
│   └── chats-privados/
│       └── index.tsx             # Lista de chats privados
├── Inicio/                        # Menú principal (fuera de tabs)
│   ├── index.tsx                 # Pantalla de inicio principal
│   ├── perfil/
│   │   └── index.tsx             # Modificar perfil con teclado inteligente
│   └── ajustes/
│       └── index.tsx             # Configuración y cerrar sesión
└── utils/
    └── storage.ts                # StorageHelper para AsyncStorage
```

## Funcionalidades Clave

### 1. Sistema de Autenticación
- **Login**: Validación de usuario con AsyncStorage y navegación
- **Registro**: Formulario completo con validación y guardado local
- **StorageHelper**: Clase centralizada para manejo de AsyncStorage
- **Sesión persistente**: Mantiene sesión activa entre usos

### 2. Navegación Principal
- **3 Tabs principales**: Inicio, Chat General, Chats Privados
- **Tab Inicio**: Menú principal con opciones de perfil y ajustes
- **Diseño consistente**: Iconos, colores y sombras unificadas
- **Navegación fluida**: `router.replace()` para compatibilidad multiplataforma

### 3. Gestión de Perfil
- **Modificar Perfil**: Edición de username y descripción
- **Campos de solo lectura**: Nombre y apellidos (estilo grisáceo)
- **Teclado inteligente**: Scroll automático y espacio dinámico
- **StorageHelper**: Actualización y validación de datos

### 4. Sistema de Ajustes
- **Configuración**: Preferencias y opciones de privacidad
- **Cerrar sesión**: Limpieza de sesión y redirect a login
- **Diseño modular**: Secciones organizadas y accesibles

## Configuraciones Importantes

### app.json
- Plugins: `expo-router`, `expo-camera`
- New Architecture enabled
- React Compiler experiment enabled
- Typed Routes experiment enabled
- Soporte para iOS, Android y Web

### Dependencias Clave
- `@react-native-async-storage/async-storage`: Almacenamiento local persistente
- `expo-router`: Navegación con Stack y Tab Navigator
- `@expo/vector-icons`: Iconos para la interfaz
- `react-native`: Componentes nativos y manejo de teclado
- `typescript`: Tipado estático y validación
- `expo-secure-store`: Almacenamiento seguro (futuro)

## Flujo Actual de la Aplicación

1. **Inicio (`/index`)**: Verifica sesión activa con StorageHelper
   - **Con sesión**: Redirect a `/(tabs)/index` (Inicio)
   - **Sin sesión**: Redirect a `auth/login`

2. **Autenticación (`/auth`)**: Stack Navigator para login y registro
   - **Login**: Validación de credenciales y creación de sesión
   - **Registro**: Formulario completo con validación y guardado local

3. **Navegación Principal (`/(tabs)`)**: 3 tabs principales
   - **Tab 1 - Inicio**: Menú principal con perfil y ajustes
   - **Tab 2 - Chat General**: Chat del nightclub (placeholder)
   - **Tab 3 - Chats Privados**: Lista de conversaciones (placeholder)

4. **Gestión de Perfil**: Acceso desde tab Inicio
   - **Modificar Perfil**: Edición con teclado inteligente
   - **Ajustes**: Configuración y cerrar sesión

## Estado de Implementación

### ✅ Completamente Implementado
- **Sistema de Autenticación**: Login, registro y gestión de sesión con StorageHelper
- **Navegación completa**: Stack Navigator para auth y Tab Navigator para principal
- **Gestión de Perfil**: Modificar perfil con teclado inteligente y campos de solo lectura
- **Sistema de Ajustes**: Configuración, cerrar sesión y eliminar cuenta
- **StorageHelper centralizado**: Manejo completo de AsyncStorage con validación
- **Diseño consistente**: Márgenes, iconos y colores unificados
- **Compatibilidad multiplataforma**: Uso de `router.replace()` y manejo de teclado

### ⏳ Por Implementar (Futuro)
- **Chat General**: Conexión real con backend y WebSocket
- **Chats Privados**: Sistema de conversaciones 1-a-1 funcional
- **Escáner QR**: Integración con cámara y validación de códigos
- **Verificación de ubicación**: GPS y geolocalización para nightclubs
- **Notificaciones push**: Mensajes en tiempo real
- **Integración con APIs**: Conexión con sistemas de nightclubs
- **Sistema de amigos**: Agregar usuarios y notificaciones de presencia

## Formato de Códigos QR Esperado (Futuro)
```json
{
  "type": "nightclub",
  "id": "unique-nightclub-id",
  "coords": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

## Reglas de Desarrollo - COMPATIBILIDAD MULTIPLATAFORMA

### 🚨 REGLA ORO (A partir de ahora)
**TODA funcionalidad que se implemente debe ser 100% compatible con iOS y Android.**
- Si algo no funciona igual en ambas plataformas, usar soluciones alternativas
- Probar siempre en ambos sistemas antes de considerar algo "completado"
- Documentar cualquier diferencia y proporcionar soluciones específicas si es necesario

### Convenciones de Código
- Usar TypeScript con tipado estricto
- Componentes funcionales con hooks
- Nombres descriptivos en español para variables y funciones
- Estilos separados con StyleSheet.create (actualmente)
- TailwindCSS disponible mediante NativeWind

### Buenas Prácticas Multiplataforma
- **Navegación**: Usar `router.replace()` en lugar de `router.back()` para compatibilidad Android
- **Almacenamiento**: AsyncStorage funciona en ambas plataformas pero requiere configuración específica
- **Componentes**: Verificar que cada componente funcione igual en iOS y Android
- **Permisos**: Manejar permisos de manera diferente según plataforma si es necesario
- **TextInput**: Propiedades específicas pueden comportarse diferente, probar en ambas plataformas

### Problemas Conocidos y Soluciones
1. **router.back()**: No funciona bien en Android → Usar `router.replace('/ruta')`
2. **AsyncStorage**: Requiere instalación y configuración específica para Expo
3. **Componentes nativos**: Siempre verificar compatibilidad en ambas plataformas
4. **Permisos**: iOS y Android tienen flujos diferentes para solicitar permisos

### Testing Multiplataforma
- Probar cada funcionalidad en iOS y Android
- Verificar navegación entre pantallas en ambas plataformas
- Test con diferentes tamaños de pantalla en ambos sistemas
- Validar que el almacenamiento persista en ambas plataformas

### Consideraciones de Diseño
- Paleta de colores actual: `#f5f5f5` (fondo), `#007AFF` (header), blanco (tarjetas)
- Iconos con emojis para desarrollo rápido
- Tarjetas con sombras y elevación
- Tipografía clara y legible

## Testing y Depuración
- Probar en dispositivos físicos para funcionalidad de cámara (cuando se implemente)
- Verificar navegación entre pantallas
- Test con diferentes tamaños de pantalla
- Validar permisos en iOS y Android (cuando se implementen)

## Próximos Pasos de Desarrollo
1. Implementar backend real para mensajería (WebSocket/Firebase)
2. Agregar verificación de ubicación con `expo-location` y GPS
3. Desarrollar sistema de autenticación y perfiles de usuario
4. Implementar almacenamiento persistente con `expo-secure-store`
5. Agregar notificaciones push para nuevos mensajes
6. Crear interfaz para configuración de perfiles
7. Integrar con APIs de nightclubs para información en tiempo real
8. Implementar funcionalidad de compartir QR
9. Agregar sistema de bloqueo y reporte de usuarios
10. Optimizar rendimiento y agregar tests unitarios

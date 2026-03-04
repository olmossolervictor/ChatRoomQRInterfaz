---
description: Contexto y reglas para la aplicación ChatRoom QR
---

# ChatRoom QR - Contexto de la Aplicación

## Descripción del Proyecto
ChatRoom QR es una aplicación móvil React Native con Expo que permite escanear códigos QR para acceder a salas de chat en nightclubs. La aplicación verifica la ubicación del usuario para garantizar que se encuentre dentro del área del nightclub antes de permitir el acceso a las salas de chat.

## Arquitectura Principal

### Stack Tecnológico
- **Framework**: React Native con Expo SDK 54
- **Navegación**: Expo Router con Stack Navigator
- **Escaneo QR**: Expo Camera (configurado pero no implementado)
- **Estilos**: StyleSheet nativo de React Native + TailwindCSS (NativeWind)
- **TypeScript**: Para tipado estático
- **Estado Actual**: Estructura básica con pantallas placeholder

### Estructura de Archivos Actual
```
app/
├── _layout.tsx                    # Layout principal (redirect a tabs)
├── index.tsx                      # Redirect a /home (antiguo)
├── (tabs)/                        # Navegación con tabs
│   ├── _layout.tsx               # Tab Navigator con 3 tabs principales
│   ├── chat-general/
│   │   └── index.tsx             # Chat general del nightclub
│   ├── scanner/
│   │   └── index.tsx             # Escáner QR funcional
│   └── chats-privados/
│       └── index.tsx             # Lista de chats privados
├── home/                          # Antiguo menú (obsoleto)
│   └── index.tsx
├── chat/                          # Antiguo chat placeholder (obsoleto)
│   └── index.tsx
├── qr/                            # Antiguo QR placeholder (obsoleto)
│   └── index.tsx
└── perfil/                        # Antiguo perfil placeholder (obsoleto)
    └── index.tsx
```

## Funcionalidades Clave

### 1. Navegación con Tabs
- Tab Navigator con 3 tabs principales: Chat General, Escáner QR, Chats Privados
- Navegación inferior con iconos de Ionicons
- Redirect automático desde `/index` a `/(tabs)/chat-general`
- Diseño moderno con sombras y colores consistentes

### 2. Pantallas Implementadas
- **Chat General**: Interfaz de chat con mensajes, entrada de texto y diseño moderno
- **Escáner QR**: Funcionalidad completa con cámara, permisos, validación de QR y overlay de escaneo
- **Chats Privados**: Lista de conversaciones con búsqueda, avatares y badges de no leídos

## Configuraciones Importantes

### app.json
- Plugins: `expo-router`, `expo-camera`
- New Architecture enabled
- React Compiler experiment enabled
- Typed Routes experiment enabled
- Soporte para iOS, Android y Web

### Dependencias Clave
- `expo-camera`: Configurado para funcionalidad de cámara y escaneo QR
- `expo-router`: Para navegación con Stack Navigator
- `expo-location`: Para servicios de ubicación (no implementado)
- `nativewind`: TailwindCSS para React Native
- `@react-navigation/*`: Paquetes de navegación adicionales
- `@gorhom/bottom-sheet`: Para bottom sheets (no implementado)
- `expo-secure-store`: Para almacenamiento seguro (no implementado)

## Flujo Actual de la Aplicación

1. **Inicio (`/index`)**: Redirect automático a `/(tabs)/chat-general`
2. **Navegación con Tabs**: 
   - **Tab 1 - Chat General**: Chat del nightclub actual con mensajes de ejemplo
   - **Tab 2 - Escáner QR**: Cámara funcional con overlay y validación de códigos QR
   - **Tab 3 - Chats Privados**: Lista de conversaciones privadas con búsqueda y badges
3. **Navegación**: Tabs inferiores con iconos y colores consistentes

## Estado de Implementación

### ✅ Implementado
- Navegación con tabs funcional
- Chat General con interfaz completa y mensajes de ejemplo
- Escáner QR totalmente funcional con cámara y validación
- Chats Privados con lista, búsqueda y badges
- Diseño moderno y consistente
- Manejo de permisos de cámara
- Validación de formatos QR

### ⏳ Por Implementar
- Conexión con backend real para chats
- Verificación de ubicación real con GPS
- Sistema de autenticación de usuarios
- Perfiles de usuario funcionales
- Almacenamiento persistente de mensajes
- Notificaciones push
- Integración con APIs de nightclubs

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

## Reglas de Desarrollo

### Convenciones de Código
- Usar TypeScript con tipado estricto
- Componentes funcionales con hooks
- Nombres descriptivos en español para variables y funciones
- Estilos separados con StyleSheet.create (actualmente)
- TailwindCSS disponible mediante NativeWind

### Buenas Prácticas
- Mantener estructura de archivos organizada
- Usar SafeAreaView para manejo de áreas seguras
- Implementar navegación tipada cuando sea posible
- Manejo proper de permisos (cuando se implementen funcionalidades)
- Validación de datos antes de procesar

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

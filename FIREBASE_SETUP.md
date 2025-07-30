# Configuración de Autenticación con Google Firebase

## Pasos para configurar Firebase en tu proyecto

### 1. Crear un proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Ingresa el nombre del proyecto (ej: "ecotask-app")
4. Deshabilita Google Analytics si no lo necesitas
5. Haz clic en "Crear proyecto"

### 2. Configurar Authentication

1. En la consola de Firebase, ve a "Authentication"
2. Haz clic en "Comenzar"
3. Ve a la pestaña "Sign-in method"
4. Haz clic en "Google" y habilitalo
5. Configura tu email de soporte
6. Guarda los cambios

### 3. Configurar tu aplicación web

1. En "Project settings" (engranaje en la barra lateral)
2. Baja hasta "Your apps" y haz clic en el ícono web `</>`
3. Registra tu app con un apodo (ej: "EcoTask Web")
4. No habilites Firebase Hosting por ahora
5. Copia la configuración que te aparece

### 4. Actualizar variables de entorno

Reemplaza los valores en tu archivo `.env` con la configuración real:

```env
VITE_FIREBASE_API_KEY=tu_api_key_real
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 5. Configurar dominios autorizados

1. En Firebase Authentication > Settings
2. En "Authorized domains", agrega:
   - `localhost` (para desarrollo)
   - Tu dominio de producción cuando lo tengas

### 6. Probar la configuración

1. Reinicia tu servidor de desarrollo: `npm run dev`
2. Haz clic en "Continuar con Google"
3. Si todo está bien configurado, aparecerá la ventana de Google

## Estructura de archivos creada

src/
├── config/
│   └── firebase.ts          # Configuración de Firebase
├── services/
│   └── authService.ts       # Servicio de autenticación
├── store/
│   └── useAuthStore.ts      # Store actualizado con Google Auth
└── types/
    └── index.ts             # Tipos actualizados

## Funcionalidades implementadas

✅ **Autenticación con Google**: Popup de Google completamente funcional
✅ **Persistencia de datos**: Los datos del usuario se guardan localmente
✅ **Manejo de errores**: Mensajes específicos para diferentes tipos de error
✅ **Integración con store**: Los datos de Google se integran con el sistema existente
✅ **Actualización de avatar**: La foto de Google se sincroniza automáticamente

## Debugging

Si tienes problemas, abre las DevTools del navegador y revisa:

1. **Console**: Verás logs detallados del proceso de autenticación
2. **Network**: Para ver si las llamadas a Firebase funcionan
3. **Application > Local Storage**: Para ver los datos guardados

## Notas de seguridad

- Las claves de Firebase pueden ser públicas en aplicaciones web
- Firebase tiene reglas de seguridad del lado del servidor
- Siempre configura dominios autorizados en producción

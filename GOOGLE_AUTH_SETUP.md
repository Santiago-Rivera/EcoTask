# 🔥 Configuración Rápida de Firebase

## ⚡ Pasos Esenciales (5 minutos)

### 1. Crear proyecto Firebase

1. Ve a <https://console.firebase.google.com/>
2. Clic en "Añadir proyecto"
3. Nombre: `ecotask-app` (o el que prefieras)
4. Deshabilita Google Analytics (opcional)
5. Crear proyecto

### 2. Configurar Authentication

1. En la consola → Authentication → Comenzar
2. Sign-in method → Google → Habilitar
3. Email de soporte: tu email
4. Guardar

### 3. Registrar tu aplicación web

1. Project settings (⚙️) → Scroll down → "Your apps"
2. Clic en `</>` (Web)
3. App nickname: `EcoTask Web`
4. **COPIAR** el objeto `firebaseConfig` que aparece

### 4. Actualizar tu proyecto

Reemplaza el contenido de tu archivo `.env`:

```env
VITE_FIREBASE_API_KEY=tu_apiKey_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_authDomain_aqui
VITE_FIREBASE_PROJECT_ID=tu_projectId_aqui
VITE_FIREBASE_STORAGE_BUCKET=tu_storageBucket_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messagingSenderId_aqui
VITE_FIREBASE_APP_ID=tu_appId_aqui
```

### 5. Probar

```bash
npm run dev
```

Haz clic en "Continuar con Google" y ¡listo! 🎉

---

## 🛡️ ¿Qué implementamos?

✅ **Autenticación Google completa**: Popup oficial de Google
✅ **Manejo de errores**: Mensajes específicos para el usuario  
✅ **Persistencia**: Los datos se guardan entre sesiones
✅ **Sincronización**: Foto y nombre de Google se importan automáticamente
✅ **UI profesional**: Notificaciones elegantes
✅ **Seguridad**: Configuración correcta de dominios

## 🔧 Funcionalidades implementadas

- **Firebase Auth**: Configuración completa con variables de entorno
- **Google Provider**: Popup de autenticación oficial
- **Error Handling**: Manejo específico de errores (popup cerrado, bloqueado, etc.)
- **Data Sync**: Los datos de Google (nombre, foto) se sincronizan automáticamente
- **Local Storage**: Persistencia de datos entre sesiones
- **Notifications**: Sistema de notificaciones para feedback del usuario

## 🎯 Lo que pasa cuando haces clic en "Continuar con Google"

1. Se abre popup oficial de Google
2. Eliges tu cuenta de Gmail
3. Google devuelve tus datos (nombre, email, foto)
4. Se crea/actualiza tu perfil en EcoTask
5. Se guarda todo localmente para futuras sesiones
6. ¡Estás dentro de la app! 🚀

## 📱 Archivos creados/modificados

📁 src/
├── 🆕 config/firebase.ts          # Configuración Firebase
├── 🆕 services/authService.ts     # Servicio Google Auth
├── 🆕 components/Notification.tsx # Notificaciones
├── 📝 store/useAuthStore.ts       # Store actualizado
├── 📝 types/index.ts              # Tipos actualizados
├── 📝 components/Auth/LoginForm.tsx
└── 📝 components/Auth/RegisterForm.tsx

¡Ya tienes todo listo! Solo necesitas configurar Firebase y estará funcionando perfectamente. 🔥

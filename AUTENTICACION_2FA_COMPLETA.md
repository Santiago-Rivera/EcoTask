# 🔐 Autenticación de Dos Factores (2FA) - Guía Completa

## 📋 Descripción General

EcoTask ahora incluye un sistema completo de autenticación de dos factores (2FA) que añade una capa adicional de seguridad al proceso de inicio de sesión. El sistema es compatible con aplicaciones autenticadoras estándar como Google Authenticator, Authy, Microsoft Authenticator, etc.

## ✨ Características Principales

### 🔧 **Implementación Técnica**

- **Algoritmo TOTP (RFC 6238)**: Códigos de tiempo limitado de 6 dígitos que cambian cada 30 segundos
- **Compatibilidad con navegadores**: Usa Web Crypto API nativa, sin dependencias de Node.js
- **QR Code Generation**: Genera códigos QR para configurar fácilmente aplicaciones autenticadoras
- **Códigos de respaldo**: 8 códigos de un solo uso para recuperación de acceso
- **Gestión por usuario**: Configuración individual para cada cuenta de usuario

### 🛡️ **Características de Seguridad**

- **Ventana de tolerancia**: Acepta códigos válidos ±30 segundos para compensar desfases de reloj
- **Códigos de un solo uso**: Los códigos de respaldo se eliminan después del uso
- **Validación estricta**: Solo acepta códigos de 6 dígitos numéricos
- **Almacenamiento seguro**: Configuración encriptada en localStorage por usuario
- **Migración automática**: Convierte configuraciones globales antiguas a por usuario

## 🚀 Cómo Configurar 2FA

### **Paso 1: Configurar 2FA**

1. Inicia sesión en EcoTask
2. Ve a **Configuración** → **Seguridad**
3. Haz clic en **"Configurar Autenticación de Dos Factores"**
4. El sistema generará:
   - Una clave secreta
   - Un código QR
   - 8 códigos de respaldo

### **Paso 2: Configurar tu Aplicación Autenticadora**

1. Abre tu aplicación autenticadora (Google Authenticator, Authy, etc.)
2. Escanea el código QR mostrado en pantalla
3. **O** ingresa manualmente la clave secreta
4. La aplicación comenzará a generar códigos de 6 dígitos

### **Paso 3: Verificar la Configuración**

1. Ingresa el código de 6 dígitos que muestra tu aplicación
2. Si es correcto, 2FA se activará automáticamente
3. **¡IMPORTANTE!** Guarda los códigos de respaldo en un lugar seguro

## 🔑 Cómo Usar 2FA en el Login

### **Proceso de Inicio de Sesión con 2FA**

1. Ingresa tu email y contraseña normalmente
2. Si tienes 2FA habilitado, verás una pantalla adicional
3. Abre tu aplicación autenticadora
4. Ingresa el código de 6 dígitos actual
5. **O** usa uno de tus códigos de respaldo
6. Haz clic en **"Verificar Código"**

### **Opciones de Verificación**

- **Código TOTP**: Código de 6 dígitos de tu aplicación autenticadora
- **Código de respaldo**: Código de 6 caracteres (se consume al usarlo)

## 📱 Aplicaciones Autenticadoras Compatibles

### **Recomendadas:**

- **Google Authenticator** (iOS/Android)
- **Authy** (iOS/Android/Desktop)
- **Microsoft Authenticator** (iOS/Android)
- **1Password** (iOS/Android/Desktop)
- **Bitwarden Authenticator** (iOS/Android)

### **Otras compatibles:**

- LastPass Authenticator
- Duo Mobile
- FreeOTP
- Aegis Authenticator (Android)

## 🔧 Gestión de Códigos de Respaldo

### **¿Qué son?**

- Códigos de 6 caracteres (ej: "A3B7F2")
- Se usan cuando no tienes acceso a tu aplicación autenticadora
- **Solo se pueden usar una vez**

### **¿Cuándo usarlos?**

- Perdiste tu teléfono
- La aplicación autenticadora no funciona
- Cambiaste de dispositivo

### **¿Cómo regenerarlos?**

- Ve a **Configuración** → **Seguridad**
- Haz clic en **"Regenerar Códigos de Respaldo"**
- Los códigos anteriores dejarán de funcionar

## 🛠️ Implementación Técnica

src/
├── components/
│   ├── Auth/
│   │   └── LoginForm.tsx          # Formulario con verificación 2FA
│   └── Settings/
│       └── UserSettings.tsx       # Configuración de 2FA
├── services/
│   └── twoFactorService.ts        # Servicio de gestión 2FA

### **Clases y Funciones Clave:**

#### **BrowserTOTP (LoginForm.tsx & UserSettings.tsx)**

```typescript
class BrowserTOTP {
  static generateSecret(): string
  static generateTOTP(secret: string, window?: number): Promise<string>
  static verify(token: string, secret: string): Promise<boolean>
  static keyuri(account: string, service: string, secret: string): string
  static base32Encode(data: Uint8Array): string
  static base32Decode(encoded: string): Uint8Array
}
```

#### **TwoFactorService (twoFactorService.ts)**

```typescript
class TwoFactorService {
  isTwoFAEnabled(email: string): boolean
  getTwoFAConfig(email: string): TwoFAConfig | null
  saveTwoFAConfig(email: string, secret: string, backupCodes: string[]): void
  disableTwoFA(email: string): void
  useBackupCode(email: string, code: string): boolean
  regenerateBackupCodes(email: string): string[]
  migrateOldConfig(email: string): void
}
```

### **Flujo de Datos:**

1. Usuario configura 2FA → UserSettings.tsx
2. Configuración se guarda → twoFactorService.ts
3. Usuario inicia sesión → LoginForm.tsx
4. Sistema verifica 2FA → twoFactorService.ts + BrowserTOTP
5. Acceso concedido/denegado

## 🔒 Seguridad y Mejores Prácticas

### **Para Usuarios:**

- ✅ Guarda los códigos de respaldo en un lugar seguro (no en el teléfono)
- ✅ Usa una aplicación autenticadora confiable
- ✅ Mantén tu aplicación autenticadora actualizada
- ✅ Considera usar aplicaciones con respaldo en la nube (Authy, 1Password)
- ❌ No compartas tu clave secreta ni códigos
- ❌ No hagas capturas de pantalla del código QR

### **Para Desarrolladores:**

- ✅ Implementa ventana de tolerancia para códigos TOTP
- ✅ Invalida códigos de respaldo después del uso
- ✅ Usa Web Crypto API para generación segura de números aleatorios
- ✅ Implementa migración automática de configuraciones
- ❌ No reutilices códigos TOTP
- ❌ No almacenes claves secretas en texto plano

## 🐛 Solución de Problemas

### **"Código incorrecto" constante:**

- Verifica que la hora de tu dispositivo sea correcta
- Asegúrate de usar el código más reciente
- Prueba con un código de respaldo

### **No puedo escanear el código QR:**

- Ingresa manualmente la clave secreta en tu aplicación
- Verifica que la aplicación sea compatible con TOTP

### **Perdí acceso a mi aplicación autenticadora:**

- Usa uno de tus códigos de respaldo
- Una vez dentro, regenera la configuración 2FA

### **Los códigos de respaldo no funcionan:**

- Asegúrate de escribir exactamente el código (mayúsculas/minúsculas)
- Recuerda que cada código solo funciona una vez

## 📧 Notificaciones por Email

El sistema envía automáticamente notificaciones por email cuando:

- ✅ Se habilita 2FA por primera vez
- ✅ Se usa un código de respaldo
- ✅ Se deshabilita 2FA
- ✅ Se regeneran códigos de respaldo

## 🔄 Migración de Datos

El sistema incluye migración automática para usuarios que tenían configuración 2FA anterior:

- Detecta configuración global antigua
- La convierte a configuración por usuario
- Limpia datos antiguos
- Mantiene compatibilidad total

## 📊 Estado de Implementación

| Característica | Estado | Descripción |
|---|---|---|
| ✅ Configuración 2FA | Completo | Setup completo con QR y códigos |
| ✅ Verificación en Login | Completo | Validación TOTP y códigos respaldo |
| ✅ Gestión por Usuario | Completo | Configuración individual por email |
| ✅ Códigos de Respaldo | Completo | Generación y uso de códigos únicos |
| ✅ Migración de Datos | Completo | Compatibilidad con configuraciones anteriores |
| ✅ Notificaciones Email | Completo | Alertas automáticas por email |
| ✅ UI/UX Completa | Completo | Interfaz intuitiva y responsiva |

---

## 🎯 Próximos Pasos

1. **Probar la configuración** completa de 2FA
2. **Verificar el flujo de login** con diferentes aplicaciones autenticadoras
3. **Probar códigos de respaldo** y regeneración
4. **Verificar notificaciones** por email
5. **Documentar cualquier problema** encontrado

¡El sistema de 2FA está completamente implementado y listo para usar! 🚀

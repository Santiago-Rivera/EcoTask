# 📧 Configurar Emails Reales con EmailJS en EcoTask

## 🎯 Objetivo

Actualmente EcoTask simula el envío de notificaciones por email. Con esta configuración, recibirás **emails reales** en tu cuenta de Gmail.

## ⚡ Estado Actual

- ✅ Sistema de notificaciones funcionando (simulado)
- 🧪 Emails se muestran en consola como prueba
- 📧 **¡Listo para configurar envío real!**

## 🚀 Configuración Paso a Paso

### Paso 1: Crear Cuenta en EmailJS (Gratis)

1. Ve a **<https://www.emailjs.com/>**
2. Haz clic en "Sign Up"
3. Crea tu cuenta con Google o email
4. Confirma tu email

### Paso 2: Configurar Servicio de Gmail

1. En el dashboard de EmailJS, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona **"Gmail"**
4. Haz clic en **"Connect Account"**
5. Autoriza EmailJS a enviar emails desde tu Gmail
6. **¡Importante!** Copia el **Service ID** (ejemplo: `service_abc123`)

### Paso 3: Crear Plantilla de Email

1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Configura la plantilla así:

#### Configuración de la Plantilla

Subject: {{subject}}

Content:
Hola {{to_name}},

{{message}}

Saludos verdes,
{{from_name}}

1. Guarda la plantilla

2. **¡Importante!** Copia el **Template ID** (ejemplo: `template_xyz789`)

### Paso 4: Obtener Public Key

1. Ve a **"Account"** → **"General"**
2. En la sección "API Keys"
3. **¡Importante!** Copia tu **Public Key** (ejemplo: `user_def456`)

### Paso 5: Configurar en EcoTask

1. Abre EcoTask en tu navegador
2. Abre la **consola** (presiona F12)
3. Ejecuta este comando con **tus datos reales**:

```javascript
notificationService.configureEmailJS(
  'tu_service_id',     // Service ID que copiaste
  'tu_template_id',    // Template ID que copiaste
  'tu_public_key'      // Public Key que copiaste
);
```

#### Ejemplo Real

```javascript
// Reemplaza con tus valores reales:
notificationService.configureEmailJS(
  'service_abc123',
  'template_xyz789', 
  'user_def456'
);
```

### Paso 6: ¡Probar

1. Ve a **Configuración** → **Notificaciones**
2. Haz clic en **"Probar Email"**
3. ¡Deberías recibir un email real en tu Gmail! 📧

## 🎉 ¡Listo! ¿Qué Cambia?

### Antes (Simulado)

- 🧪 Notificaciones solo en consola
- 📱 Alertas visuales temporales
- 🎭 Modo de prueba

### Después (Real)

- ✅ **Emails reales en tu Gmail**
- 📧 Notificaciones de tareas pendientes
- 🌍 Invitaciones a eventos ecológicos
- 👥 Alertas de grupos
- 📊 Resumen semanal (opcional)

## 📝 Notas Importantes

### Plan Gratuito de EmailJS

- ✅ **200 emails gratis por mes**
- ✅ **Suficiente para uso personal**
- ✅ **Sin tarjeta de crédito requerida**

### Seguridad

- 🔒 EmailJS es un servicio confiable usado por miles de developers
- 🛡️ Solo envía emails, no puede leer tu Gmail
- 🔐 Tus credenciales están seguras

### Troubleshooting

- ❌ **Error en configuración**: Verifica que copiaste bien los IDs
- 📧 **No llegan emails**: Revisa tu carpeta de Spam
- 🔄 **Resetear configuración**: Ejecuta `notificationService.quickSetup()` en consola

## 🆘 ¿Necesitas Ayuda?

### En la Consola del Navegador (F12)

```javascript
// Ver instrucciones completas:
notificationService.getSetupInstructions()

// Verificar si está configurado:
notificationService.isRealEmailEnabled()

// Configuración rápida (muestra instrucciones):
notificationService.quickSetup()
```

### En EcoTask

1. Ve a **Configuración** → **Notificaciones**
2. Haz clic en **"Configurar EmailJS"**
3. Se abrirá una guía visual completa

## 🎯 Una Vez Configurado

Tu EcoTask enviará emails reales para:

- ✅ **Recordatorios de tareas** importantes
- 🌍 **Invitaciones a eventos** ecológicos
- 👥 **Notificaciones de grupos**
- 📊 **Resumen semanal** de tu progreso ecológico

**¡Mantente conectado con tu impacto ambiental directamente en tu Gmail!** 🌱📧

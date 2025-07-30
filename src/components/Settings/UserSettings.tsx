import React, { useState } from 'react';
import { X, User, Bell, Shield, Palette, Globe, Mail, Send, Key, Copy, Check, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { notificationService } from '../../services/notificationService';
import { twoFactorService } from '../../services/twoFactorService';
import { useTranslation } from '../../hooks/useTranslation';
import QRCode from 'qrcode';
import AutoEmailConfig from './AutoEmailConfig';

// Implementación personalizada de TOTP que funciona en el navegador
class BrowserTOTP {
  private static base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  
  // Generar secreto seguro usando Web Crypto API
  static generateSecret(): string {
    const array = new Uint8Array(20);
    crypto.getRandomValues(array);
    return this.base32Encode(array);
  }
  
  // Codificar en base32
  static base32Encode(data: Uint8Array): string {
    let result = '';
    let bits = 0;
    let value = 0;
    
    for (let i = 0; i < data.length; i++) {
      value = (value << 8) | data[i];
      bits += 8;
      
      while (bits >= 5) {
        result += this.base32Chars[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }
    
    if (bits > 0) {
      result += this.base32Chars[(value << (5 - bits)) & 31];
    }
    
    return result;
  }
  
  // Decodificar de base32
  static base32Decode(encoded: string): Uint8Array {
    const cleanInput = encoded.toUpperCase().replace(/[^A-Z2-7]/g, '');
    const result = [];
    let bits = 0;
    let value = 0;
    
    for (let i = 0; i < cleanInput.length; i++) {
      const char = cleanInput[i];
      const charValue = this.base32Chars.indexOf(char);
      
      if (charValue === -1) continue;
      
      value = (value << 5) | charValue;
      bits += 5;
      
      if (bits >= 8) {
        result.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }
    
    return new Uint8Array(result);
  }
  
  // Generar código TOTP
  static async generateTOTP(secret: string, window = 0): Promise<string> {
    const key = this.base32Decode(secret);
    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / 30) + window;
    
    const counterBuffer = new ArrayBuffer(8);
    const counterView = new DataView(counterBuffer);
    counterView.setUint32(4, counter, false);
    
    // Crear un ArrayBuffer a partir del Uint8Array
    const keyBuffer = new ArrayBuffer(key.length);
    new Uint8Array(keyBuffer).set(key);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      counterBuffer
    );
    
    const hash = new Uint8Array(signature);
    const offset = hash[hash.length - 1] & 0x0f;
    const binary = (
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff)
    );
    
    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
  }
  
  // Verificar código TOTP
  static async verify(token: string, secret: string): Promise<boolean> {
    const windowSize = 1; // Permitir ±1 ventana de tiempo (30 segundos)
    
    for (let i = -windowSize; i <= windowSize; i++) {
      const expectedToken = await this.generateTOTP(secret, i);
      if (expectedToken === token) {
        return true;
      }
    }
    
    return false;
  }
  
  // Generar URI para código QR
  static keyuri(accountName: string, serviceName: string, secret: string): string {
    const params = new URLSearchParams({
      secret: secret,
      issuer: serviceName,
      algorithm: 'SHA1',
      digits: '6',
      period: '30'
    });
    
    return `otpauth://totp/${encodeURIComponent(serviceName)}:${encodeURIComponent(accountName)}?${params.toString()}`;
  }
}

interface UserSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { t, changeLanguage, language, availableLanguages } = useTranslation();
  
  // Función para separar nombres y apellidos de manera más inteligente
  const parseFullName = (fullName: string) => {
    if (!fullName) return { firstName: '', lastName: '' };
    
    const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
    
    if (nameParts.length === 0) {
      return { firstName: '', lastName: '' };
    } else if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: '' };
    } else if (nameParts.length === 2) {
      return { firstName: nameParts[0], lastName: nameParts[1] };
    } else if (nameParts.length === 3) {
      // Para 3 palabras: "Juan Carlos Pérez" -> firstName: "Juan Carlos", lastName: "Pérez"
      return { firstName: `${nameParts[0]} ${nameParts[1]}`, lastName: nameParts[2] };
    } else {
      // Para 4 o más palabras: "Juan Carlos Pérez García" -> firstName: "Juan Carlos", lastName: "Pérez García"
      const midPoint = Math.ceil(nameParts.length / 2);
      return {
        firstName: nameParts.slice(0, midPoint).join(' '),
        lastName: nameParts.slice(midPoint).join(' ')
      };
    }
  };

  const parsedName = parseFullName(user?.name || '');
  const [activeTab, setActiveTab] = useState('profile');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isTestingNotifications, setIsTestingNotifications] = useState(false);
  
  // Estados para cambio de contraseña
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Estados para autenticación de dos factores
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<'setup' | 'verify' | 'success'>('setup');
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isGenerating2FA, setIsGenerating2FA] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  
  // Estado para configuración de email automático
  const [showAutoEmailConfig, setShowAutoEmailConfig] = useState(false);
  
  // Cargar configuración de notificaciones existente
  const existingNotificationSettings = user?.email ? notificationService.getUserNotificationSettings(user.email) : null;
  
  const [formData, setFormData] = useState({
    firstName: parsedName.firstName,
    lastName: parsedName.lastName,
    email: user?.email || '',
    avatar: user?.avatar || '',
    notifications: true,
    darkMode: isDarkMode,
    language: 'es',
    emailNotifications: existingNotificationSettings?.emailNotifications ?? true,
    pushNotifications: existingNotificationSettings?.pushNotifications ?? false,
    taskReminders: existingNotificationSettings?.taskReminders ?? true,
    eventReminders: existingNotificationSettings?.eventReminders ?? true,
    groupInvitations: existingNotificationSettings?.groupInvitations ?? true,
    weeklyDigest: existingNotificationSettings?.weeklyDigest ?? false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  // Función para limpiar y formatear nombres
  const formatName = (name: string) => {
    return name
      .trim()
      .replace(/\s+/g, ' ') // Reemplazar múltiples espacios por uno solo
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Función específica para manejar cambios en nombres
  const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
    // Permitir solo letras, espacios y caracteres acentuados
    const cleanValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    handleInputChange(field, cleanValue);
  };

  const handlePhotoChange = () => {
    // Crear un input file virtual
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Validar tamaño de archivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('La imagen debe ser menor a 5MB');
          return;
        }

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          alert('Por favor selecciona un archivo de imagen válido');
          return;
        }

        setIsUploadingPhoto(true);

        // Crear una URL temporal para preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          handleInputChange('avatar', result);
          setIsUploadingPhoto(false);
        };
        reader.onerror = () => {
          alert('Error al cargar la imagen');
          setIsUploadingPhoto(false);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar?');
      if (confirmClose) {
        setHasUnsavedChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      alert('El nombre es obligatorio');
      return false;
    }
    
    // Validar que el nombre tenga solo letras y espacios
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!nameRegex.test(formData.firstName.trim())) {
      alert('El nombre solo puede contener letras y espacios');
      return false;
    }
    
    if (formData.lastName.trim() && !nameRegex.test(formData.lastName.trim())) {
      alert('El apellido solo puede contener letras y espacios');
      return false;
    }
    
    if (!formData.email.trim()) {
      alert('El correo electrónico es obligatorio');
      return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor ingresa un correo electrónico válido');
      return false;
    }
    
    return true;
  };

  // Función para probar notificaciones por email
  const handleTestNotifications = async () => {
    if (!user?.email || !user?.name) {
      alert('Error: No se pudo obtener la información del usuario');
      return;
    }

    if (!formData.emailNotifications) {
      alert('⚠️ Las notificaciones por email están deshabilitadas. Actívalas primero para poder probar.');
      return;
    }

    setIsTestingNotifications(true);
    
    try {
      console.log('🧪 Probando notificación para:', user.email);
      
      const success = await notificationService.testEmailNotification(user.email, user.name);
      
      if (notificationService.isRealEmailEnabled()) {
        if (success) {
          alert('✅ ¡Email real enviado exitosamente!\n\nRevisa tu bandeja de entrada en Gmail.');
        } else {
          alert('❌ Error al enviar el email real. Verifica la configuración de EmailJS.');
        }
      } else {
        if (success) {
          alert('🧪 ¡Notificación de prueba simulada exitosamente!\n\n📧 Para recibir emails reales en tu Gmail:\n\n1. Revisa la consola (F12) para ver las instrucciones\n2. O haz clic en "Configurar EmailJS"\n\nRevisa la consola del navegador para ver los detalles del envío simulado.');
        } else {
          alert('❌ Error al enviar la notificación de prueba. Verifica la configuración.');
        }
      }
    } catch (error) {
      console.error('Error al probar notificaciones:', error);
      alert('❌ Error inesperado al probar las notificaciones.');
    } finally {
      setIsTestingNotifications(false);
    }
  };

  // Funciones para autenticación de dos factores
  const generate2FASecret = async () => {
    // Verificar que las librerías estén disponibles
    if (typeof QRCode === 'undefined') {
      alert('❌ Error: Librería QRCode no cargada');
      return;
    }
    
    setIsGenerating2FA(true);
    try {
      // Generar una clave secreta usando nuestra implementación del navegador
      const secret = BrowserTOTP.generateSecret();
      setSecretKey(secret);

      // Crear la URI para el código QR
      const serviceName = 'EcoTask';
      const accountName = user?.email || 'usuario@ecotask.com';
      const otpAuthUrl = BrowserTOTP.keyuri(accountName, serviceName, secret);

      // Generar el código QR
      const qrDataURL = await QRCode.toDataURL(otpAuthUrl);
      setQrCodeDataURL(qrDataURL);

      // Generar códigos de respaldo
      const codes = [];
      for (let i = 0; i < 8; i++) {
        codes.push(Math.random().toString(36).substring(2, 8).toUpperCase());
      }
      setBackupCodes(codes);

      setTwoFAStep('setup');
      setShow2FAModal(true);
    } catch (error) {
      console.error('❌ Error generando 2FA:', error);
      alert('❌ Error al generar la configuración 2FA: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsGenerating2FA(false);
    }
  };

  const verify2FACode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert('❌ Por favor ingresa un código de 6 dígitos');
      return;
    }

    setIsVerifying2FA(true);
    try {
      // Verificar el código TOTP usando nuestra implementación del navegador
      const isValid = await BrowserTOTP.verify(verificationCode, secretKey);

      if (isValid) {
        // Guardar configuración 2FA usando el servicio por usuario
        if (user?.email) {
          twoFactorService.saveTwoFAConfig(user.email, secretKey, backupCodes);

          const template = notificationService.getEmailTemplate('2faEnabled', {
            userName: user.name || 'Usuario',
            enabledDate: new Date().toLocaleDateString('es-ES'),
            enabledTime: new Date().toLocaleTimeString('es-ES')
          });

          await notificationService.sendEmailNotification({
            to: user.email,
            subject: template.subject,
            message: template.message,
            type: '2faEnabled'
          });
        }

        setTwoFAStep('success');
        alert('✅ Autenticación de dos factores activada exitosamente!');
      } else {
        alert('❌ Código incorrecto. Verifica que tengas el tiempo sincronizado.');
      }
    } catch (error) {
      console.error('Error verificando 2FA:', error);
      alert('❌ Error al verificar el código');
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const close2FAModal = () => {
    setShow2FAModal(false);
    setTwoFAStep('setup');
    setQrCodeDataURL('');
    setSecretKey('');
    setVerificationCode('');
    setBackupCodes([]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Copiado al portapapeles');
    }).catch(() => {
      alert('❌ Error al copiar');
    });
  };

  // Funciones para cambio de contraseña
  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('❌ Por favor completa todos los campos');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('❌ Las contraseñas nuevas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('❌ La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsChangingPassword(true);

    try {
      // Simular cambio de contraseña (en una app real, aquí harías la petición al servidor)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enviar notificación por email sobre el cambio de contraseña
      if (user?.email) {
        const template = notificationService.getEmailTemplate('passwordChanged', {
          userName: user.name || 'Usuario',
          changeDate: new Date().toLocaleDateString('es-ES'),
          changeTime: new Date().toLocaleTimeString('es-ES')
        });

        await notificationService.sendEmailNotification({
          to: user.email,
          subject: template.subject,
          message: template.message,
          type: 'passwordChanged'
        });
      }

      alert('✅ Contraseña cambiada exitosamente. Se ha enviado una confirmación a tu email.');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      alert('❌ Error al cambiar la contraseña. Inténtalo de nuevo.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Función para mostrar instrucciones de configuración de EmailJS
  const handleShowEmailJSInstructions = () => {
    const instructions = notificationService.getSetupInstructions();
    console.log(instructions);
    
    const instructionsWindow = window.open('', '_blank', 'width=800,height=600');
    if (instructionsWindow) {
      instructionsWindow.document.write(`
        <html>
          <head>
            <title>Configuración de EmailJS - EcoTask</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                background: #f5f5f5; 
                line-height: 1.6; 
              }
              .container { 
                background: white; 
                padding: 30px; 
                border-radius: 8px; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
                max-width: 700px; 
                margin: 0 auto; 
              }
              h1 { color: #059669; margin-bottom: 20px; }
              h2 { color: #374151; margin-top: 25px; }
              .step { 
                background: #f9fafb; 
                padding: 15px; 
                margin: 10px 0; 
                border-left: 4px solid #059669; 
                border-radius: 0 4px 4px 0; 
              }
              .code { 
                background: #1f2937; 
                color: #e5e7eb; 
                padding: 15px; 
                border-radius: 6px; 
                font-family: monospace; 
                margin: 10px 0; 
                overflow-x: auto; 
              }
              .warning { 
                background: #fef3c7; 
                border: 1px solid #f59e0b; 
                padding: 15px; 
                border-radius: 6px; 
                margin: 15px 0; 
              }
              .success { 
                background: #d1fae5; 
                border: 1px solid #059669; 
                padding: 15px; 
                border-radius: 6px; 
                margin: 15px 0; 
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>📧 Configurar Emails Reales en EcoTask</h1>
              
              <div class="warning">
                <strong>⚠️ Estado Actual:</strong> Las notificaciones están en modo simulación. 
                Para recibir emails reales en tu Gmail, sigue estos pasos.
              </div>

              <h2>Paso 1: Crear cuenta en EmailJS</h2>
              <div class="step">
                1. Ve a <a href="https://www.emailjs.com/" target="_blank">https://www.emailjs.com/</a><br>
                2. Crea una cuenta gratuita<br>
                3. Confirma tu email
              </div>

              <h2>Paso 2: Configurar servicio de email</h2>
              <div class="step">
                1. En el dashboard de EmailJS, ve a "Email Services"<br>
                2. Haz clic en "Add New Service"<br>
                3. Selecciona "Gmail" o tu proveedor de email<br>
                4. Conecta tu cuenta y autoriza EmailJS<br>
                5. Copia el <strong>Service ID</strong>
              </div>

              <h2>Paso 3: Crear plantilla de email</h2>
              <div class="step">
                1. Ve a "Email Templates"<br>
                2. Haz clic en "Create New Template"<br>
                3. Usa esta plantilla:<br><br>
                <strong>Subject:</strong> {{subject}}<br>
                <strong>Body:</strong><br>
                Hola {{to_name}},<br><br>
                {{message}}<br><br>
                Saludos,<br>
                {{from_name}}<br><br>
                4. Guarda y copia el <strong>Template ID</strong>
              </div>

              <h2>Paso 4: Obtener Public Key</h2>
              <div class="step">
                1. Ve a "Account" → "General"<br>
                2. Copia tu <strong>Public Key</strong>
              </div>

              <h2>Paso 5: Configurar en EcoTask</h2>
              <div class="step">
                1. Abre la consola del navegador (F12)<br>
                2. Ejecuta este comando con tus datos:
              </div>

              <div class="code">
notificationService.configureEmailJS(
  'tu_service_id',     // Service ID de EmailJS
  'tu_template_id',    // Template ID de EmailJS  
  'tu_public_key'      // Public Key de EmailJS
);
              </div>

              <div class="success">
                <strong>✅ ¡Listo!</strong> Una vez configurado, las notificaciones se enviarán 
                realmente a tu correo de Gmail asociado.
              </div>

              <h2>💡 Ejemplo de configuración:</h2>
              <div class="code">
// Ejemplo (reemplaza con tus valores reales):
notificationService.configureEmailJS(
  'service_abc123',
  'template_xyz789', 
  'user_def456'
);
              </div>

              <div class="warning">
                <strong>📝 Nota:</strong> EmailJS tiene un plan gratuito con 200 emails/mes. 
                Suficiente para uso personal de EcoTask.
              </div>
            </div>
          </body>
        </html>
      `);
      instructionsWindow.document.close();
    }
    
    // También mostrar en consola
    console.log('📧 Instrucciones mostradas en nueva ventana');
    console.log('💡 Tip: También puedes usar notificationService.quickSetup() para ver las instrucciones');
  };

  const handleSave = async () => {
    // Validar formulario antes de guardar
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    
    try {
      // Formatear y limpiar nombres y apellidos
      const formattedFirstName = formatName(formData.firstName);
      const formattedLastName = formatName(formData.lastName);
      const fullName = formattedLastName ? `${formattedFirstName} ${formattedLastName}` : formattedFirstName;
      
      // Crear objeto con los datos actualizados
      const updatedData = {
        firstName: formattedFirstName,
        lastName: formattedLastName,
        fullName: fullName,
        email: formData.email.trim(),
        avatar: formData.avatar,
        settings: {
          notifications: formData.notifications,
          darkMode: formData.darkMode,
          language: formData.language,
          emailNotifications: formData.emailNotifications,
          pushNotifications: formData.pushNotifications,
          taskReminders: formData.taskReminders,
          eventReminders: formData.eventReminders,
          groupInvitations: formData.groupInvitations,
          weeklyDigest: formData.weeklyDigest,
        }
      };

      console.log('Guardando configuración:', updatedData);
      
      // Guardar configuración de notificaciones
      if (user?.email) {
        notificationService.saveUserNotificationSettings(user.email, {
          emailNotifications: formData.emailNotifications,
          pushNotifications: formData.pushNotifications,
          taskReminders: formData.taskReminders,
          eventReminders: formData.eventReminders,
          groupInvitations: formData.groupInvitations,
          weeklyDigest: formData.weeklyDigest,
        });
        console.log('✅ Configuración de notificaciones guardada');
      }
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar el usuario en el store
      updateUser({
        name: fullName,
        email: formData.email.trim(),
        avatar: formData.avatar
      });

      console.log('Usuario actualizado en el store:', {
        name: fullName,
        email: formData.email.trim(),
        avatar: formData.avatar ? 'Nueva imagen cargada' : 'Sin cambios en imagen',
        nombresSeparados: {
          nombres: formattedFirstName,
          apellidos: formattedLastName || 'Sin apellidos'
        }
      });
      
      // Aquí es donde implementarías la llamada a tu API/backend
      // Ejemplo:
      // const response = await fetch('/api/user/update', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedData)
      // });
      
      // Simular guardado exitoso
      const message = `¡Perfil actualizado exitosamente!\n\nNombre(s): ${formattedFirstName}${formattedLastName ? `\nApellido(s): ${formattedLastName}` : ''}\nNombre completo: ${fullName}\nEmail: ${formData.email.trim()}`;
      alert(message);
      
      // Resetear indicador de cambios sin guardar
      setHasUnsavedChanges(false);
      
      // Cerrar modal
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la configuración. Por favor intenta nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: t('settings.tabs.profile'), icon: User },
    { id: 'notifications', label: t('settings.tabs.notifications'), icon: Bell },
    { id: 'autoemail', label: 'Email Automático', icon: Settings },
    { id: 'security', label: t('settings.tabs.security'), icon: Shield },
    { id: 'appearance', label: t('settings.tabs.appearance'), icon: Palette },
    { id: 'language', label: t('settings.tabs.language'), icon: Globe },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[70]"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings.userSettings')}</h2>
              {hasUnsavedChanges && (
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 text-xs font-medium rounded-full">
                  {t('common.unsavedChanges')}
                </span>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={t('common.close')}
              aria-label={t('common.close')}
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 p-4 flex-shrink-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                        ${activeTab === tab.id
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Información del Perfil</h3>
                  
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={formData.avatar}
                        alt={`${formData.firstName} ${formData.lastName}`}
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                      {isUploadingPhoto && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button 
                        onClick={handlePhotoChange}
                        disabled={isUploadingPhoto}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {isUploadingPhoto ? 'Subiendo...' : 'Cambiar Foto'}
                      </button>
                      <p className="text-xs text-gray-500">
                        JPG, PNG hasta 5MB
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre(s)
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleNameChange('firstName', e.target.value)}
                        placeholder="Ej: Juan Carlos"
                        aria-label="Nombres"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Puedes ingresar uno o más nombres</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Apellido(s)
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleNameChange('lastName', e.target.value)}
                        placeholder="Ej: Pérez García"
                        aria-label="Apellidos"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Puedes ingresar uno o más apellidos</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="correo@ejemplo.com"
                        aria-label="Correo electrónico"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración de Notificaciones</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleShowEmailJSInstructions}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <Mail size={16} />
                        <span>Configurar EmailJS</span>
                      </button>
                      <button
                        onClick={handleTestNotifications}
                        disabled={isTestingNotifications || !formData.emailNotifications}
                        className="flex items-center space-x-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm"
                      >
                        <Send size={16} />
                        <span>{isTestingNotifications ? 'Enviando...' : 'Probar Email'}</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Notificaciones principales */}
                  <div className="space-y-6">
                    <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-4">
                      <h4 className="font-medium text-primary-900 dark:text-primary-100 mb-3">Notificaciones Principales</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white flex items-center">
                              <Mail size={16} className="mr-2 text-accent-600" />
                              Notificaciones por email
                            </h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Recibir notificaciones importantes por correo asociado a Gmail</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.emailNotifications}
                              onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                              aria-label="Activar notificaciones por email"
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white flex items-center">
                              <Bell size={16} className="mr-2 text-blue-600" />
                              Notificaciones push
                            </h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Recibir notificaciones en tiempo real en el navegador</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.pushNotifications}
                              onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
                              aria-label="Activar notificaciones push"
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Notificaciones específicas (solo si email está habilitado) */}
                    {formData.emailNotifications && (
                      <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-4">
                        <h4 className="font-medium text-accent-900 dark:text-accent-100 mb-3">Tipos de Notificaciones por Email</h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">Recordatorios de tareas</h5>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Alertas sobre tareas pendientes y fechas límite</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.taskReminders}
                                onChange={(e) => handleInputChange('taskReminders', e.target.checked)}
                                aria-label="Activar recordatorios de tareas"
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">Invitaciones a eventos</h5>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Notificaciones sobre nuevos eventos ecológicos</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.eventReminders}
                                onChange={(e) => handleInputChange('eventReminders', e.target.checked)}
                                aria-label="Activar notificaciones de eventos"
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">Invitaciones a grupos</h5>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Alertas cuando te inviten a unirte a un grupo</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.groupInvitations}
                                onChange={(e) => handleInputChange('groupInvitations', e.target.checked)}
                                aria-label="Activar notificaciones de grupos"
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">Resumen semanal</h5>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Resumen de tus logros y actividades ecológicas</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.weeklyDigest}
                                onChange={(e) => handleInputChange('weeklyDigest', e.target.checked)}
                                aria-label="Activar resumen semanal"
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Estado de EmailJS */}
                    <div className={`rounded-lg p-4 ${notificationService.isRealEmailEnabled() ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
                      <h4 className={`font-medium mb-2 flex items-center ${notificationService.isRealEmailEnabled() ? 'text-green-900 dark:text-green-100' : 'text-yellow-900 dark:text-yellow-100'}`}>
                        {notificationService.isRealEmailEnabled() ? '✅' : '⚠️'} Estado del Servicio de Email
                      </h4>
                      <div className={`text-sm space-y-1 ${notificationService.isRealEmailEnabled() ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'}`}>
                        {notificationService.isRealEmailEnabled() ? (
                          <>
                            <p>• ✅ EmailJS configurado correctamente</p>
                            <p>• 📧 Los emails se enviarán realmente a tu Gmail</p>
                            <p>• 🧪 Usa "Probar Email" para enviar un email real</p>
                          </>
                        ) : (
                          <>
                            <p>• 🧪 Modo simulación activo</p>
                            <p>• ⚡ Para recibir emails reales, haz clic en "Configurar EmailJS"</p>
                            <p>• 📝 Solo toma 5 minutos configurar EmailJS (gratis)</p>
                            <p>• 🎯 Una vez configurado, recibirás emails reales en tu Gmail</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Información sobre notificaciones */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                        <Bell size={16} className="mr-2" />
                        Información sobre Notificaciones
                      </h4>
                      <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <p>• Las notificaciones por email se envían al correo asociado a tu cuenta de Gmail</p>
                        <p>• Puedes probar el funcionamiento usando el botón "Probar Email"</p>
                        <p>• En modo desarrollo, las notificaciones se muestran como simulaciones</p>
                        <p>• Las configuraciones se guardan automáticamente al hacer clic en "Guardar"</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'autoemail' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Automático</h3>
                    <button
                      onClick={() => setShowAutoEmailConfig(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Settings size={16} />
                      <span>Configurar</span>
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Sistema de Notificaciones Automáticas
                        </h4>
                        <p className="text-blue-800 dark:text-blue-200 mb-4">
                          Recibe notificaciones por email automáticamente para todas las acciones que realices en EcoTask.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white/50 dark:bg-blue-900/30 rounded-lg p-3">
                            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">📋 Tareas</h5>
                            <p className="text-sm text-blue-700 dark:text-blue-300">Crear, editar y eliminar</p>
                          </div>
                          <div className="bg-white/50 dark:bg-blue-900/30 rounded-lg p-3">
                            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">👥 Grupos</h5>
                            <p className="text-sm text-blue-700 dark:text-blue-300">Crear, editar y eliminar</p>
                          </div>
                          <div className="bg-white/50 dark:bg-blue-900/30 rounded-lg p-3">
                            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">🌱 Eventos</h5>
                            <p className="text-sm text-blue-700 dark:text-blue-300">Crear, editar y eliminar</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Sistema automático activado - No requiere configuración manual</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        <p className="font-medium mb-1">Información Importante</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Los emails se envían automáticamente al correo de tu cuenta de Gmail</li>
                          <li>En modo desarrollo, las notificaciones se muestran como simulaciones en consola</li>
                          <li>Para configurar envío real en producción, usa el botón "Configurar" arriba</li>
                          <li>El sistema funciona independientemente de las notificaciones manuales</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración de Seguridad</h3>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full md:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      Cambiar Contraseña
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        generate2FASecret();
                      }}
                      disabled={isGenerating2FA}
                      className="w-full md:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      {isGenerating2FA && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <Shield size={16} />
                      <span>{isGenerating2FA ? 'Generando...' : 'Configurar Autenticación de Dos Factores'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración de Apariencia</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Modo oscuro</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cambiar entre tema claro y oscuro</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={() => {
                          toggleTheme();
                          handleInputChange('darkMode', !isDarkMode);
                        }}
                        aria-label="Activar modo oscuro"
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.languageSettings')}</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.applicationLanguage')}
                    </label>
                    <select
                      value={language}
                      onChange={(e) => changeLanguage(e.target.value as 'es' | 'en' | 'fr' | 'pt' | 'de')}
                      aria-label={t('settings.selectLanguage')}
                      className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {availableLanguages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {t('settings.languageChangeNote')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
            <button
              onClick={handleClose}
              disabled={isSaving}
              className="px-6 py-3 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {t('settings.cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
            >
              {isSaving && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{isSaving ? t('settings.saving') : t('settings.save')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Cambio de Contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[90] overflow-y-auto animate-in fade-in duration-200">
          {/* Overlay con mayor opacidad */}
          <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" onClick={handleClosePasswordModal}></div>
          
          {/* Contenedor del modal */}
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all max-w-md w-full p-6 relative z-10 border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  🔒 Cambiar Contraseña
                </h3>
                <button
                  onClick={handleClosePasswordModal}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contraseña Actual *
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Ingresa tu contraseña actual"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nueva Contraseña *
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirmar Nueva Contraseña *
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Repite la nueva contraseña"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 <strong>Tip:</strong> Recibirás un email de confirmación cuando cambies tu contraseña.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={handleClosePasswordModal}
                  disabled={isChangingPassword}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isChangingPassword && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span>{isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Autenticación de Dos Factores */}
      {show2FAModal && (
        <div className="fixed inset-0 z-[95] overflow-y-auto animate-in fade-in duration-200">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" onClick={close2FAModal}></div>
          
          {/* Contenedor del modal */}
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all max-w-lg w-full p-6 relative z-10 border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Shield className="text-blue-500" size={24} />
                  <span>🔐 Autenticación de Dos Factores</span>
                </h3>
                <button
                  onClick={close2FAModal}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Paso 1: Configuración inicial */}
              {twoFAStep === 'setup' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Paso 1: Escanea el código QR
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Abre Google Authenticator y escanea este código QR
                    </p>
                  </div>

                  {/* Código QR */}
                  {qrCodeDataURL && (
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                        <img src={qrCodeDataURL} alt="Código QR para 2FA" className="w-48 h-48" />
                      </div>
                    </div>
                  )}

                  {/* Clave secreta manual */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                      ¿No puedes escanear? Ingresa esta clave manualmente:
                    </h5>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 font-mono">
                        {secretKey}
                      </code>
                      <button
                        onClick={() => copyToClipboard(secretKey)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded transition-colors"
                        title="Copiar clave"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Paso 2: Verificación */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Paso 2: Ingresa el código de verificación
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Ingresa el código de 6 dígitos que aparece en tu app
                    </p>
                    
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-lg font-mono"
                        placeholder="123456"
                        maxLength={6}
                      />
                      <button
                        onClick={verify2FACode}
                        disabled={isVerifying2FA || verificationCode.length !== 6}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                      >
                        {isVerifying2FA && (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        <span>{isVerifying2FA ? 'Verificando...' : 'Verificar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Información importante */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      📱 Apps recomendadas:
                    </h5>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• Google Authenticator</li>
                      <li>• Microsoft Authenticator</li>
                      <li>• Authy</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Paso 3: Éxito y códigos de respaldo */}
              {twoFAStep === 'success' && (
                <div className="space-y-6 text-center">
                  <div className="text-green-500 mb-4">
                    <Check size={64} className="mx-auto" />
                  </div>
                  
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    ¡2FA Activado Exitosamente! 🎉
                  </h4>
                  
                  <p className="text-gray-600 dark:text-gray-400">
                    Tu cuenta ahora está protegida con autenticación de dos factores.
                  </p>

                  {/* Códigos de respaldo */}
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 text-left">
                    <h5 className="font-medium text-red-800 dark:text-red-200 mb-3 flex items-center">
                      <Key size={16} className="mr-2" />
                      Códigos de Respaldo (¡Guárdalos!)
                    </h5>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {backupCodes.map((code, index) => (
                        <code key={index} className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 font-mono text-center">
                          {code}
                        </code>
                      ))}
                    </div>
                    <button
                      onClick={() => copyToClipboard(backupCodes.join('\n'))}
                      className="w-full text-sm bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 py-2 rounded hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors"
                    >
                      📋 Copiar todos los códigos
                    </button>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      Usa estos códigos si pierdes acceso a tu teléfono. Cada código solo se puede usar una vez.
                    </p>
                  </div>

                  <button
                    onClick={close2FAModal}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ✅ Finalizar Configuración
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de configuración de email automático */}
      <AutoEmailConfig 
        isOpen={showAutoEmailConfig} 
        onClose={() => setShowAutoEmailConfig(false)} 
      />
    </>
  );
};

export default UserSettings;

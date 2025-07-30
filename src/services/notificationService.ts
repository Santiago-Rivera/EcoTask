// Servicio de notificaciones por email
import emailjs from '@emailjs/browser';

export interface EmailNotification {
  to: string;
  subject: string;
  message: string;
  type: 'task' | 'event' | 'group' | 'reminder' | 'welcome' | 'taskCreated' | 'groupCreated' | 'eventCreated' | 'passwordChanged' | '2faEnabled';
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskReminders: boolean;
  eventReminders: boolean;
  groupInvitations: boolean;
  weeklyDigest: boolean;
}

export interface TaskData {
  userName: string;
  taskTitle: string;
  dueDate: string;
  priority: string;
  description?: string;
}

export interface EventData {
  userName: string;
  eventTitle: string;
  eventDate: string;
  location: string;
  eventType: string;
  description?: string;
}

export interface DigestData {
  userName: string;
  completedTasks?: number;
  eventsAttended?: number;
  activeGroups?: number;
  ecoImpact?: string;
  achievements?: string;
}

export interface TemplateData {
  name?: string;
  userName?: string;
}

export interface TaskCreatedData {
  userName: string;
  taskTitle: string;
  dueDate: string;
  priority: string;
  description?: string;
  category?: string;
}

interface GroupCreatedData {
  groupName: string;
  groupDescription: string;
  memberCount: number;
  color?: string;
  userEmail: string;
  userName: string;
}

interface EventCreatedData {
  eventTitle: string;
  eventDescription: string;
  eventDate: string;
  eventLocation: string;
  eventType: string;
  maxParticipants?: number;
  userEmail: string;
  userName: string;
}

interface PasswordChangedData {
  userName: string;
  changeDate: string;
  changeTime: string;
}

interface TwoFAEnabledData {
  userName: string;
  enabledDate: string;
  enabledTime: string;
}

class NotificationService {
  private isEmailServiceConfigured = false;
  
  // Configuración de EmailJS (servicio gratuito y confiable)
  private emailJSConfig = {
    serviceId: 'service_ecotask', // Se configurará más adelante
    templateId: 'template_ecotask', // Se configurará más adelante  
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY' // Se configurará más adelante
  };

  // Configurar EmailJS para envío real de emails
  async initializeEmailService() {
    try {
      // Inicializar EmailJS
      emailjs.init(this.emailJSConfig.publicKey);
      
      // En desarrollo, usar configuración de prueba
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 EmailJS inicializado en modo desarrollo');
        console.log('📝 Para configurar envío real, ve a: https://www.emailjs.com/');
        this.isEmailServiceConfigured = false; // Mantener simulación en desarrollo
      } else {
        this.isEmailServiceConfigured = true;
        console.log('📧 EmailJS configurado para producción');
      }
    } catch (error) {
      console.error('❌ Error al inicializar EmailJS:', error);
      this.isEmailServiceConfigured = false;
    }
  }

  // Enviar notificación por email usando EmailJS o simulación
  async sendEmailNotification(notification: EmailNotification): Promise<boolean> {
    try {
      console.log('📧 Iniciando envío de notificación:', {
        to: notification.to,
        subject: notification.subject,
        type: notification.type,
        timestamp: new Date().toISOString()
      });

      // Intentar envío real con EmailJS si está configurado
      if (this.isEmailServiceConfigured) {
        return await this.sendRealEmail(notification);
      } else {
        // Modo desarrollo/simulación
        return await this.sendSimulatedEmail(notification);
      }
    } catch (error) {
      console.error('❌ Error al enviar notificación:', error);
      // En caso de error, mostrar notificación simulada como fallback
      await this.sendSimulatedEmail(notification);
      return false;
    }
  }

  // Envío real usando EmailJS
  private async sendRealEmail(notification: EmailNotification): Promise<boolean> {
    try {
      const templateParams = {
        to_email: notification.to,
        to_name: notification.to.split('@')[0], // Extraer nombre del email
        subject: notification.subject,
        message: notification.message,
        from_name: 'EcoTask',
        reply_to: 'noreply@ecotask.app'
      };

      const response = await emailjs.send(
        this.emailJSConfig.serviceId,
        this.emailJSConfig.templateId,
        templateParams
      );

      if (response.status === 200) {
        console.log('✅ Email enviado exitosamente:', response);
        this.saveNotificationHistory(notification);
        this.showSuccessNotification(`Email enviado a ${notification.to}`);
        return true;
      } else {
        throw new Error(`EmailJS respondió con status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error al enviar email real:', error);
      throw error;
    }
  }

  // Envío simulado para desarrollo y fallback
  private async sendSimulatedEmail(notification: EmailNotification): Promise<boolean> {
    console.log('🧪 Simulando envío de email:', {
      to: notification.to,
      subject: notification.subject,
      message: notification.message,
      type: notification.type,
      timestamp: new Date().toISOString()
    });

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Guardar en historial
    this.saveNotificationHistory(notification);

    // Mostrar notificación simulada
    this.showSimulatedNotification(notification);

    return true;
  }

  // Mostrar notificación de éxito
  private showSuccessNotification(message: string) {
    this.showVisualNotification(message, 'success');
  }

  // Mostrar notificación simulada en desarrollo
  private showSimulatedNotification(notification: EmailNotification) {
    const message = `Email simulado enviado a ${notification.to}`;
    this.showVisualNotification(message, 'simulation');
  }

  // Sistema unificado de notificaciones visuales
  private showVisualNotification(message: string, type: 'success' | 'simulation' | 'error' = 'success') {
    // Configurar colores según el tipo
    const colors = {
      success: 'bg-green-500',
      simulation: 'bg-blue-500', 
      error: 'bg-red-500'
    };
    
    const icons = {
      success: '✅',
      simulation: '🧪',
      error: '❌'
    };

    // Crear una notificación visual temporal
    const notificationElement = document.createElement('div');
    notificationElement.className = `
      fixed top-4 right-4 z-[100] ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg max-w-sm
      transform translate-x-full transition-transform duration-300 ease-in-out
    `;
    notificationElement.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <span class="text-lg">${icons[type]}</span>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">${message}</p>
          <p class="text-xs opacity-90 mt-1">${type === 'simulation' ? 'Modo desarrollo' : 'Notificación real'}</p>
        </div>
      </div>
    `;

    document.body.appendChild(notificationElement);

    // Animar entrada
    setTimeout(() => {
      notificationElement.style.transform = 'translateX(0)';
    }, 100);

    // Remover después de 4 segundos
    setTimeout(() => {
      notificationElement.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notificationElement)) {
          document.body.removeChild(notificationElement);
        }
      }, 300);
    }, 4000);
  }

  // Guardar historial de notificaciones
  private saveNotificationHistory(notification: EmailNotification) {
    try {
      const history = this.getNotificationHistory();
      const newEntry = {
        ...notification,
        id: Date.now().toString(),
        sentAt: new Date().toISOString(),
        status: 'sent'
      };
      
      history.unshift(newEntry);
      
      // Mantener solo los últimos 50 registros
      if (history.length > 50) {
        history.splice(50);
      }
      
      localStorage.setItem('notification-history', JSON.stringify(history));
    } catch (error) {
      console.error('Error al guardar historial:', error);
    }
  }

  // Obtener historial de notificaciones
  getNotificationHistory() {
    try {
      const stored = localStorage.getItem('notification-history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Plantillas de email
  getEmailTemplate(type: string, data: Partial<TemplateData & TaskData & EventData & DigestData & TaskCreatedData & GroupCreatedData & EventCreatedData & PasswordChangedData & TwoFAEnabledData>): { subject: string; message: string } {
    const templates: Record<string, { subject: string; message: string }> = {
      welcome: {
        subject: '¡Bienvenido a EcoTask! 🌱',
        message: `
Hola ${data.name},

¡Bienvenido a EcoTask! Estamos emocionados de tenerte en nuestra comunidad dedicada a hacer del mundo un lugar más sostenible.

Con EcoTask puedes:
• Organizar y gestionar tus tareas ecológicas
• Participar en eventos ambientales
• Colaborar con grupos locales
• Hacer seguimiento de tu impacto ambiental

¡Comienza tu viaje ecológico hoy mismo!

Saludos verdes,
El equipo de EcoTask 🌍
        `
      },
      taskReminder: {
        subject: `Recordatorio: ${data.taskTitle} 📋`,
        message: `
Hola ${data.userName},

Este es un recordatorio sobre tu tarea pendiente:

📋 **${data.taskTitle}**
📅 Fecha límite: ${data.dueDate}
🏷️ Prioridad: ${data.priority}

${data.description ? `Descripción: ${data.description}` : ''}

¡No olvides completarla para mantener tu progreso ecológico!

Saludos verdes,
EcoTask 🌱
        `
      },
      eventInvitation: {
        subject: `Invitación a evento: ${data.eventTitle} 🌍`,
        message: `
Hola ${data.userName},

Te invitamos a participar en nuestro próximo evento ecológico:

🌍 **${data.eventTitle}**
📅 Fecha: ${data.eventDate}
📍 Ubicación: ${data.location}
👥 Tipo: ${data.eventType}

${data.description ? `Descripción: ${data.description}` : ''}

¡Únete a nosotros y hagamos la diferencia juntos!

Confirma tu asistencia en la aplicación.

Saludos verdes,
EcoTask 🌱
        `
      },
      weeklyDigest: {
        subject: 'Tu resumen semanal EcoTask 📊',
        message: `
Hola ${data.userName},

Aquí tienes tu resumen de actividades de esta semana:

📋 **Tareas completadas:** ${data.completedTasks || 0}
🌍 **Eventos participados:** ${data.eventsAttended || 0}
👥 **Grupos activos:** ${data.activeGroups || 0}
♻️ **Impacto ecológico:** ${data.ecoImpact || 'En cálculo'}

${data.achievements ? `🏆 **Logros desbloqueados:** ${data.achievements}` : ''}

¡Sigue así! Tu compromiso con el medio ambiente marca la diferencia.

Saludos verdes,
EcoTask 🌱
        `
      },
      taskCreated: {
        subject: `✅ Nueva tarea creada: ${data.taskTitle} 📋`,
        message: `
Hola ${data.userName},

¡Has creado una nueva tarea en EcoTask!

📋 **${data.taskTitle}**
📅 Fecha límite: ${data.dueDate}
🏷️ Prioridad: ${data.priority}
📂 Categoría: ${(data as TaskCreatedData).category || 'Sin categoría'}

${data.description ? `📝 Descripción: ${data.description}` : ''}

¡Excelente trabajo organizando tus actividades ecológicas! Recuerda completarla a tiempo para mantener tu progreso.

Saludos verdes,
EcoTask 🌱
        `
      },
      groupCreated: {
        subject: `👥 Nuevo grupo creado: ${(data as GroupCreatedData).groupName} 🌍`,
        message: `
Hola ${data.userName},

¡Has creado un nuevo grupo en EcoTask!

👥 **${(data as GroupCreatedData).groupName}**
📝 Descripción: ${data.description || 'Sin descripción'}
🎨 Color: ${(data as GroupCreatedData).color || 'Personalizado'}

Tu grupo está listo para colaborar en proyectos ecológicos. ¡Invita a más personas para hacer un mayor impacto ambiental!

Saludos verdes,
EcoTask 🌱
        `
      },
      eventCreated: {
        subject: `🌍 Nuevo evento creado: ${data.eventTitle} 📅`,
        message: `
Hola ${data.userName},

¡Has creado un nuevo evento ecológico en EcoTask!

🌍 **${data.eventTitle}**
📅 Fecha: ${data.eventDate}
📍 Ubicación: ${data.location}
👥 Tipo: ${data.eventType}
👨‍👩‍👧‍👦 Participantes máximos: ${(data as EventCreatedData).maxParticipants || 'Sin límite'}

${data.description ? `📝 Descripción: ${data.description}` : ''}

¡Excelente iniciativa! Tu evento ayudará a crear conciencia y acción ambiental en tu comunidad.

Saludos verdes,
EcoTask 🌱
        `
      },
      passwordChanged: {
        subject: `🔒 Contraseña cambiada exitosamente - EcoTask`,
        message: `
Hola ${data.userName},

✅ **Tu contraseña ha sido cambiada exitosamente**

🔒 **Detalles del cambio:**
📅 Fecha: ${(data as PasswordChangedData).changeDate}
🕐 Hora: ${(data as PasswordChangedData).changeTime}

Si no fuiste tú quien realizó este cambio, por favor contacta a nuestro equipo de soporte inmediatamente.

🔐 **Consejos de seguridad:**
• Usa una contraseña única y segura
• No compartas tu contraseña con nadie
• Mantén tu cuenta segura

Saludos verdes,
EcoTask 🌱
        `
      },
      '2faEnabled': {
        subject: `🔐 Autenticación de dos factores activada - EcoTask`,
        message: `
Hola ${data.userName},

✅ **La autenticación de dos factores ha sido activada exitosamente**

🔐 **Detalles de la activación:**
📅 Fecha: ${(data as TwoFAEnabledData).enabledDate}
🕐 Hora: ${(data as TwoFAEnabledData).enabledTime}

🛡️ **Tu cuenta ahora está más segura:**
• Se requiere un código de 6 dígitos desde tu app authenticator
• Códigos de respaldo guardados de forma segura
• Protección adicional contra accesos no autorizados

📱 **Recuerda:**
• Mantén tu app authenticator instalada y sincronizada
• Guarda tus códigos de respaldo en un lugar seguro
• Si cambias de teléfono, reconfigura la 2FA

Si no fuiste tú quien activó esta función, contacta a soporte inmediatamente.

Saludos verdes,
EcoTask 🌱
        `
      }
    };

    return templates[type] || {
      subject: 'Notificación de EcoTask',
      message: `Hola ${data.name || data.userName},\n\nTienes una nueva notificación en EcoTask.\n\nSaludos verdes,\nEcoTask 🌱`
    };
  }

  // Enviar notificación de bienvenida
  async sendWelcomeNotification(userEmail: string, userName: string): Promise<boolean> {
    const template = this.getEmailTemplate('welcome', { name: userName });
    
    return this.sendEmailNotification({
      to: userEmail,
      subject: template.subject,
      message: template.message,
      type: 'welcome'
    });
  }

  // Enviar recordatorio de tarea
  async sendTaskReminder(userEmail: string, taskData: TaskData): Promise<boolean> {
    const template = this.getEmailTemplate('taskReminder', taskData);
    
    return this.sendEmailNotification({
      to: userEmail,
      subject: template.subject,
      message: template.message,
      type: 'reminder'
    });
  }

  // Enviar invitación a evento
  async sendEventInvitation(userEmail: string, eventData: EventData): Promise<boolean> {
    const template = this.getEmailTemplate('eventInvitation', eventData);
    
    return this.sendEmailNotification({
      to: userEmail,
      subject: template.subject,
      message: template.message,
      type: 'event'
    });
  }

  // Enviar resumen semanal
  async sendWeeklyDigest(userEmail: string, digestData: DigestData): Promise<boolean> {
    const template = this.getEmailTemplate('weeklyDigest', digestData);
    
    return this.sendEmailNotification({
      to: userEmail,
      subject: template.subject,
      message: template.message,
      type: 'reminder'
    });
  }

  // Verificar configuración de notificaciones del usuario
  getUserNotificationSettings(userEmail: string): NotificationSettings {
    try {
      const stored = localStorage.getItem(`notification-settings-${userEmail}`);
      return stored ? JSON.parse(stored) : {
        emailNotifications: true,
        pushNotifications: false,
        taskReminders: true,
        eventReminders: true,
        groupInvitations: true,
        weeklyDigest: false
      };
    } catch {
      return {
        emailNotifications: true,
        pushNotifications: false,
        taskReminders: true,
        eventReminders: true,
        groupInvitations: true,
        weeklyDigest: false
      };
    }
  }

  // Guardar configuración de notificaciones del usuario
  saveUserNotificationSettings(userEmail: string, settings: NotificationSettings) {
    try {
      localStorage.setItem(`notification-settings-${userEmail}`, JSON.stringify(settings));
    } catch (error) {
      console.error('Error al guardar configuración de notificaciones:', error);
    }
  }

  // Método para configurar EmailJS con credenciales reales
  configureEmailJS(serviceId: string, templateId: string, publicKey: string) {
    this.emailJSConfig = {
      serviceId,
      templateId,
      publicKey
    };
    
    try {
      emailjs.init(publicKey);
      this.isEmailServiceConfigured = true;
      console.log('✅ EmailJS configurado correctamente para envío real');
      this.showSuccessNotification('EmailJS configurado - Emails reales habilitados');
      return true;
    } catch (error) {
      console.error('❌ Error al configurar EmailJS:', error);
      this.isEmailServiceConfigured = false;
      return false;
    }
  }

  // Método para verificar si el servicio está configurado
  isRealEmailEnabled(): boolean {
    return this.isEmailServiceConfigured;
  }

  // Método para obtener instrucciones de configuración
  getSetupInstructions(): string {
    return `
📧 Para configurar envío real de emails:

1. Ve a https://www.emailjs.com/ y crea una cuenta gratuita
2. Crea un servicio de email (Gmail, Outlook, etc.)
3. Crea una plantilla de email
4. Obtén tu Service ID, Template ID y Public Key
5. Usa el método configureEmailJS() desde la consola:

notificationService.configureEmailJS('tu_service_id', 'tu_template_id', 'tu_public_key');

🔧 También puedes usar la función de configuración automática:
notificationService.quickSetup();
    `;
  }

  // Configuración rápida para desarrollo (temporal)
  quickSetup() {
    console.log(this.getSetupInstructions());
    
    console.log('⚡ Para configurar EmailJS con credenciales reales, usa:');
    console.log('notificationService.configureEmailJS(serviceId, templateId, publicKey)');
    console.log('📝 Para producción, configura con tus propias credenciales de EmailJS');
    
    // Por ahora mantener simulación hasta que tengas credenciales reales
    this.isEmailServiceConfigured = false;
  }

  // Verificar si se deben enviar notificaciones al usuario
  shouldSendNotification(userEmail: string, notificationType: keyof NotificationSettings): boolean {
    const settings = this.getUserNotificationSettings(userEmail);
    return settings[notificationType] === true;
  }

  // Método para probar el envío de notificaciones
  async testEmailNotification(userEmail: string, userName: string): Promise<boolean> {
    if (!this.shouldSendNotification(userEmail, 'emailNotifications')) {
      console.log('❌ Notificaciones por email deshabilitadas para este usuario');
      return false;
    }

    const testNotification: EmailNotification = {
      to: userEmail,
      subject: '✅ Prueba de notificaciones EcoTask',
      message: `
Hola ${userName},

¡Excelente! Las notificaciones por email están funcionando correctamente.

Esta es una notificación de prueba para confirmar que tu configuración está lista.

Ahora recibirás:
• Recordatorios de tareas importantes
• Invitaciones a eventos ecológicos  
• Actualizaciones de grupos
• Resúmenes semanales (si está habilitado)

¡Gracias por unirte a nuestra misión ecológica!

Saludos verdes,
EcoTask 🌱
      `,
      type: 'welcome'
    };

    return this.sendEmailNotification(testNotification);
  }
}

export const notificationService = new NotificationService();

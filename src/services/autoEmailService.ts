// Servicio automático de notificaciones por email para operaciones CRUD
import emailjs from '@emailjs/browser';
import { Task, Group, EcoEvent } from '../types';

export interface AutoEmailConfig {
  enabled: boolean;
  serviceId: string;
  templateId: string;
  publicKey: string;
}

class AutoEmailService {
  private config: AutoEmailConfig = {
    enabled: true,
    serviceId: 'service_ecotask_auto',
    templateId: 'template_ecotask_auto',
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY'
  };

  private isConfigured = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // En desarrollo, usar modo simulación
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 AutoEmailService inicializado en modo simulación');
        this.isConfigured = false;
      } else {
        emailjs.init(this.config.publicKey);
        this.isConfigured = true;
        console.log('📧 AutoEmailService configurado para producción');
      }
    } catch (error) {
      console.error('❌ Error al inicializar AutoEmailService:', error);
      this.isConfigured = false;
    }
  }

  // Obtener email del usuario actual desde localStorage
  private getCurrentUserEmail(): string | null {
    try {
      const authData = localStorage.getItem('auth-store');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.state?.user?.email || null;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener email del usuario:', error);
      return null;
    }
  }

  // Obtener nombre del usuario actual desde localStorage
  private getCurrentUserName(): string | null {
    try {
      const authData = localStorage.getItem('auth-store');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.state?.user?.name || null;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener nombre del usuario:', error);
      return null;
    }
  }

  // Enviar email automático
  private async sendAutoEmail(subject: string, message: string): Promise<void> {
    const userEmail = this.getCurrentUserEmail();
    const userName = this.getCurrentUserName();

    if (!userEmail) {
      console.warn('No se pudo obtener el email del usuario para notificación automática');
      return;
    }

    try {
      if (this.isConfigured && this.config.enabled) {
        // Envío real con EmailJS
        const templateParams = {
          to_email: userEmail,
          to_name: userName || userEmail.split('@')[0],
          subject: subject,
          message: message,
          from_name: 'EcoTask',
          reply_to: 'noreply@ecotask.app',
          timestamp: new Date().toLocaleString('es-ES')
        };

        await emailjs.send(
          this.config.serviceId,
          this.config.templateId,
          templateParams
        );

        console.log('✅ Email automático enviado exitosamente');
      } else {
        // Modo simulación para desarrollo
        console.log('🧪 Email automático simulado:', {
          to: userEmail,
          subject: subject,
          message: message,
          timestamp: new Date().toLocaleString('es-ES')
        });
        
        // Mostrar notificación visual en desarrollo
        this.showNotification(`📧 Email enviado a ${userEmail}: ${subject}`);
      }
    } catch (error) {
      console.error('❌ Error al enviar email automático:', error);
      // Fallback a notificación visual
      this.showNotification(`📧 Email procesado: ${subject}`);
    }
  }

  // Mostrar notificación visual como fallback
  private showNotification(message: string): void {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <span>✅</span>
        <span class="text-sm font-medium">${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Remover después de 5 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  // === MÉTODOS PÚBLICOS PARA OPERACIONES CRUD ===

  // Notificaciones de Tareas
  async notifyTaskCreated(task: Task): Promise<void> {
    const subject = '✅ Nueva tarea creada - EcoTask';
    const message = `
Hola,

Se ha creado una nueva tarea en tu cuenta de EcoTask:

📋 Título: ${task.title}
📝 Descripción: ${task.description}
🏷️ Categoría: ${task.category}
⚡ Prioridad: ${task.priority}
📅 Fecha de vencimiento: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES') : 'Sin fecha límite'}

¡Mantente organizado y cumple tus objetivos!

Saludos,
El equipo de EcoTask
    `.trim();

    await this.sendAutoEmail(subject, message);
  }

  async notifyTaskUpdated(task: Task): Promise<void> {
    const subject = '✏️ Tarea actualizada - EcoTask';
    const message = `
Hola,

Se ha actualizado una tarea en tu cuenta de EcoTask:

📋 Título: ${task.title}
📝 Descripción: ${task.description}
🏷️ Categoría: ${task.category}
⚡ Prioridad: ${task.priority}
📅 Fecha de vencimiento: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES') : 'Sin fecha límite'}
✅ Estado: ${task.completed ? 'Completada' : 'Pendiente'}

¡Sigue progresando hacia tus metas!

Saludos,
El equipo de EcoTask
    `.trim();

    await this.sendAutoEmail(subject, message);
  }

  async notifyTaskDeleted(taskTitle: string): Promise<void> {
    const subject = '🗑️ Tarea eliminada - EcoTask';
    const message = `
Hola,

Se ha eliminado una tarea de tu cuenta de EcoTask:

📋 Título: ${taskTitle}

La tarea ha sido removida permanentemente de tu lista.

Saludos,
El equipo de EcoTask
    `.trim();

    await this.sendAutoEmail(subject, message);
  }

  // Notificaciones de Grupos
  async notifyGroupCreated(group: Group): Promise<void> {
    const subject = '👥 Nuevo grupo creado - EcoTask';
    const message = `
Hola,

Se ha creado un nuevo grupo en tu cuenta de EcoTask:

👥 Nombre: ${group.name}
📝 Descripción: ${group.description}
👤 Miembros: ${group.members.length} persona(s)
🎨 Color: ${group.color}

¡Colabora y alcanza objetivos en equipo!

Saludos,
El equipo de EcoTask
    `.trim();

    await this.sendAutoEmail(subject, message);
  }

  async notifyGroupUpdated(group: Group): Promise<void> {
    const subject = '👥 Grupo actualizado - EcoTask';
    const message = `
Hola,

Se ha actualizado un grupo en tu cuenta de EcoTask:

👥 Nombre: ${group.name}
📝 Descripción: ${group.description}
👤 Miembros: ${group.members.length} persona(s)
🎨 Color: ${group.color}

¡El trabajo en equipo hace que los sueños se hagan realidad!

Saludos,
El equipo de EcoTask
    `.trim();

    await this.sendAutoEmail(subject, message);
  }

  async notifyGroupDeleted(groupName: string): Promise<void> {
    const subject = '🗑️ Grupo eliminado - EcoTask';
    const message = `
Hola,

Se ha eliminado un grupo de tu cuenta de EcoTask:

👥 Nombre: ${groupName}

El grupo ha sido removido permanentemente de tu cuenta.

Saludos,
El equipo de EcoTask
    `.trim();

    await this.sendAutoEmail(subject, message);
  }

  // Notificaciones de Eventos
  async notifyEventCreated(event: EcoEvent): Promise<void> {
    const subject = '🌱 Nuevo evento ecológico creado - EcoTask';
    const message = `
Hola,

Se ha creado un nuevo evento ecológico en tu cuenta de EcoTask:

🌱 Título: ${event.title}
📝 Descripción: ${event.description}
📅 Fecha: ${new Date(event.date).toLocaleDateString('es-ES')}
📍 Ubicación: ${event.location}
🏷️ Tipo: ${event.type}
👥 Participantes máximos: ${event.maxParticipants || 'Sin límite'}
👤 Participantes actuales: ${event.participants.length}

¡Juntos podemos hacer la diferencia por el planeta!

Saludos,
El equipo de EcoTask
    `.trim();

    await this.sendAutoEmail(subject, message);
  }

  async notifyEventUpdated(event: EcoEvent): Promise<void> {
    const subject = '🌱 Evento ecológico actualizado - EcoTask';
    const message = `
Hola,

Se ha actualizado un evento ecológico en tu cuenta de EcoTask:

🌱 Título: ${event.title}
📝 Descripción: ${event.description}
📅 Fecha: ${new Date(event.date).toLocaleDateString('es-ES')}
📍 Ubicación: ${event.location}
🏷️ Tipo: ${event.type}
👥 Participantes máximos: ${event.maxParticipants || 'Sin límite'}
👤 Participantes actuales: ${event.participants.length}

¡Cada acción cuenta para nuestro planeta!

Saludos,
El equipo de EcoTask
    `.trim();

    await this.sendAutoEmail(subject, message);
  }

  async notifyEventDeleted(eventTitle: string): Promise<void> {
    const subject = '🗑️ Evento ecológico eliminado - EcoTask';
    const message = `
Hola,

Se ha eliminado un evento ecológico de tu cuenta de EcoTask:

🌱 Título: ${eventTitle}

El evento ha sido removido permanentemente de tu cuenta.

Saludos,
El equipo de EcoTask
    `.trim();

    await this.sendAutoEmail(subject, message);
  }

  // Configuración del servicio
  updateConfig(newConfig: Partial<AutoEmailConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.publicKey) {
      this.initialize();
    }
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }
}

// Exportar instancia singleton
export const autoEmailService = new AutoEmailService();

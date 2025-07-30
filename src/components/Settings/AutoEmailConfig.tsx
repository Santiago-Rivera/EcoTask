import React, { useState, useEffect } from 'react';
import { Mail, Settings, Check, X } from 'lucide-react';
import { autoEmailService } from '../../services/autoEmailService';

interface AutoEmailConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

const AutoEmailConfig: React.FC<AutoEmailConfigProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState({
    enabled: true,
    serviceId: '',
    templateId: '',
    publicKey: ''
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Cargar configuración actual
    setConfig({
      enabled: autoEmailService.isEnabled(),
      serviceId: '',
      templateId: '',
      publicKey: ''
    });
  }, [isOpen]);

  const handleToggleEnabled = () => {
    const newEnabled = !config.enabled;
    setConfig(prev => ({ ...prev, enabled: newEnabled }));
    autoEmailService.setEnabled(newEnabled);
  };

  const handleSaveConfig = () => {
    if (showAdvanced && config.serviceId && config.templateId && config.publicKey) {
      autoEmailService.updateConfig({
        enabled: config.enabled,
        serviceId: config.serviceId,
        templateId: config.templateId,
        publicKey: config.publicKey
      });
      alert('✅ Configuración de EmailJS guardada exitosamente');
    }
    onClose();
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      alert('Por favor ingresa un email para probar');
      return;
    }

    setIsTesting(true);
    try {
      // Simular envío de email de prueba
      const subject = '🧪 Email de prueba - EcoTask';
      const message = `
Hola,

Este es un email de prueba del sistema de notificaciones automáticas de EcoTask.

Si recibes este mensaje, significa que el sistema está funcionando correctamente.

Saludos,
El equipo de EcoTask
      `.trim();

      // En lugar de enviar un email real, mostrar una notificación
      console.log('🧪 Test de email automático:', {
        to: testEmail,
        subject,
        message,
        timestamp: new Date().toISOString()
      });

      // Crear notificación visual
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm';
      notification.style.zIndex = '9999';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>🧪</span>
          <span class="text-sm font-medium">Email de prueba procesado para ${testEmail}</span>
        </div>
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 5000);

      setTestEmail('');
      alert('✅ Email de prueba procesado correctamente');
    } catch (error) {
      console.error('Error en test de email:', error);
      alert('❌ Error al procesar email de prueba');
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-primary-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-200 dark:border-primary-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white">
                Notificaciones Automáticas por Email
              </h2>
              <p className="text-sm text-primary-500 dark:text-primary-400">
                Configura el envío automático de emails para todas las acciones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Cerrar configuración"
            className="p-2 text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Estado Actual */}
          <div className="bg-primary-50 dark:bg-primary-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-primary-900 dark:text-white">Estado del Sistema</h3>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  {config.enabled 
                    ? '✅ Las notificaciones automáticas están habilitadas'
                    : '❌ Las notificaciones automáticas están deshabilitadas'
                  }
                </p>
              </div>
              <button
                onClick={handleToggleEnabled}
                title={config.enabled ? 'Deshabilitar notificaciones' : 'Habilitar notificaciones'}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${config.enabled 
                    ? 'bg-green-500' 
                    : 'bg-primary-200 dark:bg-primary-700'
                  }
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${config.enabled ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>

          {/* Funcionalidades */}
          <div className="space-y-4">
            <h3 className="font-medium text-primary-900 dark:text-white">¿Qué se enviará automáticamente?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">📋 Tareas</h4>
                <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                  <li>• Crear tarea</li>
                  <li>• Editar tarea</li>
                  <li>• Eliminar tarea</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">👥 Grupos</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Crear grupo</li>
                  <li>• Editar grupo</li>
                  <li>• Eliminar grupo</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">🌱 Eventos</h4>
                <ul className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
                  <li>• Crear evento</li>
                  <li>• Editar evento</li>
                  <li>• Eliminar evento</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Test de Email */}
          <div className="space-y-4">
            <h3 className="font-medium text-primary-900 dark:text-white">Probar Sistema</h3>
            <div className="flex space-x-2">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Ingresa un email para probar"
                className="flex-1 px-4 py-2 border border-primary-300 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-800 text-primary-900 dark:text-white placeholder-primary-500 dark:placeholder-primary-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleTestEmail}
                disabled={isTesting || !testEmail}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-primary-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                {isTesting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Probando...</span>
                  </>
                ) : (
                  <>
                    <Mail size={16} />
                    <span>Probar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Configuración Avanzada */}
          <div className="space-y-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white transition-colors"
            >
              <Settings size={16} />
              <span>Configuración Avanzada de EmailJS</span>
              <span className="text-xs">(Opcional)</span>
            </button>

            {showAdvanced && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700 space-y-4">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div className="text-sm text-yellow-800 dark:text-yellow-300">
                    <p className="font-medium mb-1">Configuración para Producción</p>
                    <p>Para enviar emails reales en producción, configura tu cuenta de EmailJS:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Crea una cuenta en <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">emailjs.com</a></li>
                      <li>Configura un servicio de email (Gmail, Outlook, etc.)</li>
                      <li>Crea un template de email</li>
                      <li>Obtén tus credenciales y configúralas abajo</li>
                    </ol>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                      Service ID
                    </label>
                    <input
                      type="text"
                      value={config.serviceId}
                      onChange={(e) => setConfig(prev => ({ ...prev, serviceId: e.target.value }))}
                      placeholder="service_xxxxxxx"
                      className="w-full px-3 py-2 border border-yellow-300 dark:border-yellow-600 rounded-lg bg-white dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                      Template ID
                    </label>
                    <input
                      type="text"
                      value={config.templateId}
                      onChange={(e) => setConfig(prev => ({ ...prev, templateId: e.target.value }))}
                      placeholder="template_xxxxxxx"
                      className="w-full px-3 py-2 border border-yellow-300 dark:border-yellow-600 rounded-lg bg-white dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                      Public Key
                    </label>
                    <input
                      type="text"
                      value={config.publicKey}
                      onChange={(e) => setConfig(prev => ({ ...prev, publicKey: e.target.value }))}
                      placeholder="xxxxxxxxxxxxxxx"
                      className="w-full px-3 py-2 border border-yellow-300 dark:border-yellow-600 rounded-lg bg-white dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-primary-200 dark:border-primary-700">
          <div className="text-sm text-primary-500 dark:text-primary-400">
            En desarrollo, las notificaciones se muestran en consola
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveConfig}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Check size={16} />
              <span>Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoEmailConfig;

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Calendar, MapPin } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { notificationService } from '../../services/notificationService';
import { EcoEvent } from '../../types';

interface EventFormProps {
  event?: EcoEvent | null;
  onCancel: () => void;
  onSave: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onCancel, onSave }) => {
  const { addEvent, updateEvent } = useAppStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    type: 'cleanup' as 'cleanup' | 'planting' | 'education' | 'conservation' | 'other',
    maxParticipants: '',
  });

  const eventTypes = [
    { value: 'cleanup', label: 'Limpieza Ambiental' },
    { value: 'planting', label: 'Plantación de Árboles' },
    { value: 'education', label: 'Educación Ambiental' },
    { value: 'conservation', label: 'Conservación' },
    { value: 'other', label: 'Otro' }
  ];

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location,
        type: event.type,
        maxParticipants: event.maxParticipants?.toString() || '',
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date),
      location: formData.location,
      type: formData.type,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
      participants: event ? event.participants : [],
      createdBy: user?.id || '',
    };

    if (event) {
      updateEvent(event.id, eventData);
    } else {
      const newEvent = addEvent(eventData);
      
      // Enviar notificación automática si el usuario tiene email configurado
      if (user?.email && newEvent) {
        const templateData = {
          eventTitle: formData.title,
          eventDescription: formData.description,
          eventDate: new Date(formData.date).toLocaleDateString('es-ES'),
          eventLocation: formData.location,
          eventType: eventTypes.find(t => t.value === formData.type)?.label || formData.type,
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
          userEmail: user.email,
          userName: user.name || 'Usuario'
        };
        const template = notificationService.getEmailTemplate('eventCreated', templateData);
        
        notificationService.sendEmailNotification({
          to: user.email,
          subject: template.subject,
          message: template.message,
          type: 'eventCreated'
        }).catch((error: unknown) => {
          console.warn('Error al enviar notificación de evento creado:', error);
        });
      }
    }
    
    onSave();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onCancel}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Volver"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {event ? 'Editar Evento' : 'Nuevo Evento Ecológico'}
            </h1>
            <p className="text-gray-600 mt-1">
              {event ? 'Modifica los detalles del evento' : 'Crea un nuevo evento ambiental'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Evento *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Nombre del evento ecológico"
                required
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe el evento, objetivos, actividades a realizar..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha y Hora *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                  placeholder="Selecciona fecha y hora"
                  title="Selecciona la fecha y hora del evento"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Dirección o ubicación del evento"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="event-type" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Evento *
              </label>
              <select
                id="event-type"
                aria-label="Tipo de Evento"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'cleanup' | 'planting' | 'education' | 'conservation' | 'other' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máximo de Participantes
              </label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Sin límite"
                min="1"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
            <h4 className="text-sm font-medium text-emerald-800 mb-3">Vista Previa del Evento</h4>
            <div className="space-y-2">
              <h5 className="font-semibold text-emerald-900">
                {formData.title || 'Título del evento'}
              </h5>
              <p className="text-sm text-emerald-700">
                {formData.description || 'Descripción del evento'}
              </p>
              <div className="flex items-center space-x-4 text-sm text-emerald-600">
                <span className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>
                    {formData.date 
                      ? new Date(formData.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Fecha por definir'
                    }
                  </span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>{formData.location || 'Ubicación por definir'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <X size={16} />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>{event ? 'Actualizar' : 'Crear'} Evento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
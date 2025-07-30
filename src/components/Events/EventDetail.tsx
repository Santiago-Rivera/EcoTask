import React from 'react';
import { ArrowLeft, Edit2, Trash2, Calendar, MapPin, Users, Clock, User, Flag } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface EventDetailProps {
  onBack: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ onBack }) => {
  const { selectedEvent, deleteEvent } = useAppStore();

  if (!selectedEvent) {
    return null;
  }

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      deleteEvent(selectedEvent.id);
      onBack();
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'cleanup': return 'bg-blue-100 text-blue-600';
      case 'planting': return 'bg-green-100 text-green-600';
      case 'education': return 'bg-purple-100 text-purple-600';
      case 'conservation': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'cleanup': return 'Limpieza Ambiental';
      case 'planting': return 'Plantación de Árboles';
      case 'education': return 'Educación Ambiental';
      case 'conservation': return 'Conservación';
      default: return 'Otro';
    }
  };

  const isUpcoming = new Date(selectedEvent.date) > new Date();
  const spotsAvailable = selectedEvent.maxParticipants 
    ? selectedEvent.maxParticipants - selectedEvent.participants.length 
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalles del Evento</h1>
            <p className="text-gray-600 mt-1">Información completa del evento ecológico</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors flex items-center space-x-2"
          >
            <Edit2 size={16} />
            <span>Editar</span>
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-2"
          >
            <Trash2 size={16} />
            <span>Eliminar</span>
          </button>
        </div>
      </div>

      {/* Event Hero */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(selectedEvent.type)} text-emerald-800 bg-white`}>
                {getEventTypeLabel(selectedEvent.type)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {isUpcoming ? 'Próximamente' : 'Finalizado'}
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-3">{selectedEvent.title}</h2>
            <p className="text-emerald-100 text-lg leading-relaxed">
              {selectedEvent.description}
            </p>
          </div>
        </div>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Participantes</p>
              <p className="text-3xl font-bold text-gray-900">{selectedEvent.participants.length}</p>
              {selectedEvent.maxParticipants && (
                <p className="text-sm text-gray-500">de {selectedEvent.maxParticipants} máximo</p>
              )}
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Espacios Disponibles</p>
              <p className="text-3xl font-bold text-gray-900">
                {spotsAvailable !== null ? spotsAvailable : '∞'}
              </p>
              <p className="text-sm text-gray-500">
                {spotsAvailable !== null 
                  ? (spotsAvailable > 0 ? 'disponibles' : 'completo')
                  : 'sin límite'
                }
              </p>
            </div>
            <Flag className="w-8 h-8 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estado</p>
              <p className="text-3xl font-bold text-gray-900">
                {isUpcoming ? '📅' : '✅'}
              </p>
              <p className="text-sm text-gray-500">
                {isUpcoming ? 'Programado' : 'Completado'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Información del Evento</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Fecha y Hora</p>
                <p className="text-gray-600">
                  {new Date(selectedEvent.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Ubicación</p>
                <p className="text-gray-600">{selectedEvent.location}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Organizador</p>
                <p className="text-gray-600">Evento #{selectedEvent.createdBy}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Fecha de Creación</p>
                <p className="text-gray-600">
                  {new Date(selectedEvent.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Participantes</h3>
          
          {selectedEvent.participants.length > 0 ? (
            <div className="space-y-3">
              {selectedEvent.participants.slice(0, 5).map((participant, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Participante #{index + 1}</p>
                    <p className="text-sm text-gray-500">Confirmado</p>
                  </div>
                </div>
              ))}
              {selectedEvent.participants.length > 5 && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Y {selectedEvent.participants.length - 5} participantes más...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500">Aún no hay participantes registrados</p>
              <p className="text-sm text-gray-400 mt-1">¡Sé el primero en unirte!</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      {isUpcoming && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">¿Te interesa participar?</h3>
              <p className="text-gray-600 mt-1">Únete a este evento ecológico y contribuye al cuidado del medio ambiente</p>
            </div>
            <button
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              disabled={spotsAvailable === 0}
            >
              {spotsAvailable === 0 ? 'Evento Completo' : 'Unirse al Evento'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
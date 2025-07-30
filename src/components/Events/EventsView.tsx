import React, { useState } from 'react';
import { Plus, Filter, Search, Edit2, Trash2, Eye, MapPin, Calendar as CalendarIcon, Users } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import EventForm from './EventForm';
import EventDetail from './EventDetail';

const EventsView: React.FC = () => {
  const { events, deleteEvent, setSelectedEvent } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showDetail, setShowDetail] = useState(false);

  const eventTypes = [
    { value: 'cleanup', label: 'Limpieza' },
    { value: 'planting', label: 'Plantación' },
    { value: 'education', label: 'Educación' },
    { value: 'conservation', label: 'Conservación' },
    { value: 'other', label: 'Otro' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || event.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleViewDetail = (event) => {
    setSelectedEvent(event);
    setShowDetail(true);
  };

  const handleDelete = (eventId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      deleteEvent(eventId);
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'cleanup': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'planting': return 'bg-green-100 text-green-600 border-green-200';
      case 'education': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'conservation': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getEventTypeLabel = (type) => {
    const typeObj = eventTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  if (showDetail) {
    return <EventDetail onBack={() => setShowDetail(false)} />;
  }

  if (showForm) {
    return (
      <EventForm
        event={editingEvent}
        onCancel={() => {
          setShowForm(false);
          setEditingEvent(null);
        }}
        onSave={() => {
          setShowForm(false);
          setEditingEvent(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eventos Ecológicos</h1>
          <p className="text-gray-600 mt-1">Organiza y participa en eventos ambientales</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nuevo Evento</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const isUpcoming = new Date(event.date) > new Date();
          
          return (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {event.description}
                  </p>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleViewDetail(event)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CalendarIcon size={16} />
                  <span>
                    {new Date(event.date).toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isUpcoming ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isUpcoming ? 'Próximo' : 'Pasado'}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span className="truncate">{event.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                    {getEventTypeLabel(event.type)}
                  </span>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Users size={16} />
                    <span>{event.participants.length}</span>
                    {event.maxParticipants && (
                      <span>/ {event.maxParticipants}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron eventos</h3>
          <p className="text-gray-600">
            {searchTerm || typeFilter 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'Crea tu primer evento ecológico para comenzar'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsView;
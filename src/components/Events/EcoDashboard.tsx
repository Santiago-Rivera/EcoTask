import React from 'react';
import { Leaf, TreePine, Recycle, Users, Calendar, TrendingUp, Award, Globe } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const EcoDashboard: React.FC = () => {
  const { events } = useAppStore();

  const upcomingEvents = events.filter(event => new Date(event.date) > new Date());
  const completedEvents = events.filter(event => new Date(event.date) <= new Date());
  
  const eventsByType = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalParticipants = events.reduce((total, event) => total + event.participants.length, 0);

  const stats = [
    {
      title: 'Eventos Creados',
      value: events.length,
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Eventos Completados',
      value: completedEvents.length,
      icon: Award,
      color: 'bg-emerald-100 text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Participantes Total',
      value: totalParticipants,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Eventos Próximos',
      value: upcomingEvents.length,
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const eventTypeStats = [
    { type: 'cleanup', label: 'Limpieza', icon: Recycle, count: eventsByType.cleanup || 0, color: 'bg-blue-500' },
    { type: 'planting', label: 'Plantación', icon: TreePine, count: eventsByType.planting || 0, color: 'bg-green-500' },
    { type: 'education', label: 'Educación', icon: Globe, count: eventsByType.education || 0, color: 'bg-purple-500' },
    { type: 'conservation', label: 'Conservación', icon: Leaf, count: eventsByType.conservation || 0, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Ecológico</h1>
          <p className="text-gray-600 mt-1">Monitorea el impacto de tus eventos ambientales</p>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-lg">
          <Leaf className="w-5 h-5 text-emerald-600" />
          <span className="text-emerald-700 font-medium">Impacto Ambiental</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Event Types Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tipos de Eventos</h3>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {eventTypeStats.map((stat) => {
              const Icon = stat.icon;
              const percentage = events.length > 0 ? (stat.count / events.length) * 100 : 0;
              
              return (
                <div key={stat.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${stat.color.replace('bg-', 'bg-').replace('-500', '-100')} ${stat.color.replace('bg-', 'text-').replace('-500', '-600')}`}>
                      <Icon size={16} />
                    </div>
                    <span className="font-medium text-gray-900">{stat.label}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${stat.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-8">{stat.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Eventos Recientes</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {events.slice(-5).reverse().map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                  event.type === 'cleanup' ? 'bg-blue-500' :
                  event.type === 'planting' ? 'bg-green-500' :
                  event.type === 'education' ? 'bg-purple-500' :
                  event.type === 'conservation' ? 'bg-emerald-500' : 'bg-gray-500'
                }`}>
                  {event.type === 'cleanup' ? <Recycle size={20} /> :
                   event.type === 'planting' ? <TreePine size={20} /> :
                   event.type === 'education' ? <Globe size={20} /> :
                   <Leaf size={20} />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">{event.title}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{event.location}</span>
                    <span>•</span>
                    <span>{event.participants.length} participantes</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  new Date(event.date) > new Date()
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {new Date(event.date) > new Date() ? 'Próximo' : 'Completado'}
                </span>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-gray-500 text-center py-8">No hay eventos creados aún</p>
            )}
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Resumen de Impacto Ambiental</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-emerald-100">
              <div>
                <p className="text-3xl font-bold text-white">{events.length}</p>
                <p className="text-sm">Eventos Organizados</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{totalParticipants}</p>
                <p className="text-sm">Personas Involucradas</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{completedEvents.length}</p>
                <p className="text-sm">Actividades Completadas</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Award className="w-12 h-12 text-yellow-300" />
            <Leaf className="w-12 h-12 text-emerald-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoDashboard;
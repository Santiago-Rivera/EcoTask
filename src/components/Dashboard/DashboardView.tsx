import React from 'react';
import { CheckSquare, Users, Calendar, TrendingUp, Leaf, Award } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';

const DashboardView: React.FC = () => {
  const { tasks, groups, events } = useAppStore();
  const { t } = useTranslation();

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;

  const stats = [
    {
      title: t('dashboard.completedTasks'),
      value: completedTasks,
      icon: CheckSquare,
      color: 'text-accent-600 dark:text-accent-400',
      bgColor: 'bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/20',
      borderColor: 'border-accent-200/50 dark:border-accent-700/30'
    },
    {
      title: t('dashboard.pendingTasks'),
      value: pendingTasks,
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20',
      borderColor: 'border-blue-200/50 dark:border-blue-700/30'
    },
    {
      title: t('dashboard.activeGroups'),
      value: groups.length,
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20',
      borderColor: 'border-purple-200/50 dark:border-purple-700/30'
    },
    {
      title: t('dashboard.upcomingEvents'),
      value: upcomingEvents,
      icon: Calendar,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20',
      borderColor: 'border-orange-200/50 dark:border-orange-700/30'
    }
  ];

  const recentTasks = tasks.slice(-5).reverse();
  const upcomingEventsData = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white">{t('nav.dashboard')}</h1>
          <p className="text-primary-600 dark:text-primary-400 mt-2">{t('dashboard.welcomeMessage')}</p>
        </div>
        <div className="flex items-center space-x-3 bg-gradient-to-r from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/20 px-4 py-3 rounded-xl border border-accent-200/50 dark:border-accent-700/30 shadow-soft">
          <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="text-accent-700 dark:text-accent-300 font-semibold text-sm">{t('dashboard.positiveImpact')}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-2xl p-6 border ${stat.borderColor} shadow-soft hover:shadow-medium transition-all duration-200 group cursor-pointer`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-primary-900 dark:text-white group-hover:scale-105 transition-transform duration-200">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="bg-white/80 dark:bg-primary-900/50 backdrop-blur-sm rounded-2xl border border-primary-200/50 dark:border-primary-800/50 p-6 shadow-soft hover:shadow-medium transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-primary-900 dark:text-white">{t('dashboard.recentTasks')}</h3>
            <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
              <CheckSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-4 p-4 bg-primary-50/50 dark:bg-primary-900/30 rounded-xl border border-primary-200/30 dark:border-primary-800/30 hover:bg-primary-100/50 dark:hover:bg-primary-800/30 transition-all duration-200 group">
                  <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-accent-500' : 'bg-primary-400'} group-hover:scale-110 transition-transform duration-200`} />
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${task.completed ? 'text-primary-500 line-through' : 'text-primary-900 dark:text-white'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">{task.category}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-lg ${
                    task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800' :
                    'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                  }`}>
                    {task.priority === 'high' ? t('tasks.high') : task.priority === 'medium' ? t('tasks.medium') : t('tasks.low')}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="w-8 h-8 text-primary-400" />
                </div>
                <p className="text-primary-500 dark:text-primary-400 text-sm">No hay tareas recientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white/80 dark:bg-primary-900/50 backdrop-blur-sm rounded-2xl border border-primary-200/50 dark:border-primary-800/50 p-6 shadow-soft hover:shadow-medium transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-primary-900 dark:text-white">Próximos Eventos</h3>
            <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
              <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="space-y-4">
            {upcomingEventsData.length > 0 ? (
              upcomingEventsData.map((event) => (
                <div key={event.id} className="p-4 bg-gradient-to-r from-accent-50/50 to-accent-100/50 dark:from-accent-900/20 dark:to-accent-800/10 rounded-xl border border-accent-200/30 dark:border-accent-700/20 hover:border-accent-300/50 dark:hover:border-accent-600/30 transition-all duration-200 group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-primary-900 dark:text-white text-sm group-hover:text-accent-700 dark:group-hover:text-accent-300 transition-colors duration-200">{event.title}</h4>
                      <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">{event.location}</p>
                      <div className="flex items-center space-x-2 mt-3">
                        <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                        <p className="text-xs text-primary-500 dark:text-primary-400 font-medium">
                          {new Date(event.date).toLocaleDateString('es-ES', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-lg border ${
                      event.type === 'cleanup' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                      event.type === 'planting' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' :
                      event.type === 'education' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' :
                      'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-700'
                    }`}>
                      {event.type === 'cleanup' ? 'Limpieza' :
                       event.type === 'planting' ? 'Plantación' :
                       event.type === 'education' ? 'Educación' :
                       event.type === 'conservation' ? 'Conservación' : 'Otro'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-primary-400" />
                </div>
                <p className="text-primary-500 dark:text-primary-400 text-sm">No hay eventos próximos</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Achievement Section */}
      <div className="bg-gradient-to-r from-accent-500/10 to-accent-600/10 dark:from-accent-400/10 dark:to-accent-500/10 rounded-2xl p-8 border border-accent-200/50 dark:border-accent-700/30 shadow-soft backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-3 text-primary-900 dark:text-white">¡Excelente trabajo!</h3>
            <p className="text-primary-600 dark:text-primary-400 text-lg">
              Has completado <span className="font-bold text-accent-600 dark:text-accent-400">{completedTasks}</span> tareas y participado en <span className="font-bold text-accent-600 dark:text-accent-400">{events.length}</span> eventos ecológicos.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/50 dark:to-yellow-800/50 rounded-2xl border border-yellow-200 dark:border-yellow-700">
              <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="p-4 bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900/50 dark:to-accent-800/50 rounded-2xl border border-accent-200 dark:border-accent-700">
              <Leaf className="w-8 h-8 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
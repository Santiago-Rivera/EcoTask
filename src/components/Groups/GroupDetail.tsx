import React from 'react';
import { ArrowLeft, Edit2, Trash2, Users, Mail, Calendar, Settings } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface GroupDetailProps {
  onBack: () => void;
}

const GroupDetail: React.FC<GroupDetailProps> = ({ onBack }) => {
  const { selectedGroup, tasks, deleteGroup } = useAppStore();

  if (!selectedGroup) {
    return null;
  }

  const groupTasks = tasks.filter(task => task.groupId === selectedGroup.id);
  const completedTasks = groupTasks.filter(task => task.completed).length;

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
      deleteGroup(selectedGroup.id);
      onBack();
    }
  };

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
          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: selectedGroup.color }}
            >
              {selectedGroup.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedGroup.name}</h1>
              <p className="text-gray-600 mt-1">{selectedGroup.members.length} miembros activos</p>
            </div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Miembros</p>
              <p className="text-3xl font-bold text-gray-900">{selectedGroup.members.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tareas Asignadas</p>
              <p className="text-3xl font-bold text-gray-900">{groupTasks.length}</p>
            </div>
            <Settings className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tareas Completadas</p>
              <p className="text-3xl font-bold text-gray-900">{completedTasks}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Grupo</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Descripción</h4>
              <p className="text-gray-600 leading-relaxed">
                {selectedGroup.description || 'Sin descripción disponible'}
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Fecha de Creación</p>
                <p className="text-gray-600">
                  {new Date(selectedGroup.createdAt).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Miembros del Grupo</h3>
          
          <div className="space-y-3">
            {selectedGroup.members.length > 0 ? (
              selectedGroup.members.map((member, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{member}</p>
                    <p className="text-sm text-gray-500">Miembro del equipo</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay miembros asignados</p>
            )}
          </div>
        </div>
      </div>

      {/* Group Tasks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tareas del Grupo</h3>
        
        {groupTasks.length > 0 ? (
          <div className="space-y-3">
            {groupTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  <div>
                    <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600">{task.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-600' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {task.completed ? 'Completada' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No hay tareas asignadas a este grupo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;
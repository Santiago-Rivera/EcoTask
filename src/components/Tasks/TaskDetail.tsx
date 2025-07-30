import React from 'react';
import { ArrowLeft, Edit2, Trash2, Calendar, User, Tag, Flag, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface TaskDetailProps {
  onBack: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ onBack }) => {
  const { selectedTask, groups, updateTask, deleteTask } = useAppStore();

  if (!selectedTask) {
    return null;
  }

  const group = selectedTask.groupId ? groups.find(g => g.id === selectedTask.groupId) : null;

  const handleToggleComplete = () => {
    updateTask(selectedTask.id, { completed: !selectedTask.completed });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      deleteTask(selectedTask.id);
      onBack();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalles de la Tarea</h1>
            <p className="text-gray-600 mt-1">Información completa de la tarea</p>
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

      {/* Task Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${selectedTask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {selectedTask.title}
              </h2>
              <div className="flex items-center space-x-4 mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedTask.priority)}`}>
                  <Flag size={14} className="inline mr-1" />
                  Prioridad {getPriorityText(selectedTask.priority)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTask.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {selectedTask.completed ? 'Completada' : 'Pendiente'}
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleComplete}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTask.completed
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {selectedTask.completed ? 'Marcar Pendiente' : 'Marcar Completada'}
            </button>
          </div>

          {/* Description */}
          {selectedTask.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">{selectedTask.description}</p>
            </div>
          )}

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Categoría</p>
                  <p className="text-gray-600">{selectedTask.category}</p>
                </div>
              </div>

              {group && (
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Grupo Asignado</p>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <p className="text-gray-600">{group.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedTask.dueDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Fecha de Vencimiento</p>
                    <p className="text-gray-600">
                      {new Date(selectedTask.dueDate).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Fecha de Creación</p>
                  <p className="text-gray-600">
                    {new Date(selectedTask.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {selectedTask.assignedTo && selectedTask.assignedTo.length > 0 && (
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Asignado a</p>
                    <p className="text-gray-600">{selectedTask.assignedTo.length} miembro(s)</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-gray-500 mb-1">Estado</div>
            <div className={`font-medium ${selectedTask.completed ? 'text-emerald-600' : 'text-yellow-600'}`}>
              {selectedTask.completed ? 'Tarea completada' : 'En progreso'}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-gray-500 mb-1">Prioridad</div>
            <div className="font-medium">{getPriorityText(selectedTask.priority)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-gray-500 mb-1">Categoría</div>
            <div className="font-medium">{selectedTask.category}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
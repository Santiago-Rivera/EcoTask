import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { notificationService } from '../../services/notificationService';
import { Task } from '../../types';

interface TaskFormProps {
  task?: Task | null;
  onCancel: () => void;
  onSave: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onCancel, onSave }) => {
  const { addTask, updateTask, categories, groups } = useAppStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    groupId: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    completed: false,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        category: task.category,
        groupId: task.groupId || '',
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        completed: task.completed,
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      groupId: formData.groupId || undefined,
      assignedTo: [],
    };

    if (task) {
      updateTask(task.id, taskData);
      
      // Enviar notificación de actualización de tarea
      if (user?.email && notificationService.shouldSendNotification(user.email, 'taskReminders')) {
        await notificationService.sendTaskReminder(user.email, {
          userName: user.name || 'Usuario',
          taskTitle: formData.title,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Sin fecha límite',
          priority: formData.priority,
          description: `Tarea actualizada: ${formData.description || 'Sin descripción'}`
        });
      }
    } else {
      addTask(taskData);
      
      // Enviar notificación de nueva tarea creada
      if (user?.email && notificationService.shouldSendNotification(user.email, 'emailNotifications')) {
        const template = notificationService.getEmailTemplate('taskCreated', {
          userName: user.name || 'Usuario',
          taskTitle: formData.title,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Sin fecha límite',
          priority: formData.priority,
          description: formData.description || 'Sin descripción',
          category: formData.category || 'Sin categoría'
        });
        
        await notificationService.sendEmailNotification({
          to: user.email,
          subject: template.subject,
          message: template.message,
          type: 'task'
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
              {task ? 'Editar Tarea' : 'Nueva Tarea'}
            </h1>
            <p className="text-gray-600 mt-1">
              {task ? 'Modifica los detalles de la tarea' : 'Crea una nueva tarea'}
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
                Título de la Tarea *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Nombre de la tarea"
                required
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe los detalles de la tarea..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                aria-label="Categoría"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                aria-label="Prioridad"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grupo (Opcional)
              </label>
              <select
                aria-label="Grupo (Opcional)"
                value={formData.groupId}
                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Sin grupo asignado</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                title="Selecciona la fecha de vencimiento"
                placeholder="Selecciona la fecha de vencimiento"
              />
            </div>

            {task && (
              <div className="lg:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="completed"
                    checked={formData.completed}
                    onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                  <label htmlFor="completed" className="ml-2 text-sm font-medium text-gray-700">
                    Marcar como completada
                  </label>
                </div>
              </div>
            )}
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
              <span>{task ? 'Actualizar' : 'Crear'} Tarea</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
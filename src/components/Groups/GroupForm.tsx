import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { notificationService } from '../../services/notificationService';
import { Group } from '../../types';

interface GroupFormProps {
  group?: Group | null;
  onCancel: () => void;
  onSave: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ group, onCancel, onSave }) => {
  const { addGroup, updateGroup } = useAppStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#10B981',
    members: [''],
  });

  const colorOptions = [
    { hex: '#10B981', name: 'emerald', class: 'bg-emerald-500' },
    { hex: '#3B82F6', name: 'blue', class: 'bg-blue-500' },
    { hex: '#8B5CF6', name: 'purple', class: 'bg-purple-500' },
    { hex: '#F59E0B', name: 'amber', class: 'bg-amber-500' },
    { hex: '#EF4444', name: 'red', class: 'bg-red-500' },
    { hex: '#06B6D4', name: 'cyan', class: 'bg-cyan-500' },
    { hex: '#EC4899', name: 'pink', class: 'bg-pink-500' },
    { hex: '#84CC16', name: 'lime', class: 'bg-lime-500' }
  ];

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description,
        color: group.color,
        members: group.members.length > 0 ? group.members : [''],
      });
    }
  }, [group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const groupData = {
      ...formData,
      members: formData.members.filter(member => member.trim() !== ''),
    };

    if (group) {
      updateGroup(group.id, groupData);
    } else {
      const newGroup = addGroup(groupData);
      
      // Enviar notificación automática si el usuario tiene email configurado
      if (user?.email && newGroup) {
        const templateData = {
          groupName: formData.name,
          groupDescription: formData.description,
          memberCount: groupData.members.length,
          color: formData.color,
          userEmail: user.email,
          userName: user.name || 'Usuario'
        };
        const template = notificationService.getEmailTemplate('groupCreated', templateData);
        
        notificationService.sendEmailNotification({
          to: user.email,
          subject: template.subject,
          message: template.message,
          type: 'groupCreated'
        }).catch((error: unknown) => {
          console.warn('Error al enviar notificación de grupo creado:', error);
        });
      }
    }
    
    onSave();
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = value;
    setFormData({ ...formData, members: newMembers });
  };

  const addMember = () => {
    setFormData({ ...formData, members: [...formData.members, ''] });
  };

  const removeMember = (index: number) => {
    const newMembers = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members: newMembers });
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
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {group ? 'Editar Grupo' : 'Nuevo Grupo'}
            </h1>
            <p className="text-gray-600 mt-1">
              {group ? 'Modifica los detalles del grupo' : 'Crea un nuevo grupo de trabajo'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Grupo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Nombre del grupo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color del Grupo
              </label>
              <div className="flex space-x-2">
                {colorOptions.map((colorOption) => (
                  <button
                    key={colorOption.hex}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: colorOption.hex })}
                    className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${colorOption.class} ${
                      formData.color === colorOption.hex ? 'border-gray-800 ring-2 ring-gray-300' : 'border-gray-200'
                    }`}
                    title={`Seleccionar color ${colorOption.name}`}
                    aria-label={`Seleccionar color ${colorOption.name}`}
                  />
                ))}
              </div>
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
                placeholder="Describe el propósito y objetivos del grupo..."
              />
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Miembros del Grupo
                </label>
                <button
                  type="button"
                  onClick={addMember}
                  className="flex items-center space-x-1 text-sm text-emerald-600 hover:text-emerald-700"
                >
                  <Plus size={16} />
                  <span>Agregar miembro</span>
                </button>
              </div>
              <div className="space-y-2">
                {formData.members.map((member, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="email"
                      value={member}
                      onChange={(e) => handleMemberChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="correo@ejemplo.com"
                    />
                    {formData.members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar miembro"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Vista Previa</h4>
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-white group-preview-color-${formData.color.replace('#', '')}`}
              >
                <span className="text-lg font-semibold">
                  {formData.name.charAt(0).toUpperCase() || 'G'}
                </span>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">
                  {formData.name || 'Nombre del grupo'}
                </h5>
                <p className="text-sm text-gray-500">
                  {formData.members.filter(m => m.trim()).length} miembros
                </p>
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
              <span>{group ? 'Actualizar' : 'Crear'} Grupo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default GroupForm;

/* Add the following CSS to your external stylesheet (e.g., GroupForm.css) and import it at the top of this file:
.group-color-swatch[data-color="#10B981"] { background-color: #10B981; }
.group-color-swatch[data-color="#3B82F6"] { background-color: #3B82F6; }
.group-color-swatch[data-color="#8B5CF6"] { background-color: #8B5CF6; }
.group-color-swatch[data-color="#F59E0B"] { background-color: #F59E0B; }
.group-color-swatch[data-color="#EF4444"] { background-color: #EF4444; }
.group-color-swatch[data-color="#06B6D4"] { background-color: #06B6D4; }
.group-color-swatch[data-color="#EC4899"] { background-color: #EC4899; }
.group-color-swatch[data-color="#84CC16"] { background-color: #84CC16; }
*/

// Then import the CSS file at the top of this file:
// import './GroupForm.css';
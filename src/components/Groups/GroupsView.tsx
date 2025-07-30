import React, { useState } from 'react';
import { Plus, Search, Users, Edit2, Trash2, Eye } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import GroupForm from './GroupForm';
import GroupDetail from './GroupDetail';
import { Group } from '../../types';

const GroupsView: React.FC = () => {
  const { groups, deleteGroup, setSelectedGroup } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetail, setShowDetail] = useState(false);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setShowForm(true);
  };

  const handleViewDetail = (group: Group) => {
    setSelectedGroup(group);
    setShowDetail(true);
  };

  const handleDelete = (groupId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
      deleteGroup(groupId);
    }
  };

  if (showDetail) {
    return <GroupDetail onBack={() => setShowDetail(false)} />;
  }

  if (showForm) {
    return (
      <GroupForm
        group={editingGroup}
        onCancel={() => {
          setShowForm(false);
          setEditingGroup(null);
        }}
        onSave={() => {
          setShowForm(false);
          setEditingGroup(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grupos</h1>
          <p className="text-gray-600 mt-1">Organiza equipos para colaborar en tareas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nuevo Grupo</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar grupos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>
      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length > 0 && (
          <>
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-white group-avatar`}
                      data-color={group.color}
                    >
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{group.name}</h3>
                      <p className="text-sm text-gray-500">{group.members.length} miembros</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleViewDetail(group)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver detalles"
                      aria-label="Ver detalles"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(group)}
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Editar grupo"
                      aria-label="Editar grupo"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(group.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar grupo"
                      aria-label="Eliminar grupo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {group.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Miembros activos</span>
                    <span className="text-sm text-gray-500">{group.members.length}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Creado: {new Date(group.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron grupos</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Intenta ajustar los términos de búsqueda' 
              : 'Crea tu primer grupo para empezar a colaborar'
            }
          </p>
        </div>
      )}
      </div>
  );
};

export default GroupsView;
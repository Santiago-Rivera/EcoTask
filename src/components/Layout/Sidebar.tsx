import React, { useState } from 'react';
import { 
  Home, 
  CheckSquare, 
  Users, 
  Calendar, 
  Leaf, 
  Menu, 
  X,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useTranslation } from '../../hooks/useTranslation';
import UserSettings from '../Settings/UserSettings';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
    { id: 'tasks', label: t('nav.tasks'), icon: CheckSquare },
    { id: 'groups', label: t('nav.groups'), icon: Users },
    { id: 'events', label: t('nav.events'), icon: Calendar },
    { id: 'eco-dashboard', label: t('nav.ecoProject'), icon: Leaf },
  ];

  const handleMenuClick = (viewId: string) => {
    onViewChange(viewId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-white dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-xl shadow-medium border border-primary-200 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-800 transition-all duration-200"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-primary-900/30 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white/95 dark:bg-primary-950/95 backdrop-blur-md border-r border-primary-200/80 dark:border-primary-800/80 z-50 transform transition-transform duration-300 ease-in-out shadow-medium
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Spacer for mobile button */}
          <div className="lg:hidden h-16"></div>
          
          {/* Logo */}
          <div className="p-6 border-b border-primary-100 dark:border-primary-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-soft">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-primary-900 dark:text-white">EcoTask</h1>
                <p className="text-xs text-primary-500 dark:text-primary-400">Gestión Inteligente</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-primary-100 dark:border-primary-800">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-10 h-10 rounded-xl object-cover border-2 border-primary-200 dark:border-primary-700 shadow-soft"
                onError={(e) => {
                  // Fallback en caso de error al cargar la imagen
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`;
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-primary-500 dark:text-primary-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`
                    w-full flex flex-col lg:flex-row items-center lg:space-x-3 space-y-1 lg:space-y-0 px-4 py-3 lg:py-3 rounded-xl text-center lg:text-left transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/30 text-accent-700 dark:text-accent-300 shadow-soft border border-accent-200/50 dark:border-accent-700/50' 
                      : 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 hover:text-primary-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} className={`${isActive ? 'text-accent-600 dark:text-accent-400' : 'group-hover:text-primary-700 dark:group-hover:text-primary-300'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-primary-100 dark:border-primary-800 space-y-2">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex flex-col lg:flex-row items-center lg:space-x-3 space-y-1 lg:space-y-0 px-4 py-3 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 hover:text-primary-900 dark:hover:text-white rounded-xl transition-all duration-200 group"
            >
              <Settings size={18} className="group-hover:text-primary-700 dark:group-hover:text-primary-300" />
              <span className="font-medium text-sm">{t('nav.settings')}</span>
            </button>
            <button
              onClick={logout}
              className="w-full flex flex-col lg:flex-row items-center lg:space-x-3 space-y-1 lg:space-y-0 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
            >
              <LogOut size={18} className="group-hover:text-red-700 dark:group-hover:text-red-300" />
              <span className="font-medium text-sm">{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Settings Modal */}
      <UserSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};

export default Sidebar;
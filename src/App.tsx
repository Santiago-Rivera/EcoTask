import { useState, useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { notificationService } from './services/notificationService';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Sidebar from './components/Layout/Sidebar';
import DashboardView from './components/Dashboard/DashboardView';
import TasksView from './components/Tasks/TasksView';
import GroupsView from './components/Groups/GroupsView';
import EventsView from './components/Events/EventsView';
import EcoDashboard from './components/Events/EcoDashboard';

function App() {
  const { isAuthenticated, listAllUsers } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const [isLogin, setIsLogin] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  // Aplicar tema al inicializar la aplicación
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Inicializar servicio de notificaciones
  useEffect(() => {
    notificationService.initializeEmailService();
    
    // Hacer el servicio disponible globalmente para configuración
    // @ts-expect-error - Agregando servicio de notificaciones al objeto global window
    window.notificationService = notificationService;
    console.log('📧 Servicio de notificaciones disponible en window.notificationService');
  }, []);

  // Debug helper - hacer funciones disponibles en la consola
  useEffect(() => {
    // @ts-expect-error - Agregando helpers de debug al objeto global window
    window.debugEcoTask = {
      listUsers: listAllUsers,
      clearUsers: () => {
        localStorage.removeItem('users-data');
        console.log('🗑️ Datos de usuarios eliminados');
      },
      showStorage: () => {
        console.log('📦 Auth Storage:', localStorage.getItem('auth-storage'));
        console.log('👥 Users Data:', localStorage.getItem('users-data'));
      }
    };
    console.log('🔧 Debug helpers disponibles en window.debugEcoTask');
  }, [listAllUsers]);

  if (!isAuthenticated) {
    return isLogin ? (
      <LoginForm onToggleMode={() => setIsLogin(false)} />
    ) : (
      <RegisterForm onToggleMode={() => setIsLogin(true)} />
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <TasksView />;
      case 'groups':
        return <GroupsView />;
      case 'events':
        return <EventsView />;
      case 'eco-dashboard':
        return <EcoDashboard />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950 flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-primary-900/50 backdrop-blur-sm rounded-2xl shadow-soft border border-primary-200/50 dark:border-primary-800/50 p-6 lg:p-8">
            {renderActiveView()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
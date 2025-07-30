import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Leaf } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import Notification from '../Notification';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { register, loginWithGoogle } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, name);
    } catch (error) {
      console.error('Error al registrarse:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      setNotification({ type: 'success', message: '¡Cuenta creada exitosamente con Google!' });
    } catch (error) {
      console.error('Error al registrarse con Google:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al conectar con Google. Inténtalo de nuevo.';
      setNotification({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-accent-50 dark:from-primary-950 dark:via-primary-900 dark:to-primary-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/70 dark:bg-primary-950/70 backdrop-blur-xl rounded-3xl shadow-strong p-8 border border-primary-200/30 dark:border-primary-800/30">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-medium">
              <Leaf className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2">
              Crear Cuenta
            </h2>
            <p className="text-base text-primary-600 dark:text-primary-400">
              Únete a la comunidad EcoTask
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-primary-500" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-primary-300 dark:border-primary-700 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all bg-white/50 dark:bg-primary-900/50 backdrop-blur-sm text-primary-900 dark:text-primary-100 text-lg placeholder-primary-400 dark:placeholder-primary-500"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-primary-500" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-primary-300 dark:border-primary-700 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all bg-white/50 dark:bg-primary-900/50 backdrop-blur-sm text-primary-900 dark:text-primary-100 text-lg placeholder-primary-400 dark:placeholder-primary-500"
                    placeholder="tu@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-primary-500" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-14 py-4 border border-primary-300 dark:border-primary-700 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all bg-white/50 dark:bg-primary-900/50 backdrop-blur-sm text-primary-900 dark:text-primary-100 text-lg placeholder-primary-400 dark:placeholder-primary-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600 dark:text-primary-500 dark:hover:text-primary-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-primary-500" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-14 py-4 border border-primary-300 dark:border-primary-700 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all bg-white/50 dark:bg-primary-900/50 backdrop-blur-sm text-primary-900 dark:text-primary-100 text-lg placeholder-primary-400 dark:placeholder-primary-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600 dark:text-primary-500 dark:hover:text-primary-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-medium hover:shadow-strong transform hover:-translate-y-0.5"
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary-300 dark:border-primary-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/70 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 font-medium">O continúa con</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-4 border border-primary-300 dark:border-primary-700 rounded-xl text-primary-700 dark:text-primary-300 bg-white/50 dark:bg-primary-900/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-primary-900/70 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all disabled:opacity-50 font-medium text-lg shadow-soft hover:shadow-medium"
              >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-base text-primary-600 dark:text-primary-400">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={onToggleMode}
              className="font-semibold text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 transition-colors"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default RegisterForm;
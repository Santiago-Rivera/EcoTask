import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authService } from '../services/authService';

// Helper para gestionar usuarios persistidos
const getUsersStorage = () => {
  try {
    const stored = localStorage.getItem('users-data');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveUserToStorage = (user: User) => {
  try {
    const users = getUsersStorage();
    users[user.email] = user;
    localStorage.setItem('users-data', JSON.stringify(users));
  } catch (error) {
    console.error('Error al guardar usuario:', error);
  }
};

const getUserFromStorage = (email: string): User | null => {
  try {
    const users = getUsersStorage();
    return users[email] || null;
  } catch {
    return null;
  }
};

// Función para convertir nombre completo a nombres separados
const parseFullName = (fullName: string) => {
  const parts = fullName.trim().split(' ').filter(part => part.length > 0);
  
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  if (parts.length === 2) return { firstName: parts[0], lastName: parts[1] };
  
  // Para más de 2 partes, tomar el primero como nombre y el resto como apellidos
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
};

// Función de debugging para ver todos los usuarios guardados
const listAllUsers = () => {
  try {
    const users = getUsersStorage();
    console.log('👥 Usuarios guardados:', users);
    return users;
  } catch {
    console.log('❌ Error al leer usuarios guardados');
    return {};
  }
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  // Función de debugging
  listAllUsers: () => Record<string, User>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string) => {
        console.log('🔑 Intentando login para:', email);
        
        // Intentar cargar usuario existente desde storage
        const existingUser = getUserFromStorage(email);
        
        if (existingUser) {
          // Usuario existe, cargar datos persistidos
          console.log('✅ Usuario encontrado en storage:', existingUser);
          set({ user: existingUser, isAuthenticated: true });
        } else {
          // Usuario nuevo, crear con datos básicos
          console.log('🆕 Usuario nuevo, creando perfil básico');
          const newUser: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
          };
          saveUserToStorage(newUser);
          set({ user: newUser, isAuthenticated: true });
          console.log('💾 Usuario guardado:', newUser);
        }
      },
      register: async (email: string, _password: string, name: string) => {
        // Verificar si el usuario ya existe
        const existingUser = getUserFromStorage(email);
        
        if (existingUser) {
          // Usuario existe, actualizar nombre si es diferente
          const updatedUser = { ...existingUser, name };
          saveUserToStorage(updatedUser);
          set({ user: updatedUser, isAuthenticated: true });
        } else {
          // Usuario nuevo
          const newUser: User = {
            id: Date.now().toString(),
            email,
            name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
          };
          saveUserToStorage(newUser);
          set({ user: newUser, isAuthenticated: true });
        }
      },
      loginWithGoogle: async () => {
        try {
          console.log('🔑 Iniciando autenticación con Google...');
          
          // Usar el servicio de Firebase para autenticación
          const firebaseUser = await authService.signInWithGoogle();
          
          console.log('✅ Usuario autenticado con Google:', {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          });
          
          // Verificar si el usuario ya existe en nuestro storage local
          const existingUser = getUserFromStorage(firebaseUser.email!);
          
          if (existingUser) {
            // Usuario existe, actualizar con datos de Google si es necesario
            console.log('👤 Usuario Google encontrado en storage, actualizando datos...');
            const updatedUser: User = {
              ...existingUser,
              name: firebaseUser.displayName || existingUser.name,
              avatar: firebaseUser.photoURL || existingUser.avatar
            };
            saveUserToStorage(updatedUser);
            set({ user: updatedUser, isAuthenticated: true });
          } else {
            // Usuario nuevo de Google
            console.log('🆕 Nuevo usuario de Google, creando perfil...');
            const { firstName, lastName } = parseFullName(firebaseUser.displayName || 'Usuario Google');
            
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName || 'Usuario Google',
              firstName,
              lastName,
              avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
              provider: 'google'
            };
            
            saveUserToStorage(newUser);
            set({ user: newUser, isAuthenticated: true });
            console.log('💾 Usuario Google guardado:', newUser);
          }
        } catch (error) {
          console.error('❌ Error en autenticación con Google:', error);
          throw error;
        }
      },
      updateUser: (userData: Partial<User>) => {
        console.log('📝 Actualizando datos del usuario:', userData);
        
        set((state) => {
          if (state.user) {
            const updatedUser = { ...state.user, ...userData };
            // Guardar cambios en storage
            saveUserToStorage(updatedUser);
            console.log('💾 Usuario actualizado y guardado:', updatedUser);
            return { user: updatedUser };
          }
          console.log('⚠️ No hay usuario activo para actualizar');
          return {};
        });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      listAllUsers: () => {
        return listAllUsers();
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
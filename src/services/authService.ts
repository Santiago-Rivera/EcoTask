import { signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export interface AuthService {
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
  getCurrentUser: () => User | null;
}

class FirebaseAuthService implements AuthService {
  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: unknown) {
      console.error('Error al iniciar sesión con Google:', error);
      
      // Manejo de errores específicos
      const authError = error as { code?: string; message?: string };
      if (authError.code === 'auth/popup-closed-by-user') {
        throw new Error('La ventana de autenticación fue cerrada');
      } else if (authError.code === 'auth/popup-blocked') {
        throw new Error('El popup fue bloqueado por el navegador');
      } else if (authError.code === 'auth/cancelled-popup-request') {
        throw new Error('Solicitud de popup cancelada');
      } else {
        throw new Error('Error al conectar con Google. Inténtalo de nuevo.');
      }
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}

export const authService = new FirebaseAuthService();

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: "AIzaSyA3it-6AzPPBrnjkd2qp5sVilu7KdnMWRM",
  authDomain: "ecotask-app.firebaseapp.com",
  projectId: "ecotask-app",
  storageBucket: "ecotask-app.firebasestorage.app",
  messagingSenderId: "596377411714",
  appId: "1:596377411714:web:ae526d974cb338af62949b",
  measurementId: "G-YPNK17X5CF"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
export const auth = getAuth(app);

// Configurar el proveedor de Google
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

export default app;

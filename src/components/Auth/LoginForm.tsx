import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Leaf, Shield, Key } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { twoFactorService } from '../../services/twoFactorService';
import { useTranslation } from '../../hooks/useTranslation';
import Notification from '../Notification';

// Implementación personalizada de TOTP que funciona en el navegador
class BrowserTOTP {
  private static base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  
  // Decodificar de base32
  static base32Decode(encoded: string): Uint8Array {
    const cleanInput = encoded.toUpperCase().replace(/[^A-Z2-7]/g, '');
    const result = [];
    let bits = 0;
    let value = 0;
    
    for (let i = 0; i < cleanInput.length; i++) {
      const char = cleanInput[i];
      const charValue = this.base32Chars.indexOf(char);
      
      if (charValue === -1) continue;
      
      value = (value << 5) | charValue;
      bits += 5;
      
      if (bits >= 8) {
        result.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }
    
    return new Uint8Array(result);
  }
  
  // Generar código TOTP
  static async generateTOTP(secret: string, window = 0): Promise<string> {
    const key = this.base32Decode(secret);
    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / 30) + window;
    
    const counterBuffer = new ArrayBuffer(8);
    const counterView = new DataView(counterBuffer);
    counterView.setUint32(4, counter, false);
    
    // Crear un ArrayBuffer a partir del Uint8Array
    const keyBuffer = new ArrayBuffer(key.length);
    new Uint8Array(keyBuffer).set(key);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      counterBuffer
    );
    
    const hash = new Uint8Array(signature);
    const offset = hash[hash.length - 1] & 0x0f;
    const binary = (
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff)
    );
    
    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
  }
  
  // Verificar código TOTP
  static async verify(token: string, secret: string): Promise<boolean> {
    const windowSize = 1; // Permitir ±1 ventana de tiempo (30 segundos)
    
    for (let i = -windowSize; i <= windowSize; i++) {
      const expectedToken = await this.generateTOTP(secret, i);
      if (expectedToken === token) {
        return true;
      }
    }
    
    return false;
  }
}

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Estados para 2FA
  const [showTwoFAStep, setShowTwoFAStep] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [pendingLoginEmail, setPendingLoginEmail] = useState('');
  
  const { login, loginWithGoogle } = useAuthStore();
  const { t } = useTranslation();

  // Verificar si el usuario tiene 2FA habilitado
  const checkTwoFAEnabled = (email: string): boolean => {
    // Primero migrar configuración antigua si existe
    twoFactorService.migrateOldConfig(email);
    // Verificar si tiene 2FA habilitado
    return twoFactorService.isTwoFAEnabled(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Verificar si el usuario tiene 2FA habilitado
      if (checkTwoFAEnabled(email)) {
        // Si tiene 2FA, mostrar el paso de verificación
        setPendingLoginEmail(email);
        setShowTwoFAStep(true);
        setNotification({ 
          type: 'success', 
          message: t('auth.enterTwoFactorCode')
        });
      } else {
        // Login normal sin 2FA
        await login(email);
        setNotification({ type: 'success', message: t('auth.welcomeLoginSuccess') });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setNotification({ type: 'error', message: t('auth.loginError') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFAVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!twoFACode || twoFACode.length !== 6) {
      setNotification({ type: 'error', message: t('auth.invalidCodeLength') });
      return;
    }

    setIsVerifying2FA(true);
    
    try {
      const userConfig = twoFactorService.getTwoFAConfig(pendingLoginEmail);
      if (!userConfig || !userConfig.enabled) {
        throw new Error('No se encontró la configuración de 2FA para este usuario');
      }

      // Verificar el código TOTP
      const isValid = await BrowserTOTP.verify(twoFACode, userConfig.secret);
      
      if (isValid) {
        // Código válido, completar el login
        await login(pendingLoginEmail);
        setNotification({ type: 'success', message: t('auth.twoFactorSuccess') });
        setShowTwoFAStep(false);
        setTwoFACode('');
        setPendingLoginEmail('');
      } else {
        // Verificar códigos de respaldo
        const backupCodeUsed = twoFactorService.useBackupCode(pendingLoginEmail, twoFACode);
        
        if (backupCodeUsed) {
          const remainingCodes = twoFactorService.getBackupCodesCount(pendingLoginEmail);
          
          await login(pendingLoginEmail);
          setNotification({ 
            type: 'success', 
            message: t('auth.backupCodeSuccess').replace('{{remaining}}', remainingCodes.toString())
          });
          setShowTwoFAStep(false);
          setTwoFACode('');
          setPendingLoginEmail('');
        } else {
          setNotification({ type: 'error', message: t('auth.incorrectCode') });
        }
      }
    } catch (error) {
      console.error('Error en verificación 2FA:', error);
      setNotification({ type: 'error', message: t('auth.verificationError') });
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const handleBackToLogin = () => {
    setShowTwoFAStep(false);
    setTwoFACode('');
    setPendingLoginEmail('');
    setNotification(null);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      setNotification({ type: 'success', message: t('auth.googleLoginSuccess') });
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al conectar con Google. Inténtalo de nuevo.';
      setNotification({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-accent-50 dark:from-primary-950 dark:via-primary-900 dark:to-primary-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-medium">
            {showTwoFAStep ? <Shield className="w-8 h-8 text-white" /> : <Leaf className="w-8 h-8 text-white" />}
          </div>
          <h2 className="text-3xl font-bold text-primary-900 dark:text-white">
            {showTwoFAStep ? t('auth.twoFactorTitle') : t('auth.loginTitle')}
          </h2>
          <p className="mt-3 text-primary-600 dark:text-primary-400">
            {showTwoFAStep 
              ? t('auth.twoFactorSubtitle')
              : t('auth.loginSubtitle')
            }
          </p>
        </div>

        <div className="bg-white/90 dark:bg-primary-900/90 backdrop-blur-md rounded-2xl border border-primary-200/50 dark:border-primary-800/50 p-8 shadow-strong">
          {showTwoFAStep ? (
            // Formulario de verificación 2FA
            <form onSubmit={handleTwoFAVerification} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-3">
                  {t('auth.authCode')}
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-primary-500" size={20} />
                  <input
                    type="text"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-12 pr-4 py-4 border border-primary-300 dark:border-primary-700 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all bg-white dark:bg-primary-800 text-primary-900 dark:text-white placeholder-primary-500 dark:placeholder-primary-400 shadow-soft text-center text-xl font-mono tracking-widest"
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-primary-500 dark:text-primary-400">
                  {t('auth.backupCodeHint')}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isVerifying2FA || twoFACode.length !== 6}
                  className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white py-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all disabled:opacity-50 shadow-medium hover:shadow-strong transform hover:-translate-y-0.5"
                >
                  {isVerifying2FA ? t('auth.verifying') : t('auth.verifyCode')}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                >
                  {t('auth.backToLogin')}
                </button>
              </div>
            </form>
          ) : (
            // Formulario de login normal
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-3">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-primary-500" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-primary-300 dark:border-primary-700 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all bg-white dark:bg-primary-800 text-primary-900 dark:text-white placeholder-primary-500 dark:placeholder-primary-400 shadow-soft"
                      placeholder={t('auth.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-3">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-primary-500" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-14 py-4 border border-primary-300 dark:border-primary-700 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all bg-white dark:bg-primary-800 text-primary-900 dark:text-white placeholder-primary-500 dark:placeholder-primary-400 shadow-soft"
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white py-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all disabled:opacity-50 shadow-medium hover:shadow-strong transform hover:-translate-y-0.5"
                >
                  {isLoading ? t('auth.loggingIn') : t('auth.login')}
                </button>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary-300 dark:border-primary-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/70 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 font-medium">{t('auth.orContinueWith')}</span>
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
                    {t('auth.continueWithGoogle')}
                  </button>
                </div>
              </div>

              <p className="mt-8 text-center text-sm text-primary-600 dark:text-primary-400">
                {t('auth.noAccount')}{' '}
                <button
                  onClick={onToggleMode}
                  className="font-semibold text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors"
                >
                  {t('auth.registerHere')}
                </button>
              </p>
            </>
          )}
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

export default LoginForm;
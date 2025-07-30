/**
 * Servicio para gestionar la configuración de autenticación de dos factores (2FA)
 * Maneja la configuración por usuario individual
 */

interface TwoFAConfig {
  secret: string;
  backupCodes: string[];
  enabled: boolean;
  enabledDate: string;
}

interface UserTwoFAData {
  [email: string]: TwoFAConfig;
}

class TwoFactorService {
  private storageKey = 'users_2fa_config';

  // Obtener todos los datos de 2FA de usuarios
  private getAllTwoFAData(): UserTwoFAData {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  // Guardar todos los datos de 2FA
  private saveAllTwoFAData(data: UserTwoFAData): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error al guardar configuración 2FA:', error);
    }
  }

  // Verificar si un usuario tiene 2FA habilitado
  isTwoFAEnabled(email: string): boolean {
    const allData = this.getAllTwoFAData();
    const userConfig = allData[email];
    return userConfig ? userConfig.enabled && !!userConfig.secret : false;
  }

  // Obtener la configuración 2FA de un usuario
  getTwoFAConfig(email: string): TwoFAConfig | null {
    const allData = this.getAllTwoFAData();
    return allData[email] || null;
  }

  // Guardar configuración 2FA para un usuario
  saveTwoFAConfig(email: string, secret: string, backupCodes: string[]): void {
    const allData = this.getAllTwoFAData();
    allData[email] = {
      secret,
      backupCodes,
      enabled: true,
      enabledDate: new Date().toISOString()
    };
    this.saveAllTwoFAData(allData);
  }

  // Deshabilitar 2FA para un usuario
  disableTwoFA(email: string): void {
    const allData = this.getAllTwoFAData();
    if (allData[email]) {
      allData[email].enabled = false;
    }
    this.saveAllTwoFAData(allData);
  }

  // Usar un código de respaldo (y eliminarlo de la lista)
  useBackupCode(email: string, code: string): boolean {
    const allData = this.getAllTwoFAData();
    const userConfig = allData[email];
    
    if (!userConfig || !userConfig.enabled) {
      return false;
    }

    const codeIndex = userConfig.backupCodes.indexOf(code.toUpperCase());
    if (codeIndex !== -1) {
      // Remover el código usado
      userConfig.backupCodes.splice(codeIndex, 1);
      this.saveAllTwoFAData(allData);
      return true;
    }

    return false;
  }

  // Obtener códigos de respaldo restantes
  getBackupCodesCount(email: string): number {
    const config = this.getTwoFAConfig(email);
    return config ? config.backupCodes.length : 0;
  }

  // Regenerar códigos de respaldo
  regenerateBackupCodes(email: string): string[] {
    const allData = this.getAllTwoFAData();
    const userConfig = allData[email];
    
    if (!userConfig || !userConfig.enabled) {
      return [];
    }

    // Generar nuevos códigos de respaldo
    const newBackupCodes = [];
    for (let i = 0; i < 8; i++) {
      newBackupCodes.push(Math.random().toString(36).substring(2, 8).toUpperCase());
    }

    userConfig.backupCodes = newBackupCodes;
    this.saveAllTwoFAData(allData);
    
    return newBackupCodes;
  }

  // Migrar datos antiguos (para compatibilidad con la implementación anterior)
  migrateOldConfig(email: string): void {
    // Verificar si hay configuración antigua global
    const oldSecret = localStorage.getItem('2fa_secret');
    const oldBackupCodes = localStorage.getItem('2fa_backup_codes');
    const oldEnabled = localStorage.getItem('2fa_enabled');

    if (oldSecret && oldEnabled === 'true' && !this.isTwoFAEnabled(email)) {
      const backupCodes = oldBackupCodes ? JSON.parse(oldBackupCodes) : [];
      this.saveTwoFAConfig(email, oldSecret, backupCodes);
      
      // Limpiar datos antiguos
      localStorage.removeItem('2fa_secret');
      localStorage.removeItem('2fa_backup_codes');
      localStorage.removeItem('2fa_enabled');
      
      console.log('🔄 Configuración 2FA migrada para el usuario:', email);
    }
  }

  // Limpiar configuración de un usuario
  clearUserConfig(email: string): void {
    const allData = this.getAllTwoFAData();
    if (allData[email]) {
      delete allData[email];
      this.saveAllTwoFAData(allData);
    }
  }

  // Debug: listar todos los usuarios con 2FA
  listAllTwoFAUsers(): string[] {
    const allData = this.getAllTwoFAData();
    return Object.keys(allData).filter(email => allData[email].enabled);
  }
}

// Exportar instancia singleton
export const twoFactorService = new TwoFactorService();
export default twoFactorService;

/**
 * Hook de React para usar el servicio de internacionalización
 */

import { useState, useEffect } from 'react';
import { i18nService, Language, Translations } from '../services/i18nService';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(i18nService.getCurrentLanguage());
  const [translations, setTranslations] = useState<Translations>(i18nService.getTranslations());

  useEffect(() => {
    // Suscribirse a cambios de idioma
    const unsubscribe = i18nService.subscribe((newLanguage) => {
      setLanguage(newLanguage);
      setTranslations(i18nService.getTranslations());
    });

    return unsubscribe;
  }, []);

  // Función para traducir
  const t = (key: string): string => {
    return i18nService.t(key);
  };

  // Función para cambiar idioma
  const changeLanguage = (newLanguage: Language): void => {
    i18nService.setLanguage(newLanguage);
  };

  // Funciones de formateo de fecha
  const formatDate = (date: Date): string => {
    return i18nService.formatDate(date);
  };

  const formatDateTime = (date: Date): string => {
    return i18nService.formatDateTime(date);
  };

  return {
    language,
    translations,
    t,
    changeLanguage,
    formatDate,
    formatDateTime,
    availableLanguages: i18nService.getAvailableLanguages()
  };
};

export default useTranslation;

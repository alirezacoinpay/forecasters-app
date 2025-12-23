import { useMemo } from 'react';
import { getTranslation, getLanguage } from '../lang';

/**
 * Hook to access translations
 * 
 * @example
 * ```tsx
 * const t = useTranslation();
 * <button>{t('ui.buttons.submit')}</button>
 * <p>{t('errors.network')}</p>
 * <p>{t('success.sentToPhone', { phoneNumber: '1234567890' })}</p>
 * ```
 */
export function useTranslation() {
  const currentLang = getLanguage();
  
  return useMemo(() => {
    return (key: string, params?: Record<string, string | number>) => {
      return getTranslation(key, params);
    };
  }, [currentLang]);
}

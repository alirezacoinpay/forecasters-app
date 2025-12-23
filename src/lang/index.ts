import { fa as faCommon } from './fa/common';
import { fa as faErrors } from './fa/errors';
import { fa as faSuccess } from './fa/success';
import { en as enCommon } from './en/common';
import { en as enErrors } from './en/errors';
import { en as enSuccess } from './en/success';

// Get default language from environment variable, fallback to 'fa'
const defaultLanguage = (import.meta.env.VITE_DEFAULT_LANGUAGE || 'fa') as 'fa' | 'en';

// Merge all translation categories for each language
const translations = {
  fa: {
    ...faCommon,
    ...faErrors,
    ...faSuccess,
  },
  en: {
    ...enCommon,
    ...enErrors,
    ...enSuccess,
  },
};

// Current language (can be made dynamic later)
let currentLanguage: 'fa' | 'en' = defaultLanguage;

/**
 * Get translation for a key
 * Supports nested keys with dot notation (e.g., 'errors.network')
 * Supports interpolation with {placeholder} syntax
 */
export function getTranslation(key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];

  // Navigate nested object
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Key not found, try fallback to default language (fa)
      if (currentLanguage !== 'fa') {
        value = translations.fa;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            // Still not found, return key or fallback message
            if (import.meta.env.DEV) {
              console.warn(`Translation key not found: ${key}`);
            }
            return key;
          }
        }
      } else {
        // Not found in default language, return key
        if (import.meta.env.DEV) {
          console.warn(`Translation key not found: ${key}`);
        }
        return key;
      }
    }
  }

  // If value is a string, interpolate placeholders
  if (typeof value === 'string' && params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey] !== undefined ? String(params[paramKey]) : match;
    });
  }

  return typeof value === 'string' ? value : key;
}

/**
 * Set current language
 */
export function setLanguage(lang: 'fa' | 'en'): void {
  if (lang === 'fa' || lang === 'en') {
    currentLanguage = lang;
  }
}

/**
 * Get current language
 */
export function getLanguage(): 'fa' | 'en' {
  return currentLanguage;
}


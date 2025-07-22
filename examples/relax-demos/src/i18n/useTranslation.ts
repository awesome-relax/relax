import { useRelaxValue } from '@relax/react';
import { languageAtom } from './index';
import { allTranslations } from './translations';

// Translation hook
export const useTranslation = () => {
  const language = useRelaxValue(languageAtom);

  const t = (key: string, params?: Record<string, string | number>) => {
    const translationKey = allTranslations[key];
    if (!translationKey) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }

    const translation = translationKey[language] || translationKey.en || key;

    if (params) {
      return Object.entries(params).reduce((result, [param, value]) => {
        return result.replace(new RegExp(`{${param}}`, 'g'), String(value));
      }, translation);
    }

    return translation;
  };

  return t;
};

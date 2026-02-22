import { atom, selector, update } from '@relaxjs/core';
import { useRelaxValue } from '@relaxjs/react';

// Supported languages
export type Language = 'en' | 'zh';

// Language state
export const languageAtom = atom<Language>({
  defaultValue: 'en',
});

// Language selector
export const currentLanguageSelector = selector({
  get: (get) => get(languageAtom),
});

// Language switcher
export const switchLanguage = (lang: Language) => {
  update(languageAtom, lang);
};

// Hook for getting current language
export const useLanguage = () => {
  return useRelaxValue(currentLanguageSelector);
};

// Hook for switching language
export const useLanguageSwitch = () => {
  return switchLanguage;
};

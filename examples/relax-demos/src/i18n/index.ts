import { action, computed, state } from '@relax-state/core';
import { useRelaxValue } from '@relax-state/react';
import type { Store } from '@relax-state/store';

// Supported languages
export type Language = 'en' | 'zh';

// Language state
export const languageAtom = state<Language>('en');

// Language selector
export const currentLanguageSelector = computed<Language>({
  get: (get) => get(languageAtom),
});

// Language switcher
export const switchLanguage = action(
  (store: Store, lang: Language) => {
    store.set(languageAtom, lang);
  },
  { name: 'i18n/switchLanguage' }
);

// Hook for getting current language
export const useLanguage = () => {
  return useRelaxValue(currentLanguageSelector);
};

// Hook for switching language
export const useLanguageSwitch = () => {
  return switchLanguage;
};

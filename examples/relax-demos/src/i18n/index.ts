import { computed, state } from '@relax-state/core';
import { DefultStore } from '@relax-state/store';
import { useRelaxValue } from '@relax-state/react';

// Supported languages
export type Language = 'en' | 'zh';

// Language state
export const languageAtom = state<Language>('en');

// Language selector
export const currentLanguageSelector = computed<Language>({
  get: (get) => get(languageAtom),
});

// Language switcher
export const switchLanguage = (lang: Language) => {
  DefultStore.set(languageAtom, lang);
};

// Hook for getting current language
export const useLanguage = () => {
  return useRelaxValue(currentLanguageSelector);
};

// Hook for switching language
export const useLanguageSwitch = () => {
  return switchLanguage;
};

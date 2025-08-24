import { useLanguage, useLanguageSwitch } from './index';
import { useTranslation } from './useTranslation';
import './language-switcher.scss';

export const LanguageSwitcher = () => {
  const currentLanguage = useLanguage();
  const switchLanguage = useLanguageSwitch();
  const t = useTranslation();

  return (
    <div className="languageSwitcher">
      <span className="languageLabel">{t('languageSwitch')}:</span>
      <div className="languageButtons">
        <button
          type="button"
          className={`languageButton ${currentLanguage === 'en' ? 'active' : ''}`}
          onClick={() => switchLanguage('en')}
        >
          {t('english')}
        </button>
        <button
          type="button"
          className={`languageButton ${currentLanguage === 'zh' ? 'active' : ''}`}
          onClick={() => switchLanguage('zh')}
        >
          {t('chinese')}
        </button>
      </div>
    </div>
  );
};

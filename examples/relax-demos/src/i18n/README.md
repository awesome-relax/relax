# I18n System for Relax Demos

A comprehensive internationalization system built with Relax state management, providing seamless language switching for all demos.

## Features

- **Relax-based State Management**: Uses Relax atoms and selectors for language state
- **Type-safe Translations**: Full TypeScript support with type checking
- **Dynamic Language Switching**: Real-time language changes without page reload
- **Parameter Interpolation**: Support for dynamic content with placeholders
- **Fallback System**: Graceful fallback to English when translations are missing
- **Centralized Management**: All translations in one place for easy maintenance

## Architecture

### Core Components

1. **Language State Management** (`index.ts`)
   - `languageAtom`: Stores current language preference
   - `currentLanguageSelector`: Computed selector for current language
   - `switchLanguage`: Function to change language
   - `useLanguage`: Hook to get current language
   - `useLanguageSwitch`: Hook to get language switcher

2. **Translation Data** (`translations.ts`)
   - Centralized translation keys and values
   - Organized by demo sections
   - Type-safe translation interface
   - Support for parameter interpolation

3. **Translation Hook** (`useTranslation.ts`)
   - `useTranslation`: Main hook for accessing translations
   - Automatic language detection
   - Parameter interpolation support
   - Fallback handling

4. **Language Switcher** (`LanguageSwitcher.tsx`)
   - UI component for language switching
   - Visual feedback for current language
   - Responsive design

## Usage

### Basic Translation

```typescript
import { useTranslation } from './i18n/useTranslation';

export const MyComponent = () => {
  const t = useTranslation();
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
};
```

### Parameter Interpolation

```typescript
// Translation key: "itemDescription": "This is item {id} with {type}"
const description = t('itemDescription', { id: 123, type: 'product' });
// Result: "This is item 123 with product"
```

### Language Switching

```typescript
import { useLanguage, useLanguageSwitch } from './i18n';

export const LanguageControl = () => {
  const currentLanguage = useLanguage();
  const switchLanguage = useLanguageSwitch();
  
  return (
    <div>
      <button onClick={() => switchLanguage('en')}>English</button>
      <button onClick={() => switchLanguage('zh')}>中文</button>
    </div>
  );
};
```

### Adding New Translations

1. **Add translation keys** in `translations.ts`:

```typescript
export const newDemoTranslations: Translations = {
  title: {
    en: 'New Demo',
    zh: '新演示',
  },
  description: {
    en: 'This is a new demo with i18n support',
    zh: '这是一个支持国际化的新演示',
  },
};
```

2. **Merge with allTranslations**:

```typescript
export const allTranslations = {
  ...commonTranslations,
  ...todoListTranslations,
  ...infiniteScrollTranslations,
  ...modalTranslations,
  ...newDemoTranslations, // Add new translations
};
```

3. **Use in component**:

```typescript
const t = useTranslation();
return <h1>{t('title')}</h1>;
```

## Supported Languages

- **English (en)**: Default language
- **Chinese (zh)**: Simplified Chinese

## File Structure

```
i18n/
├── index.ts              # Core language state management
├── translations.ts       # All translation data
├── useTranslation.ts     # Translation hook
├── LanguageSwitcher.tsx  # Language switcher component
├── language-switcher.scss # Language switcher styles
└── README.md            # This documentation
```

## Integration with Demos

All demos have been updated to use the i18n system:

- **Todo List**: All UI text is now translatable
- **Infinite Scroll**: Dynamic content with parameter interpolation
- **Modal Demo**: Modal content and features list are translatable
- **App Header**: Title and language switcher integration

## Benefits

1. **Consistent User Experience**: All demos share the same language preference
2. **Easy Maintenance**: Centralized translation management
3. **Type Safety**: Full TypeScript support prevents translation errors
4. **Performance**: Efficient state management with Relax
5. **Extensibility**: Easy to add new languages and demos

## Future Enhancements

- Support for more languages (Japanese, Korean, etc.)
- Localization for date/time formats
- Number formatting based on locale
- RTL language support
- Translation memory and caching 
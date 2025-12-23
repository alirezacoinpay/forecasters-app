# Change: Add Multi-Language Support

## Why
The application needs to support multiple languages (Farsi and English) to reach a broader audience. Currently, all text is hardcoded in Farsi, making it difficult to maintain and extend to other languages. A centralized translation system will make it easy to switch languages and add new languages in the future.

## What Changes
- **ADDED**: Language directory structure (`src/lang/fa/` and `src/lang/en/`)
- **ADDED**: Translation files for all static text (toast messages, UI labels, buttons, etc.)
- **ADDED**: Translation hook/utility (`useTranslation` or similar) to access translations
- **ADDED**: Environment variable `VITE_DEFAULT_LANGUAGE` to configure default language
- **ADDED**: Language context/provider to manage current language state
- **MODIFIED**: All components to use translation keys instead of hardcoded text
- **MODIFIED**: Header component to be LTR with reversed content layout
- **MODIFIED**: Toast notifications to use translations
- **MODIFIED**: Error messages to use translations
- **MODIFIED**: All user-facing text to use translation system

## Impact
- **Affected specs**: 
  - New capability: `internationalization` or `multi-language-support`
- **Affected code**:
  - `src/lang/` - New directory with translation files
  - `src/hooks/useTranslation.ts` - New translation hook
  - `src/contexts/LanguageContext.tsx` - New language context (if needed)
  - `src/components/Header.tsx` - Update to LTR layout with reversed content
  - All components with static text - Replace hardcoded strings with translation keys
  - `src/vite-env.d.ts` - Add `VITE_DEFAULT_LANGUAGE` type
  - `src/App.tsx` - Initialize language context/provider

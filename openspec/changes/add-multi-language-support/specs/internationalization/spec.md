# Internationalization Specification

## ADDED Requirements

### Requirement: Language File Structure
The system SHALL organize translations in a structured directory with language folders.

#### Scenario: Language directory structure
- **WHEN** the application is initialized
- **THEN** translation files are organized in `src/lang/fa/` and `src/lang/en/` directories
- **AND** each language folder contains translation files (e.g., `common.ts`, `errors.ts`, `success.ts`)
- **AND** translation files export objects with key-value pairs

### Requirement: Translation Hook
The system SHALL provide a `useTranslation` hook to access translations.

#### Scenario: Access translation by key
- **WHEN** a component calls `useTranslation()` hook
- **THEN** the hook returns a function `t(key: string)` that returns the translated string
- **AND** the function uses the current language (from environment or default)
- **AND** if translation key is missing, it falls back to the key itself or default language

#### Scenario: Nested translation keys
- **WHEN** a component calls `t('errors.network')`
- **THEN** the system looks up the nested key in the translation object
- **AND** returns the translated string for that key

#### Scenario: Translation with interpolation
- **WHEN** a component calls `t('errors.validation', { field: 'username' })`
- **THEN** the system replaces placeholders in the translation string
- **AND** returns the interpolated string

### Requirement: Environment Configuration
The system SHALL use environment variable to configure default language.

#### Scenario: Read default language from environment
- **WHEN** the application starts
- **THEN** the system reads `VITE_DEFAULT_LANGUAGE` environment variable
- **AND** defaults to 'fa' if not set
- **AND** uses this language for all translations

#### Scenario: Invalid language in environment
- **WHEN** `VITE_DEFAULT_LANGUAGE` is set to an unsupported language
- **THEN** the system falls back to 'fa' (Farsi)
- **AND** logs a warning in development mode

### Requirement: Component Translation Usage
The system SHALL replace all hardcoded text with translation keys.

#### Scenario: Replace hardcoded text in components
- **WHEN** a component displays text to the user
- **THEN** the text is retrieved using the translation hook
- **AND** no hardcoded strings remain in component code
- **AND** all user-facing text uses translation keys

#### Scenario: Toast notifications use translations
- **WHEN** a toast notification is displayed
- **THEN** the message text is retrieved from translation files
- **AND** error messages use `errors.*` keys
- **AND** success messages use `success.*` keys

### Requirement: Header LTR Layout
The system SHALL display the header in LTR direction with reversed content order.

#### Scenario: Header LTR layout
- **WHEN** the header is displayed
- **THEN** the header container has `dir="ltr"`
- **AND** the search button is positioned on the right side
- **AND** the topic dropdown is positioned on the left side
- **AND** the content order is reversed from the original RTL layout

#### Scenario: Header dropdown in LTR
- **WHEN** the topic dropdown is opened
- **THEN** the dropdown menu is positioned correctly for LTR layout
- **AND** the menu items are aligned for LTR reading direction

### Requirement: Translation File Organization
The system SHALL organize translations by category.

#### Scenario: Common translations
- **WHEN** translations are organized
- **THEN** common UI text (buttons, labels, placeholders) is in `common.ts`
- **AND** error messages are in `errors.ts`
- **AND** success messages are in `success.ts`

#### Scenario: Translation key structure
- **WHEN** translations are accessed
- **THEN** keys follow a hierarchical structure (e.g., `errors.network`, `ui.buttons.submit`)
- **AND** keys are descriptive and easy to understand

### Requirement: Missing Translation Handling
The system SHALL handle missing translations gracefully.

#### Scenario: Missing translation key
- **WHEN** a translation key does not exist
- **THEN** the system falls back to the key itself
- **OR** falls back to the default language (fa)
- **AND** logs a warning in development mode

#### Scenario: Missing language file
- **WHEN** a language file is missing
- **THEN** the system falls back to the default language (fa)
- **AND** the application continues to function

### Requirement: Language File Format
The system SHALL use TypeScript/JavaScript objects for translation files.

#### Scenario: Translation file format
- **WHEN** a translation file is created
- **THEN** it exports an object with translation keys and values
- **AND** keys are strings
- **AND** values are strings (with optional placeholders for interpolation)

#### Scenario: Nested translation structure
- **WHEN** translations are organized
- **THEN** nested objects are used for categorization (e.g., `errors: { network: '...', validation: '...' }`)
- **AND** the hook supports dot notation to access nested keys

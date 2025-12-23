# Design: Multi-Language Support

## Context
The application currently has all text hardcoded in Farsi. We need to support multiple languages (starting with Farsi and English) and make it easy to add more languages in the future. The header also needs to be LTR with reversed content layout.

## Goals
- Support Farsi (fa) and English (en) languages
- Extract all static text to translation files
- Use translation keys throughout the application
- Make default language configurable via environment variable
- Change header to LTR layout with reversed content
- Easy to add new languages in the future

## Non-Goals
- Language switching UI (can be added later)
- RTL/LTR automatic switching based on language (header is always LTR)
- Translation management system/UI
- Dynamic language detection from browser

## Decisions

### Decision: Translation File Structure
**What**: Organize translations by category (common, errors, success) rather than by component.

**Why**: 
- Easier to maintain and find translations
- Avoids duplication (same error message used in multiple places)
- Better organization for translators
- Simpler key structure

**Alternatives considered**:
- One file per component - Too many files, harder to maintain
- Single large file - Hard to navigate and maintain

### Decision: Simple Hook Approach
**What**: Use a simple `useTranslation` hook instead of a full context provider.

**Why**:
- Simpler implementation
- No need for context provider wrapping
- Direct access to translations
- Less overhead

**Alternatives considered**:
- React Context Provider - More complex, not needed for simple use case
- Third-party library (react-i18next) - Adds dependency, overkill for simple needs

### Decision: Translation Key Format
**What**: Use dot notation for nested keys (e.g., `errors.network`, `ui.buttons.submit`).

**Why**:
- Clear hierarchy
- Easy to organize
- Simple to access
- Common pattern

**Alternatives considered**:
- Flat keys - Harder to organize
- Slash notation - Less common in JS/TS

### Decision: Header LTR Layout
**What**: Make header container LTR and reverse the content order (search on right, topic on left).

**Why**:
- User requested specific layout
- LTR is standard for many interfaces
- Reversed content maintains visual balance

**Alternatives considered**:
- Keep RTL - Doesn't match requirement
- Full LTR without reversal - Doesn't match requirement

### Decision: Environment Variable for Default Language
**What**: Use `VITE_DEFAULT_LANGUAGE` environment variable (defaults to 'fa').

**Why**:
- Easy to configure
- No code changes needed to switch default
- Works with build system
- Can be set per environment

**Alternatives considered**:
- Hardcoded default - Less flexible
- Browser detection - Not requested, adds complexity

## Implementation Approach

### Translation File Structure
```
src/lang/
├── fa/
│   ├── common.ts      # Common UI text, buttons, labels
│   ├── errors.ts      # Error messages
│   └── success.ts    # Success messages
└── en/
    ├── common.ts
    ├── errors.ts
    └── success.ts
```

### Translation Hook API
```typescript
const t = useTranslation();
t('errors.network'); // Returns translated string
t('ui.buttons.submit'); // Returns translated string
t('errors.validation', { field: 'username' }); // With interpolation
```

### Header Layout Change
- Container: `dir="ltr"`
- Content order: Search button on right, Topic dropdown on left
- Flex direction: `flex-row-reverse` or manual reordering
- Dropdown: Positioned for LTR layout

## Risks / Trade-offs

### Risk: Missing Translations
**Mitigation**: 
- Fallback to key or default language
- Type checking for translation keys (optional)
- Clear error messages in dev mode

### Risk: Performance
**Mitigation**:
- Translations loaded once at startup
- No runtime overhead for simple hook
- Cache translations in memory

### Risk: Maintenance
**Mitigation**:
- Clear file structure
- Consistent naming conventions
- Documentation for adding new translations

## Open Questions
- Should we support language switching at runtime? (Decision: Not in scope, can add later)
- Should we persist language preference? (Decision: Optional, can use localStorage)
- Should we type-check translation keys? (Decision: Optional enhancement)

## 1. Language Infrastructure
- [ ] 1.1 Create `src/lang/` directory structure
- [ ] 1.2 Create `src/lang/fa/` folder for Farsi translations
- [ ] 1.3 Create `src/lang/en/` folder for English translations
- [ ] 1.4 Create translation file structure (e.g., `common.ts`, `errors.ts`, `ui.ts`, etc.)
- [ ] 1.5 Add `VITE_DEFAULT_LANGUAGE` to `src/vite-env.d.ts` (default: 'fa')
- [ ] 1.6 Create `useTranslation` hook in `src/hooks/useTranslation.ts`
- [ ] 1.7 Create language context/provider if needed (or use simple hook approach)

## 2. Extract Static Text - Common/UI
- [ ] 2.1 Extract common UI text (buttons, labels, placeholders)
- [ ] 2.2 Extract navigation text (feed, profile, search, etc.)
- [ ] 2.3 Extract form labels and placeholders
- [ ] 2.4 Extract empty state messages
- [ ] 2.5 Extract loading messages
- [ ] 2.6 Create `src/lang/fa/common.ts` with all common translations
- [ ] 2.7 Create `src/lang/en/common.ts` with English translations

## 3. Extract Static Text - Errors
- [ ] 3.1 Extract all error messages from toast notifications
- [ ] 3.2 Extract validation error messages
- [ ] 3.3 Extract API error messages
- [ ] 3.4 Extract network error messages
- [ ] 3.5 Create `src/lang/fa/errors.ts` with all error translations
- [ ] 3.6 Create `src/lang/en/errors.ts` with English error translations

## 4. Extract Static Text - Success Messages
- [ ] 4.1 Extract success toast messages
- [ ] 4.2 Extract confirmation messages
- [ ] 4.3 Create `src/lang/fa/success.ts` with success translations
- [ ] 4.4 Create `src/lang/en/success.ts` with English success translations

## 5. Extract Static Text - Components
- [ ] 5.1 Extract text from `Header.tsx` (search label, etc.)
- [ ] 5.2 Extract text from `BottomNav.tsx` (if any)
- [ ] 5.3 Extract text from `SearchPage.tsx` (placeholders, empty states, "Trending Today", etc.)
- [ ] 5.4 Extract text from `PredictionDetail.tsx` (buttons, labels, descriptions)
- [ ] 5.5 Extract text from `PredictionCard.tsx` (if any)
- [ ] 5.6 Extract text from `CreatePredictionPage.tsx` (form labels, buttons, validation)
- [ ] 5.7 Extract text from `CommentSection.tsx` (placeholders, buttons)
- [ ] 5.8 Extract text from `ProfileView.tsx` (labels, descriptions)
- [ ] 5.9 Extract text from `EditProfileModal.tsx` (form labels, buttons)
- [ ] 5.10 Extract text from `FeedView.tsx` (empty states)
- [ ] 5.11 Extract text from `ShareBottomSheet.tsx` (if any)
- [ ] 5.12 Extract text from `ConfirmDialog.tsx` (default confirm/cancel text)

## 6. Update Components to Use Translations
- [ ] 6.1 Update `App.tsx` to initialize language system
- [ ] 6.2 Update `Header.tsx` to use translations and make LTR with reversed content
- [ ] 6.3 Update `BottomNav.tsx` to use translations (if needed)
- [ ] 6.4 Update `SearchPage.tsx` to use translations
- [ ] 6.5 Update `PredictionDetail.tsx` to use translations
- [ ] 6.6 Update `PredictionCard.tsx` to use translations (if needed)
- [ ] 6.7 Update `CreatePredictionPage.tsx` to use translations
- [ ] 6.8 Update `CommentSection.tsx` to use translations
- [ ] 6.9 Update `ProfileView.tsx` to use translations
- [ ] 6.10 Update `EditProfileModal.tsx` to use translations
- [ ] 6.11 Update `FeedView.tsx` to use translations
- [ ] 6.12 Update `ShareBottomSheet.tsx` to use translations (if needed)
- [ ] 6.13 Update `ConfirmDialog.tsx` to use translations
- [ ] 6.14 Update all service files to use translations for error messages
- [ ] 6.15 Update all hooks to use translations for messages

## 7. Header LTR Layout
- [ ] 7.1 Change Header container to `dir="ltr"`
- [ ] 7.2 Reverse the flex order of header content (search on right, topic on left)
- [ ] 7.3 Update dropdown menu positioning for LTR
- [ ] 7.4 Ensure proper spacing and alignment in LTR mode
- [ ] 7.5 Test header layout in both languages

## 8. Language Configuration
- [ ] 8.1 Read `VITE_DEFAULT_LANGUAGE` from environment (default to 'fa')
- [ ] 8.2 Set up language state management
- [ ] 8.3 Allow language switching (optional for future)
- [ ] 8.4 Persist language preference (optional, can use localStorage)

## 9. Translation Hook Implementation
- [ ] 9.1 Create `useTranslation` hook that accepts translation key
- [ ] 9.2 Support nested keys (e.g., `t('errors.network')`)
- [ ] 9.3 Support interpolation for dynamic values (e.g., `t('errors.validation', { field: 'username' })`)
- [ ] 9.4 Handle missing translations gracefully (fallback to key or default language)
- [ ] 9.5 Type-safe translation keys (optional, can use TypeScript)

## 10. Testing & Validation
- [ ] 10.1 Test all components with Farsi language
- [ ] 10.2 Test all components with English language
- [ ] 10.3 Verify all static text is translated
- [ ] 10.4 Test header LTR layout
- [ ] 10.5 Test language switching (if implemented)
- [ ] 10.6 Verify environment variable configuration
- [ ] 10.7 Test missing translation fallbacks
- [ ] 10.8 Verify no hardcoded text remains

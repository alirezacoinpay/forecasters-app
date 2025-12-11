# Change: Add Search Page

## Why
Users need a dedicated search page for discovering predictions. The current modal-based search is limited and doesn't provide a full-featured search experience. A dedicated page allows for:
- Better navigation with back button
- Display of recent searches and trending content
- Tag-based filtering
- Full-page search results with infinite scroll
- Better mobile UX inspired by modern search interfaces (e.g., Reddit)

## What Changes
- **ADDED**: New `SearchPage` component (full page, replaces SearchModal)
- **ADDED**: Recent searches display (fetched from backend)
- **ADDED**: Tag selection at top of search page (when navigated from tag click)
- **ADDED**: Trending predictions section (shown when no search query)
- **ADDED**: Search history API integration
- **MODIFIED**: Header search button now navigates to search page instead of opening modal
- **MODIFIED**: Tag clicks navigate to search page with tag filter
- **REMOVED**: SearchModal component (replaced by SearchPage)

## Impact
- **Affected specs**: 
  - New capability: `search-page`
  - Modified capability: `navigation` (if exists) or `user-interactions`
- **Affected code**:
  - `src/components/Header.tsx` - Update search button handler
  - `src/components/SearchModal.tsx` - Remove (replaced)
  - `src/components/SearchPage.tsx` - New component
  - `src/App.tsx` - Add search page routing
  - `src/services/searchService.service.ts` - New service for search history
  - `src/types/api.ts` - Add search history types

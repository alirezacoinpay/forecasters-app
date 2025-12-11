# Design: Search Page Implementation

## Context
The application currently uses a modal for search functionality. Users need a full-page search experience with:
- Recent search history
- Tag-based filtering
- Trending predictions when no search is active
- Seamless navigation back to feed

## Goals
1. Replace modal search with full-page search experience
2. Display recent searches from backend
3. Support tag-based navigation to search page
4. Show trending predictions when page initializes without query
5. Maintain existing search functionality (debounced search, infinite scroll)

## Non-Goals
- Search suggestions/autocomplete (future enhancement)
- Search filters beyond tags (future enhancement)
- Search analytics (future enhancement)

## Decisions

### 1. Page Navigation Pattern
**Decision**: Use conditional rendering in App.tsx (similar to CreatePredictionPage) instead of routing library.

**Rationale**: 
- Keeps implementation simple
- Consistent with existing CreatePredictionPage pattern
- No additional routing dependency needed

**Alternatives considered**:
- React Router: Adds complexity for single-page navigation
- State-based routing: More complex state management

### 2. Recent Searches Storage
**Decision**: Fetch recent searches from backend API endpoint.

**Rationale**:
- Centralized storage
- Sync across devices
- Backend can manage search history logic

**API Endpoint**: `GET /search-history` (to be implemented by backend)

**Response Structure**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "query": "search term",
      "created_at": "2024-01-01T00:00:00Z",
      "type": "search" // or "tag"
    }
  ]
}
```

### 3. Tag Navigation
**Decision**: When user clicks a tag, navigate to search page with tag pre-selected.

**Rationale**:
- Consistent user experience
- Tag acts as search filter
- Clear visual indication of active filter

**Implementation**:
- Pass `selectedTag` prop to SearchPage
- Display tag badge at top of page
- Use tag title as search query

### 4. Trending Predictions
**Decision**: Show trending predictions when no search query is active.

**Rationale**:
- Provides content when page loads
- Similar to Reddit's "Trending Today" pattern
- Uses existing prediction feed with trending filter

**Implementation**:
- Use existing `usePredictionFeed` hook with `trending: true` parameter
- Display "Trending Today" section header
- Show prediction cards in same format as feed

### 5. Search History Display
**Decision**: Show recent searches as list items with dismiss (X) button.

**Rationale**:
- Clean, familiar UI pattern
- Easy to dismiss unwanted history items
- Matches Reddit search interface inspiration

**Visual Design**:
- Clock icon for recent searches
- Tag badge icon for tag-based searches
- X button on right to dismiss
- Clicking item performs search

## Risks / Trade-offs

### Risk: Backend API Not Available
**Mitigation**: 
- Create mock service for development
- Document required API structure
- Gracefully handle missing endpoint

### Risk: Performance with Large Search History
**Mitigation**:
- Limit to last 10-20 searches
- Lazy load if needed
- Backend should paginate

### Trade-off: Modal vs Full Page
**Trade-off**: Full page provides better UX but requires navigation state management.

**Decision**: Full page is better for mobile and provides more space for features.

## Migration Plan

1. **Phase 1**: Create SearchPage component alongside SearchModal
2. **Phase 2**: Update Header to navigate to SearchPage
3. **Phase 3**: Update tag clicks to navigate to SearchPage
4. **Phase 4**: Remove SearchModal after verification
5. **Phase 5**: Add search history API integration

## Open Questions
- Should search history be cleared on logout?
- Should we limit number of recent searches displayed?
- Should tag-based searches appear in history?

# Change: Add Swipe Animations and Topic-Based Feed

## Why
The current swipe functionality works but lacks visual feedback. Users need:
- Smooth Reddit-like swipe animations when changing topics
- Real topic data from API instead of mock data
- Topic-based filtering of predictions
- Cached topics for better performance
- Visual feedback during swipe transitions

## What Changes
- **Swipe Animations**: Add Reddit-style slide animations to Header and FeedView
- **Topic API Integration**: Fetch topics from API endpoint
- **Topic Caching**: Cache topics in memory/store for performance
- **Topic-Based Feed**: Filter predictions by topic_id when swiping
- **Animated Transitions**: Smooth slide animations in both Header and FeedView

## Impact
- **Affected specs**: `ui-components`, `data-fetching`, `user-experience`
- **Affected code**:
  - `src/hooks/useSwipe.ts` - Enhanced with animation support
  - `src/components/Header.tsx` - Add swipe animations
  - `src/components/predictions/FeedView.tsx` - Add swipe animations
  - `src/services/` - New topic service
  - `src/repositories/` - New topic repository
  - `src/hooks/` - New topic hooks and cache
  - `src/App.tsx` - Update to use real topics
- **Breaking changes**: None - all changes are additive

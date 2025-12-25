# Change: Add Prediction Deep Link Support

## Why
Users need to be able to share predictions via URL links. When someone clicks a shared link, they should see the specific prediction at the top of the feed, with the rest of the predictions below it. This enables better content sharing and discovery. The topic should be automatically determined from the prediction's data after the API response, and the header should update to reflect the correct topic.

## What Changes
- **ADDED**: URL parameter parsing to extract prediction ID from query string (e.g., `?prediction=123`)
- **ADDED**: `predictionId` parameter support in `PredictionListParams` and API calls
- **ADDED**: Logic to ensure shared prediction appears at top of feed list
- **ADDED**: Topic auto-detection from prediction data after API response
- **ADDED**: Header topic update when prediction is loaded from deep link
- **ADDED**: Error handling for invalid/missing prediction IDs
- **ADDED**: Loading states for deep link initialization
- **MODIFIED**: `usePredictionFeed` hook to accept and handle `predictionId` parameter
- **MODIFIED**: `FeedView` to handle deep link state and topic updates
- **MODIFIED**: `App.tsx` to parse URL and pass prediction ID to feed

## Impact
- **Affected specs**: 
  - New capability: `prediction-deep-linking` (or modify existing `navigation` or `data-fetching`)
- **Affected code**:
  - `src/App.tsx` - Add URL parsing and prediction ID state management
  - `src/components/predictions/FeedView.tsx` - Handle deep link state and topic updates
  - `src/hooks/predictions/usePredictionFeed.ts.tsx` - Add predictionId parameter support
  - `src/types/api.ts` - Add predictionId to PredictionListParams
  - `src/components/Header.tsx` - Handle topic updates from deep link
  - `src/repositories/PredictionRepository.ts` - Pass predictionId to API

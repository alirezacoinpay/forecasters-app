# Change: Add Prediction Likes

## Why
Users need the ability to like predictions to express appreciation or interest. This feature enhances user engagement and provides social feedback. The like functionality should be consistent with the existing comment like feature and provide visual feedback through a heart icon.

## What Changes
- **ADDED**: Like button with heart icon in `PredictionCard` component
- **ADDED**: Like button with heart icon in `PredictionDetail` bottom sheet
- **ADDED**: API service method for liking/unliking predictions (`likePrediction`)
- **ADDED**: Like count display in prediction cards and detail view
- **ADDED**: Visual state for liked predictions (filled heart icon)
- **MODIFIED**: `Prediction` model to include `likesCount` and `isLiked` properties
- **MODIFIED**: `PredictionCard` to display like button and count
- **MODIFIED**: `PredictionDetail` to display like button and count

## Impact
- **Affected specs**: 
  - New capability: `prediction-likes` (or modify existing `user-interactions`)
- **Affected code**:
  - `src/models/Prediction.ts` - Add likesCount and isLiked properties
  - `src/components/PredictionCard.tsx` - Add like button
  - `src/components/PredictionDetail.tsx` - Add like button
  - `src/services/predictionService.service.ts` - Add likePrediction method
  - `src/types/api.ts` - Add LikePredictionResponse type
  - `src/services/activityService.service.ts` - Add activity logging for prediction likes

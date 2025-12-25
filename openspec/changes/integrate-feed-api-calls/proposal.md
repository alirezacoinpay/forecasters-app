# Change: Integrate API Calls for Feed Page Actions

## Why
The application currently has mock implementations and TODOs for critical user actions like adding predictions, liking comments, adding comments, and replying to comments. These need to be connected to the backend API to enable full functionality. The feed page is the primary user interface and should be fully functional with real API integration.

## What Changes
- **Feed Page Priority**: Integrate all feed-related API calls (predictions, comments, likes)
- **Add Prediction**: Connect POST `/predictions` endpoint for submitting predictions with optional comment and file
- **Comment Interactions**: Implement API calls for liking comments, adding comments, and replying to comments
- **User Profile**: Integrate GET `/me` and PUT `/edit-profile` endpoints
- **Activity Logging**: Add activity log tracking for user actions
- **Backend Modifications**: Identify missing endpoints (comment like, add comment, reply comment) that need to be added to backend

## Impact
- Affected specs: `data-fetching`, `user-interactions`, `user-profile`
- Affected code: 
  - `src/services/predictionService.service.ts`
  - `src/services/userService.service.ts`
  - `src/components/PredictionDetail.tsx`
  - `src/components/CommentSection.tsx`
  - `src/components/CreatePredictionPage.tsx`
  - New service: `src/services/commentService.service.ts`
  - New service: `src/services/activityService.service.ts`

## Backend Modifications Required
Based on the Postman collection analysis, the following endpoints are missing and need to be implemented in the backend:
1. **POST `/comments`** - Add a new comment to a prediction
2. **POST `/comments/:commentId/reply`** or **POST `/comments`** with `parent_id` - Reply to an existing comment
3. **POST `/comments/:commentId/like`** or **PUT `/comments/:commentId/like`** - Like/unlike a comment

These endpoints are critical for the comment functionality to work properly.

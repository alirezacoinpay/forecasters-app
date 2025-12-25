# Change: Rename Question to Prediction

## Why
The codebase currently uses inconsistent terminology, mixing "question" and "prediction" throughout the code. To maintain consistency and align with the domain model, all references to "question" should be renamed to "prediction" across the entire project. This includes variables, function names, API endpoints, payload fields, directory names, translation keys, and comments.

## What Changes
**BREAKING** - This is a comprehensive refactoring that affects:
- **Variable and property names:**
  - `questionId` → `predictionId`
  - `questionOptions` → `predictionOptions`
  - `question_id` → `prediction_id`
  - `question_option_id` → `prediction_option_id`
  - `questionForwardCount` → `predictionForwardCount`
  - `CreateQuestionData` → `CreatePredictionData` (merge with existing type)
  - `createQuestion()` → `createPrediction()`
  - `showAddQuestion` → `showAddPrediction`
  - `onAddQuestion` → `onAddPrediction`

- **API endpoints:**
  - `/questions` → `/predictions`
  - `/questions/:id` → `/predictions/:id`
  - `/questions/:questionId/comments` → `/predictions/:predictionId/comments`
  - `/question-feed` → `/prediction-feed` (where still referenced)

- **Directory structure:**
  - `src/components/questions/` → `src/components/predictions/`

- **Translation keys:**
  - `questionPublished` → `predictionPublished`
  - `publishQuestionError` → `publishPredictionError`
  - `questionIdNotFound` → `predictionIdNotFound`

- **Comments and documentation:**
  - All references to "question" in code comments, JSDoc, and documentation

- **Model properties:**
  - `Comment.question_id` → `Comment.prediction_id`
  - `PredictionOption.question_id` → `PredictionOption.prediction_id`
  - `Prediction.questionForwardCount` → `Prediction.predictionForwardCount`
  - `Prediction.questionOptions` → `Prediction.predictionOptions` (in API response)

## Impact
- **Affected specs:** N/A (no existing specs found)
- **Affected code:**
  - `src/services/predictionService.service.ts` - API methods and endpoints
  - `src/services/commentService.service.ts` - Comment API methods
  - `src/services/shareService.service.ts` - Share payload
  - `src/services/activityService.service.ts` - Activity metadata
  - `src/types/api.ts` - Type definitions and interfaces
  - `src/models/Prediction.ts` - Model class
  - `src/models/Comment.ts` - Model class
  - `src/components/questions/FeedView.tsx` - Component (directory rename)
  - `src/components/CommentSection.tsx` - Props and logic
  - `src/components/PredictionCard.tsx` - Activity logging
  - `src/components/PredictionDetail.tsx` - API calls
  - `src/components/CreatePredictionPage.tsx` - API calls
  - `src/components/BottomNav.tsx` - Props
  - `src/components/ShareBottomSheet.tsx` - Payload
  - `src/App.tsx` - State and handlers
  - `src/repositories/PredictionRepository.ts` - Comments
  - `src/lang/en/success.ts` - Translation keys
  - `src/lang/fa/success.ts` - Translation keys
  - `src/lang/en/errors.ts` - Translation keys
  - `src/lang/fa/errors.ts` - Translation keys
  - All OpenSpec change documents referencing "question" terminology

- **Backend coordination required:** Backend API endpoints must be updated to match new naming:
  - `/questions` → `/predictions`
  - `/questions/:id` → `/predictions/:id`
  - `/questions/:questionId/comments` → `/predictions/:predictionId/comments`
  - Payload fields: `question_id` → `prediction_id`, `question_option_id` → `prediction_option_id`
  - Response fields: `questionOptions` → `predictionOptions`, `questionForwardCount` → `predictionForwardCount`


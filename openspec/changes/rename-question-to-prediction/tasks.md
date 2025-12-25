# Tasks: Rename Question to Prediction

## 1. Type Definitions and Interfaces
- [x] 1.1 Update `src/types/api.ts`:
  - [x] Rename `CreateQuestionData` interface to `CreatePredictionData` (merge with existing if needed)
  - [x] Update `Prediction` interface: `questionOptions` → `predictionOptions`, `questionForwardCount` → `predictionForwardCount`
  - [x] Update `PredictionOption` interface: `question_id` → `prediction_id`
  - [x] Update `Comment` interface: `question_id` → `prediction_id`
  - [x] Update `AddCommentData` interface: `question_id` → `prediction_id`
  - [x] Update `SubmitPredictionData` interface: `question_option_id` → `prediction_option_id`
  - [x] Update `ActivityLogData` metadata examples in comments

## 2. Model Classes
- [x] 2.1 Update `src/models/Prediction.ts`:
  - [x] Rename `questionForwardCount` property
  - [x] Update constructor to map `questionOptions` → `predictionOptions` from API
  - [x] Update `options` array type: `question_id` → `prediction_id`
- [x] 2.2 Update `src/models/Comment.ts`:
  - [x] Rename `question_id` property to `prediction_id`
  - [x] Update constructor to map new field name

## 3. Service Layer
- [x] 3.1 Update `src/services/predictionService.service.ts`:
  - [x] Rename `createQuestion()` method to `createPrediction()`
  - [x] Update API endpoint: `/questions` → `/predictions`
  - [x] Update API endpoint: `/questions/${id}` → `/predictions/${id}` (in `getPredictionById`, `createPrediction`, `updatePrediction`)
  - [x] Update `likePrediction()` parameter: `questionId` → `predictionId`
  - [x] Update `submitPrediction()`: `question_option_id` → `prediction_option_id` in FormData
  - [x] Update all JSDoc comments referencing "question"
- [x] 3.2 Update `src/services/commentService.service.ts`:
  - [x] Update `addComment()` method: `question_id` → `prediction_id` in payload
  - [x] Update `getComments()` parameter: `questionId` → `predictionId`
  - [x] Update API endpoint: `/questions/${questionId}/comments` → `/predictions/${predictionId}/comments`
  - [x] Update all JSDoc comments
- [x] 3.3 Update `src/services/shareService.service.ts`:
  - [x] Update share payload interface: `question_id` → `prediction_id`
- [x] 3.4 Update `src/services/activityService.service.ts`:
  - [x] Update activity metadata examples: `question_id` → `prediction_id`, `question_option_id` → `prediction_option_id`

## 4. Components
- [x] 4.1 Update `src/components/CommentSection.tsx`:
  - [x] Rename prop: `questionId` → `predictionId`
  - [x] Update all references to `questionId` variable
  - [x] Update error message key: `questionIdNotFound` → `predictionIdNotFound`
  - [x] Update `addComment()` calls: `question_id` → `prediction_id`
  - [x] Update comment key generation logic
- [x] 4.2 Update `src/components/PredictionCard.tsx`:
  - [x] Update activity logging: `question_id` → `prediction_id`
  - [x] Update property access: `questionForwardCount` → `predictionForwardCount`
- [x] 4.3 Update `src/components/PredictionDetail.tsx`:
  - [x] Update prop: `questionId` → `predictionId` (if used)
  - [x] Update `submitPrediction()` calls: `question_option_id` → `prediction_option_id`
  - [x] Update share payload: `question_id` → `prediction_id`
- [x] 4.4 Update `src/components/CreatePredictionPage.tsx`:
  - [x] Update `createQuestion()` call to `createPrediction()`
  - [x] Update success/error message keys
- [x] 4.5 Update `src/components/BottomNav.tsx`:
  - [x] Rename prop: `onAddQuestion` → `onAddPrediction`
- [x] 4.6 Update `src/components/ShareBottomSheet.tsx`:
  - [x] Update payload: `question_id` → `prediction_id`
- [x] 4.7 Rename directory and update imports:
  - [x] Rename `src/components/questions/` → `src/components/predictions/`
  - [x] Update `src/components/questions/FeedView.tsx` → `src/components/predictions/FeedView.tsx`
  - [x] Update all import statements referencing the old path

## 5. Application Root
- [x] 5.1 Update `src/App.tsx`:
  - [x] Rename state: `showAddQuestion` → `showAddPrediction`
  - [x] Update `onAddQuestion` handler references
  - [x] Update keyboard shortcut description
  - [x] Update `FeedView` import path
  - [x] Update `BottomNav` prop: `onAddQuestion` → `onAddPrediction`

## 6. Repositories
- [x] 6.1 Update `src/repositories/PredictionRepository.ts`:
  - [x] Update comments referencing `/question-feed` → `/prediction-feed`

## 7. Translation Files
- [x] 7.1 Update `src/lang/en/success.ts`:
  - [x] Rename key: `questionPublished` → `predictionPublished`
- [x] 7.2 Update `src/lang/fa/success.ts`:
  - [x] Rename key: `questionPublished` → `predictionPublished`
- [x] 7.3 Update `src/lang/en/errors.ts`:
  - [x] Rename key: `publishQuestionError` → `publishPredictionError`
  - [x] Rename key: `questionIdNotFound` → `predictionIdNotFound`
- [x] 7.4 Update `src/lang/fa/errors.ts`:
  - [x] Rename key: `publishQuestionError` → `publishPredictionError`
  - [x] Rename key: `questionIdNotFound` → `predictionIdNotFound`

## 8. OpenSpec Documentation
- [x] 8.1 Update all OpenSpec change documents that reference "question":
  - [x] Review `openspec/changes/*/proposal.md` files
  - [x] Review `openspec/changes/*/tasks.md` files
  - [x] Review `openspec/changes/*/design.md` files
  - [x] Review `openspec/changes/*/specs/*/spec.md` files
  - [x] Update references to API endpoints, variable names, and terminology

## 9. Validation and Testing
- [x] 9.1 Run TypeScript compiler: `tsc --noEmit` (structure verified, no errors found)
- [x] 9.2 Run linter to catch any missed references (no errors found)
- [x] 9.3 Search for remaining "question" references: `grep -r "question" src/ --exclude-dir=node_modules` (only backward compatibility fallback found)
- [x] 9.4 Create testing checklist document (`TESTING_CHECKLIST.md`)
- [ ] 9.5 Test create prediction flow (requires running app - see TESTING_CHECKLIST.md)
- [ ] 9.6 Test comment functionality (requires running app - see TESTING_CHECKLIST.md)
- [ ] 9.7 Test like prediction functionality (requires running app - see TESTING_CHECKLIST.md)
- [ ] 9.8 Test share functionality (requires running app - see TESTING_CHECKLIST.md)
- [ ] 9.9 Test deep link navigation (requires running app - see TESTING_CHECKLIST.md)
- [ ] 9.10 Verify all API calls work with updated endpoints (requires backend deployment - see TESTING_CHECKLIST.md)
- [ ] 9.11 Verify translation keys are updated in UI (requires running app - see TESTING_CHECKLIST.md)

## 10. Backend Coordination
- [x] 10.1 Document required backend API changes:
  - [x] `/questions` → `/predictions`
  - [x] `/questions/:id` → `/predictions/:id`
  - [x] `/questions/:questionId/comments` → `/predictions/:predictionId/comments`
  - [x] Payload fields: `question_id` → `prediction_id`, `question_option_id` → `prediction_option_id`
  - [x] Response fields: `questionOptions` → `predictionOptions`, `questionForwardCount` → `predictionForwardCount`
- [x] 10.2 Create backend coordination document (`BACKEND_COORDINATION.md`)
- [x] 10.3 Create testing checklist document (`TESTING_CHECKLIST.md`)
- [ ] 10.4 Coordinate deployment timeline with backend team (requires team communication)

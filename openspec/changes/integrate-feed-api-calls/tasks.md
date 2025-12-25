## 1. Feed Page API Integration (Priority)

### 1.1 Prediction Submission
- [x] 1.1.1 Update `predictionService.service.ts` to add `submitPrediction` method using POST `/predictions` with FormData
- [x] 1.1.2 Update `PredictionDetail.tsx` to call the actual API instead of mock
- [x] 1.1.3 Handle file upload for prediction comments (if file is provided)
- [x] 1.1.4 Add proper error handling and loading states
- [x] 1.1.5 Refresh feed after successful prediction submission

### 1.2 Comment Service Implementation
- [x] 1.2.1 Create `src/services/commentService.service.ts` with methods:
  - `addComment(predictionId, text, file?, parentId?)` - POST `/comments`
  - `likeComment(commentId)` - POST `/comments/:commentId/like` or PUT
  - `getComments(predictionId)` - GET `/predictions/:predictionId/comments` (if needed)
- [x] 1.2.2 Add TypeScript types for comment requests/responses in `src/types/api.ts`

### 1.3 Comment Interactions
- [x] 1.3.1 Update `CommentSection.tsx` to use `commentService.likeComment` instead of mock
- [x] 1.3.2 Implement add comment functionality in `PredictionDetail.tsx` or `CommentSection.tsx`
- [x] 1.3.3 Implement reply to comment functionality
- [x] 1.3.4 Handle optimistic updates with proper error rollback
- [x] 1.3.5 Update comment counts after successful operations

### 1.4 Activity Logging
- [x] 1.4.1 Create `src/services/activityService.service.ts` with `logActivity(action, meta)` method
- [x] 1.4.2 Add activity logging for key user actions:
  - Feed view
  - Prediction submission
  - Comment addition
  - Comment like
- [x] 1.4.3 Include device-type and X-Platform headers as per Postman spec

## 2. User Profile Integration

### 2.1 Current User
- [x] 2.1.1 Update `userService.service.ts` to add `getCurrentUser()` method using GET `/me`
- [x] 2.1.2 Update `useProfile.ts` hook to use the new API method
- [x] 2.1.3 Handle authentication errors properly

### 2.2 Profile Editing
- [x] 2.2.1 Update `userService.service.ts` to add `editProfile(data)` method using PUT `/edit-profile`
- [x] 2.2.2 Update `ProfileView.tsx` to use the actual API
- [x] 2.2.3 Add form validation and error handling
- [x] 2.2.4 Update local state after successful profile update

## 3. API Client Enhancements

### 3.1 FormData Support
- [x] 3.1.1 Verify `apiClient.upload` method works correctly for FormData
- [x] 3.1.2 Add support for mixed form data (text + file) if needed
- [x] 3.1.3 Ensure proper Content-Type headers for multipart/form-data

### 3.2 Error Handling
- [x] 3.2.1 Review and improve error messages for all new API calls
- [x] 3.2.2 Add specific error handling for validation errors (400)
- [x] 3.2.3 Ensure proper error messages in Persian for user-facing errors

## 4. Testing & Validation

### 4.1 Integration Testing
- [ ] 4.1.1 Test prediction submission with and without files
- [ ] 4.1.2 Test comment like/unlike functionality
- [ ] 4.1.3 Test adding comments and replies
- [ ] 4.1.4 Test profile update functionality
- [ ] 4.1.5 Test error scenarios (network errors, validation errors, auth errors)

### 4.2 UI/UX Validation
- [ ] 4.2.1 Verify loading states are shown during API calls
- [ ] 4.2.2 Verify success/error toasts are displayed appropriately
- [ ] 4.2.3 Verify optimistic updates work correctly
- [ ] 4.2.4 Verify feed refreshes after mutations

## 5. Documentation

### 5.1 Backend API Documentation
- [ ] 5.1.1 Document required backend endpoints that are missing
- [ ] 5.1.2 Provide request/response examples for comment endpoints
- [ ] 5.1.3 Document expected error response formats

### 5.2 Code Documentation
- [x] 5.2.1 Add JSDoc comments to new service methods
- [ ] 5.2.2 Update README with API integration details

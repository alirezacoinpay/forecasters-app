## 1. API Integration
- [x] 1.1 Add `predictionId` parameter to `PredictionListParams` interface in `src/types/api.ts`
- [x] 1.2 Update `usePredictionFeed` hook to accept `predictionId` parameter
- [x] 1.3 Pass `predictionId` to API call in `predictionRepository.fetch()`
- [x] 1.4 Document backend API requirement: `question-feed` endpoint should accept `prediction_id` parameter and return predictions with the specified prediction at the top

## 2. URL Parsing
- [x] 2.1 Add URL parsing logic in `App.tsx` to extract prediction ID from query string
- [x] 2.2 Support URL format: `?prediction=123` or `?predictionId=123`
- [x] 2.3 Parse prediction ID on component mount
- [x] 2.4 Store prediction ID in state
- [x] 2.5 Clear prediction ID from URL after processing (optional, to clean URL)

## 3. Feed Integration
- [x] 3.1 Pass `predictionId` from App to FeedView
- [x] 3.2 Pass `predictionId` from FeedView to `usePredictionFeed` hook
- [x] 3.3 Ensure shared prediction appears at top of list (backend should handle this, but verify)
- [x] 3.4 Handle case where prediction ID is in the list but not at top (reorder if needed)

## 4. Topic Detection and Header Update
- [x] 4.1 Extract topic ID from the shared prediction after API response
- [x] 4.2 Update `selectedTopicId` in App when prediction is loaded
- [x] 4.3 Update Header to show correct topic after prediction loads
- [x] 4.4 Handle case where topic is not found in topics list
- [x] 4.5 Show loading state in header while topic is being determined

## 5. State Management
- [x] 5.1 Add state for prediction ID in App component
- [x] 5.2 Add state for deep link loading in FeedView
- [x] 5.3 Handle state transitions: initial -> loading -> loaded -> error (if needed)
- [x] 5.4 Clear deep link state after successful load (optional)

## 6. Error Handling
- [x] 6.1 Handle invalid prediction ID (not a number)
- [x] 6.2 Handle prediction not found (404 or empty response)
- [x] 6.3 Show appropriate error message to user
- [x] 6.4 Fallback to default feed if prediction not found
- [x] 6.5 Handle network errors gracefully

## 7. Loading States
- [x] 7.1 Show loading skeletons while fetching deep link prediction
- [x] 7.2 Show loading state in header while topic is being determined
- [x] 7.3 Prevent topic switching while deep link is loading
- [x] 7.4 Handle race conditions between topic loading and prediction loading

## 8. Edge Cases
- [x] 8.1 Handle case where prediction ID exists but prediction is not in response
- [x] 8.2 Handle case where multiple predictions have same ID (shouldn't happen, but handle)
- [x] 8.3 Handle case where topic from prediction doesn't exist in topics list
- [x] 8.4 Handle URL changes while app is running
- [x] 8.5 Handle browser back/forward navigation
- [x] 8.6 Handle case where user navigates away and comes back

## 9. UX Improvements
- [x] 9.1 Add smooth transition when topic updates in header
- [ ] 9.2 Highlight or scroll to shared prediction (optional enhancement)
- [ ] 9.3 Show toast notification when deep link prediction is loaded (optional)
- [x] 9.4 Ensure feed scrolls to top when deep link is loaded

## 10. Validation
- [ ] 10.1 Test deep link with valid prediction ID
- [ ] 10.2 Test deep link with invalid prediction ID
- [ ] 10.3 Test deep link with non-existent prediction ID
- [ ] 10.4 Test topic detection and header update
- [ ] 10.5 Test error handling scenarios
- [ ] 10.6 Test loading states
- [ ] 10.7 Test URL parsing with different formats
- [ ] 10.8 Test browser navigation (back/forward)
- [ ] 10.9 Test multiple deep links in sequence

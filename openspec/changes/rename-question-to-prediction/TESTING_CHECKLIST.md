# Testing Checklist: Question to Prediction Rename

## Pre-Testing Requirements

- [ ] Backend API endpoints have been updated to match new naming
- [ ] Backend is deployed to staging/test environment
- [ ] Frontend is built and deployed to test environment
- [ ] Test user account is available with appropriate permissions

## 1. Create Prediction Flow

### Test Case 1.1: Create Basic Prediction
- [ ] Navigate to create prediction page
- [ ] Fill in title, topic, and options
- [ ] Submit prediction
- [ ] Verify success message shows "Prediction published successfully" (not "Question published")
- [ ] Verify prediction appears in feed
- [ ] Verify API call was made to `/predictions` (not `/questions`)

### Test Case 1.2: Create Prediction with All Fields
- [ ] Create prediction with title, text, topic, options, tags, and start date
- [ ] Verify all data is saved correctly
- [ ] Verify prediction displays correctly in feed

### Test Case 1.3: Create Prediction Error Handling
- [ ] Attempt to create prediction with invalid data
- [ ] Verify error message shows "Error publishing prediction" (not "Error publishing question")
- [ ] Verify form validation works correctly

## 2. Comment Functionality

### Test Case 2.1: Add Root Comment
- [ ] Open a prediction detail
- [ ] Add a comment
- [ ] Verify comment is added successfully
- [ ] Verify API call was made with `prediction_id` (not `question_id`)
- [ ] Verify comment appears in comment section

### Test Case 2.2: Reply to Comment
- [ ] Click reply on an existing comment
- [ ] Add a reply
- [ ] Verify reply is added as child comment
- [ ] Verify API call includes `prediction_id` and `parent_id`

### Test Case 2.3: Add Comment with File
- [ ] Add a comment with an image attachment
- [ ] Verify file uploads successfully
- [ ] Verify comment displays with file attachment

### Test Case 2.4: Comment Error Handling
- [ ] Attempt to add comment without prediction ID
- [ ] Verify error message shows "Prediction ID not found" (not "Question ID not found")
- [ ] Verify error toast is displayed

### Test Case 2.5: Get Comments
- [ ] Open prediction with existing comments
- [ ] Verify comments load correctly
- [ ] Verify API call was made to `/predictions/:predictionId/comments` (not `/questions/:questionId/comments`)
- [ ] Verify comment data includes `prediction_id` field

## 3. Like Prediction Functionality

### Test Case 3.1: Like a Prediction
- [ ] Click like button on a prediction card
- [ ] Verify optimistic update (heart fills immediately)
- [ ] Verify like count increments
- [ ] Verify API call was made to `/prediction-likes/:predictionId/toggle`
- [ ] Verify activity is logged with `prediction_id` (not `question_id`)

### Test Case 3.2: Unlike a Prediction
- [ ] Click like button on an already-liked prediction
- [ ] Verify optimistic update (heart unfills immediately)
- [ ] Verify like count decrements
- [ ] Verify API response confirms unliked state

### Test Case 3.3: Like Error Handling
- [ ] Disconnect network
- [ ] Attempt to like a prediction
- [ ] Verify optimistic update is reverted
- [ ] Verify error toast is displayed

## 4. Share Functionality

### Test Case 4.1: Share via SMS
- [ ] Click share button on a prediction
- [ ] Enter phone number
- [ ] Send share link
- [ ] Verify API call was made with `prediction_id` (not `question_id`)
- [ ] Verify success message is displayed

### Test Case 4.2: Share Link Generation
- [ ] Click share button
- [ ] Copy share link
- [ ] Verify link format is correct
- [ ] Verify link contains prediction ID parameter

## 5. Deep Link Navigation

### Test Case 5.1: Open Shared Prediction Link
- [ ] Open a shared prediction link (e.g., `?prediction=123`)
- [ ] Verify prediction loads correctly
- [ ] Verify prediction appears at top of feed
- [ ] Verify API call includes `prediction_id` parameter
- [ ] Verify API call was made to `/prediction-feed` (not `/question-feed`)

### Test Case 5.2: Invalid Deep Link
- [ ] Open link with invalid prediction ID
- [ ] Verify error message is displayed
- [ ] Verify feed falls back to default behavior

## 6. Feed Display

### Test Case 6.1: Feed Loading
- [ ] Load feed page
- [ ] Verify predictions load correctly
- [ ] Verify API call was made to `/prediction-feed`
- [ ] Verify response includes `predictionOptions` (not `questionOptions`)
- [ ] Verify response includes `predictionForwardCount` (not `questionForwardCount`)

### Test Case 6.2: Prediction Card Display
- [ ] Verify prediction cards display correctly
- [ ] Verify forward count displays correctly (using `predictionForwardCount`)
- [ ] Verify all prediction data is displayed correctly

### Test Case 6.3: Prediction Options Display
- [ ] Open prediction detail
- [ ] Verify options display correctly
- [ ] Verify options include `prediction_id` field (not `question_id`)

## 7. Activity Logging

### Test Case 7.1: Prediction Submit Activity
- [ ] Submit a prediction
- [ ] Verify activity is logged with `prediction_id` and `prediction_option_id`
- [ ] Check backend logs to verify correct field names

### Test Case 7.2: Comment Activity
- [ ] Add a comment
- [ ] Verify activity is logged with `prediction_id`
- [ ] Check backend logs to verify correct field names

### Test Case 7.3: Like Activity
- [ ] Like a prediction
- [ ] Verify activity is logged with `prediction_id`
- [ ] Check backend logs to verify correct field names

## 8. Translation Keys

### Test Case 8.1: English Translations
- [ ] Verify all success messages use "prediction" terminology
- [ ] Verify all error messages use "prediction" terminology
- [ ] Check: "Prediction published successfully" (not "Question published")
- [ ] Check: "Error publishing prediction" (not "Error publishing question")
- [ ] Check: "Prediction ID not found" (not "Question ID not found")

### Test Case 8.2: Farsi Translations
- [ ] Switch to Farsi language
- [ ] Verify all messages use correct Farsi terminology
- [ ] Verify no "سوال" (question) references remain where "پیش‌بینی" (prediction) should be used

## 9. API Endpoint Verification

### Test Case 9.1: Verify All Endpoints
Use browser DevTools Network tab to verify:
- [ ] POST `/predictions` (create prediction)
- [ ] GET `/predictions/:id` (get prediction)
- [ ] PUT `/predictions/:id` (update prediction)
- [ ] POST `/predictions` with `prediction_option_id` (submit prediction)
- [ ] POST `/comments` with `prediction_id` (add comment)
- [ ] GET `/predictions/:predictionId/comments` (get comments)
- [ ] POST `/share/sms` with `prediction_id` (share)
- [ ] POST `/prediction-likes/:predictionId/toggle` (like prediction)
- [ ] GET `/prediction-feed` (get feed)

### Test Case 9.2: Verify Request Payloads
- [ ] All requests use `prediction_id` (not `question_id`)
- [ ] All requests use `prediction_option_id` (not `question_option_id`)

### Test Case 9.3: Verify Response Payloads
- [ ] All responses include `predictionOptions` (not `questionOptions`)
- [ ] All responses include `predictionForwardCount` (not `questionForwardCount`)
- [ ] All prediction options include `prediction_id` (not `question_id`)
- [ ] All comments include `prediction_id` (not `question_id`)

## 10. Regression Testing

### Test Case 10.1: Existing Functionality
- [ ] Verify all existing features still work
- [ ] Verify no functionality was broken by the rename
- [ ] Verify performance is not degraded

### Test Case 10.2: Edge Cases
- [ ] Test with empty predictions list
- [ ] Test with predictions that have no comments
- [ ] Test with predictions that have no options
- [ ] Test with very long prediction titles
- [ ] Test with special characters in prediction data

## 11. Browser Compatibility

### Test Case 11.1: Modern Browsers
- [ ] Test in Chrome (latest)
- [ ] Test in Firefox (latest)
- [ ] Test in Safari (latest)
- [ ] Test in Edge (latest)

### Test Case 11.2: Mobile Browsers
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Verify touch interactions work correctly

## 12. Performance Testing

### Test Case 12.1: Load Time
- [ ] Verify feed loads within acceptable time
- [ ] Verify prediction detail loads quickly
- [ ] Verify no performance regression

### Test Case 12.2: Network Efficiency
- [ ] Verify API calls are efficient
- [ ] Verify no unnecessary API calls are made
- [ ] Verify payload sizes are reasonable

## Notes

- All tests should be performed in a staging/test environment first
- Document any issues found during testing
- Coordinate with backend team if API issues are discovered
- Update this checklist if additional test cases are needed


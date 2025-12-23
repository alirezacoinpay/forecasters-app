# Prediction Deep Link Specification

## ADDED Requirements

### Requirement: URL Parameter Parsing
The system SHALL parse prediction ID from URL query parameters on app initialization.

#### Scenario: Parse prediction ID from query string
- **WHEN** the app loads
- **AND** the URL contains `?prediction=123` or `?predictionId=123`
- **THEN** the system extracts the prediction ID (123)
- **AND** the system stores it in state for use in API calls

#### Scenario: Handle missing prediction ID
- **WHEN** the app loads
- **AND** the URL does not contain a prediction parameter
- **THEN** the system proceeds with normal feed loading
- **AND** no prediction ID is passed to the API

#### Scenario: Handle invalid prediction ID
- **WHEN** the app loads
- **AND** the URL contains `?prediction=abc` (non-numeric)
- **THEN** the system ignores the invalid parameter
- **AND** the system proceeds with normal feed loading
- **AND** the system shows an error message (optional)

### Requirement: API Integration with Prediction ID
The system SHALL send the prediction ID to the question-feed API endpoint when a deep link is present.

#### Scenario: Send prediction ID to API
- **WHEN** a prediction ID is extracted from URL
- **THEN** the system includes `prediction_id` (or `predictionId`) in the API request parameters
- **AND** the API request is sent to `/question-feed` endpoint
- **AND** the prediction ID is included in the query parameters

#### Scenario: API response with prediction at top
- **WHEN** the API receives a prediction ID parameter
- **AND** the API responds successfully
- **THEN** the response includes predictions with the specified prediction at the top of the list
- **AND** the rest of the predictions follow below

### Requirement: Feed Display with Deep Link
The system SHALL display the shared prediction at the top of the feed when loaded from a deep link.

#### Scenario: Display shared prediction at top
- **WHEN** predictions are loaded with a deep link
- **AND** the API response includes the shared prediction
- **THEN** the shared prediction is displayed at the top of the feed
- **AND** the rest of the predictions are displayed below it
- **AND** the feed scrolls to the top to show the shared prediction

#### Scenario: Handle prediction not in response
- **WHEN** predictions are loaded with a deep link
- **AND** the API response does not include the shared prediction
- **THEN** the system shows the normal feed
- **AND** the system displays an error message indicating the prediction was not found
- **OR** the system falls back to default feed behavior

### Requirement: Topic Auto-Detection
The system SHALL automatically detect and set the topic from the shared prediction's data.

#### Scenario: Detect topic from prediction
- **WHEN** a prediction is loaded from a deep link
- **AND** the prediction data includes a `topic_id` or `topicId`
- **THEN** the system extracts the topic ID from the prediction
- **AND** the system updates the selected topic in the app state
- **AND** the header displays the correct topic name

#### Scenario: Update header with detected topic
- **WHEN** the topic is detected from the shared prediction
- **AND** the topic exists in the topics list
- **THEN** the header updates to show the topic name
- **AND** the topic dropdown reflects the selected topic
- **AND** the update happens smoothly without jarring transitions

#### Scenario: Handle topic not in topics list
- **WHEN** the topic is detected from the shared prediction
- **AND** the topic does not exist in the topics list
- **THEN** the system shows a default topic or "..." in the header
- **AND** the system logs a warning (in dev mode)
- **AND** the feed still displays correctly

### Requirement: Loading States
The system SHALL show appropriate loading states during deep link initialization.

#### Scenario: Show loading while fetching deep link
- **WHEN** a prediction ID is detected in the URL
- **AND** the API request is in progress
- **THEN** the system displays loading skeletons in the feed
- **AND** the header shows "..." or loading indicator for topic
- **AND** the user cannot switch topics during loading

#### Scenario: Show loading in header for topic
- **WHEN** predictions are loading from deep link
- **AND** the topic is not yet determined
- **THEN** the header shows "..." or a loading indicator
- **AND** the header updates once the topic is determined

### Requirement: Error Handling
The system SHALL handle errors gracefully when deep link prediction cannot be loaded.

#### Scenario: Handle prediction not found
- **WHEN** the API request completes
- **AND** the prediction ID does not exist or was deleted
- **THEN** the system shows an error message
- **AND** the system falls back to loading the default feed for the detected topic
- **OR** the system falls back to the default topic feed

#### Scenario: Handle network error
- **WHEN** the API request fails due to network error
- **THEN** the system shows an error toast notification
- **AND** the system allows the user to retry
- **AND** the system falls back to default feed if retry fails

#### Scenario: Handle invalid prediction ID
- **WHEN** the URL contains an invalid prediction ID
- **THEN** the system ignores the parameter
- **AND** the system proceeds with normal feed loading
- **AND** the system may show a warning (optional)

### Requirement: State Synchronization
The system SHALL properly synchronize state between URL, prediction ID, topic, and feed.

#### Scenario: Initialize state from URL
- **WHEN** the app loads with a deep link
- **THEN** the prediction ID is extracted and stored
- **AND** the topic state is initially undefined or set to default
- **AND** the feed loading is triggered with the prediction ID

#### Scenario: Update topic after prediction loads
- **WHEN** the prediction data is received from API
- **THEN** the topic ID is extracted from the prediction
- **AND** the selected topic state is updated
- **AND** the header reflects the new topic
- **AND** subsequent feed operations use the correct topic

#### Scenario: Clear deep link state after load
- **WHEN** the deep link prediction is successfully loaded
- **THEN** the system may optionally clear the prediction ID from URL (to clean URL)
- **AND** the system maintains the topic selection
- **AND** normal feed operations continue

### Requirement: URL Format Support
The system SHALL support multiple URL formats for prediction deep links.

#### Scenario: Support query parameter format
- **WHEN** the URL is `https://example.com?prediction=123`
- **THEN** the system extracts prediction ID 123
- **AND** the system processes the deep link

#### Scenario: Support alternative parameter name
- **WHEN** the URL is `https://example.com?predictionId=123`
- **THEN** the system extracts prediction ID 123
- **AND** the system processes the deep link

#### Scenario: Handle multiple query parameters
- **WHEN** the URL contains multiple parameters (e.g., `?prediction=123&other=value`)
- **THEN** the system extracts only the prediction ID
- **AND** other parameters are ignored (or handled separately if needed)

### Requirement: Browser Navigation Support
The system SHALL handle browser back/forward navigation with deep links.

#### Scenario: Handle browser back navigation
- **WHEN** user navigates back to a page with a deep link
- **THEN** the system re-parses the URL
- **AND** the system re-loads the deep link prediction if needed
- **AND** the system updates the feed accordingly

#### Scenario: Handle URL changes
- **WHEN** the URL changes while the app is running
- **AND** a new prediction ID is present
- **THEN** the system detects the change
- **AND** the system loads the new deep link prediction
- **AND** the system updates the feed

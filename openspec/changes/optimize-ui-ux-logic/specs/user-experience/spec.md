## ADDED Requirements

### Requirement: Loading States
The system SHALL display appropriate loading indicators during asynchronous operations.

#### Scenario: Feed loading
- **WHEN** the user opens the feed view
- **THEN** skeleton loaders are displayed for prediction cards
- **AND** the actual content replaces skeletons when data loads

#### Scenario: Prediction submission
- **WHEN** the user submits a prediction
- **THEN** a loading spinner is shown on the submit button
- **AND** the button is disabled during submission

### Requirement: Error Feedback
The system SHALL provide clear, actionable error messages to users.

#### Scenario: API error display
- **WHEN** an API request fails
- **THEN** a toast notification displays the error message
- **AND** the message is in Persian and user-friendly

#### Scenario: Network error
- **WHEN** a network error occurs
- **THEN** the user is informed with a retry option
- **AND** the error message explains the issue clearly

### Requirement: Success Feedback
The system SHALL confirm successful user actions.

#### Scenario: Prediction submitted
- **WHEN** a prediction is successfully submitted
- **THEN** a success toast notification appears
- **AND** the modal closes automatically

#### Scenario: Comment posted
- **WHEN** a comment is successfully posted
- **THEN** the comment appears immediately in the list
- **AND** a subtle success indicator is shown

### Requirement: Pull to Refresh
The system SHALL support pull-to-refresh gesture on the feed.

#### Scenario: Refresh feed
- **WHEN** the user pulls down on the feed
- **THEN** a refresh indicator appears
- **AND** the feed data is reloaded
- **AND** the indicator disappears when complete

### Requirement: Infinite Scroll
The system SHALL load more predictions as user scrolls.

#### Scenario: Load more predictions
- **WHEN** the user scrolls near the bottom of the feed
- **THEN** more predictions are automatically loaded
- **AND** a loading indicator shows during fetch
- **AND** new predictions are appended to the list

### Requirement: Optimistic Updates
The system SHALL provide immediate feedback for user actions.

#### Scenario: Like comment
- **WHEN** the user likes a comment
- **THEN** the like count updates immediately
- **AND** the API request is made in the background
- **AND** the UI reverts if the request fails

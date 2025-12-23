# Prediction Likes Specification

## ADDED Requirements

### Requirement: Prediction Like Button Display
The system SHALL display a like button with heart icon for each prediction in both the prediction card and detail view.

#### Scenario: Display like button in prediction card
- **WHEN** a prediction card is displayed
- **THEN** the system displays a like button in the actions section
- **AND** the button shows a heart icon
- **AND** the button displays the like count next to the icon
- **AND** the button uses the same styling as other action buttons (rounded-full, border-gray-300)

#### Scenario: Display like button in prediction detail
- **WHEN** the prediction detail bottom sheet is displayed
- **THEN** the system displays a like button in the header section
- **AND** the button shows a heart icon
- **AND** the button displays the like count
- **AND** the button is positioned near the user information

### Requirement: Like State Visualization
The system SHALL visually indicate when a prediction is liked by the current user.

#### Scenario: Display liked state
- **WHEN** a prediction is liked by the current user (indicated by backend `is_liked` parameter)
- **THEN** the heart icon is filled with red color
- **AND** the like count text is displayed in red color
- **AND** the visual state is consistent in both prediction card and detail view

#### Scenario: Display unliked state
- **WHEN** a prediction is not liked by the current user
- **THEN** the heart icon is outlined (not filled)
- **AND** the like count text is displayed in muted color
- **AND** the visual state is consistent in both prediction card and detail view

### Requirement: Like/Unlike Functionality
The system SHALL allow users to like and unlike predictions through API calls.

#### Scenario: Like a prediction
- **WHEN** user clicks the like button on an unliked prediction
- **THEN** the system immediately updates the UI to show liked state (optimistic update)
- **AND** the system increments the like count by 1
- **AND** the system sends POST request to `/questions/:id/like` endpoint
- **AND** if the API call succeeds, the system confirms the liked state
- **AND** if the API call fails, the system reverts to unliked state and shows error message

#### Scenario: Unlike a prediction
- **WHEN** user clicks the like button on a liked prediction
- **THEN** the system immediately updates the UI to show unliked state (optimistic update)
- **AND** the system decrements the like count by 1
- **AND** the system sends POST request to `/questions/:id/like` endpoint
- **AND** if the API call succeeds, the system confirms the unliked state
- **AND** if the API call fails, the system reverts to liked state and shows error message

#### Scenario: Prevent card click on like button
- **WHEN** user clicks the like button in a prediction card
- **THEN** the click event does not propagate to trigger the card's onClick handler
- **AND** only the like action is performed

### Requirement: Like Count Display
The system SHALL display the number of likes for each prediction.

#### Scenario: Display like count
- **WHEN** a prediction has likes
- **THEN** the system displays the like count using the `formatCount` utility
- **AND** the count is displayed next to the heart icon
- **AND** the count updates immediately when user likes/unlikes (optimistic update)
- **AND** the count is synchronized with backend response

#### Scenario: Display zero likes
- **WHEN** a prediction has no likes
- **THEN** the system displays "0" or equivalent
- **AND** the like button is still functional

### Requirement: API Integration
The system SHALL integrate with the backend API for like/unlike operations.

#### Scenario: Like API call
- **WHEN** user likes a prediction
- **THEN** the system sends POST request to `/questions/:id/like`
- **AND** the request includes the question ID in the URL
- **AND** the system receives response with `liked: boolean` and `likesCount: number`
- **AND** the system updates the prediction state with the response data

#### Scenario: API error handling
- **WHEN** the like/unlike API call fails
- **THEN** the system reverts the optimistic UI update
- **AND** the system displays an error toast notification
- **AND** the system maintains the previous like state

### Requirement: Activity Logging
The system SHALL log like/unlike activities for analytics.

#### Scenario: Log like activity
- **WHEN** user successfully likes a prediction
- **THEN** the system logs activity with action `prediction_like`
- **AND** the activity includes metadata: `question_id` and `liked: true`

#### Scenario: Log unlike activity
- **WHEN** user successfully unlikes a prediction
- **THEN** the system logs activity with action `prediction_like`
- **AND** the activity includes metadata: `question_id` and `liked: false`

### Requirement: Initial Like State
The system SHALL correctly initialize the like state based on backend data.

#### Scenario: Initialize liked state from backend
- **WHEN** prediction data is received from backend
- **AND** the backend includes `is_liked` (or similar) parameter set to true
- **THEN** the system displays the prediction as liked
- **AND** the heart icon is filled with red color

#### Scenario: Initialize unliked state from backend
- **WHEN** prediction data is received from backend
- **AND** the backend includes `is_liked` (or similar) parameter set to false or undefined
- **THEN** the system displays the prediction as unliked
- **AND** the heart icon is outlined

## ADDED Requirements

### Requirement: Comment Like API Integration
The system SHALL allow users to like and unlike comments through the backend API.

#### Scenario: Like a comment successfully
- **WHEN** user clicks the like button on a comment
- **THEN** the system immediately updates the UI optimistically (shows liked state and increments count)
- **AND** the system sends POST or PUT request to `/comments/:commentId/like`
- **AND** on success, the optimistic update is confirmed
- **AND** on error, the system reverts the optimistic update and shows an error toast

#### Scenario: Unlike a comment successfully
- **WHEN** user clicks the like button on an already-liked comment
- **THEN** the system immediately updates the UI optimistically (shows unliked state and decrements count)
- **AND** the system sends the appropriate API request to toggle the like state
- **AND** on success, the optimistic update is confirmed

#### Scenario: Comment like error handling
- **WHEN** comment like API call fails
- **THEN** the system reverts the optimistic UI update
- **AND** the system displays an error toast message
- **AND** the comment returns to its previous like state

### Requirement: Add Comment API Integration
The system SHALL allow users to add new comments to predictions through the backend API.

#### Scenario: Add comment successfully
- **WHEN** user types a comment and submits it
- **THEN** the system shows a loading state during submission
- **AND** the system sends POST request to `/comments` with `prediction_id`, `text`, and optional `file`
- **AND** on success, the new comment is added to the comment list
- **AND** the comment input is cleared
- **AND** the comment count is updated
- **AND** a success toast is displayed

#### Scenario: Add comment with file
- **WHEN** user adds a comment with an attached file
- **THEN** the system includes the file in the FormData request
- **AND** the system handles file upload progress
- **AND** on success, the comment is displayed with the file attachment

#### Scenario: Add comment error handling
- **WHEN** comment submission fails
- **THEN** the system displays an error toast
- **AND** the comment input retains the user's text for retry
- **AND** the system does not add the comment to the list

### Requirement: Reply to Comment API Integration
The system SHALL allow users to reply to existing comments through the backend API.

#### Scenario: Reply to comment successfully
- **WHEN** user clicks reply on a comment and submits a reply
- **THEN** the system sends POST request to `/comments` with `prediction_id`, `text`, `parent_id`, and optional `file`
- **AND** on success, the reply is added as a child comment
- **AND** the reply count is updated
- **AND** the reply input is cleared and hidden

#### Scenario: Reply to comment error handling
- **WHEN** reply submission fails
- **THEN** the system displays an error toast
- **AND** the reply input remains visible with the user's text for retry

## MODIFIED Requirements

### Requirement: Comment Display and Interaction
The system SHALL display comments for predictions and allow users to interact with them.

#### Scenario: Display comments with like counts
- **WHEN** prediction detail is opened
- **THEN** the system displays all comments with their like counts from the API
- **AND** the system shows which comments the current user has liked
- **AND** the system displays nested replies in a hierarchical structure

#### Scenario: Update comment counts after interaction
- **WHEN** user likes, adds, or replies to a comment
- **THEN** the system updates the relevant comment counts in the UI
- **AND** the system reflects the changes immediately through optimistic updates
- **AND** the system confirms updates after successful API response

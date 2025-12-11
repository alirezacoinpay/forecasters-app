## ADDED Requirements

### Requirement: Prediction Submission API Integration
The system SHALL submit user predictions to the backend API when a user selects an option and submits a prediction.

#### Scenario: Successful prediction submission
- **WHEN** user selects a prediction option and clicks submit
- **THEN** the system sends POST request to `/predictions` with FormData containing `question_option_id`, optional `comment[text]`, and optional `comment[file]`
- **AND** the system shows a loading indicator during the request
- **AND** on success, the system closes the prediction detail modal
- **AND** the system refreshes the feed to show updated prediction counts
- **AND** the system displays a success toast notification

#### Scenario: Prediction submission with file
- **WHEN** user submits a prediction with an attached file
- **THEN** the system includes the file in FormData as `comment[file]`
- **AND** the system uploads the file along with the prediction data
- **AND** the system handles file upload progress if needed

#### Scenario: Prediction submission error handling
- **WHEN** prediction submission fails due to network error
- **THEN** the system displays an error toast with appropriate message
- **AND** the prediction detail modal remains open
- **AND** the user can retry the submission

#### Scenario: Prediction submission validation error
- **WHEN** prediction submission fails due to validation error (400)
- **THEN** the system displays field-specific error messages if available
- **AND** the system keeps the modal open for user correction

### Requirement: Activity Logging
The system SHALL log user activities to the backend for analytics and tracking purposes.

#### Scenario: Log feed view activity
- **WHEN** user views the feed page
- **THEN** the system sends POST request to `/activity` with action `feed_view` and meta information
- **AND** the request includes `device-type` and `X-Platform` headers as specified

#### Scenario: Log prediction submission activity
- **WHEN** user successfully submits a prediction
- **THEN** the system logs the activity with action `prediction_submit` and relevant metadata

#### Scenario: Activity logging failure handling
- **WHEN** activity logging fails
- **THEN** the system continues normal operation without blocking the user
- **AND** the failure is logged silently for debugging

## MODIFIED Requirements

### Requirement: Feed Data Fetching
The system SHALL fetch prediction feed data from the backend API with proper pagination and filtering support.

#### Scenario: Fetch feed with pagination
- **WHEN** the feed page loads or user scrolls to load more
- **THEN** the system sends GET request to `/question-feed` with pagination parameters
- **AND** the system handles paginated response with meta information
- **AND** the system supports infinite scroll for loading additional pages

#### Scenario: Fetch feed with filters
- **WHEN** user applies search query or topic filter
- **THEN** the system includes `search` and `topic_id` parameters in the request
- **AND** the system refreshes the feed with filtered results

#### Scenario: Feed refresh after mutation
- **WHEN** user submits a prediction or performs other feed-affecting actions
- **THEN** the system automatically refreshes the feed to show updated data
- **AND** the system maintains scroll position when possible

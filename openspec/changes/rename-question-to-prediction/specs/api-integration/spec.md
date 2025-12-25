## ADDED Requirements

### Requirement: Prediction API Endpoints
The system SHALL use consistent "prediction" terminology in all API endpoints and payloads.

#### Scenario: Get prediction by ID
- **WHEN** the system requests a prediction by ID
- **THEN** the API request is sent to `/predictions/:id` endpoint
- **AND** the response contains prediction data with `predictionOptions` and `predictionForwardCount` fields

#### Scenario: Create prediction
- **WHEN** the system creates a new prediction
- **THEN** the API request is sent to `/predictions` endpoint
- **AND** the request payload uses `prediction_id` and `prediction_option_id` field names (where applicable)

#### Scenario: Get prediction comments
- **WHEN** the system requests comments for a prediction
- **THEN** the API request is sent to `/predictions/:predictionId/comments` endpoint
- **AND** the request uses `predictionId` parameter name

#### Scenario: Submit prediction option
- **WHEN** the system submits a prediction option selection
- **THEN** the API request payload includes `prediction_option_id` field
- **AND** the request is sent to `/predictions` endpoint

### Requirement: Prediction Data Model
The system SHALL use consistent "prediction" terminology in all data model properties and types.

#### Scenario: Prediction model properties
- **WHEN** the system processes prediction data
- **THEN** the model uses `predictionOptions` property (not `questionOptions`)
- **AND** the model uses `predictionForwardCount` property (not `questionForwardCount`)

#### Scenario: Prediction option model
- **WHEN** the system processes prediction option data
- **THEN** the option model uses `prediction_id` property (not `question_id`)

#### Scenario: Comment model
- **WHEN** the system processes comment data
- **THEN** the comment model uses `prediction_id` property (not `question_id`)

### Requirement: Prediction Service Methods
The system SHALL use consistent "prediction" terminology in all service method names and parameters.

#### Scenario: Create prediction method
- **WHEN** the system creates a prediction
- **THEN** the service method is named `createPrediction()` (not `createQuestion()`)
- **AND** the method accepts `CreatePredictionData` type (not `CreateQuestionData`)

#### Scenario: Like prediction method
- **WHEN** the system likes a prediction
- **THEN** the service method parameter is named `predictionId` (not `questionId`)

#### Scenario: Get comments method
- **WHEN** the system retrieves comments
- **THEN** the service method parameter is named `predictionId` (not `questionId`)


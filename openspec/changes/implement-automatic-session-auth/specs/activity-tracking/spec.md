## ADDED Requirements

### Requirement: Pre-Authentication Activity Tracking
The system SHALL track user activities from the very first session, even before users are aware they have been authenticated.

#### Scenario: Activity tracking before authentication
- **WHEN** a user performs an action before automatic authentication completes
- **THEN** the activity is logged with a temporary session identifier
- **AND** the activity data includes action type, metadata, device type, and platform
- **AND** the activity is stored in the backend with the temporary identifier
- **AND** no error is shown to the user if activity logging fails

#### Scenario: Activity association after authentication
- **WHEN** automatic authentication completes after activities have been logged
- **THEN** all activities logged with the temporary identifier are associated with the authenticated user
- **AND** the temporary identifier is replaced with the user ID
- **AND** activities are now tracked with the permanent user identifier

#### Scenario: Activity tracking after authentication
- **WHEN** a user performs an action after authentication
- **THEN** the activity is immediately logged with the user ID
- **AND** the activity includes all relevant metadata
- **AND** the activity is stored in the backend associated with the user

### Requirement: Activity Data Collection
The system SHALL collect comprehensive activity data including user actions, device information, and contextual metadata.

#### Scenario: Activity logging with metadata
- **WHEN** a user performs an action (e.g., view feed, submit prediction, like comment)
- **THEN** the activity is logged with the action name
- **AND** relevant metadata is included (e.g., page, question_id, comment_id)
- **AND** device type (mobile/desktop) is automatically detected and included
- **AND** platform information (web/android/ios) is included

#### Scenario: Activity logging failure handling
- **WHEN** activity logging fails due to network or server errors
- **THEN** the error is silently ignored
- **AND** the user action is not blocked or delayed
- **AND** the application continues to function normally
- **AND** in development mode, a warning is logged to the console

### Requirement: Activity Retention
The system SHALL retain pre-authentication activities for a configurable period to allow association with users after authentication.

#### Scenario: Pre-auth activity retention
- **WHEN** activities are logged before authentication
- **THEN** the activities are stored with a temporary session identifier
- **AND** the activities are retained for a minimum of 7 days
- **AND** after authentication, activities are associated with the user
- **AND** after association, the temporary identifier is removed

#### Scenario: Activity cleanup
- **WHEN** pre-authentication activities are older than the retention period
- **AND** they have not been associated with a user
- **THEN** the activities are cleaned up by a background process
- **AND** the cleanup does not affect user experience or performance

## MODIFIED Requirements

### Requirement: Activity Logging Service
The activity logging service SHALL work seamlessly both before and after user authentication, automatically associating activities with users when authentication occurs.

#### Scenario: Seamless activity tracking
- **WHEN** the activity service logs an activity
- **THEN** it checks if a user session exists
- **AND** if authenticated, logs with user ID
- **AND** if not authenticated, logs with temporary session ID
- **AND** the same API endpoint and method is used in both cases
- **AND** no code changes are needed in components using the activity service


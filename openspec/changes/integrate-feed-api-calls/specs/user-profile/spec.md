## ADDED Requirements

### Requirement: Current User Profile Fetching
The system SHALL fetch the current authenticated user's profile data from the backend API.

#### Scenario: Fetch current user on app load
- **WHEN** the application loads and user is authenticated
- **THEN** the system sends GET request to `/me` endpoint
- **AND** the system stores the user data in the application state
- **AND** the system displays user information in profile views

#### Scenario: Handle authentication error on profile fetch
- **WHEN** GET `/me` returns 401 Unauthorized
- **THEN** the system clears authentication tokens
- **AND** the system redirects user to login page
- **AND** the system displays appropriate error message

### Requirement: Profile Editing API Integration
The system SHALL allow users to edit their profile information through the backend API.

#### Scenario: Update profile successfully
- **WHEN** user edits profile information and submits
- **THEN** the system shows a loading state during submission
- **AND** the system sends PUT request to `/edit-profile` with updated data
- **AND** on success, the system updates local user state
- **AND** the system displays a success toast notification
- **AND** the profile view reflects the updated information

#### Scenario: Profile update validation error
- **WHEN** profile update fails due to validation error (400)
- **THEN** the system displays field-specific error messages if available
- **AND** the system keeps the form open for user correction
- **AND** the system highlights invalid fields

#### Scenario: Profile update network error
- **WHEN** profile update fails due to network error
- **THEN** the system displays an error toast with retry option
- **AND** the form retains user input for retry

## MODIFIED Requirements

### Requirement: User Profile Display
The system SHALL display user profile information and allow editing.

#### Scenario: Display current user profile
- **WHEN** user navigates to profile view
- **THEN** the system displays user information fetched from `/me` endpoint
- **AND** the system shows editable fields for username and other profile data
- **AND** the system handles loading and error states appropriately

#### Scenario: Profile data synchronization
- **WHEN** user updates profile information
- **THEN** the system immediately reflects changes in the UI after successful API response
- **AND** the system updates user data across all components that display user information

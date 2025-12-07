## ADDED Requirements

### Requirement: Loading Skeletons
The system SHALL display skeleton loaders that match the content structure.

#### Scenario: Prediction card skeleton
- **WHEN** predictions are loading
- **THEN** skeleton cards matching PredictionCard layout are shown
- **AND** skeletons animate with a shimmer effect

### Requirement: Empty States
The system SHALL display helpful empty states when no content is available.

#### Scenario: Empty feed
- **WHEN** the feed has no predictions
- **THEN** an empty state message is displayed
- **AND** a call-to-action button is shown to add first prediction

#### Scenario: No comments
- **WHEN** a prediction has no comments
- **THEN** an empty state encourages users to comment
- **AND** the state is visually distinct from loading

### Requirement: Smooth Animations
The system SHALL use smooth, performant animations for state changes.

#### Scenario: Sheet modal animation
- **WHEN** a prediction detail sheet opens
- **THEN** it animates smoothly from bottom
- **AND** the animation uses hardware acceleration
- **AND** the duration is between 200-300ms

#### Scenario: List item transitions
- **WHEN** new predictions are added to the feed
- **THEN** they fade in smoothly
- **AND** existing items shift down without jarring

### Requirement: Visual Feedback
The system SHALL provide visual feedback for all interactive elements.

#### Scenario: Button press feedback
- **WHEN** a user presses a button
- **THEN** visual feedback (scale/color change) is immediate
- **AND** the feedback is subtle and professional

#### Scenario: Card interaction
- **WHEN** a user taps a prediction card
- **THEN** a subtle highlight or scale effect occurs
- **AND** the sheet opens smoothly

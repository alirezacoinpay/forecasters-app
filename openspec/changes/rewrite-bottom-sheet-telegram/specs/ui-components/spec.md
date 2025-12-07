## MODIFIED Requirements

### Requirement: Prediction Detail Sheet
The system SHALL display prediction details in a bottom sheet that behaves like Telegram's sticker panel.

#### Scenario: Sheet opens smoothly
- **WHEN** user clicks a prediction card
- **THEN** bottom sheet animates in from bottom
- **AND** appears in half-expanded state
- **AND** can be immediately dragged or interacted with

#### Scenario: Interactive elements work
- **WHEN** user clicks buttons or interactive elements in sheet
- **THEN** clicks work normally without triggering drag
- **AND** drag threshold prevents accidental drags

#### Scenario: Content displays correctly
- **WHEN** sheet is in any state
- **THEN** all prediction content is visible and accessible
- **AND** content scrolls when fully expanded
- **AND** content adapts to sheet height

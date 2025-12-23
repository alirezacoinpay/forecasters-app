## MODIFIED Requirements

### Requirement: Share Bottom Sheet
The system SHALL display share options in a bottom sheet that matches PredictionDetail's behavior.

#### Scenario: Sheet opens smoothly
- **WHEN** user clicks share button
- **THEN** bottom sheet animates in from bottom with smooth transition
- **AND** appears in half-expanded state (60vh)
- **AND** backdrop fades in simultaneously
- **AND** can be immediately dragged or interacted with

#### Scenario: Three-state system
- **WHEN** user drags the sheet
- **THEN** sheet transitions between collapsed (30vh), half-expanded (60vh), and fully-expanded (85vh) states
- **AND** snaps to nearest state on release
- **AND** provides rubber band resistance at boundaries

#### Scenario: Drag to close
- **WHEN** user drags sheet down past 25vh threshold
- **OR** user drags with velocity greater than 0.5 px/ms downward
- **THEN** sheet closes smoothly
- **AND** backdrop fades out
- **AND** onClose callback is triggered

#### Scenario: Scroll-to-collapse
- **WHEN** sheet is fully expanded
- **AND** user is at top of content
- **AND** user scrolls down or drags down
- **THEN** sheet collapses instead of scrolling content
- **AND** transitions smoothly to half-expanded state

#### Scenario: Interactive elements work
- **WHEN** user clicks buttons, inputs, or other interactive elements in sheet
- **THEN** clicks work normally without triggering drag
- **AND** drag threshold prevents accidental drags
- **AND** content scrolling works when fully expanded

#### Scenario: Content displays correctly
- **WHEN** sheet is in any state
- **THEN** all share content is visible and accessible
- **AND** content scrolls when fully expanded and content exceeds viewport
- **AND** content adapts to sheet height appropriately

#### Scenario: Backdrop interaction
- **WHEN** user clicks backdrop
- **THEN** sheet closes smoothly
- **AND** onClose callback is triggered

## MODIFIED Requirements

### Requirement: Share Functionality
The system SHALL provide share functionality through the bottom sheet interface.

#### Scenario: Copy link
- **WHEN** user clicks copy button
- **THEN** share link is copied to clipboard
- **AND** success notification is shown
- **AND** sheet remains open

#### Scenario: Send to phone
- **WHEN** user enters phone number and clicks send
- **THEN** share link is sent to phone number
- **AND** success notification is shown
- **AND** phone input is cleared
- **AND** sheet closes after short delay

#### Scenario: Social media share
- **WHEN** user clicks social media button
- **THEN** appropriate share action is triggered
- **AND** sheet behavior matches other share actions

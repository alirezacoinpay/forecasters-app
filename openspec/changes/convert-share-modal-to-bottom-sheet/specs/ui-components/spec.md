# Share Bottom Sheet Specification

## MODIFIED Requirements

### Requirement: Share Interface
The system SHALL provide a bottom sheet interface for sharing predictions, replacing the previous modal dialog.

#### Scenario: Open share bottom sheet
- **WHEN** user clicks the forward button on a prediction card
- **THEN** the system displays a bottom sheet from the bottom of the screen
- **AND** the bottom sheet animates upward with smooth transition
- **AND** the bottom sheet opens at half-expanded height (60vh)
- **AND** a backdrop overlay appears behind the bottom sheet

#### Scenario: Bottom sheet drag handle
- **WHEN** the share bottom sheet is displayed
- **THEN** a drag handle indicator is shown at the top center
- **AND** the user can drag the handle to resize the bottom sheet
- **AND** the bottom sheet snaps to collapsed (30vh), half-expanded (60vh), or fully-expanded (85vh) positions

#### Scenario: Close bottom sheet
- **WHEN** user drags the bottom sheet below the close threshold (25vh)
- **OR** user clicks the close button in the header
- **OR** user clicks the backdrop overlay
- **THEN** the bottom sheet animates downward and closes
- **AND** the backdrop overlay fades out

#### Scenario: Share link section
- **WHEN** the share bottom sheet is displayed
- **THEN** a share link section is shown with a read-only input field containing the prediction URL
- **AND** a copy button is displayed next to the input
- **WHEN** user clicks the copy button
- **THEN** the link is copied to clipboard
- **AND** a success notification is shown

#### Scenario: Send to phone section
- **WHEN** the share bottom sheet is displayed
- **THEN** a phone number input field is shown
- **AND** a send button is displayed
- **WHEN** user enters a phone number and clicks send
- **THEN** the system sends the prediction link to that phone number
- **AND** a success notification is shown
- **AND** the input field is cleared

#### Scenario: Social media options
- **WHEN** the share bottom sheet is displayed
- **THEN** a grid of social media sharing options is shown
- **AND** options include Telegram, WhatsApp, Twitter, and Others
- **WHEN** user clicks a social media option
- **THEN** the system opens the appropriate sharing interface for that platform

#### Scenario: Scrollable content
- **WHEN** the bottom sheet content exceeds the viewport height
- **AND** the bottom sheet is fully expanded
- **THEN** the content area becomes scrollable
- **AND** dragging at the top of scrollable content allows collapsing the sheet
- **AND** dragging in the middle of scrollable content allows normal scrolling

#### Scenario: Bottom sheet states
- **WHEN** the bottom sheet is at collapsed state (30vh)
- **THEN** only the header and drag handle are visible
- **WHEN** the bottom sheet is at half-expanded state (60vh)
- **THEN** most content is visible without scrolling
- **WHEN** the bottom sheet is at fully-expanded state (85vh)
- **THEN** all content is visible and scrollable if needed

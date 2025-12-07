## ADDED Requirements

### Requirement: Three-State Bottom Sheet
The system SHALL support three distinct states for the bottom sheet component.

#### Scenario: State transitions
- **WHEN** the bottom sheet is opened
- **THEN** it appears in half-expanded state (75vh)
- **AND** can be dragged to collapsed (50vh) or fully-expanded (95vh) states

#### Scenario: State persistence
- **WHEN** user releases drag
- **THEN** sheet snaps to nearest state
- **AND** state is maintained until next interaction

### Requirement: Full-Surface Dragging
The system SHALL allow dragging from anywhere on the sheet surface, not just a handle.

#### Scenario: Drag from content area
- **WHEN** user starts dragging from anywhere on the sheet
- **THEN** the sheet responds to the drag gesture
- **AND** moves smoothly based on drag direction and distance

#### Scenario: Drag threshold
- **WHEN** user clicks but moves less than 5px
- **THEN** drag does not start
- **AND** normal click interactions (buttons, links) work normally

### Requirement: Scroll-to-Collapse
The system SHALL collapse the sheet when user scrolls down at the top boundary.

#### Scenario: Scroll at top collapses
- **WHEN** sheet is fully expanded
- **AND** content is scrolled to top
- **AND** user scrolls down (wheel or touch drag)
- **THEN** sheet collapses instead of scrolling content
- **AND** collapse is smooth and proportional to scroll amount

#### Scenario: Scroll when not at top
- **WHEN** sheet is fully expanded
- **AND** content is not at top
- **AND** user scrolls down
- **THEN** content scrolls normally
- **AND** sheet height remains unchanged

### Requirement: Drag-to-Expand
The system SHALL expand the sheet when user drags upward.

#### Scenario: Drag up expands
- **WHEN** user drags upward from any state
- **THEN** sheet expands smoothly
- **AND** reaches fully-expanded state
- **AND** then allows content scrolling

#### Scenario: Drag down collapses
- **WHEN** user drags downward
- **THEN** sheet collapses smoothly
- **AND** can transition between states or close

### Requirement: Velocity-Based Closing
The system SHALL close the sheet based on drag velocity.

#### Scenario: Fast drag closes
- **WHEN** user drags down with velocity > 0.5 px/ms
- **THEN** sheet closes immediately on release
- **AND** closing animation is smooth

#### Scenario: Slow drag snaps
- **WHEN** user drags down with velocity < 0.5 px/ms
- **THEN** sheet snaps to nearest state on release
- **AND** does not close unless below threshold height

### Requirement: Height Threshold Closing
The system SHALL close the sheet when dragged below a threshold.

#### Scenario: Drag below threshold
- **WHEN** sheet height is dragged below 30vh
- **THEN** sheet closes on release
- **AND** closing animation is smooth

### Requirement: Scroll Management
The system SHALL disable scrolling when sheet is between states.

#### Scenario: Scroll disabled between states
- **WHEN** sheet is not fully expanded
- **THEN** content scrolling is disabled
- **AND** all drag gestures affect sheet height

#### Scenario: Scroll enabled when expanded
- **WHEN** sheet reaches fully-expanded state
- **THEN** content scrolling is enabled
- **AND** scroll and drag gestures work together intelligently

### Requirement: Physics-Based Animations
The system SHALL use physics-based animations for natural feel.

#### Scenario: Rubber band resistance
- **WHEN** user drags beyond boundaries
- **THEN** resistance is applied (15% damping)
- **AND** feels natural and responsive

#### Scenario: Smooth transitions
- **WHEN** sheet transitions between states
- **THEN** uses cubic-bezier easing (0.32, 0.72, 0, 1)
- **AND** animation duration is 300ms
- **AND** no transitions occur during active drag
